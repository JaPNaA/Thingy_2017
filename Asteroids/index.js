(function(){

function addLoad(e) {
    e.addEventListener(
        e.constructor == HTMLAudioElement ? "loadeddata" : "load",
        function () {
            addLoad.av++;
            if (addLoad.av == addLoad.v && addLoad.f) {
                dispatchEvent(new Event("resLoad"));
            }
        }
    );
    addEventListener("load", function () {
        if (addLoad.av == addLoad.v) {
            dispatchEvent(new Event("resLoad"));
        } else {
            addLoad.f = true;
        }
    });
    addLoad.v++;
}
addLoad.f = addLoad.v = addLoad.av = 0;

function loadImage(e) {
    var f = document.createElement("img");
    f.src = e;
    addLoad(f);
    return f;
}

function loadSound(e, c) {
    var f = new Audio(e);
    f.volume = c;
    f.preload = true;
    addLoad(f);
    f.channel = [];
    return f;
}

// audio driver
Audio.prototype.go = function (e) {
    if (!this.paused && !this.ended && 0 < this.currentTime) {
        for (let i = 0;; i++) {
            let b = this.channel[i];
            if (!b) {
                let a = new Audio(this.src);
                a.playbackRate = e || 1;
                a.volume = this.volume;
                a.play();
                this.channel[i] = a;
                break;
            } else if (!b.paused && !b.ended && 0 < b.currentTime) {
                continue;
            } else {
                b.playbackRate = e || 1;
                b.play();
                break;
            }
        }
    } else {
        this.playbackRate = e || 1;
        this.play();
    }
};

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const cvs = document.getElementById("cvs"),
    X = cvs.getContext("2d"),
    PID2 = Math.PI / 2,
    dt = {
        key: [],
        keydown: 0,
        cursor: {},
        mousedown: false,
        sI: {
            invisMouse: 0
        },
        texture: {
            asteroid: loadImage("img/asteroid.jpg"),
            asteroid1: loadImage("img/asteroid1.jpg"),
            explode: loadImage("img/explode.png"),
            ammo: loadImage("img/ammo.png"),
            invincibility: loadImage("img/invincibility.png"),
            mGun: loadImage("img/mGun.png"),
            bg: loadImage("img/bg.jpg")
        },
        audio: {
            shot: loadSound("sound/shot.mp3", 0.05),
            bgaudio: loadSound("sound/bgaudio.mp3", 0.2),
            exp: loadSound("sound/exp.mp3", 0.2)
        },
        absP: !!(localStorage.devMode / 1),
        ld: 0,
        ald: 0
    },
    ev = document.getElementsByTagName("ev")[0];

function fromAngle(a, d) {
    return {
        x: Math.cos(a) * d,
        y: Math.sin(a) * d
    };
}

function rand(e, f) {
    var l = Math.min(e, f),
        m = Math.max(e, f),
        dif = m - l;

    return Math.random() * dif + l;
}

function fadeColor(a, b, c) {
    var t = [],
        f = [],
        r = "#",
        s = 1 - c;

    {
        let ta = [a.substr(1, 2), a.substr(3, 2), a.substr(5, 2)],
            fa = [b.substr(1, 2), b.substr(3, 2), b.substr(5, 2)];
        for (i of ta) {
            t.push(parseInt(i, 16));
        }
        for (i of fa) {
            f.push(parseInt(i, 16));
        }
    }
    for (let i = 0; i < 3; i++) {
        let g = Math.round(t[i] * s + f[i] * c).toString(16);
        while (g.length < 2) {
            g = "0" + g;
        }
        r += g;
    }
    return r;
}

class Background {
    constructor(c, p) {
        this.width = 1080;
        this.height = 1080;
        this.color = c;
        this.opacity = p || 0;
        X.fillStyle = this.color;
        X.fillRect(0, 0, this.width, this.height);
    }
    draw() {
        X.save();
        X.globalAlpha = this.opacity;
        // X.fillStyle = this.color;
        // X.fillRect(0, 0, this.width, this.height);
        X.drawImage(
            this.color,
            0,
            0,
            this.color.width,
            this.color.height,
            0,
            0,
            this.width,
            this.height
        );
        X.restore();
    }
}

class Obj {
    constructor() {
        this.rem = false;
    }
    draw() {}
    tick() {}
    remove() {
        if (this.rem) {
            game.obs.splice(game.obs.indexOf(this), 1);
        }
    }
    on() {}
}
class Asteroid extends Obj {
    constructor(s, x, y, a, v) {
        super();

        game.obs.push(this);
        this.size = s || Math.round(Math.random()) + 2;
        this.rot = a || Math.random() * Math.PI * 2;
        var nn = fromAngle(this.rot, 1200);
        this.x = x || nn.x + rand(285, 795);
        this.y = y || nn.y + rand(285, 795);
        this.v = v || rand(this.size, this.size + 4);
        this.vRot = 0.01;
        this.thickness = 2;
        this.color = "#FFF";
        this.shape = new Path2D();
        this.texture = dt.texture[Math.random() < 0.5 ? "asteroid" : "asteroid1"];
        this.break = false;
        this.gameOverExp = false;

        {
            let x = this.shape,
                i = this.size / 2;
            x.moveTo(rand(40, 65) * i, rand(-100, -60) * i);
            x.lineTo(rand(60, 80) * i, rand(0, 100) * i);
            x.lineTo(rand(0, 20) * i, rand(15, 100) * i);
            x.lineTo(rand(-80, -55) * i, rand(-10, 80) * i);
            x.lineTo(rand(-35, -10) * i, rand(-100, -25) * i);
            x.closePath();
        }
    }
    draw() {
        X.save();
        X.beginPath();

        X.translate(this.x, this.y);
        X.rotate(this.rot);

        X.strokeStyle = this.color;
        X.thickness = 2;

        X.stroke(this.shape);
        X.clip(this.shape);
        X.drawImage(
            this.texture, -this.texture.width / 2, -this.texture.height / 2
        );

        X.restore();

        if (dt.absP) {
            X.fillStyle = "#F00";
            X.fillRect(this.x - 1, this.y - 1, 3, 3);
        }
    }
    tick(i) {
        var {
            x,
            y
        } = fromAngle(this.rot, -this.v * i);
        this.x += x;
        this.y += y;

        if (this.gameOverExp) {
            if (Math.random() < 0.05) {
                new Effects("exp", this.x, this.y, this.size, 1);
                this.rem = true;
            }
        }

        if (
            this.x < -1080 ||
            this.x > 2160 ||
            this.y < -1080 ||
            this.y > 2160
        ) {
            this.rem = true;
        }
    }
    remove() {
        if (this.rem) {
            game.obs.splice(game.obs.indexOf(this), 1);
            if (this.break) {
                if (this.size > 1) {
                    for (let i = 0; i < rand(2, 4); i++) {
                        new Asteroid(
                            this.size - 1,
                            this.x,
                            this.y,
                            rand(0, Math.PI) + this.break.rot,
                            rand(4, 6)
                        );
                    }
                }
            }
        }
    }
}
class PowerUp extends Obj {
    constructor(s, x, y, a, v) {
        super();

        game.obs.push(this);
        this.rot = a || Math.random() * Math.PI * 2;
        var nn = fromAngle(this.rot, 1080);
        this.x = x || nn.x + rand(285, 795);
        this.y = y || nn.y + rand(285, 795);
        this.v = v || rand(5, 8);
        this.vRot = 0.01;
        this.thickness = 2;
        this.color = "#FFF";
        this.shape = new Path2D();
        this.opacity = 1;
        this.remStep = 10;
        this.scale = 1;
        this.act = true;
        this.hit = false;
        this.type = game.powerUpT[Math.floor(rand(0, game.powerUpT.length))];
        this.texture = dt.texture[this.type];

        {
            let x = this.shape;
            x.arc(0, 0, 48, 0, Math.PI * 2);
        }
    }
    draw() {
        X.save();
        X.beginPath();
        X.translate(this.x, this.y);
        X.rotate(this.rot);
        X.scale(this.scale, this.scale);
        X.globalAlpha = this.opacity;
        X.shadowBlur = 8;
        X.shadowColor = this.color;
        X.fillStyle = X.strokeStyle = this.color;
        X.stroke(this.shape);
        X.fill(this.shape);
        X.clip(this.shape);
        X.drawImage(
            this.texture,
            0,
            0,
            this.texture.width,
            this.texture.height, -24, -24,
            48,
            48
        );
        X.restore();
        if (dt.absP) {
            X.fillStyle = "#F00";
            X.fillRect(this.x - 1, this.y - 1, 3, 3);
        }
    }
    tick(i) {
        var {
            x,
            y
        } = fromAngle(this.rot, -this.v * i);
        this.x += x;
        this.y += y;

        if (this.rem && this.hit) {
            if (this.act) {
                this.act = false;
                game.powerUpA[this.type]();
                game.miscP += 100;
            }
            this.remStep -= i;
            this.opacity = (this.remStep / 10) ** 2;
            this.scale = 1 / (this.remStep / 10) ** 2;
        }

        if (
            this.x < -1080 ||
            this.x > 2160 ||
            this.y < -1080 ||
            this.y > 2160
        ) {
            this.rem = true;
        }
    }
    remove() {
        if (this.rem && this.remStep < 0) {
            game.obs.splice(game.obs.indexOf(this), 1);
        }
    }
}

class Player extends Obj {
    constructor(e) {
        super();

        e.obs.push(this);
        this.x = 540;
        this.y = 540;
        this.color = "#FFF";
        this.thickness = 2;
        this.shape = new Path2D();
        this.shieldShape = new Path2D();
        this.vRot = 0;
        this.rot = 0;
        this.vX = 0;
        this.vY = 0;
        this.bulletCoolDown = 0;
        this.lives = 1;
        this.alive = true;
        this.invincible = 0;
        this.ammo = 200;
        this.rapF = false; {
            let x = this.shape;
            x.moveTo(0, -34);
            x.lineTo(18, 30);
            x.lineTo(0, 14);
            x.lineTo(-18, 30);
            x.closePath();
        } {
            let x = this.shieldShape;
            x.arc(0, 0, 48, 0, Math.PI * 2);
            x.closePath();
        }
    }
    draw() {
        if (this.rem || game.startScreen) return;

        X.save();
        X.beginPath();
        X.lineWidth = this.thickness;
        X.translate(this.x, this.y);
        X.rotate(this.rot);
        X.strokeStyle = this.color;
        X.stroke(this.shape);
        if (this.invincible > 0) {
            X.lineWidth = 4;
            if (this.invincible < 100) {
                X.globalAlpha = this.invincible / 100;
            }
            X.stroke(this.shieldShape);
        }
        X.restore();
        if (dt.absP) {
            X.fillStyle = "#F00";
            X.fillRect(this.x - 1, this.y - 1, 3, 3);
        }
    }
    tick(i) {
        if (game.startScreen) return;

        var v = 0;
        if (this.rem) {
            if (this.invincible > 0) {
                this.rem = false;
                return;
            }
            if (--this.lives) {
                // respawn
            } else {
                this.alive = false;
            }
            return;
        }
        if (this.invincible > 0) {
            this.invincible -= i;
            if (this.invincible < 0) {
                this.invincible = 0;
            }
        }

        this.vRot *= 1 - 0.1 * i;
        this.vX *= 1 - 0.1 * i;
        this.vY *= 1 - 0.1 * i;

        if (dt.key[65] || dt.key[37]) {
            // left
            this.vRot -= 0.03 * i;
        }
        if (dt.key[87] || dt.key[38]) {
            // up
            v += 2;
        }
        if (dt.key[68] || dt.key[39]) {
            // right
            this.vRot += 0.03 * i;
        }
        if (dt.key[83] || dt.key[40]) {
            // down
            v -= 2;
        }
        if (dt.key[32]) {
            if (this.bulletCoolDown < 0 && this.ammo > 1) {
                this.bulletCoolDown =
                    3 + (this.bulletCoolDown > -25 ? this.bulletCoolDown : -25);
                new Bullet(this.x, this.y, this.rot);
                if (this.rapF) {
                    this.rapF--;
                    new Bullet(this.x, this.y, this.rot - 0.15);
                    new Bullet(this.x, this.y, this.rot + 0.15);
                }
                this.ammo--;
                v -= 1.5; // recoil
            }
        }
        var {
            x,
            y
        } = fromAngle(this.rot + PID2, -v * i);
        this.vX += x;
        this.vY += y;
        this.x += this.vX * i;
        this.y += this.vY * i;
        this.rot += this.vRot * i;

        this.bulletCoolDown -= i;
        this.ammo += i / 10;
        for (let i of game.obs) {
            if ([Asteroid, PowerUp].includes(i.constructor)) {
                X.save();
                X.rotate(i.rot);
                if (X.isPointInPath(i.shape, this.x - i.x, this.y - i.y)) {
                    switch (i.constructor) {
                        case Asteroid:
                            new Effects("exp", this.x, this.y, 2.5, 1.75);
                            i.rem = true;
                            this.rem = true;
                            break;
                        case PowerUp:
                            i.rem = true;
                            i.hit = true;
                    }
                }
                X.restore();
            }
        }

        if (this.x < 0) {
            this.x = 1080;
        }
        if (this.x > 1080) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 1080;
        }
        if (this.y > 1080) {
            this.y = 0;
        }
    }
    remove() {}
}
class Bullet extends Obj {
    constructor(x, y, a) {
        super();

        game.obs.push(this);

        this.x = x;
        this.y = y;
        this.rot = a;
        this.color = "#FFF";
        this.thickness = 4;
        this.shape = new Path2D();
        this.v = 50;
        this.vRot = 0 && 0.5 * (Math.random() < 0.5 ? 1 : -1);

        {
            let x = this.shape;
            x.moveTo(0, -2);
            x.lineTo(0, 8);
            x.closePath();
        }
        dt.audio.shot.go(game.speed);
    }
    draw() {
        X.save();
        X.beginPath();
        X.strokeStyle = this.color;
        X.translate(this.x, this.y);
        X.rotate(this.rot);
        X.stroke(this.shape);
        X.restore();
        if (dt.absP) {
            X.fillStyle = "#F00";
            X.fillRect(this.x - 1, this.y - 1, 3, 3);
        }
    }
    tick(i) {
        var {
            x,
            y
        } = fromAngle(this.rot + PID2, -this.v * i);
        this.x += x;
        this.y += y;
        this.rot += this.vRot * i;

        if (this.x < 0 || this.x > 1080 || this.y < 0 || this.y > 1080) {
            this.rem = true;
        }
        if (!this.rem) {
            for (let i of game.obs) {
                if (i.constructor != Asteroid) continue;
                X.save();
                X.rotate(i.rot);
                if (X.isPointInPath(i.shape, this.x - i.x, this.y - i.y)) {
                    i.rem = true;
                    i.break = this;
                    this.rem = true;
                    new Effects("exp", this.x, this.y, i.size / 3 + 1);
                    game.asteroidP++;
                }
                X.restore();
            }
        }
    }
}

class ScoreDisplay extends Obj {
    constructor(e) {
        super();

        e.obs2.push(this);
        this.pos = {
            points: {
                x: 8,
                y: 52
            },
            timeAlive: {
                x: 0,
                y: 0
            },
            ammo: {
                x: 8,
                y: 1048,
                d: 0
            },
            lives: {
                x: 0,
                y: 0
            },
            special: {
                x: 0,
                y: 0
            }
        };
    }
    draw() {
        if (game.startScreen) return;

        X.fillStyle = "#F00"; 
        
        {
            X.font = "bold 48px VT323";
            let m = Math.floor((game.score / 25) ** 2) + "pt";
            X.fillStyle = "#FFF";
            X.fillText(m, this.pos.points.x, this.pos.points.y);
        } 
        
        {
            let m = this.pos.ammo.d,
                i = 0;
            X.thickness = 2;
            X.strokeStyle = "#EEE";
            if (m > 75) X.fillStyle = "#FFF";
            else
                X.fillStyle = fadeColor(
                    "#FFFFFF",
                    "#FF0000",
                    1 - (m / 75) ** 3
                );
            X.strokeRect(this.pos.ammo.x, this.pos.ammo.y, 256, 24);
            X.fillRect(
                this.pos.ammo.x,
                this.pos.ammo.y,
                256 * (m < 100 ? m / 100 : 1),
                24
            );
            if (m > 9000) {
                X.font = "24px VT323";
                X.fillStyle = "#000";
                X.fillText(
                    "IT'S OVER 9000! (" + Math.floor(m) + ")",
                    this.pos.ammo.x + 2,
                    this.pos.ammo.y + 20
                );
            } else {
                while (m > 100) {
                    i++;
                    m -= 100;
                    X.fillStyle = "hsl(" + i * 50 + ", 100%, 50%)";
                    X.fillRect(
                        this.pos.ammo.x,
                        this.pos.ammo.y,
                        256 * (m < 100 ? m / 100 : 1),
                        24
                    );
                }
            }
            X.font = "32px VT323";
            X.fillStyle = "#FFF";
            X.fillText("Ammo", this.pos.ammo.x, this.pos.ammo.y - 8);
        }

        if (dt.absP) {
            X.fillStyle = "#F00"; {
                let m = "state: " + game.state + " wave: " + game.wave;
                X.fillText(m, 570 - X.measureText(m).width / 2, 480);
            } {
                let m =
                    game.time + "ms, " + game.pt.toPrecision(5) + " tickTime";
                X.fillText(m, 570 - X.measureText(m).width / 2, 516);
            } {
                let m =
                    game.tickNumber + " ticks, " + game.frameNumber + " frames";
                X.fillText(m, 570 - X.measureText(m).width / 2, 552);
            } {
                let m =
                    game.asteroidP +
                    "astPs, " +
                    game.miscP +
                    "miscP, obsLen: " +
                    game.obs.length;
                X.fillText(m, 570 - X.measureText(m).width / 2, 588);
            } {
                let m =
                    Math.round(game.score) +
                    " points, " +
                    Math.round(game.player.ammo) +
                    "ammo";
                X.fillText(m, 570 - X.measureText(m).width / 2, 624);
            }
        } 
        // also: state, wave, obs.length, asteroidP
    }
    tick(i) {
        if (!this.pos.ammo) this.pos.ammo = 1;
        let x = this.pos.ammo,
            y = game.player.ammo,
            diff = y - x;
        this.pos.ammo.d += (game.player.ammo - this.pos.ammo.d) * (i / 2);
    }
    remove() {}
}

class Effects extends Obj {
    constructor(t, x, y, s, st) {
        super();

        game.obs.push(this);
        this.x = x;
        this.y = y;
        if (t == "exp") {
            this.texture = dt.texture.explode;
            this.width = this.height = 96;
            this.frames = 12;
            this.speed = 10 * (st || 1);
        }
        this.scale = s || 1;
        this.time = 0;
        this.cf = 0;
        this.ef = this.speed / this.frames;
        dt.audio.exp.go();
    }
    tick(i) {
        this.time += i;
        this.cf = Math.floor(this.time / this.ef);
        if (this.time > this.speed) {
            this.rem = true;
        }
        if (dt.key[67]) {
            // move front
        }
    }
    draw() {
        var w = this.width * this.scale,
            h = this.height * this.scale;
        X.drawImage(
            this.texture,
            this.cf * this.width,
            0,
            this.width,
            this.height,
            this.x - w / 2,
            this.y - h / 2,
            w,
            h
        );
    }
}

class DeathScreen extends Obj {
    constructor(time, asteroidP, score) {
        super();

        this.time = time;
        this.asteroidP = asteroidP;
        this.score = Math.floor((score / 25) ** 2);

        this.then = Date.now();
        this.showS = 750;
        this.flashS = 150;
        game.obs2.push(this);
    }
    draw() {
        var now = Date.now(),
            tt = now - this.then;
        X.save();

        if (tt < this.flashS) {
            let nt;
            if (tt < this.flashS / 2) {
                nt = tt / this.flashS;
            } else {
                nt = (this.flashS - tt) / this.flashS;
            }
            X.globalAlpha = nt * 2;
            X.fillStyle = "#FFFFFF";
            X.fillRect(0, 0, 1080, 1080);
        }

        if (tt < this.showS) {
            let nt = easeInOutQuad(tt / this.showS);
            X.globalAlpha = nt * 0.75;

            {
                let h = 360 * nt;
                X.fillStyle = "#FFFFFF";
                X.fillRect(0, 540 - h / 2, 1080, h);
            }

        } else {
            let f = "VT323";
            X.globalAlpha = 0.75;
            X.fillStyle = "#FFFFFF";
            X.fillRect(0, 360, 1080, 360);

            X.globalAlpha = 1;
            X.fillStyle = "#000000";

            if (tt < this.showS + 32) {
                f = "Serif";
                this.nt = false;
            }
            X.font = "bold 84px " + f;
            X.fillText("You died!", 64, 448);

            X.font = "64px " + f;
            X.fillText("Time alive: " + (this.time / 1000) + " seconds", 128, 508);
            X.fillText("Asteroids destroyed: " + this.asteroidP, 128, 562);
            X.fillText("Total score: " + this.score + "pt", 128, 616);

            X.fillStyle = "#808080"
            X.font = "32px " + f;
            X.fillText("Click or press any key to restart", 128, 654);
        }

        X.restore();

    }
    restart() {
        game.stop();
        game = new Game();
        game.start(1);
    }
    on(e, d) {
        if (
            e == "keydown" && !d.repeat &&
            Date.now() - this.then > this.showS &&
            !d.ctrlKey && !d.altKey
        ) {
            this.restart();
        } else if (e == "mouseup") {
            this.restart();
        }
    }
}

class StartScreen extends Obj {
    constructor() {
        super();
        this.then = Date.now();
        this.showS = 1500;
        game.obs2.push(this);
    }
    draw() {
        var now = Date.now(),
            tt = now - this.then;
            
        X.save();

        if (tt < this.showS) {
            let nt = easeInOutQuad(tt / this.showS);
            X.globalAlpha = nt * 0.75;

            {
                let h = 360 * nt;
                X.fillStyle = "#FFFFFF";
                X.fillRect(0, 540 - h / 2, 1080, h);
            }

        } else {
            X.globalAlpha = 0.75;
            X.fillStyle = "#FFFFFF";
            X.fillRect(0, 360, 1080, 360);
            

            X.globalAlpha = 1;
            
            X.fillStyle = "#000000";

            X.font = "172px VT323";

            let txt = "Asteroids",
                tx = 540 - X.measureText(txt).width / 2;
            
            X.fillText(txt, tx, 564);

            X.font = "32px VT323";
            X.fillText("Created by JaPNaA", tx, 600);

            txt = "Click or press any key to start",
            tx = 540 - X.measureText(txt).width / 2;
            X.fillStyle = "#808080";
            X.fillText(txt, tx, 668);
        }

        X.restore();

    }
    start() {
        game.stop();
        game = new Game();
        game.start(1);
    }
    on(e, d) {
        if (
            e == "keydown" && !d.repeat &&
            !d.ctrlKey && !d.altKey
        ) {
            this.start();
        } else if (e == "mouseup") {
            this.start();
        }
    }
}

class Game {
    constructor() {
        this.state = 1;
        this.started = false;

        this.startScreen = null;

        this.obs = [];
        this.obs2 = [];
        this.obss = [this.obs, this.obs2];

        this.background = new Background(dt.texture.bg, 0.35);
        this.scoreDisplay = new ScoreDisplay(this);
        this.player = new Player(this);

        this.sI = {
            draw: 0,
            lastTime: 0
        };

        this.wave = 0;
        this.tickNumber = 0;
        this.frameNumber = 0;
        this.pt = 0;
        this.time = 0;
        this.asteroidP = 0;
        this.miscP = 0;

        this.gameOverS = false;

        this.speed = 1;
        this.score = 0;

        this.audio = dt.audio.bgaudio;
        this.audio.go();
        this.audio.addEventListener("ended", () => this.audio.go());

        this.spawn = {
            Asteroid: {
                current: 0,
                cooldown: () => {
                    return rand(10, 20);
                },
                class: Asteroid
            },
            PowerUp: {
                current: 400,
                cooldown: () => {
                    return rand(300, 400);
                },
                class: PowerUp
            }
        };

        this.powerUpT = ["ammo", "invincibility", "mGun"];
        this.powerUpA = {
            ammo: function () {
                game.player.ammo += 200;
            },
            invincibility: function () {
                game.player.invincible += 600;
            },
            mGun: function () {
                game.player.rapF += 100;
            }
        };
    }
    reqanf() {
        this.tick();
        this.remove();
        this.sI.draw = requestAnimationFrame(function () {
            game.draw();
        });
    }
    draw() {
        this.background.draw();
        for (let j of this.obss) {
            for (let i of j) {
                X.beginPath();
                i.draw();
            }
        }
        this.reqanf();
        this.frameNumber++;
    }
    tick() {
        var now = Date.now(),
            inv = now - this.sI.lastTime,
            it = inv / (50 / this.speed);
        if (!inv) return;
        this.sI.lastTime = now;
        for (let j of this.obss) {
            for (let i of j) {
                i.tick(it);
            }
        }
        for (let i in this.spawn) {
            let a = this.spawn[i];
            a.current -= it;
            if (a.current <= 0) {
                if (typeof a.cooldown == "function") {
                    a.current = a.cooldown() + a.current;
                } else {
                    a.current = a.cooldown + a.current;
                }
                new a.class();
            }
        }
        game.tickNumber++;
        game.pt += it;
        game.time += inv;
        if (this.player.alive) {
            this.score = this.miscP + this.asteroidP + this.time / 500;
            this.wave = Math.floor(this.score / 100);
            this.speed = this.wave * 0.065 + 1;
        } else {
            if (!this.gameOverS) {
                this.gameOverS = true;
                for (let i of this.obs) {
                    if (i.constructor != Asteroid) continue;
                    i.gameOverExp = true;
                }
            }
            if (this.state) {
                new Effects("exp", this.x, this.y, 3, 3);
                this.state = 0;
                new DeathScreen(game.time, game.asteroidP, game.score);
            }
        }
    }
    remove() {
        for (let j of this.obss) {
            for (let i of j) {
                i.remove();
            }
        }
    }
    on(e, d) {
        for (let j of this.obss) {
            for (let i of j) {
                i.on(e, d);
            }
        }
    }
    start(e) {
        if(this.started) return;
        this.started = true;

        if (e) {
            this.startScreen = false;
        } else {
            this.startScreen = new StartScreen();
        }
        this.sI.lastTime = Date.now();
        this.reqanf();
    }
    stop() {
        clearInterval(this.sI.draw);
        for (let i in dt.audio) {
            let a = dt.audio[i];
            a.pause();
            a.currentTime = 0;
            for (let j of a.channel) {
                j.pause();
                a.currentTime = 0;
            }
        }
        this.obs.length = 0;
        this.obs2.length = 0;
    }
}


addEventListener("keydown", function (e) {
    dt.key[e.keyCode] = true;
    if (!e.repeat) {
        dt.keydown++;
    }
    if (e.keyCode == 70) {
        if (document.webkitFullscreenEnabled) {
            // requires work
            document.body.webkitRequestFullscreen();
        } else {
            var w = open(
                "",
                "",
                "width = 100, height = 100, top = " +
                (dt.cursor.screenY - 80) +
                ", left = " +
                (dt.cursor.screenX - 50)
            );
            w.document.head.innerHTML = document.head.innerHTML;
            w.document.body.appendChild(cvs);
            w.onkeyup = function () {
                this.onkeyup = null;
                cvs.webkitRequestFullscreen();
            };
        }
    }
    if (e.keyCode == 67) {
        dt.absP = !dt.absP;
        localStorage.devMode = dt.absP ? 1 : 0;
    }
    if (e.keyCode == 77) {
        dt.mute = true;
    }

    game.on("keydown", e);
});
addEventListener("keyup", function (e) {
    dt.key[e.keyCode] = false;
    dt.keydown--;

    game.on("keyup", e);
});
addEventListener("mousemove", function (e) {
    clearInterval(dt.sI.invisMouse);
    dt.sI.invisMouse = setInterval(function () {
        ev.classList.add("nomouse");
    }, 2e3);
    ev.classList.remove("nomouse");
    dt.cursor = e;

    game.on("mousemove", e);
});
addEventListener("blur", function (e) {
    dt.key.length = 0;
    dt.keydown = 0;

    game.on("blur", e);
});

{
    let r;
    addEventListener(
        "resize",
        (r = function () {
            if (innerWidth < innerHeight) {
                cvs.classList.add("w");
                cvs.classList.remove("h");

                cvs.style.left = 0;
                cvs.style.top = (innerHeight - cvs.clientHeight) / 2 + "px";

                cvs.width = innerWidth;
                cvs.height = innerWidth;

                X.scale(innerWidth / 1080, innerWidth / 1080);
            } else {
                cvs.classList.add("h");
                cvs.classList.remove("w");

                cvs.style.left = (innerWidth - cvs.clientWidth) / 2 + "px";
                cvs.style.top = 0;

                cvs.width = innerHeight;
                cvs.height = innerHeight;

                X.scale(innerHeight / 1080, innerHeight / 1080);
            }
        })
    );
    r();
}

addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
addEventListener("mousedown", function (e) {
    dt.mousedown = true;

    game.on("mousedown", e);
});
addEventListener("mouseup", function (e) {
    dt.mousedown = false;
    game.on("mouseup", e);
});

var game = new Game();
addEventListener("resLoad", () => game.start());

}());