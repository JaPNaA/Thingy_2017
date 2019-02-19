try {
    if (!(navigator.userAgent.includes('Chrome') || navigator.userAgent.includes(
            'Firefox'))) {
        alert(
            'Your using something other than Chrome. Use Chrome. \nOr Firefox. Firefox is good too.'
        );
        location.assign(
            'data:text/html, <div style="font-size:100px;"> You were using something other than Chrome or Firefox. I could not let you through.'
        );
    } else {
        try {
            $('#content').innerHTML =
                "<br><span>Loading...</span> (JavaScript)<br><span>Loading...</span> (JSON)";
        } catch (e) {
            alert("Something went wrong.");
            location.assign(
                'data:text/html, Your browser failed to meet the standards of the Internet. I will not let you through.'
            );
        }
    }
} catch (e) {
    alert(e +
        "\nYour browser probubly won't support this page if it can't support the first protocol. \nYou probubly are using Internet Explorer because that's the only browser that doesn't support the first protocol."
    );
    location.assign(
        'data:text/html, Your browser failed to meet the standards of the Internet. I will not let you through.'
    );
}
try {
    $('<div>');
} catch (e) {
    alert(e +
        "\nSomething went wrong. Click [back] once your ready."
    );
    location.assign(
        'data:text/html, Your browser failed to meet the standards of the Internet. <br>:/'
    );
}

var dt = {
    preload: {
        img: [],
        data: [],
        site: []
    },
    stopCode: function(e, f) {
        if (e) {
            console.error(f);
            this.stopCode = 0;
        }
    },
    slides: [
        [
            ["div", "This is a test", 0, 0, 1280, 50],
            ["div", "This is another test", 0, 64, 1280, 50,
                "font-size:100px;", "font-size:30px;", 0.5, 1
            ],
            ["div", "This is... MOVEMENT", -128, 256, 300, 100, "",
                "left:1000px;", 1
            ],
            ["div", "I feel dizzy", 500, 500, 75, 0,
                "transform:rotate(5000deg);", "transform:rotate(0deg);",
                5, 0.25
            ],
            ["div", "This is loaded from JSON", 8, 650, 500, 0,
                "color:grey;",
                "color:red;", 1, 0, "(0.38, 0.37, 0.37, 1)"
            ]
        ],
        [
            ["div", "Welcome to the next slide!", 0, 300, 1000, 0,
                "transform:scale(0.5);", "transform:scale(1);", 0.25, 0
            ],
            ["script", "alert('This is a test')"]
        ]
    ],
    slideIX: 0,
    preventDoubleTap: false,
    started: false,
    prompta: {
        invalidScreen: false
    },
    isDev: false,
    devIP: atob('MTAuMTk0LjIyLjEwNw==')
}
dt.slides = slides;
resources.forEach(function(e) {
    if (e[0] == "img" && !e[2]) {
        dt.preload.img.push(e[1]);
    } else if (e[0] == "site" && !e[2]) {
        dt.preload.site.push(e[1]);
    } else if (e[0] == "data" && !e[2]) {
        dt.preload.data.push(e[1]);
    } else {
        if (!e[2])
            console.warn("Unkown item inside of slides.json/resources",
                e);
    }
});
window.dt = dt;
try {
    var a = open();
    if (!a) {
        $('#content').innerHTML =
            "<br>Your blocking pop-ups. I cannot let you through. <a href='javascript:location.reload()'> Retry </a>";
        dt.stopCode(true, "Blocking pop-ups.");
    } else {
        a.close();
    }
} catch (e) {
    alert(e +
        "\nSomething went wrong."
    );
    location.assign(
        'data:text/html, Your browser failed to meet the standards of the Internet. <br>:/'
    );
}
dt.stopCode();
(function() { //Get ip, checks if developer (Copied from https://github.com/diafygi/webrtc-ips/blob/master/index.html)
    var a, f = new Promise(r => {
        var w = window,
            a = new(w.RTCPeerConnection || w.mozRTCPeerConnection ||
                w.webkitRTCPeerConnection)({
                iceServers: []
            }),
            b = () => {};
        a.createDataChannel("");
        a.createOffer(c => a.setLocalDescription(c, b, b), b);
        a.onicecandidate = c => {
            try {
                c.candidate.candidate.match(
                    /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
                ).forEach(r)
            } catch (e) {}
        }
    });
    f.then(function(i) {
        dt.isDev = (i == dt.devIP);
        dt.devIP = atob("a1D721cS");
    }).catch(e => console.error(e));
}());

