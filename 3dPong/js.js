Math.TAU = Math.PI * 2;

var FONT = null;
new THREE.FontLoader().load('ext/font.json', function (f) {
    FONT = f;
    dispatchEvent(new Event("loadfont"));
});

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });

        { // setup renderer / camera
            this.resize(this);

            // not sure what these do
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMapSoft = true;

            document.body.appendChild(this.renderer.domElement);

            this.camera.position.x = 0;
            this.camera.position.y = 75;
            this.camera.position.z = -7;

            this.camera.rotation.x = 0.2 * Math.TAU;
            this.camera.rotation.y = 0.5 * Math.TAU;
            this.camera.rotation.z = 0;
        }

        this.key = [];

        this.ball = new Ball();
        this.paddle1 = new Paddle1();
        this.paddle2 = new Paddle2();
        this.light = new Light();
        this.wall = new Wall(32);
        this.wall2 = new Wall(-32);
        this.text = new Text("3D Pong by JaPNaA", 2.5);

        for (let i of [this.ball, this.paddle1, this.paddle2, this.light, this.wall, this.wall2, this.text]) {
            this.scene.add(i.obj);
        }

        this.scene.add(new THREE.AmbientLight(0x888888));

        // dev
        // this.scene.add(new THREE.CameraHelper(this.light.obj.shadow.camera));

        this.then = 0;
        this.playWin = 0;
        this.compWin = 0;

        this.start();
    }
    resize() {
        var dpi = devicePixelRatio;
        this.renderer.setSize(innerWidth * dpi, innerHeight * dpi);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }
    keydown(e) {
        this.key[e.keyCode] = true;
    }
    keyup(e) {
        this.key[e.keyCode] = false;
    }
    touchstart(e) {
        e.preventDefault();
        if (e.changedTouches[0].clientX < innerWidth / 2) {
            this.key.touch = 1;
        } else {
            this.key.touch = 2;
        }
    }
    touchend(e) {
        e.preventDefault();
        this.key.touch = 0;
    }
    touchmove(e) {
        this.touchstart(e);
    }
    blur() {
        this.key.length = 0;
    }
    render(now) {
        var that = this;
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(e => that.render(e));

        this.tick(now - this.then);
        this.then = now;
    }
    async tick(e) {
        if (!e) return;
        for (let i of [this.paddle1, this.paddle2, this.ball]) {
            i.tick(e, this.key, this);
        }
    }
    mousemove(e) {
        // broken
        // this.camera.rotation.y = -e.clientX / innerWidth * Math.TAU;
        // this.camera.rotation.x = e.clientY / innerHeight * Math.TAU;
        this.camera.rotation.x = (0.2 * Math.TAU + e.clientY / innerHeight - 0.5);
        this.camera.rotation.y = (0.5 * Math.TAU - e.clientX / innerWidth + 0.5);
    }
    start() {
        this.render();
    }
}
class Paddle {
    constructor() {
        this.color = 0xFFFFFF;
        this.shininess = 75;
        this.specular = 0x222222;
        this.width = 6;
        this.height = 2;
        this.length = 2;

        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        this.material = new THREE.MeshStandardMaterial({});
        this.material.color = new THREE.Color(this.color);

        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.obj.receiveShadow = true;
        this.obj.castShadow = true;
    }
    tick() {}
}
class Paddle1 extends Paddle {
    constructor() {
        super();

        this.obj.position.x = 0;
        this.obj.position.y = 0;
        this.obj.position.z = 0;

        this.v = 0;
    }
    tick(T, K) {
        if (K[65] || K[37] || K.touch == 1) {
            this.v += 0.005;
        }
        if (K[68] || K[39] || K.touch == 2) {
            this.v -= 0.005;
        }

        this.obj.position.x += this.v * T;
        this.v *= 0.995 ** T;

        if (this.obj.position.x < -28) {
            this.obj.position.x = -28;
        } else if (this.obj.position.x > 28) {
            this.obj.position.x = 28;
        }
    }
}
class Paddle2 extends Paddle {
    constructor() {
        super();

        this.obj.position.x = 0;
        this.obj.position.y = 0;
        this.obj.position.z = 40;
        this.maxSpeed = 0.2;
    }
    tick(T, K, G) {
        var diff = G.ball.obj.position.x - this.obj.position.x;

        if (Math.abs(diff) > this.maxSpeed) {
            this.obj.position.x += this.maxSpeed * (diff < 0 ? -1 : 1);
        } else {
            this.obj.position.x += diff;
        }

        if (this.obj.position.x < -28) {
            this.obj.position.x = -28;
        } else if (this.obj.position.x > 28) {
            this.obj.position.x = 28;
        }
    }
}

