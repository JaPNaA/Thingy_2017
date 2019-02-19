class Obstacle {
    // Random floating block
    constructor(i) {
        if (i === undefined) throw "Missing 1 reqired argument";
        this.i = i;
        this.width = random(config.minBlockSize, config.maxBlockSize);
        this.height = random(config.minBlockSize, config.maxBlockSize);
        this.x = this.rx = 2;
        this.y = this.ry = random(
            config.boundary.ceil + this.height,
            config.boundary.floor - this.height
        );
        this.color = "#666666";
        this.xl = config.spd;
    }
    draw(x) {
        var h = hgt();
        x.fillStyle = this.color;
        x.fillRect(h * this.x, h * this.y, h * this.width, h * this.height);
        {
            let diff = this.rx - this.x;
            this.x += diff / config.smoothening;
        }
    }
    tick() {
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