function start() {
    window.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 114:
                e.preventDefault();
                dt.slideIX++;
                slide(dt.slideIX);
                break;
        }
    }, false);
    document.addEventListener("webkitfullscreenchange", function() {
        if (!document.webkitIsFullScreen) {
            $("#content").style.cursor = "default";
        } else {
            $("#content").style.cursor = "none";
        }
        window.onresize();
    }, false);
    $('#content').innerHTML = "";
    $('#content').style = "";
    $('#content').classList = "presenting";
    slide(0);
}

function obj(i, c, x, y, w, h, s, t, d, tr) {
    if (i != "script") {
        this.ob = $("<" + (i || "div") + ">");
        this.ob.style = "position:absolute; display:block; top:" + (y || 0) +
            "px; left:" + (x || 0) + "px; width:" + (w || 0) + "px; height:" +
            (h ||
                0) + "px; " + (s || "") + "transition:" + ((t || 0) + "s ") +
            ((d || 0) + "s ") + (function() {
                if (tr && tr.startsWith("(")) {
                    return "cubic-bezier" + tr;
                }
                return tr || "";
            }()) + ";";
        if (i == "img" || i == "iframe") {
            this.ob.src = c;
        } else {
            this.ob.innerHTML = c;
        }
        return this.ob;
    } else {
        setTimeout(function() {
            try {
                eval(c);
            } catch (e) {
                alert('Failed to run script:\nLine: ' + e.line +
                    "\n\nCode:\n" + c);
            }
        }, (x || 0) * 1e3);
    }
    return null;
}

function slide(e) {
    $('#content').innerHTML = "";
    var d = dt.slides[e];
    if (d) {
        try {
            d.forEach(function(o) {
                var a = obj(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[
                        8],
                    o[9], o[10]);
                if (a) {
                    $('#content').appendChild(a);
                    if (o[7]) {
                        var g = o[7].split(';');
                        g = (function() {
                            var h = [];
                            g.forEach(function(o) {
                                h.push(o.split(":"));
                            });
                            return h;
                        }());
                        requestAnimationFrame(function() {
                            g.forEach(function(o) {
                                a.style[o[0].split(' ')
                                    .join('')] = o[
                                    1];
                            });
                        });
                    }
                }
            });
        } catch (r) {
            var a = 'Something went wrong/function "slide": ' + r;
            console.error(a);
            alert(a);
            location.reload();
        }
    } else {
        prompta(
            "This is the end. <br> I'm going send an image of a blue screen now! <b>:D</b>"
        );
        setTimeout(function() {
            var a = $('fs-display'),
                b = a.style;
            a.innerHTML = "";
            b.background =
                "url('https:\/\/blogs.systweak.com/wp-content/uploads/BSOD-windows-7.png') 0% 0% / cover no-repeat rgb(0, 0, 170)";
            b.imageRendering = "pixelated";
            b.imageRendering = "-moz-crisp-edges";
        }, 3e3);

        if (!dt.isDev) {
            $('fs-display').requestPointerLock();
            $('fs-display').style.cursor = "none";
            if (!document.webkitIsFullScreen) {
                $('fs-display').webkitRequestFullScreen();
            }

            $('fs-display').webkitRequestFullScreen();
            window.addEventListener('keydown', function(e) {
                e.preventDefault();
                $('fs-display').webkitRequestFullScreen();
            }, true);
            window.addEventListener('keyup', function(e) {
                e.preventDefault();
                $('fs-display').webkitRequestFullScreen();
            }, true);
            window.addEventListener('webkitfullscreenchange', function(e) {
                $('fs-display').webkitRequestFullScreen();
            }, true);
            window.addEventListener('mousemove', function(e) {
                if (!document.webkitIsFullScreen) {
                    $('fs-display').webkitRequestFullScreen();
                }
                $('fs-display').requestPointerLock();
            }, true);
            window.addEventListener('beforeunload', function(e) {
                open('http://www.crashchrome.com', "",
                    "width=100, height=100");
            }, true);
        }
    }
}

function prompta(e, n) {
    var a = $('<div>' + e + '</div>'),
        w, h, f = $('fs-display');
    a.style =
        "opacity:0; display: inline-block; font-size: 24px; padding:32px; border:1px solid black;";
    $('fs-display').appendChild(a);
    a.id = n;
    a.classList = "prompta";
    w = a.clientWidth / 2;
    h = a.clientHeight / 2;
    a.style = a.style.cssText + "left:" + (f.clientWidth / 2 - w) + "px; top:" +
        (
            f.clientHeight / 2 - h) +
        "px; position:absolute; font-size: 24px; transform:scale(0.5); opacity:0.5; padding:32px; background-color:white; border:1px solid black;";
    requestAnimationFrame(function() {
        a.style.transition = "0.2s";
        a.style.transform = "scale(1)";
        a.style.opacity = 1;
        $('#content').style.filter = 'blur(4px)';
    });
}

