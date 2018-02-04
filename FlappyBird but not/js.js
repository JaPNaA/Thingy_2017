class Bird {
    constructor(){
        this.type = "bird";
        this.x = .1;
        this.y = .5;
        this.sX = .1;
        this.sY = .5;
        this.width = .025;
        this.height = .025;
        this.color = "#FF0000";
        this.xl = 0;
    }
    draw(){
        var x = cvs.x, hgt = cvs.height, wdt = cvs.width;
        x.fillStyle=this.color;
        x.fillRect(wdt*this.x,
                   hgt*this.sY,
                   wdt*this.width,
                   hgt*this.height);
    }
    move(){
        this.xl += config.tapPower;
    }
    tick(){
        if(this.xl > config.capXl){
            this.xl = config.capXl;
        }
        if(this.xl < -config.capXl){
            this.xl = -config.capXl;
        }
        this.y -= this.xl;
    }
}

class Wall {
    constructor(){
        this.type = "wall";
        this.x = 1;
        this.sX = 1;
        this.topOpen = Math.random() * (1 -config.openingSize);
        this.bottomOpen = this.topOpen + config.openingSize;
        this.color = "#111111";
        this.width = .1;
        this.pt = true;
    }
    draw(){
        var x = cvs.x, hgt = cvs.height, wdt = cvs.width;
        x.fillStyle = this.color;
        x.fillRect(wdt*this.sX,
                   0,
                   wdt*this.width,
                   hgt*this.topOpen);
        x.fillRect(wdt*this.sX,
                   hgt*this.bottomOpen,
                   wdt*this.width,
                   hgt);
    }
    tick(){
        this.x -= config.wallSpeed;
        if(this.x < -0.1){
            obs.splice(1,1);
        }
    }
}

function init(){
    onresize();
    bird = new Bird();
    obs.push(bird);
    obs.draw();
    dt.sI.tick = setInterval(tick, 1000/config.tickSpeed);
    dt.sI.frames = setInterval(obs.draw, 1000/config.framerate);
}

function restart(){
    for(i in obs){
        obs.pop();
    }
    dt = {
        tick: 0,
        points: 0,
        dead: false,
        sI: {
            tick: 0,
            frames: 0
        }
    };
    init();
}

function tick(){
    var c = obs.collision();
    if(!(dt.tick++ % config.wallFreq)){
        obs.push(new Wall());
    }
    obs.forEach(function(o){
        if(o.type == "wall"){
            o.tick();
        }
    });
    bird.xl -= config.gravity;
    bird.tick();
    if(bird.y >= 1 - bird.height || c[0]){
        dt.dead = true;
        deathScreen();
    }
    if(c[1] && !dt.dead){
        dt.points++;
    }
}

function deathScreen(){
    var x = cvs.x, hgt = cvs.height, wdt = cvs.width,
        div = document.createElement("div");
    x.fillStyle = "rgba(0,0,0,0.75)";
    x.fillRect(0,0,wdt,hgt);

    clearInterval(dt.sI.tick);
    clearInterval(dt.sI.frames);

    div.classList.add("deathScreen");
    div.innerHTML = "<div class=deathCard>You went through <div id=walls class=big></div> wall<span class=plural>s</span>, and got <div id=pts class=big></div> points!</div>";
    div.querySelector("#walls").innerHTML = dt.points;
    div.querySelector("#pts").innerHTML = dt.tick;
    if(dt.points == 1){
        div.querySelector(".plural").style.display="none";
    }
    setTimeout(()=> {
        div.addEventListener("touchstart", function(e){
            e.preventDefault();
            document.body.removeChild(this);
            restart();
        });
        div.addEventListener("mousedown", function(){
            document.body.removeChild(this);
            restart();
        });
    },250)
    document.body.appendChild(div);
}

var cvs = document.getElementById("can"),
    obs = [],
    bird,
    config = {
        tickSpeed: 20, // times per second, more = faster
        framerate: 60, // times per second
        wallFreq: 45, // ticks per wall, less = faster
        gravity: .0025, // xl change rate, more = faster
        tapPower: .035, // xl change rate
        capXl: .033, // max xl
        openingSize: 0.2,
        wallSpeed: 0.01, // size of wall opening
        smoothening: 2.5, // inserts in-between frames
    }, dt = {
        tick: 0,
        points: 0,
        dead: false,
        sI: {
            tick: 0,
            frames: 0
        }
    };
cvs.x = cvs.getContext("2d");

obs.draw = function(){
    cvs.x.clearRect(0, 0, cvs.width, cvs.height);
    obs.forEach(function(o){
        if(o.type == "bird"){
            var dif = o.y - o.sY;
            if(dif){
                o.sY += dif / config.smoothening;
            }
        }
        if(o.type == "wall"){
            var dif = o.x - o.sX;
            if(dif){
                o.sX += dif / config.smoothening;
            }
        }
        o.draw();
    });
}

obs.collision = function(){
    f = false, p = false;
    obs.forEach(function(o){
        if(o.type == "bird" ) return;
        if(bird.x + bird.width > o.x &&
           bird.x < o.x + o.width &&
           (
               bird.y < o.topOpen ||
               bird.y + bird.height > o.bottomOpen
           )
          ) {
            f = true;
        }
        if(bird.x > o.x + o.width && o.pt){
            p = true;
            o.pt = false;
        }
    });
    return [f,p];
}

onresize=function(){
    cvs.width=innerWidth;
    cvs.height=innerHeight;
    obs.draw();
};

cvs.addEventListener("touchstart", function(e){
    e.preventDefault();
    bird.move();
});

cvs.addEventListener("mousedown", function(e){
    bird.move();
});

addEventListener("keydown", function(e){
    if([32, 87, 38, 13, 16, 104].includes(e.keyCode)){
        e.preventDefault();
        bird.move();
    }
});

addEventListener("touchmove", function(e){
    e.preventDefault();
});

addEventListener("context-menu", function(e){
    e.preventDefault();
},);

init();
