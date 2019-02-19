const CVS = document.getElementById("cvs"),
    X = CVS.getContext("2d"),
    ml = new Ml();

Math.tau = Math.PI * 2;

class Game {
    constructor(f, X) {
        this.width = 3;
        this.height = 3;
        this.y = false;
        this.turn = f;
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.x = new Path2D();
        {
            let x = this.x;
            x.moveTo(0, 0.1);
            x.lineTo(0.4, 0.5);
            x.lineTo(0.5, 0.4);
            x.lineTo(0.1, 0);
            x.lineTo(0.5, -0.4);
            x.lineTo(0.4, -0.5);
            x.lineTo(0, -0.1);
            x.lineTo(-0.4, -0.5);
            x.lineTo(-0.5, -0.4);
            x.lineTo(-0.1, 0);
            x.lineTo(-0.5, 0.4);
            x.lineTo(-0.4, 0.5);
        }
        this.o = new Path2D();
        {
            let x = this.o;
            x.arc(0, 0, 0.4, 0, Math.tau);
            x.arc(0, 0, 0.5, 0, Math.tau);
        }
        this.resize(X);
    }
    draw(X) {
        X.clearRect(0, 0, X.canvas.width, X.canvas.height);
        var l =
                (X.canvas.width < X.canvas.height
                    ? X.canvas.width
                    : X.canvas.height) / 3,
            that = this;
        X.fillStyle = "rgba(0,0,0,0.05)";
        X.fillRect(0, 0, l*3, l*3);
        X.fillStyle = this.y ? "#800" : "#000";
        this.board.forEach(function(o, y) {
            o.forEach(function(o, x) {
                if (!o) return;
                X.save();
                X.scale(l, l);
                X.translate(x + 0.5, y + 0.5);
                if (o == 1) {
                    X.fill(that.x);
                }
                if (o == 2) {
                    X.fill(that.o);
                }
                X.restore();
            });
        });
    }
    resize(X) {
        X.canvas.width = innerWidth;
        X.canvas.height = innerHeight;
        this.draw(X);
    }
    click(x, y, X) {
        var l =
            X.canvas.width < X.canvas.height ? X.canvas.width : X.canvas.height;
        if(this.y){
            game = new Game(true, X);
            ml.start(game);
            return;
        }
        if (x < l && y < l){
            var ny = Math.floor(y / (l / 3)),
                nx = Math.floor(x / (l / 3));
            this.e(nx, ny)
            this.draw(X);
        }
        if(ml.result(this.check())){
            this.y = true;
        }
        this.draw(X);
    }
    e(x, y){
        this.check();
        if(this.y) return;
        if(this.board[y][x]) return;
        this.board[y][x] = this.turn ? 1 : 2;
        this.turn = !this.turn;
        if(this.turn && !this.check()){
            ml.makeMove(this);
        }
        return true;
    }
    hover(x, y, X){
        var l =
            X.canvas.width < X.canvas.height ? X.canvas.width : X.canvas.height;
        this.draw(X);
        if (!(x < l && y < l) || this.y || x == -1 || y == -1) return;
        var ny = Math.floor(y / (l / 3)),
            nx = Math.floor(x / (l / 3));
        if(this.board[ny][nx]) return;
        X.save();
        X.fillStyle = "rgba(0, 0, 0, 0.2)";
        X.scale(l/3, l/3);
        X.translate(nx + 0.5, ny + 0.5);
        X.fill(this.turn ? this.x : this.o);
        X.restore();
    }
    check(){
        var b = this.board, f = true;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(!b[i][j])
                    f = false;
            }
            let c = b[i];
            if(c[0] && c[0] == c[1] && c[1] == c[2]){
                return c[1];
            }
        }
        for(let i = 0; i < 3; i++){
            if(b[0][i] && b[0][i] == b[1][i] && b[1][i] == b[2][i]){
                return b[1][i];
            }
        }
        if(b[0][0] && b[0][0] == b[1][1] && b[1][1] == b[2][2]){
            return b[1][1];
        }
        if(b[0][2] && b[0][2] == b[1][1] && b[1][1] == b[2][0]){
            return b[1][1];
        }
        if(f){
            this.y = true;
            return "t";
        }
    }
}

var game = new Game(true, X);
ml.start(game);
game.draw(X);

addEventListener("resize", function() {
    if(iPhone10IsUgly) {
        setTimeout(function(){
            game.resize(X);
        }, 120);
    } else {
        game.resize(X);
    }
});
addEventListener("click", function(e) {
    game.click(e.x, e.y, X);
});
addEventListener("mousemove", function(e){
    game.hover(e.x, e.y, X);
});
addEventListener("mouseout", function(e){
    game.hover(-1, -1, X);
});
addEventListener("touchstart", function(e){
    e.preventDefault();
    game.click(e.touches[0].clientX, e.touches[0].clientY, X);
});

// setInterval(function(){
//     for(let i = 0; i < 1000; i++) game.click(Math.random() * CVS.width, Math.random() * CVS.height,X);
// });
