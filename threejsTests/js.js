Math.TAU = Math.PI * 2;

var SCENE = new THREE.Scene(),
    CAM = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100),
    RENDERER = new THREE.WebGLRenderer({
        antialias: true
    }),
    GEO = new THREE.BoxGeometry(3, 3, 3),
    MAT = new THREE.MeshPhongMaterial({
        color: 0xAA0000,
        shininess: 150,
        specular: 0x222222
    }),
    LIGHT = new THREE.SpotLight(0xFFFFFF),
    CUBE = new THREE.Mesh(GEO, MAT),
    CAMH = new THREE.CameraHelper(LIGHT.shadow.camera),
    PLANEGEO = new THREE.BoxGeometry(7, 0.1, 7),
    PLANEMAT = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 50,
        specular: 0x222222
    }),
    PLANE = new THREE.Mesh(PLANEGEO, PLANEMAT),
    THEN = 0;

addEventListener("resize", function () {
    RENDERER.setSize(innerWidth, innerHeight);
});

RENDERER.setSize(innerWidth, innerHeight);
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;
RENDERER.shadowMapSoft = true;

document.body.appendChild(RENDERER.domElement);

//LIGHT.position.set(0, 10, 0);
//LIGHT.shadow.width = 512;
//LIGHT.shadow.height = 512;
//LIGHT.shadow.camera.near = 0.1;
//LIGHT.shadow.camera.far = 100;
//LIGHT.castShadow = true;
//LIGHT.penumbra = 0.3;

LIGHT.angle = Math.TAU * 0.45;
LIGHT.penumbra = 0.3;
LIGHT.position.set(0, 12, 2);
LIGHT.castShadow = true;
LIGHT.shadow.camera.near = 8;
LIGHT.shadow.camera.far = 30;
LIGHT.shadow.mapSize.width = 512;
LIGHT.shadow.mapSize.height = 512;

SCENE.add(new THREE.CameraHelper(LIGHT.shadow.camera));

CUBE.receiveShadow = true;
CUBE.castShadow = true;

PLANE.position.y = -3.5;
PLANE.position.z = -0.75;
PLANE.receiveShadow = true;
PLANE.castShadow = true;

SCENE.add(LIGHT);
SCENE.add(PLANE);
SCENE.add(CUBE);

CAM.position.z = 10 || 1.5;

SCENE.add(new THREE.AmbientLight(0x888888));

function tick(t) {
    CUBE.rotation.x += t / 1000;
    CUBE.rotation.y += t / 1000;
    CUBE.rotation.x = CUBE.rotation.x || 0;
    CUBE.rotation.y = CUBE.rotation.y || 0;

    //CAM.position.x += t / 1000;
    //CAM.position.y += t / 1000;
    //CAM.position.x = CAM.position.x || 0;
    //CAM.position.y = CAM.position.y || 0;
}

function reqanf(e) {
    tick(e - THEN);
    THEN = e;
    RENDERER.render(SCENE, CAM);
    requestAnimationFrame(reqanf);
}
reqanf();
