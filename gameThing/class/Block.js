class Block {
    // Random falling block
    constructor(i) {
        if (i === undefined) throw "Missing 1 required argument";
        this.i = i;
        this.dir = Math.round(random(0, 1));
        this.x = this.rx = 2;
        this.y = this.ry = this.dir
            ? config.boundary.ceil
            : config.boundary.floor;
        this.width = this.height = config.fallingBlockSize;
        this.fallPoint = random(0, 1);
        this.xl = config.spd;
        this.fxl = 0;
        this.gravity = config.gravity;
        this.color = "#777777";
        this.fallingColor = "#DD00DD";
    }
    draw(x) {
        var h = hgt();
        x.fillStyle = this.fallingColor;
        x.fillStyle = fadeColor(
            this.fallingColor,
            this.color,
            (this.x - this.fallPoint) / 1.7
        );
        x.fillRect(h * this.x, h * this.y, h * this.width, h * this.height);
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
        if (!plr.alive) return;
        this.rx -= this.xl * dt.spdM;
        if (this.rx < this.fallPoint) {
            this.fxl += this.dir ? this.gravity : -this.gravity;
            this.ry += this.fxl * dt.spdM;
        }
        if (this.ry < config.boundary.ceil) {
            this.ry = config.boundary.ceil;
            this.fxl = 0;
        }
        if (this.ry + this.height > config.boundary.floor) {
            this.ry = config.boundary.floor - this.height;
            this.fxl = 0;
        }
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
