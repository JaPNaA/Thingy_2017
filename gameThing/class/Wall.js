class Wall {
    // A wall with a hole in it
    constructor(i) {
        if (i == undefined) throw "Missing 1 reqired argument";
        this.i = i;
        this.type = random(0, 1) < config.doubleWallChance ? 1 : 0;
        this.width = 0.075;
        this.x = this.rx = 2;
        if (this.type) {
            this.top = this.rtop = random(
                0,
                1 - config.wallOpeningSize - config.minWallSize
            );
            this.bottom = this.rbottom = this.top + config.wallOpeningSize;
        } else {
            // 1 wall
            this.height = random(
                config.wallOpeningSize,
                1 - config.wallOpeningSize
            );
            this.y = this.ry = random(0, 1) < 0.5 ? 1 - this.height : 0;
        }
        this.color = "#666666";
        this.xl = config.spd;
        this.mxl = random(-0.02, 0.02);
    }
    draw(x) {
        var h = hgt();
        x.fillStyle = this.color;
        if (this.type) {
            x.fillRect(h * this.x, 0, h * this.width, h * this.top);
            x.fillRect(
                h * this.x,
                h * this.bottom,
                h * this.width,
                h * (1 - this.bottom)
            );
        } else {
            x.fillRect(h * this.x, h * this.y, h * this.width, h * this.height);
        }
        {
            let diff = this.rx - this.x;
            this.x += diff / config.smoothening;
        }
        if (this.type) {
            {
                let diff = this.rtop - this.top;
                this.top += diff / config.smoothening;
            }
            {
                let diff = this.rbottom - this.bottom;
                this.bottom += diff / config.smoothening;
            }
        } else {
            let diff = this.ry - this.y;
            this.y += diff / config.smoothening;
        }
    }
    tick() {
        if (!plr.alive) return;
        this.rx -= this.xl * dt.spdM;
        if (this.type) {
            // 2 walls
            if (
                this.rx < plr.rx + plr.width &&
                this.rx + this.width > plr.rx &&
                (this.top > plr.ry || this.bottom < plr.ry + plr.height)
            ) {
                plr.alive = false;
            }
        } else {
            // 1 wall
            if (
                this.rx < plr.rx + plr.width &&
                this.rx + this.width > plr.rx &&
                this.ry < plr.ry + plr.height &&
                this.ry + this.height > plr.ry
            ) {
                plr.alive = false;
            }
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
