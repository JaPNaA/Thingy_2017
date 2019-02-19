function $(e){
    return document.getElementById(e);
}

const D = {
        loadn: $("loading"),
        itemC: $("itemC"),
        mLeft: $("moneyLeft"),
        mpBar: $("progressBar"),
        spent: $("moneySpent"),
        fHead: $("head"),
        sMony: $("showMoney"),
        techC: $("techCount"),
        ev: $("ev")
    },
    C = {
        moneyStart: bigInt(1e33).times(100),
        moneyLeft: bigInt(1e33).times(100),
        obs: [],
        tech: 0,
        boosts: {
            money: bigInt(0),
            tech: 0,
            buy: [],
            offline: false
        },
        sIStablizer: Date.now()
    };

function pytha(x, y) {
    return Math.sqrt(x ** 2 + y ** 2);
}

String.prototype.splice = function(s, d, r) {
    return this.slice(0, s) + r + this.slice(s + Math.abs(d));
};

var ITEMS = [];

async function load() {
    await new Promise(function(res) {
        var a = new XMLHttpRequest();
        a.open("GET", "items.json");
        a.responseType = "json";
        a.addEventListener("load", function() {
            if (typeof a.response == "string") {
                ITEMS = JSON.parse(a.response).sort((a, b) => a.tech - b.tech);
            } else {
                ITEMS = a.response.sort((a, b) => a.tech - b.tech);
            }
            res();
        });
        a.send();
    });

    for (let i of ITEMS) {
        new Item(i).append().resize();
    }

    D.loadn.classList.add("noshow");
    D.ev.classList.remove("noshow");
}

class Item {
    constructor(o) {
        this.p = o;
        this.e = document.createElement("item");
        this.e.classList.add("item", "hidden", "noSelect");
        this.s = false;
        this.aBought = 0;
        this.cooldown = 0;

        var that = this,
            e = this.e;
        addEventListener("resize", function() {
            that.resize();
        });
        e.addEventListener(
            "touchstart",
            function(e) {
                var f = e.changedTouches[0];
                this.selected = true;
                this.touchstartX = f.screenX;
                this.touchstartY = f.screenY;
                this.classList.add("sel");
            },
            {
                passive: true,
                capture: false
            }
        );
        e.addEventListener(
            "touchmove",
            function(e) {
                var f = e.changedTouches[0];
                if (
                    pytha(
                        this.touchstartX - f.screenX,
                        this.touchstartY - f.screenY
                    ) < 64
                ) {
                    this.dispatchEvent(new TouchEvent("touchenter"));
                } else {
                    this.dispatchEvent(new TouchEvent("touchleave"));
                }
            },
            {
                passive: true,
                capture: false
            }
        );
        e.addEventListener("touchleave", function() {
            this.selected = false;
            this.classList.remove("sel");
        });
        e.addEventListener("touchenter", function() {
            this.selected = true;
            this.classList.add("sel");
        });
        e.addEventListener(
            "touchend",
            function(e) {
                if (this.selected) {
                    that.action();
                }
                this.selected = false;
                this.classList.remove("sel");
            },
            {
                passive: true,
                capture: false
            }
        );
        C.obs.push(this);
        {
            let a = document.createElement("div");
            a.classList.add("cooldownC");
            {
                let b = document.createElement("div");
                b.classList.add("cooldown");
                this.cdDiv = b;
                a.appendChild(b);
            }
            e.appendChild(a);
        }
        {
            let a = document.createElement("div");
            a.classList.add("title");
            a.innerHTML = this.p.name;
            e.appendChild(a);
        }
        {
            let a = document.createElement("div");
            a.classList.add("cost", "number");
            if (this.p.cost > 1e9) a.innerHTML = this.p.cost.toPrecision(9);
            else a.innerHTML = this.p.cost;
            e.appendChild(a);
        }
        {
            let a = document.createElement("div");
            a.classList.add("text", "caption");
            a.innerHTML = this.p.caption;
            e.appendChild(a);
        }
        {
            let a = document.createElement("div");
            a.classList.add("tech", "number");
            a.innerHTML = this.p.tech;
            e.appendChild(a);
        }
    }
    action() {
        if (this.p.tech > C.tech) return;
        a: if (this.p.max === undefined || this.aBought < this.p.max) {
            if (Date.now() > this.cooldown) {
                if (this.p.confirm) {
                    if (!confirm(this.p.confirm)) {
                        break a;
                    }
                }
                this.aBought++;
                C.moneyLeft = C.moneyLeft.minus(this.p.cost * 100);
                if (this.p.boost) {
                    let f = C.boosts,
                        g = this.p.boost;
                    if (g.money) f.money = f.money.plus(g.money * 100);
                    f.tech += g.tech || 0;
                    f.offline = g.offline || f.offline;
                    if (g.buy) {
                        f.buy.push(g.buy);
                    }
                }
                if (this.p.cooldown)
                    this.cooldown = Date.now() + this.p.cooldown;
            }
        }
        if (this.p.max !== undefined && this.aBought >= this.p.max) {
            this.e.classList.add("disabled");
        }
    }
    append() {
        D.itemC.appendChild(this.e);
        return this;
    }
    resize() {
        var that = this;
        function r() {
            var s = Math.floor(innerWidth / 164),
                w = document.body.clientWidth;
            that.e.style.width = w / s - 24 - 16 / s + "px";
        }
        r();
        setTimeout(r, 120);
        return this;
    }
    refresh() {
        var now = Date.now();
        if (now < this.cooldown) {
            this.cdDiv.style.height =
                (1 - ((this.cooldown - now) / this.p.cooldown) ** 1.4) *
                    this.e.clientHeight +
                "px";
        } else {
            this.cdDiv.style.height = this.e.clientHeight + "px";
        }
        if (C.tech >= this.p.tech) {
            if (!this.s) {
                console.log("s");
                this.e.classList.remove("hidden");
                this.s = true;
            }
        } else if (this.s) {
            console.log("h");
            this.e.classList.add("hidden");
            this.s = false;
        }
    }
}
load();

function reqanf() {
    for (let i of C.obs) {
        i.refresh();
    }
    D.mLeft.innerHTML = (C.moneyLeft.toJSNumber() / 100).toPrecision(9);
    D.spent.innerHTML = (
        C.moneyStart.minus(C.moneyLeft).toJSNumber() / 100
    ).toPrecision(12);
    if (C.showMoney) {
        let a = C.moneyLeft.toString();
        D.sMony.innerHTML = a.splice(a.length - 2, 0, ".");
    }
    D.mpBar.style.width =
        C.moneyLeft.toJSNumber() / C.moneyStart.toJSNumber() * 100 + "%";
    D.techC.innerHTML = C.tech;
    requestAnimationFrame(reqanf);
}
function nSI() {
    C.sIStablizer += 1000;
    setTimeout(function() {
        C.moneyLeft = C.moneyLeft.plus(C.boosts.money);
        C.tech += C.boosts.tech;
        for (let i of C.boosts.buy) {
            C.obs.filter(e => e.p.id == i)[0].action();
        }
        nSI();
    }, C.sIStablizer - Date.now());
}

reqanf();
nSI();

D.fHead.addEventListener("touchstart", function() {
    C.showMoney = true;
    D.sMony.classList.add("show");
});
D.fHead.addEventListener("touchend", function() {
    C.showMoney = false;
    D.sMony.classList.remove("show");
});
D.fHead.addEventListener("mousedown", function() {
    C.showMoney = true;
    D.sMony.classList.add("show");
});
D.sMony.addEventListener("mouseup", function() {
    C.showMoney = false;
    D.sMony.classList.remove("show");
});
