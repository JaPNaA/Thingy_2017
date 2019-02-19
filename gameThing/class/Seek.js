class Seek {
    // Following player's Y
    constructor(i) {
        if (i === undefined) throw "Missing 1 reqired argument";
        this.xl = config.spd;
        this.sxl = config.seekXl;
        this.mX = config.seekXSpeed;
        this.mY = 0;
        this.mMY = config.seekYSpeed;
        this.height = this.width = 0.05;
        this.rot = 0;
        this.x = this.rx = 2;
        this.y = this.ry = random(config.boundary.ceil, config.boundary.floor);
        this.i = i;
    }
    draw(x) {
        var h = hgt();
        x.save();
        x.beginPath();
        x.fillStyle = "#0000FF";
        x.translate(
            h * (this.x + this.width / 2),
            h * (this.y + this.height / 2)
        );
        x.rotate(getAngle(plr, this));
        x.moveTo(-(h * this.width / 2), 0);
        x.lineTo(h * this.width / 2, -(h * this.height / 2));
        x.lineTo(h * this.width / 2, h * this.height / 2);
        x.fill();
        x.restore();

        {
            let diff = this.rx - this.x;
            this.x += diff / config.smoothening;
        }
        {
            let diff = this.ry - this.y;
            this.y += diff / config.smoothening;
        }
    }
    tick() {
        if (this.ry < plr.ry) {
            this.mY += this.sxl;
        } else if (this.ry > plr.ry) {
            this.mY -= this.sxl;
        }
        if (this.mY > config.seekLimit) {
            this.mY = config.seekLimit;
        }
        if (this.mY < -config.seekLimit) {
            this.mY = -config.seekLimit;
        }
        this.rx -= this.mX * dt.spdM;
        this.ry += this.mY * dt.spdM;
        if (!plr.alive) return;
        this.rx -= this.xl * dt.spdM;
        if (
            this.rx < plr.rx + plr.width &&
            this.rx + this.width > plr.rx &&
            this.ry < plr.ry + plr.height &&
            this.ry + this.height > plr.ry
        ) {
            plr.alive = false;
        }
    }
    remove(f) {
        if (this.x < 0 - this.width * 2 || f) {
            let that = this;
            obs.forEach(function(o, i, a) {
                if (o.i == that.i) {
                    a.splice(i, 1);
                }
            });
        }
    }
}
