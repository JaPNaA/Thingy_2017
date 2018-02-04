class Player {
    constructor() {
        this.x = this.rx = 0.2;
        this.y = this.ry = 0.8;
        this.color = "#FF0000";
        this.height = this.width = 0.05;
        this.xl = 0;
        this.ud = false;
        this.alive = true;
        this.exitTick = 20;
        this.exitFrame = dt.framerate;
    }
    draw(x) {
        var h = hgt();
        x.fillStyle = this.color;
        x.fillRect(h * this.x, h * this.y, h * this.width, h * this.height);
        {
            let diff = this.ry - this.y;
            this.y += diff / config.smoothening;
        }
    }
    act() {
        this.ud = !this.ud;
    }
    tick() {
        if (!plr.alive) {
            if (this.exitTick-- < 0) {
                states.deathScreen();
                dt.running = false;
            }
            return;
        }
        this.ry -= this.xl * dt.spdM;
        this.xl -= this.ud ? config.gravity : -config.gravity;
        this.xl *= config.airResistance;
        if (this.ry < config.boundary.ceil) {
            this.ry = config.boundary.ceil;
            this.xl = 0;
        }
        if (this.ry + this.height > config.boundary.floor) {
            this.ry = config.boundary.floor - this.height;
            this.xl = 0;
        }
        // this.y = this.ry;
    }
}
