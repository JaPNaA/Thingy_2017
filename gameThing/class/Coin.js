class Coin {
    // Collect for points
    constructor(i) {
        if (i === undefined) throw "Missing 1 reqired argument";
        this.radius = 0.04;
        this.x = this.rx = 2;
        this.y = this.ry = random(
            config.boundary.ceil + this.radius,
            config.boundary.floor - this.radius
        );
        this.color = "rgba(255,255,0,o)";
        this.xl = config.spd;
        this.i = i;
        this.captured = false;
        this.animationStep = 0;
        this.dremove = false;
    }
    draw(x) {
        var h = hgt();
        if (this.captured) {
            if (++this.animationStep > dt.framerate / 4) {
                this.dremove = true;
                return;
            }
            var d = transition.easeOut(this.animationStep / (dt.framerate / 4));
            x.fillStyle = this.color.replace("o", 1 - d);
            x.beginPath();
            x.ellipse(
                h * this.x,
                h * this.y,
                h * this.radius * (d + 1),
                h * this.radius * (d + 1),
                0,
                0,
                2 * Math.PI
            );
            x.fill();
        } else {
            x.fillStyle = this.color.replace("o", 1);
            x.beginPath();
            x.ellipse(
                h * this.x,
                h * this.y,
                h * this.radius,
                h * this.radius,
                0,
                0,
                2 * Math.PI
            );
            x.fill();
        }
        {
            let diff = this.rx - this.x;
            this.x += diff / config.smoothening;
        }
    }
    tick() {
        if (!plr.alive) return;
        var d = transition.easeOut(this.animationStep / (dt.framerate / 4));
        this.captured
            ? (this.rx -= this.xl * dt.spdM * d)
            : (this.rx -= this.xl * dt.spdM);
        if (
            !this.captured &&
            this.rx + this.radius > plr.rx &&
            this.rx - this.radius < plr.rx + plr.width &&
            this.ry + this.radius > plr.ry &&
            this.ry - this.radius < plr.ry + plr.height
        ) {
            this.captured = true;
            dt.coins++;
        }
    }
    remove(f) {
        if (this.x < 0 - this.radius * 2 || f || this.dremove) {
            let that = this;
            obs.forEach(function(o, i, a) {
                if (o.i == that.i) {
                    a.splice(i, 1);
                }
            });
        }
    }
}
