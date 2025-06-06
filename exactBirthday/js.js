const DT = {
    birthday: 0,
    localStorageKey: "exactBirthday"
};
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * replaces requestAnimationFrame if required
 */
function requestAnimationFramePolyfill() {
    window.requestAnimationFrame = 
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame || 
        function(cb) {
            setTimeout(cb, 33.333);
        };
}

function settings() {
    var settingsMouseout_sI = -1;
    const $settings = document.getElementById("settings"),
        $change = document.getElementById("change"),
        $dark = document.getElementById("dark"),
        $big = document.getElementById("big"),
        $time = document.getElementById("time"),
        $darkCSS = document.getElementById("darkCSS"),
        $container = document.getElementById("main").children[0];

    /**
     * toggles .show to #settings when clicked
     * @param {Event} e event
     */
    function settingsClick(e) {
        if (e.target === this) {
            this.classList.toggle("show");
        }
    }

    /**
     * removes show from setting's classlist
     */
    function settingsClasslistRemoveShow() {
        $settings.classList.remove("show");
    }

    /**
     * auto-hides the settings button after 3 seconds
     */
    function settingsMouseout() {
        clearTimeout(settingsMouseout_sI);
        settingsMouseout_sI = setTimeout(settingsClasslistRemoveShow, 3000);
    }

    /**
     * cancels timeout
     */
    function settingsMouseover() {
        clearTimeout(settingsMouseout_sI);
    }

    /**
     * clears localstorage and reloads page
     */
    function changeBirthday() {
        localStorage.removeItem(DT.localStorageKey);
        location.reload(false);
    }

    /**
     * adds or removes dark.css link
     */
    function changeDark() {
        if (this.checked) {
            $darkCSS.href = $darkCSS.dataset.href;
        } else {
            $darkCSS.removeAttribute("href");
        }
    }

    /**
     * makes text big or normal
     */
    function changeBig() {
        if (this.checked) {
            $container.style.fontSize = "2em";
        } else {
            $container.style.fontSize = "1em";
        }
    }

    /**
     * update birthday to include time of birth
     */
    function changeTime() {
        var currdate = new Date(DT.birthday),
            value = this.valueAsDate;

        if (value) {
            currdate.setHours(value.getHours(), value.getMinutes());
        } else {
            currdate.setHours(0, 0);
        }


        DT.birthday = currdate.getTime();
        writeLocalStorage(DT.birthday);
    }

    // add event listeners
    // -----------------------------------------------------------------------------
    $settings.addEventListener("click", settingsClick);
    $settings.addEventListener("mouseout", settingsMouseout);
    $settings.addEventListener("mouseover", settingsMouseover);

    $change.addEventListener("click", changeBirthday);
    $dark.addEventListener("change", changeDark);
    $big.addEventListener("change", changeBig);
    $time.addEventListener("change", changeTime);

    // set values
    // -----------------------------------------------------------------------------
    $time.valueAsDate = new Date(DT.birthday);
}

function initCounter() {
    const $main = document.getElementById("main"),
        $exactAge = document.getElementById("exactAge");

    requestAnimationFramePolyfill();
    
    /**
     * updates exactage on every frame rendered
     */
    function renFrame() {
        const now = Date.now();

        // 31556952000 seems to be the accecpted number of milliseconds per year.
        $exactAge.innerText = ((now - DT.birthday) / 31556952000).toPrecision(16);

        requestAnimationFrame(renFrame);
    }

    /**
     * selects text within $exactAge
     */
    function selectExactAge() {
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText($exactAge);

            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection(),
                range = document.createRange();

            range.selectNodeContents($exactAge);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }

    $exactAge.addEventListener("dblclick", selectExactAge);

    renFrame();
    settings();
}

/**
 * handles everything when requesting for the user's birthday
 * @param {boolean} [justRemove=false] just remove the element
 */