class Ball {
    constructor() {
        this.color = 0xFF0000;
        this.shininess = 75;
        this.specular = 0x222222;
        this.radius = 1;
        this.segments = 20;

        this.geometry = new THREE.SphereGeometry(this.radius, this.segments, this.segments);
        this.material = new THREE.MeshPhongMaterial({
            color: this.color,
            shininess: this.shininess,
            specular: this.specular
        });

        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.obj.receiveShadow = true;
        this.obj.castShadow = true;

        this.obj.position.z = 5;
        this.vx = (Math.random() - 0.5) / 30;
        this.vz = 0.01;

        this.over = false;
    }
    tick(T, K, G) {
        // this.obj.position.z += 0.1;
        var x = this.obj.position.x,
            z = this.obj.position.z,
            w = this.radius * 2;

        if (x > 30) {
            this.vx = -Math.abs(this.vx);
        } else if (x < -30) {
            this.vx = Math.abs(this.vx);
        }

        for (let i of [G.paddle1, G.paddle2]) {
            let px = i.obj.position.x,
                pz = i.obj.position.z,
                pw = i.width,
                pl = i.length;
            if (
                x < px + pw &&
                x + w > px &&
                z < pz + pl &&
                z + w > pz
            ) {
                if (i == G.paddle1) {
                    this.vz = Math.abs(this.vz);
                } else {
                    this.vz = -Math.abs(this.vz);
                }
                this.vz *= 1.075;
                this.vx *= 1.02;
                break;
            }
        }

        this.obj.position.x += this.vx * T;
        this.obj.position.z += this.vz * T;

        if (this.obj.position.z < -5) {
            this.over = true;
            G.compWin++;
            G.text.setText("Computer wins! (C: " + G.compWin + ", P: " + G.playWin + ")");
        } else if (this.obj.position.z > 45) {
            this.over = true;
            G.playWin++;
            G.text.setText("Player wins! (C: " + G.compWin + ", P: " + G.playWin + ")");
        }

        if (this.over) {
            this.obj.position.z = 5;
            this.obj.position.x = 0;
            this.vx = (Math.random() - 0.5) / 30;
            this.vz = 0.01;
            this.over = false;
        }
    }
}
class Light {
    constructor() {
        this.obj = new THREE.SpotLight(0xFFFFFF);

        this.obj.angle = Math.TAU * 0.45;
        this.obj.penumbra = 0.3;
        this.obj.position.set(5, 20, -7);
        this.obj.castShadow = true;

        // not sure what these do
        // this.obj.shadow.camera.near = 8;
        // this.obj.shadow.camera.far = 30;
        // this.obj.shadow.mapSize.width = 512;
        // this.obj.shadow.mapSize.height = 512;
    }
}

class Wall {
    constructor(s) {
        this.color = 0xFFFFFF;
        this.shininess = 75;
        this.specular = 0x222222;
        this.width = 2;
        this.height = 8;
        this.length = 40;

        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        this.material = new THREE.MeshStandardMaterial({});
        this.material.color = new THREE.Color(this.color);

        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.obj.receiveShadow = true;
        this.obj.castShadow = true;

        this.obj.position.x = s;
        this.obj.position.y = 4;
        this.obj.position.z = 20;
    }
}

class Text {
    constructor(e, fs) {
        var that = this;
        this.font = FONT;
        this.fontSize = fs;
        this.text = e;
        this.geometry = new THREE.TextGeometry(this.text, {
            font: this.font,
            size: this.fontSize,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: .1,
            bevelSize: .1,
            bevelSegments: 5
        });
        this.material = new THREE.MeshStandardMaterial();
        this.obj = new THREE.Mesh(this.geometry, this.material);

        this.obj.rotation.x = .25 * Math.TAU;
        this.obj.rotation.y = .5 * Math.TAU;

        this.obj.position.z = 20;
        this.obj.position.y = -5;
        this.obj.position.x = 30;
    }
    setText(e) {
        this.text = e;

        this.geometry = new THREE.TextGeometry(this.text, {
            font: this.font,
            size: this.fontSize,
            height: 1,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: .1,
            bevelSize: .1,
            bevelSegments: 5
        });
        this.obj.geometry = this.geometry;
    }
}

class Main {
    constructor() {
        var that = this;
        this.game = new Game();

        var events = ["resize", "keydown", "keyup", "mousemove", "blur", "touchstart", "touchend", "touchmove"];
        for (let i of events) {
            addEventListener(i, e => this.game[i](e));
        }
    }
}

addEventListener("loadfont", function () {
    main = new Main();
});
var main = null;