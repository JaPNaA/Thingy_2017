const main = document.getElementById("main");
var width = 13,
    height = 5,
    obs = [],
    hold = false,
    er = false,
    I = {
        b: "&#9724;",
        w: "&#9723;"
    };

function div(e) {
    return e.appendChild(document.createElement("div"));
}

function copy(e) {
    var a = document.createElement("textarea");
    document.body.appendChild(a);
    a.value = e;
    a.select();
    document.execCommand("copy");
    document.body.removeChild(a);
}
function refresh(h) {
    if (h) {
        for (let i of obs) {
            for (let j of i) {
                i.splice(i.indexOf(j), 1);
                j.parentElement.removeChild(j);
            }
        }
    }
    for (let i = 0; i < height; i++) {
        let a = div(main),
            b = [];
        a.classList.add("line");
        for (let i = 0; i < width; i++) {
            let c = div(a);
            b.push(c);
            c.innerHTML = I.w;
            c.classList.add("block");
            c.addEventListener("mouseover", function() {
                if (!hold) return;
                if (er) {
                    this.innerHTML = I.w;
                } else {
                    this.innerHTML = I.b;
                }
            });
            c.addEventListener("mousedown", function() {
                this.innerHTML = I.b;
            });
        }
        obs.push(b);
    }
}

addEventListener("mousedown", function() {
    hold = true;
});
addEventListener("mouseup", function() {
    hold = false;
});
addEventListener("keydown", function(e) {
    if (e.keyCode == 67) {
        copy(document.body.innerText);
    }
    if (e.keyCode == 82) {
        for (let i of obs) {
            for (let j of i) {
                j.innerHTML = I.w;
            }
        }
    }
    if (e.keyCode == 87) {
        let a = prompt(
                "Please type your desired width and height seperated by a comma\nLike so: " +
                    width +
                    ", " +
                    height
            ),
            nw = null,
            nh = null;
        if (!a) return;
        a = a.split(",");
        if (a.length != 2) return;
        nw = parseInt(a[0]);
        nh = parseInt(a[1]);
        if (nw === NaN || nw === null || nh === NaN || nh === null) return;
        height = nh;
        width = nw;
        refresh(1);
    }
    er = true;
});
addEventListener("keyup", function() {
    er = false;
});

refresh();
