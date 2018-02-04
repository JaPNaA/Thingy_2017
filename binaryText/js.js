const dt = { // settings
        space: true,
        theme: false,
        xss: false,
        cookies: true,
        auto: true,
        at: "",
        update: function(e, f) { // update settings
            switch (e) {
                case "space":
                    dt.space = f;
                    kdEvent(1,1);
                    break;
                case "theme":
                    dt.theme = f;
                    document.getElementById("dark").href = dt.theme
                        ? "dark.css"
                        : "";
                    break;
                case "xss":
                    dt.xss = f;
                    kdEvent(1,1);
                    break;
                case "cookies":
                    dt.cookies = f;
                    if (!f) {
                        localStorage.binarytext = "";
                        delete localStorage.binarytext;
                    }
                    break;
                case "auto":
                    dt.auto = f;
                    break;
            }
            if (dt.cookies) {
                try {
                    localStorage.binarytext = [
                        dt.space ? "1" : "",
                        dt.theme ? "1" : "",
                        dt.xss ? "1" : "",
                        dt.cookies ? "1" : "",
                        dt.auto ? "1": ""
                    ].join(",");
                } catch (e) {
                    dt.cookies = false;
                }
            }
        }
    },
    inp = document.getElementById("in"), // for stability reasons
    out = document.getElementById("out"),
    settingsB = document.getElementById("settings"),
    ev = document.getElementById("ev");

(function() {
    if (localStorage.binarytext) { // read cookies to restore settings
        var a = localStorage.binarytext.split(",");
        dt.update("space", !!a[0]);
        dt.update("theme", !!a[1]);
        dt.update("xss", !!a[2]);
        dt.update("cookies", !!a[3]);
        dt.update("auto", !!a[4]);
    } else {
        dt.update("theme", false);
    }
})();

String.prototype.len = function(e) { // make string a certain length
    var a = this;
    while (a.length < e) {
        a = "0" + a;
    }
    return a.substr(0, e);
};

function charToBin(e) { // character to binary string with length 8
    return e
        .charCodeAt()
        .toString(2)
        .len(8);
}

function strToBin(e) { // pass each char from string through charToBin
    var f = [];
    e.split("").forEach(function(e) {
        f.push(charToBin(e));
    });
    return f.join(dt.space ? " " : "");
}

function binToChar(e) { // binary string to character
    return String.fromCharCode(parseInt(e, 2));
}

function binStrToChar(e) { // split binary string, convert to string
    var a = e.replace(/[^10]/g, ""),
        n = 0,
        t = 0,
        f = [],
        g = "",
        b = a.split("");
    for (let i of b) {
        if (n++ % 8) {
            continue;
        } else {
            t++;
            f.push(a.substring(t * 8, n));
        }
    }
    for (let i of f) {
        g += binToChar(i);
    }
    return g;
}

function guessType(e) { // guess type (binary/text) in in input area
    var a = e.match(/^((1|0)+(\s+)?)+/);
    if (a && a[0].length > 7) {
        return 1;
    } else {
        return 0;
    }
}

function kdEvent(z, y) { // keyboard event handler
    var lb = false;
    if (!inp.value) { // if value is empty
        out.innerHTML = "<span class=grey>OUTPUT</span>";
        out.classList.add("bin");
        return;
    }

    if(ev.scrollTop + innerHeight >= ev.scrollHeight) lb = true; // check if scroll is at bottom

    if (guessType(inp.value)) { // respond according to type
        let q = binStrToChar(inp.value);
        if(q == dt.at && !y) return;
        dt.at = q;
        if(!dt.xss){
            q = q.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
        }
        out.innerHTML = q;
        out.classList.remove("bin");
    } else {
        out.innerHTML = dt.at = strToBin(inp.value);
        out.classList.add("bin");
    }

    if(ev.scrollHeight > innerHeight){ // move settings icon if scrollbar appears
        settings.style.right = "32px";
    } else {
        settings.style.right = "";
    }

    if(lb){ // if scroll was at bottom, scroll to bottom
        ev.scrollTop = ev.scrollHeight - innerHeight;
    }
}
function kdEventa() { // check auto before continuing
    if (dt.auto) kdEvent();
}

