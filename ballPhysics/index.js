// stop repl.it from redirecting console.*
console = parent.console;

const cvs = document.getElementById("can"),
  X = cvs.getContext("2d"),
  dt = {
    fptL: [],
    fpt: 2,
    cfpt: 0
  },
  config = {
    gravity: 2,
    airResistance: 0.98,
    momentum: 0.96
  },
  key = [];

var obs = [];

function average(e) {
  var a = 0;
  e.forEach(function(o) {
    a += o;
  });
  return a / e.length;
}
function getAngle(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}
function fromAngle(x, y, a, d) {
  return {
    x: Math.cos(a) * d + x,
    y: Math.sin(a) * d + y
  };
}
function pytha(a, b) {
  return Math.sqrt(Math.abs(a ** 2 + b ** 2));
}
function W(e){
  return (e) * cvs.width / innerWidth;
}
function H(e){
  return (e - cvs.top) * cvs.height / cvs.clientHeight;
}

obs.draw = function() {
  dt.cfpt++;
  this.forEach(function(o) {
    o.draw();
  });
};
obs.tick = function() {
  this.forEach(function(o) {
    o.tick();
    o.rem();
    o.phy();
  });
  dt.fptL.push(dt.cfpt);
  while (dt.fptL.length > 5) {
    dt.fptL.shift();
  }
  dt.cfpt = 0;
  dt.fpt = average(dt.fptL);
};
obs.event = function(t, e, x) {
  if (t == "mouse") {
    var ar = true;
    for (let o of this) {
      if (o.constructor == Ellipse) {
        if (pytha(o.x - W(x.x), o.y - H(x.y)) < o.radius) {
          o.event(e, x, ar);
          ar = false;
        } else {
          o.event(e, x, false);
        }
      }
    }
  }
};