function handleNewElm(justRemove) {
    // start menu
    const $submit = document.getElementById("submit"),
        $yearInp = document.getElementById("yearInp"),
        $monthInp = document.getElementById("monthInp"),
        $dayInp = document.getElementById("dayInp"),
        $inputContainer = document.getElementById("inputcontainer"),
        $new = document.getElementById("new");

    /**
     * gets amount of days in a month
     * @param {number} year year
     * @param {number} month month 1 - 12
     * @returns {number} days in month
     */
    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * checks if month matches an element in MONTHS
     * @param {string} month month
     * @returns {boolean|number} returns if there is a match, if so, returns the index + 1
     */
    function monthMatch(month) {
        if (month.length < 3) return false;

        const ML = MONTHS.length;
        for (let i = 0; i < ML; i++) {
            const m = MONTHS[i];

            if (
                month.toLowerCase().startsWith(m)
            ) {
                return i + 1;
            }
        }

        return false;
    }

    /**
     * Checks values of $yearInp, $monthInp, and $dayInp; also adds 'invalid' class if required
     * @returns {boolean} If all values are valid
     */
    function checkInputs() {
        var year = parseInt($yearInp.value),
            month = parseInt($monthInp.value),
            day = parseInt($dayInp.value),
            valid = true;
        
        if (
            year &&
            year >= 100 &&
            year <= new Date().getFullYear() + 1000 // allow user to be born 1000 years in the future
        ) {
            $yearInp.classList.remove("invalid");
        } else {
            $yearInp.classList.add("invalid");
            valid = false;
        }

        let monthMatched = monthMatch($monthInp.value);
        if (
            month &&
            month <= 12 &&
            month >= 0
        ) {
            $monthInp.classList.remove("invalid");
        } else if (monthMatched) {
            $monthInp.classList.remove("invalid");
            $monthInp.value = monthMatched;
            month = monthMatch;
        } else {
            $monthInp.classList.add("invalid");
            valid = false;
        }

        if (
            day &&
            day <= 31 &&
            day >= 1
        ) {
            if (valid) { // at this point, valid is only true if both month and year are valid
                // can proceed with **more accurate testing**
                if (day > getDaysInMonth(year, month)) {
                    $dayInp.classList.add("invalid");
                    valid = false;
                } else {
                    $dayInp.classList.remove("invalid");
                }
            } else {
                $dayInp.classList.remove("invalid");
            }
        } else {
            $dayInp.classList.add("invalid");
            valid = false;
        }

        return valid;
    }

    function close$new() {
        $new.classList.add("hide");

        setTimeout(function() {
            $new.classList.add("nonexistant");
        }, 600); // 100ms after the animation ends
    }

    function submitClick() {
        if (checkInputs()) {
            // if everything is right,

            $inputContainer.classList.remove("invalid");
            close$new();
            
            DT.birthday = new Date($yearInp.value, $monthInp.value, $dayInp.value).getTime();
            writeLocalStorage(DT.birthday);

            initCounter();
        } else {
            $inputContainer.classList.add("invalid");
        }
    }

    function registerEventListeners() {
        $submit.addEventListener("click", submitClick);

        $inputContainer.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                if (e.target.nextElementSibling) {
                    if (e.target.nextElementSibling.value) {
                        submitClick();
                    } else {
                        e.target.nextElementSibling.focus();
                        e.target.nextElementSibling.select();
                    }
                } else {
                    submitClick();
                }
            }
        });
    }

    if (justRemove) {
        close$new();
    } else {
        registerEventListeners();
        $yearInp.focus();
    }

}

/**
 * checks localStorage to see if user has already entered birthday, also does localStorage management
 * @returns {boolean} if already has user's birthday
 */
function localStorageCheck() {
    const key = DT.localStorageKey,
        stored = localStorage[key];

    if (stored) { // checks if stored
        if (stored.match(/[^\d]/)) {
            localStorage.removeItem(key);
            return false;
        }

        let parsed = parseInt(stored);

        if (isNaN(parsed)) { // cannot parse localStorage
            localStorage.removeItem(key); // remove
            return false;
        } else {
            DT.birthday = parsed; // set
            return true;
        }
    }
    return false;
}

/**
 * writes value to localstorage
 * @param {any} e toString() to write to localstorage
 */
function writeLocalStorage(e) {
    const key = DT.localStorageKey;
    localStorage[key] = e;
}

function main() {
    if (localStorageCheck()) {
        initCounter();
        handleNewElm(true);
    } else {
        handleNewElm();
    }
}

main();