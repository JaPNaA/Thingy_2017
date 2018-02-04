var dt = [
        ["s", "789456123"],
        ["z", "89456123"],
        ["b", "78945123"],
        ["g", "78456123"],
        ["m", "78945613"],
        ["w", "79456123"],
        ["n", "78945612"],
        ["o", "78946123"],
        ["c", "7894123"],
        ["h", "7945613"],
        ["u", "7946123"],
        ["i", "7895123"],
        ["a", "845613"],
        ["d", "784612"],
        ["e", "784512"],
        ["j", "789512"],
        ["k", "794513"],
        ["r", "784513"],
        ["f", "78451"],
        ["p", "78941"],
        ["q", "78453"],
        ["t", "78952"],
        ["v", "79462"],
        ["x", "79413"],
        ["l", "7412"],
        ["y", "7952"],
        ["\n", "15"],
        [" ", "00"],
        [".", "01"],
        [",", "02"],
        ["!", "03"],
        ["?", "04"]
    ],
    nm = [
        ["0", "A"],
        ["1", "B"],
        ["2", "C"],
        ["3", "D"],
        ["4", "E"],
        ["5", "F"],
        ["6", "G"],
        ["7", "H"],
        ["8", "I"],
        ["9", "J"]
    ];

function encode(e) {
    var f = e.toLowerCase();
    nm.forEach(function(o) {
        f = f.split(o[0]).join(o[1]);
    });
    dt.forEach(function(o) {
        f = f.split(o[0]).join(o[1]);
    });
    return f;
}

function decode(e) {
    var f = e;
    dt.forEach(function(o) {
        f = f.split(o[1]).join(o[0]);
    });
    nm.forEach(function(o) {
        f = f.split(o[1]).join(o[0]);
    });
    return f.toUpperCase();
}

document.getElementById("en").addEventListener("click", function() {
    document.getElementById("in").value = encode(document.getElementById(
        "in").value);
}, false);
document.getElementById("de").addEventListener("click", function() {
    document.getElementById("in").value = decode(document.getElementById(
        "in").value);
}, false);
