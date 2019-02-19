// ported from: Java -> JavaScript
//              Console -> Canvas
// https://repl.it/@JaPNaA/Conways-Game-of-Life

// IMPORTED FROM REPL.IT

const CVS = document.getElementById("cvs"),
      X = CVS.getContext("2d");

CVS.width = innerWidth;
CVS.height = innerHeight;

class Game {
  constructor(){
    // can be configured
    this.pxdensity = 6; // pixels per alive cell
    this.startDensity = 4; // 1 / this fill at start
    this.wrap = true; // no boundaries
    this.repod = 3; // how many required to create a new 
    
    this.D = [];
    this.generation = 0;
    this.width = Math.ceil(innerWidth / this.pxdensity);
    this.height = Math.ceil(innerHeight / this.pxdensity);
    for(let i = 0; i < this.height; i++){
      let a = [];
      for(let j = 0; j < this.width; j++){
        a.push(false);
      }
      this.D.push(a);
    }
    
    var initAmount = this.width * this.height / this.startDensity;
    while(initAmount > 0){
      let a = Math.floor(Math.random() * this.width * this.height),
        x = a % this.width,
        y = Math.floor(a / this.width);
      console.log(y);
      if(this.D[y][x]) {
        continue;
      }
      this.D[y][x] = true;
      initAmount--;
    }
  }
  draw(){
    X.globalAlpha = 0.95;
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        X.fillStyle = this.D[y][x] ? "#000" : "#FFF";
        X.fillRect(x * this.pxdensity, y * this.pxdensity, this.pxdensity, this.pxdensity);
      }
    }
    X.save();
    X.font = "bold 36px Arial";
    X.fillStyle = "#F00";
    X.shadowBlur = 4;
    X.shadowColor = "rgba(0, 0, 0, 0.35)";
    X.shadowOffsetX = 2;
    X.shadowOffsetY = 4;
    X.fillText(
      "Generation " + this.generation, 
      8, 36
      );
    X.restore();
  }
  tick(){
    if(pause || kpause) return;
    var bf = [];
    this.generation++;
    
    for(let i = 0; i < this.height; i++){
      bf.push([]);
      for(let j = 0; j < this.width; j++)
        bf[i][j] = this.D[i][j];
    }
    
    for(let y = 0; y < this.height; y++)
      for(let x = 0; x < this.width; x++){
        var nb = this.getNeighbours(bf, y, x);
        if(this.D[y][x]){
          if(nb < 2) {
            this.D[y][x] = false;
          } else if(nb > 3) {
            this.D[y][x] = false;
          }
        }
        if(nb == this.repod) {
          this.D[y][x] = true;
        }
      }
  }
  getNeighbours(ar, y, x){
    var a = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ],
      f = 0;
    for(let i = 0; i < a.length; i++){
      if(this.wrap){
        if(
          ar
          [ (y + a[i][0] + this.height) % this.height]
          [ (x + a[i][1] + this.width) % this.width]){
          f++;
        }
      } else {
        if(
          y + a[i][0] < this.height &&
          x + a[i][1] < this.width &&
          y + a[i][0] > 0 &&
          x + a[i][1] > 0
          ){
            if(ar[y + a[i][0]][x + a[i][1]]){
              f++;
            }
          }
      }
    }
    return f;
  }
}

var G = new Game(),
    mouseDown = false,
    pause = false,
    kpause = false;
G.draw();
setInterval(function(){
  G.tick();
  G.draw();
}, 100);

addEventListener("contextmenu", e=>e.preventDefault());
addEventListener("mousedown", function(e){
  mouseDown = e.button + 1;
  pause = true;
  var y = Math.floor(e.clientY / G.pxdensity),
      x = Math.floor(e.clientX / G.pxdensity);
  G.D[y][x] = mouseDown - 1 ? false : true;
});
addEventListener("mouseup", function(){
  mouseDown = false;
  pause = false;
});
addEventListener("mousemove", function(e){
  if(!mouseDown) return;
  var y = Math.floor(e.clientY / G.pxdensity),
      x = Math.floor(e.clientX / G.pxdensity);
  G.D[y][x] = mouseDown - 1 ? false : true;
  G.draw();
});
addEventListener("blur", function(e){
  mouseDown = false;
  pause = false;
});
addEventListener("keydown", function(e){
  if(e.keyCode == 13){
    for(let i of G.D){
    	for(let j = 0; j < i.length; j++){
    		i[j] = false;
      }
    }
    kpause = true;
    return;
  }
  if(e.keyCode == 39){
    kpause = false;
    G.tick();
    G.draw();
    kpause = true;
    return;
  }
  if(e.keyCode == 69){
    G.repod = Math.floor(prompt("Enter value to set repod to... (int)") * 1) || 3;
    G.wrap = !! (prompt("Enter value to set wrap to... (1/0)") * 1);
    return;
  }
  kpause = !kpause;
});