class Obj {
  constructor() {
    this.x = this.rx = 0;
    this.y = this.ry = 0;
    this.xlY = 0;
    this.xlX = 0;
    this.remove = false;
    this.physics = false;
    this.bounce = 0.64;
    this.weight = 2;
    this.kbControl = false;
    this.drag = true;
  }
  draw() {}
  tick() {}
  set(e, i) {
    this[e] = i;
    return this;
  }
  rem() {
    if (this.remove) {
      if(this.kbControl){
        changeControl();
      }
      obs.splice(obs.indexOf(this), 1);
      console.log("remove");
    }
  }
  phy() {
    if (this.physics) {
      if (this.constructor == Ellipse) {
        var that = this;

        // collision
        obs.forEach(function(o) {
          if (o == that || !o.physics) return;
          if (o.constructor == Ellipse) {
            if (
              pytha(
                that.y - o.y,
                that.x - o.x
              ) <=
              o.radius + that.radius
            ) {
              var a = fromAngle(
                  0,
                  0,
                  getAngle(that, o),
                  pytha(that.xlX, that.xlY)
                ),
                b = fromAngle(0, 0, getAngle(o, that), pytha(o.xlX, o.xlY));
              that.xlX += b.x * (o.weight / that.weight) * o.bounce;
              that.xlY +=
                b.y * (that.weight / o.weight) * o.bounce - config.gravity;
              o.xlX += a.x * (that.weight / o.weight) * o.bounce;
              o.xlY +=
                a.y * (that.weight / o.weight) * o.bounce - config.gravity;
            }
          }
        });

        // Y
        if (this.y + this.radius > 1080) {
          if (Math.abs(this.xlY) < 3) {
            this.xlY = 0;
          } else {
            this.xlY = -this.xlY * this.bounce * this.weight / 2;
          }
          this.y = this.ry = 1080 - this.radius;
        }
        this.hold || (this.xlY += config.gravity * this.weight); // gravity
        if (this.y - this.radius < 0) {
          this.xlY = -this.xlY * this.bounce;
          this.y = this.ry = this.radius;
        }
        this.xlY *= config.airResistance;

        // X
        if (this.x - this.radius < 0) {
          this.xlX = -this.xlX * this.bounce;
          this.x = this.rx = this.radius;
        }
        if (this.x + this.radius > 1920) {
          this.xlX = -this.xlX * this.bounce;
          this.x = this.rx = 1920 - this.radius;
        }
        this.xlX *= config.momentum;
      } else if(this.constructor == Text){
        var hgt = 36, wdt = X.measureText(this.text);
        
        // Y
        if (this.y + hgt/2 > 1080) {
          if (Math.abs(this.xlY) < 3) {
            this.xlY = 0;
          } else {
            this.xlY = -this.xlY * this.bounce * this.weight / 2;
          }
          this.y = this.ry = 1080 - hgt/2;
        }
        this.hold || (this.xlY += config.gravity * this.weight); // gravity
        if (this.y - hgt/2 < 0) {
          this.xlY = -this.xlY * this.bounce;
          this.y = this.ry = hgt/2;
        }
        this.xlY *= config.airResistance;

        // X
        if (this.x - wdt/2 < 0) {
          this.xlX = -this.xlX * this.bounce;
          this.x = this.rx = wdt/2;
        }
        if (this.x + wdt/2 > 1920) {
          this.xlX = -this.xlX * this.bounce;
          this.x = this.rx = 1920 - wdt/2;
        }
        this.xlX *= config.momentum;
      }

      // stop movement
      if (key[80]) {
        this.xlY = 0;
        this.xlX = 0;
      }
    }

    // Keyboard controls
    if (this.kbControl) {
      if (key[37] || key[65]) {
        this.xlX -= 4;
      }
      if (key[38] || key[87]) {
        this.xlY -= 4 + config.gravity * this.weight;
      }
      if (key[39] || key[68]) {
        this.xlX += 4;
      }
      if (key[40] || key[83]) {
        this.xlY += 4 + config.gravity * this.weight;
      }
    }
  }
  event(n, e, y) {
    if(y){
      switch (n) {
        case "down":
          this.hold = true;
          break;
      }
    } else {
      switch (n) {
        case "move":
          if (this.hold) {
            this.xlX = (W(e.x) - this.x) / dt.fpt;
            this.xlY = (H(e.y) - this.y) / dt.fpt;
          }
          break;
        case "up":
          this.hold = false;
          break;
      }
    }
  }
}

class Rect extends Obj {
  constructor(x, y, w, h, c) {
    super();
    this.x = this.rx = x;
    this.y = this.ry = y;
    this.width = w;
    this.height = h;
    this.color = c;
    obs.push(this);
  }
  draw() {
    var sdc = X.shadowColor;
    X.shadowColor = "#000";
    X.fillStyle = this.color;
    X.fillRect(this.x, this.y, this.width, this.height);
    X.shadowColor = sdc;
  }
}

class Ellipse extends Obj {
  constructor(x, y, r, c, o) {
    super();
    this.x = this.rx = x;
    this.y = this.ry = y;
    this.radius = r;
    this.color = c;
    this.opt = o || {};
    obs.push(this);
  }
  draw() {
    X.fillStyle = this.color;
    X.beginPath();
    X.ellipse(
      this.x,
      this.y,
      this.opt.radiusX || this.radius,
      this.opt.radiusY || this.radius,
      this.opt.rotation || 0,
      this.opt.startAngle || 0,
      this.opt.endAngle || 2 * Math.PI,
      this.opt.antiClockwise || false
    );
    X.fill();
    X.closePath();
    this.x += this.xlX / dt.fpt;
    this.y += this.xlY / dt.fpt;
  }
  tick() {
    this.y = this.ry += this.xlY;
    this.x = this.rx += this.xlX;
  }
}

class Text extends Obj {
  constructor(x, y, c, f, t) {
    super();
    this.rx = this.x = x;
    this.ry = this.y = y;
    this.color = c;
    this.font = f;
    this.text = t;
    obs.push(this);
  }
  draw() {
    X.font = this.font;
    X.fillStyle = this.color;
    X.fillText(this.text, this.x, this.y);
    this.x += this.xlX / dt.fpt;
    this.y += this.xlY / dt.fpt;
  }
  tick() {
    this.y = this.ry += this.xlY;
    this.x = this.rx += this.xlX;
    if (this.y < -12) {
      this.remove = !0;
    }
  }
}

