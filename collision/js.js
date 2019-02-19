var c = document.getElementById("can"),
    x = c.getContext("2d"),
    obs = [],
    p = {
        x: 50,
        y: 50,
        color: "#FF0000",
        id: "P"
    },
    t = {
        x: null,
        y: null,
        dx: 0,
        dy: 0
    },
    SQRT2 = Math.sqrt(2);

(onresize = function() {
    c.width = innerWidth;
    c.height = innerHeight;
})();

addEventListener("keydown", function(e) {
    switch (e.keyCode) {
        case 38:
        case 87:
            t.dy = -1;
            break;
        case 37:
        case 65:
            t.dx = -1;
            break;
        case 40:
        case 83:
            t.dy = 1;
            break;
        case 39:
        case 68:
            t.dx = 1;
            break;
    }
}, false);

addEventListener("keyup", function(e) {
    switch (e.keyCode) {
        case 38:
        case 40:
        case 83:
        case 87:
            t.dy = 0;
            break;
        case 37:
        case 39:
        case 65:
        case 68:
            t.dx = 0;
            break;
    }
}, false);

addEventListener("blur", function() {
    t.dy = t.dx = 0;
}, false);

addEventListener("context-menu", function(e) {
    e.preventDefault();
}, false);

function startTouch(x, y) {
    var a = document.createElement("div");
    a.classList.add("startTouch");
    a.style.top = y - 32 + "px";
    a.style.left = x - 32 + "px";
    document.body.appendChild(a);
}

addEventListener("touchstart", function(e) {
    e.preventDefault();
    var tt = e.targetTouches[0];
    t.x = tt.clientX;
    t.y = tt.clientY;
    startTouch(t.x, t.y);
}, false);

addEventListener("touchmove", function(e) {
    e.preventDefault();

    var tt = e.targetTouches[0],
        x = tt.clientX,
        y = tt.clientY;
    if (x < t.x - 32) {
        t.dx = -1;
    } else if (x > t.x + 32) {
        t.dx = 1;
    } else {
        t.dx = 0;
    }

    if (y < t.y - 32) {
        t.dy = -1;
    } else if (y > t.y + 32) {
        t.dy = 1;
    } else {
        t.dy = 0;
    }
}, true);

addEventListener("touchend", function() {
    t.dx = t.dy = 0;
    var r = document.getElementsByClassName("startTouch");
    for (i in r) {
        document.body.removeChild(r[i]);
    }
}, false);

(function() {
    for (var i = 0; i < 25; i++) {
        obs.push({
            x: c.width / 2,
            y: c.height / 2,
            color: "#FFFFFF",
            id: i
        });
    }
}());

obs.push(p);

x.cls = function() {
    x.clearRect(0, 0, c.width, c.height);
}
obs.mov = function() {
    p.x += t.dy ? t.dx : t.dx * SQRT2;
    p.y += t.dx ? t.dy : t.dy * SQRT2;
    obs.forEach(function(o, i) {
        obs.forEach(function(p, x) {
            if (o.id != p.id) {
                var d = [0, 0];

                o.x < p.x - 7.5 && (d[0] += 1);
                o.x - 7.5 > p.x && (d[0] -= 1);
                o.y < p.y - 7.5 && (d[1] += 1);
                o.y - 7.5 > p.y && (d[1] -= 1);

                if (o.x < p.x + 5 &&
                    o.x + 5 > p.x &&
                    o.y < p.y + 5 &&
                    o.y + 5 > p.y
                ) {
                    d[0] = Math.round(Math.random()) * 7.5;
                    d[1] = Math.round(Math.random()) * 7.5;
                }

                if (o.x < p.x + 25 &&
                    o.x + 25 > p.x &&
                    o.y < p.y + 25 &&
                    o.y + 25 > p.y
                ) {
                    obs[x].x += d[0];
                    obs[x].y += d[1];
                    obs[i].x -= d[0];
                    obs[i].y -= d[1];
                }
            }
        });
        if (o.x < 12.5) {
            obs[i].x += 2;
        }
        if (o.x > c.width - 12.5) {
            obs[i].x -= 2;
        }
        if (o.y < 12.5) {
            obs[i].y += 2;
        }
        if (o.y > c.height - 12.5) {
            obs[i].y -= 2;
        }
    });
}
obs.draw = function() {
    x.cls();
    obs.mov();
    obs.forEach(function(o) {
        x.fillStyle = o.color;
        x.fillRect(o.x - 12.5, o.y - 12.5, 25, 25);
    });
}

setInterval(obs.draw, 1000 / 60);