function closePrompta(e) {
    var a = $('#' + e + ".prompta");
    if (e == "iss") {
        dt.prompta.invalidScreen = false;
    }
    a.parentElement.removeChild(a);
    if (!$('.prompta')) {
        $('#content').style.filter = "none";
    }
}

$('#content').innerHTML +=
    "<br><br>Keyboard controls: <br>Next Slide: F3<br>Leave Fullscreen: ESC<br><br>There are no controls for the mouse.<br><br>Copyright (c) 2017 Leone Corporation Incorporated Company Thing All Rights Reserved.<br>Build from scratch with <250 lines of code <br><span>Please wait...</span> <br><br><br> <span>If you can read this text, something is wrong, or this computer/Internet is incredibly slow.</span>";

$('#content').classList = "Ready";
$('#loadContainer').innerHTML = (function() {
    var z = dt.preload,
        i = "";
    z.img.forEach(function(o) {
        i += "<img src='" + o + "'>";
    });
    z.site.forEach(function(o) {
        i += "<iframe src='" + o + "'>";
    });
    return i;
}());

requestAnimationFrame(function() {
    var a = $('span');
    a[0].innerHTML = "Ready!";
    a[1].innerHTML = JSONready;
    a[2].innerHTML = "<b contenteditable=true>Click here</b>";
    a[3].innerHTML = "";
    $('b').onfocus = function() {
        if (this.getAttribute('disabled')) {
            this.innerHTML = "Invalid Screen Size";
            this.blur();
        } else {
            this.innerHTML = "Press any key";
            this.style.background = "black";
            this.style.color = "white";
        }
    }
    $('b').onclick = function() {
        if (this.getAttribute('disabled')) {
            alert(
                'This presentation cannot start with an invalid window/screen size.\n\nTry resizing the window or try to go fullscreen.\nIf this doesn\'t work, try flipping your screen (if you can)\nAnd if that doesn\'t work... You have a really weird screen. Just get a diffrent moniter...'
            )
        }
    }
    $('b').onblur = function() {
        if (this.getAttribute('disabled')) {
            this.innerHTML = "Invalid Screen Size";
        } else {
            this.innerHTML = "Click here";
            this.style.background = "white";
            this.style.color = "black";
        }
    }
    $('b').style =
        "outline:none; cursor:pointer; padding:8px 16px 8px 16px; border:1px solid black; border-radius:4px; top:16px; position:relative; transition:0.5s; text-align:center;";
    $('b').focus();
});
$('span')[2].addEventListener('keydown', function(e) {
    if (!dt.started && !this.getAttribute('disabled')) {
        dt.started = true;
        $('#content').style =
            "position:relative; top:0; transition: 0.45s;";
        setTimeout(function() {
            $('#content').style =
                "position:relative; top:-" +
                ($("#content").clientHeight + 50) +
                "px; transition: 0.45s;";
        });
        setTimeout(function() {
            $('fs-display').webkitRequestFullScreen();
            start();
        }, 500);
    }
    e.preventDefault();
}, false);
window.onresize = function() {
    if (!dt.started && ($('b'))) {
        $('b').blur();
    }
    document.body.style.zoom = innerHeight / 720;
    if (!(innerHeight < innerWidth && (innerWidth / innerHeight > 1.65 &&
            innerWidth / innerHeight < 2) && (screen.width / screen
            .height >
            1.6 && screen.width / screen.height < 2))) {
        if (dt.started) {
            if (!dt.prompta.invalidScreen)
                prompta('Invalid Screen Size!', "iss");
            dt.prompta.invalidScreen = true;
        } else {
            window.requestAnimationFrame(function() {
                $('b').innerHTML = "Invalid Screen Size";
                $('b').setAttribute('disabled', 1);
            });
        }
    } else {
        if (dt.started) {
            if (dt.prompta.invalidScreen) {
                closePrompta("iss");
            }
        } else {
            window.requestAnimationFrame(function() {
                $('b').focus();
                $('b').setAttribute('disabled', "");
            });
        }
    }
};
window.onresize();
