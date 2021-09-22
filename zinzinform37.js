// ==UserScript==
// @name         ZinZinForm37
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Spam a ZinZin Form
// @author       maigre
// @match        https://docs.google.com/forms/*
// @grant        none
// ==/UserScript==

var formZ = ['1FAIpQLSe7EvWAtRQIWpDHN-CuzRGXIdX7wZLW9CwtcZqsBctUviLe4w',
             '1FAIpQLSee7EuBZDafS8XozgIvLz4CUT3Znhpcj-_JOLl328AbgVjAow'];


(function() {
    var formSelect = -1
    var lastRadio = -1
    var skipper = []


    for (var z=0; z<formZ.length; z++) {
        console.log(formZ[z], window.location.pathname.indexOf(formZ[z]))
        if(window.location.pathname.indexOf(formZ[z]) > 0) formSelect = z
    }

    if (formSelect >= 0) console.log('FORM', formZ[z])
    else {
        console.log('NO FORM')
        return
    }

    // RUN
    window.addEventListener('load', function() {
        if (window.location.pathname.indexOf('/forms/d') === 0) { // If we're on the form page

            var index = 0;
            var formItems = document.querySelectorAll('.freebirdFormviewerViewNumberedItemContainer');
            console.log('Fields detected:', formItems.length)

            // RESTART
            if (formItems.length == 0) {
                console.log('DONE!')
                setTimeout(
                    () => { window.location.href = 'https://docs.google.com/forms/d/e/'+formZ[formSelect]+'/viewform' },
                    300
                )

                let x = localStorage.getItem('myCat');
                if (x > 0) localStorage.setItem('myCat', x-1);
                else localStorage.setItem('myCat', 0);
            }

            // CONFIRM SEND
            else if (formItems.length == 1) {
                console.log('CONFIRM!')
                setTimeout(
                    () => {document.querySelector(".freebirdFormviewerViewNavigationSubmitButton .exportButtonContent").click()},
                    300
                )
            }

            // AUTO-FILL
            else {
                let x = localStorage.getItem('myCat');
                console.log(x)

                while (x == '' || x == 0 || x == 'NaN') {
                    var iter = prompt("How many loops ?")
                    console.log(iter)
                    if (iter === null) break
                    localStorage.setItem('myCat', parseInt(iter));
                    x = localStorage.getItem('myCat');
                }

                if (x > 0) {
                    console.log('iter', x)
                    setTimeout( submitRandomForm, 1000)
                }
            }



        } else if (window.location.pathname.indexOf('/forms/u') === 0) { // If we're on the "submitted" page
            //window.location.href = formUrl;
        }

        function randomRadio(radios) {
            var radioIndex = Math.floor(Math.random() * radios.length)
            lastRadio = radioIndex
            radios[radioIndex].click()
        }

        function randomCheckbox(checkboxes) {
            for(var k=0; k<checkboxes.length; k++) if (Math.random() < 0.5) checkboxes[k].click()
        }


        function submitRandomForm() {

            var item = formItems[index];
            var name = item.querySelectorAll('input[type="hidden"]')[0].getAttribute("name");
            console.log('FIELD', item, name)
            var processed = 0

            // NAME

            // SKIPME ?
            if (skipper.includes(name)) {
                console.warn('--skipped--')
                nextElement()
                return
            }

            // RADIO
            var radios = item.querySelectorAll(".freebirdFormviewerComponentsQuestionRadioRadio")
            if (radios.length > 0) {
                console.log('radio')
                randomRadio(radios)
                processed += 1
            }

            // CHECKBOX
            var checkboxes = item.querySelectorAll(".appsMaterialWizTogglePapercheckboxCheckbox")
            if (checkboxes.length > 0) {
                console.log('checkbox')
                randomCheckbox(checkboxes)
                processed += 1
            }

            // GRID
            var grid = item.querySelectorAll(".freebirdFormviewerComponentsQuestionGridRowGroup")
            if (grid.length > 0) {
                console.log('grid')

                for (var j=0; j<grid.length; j++) {
                    // RADIO
                    var gradios = grid[j].querySelectorAll(".appsMaterialWizToggleRadiogroupRadioButtonContainer")
                    if (gradios.length > 0) {
                        console.log('grid-radio', gradios.length)
                        randomRadio(gradios)
                        processed += 1
                    }

                    // CHECKBOX
                    var gcheckboxes = grid[j].querySelectorAll(".appsMaterialWizToggleCheckboxgroupCheckboxButtonContainer")
                    if (gcheckboxes.length > 0) {
                        console.log('grid-checkbox', gcheckboxes.length)
                        randomCheckbox(gcheckboxes)
                        processed += 1
                    }

                }

            }

            // UNPROCESSED
            if (processed == 0) {
                console.warn('field not detected:', item)
            }

            // SPECIAL CASE:
            if (formSelect == 0)
                if (name == 'entry.441718805_sentinel') {
                    console.warn('special field detected')
                    if (lastRadio == 0) skipper.push('entry.565732120_sentinel')
                    else skipper.push('entry.1653251487_sentinel')
                }

            // SPECIAL CASE:
            if (formSelect == 1)
                if (name == 'entry.441718805_sentinel') {
                    console.warn('special field detected')
                    if (lastRadio == 0) skipper.push('entry.1136213635_sentinel')
                    else skipper.push('entry.20433916_sentinel')
                }


            nextElement()
            // Submit

        }

        function nextElement() {
            console.log('----------')
            index = index+1
            if (index < formItems.length) setTimeout( submitRandomForm, 100)

            // Submit
            else {
                if (formSelect == 0) setTimeout(() => {document.querySelector(".freebirdFormviewerViewNavigationSubmitButton").click()}, 300)
                if (formSelect == 1) setTimeout(() => {document.querySelector(".freebirdFormviewerViewNavigationNoSubmitButton .exportButtonContent").click()}, 300)
            }
        }
    });
})();