// Give shadow
X.shadowColor = "#eee";
X.shadowBlur = 16;

new Rect(0, 0, 1920, 1080, "rgba(0, 0, 0, 0.1)").set("noControl", true);
new Text(32, 58, "#fff", "36px Arial", "Kinda like physics").set("xlY", -0.35);
new Ellipse(128, 360, 84, "#fff")
  .set("physics", true)
  .set("kbControl", true)
  .set("color", "#FDF")
  .set("weight", 3);
for (let i = 0; i < 7; i++){
  let a = Math.random()*65+20;
  new Ellipse(84 * i, 85, a, "#fff")
  .set("physics", true)
  .set("weight", a/24);
}

function changeControl(){
  console.log("tab");
  obs.filter(function(o){
    if(o.kbControl){
      return true;
    }
    return false;
  }).forEach(function(o){
    var i = obs.indexOf(o);
    o.set("kbControl", false).set("color", "#fff");
    do{
      i ++;
      if(!obs[i]){
        i = 0;
        continue;
      }
      if(!obs[i].noControl){
        break;  
      }
    } while(true);
    obs[i].set("kbControl", true)
      .set("color", "#FDF")
      .set("physics", true);
  });
}
function fs(){
  document.body.webkitRequestFullscreen();
  if(!document.webkitFullscreenEnabled){
    open(location.href, "", "top = 0, left = 0, height = 100, width = 100").eval(`
    addEventListener("load", fs);
    `);
  }
}

addEventListener("keydown", function(e) {
  key[e.keyCode] = true;
  if(e.keyCode == 9){
    e.preventDefault();
    changeControl();
  }
  if(e.keyCode == 70){
    fs();
  }
});
addEventListener("keyup", function(e) {
  key[e.keyCode] = false;
});
addEventListener("mousedown", function(e) {
  obs.event("mouse", "down", { x: e.clientX, y: e.clientY });
});
addEventListener("mouseup", function(e) {
  obs.event("mouse", "up", { x: e.clientX, y: e.clientY });
});
addEventListener("click", function(e) {
  obs.event("mouse", "click", { x: e.clientX, y: e.clientY });
});
addEventListener("mousemove", function(e) {
  obs.event("mouse", "move", {
    x: e.clientX,
    y: e.clientY,
    deltaX: e.movementX,
    deltaY: e.movementY
  });
});
addEventListener("touchstart", function(e) {
  e.preventDefault();
  obs.event("mouse", "down", {
    x: e.touches[0].pageX,
    y: e.touches[0].pageY
  });
});
addEventListener("touchend", function(e) {
  e.preventDefault();
  obs.event("mouse", "up", {
    x: -1,
    y: -1
  });
  // Also check click here
});
addEventListener("touchmove", function(e) {
  e.preventDefault();
  obs.event("mouse", "move", {
    x: e.touches[0].pageX,
    y: e.touches[0].pageY
  });
});

(onresize = function(){
  if(innerWidth < innerHeight * 16/9){
    cvs.classList.add("w");
    cvs.classList.remove("h");
    cvs.style.top = 
      (cvs.top = (innerHeight - cvs.clientHeight) / 2) + "px";
    cvs.style.left = cvs.left = 0;
  } else {
    cvs.classList.add("h");
    cvs.classList.remove("w");
    cvs.style.top = cvs.top = 0;
    cvs.style.left = 
      (cvs.left = (innerWidth - cvs.clientWidth) / 2) + "px";
    new Text(32, 260, "#fff", "36px Arial", "The screen window size may cause gliches").set("xlY", -2);
  }
})();

function reqanf() {
  requestAnimationFrame(function() {
    obs.draw();
    reqanf();
  });
}

setInterval(function() {
  obs.tick();
}, 1000 / 20);

reqanf();
