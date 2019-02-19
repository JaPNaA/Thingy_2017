onerror = function() {
    alert(JSON.stringify(arguments));
};

(function() {
    var a = document.createElement("div");
    a.classList.add("loading");
    a.id = "loading";
    a.innerHTML = "Loading...";
    document.body.appendChild(a);
    requestAnimationFrame(() => (a.style.opacity = 1));
})();

String.prototype.len = function(e, r) {
    var f = this;
    while (f.length < e) {
        f = (r || " ") + f;
    }
    return f.substr(0, e);
};
Number.prototype.round = function(e) {
    return Math.round(this * 10 ** (e || 0)) / 10 ** (e || 0);
};

function random(t, f) {
    return Math.random() * (f - t) + t;
}
function getAngle(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

function average(e) {
    var f = 0;
    e.forEach(function(o) {
        f += o;
    });
    return f / e.length;
}

function get(e, c) {
    var x = new XMLHttpRequest(),
        ready = false;
    x.open("GET", e);
    x.addEventListener("load", function() {
        c(JSON.parse(x.response));
    });
    x.send();
    return false;
}

function fadeColor(f, t, s) {
    var colF = [f.substr(1, 2), f.substr(3, 2), f.substr(5, 2)],
        colT = [t.substr(1, 2), t.substr(3, 2), t.substr(5, 2)],
        f = "#",
        iS = 1 - s;
    for (let i = 0; i < 3; i++) {
        f += Math.floor(parseInt(colF[i], 16) * iS + parseInt(colT[i], 16) * s)
            .toString(16)
            .len(2, "0");
    }
    return f;
}

function aniFrame() {
    if (dt.framerateCount.start) {
        if (new Date().getTime() > dt.framerateCount.start + 1000) {
            dt.framerateCount.start = new Date().getTime();
            dt.framerate = dt.framerateCount.frame;
            console.log("Framerate:", dt.framerate);
            dt.framerateCount.frame = 0;
        } else {
            dt.framerateCount.frame++;
        }
    } else {
        dt.framerateCount.start = new Date().getTime();
    }
    if (dt.ticked) {
        let r = dt.framerateCount.tframe;
        dt.tframe.push(r);
        while (dt.tframe.length > 20) {
            dt.tframe.shift();
        }
        config.smoothening = average(dt.tframe) + 0.5;
        console.log("Frames/tick:", r);
        dt.framerateCount.tframe = 0;
        dt.ticked = false;
    } else {
        dt.framerateCount.tframe++;
    }
    cvs.c();
    obs.draw();
    dt.sI.frame = requestAnimationFrame(aniFrame);
}

const states = {
        game: function() {
            if (dt.running) return;
            dt.state = 0;
            //reset
            clearInterval(dt.sI.tick);
            cancelAnimationFrame(dt.sI.frames);
            dt.framerateCount.start = dt.framerateCount.frame = dt.framerateCount.tframe = dt.iT = dt.tick = dt.coins = dt.score = 0;
            dt.spdM = 1;
            dt.ticked = false;
            obs.length = 0;
            while (document.getElementsByClassName("death").length > 0) {
                document.body.removeChild(
                    document.getElementsByClassName("death")[0]
                );
            }
            plr = new Player();
            obs.draw();
            //start
            dt.sI.tick = setInterval(obs.tick, 1000 / config.tickSpeed);
            console.log(
                "%cStarted new game instance",
                "font-weight: bold; color: green;"
            );
            dt.running = true;
            dt.sI.frames = requestAnimationFrame(aniFrame);
        },
        startScreen: function() {
            dt.state = 1;
            var d = new Img("title.png");
            obs.push(d);
            d.e.addEventListener("load", function() {
                obs.draw();
            });
        },
        deathScreen: function() {
            dt.state = -1;
            clearInterval(dt.sI.tick);
            cancelAnimationFrame(dt.sI.frame);
            console.log("%cPlayer died", "font-weight: bold; color: red;");
            dt.score = ((dt.tick - 20 + dt.coins * 250) * dt.spdM).round();
            if (dt.score > dt.highscore) {
                try {
                    localStorage.highscore = dt.highscore = dt.score;
                    dt.highscoreSaved = true;
                } catch (e) {
                    if (!dt.highscoreSaved && !dt.saveW) {
                        alert(
                            "Your highscore could not be saved.\nPossible reasons:\n - Private browsing\n - Cookies not enabled\n - Game downloaded\n - Low storage"
                        );
                    }
                    dt.saveW = true;
                    dt.highscoreSaved = false;
                }
            }
            {
                let a = document.createElement("div");
                a.classList.add("death");
                a.innerHTML =
                    `
                <div class=deathCard>
                    <div class=title>` +
                    (function() {
                        var m =
                            config.deathMessage[
                                Math.floor(
                                    random(0, config.deathMessage.length)
                                )
                            ];
                        if (m.startsWith("js:")) {
                            return eval(m.substring(3, m.length));
                        } else {
                            return m;
                        }
                    })() +
                    `</div>
                    <div>You lasted <span id=seconds>0</span> seconds,</div>
                    <div>You got <span id=coins>0</span> coins,</div>
                    <div>And got a total of</div>
                    <div id=score>0</div>
                    <div>points!</div>
                    <div id=highscore>Your highscore is <span>` +
                    (dt.highscoreSaved ? dt.highscore : "N/A") +
                    `</span></div>
                </div>`;
                document.body.appendChild(a);

                setTimeout(function() {
                    let nx = true;

                    function ani() {
                        var now = Date.now();
                        if (now < then + 250) {
                            // 0 -> 250
                            // seconds alive
                            let a = 1 - transition.easeOut((now - then) / 250);
                            t[0].innerHTML = (((dt.tick / 20).round() - 1) *
                                a).round();
                        } else if (now < then + 500) {
                            // 250 -> 500
                            // coins collected
                            let a =
                                1 -
                                transition.easeOut((now - (then + 250)) / 250);
                            t[0].innerHTML = (dt.tick / 20 - 1).round();
                            t[1].innerHTML = (dt.coins * a).round();
                        } else if (now < then + 1000) {
                            // 500 -> 1000
                            // points scored
                            let a =
                                1 -
                                transition.easeOut((now - (then + 500)) / 500);
                            t[1].innerHTML = dt.coins;
                            t[2].innerHTML = (a * dt.score).round();
                        } else if (now < then + 1500) {
                            // 1000 -> 1500
                            t[2].innerHTML = dt.score;
                            if (nx) {
                                dt.state = 2;
                                dt.running = false;
                                console.log(
                                    "%cAllowing restart",
                                    "font-weight: bold;"
                                );
                                nx = false;
                            }
                        } else if (now < then + 1650) {
                            // 1500 -> 1650
                            let a =
                                1 -
                                transition.easeOut((now - (then + 1650)) / 150);
                            t[3].style.opacity = 0.6 * a;
                        } else {
                            return;
                        }
                        sI = requestAnimationFrame(ani);
                    }
                    let then = Date.now(),
                        sI = requestAnimationFrame(ani),
                        t = [
                            document.getElementById("seconds"),
                            document.getElementById("coins"),
                            document.getElementById("score"),
                            document.getElementById("highscore")
                        ];
                }, 150);
            }
        }
    },
    transition = {
        easeOut: function(e) {
            return e * e;
        }
    };

const cvs = document.getElementById("canvas"),
    x = cvs.getContext("2d");
cvs.c = () => x.clearRect(0, 0, wdt(), hgt());

var wdt = e => {
        if (e) cvs.width = e;
        else return cvs.width;
    },
    hgt = e => {
        if (e) cvs.height = e;
        else return cvs.height;
    },
    obs = [],
    plr,
    config = get("config.json", function(e) {
        config = e;
        dispatchEvent(new Event("configed"));
    }),
    dt = {
        sI: {
            tick: 0,
            frame: 0
        },
        framerateCount: {
            start: 0,
            frame: 0,
            tframe: 0
        },
        tframe: [],
        state: -1,
        spdM: 1,
        iT: 0,
        tick: 0,
        framerate: 60,
        ticked: false,
        coins: 0,
        score: 0,
        highscore: JSON.parse(localStorage.highscore || "0"),
        running: false,
        saveW: false,
        highscoreSaved: false
    };

if (dt.highscore) {
    dt.highscoreSaved = true;
}

obs.draw = function() {
    var h = hgt(),
        w = wdt();
    obs.forEach(function(o) {
        o.draw(x);
    });
    plr && plr.draw(x);

    x.fillStyle = "#DDDDDD";
    x.fillRect(0, 0, w, config.boundary.ceil * h);
    x.fillRect(0, config.boundary.floor * h, w, config.boundary.floor * h);
};

obs.tick = function() {
    dt.ticked = true;
    dt.tick++;
    dt.spdM += config.xl;
    while (obs.length > 200) {
        obs.shift();
    }
    if (plr.alive) {
        for (let i in config.freq) {
            let t = config.freq[i];
            if (
                dt.tick > t.f &&
                !((dt.tick + t.o) % Math.floor(t.p / dt.spdM))
            ) {
                obs.push(
                    eval(
                        "new " +
                            (i.substr(0, 1).toUpperCase() +
                                i.substring(1, i.length)) +
                            "(" +
                            dt.iT++ +
                            ");"
                    )
                );
                console.log("%cSpawning " + i, "color: #F0F;");
            }
        }
    }

    plr.tick();
    obs.forEach(function(o) {
        o.tick();
    });
    obs.forEach(function(o) {
        o.remove();
    });
    dt.running = true;
};

onresize = function(e) {
    function action() {
        var c = config.asp;
        if (innerWidth / c.width < innerHeight / c.height) {
            hgt(innerWidth * (c.height / c.width));
            wdt(innerWidth);
            cvs.style.top = (innerHeight - hgt()) / 2 + "px";
            cvs.style.left = 0;
        } else {
            wdt(innerHeight * (c.width / c.height));
            hgt(innerHeight);
            cvs.style.left = (innerWidth - wdt()) / 2 + "px";
            cvs.style.top = 0;
        }
        obs.draw();
    }
    if (e == 1) {
        action();
    } else {
        setTimeout(function() {
            action();
        }, 100); // setTimeout for mobile users
    }
};

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(e) {
            window.setTimeout(e, 1000 / 60);
        };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function(e) {
            window.clearTimeout(e);
        };
}

function click() {
    var a = [
        function() {
            // Game
            plr.act();
        },
        function() {
            // startScreen
            states.game();
        },
        function() {
            // deathScreen
            states.game();
        }
    ][dt.state];
    a && a();
}

addEventListener(
    "touchstart",
    function(e) {
        e.preventDefault();
        click();
    },
    {
        capture: true,
        passive: false
    }
);

addEventListener(
    "touchmove",
    function(e) {
        e.preventDefault();
    },
    {
        capture: true,
        passive: false
    }
);

addEventListener("mousedown", function() {
    click();
});

addEventListener("keydown", function(e) {
    if ([32].includes(e.keyCode)) {
        click();
    }
});

addEventListener("blur", function(e) {
    // console.log("%cI see your looking at the code...\n%cIf you would like to hack it, just change some %cconfig%c stuff, then die and restart!\n%cHave fun!","font-size: 3em;","font-size: 4em;","font-size:4em; font-weight:bold","font-size:4em","font-size:5em; font-weight: bold; color: green;");
});

addEventListener("configed", function() {
    states.startScreen();
    onresize(1);
    document.body.removeChild(document.getElementById("loading"));
});