function copyText(e) { // copy parameter to clipboard
    if (e == "<span class=grey>OUTPUT</span>") return false;
    var a = document.createElement("textarea"),
        b = false;
    try {
        a.value = e;
        document.body.appendChild(a);
        a.select();
        b = document.execCommand("copy");
        document.body.removeChild(a);
    } catch (e) {}
    return b;
}

function prompta(e) { // create a prompt
    var a = document.createElement("div");
    a.innerHTML = e;
    a.close = function() {
        this.classList.remove("lprompta");
        this.style.transform = "scale(0.5)";
        this.style.opacity = 0;
        var that = this;
        setTimeout(function() {
            document.body.removeChild(that);
        }, 150);
    };
    setTimeout(function() {
        a.classList.add("lprompta");
        a.classList.remove("aprompta");
    }, 400);
    a.classList.add("prompta");
    a.classList.add("aprompta");
    document.body.appendChild(a);
    a.style.top = (innerHeight - a.clientHeight) / 2 + "px";
    a.style.left = (innerWidth - a.clientWidth) / 2 + "px";
    return {
        on: function(e, f, g) {
            var that = this.that,
                a = that.querySelector(`[i="` + e + `"]`);
            a.addEventListener(f, g);
            return this;
        },
        eval: function(e) {
            e(this.that);
            return this;
        },
        that: a
    };
}

// register event handlers
inp.addEventListener("keydown", kdEventa);
inp.addEventListener("keyup", kdEventa);
inp.addEventListener("change", kdEvent);

out.addEventListener("dblclick", function() { // double-click to copy
    if (copyText(dt.at)) {
        prompta("Copied!").eval(function(e){
            var that = e;
            setTimeout(function(){
                console.log("c");
                that.close();
            }, 700);
        });
    } else {
        prompta("Failed to copy");
    }
});

settingsB.addEventListener("click", function() { // settings button
    if (document.getElementsByClassName("prompta").length) return;
    prompta(`
        <h2> Settings </h2>
        <div class=check i="1"> <input type=checkbox i="3"> Use spaces in binary encode </div>
        <div class=check i="2"> <input type=checkbox i="4"> Dark theme </div>
        <div class=check i="5"> <input type=checkbox i="6"> Allow XSS </div>
        <div class=check i="9"> <input type=checkbox i="10"> Auto-convert </div>
        <div class=check i="7"> <input type=checkbox i="8"> Cookies </div>
        `) // html code for settings pannel
        .eval(function(e) { // make checkboxes checked
            e.querySelector("[i='3']").checked = dt.space;
            e.querySelector("[i='4']").checked = dt.theme;
            e.querySelector("[i='6']").checked = dt.xss;
            e.querySelector("[i='8']").checked = dt.cookies;
            e.querySelector("[i='10']").checked = dt.auto;
            e.addEventListener("dblclick", function(){
                this.close();
            });
        })
        .on(1, "click", function() { // register event handlers
            dt.update(
                "space",
                (this.children[0].checked = !this.children[0].checked)
            );
        })
        .on(2, "click", function() {
            dt.update(
                "theme",
                (this.children[0].checked = !this.children[0].checked)
            );
        })
        .on(5, "click", function() {
            dt.update(
                "xss",
                (this.children[0].checked = !this.children[0].checked)
            );
        })
        .on(7, "click", function() {
            dt.update(
                "cookies",
                (this.children[0].checked = !this.children[0].checked)
            );
        })
        .on(9, "click", function() {
            dt.update(
                "auto",
                (this.children[0].checked = !this.children[0].checked)
            );
        });
});

// close prompta
document.getElementById("ev").addEventListener("click", function() {
    var a = document.getElementsByClassName("lprompta");
    if (a.length) {
        a[0].close();
    }
});

inp.focus();
