var key = [],
    ksI = [],
    keyT = [];
window.addEventListener('keydown', function (e) {
    e.preventDefault();
    key[e.keyCode] = true;
    if (keyT[e.keyCode]) {
        keyT[e.keyCode]++;
    } else {
        keyT[e.keyCode] = 1;
    }
    update();
});
window.addEventListener('keyup', function (e) {
    e.preventDefault();
    key[e.keyCode] = false;
    update();
});

function update() {
    innC = [];
    key.forEach(function (ob, dx) {
        if (ob) {
            $('td')[dx].classList = "true";
        } else if (($('td')[dx].classList == "true")) {
            $('td')[dx].classList = "cool";
            clearTimeout(ksI[dx]);
            ksI[dx] = setTimeout(function () {
                $('td')[dx].classList = "false";
                ksI[dx] = setTimeout(function () {
                    $('td')[dx].classList = "dry";
                }, 5e3)
            }, 1255);
        }
    });
}

function start() {
    document.body.innerHTML = "<table><tbody></tbody></table>";
    var a = $('tbody');
    for (var b = 0; b < 20; b++) {
        a.innerHTML += "<tr><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td><td>";
    }
    for (var b = 0; b < 400; b++) {
        $('td')[b].innerHTML = b;
        $('td')[b].classList = "never";
    }
}

function cool(e) {
    //setTimeout(function())
}

// In replacement for getElementById, getElementsByClassName, and getElementsByTagName
function $(e) {
    switch (e.substring(0, 1)) {
        case ".":
            var a = document.getElementsByClassName(e.substring(1, e.length));
            if (a.length === 1) {
                return a[0];
            } else if (a.length === 0) {
                return null;
            } else {
                return a;
            }
            break;
        case "#":
            return document.getElementById(e.substring(1, e.length));
            break;
        default:
            var a = document.getElementsByTagName(e);
            if (a.length === 1) {
                return a[0];
            } else if (a.length === 0) {
                return null;
            } else {
                return a;
            }
            break;
    }
}

start();
document.onreadystatechange = function () {
    setTimeout(function () {
        $('div').parentElement.removeChild($('div'));
    }, 100);
}