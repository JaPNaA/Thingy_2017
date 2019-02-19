class Ml {
    constructor() {
        this.game = null;
        this.player = false;
        this.mem = {};
        this.log = [];
    }
    start(e) {
        this.game = e;
        this.log.length = 0;
        this.makeMove(e);
    }
    result(e) {
        if (e == 1) {
            console.log("reward");
            for (let i of this.log) {
                this.mem[i[0]][i[1]] += 5;
            }
        } else if (e == 2) {
            console.log("punish");
            for (let i of this.log) {
                this.mem[i[0]][i[1]] -= 2;
            }
        }
        return e;
    }
    makeMove(e) {
        var n = "";
        for (let i of e.board) {
            for (let j of i) {
                n += j;
            }
        }
        if (!this.mem[n]) {
            this.pushNew(n);
        }

        var c = Math.random(),
            t = 0,
            w = 0,
            m = 0;
        for (let i in this.mem[n]) {
            t += this.mem[n][i];
        }
        for (let i in this.mem[n]) {
            if (c * t < this.mem[n][i] + w) {
                m = i;
                break;
            }
            w += this.mem[n][i];
        }
        if (game.e(m % 3, Math.floor(m / 3))) {
            this.log.push([n, m]);
        }
        game.draw(X);
    }
    pushNew(n) {
        var that = this;
        this.mem[n] = {};
        n.split("").forEach(function(i, x) {
            var g = that.mem[n];
            if (i == "0") {
                g[x] = 3;
            } else {
                g[x] = 0;
            }
        });
    }
}
// addEventListener("beforeunload", function() {
//     localStorage.TikTacToeML = JSON.stringify(ml.mem);
// });

{
    let x = new XMLHttpRequest();
    x.open("GET", "data.json");
    x.responseType = "json";
    x.addEventListener("load", function() {
        ml.mem = x.response;
        delete x.response;
    });
    x.send();
}
