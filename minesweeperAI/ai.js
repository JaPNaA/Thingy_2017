var ai={
    a:{
        c:function(e) {
            if(!e.classList.contains("show")&&!e.getAttribute('aiC')){
                clearTimeout(ai.gc.sI);
                ai.gc.sI=setTimeout(ai.gc.f,ai.gc.t);
                e.setAttribute('aiC',!0);
                console.log("Click: "+e.getAttribute('c'));
            }
            e.dispatchEvent(new MouseEvent('click'));
        },
        f:function(e){
            e.getAttribute('aiF')||(function(){
                e.dispatchEvent(new MouseEvent('auxclick'));
                e.setAttribute('aiF',!0);
                clearTimeout(ai.gc.sI);
                ai.gc.sI=setTimeout(ai.gc.f,ai.gc.t);
                console.log("Flag: "+e.getAttribute('c'));
            }());
        }
    },
    s:{
        fAr:function(th) {
            if(!th.getAttribute("aiArF")){
            var f = 0,
                a = th.getAttribute('c').split(",");
            a[1] = ~~a[1];
            a[0] = ~~a[0];
            $("[c='" + (a[0] - 1) + "," + (a[1] - 1) + "']") &&
            ai.a.f($("[c='" + (a[0] - 1) +"," + (a[1] - 1) + "']"));

            $("[c='" + (a[0] - 1) + "," + a[1] + "']") &&
            ai.a.f($("[c='" + (a[0] - 1) + "," + a[1] +"']"));

            $("[c='" + (a[0] - 1) + "," + (a[1] + 1) + "']") &&
            ai.a.f($("[c='" + (a[0] - 1) +"," + (a[1] + 1) + "']"));

            $("[c='" + a[0] + "," + (a[1] -1) + "']") &&
            ai.a.f($("[c='" +a[0] + "," + (a[1] - 1) +"']"));

            $("[c='" + a[0] + "," + a[1] +"']") &&
            ai.a.f($("[c='" + a[0] +"," + a[1] + "']"));

            $("[c='" + a[0] + "," + (a[1] +1) + "']") &&
            ai.a.f($("[c='" +a[0] + "," + (a[1] + 1) +"']"));

            $("[c='" + (a[0] + 1) + "," + (a[1] - 1) + "']") &&
            ai.a.f($("[c='" + (a[0] + 1) +"," + (a[1] - 1) + "']"));

            $("[c='" + (a[0] + 1) + "," + a[1] + "']") &&
            ai.a.f($("[c='" +(a[0] + 1) + "," + a[1] +"']"));

            $("[c='" + (a[0] + 1) + "," + (a[1] + 1) + "']") &&
            ai.a.f($("[c='" + (a[0] + 1) +"," + (a[1] + 1) + "']"));
            th.setAttribute('aiArF',!0);
            console.warn("specialAction/flagAround:",a[0],a[1]);
            }
        },
        cAr:function(th){
            if(!th.getAttribute("aiArC")){
            var f = 0,
                a = th.getAttribute('c').split(",");
            a[1] = ~~a[1];
            a[0] = ~~a[0];
            $("[c='" + (a[0] - 1) + "," + (a[1] - 1) + "']") &&
            ai.a.c($("[c='" + (a[0] - 1) + "," + (a[1] - 1) + "']"));

            $("[c='" + (a[0] - 1) + "," + a[1] + "']") &&
            ai.a.c($("[c='" + (a[0] - 1) + "," + a[1] + "']"));

            $("[c='" + (a[0] - 1) + "," + (a[1] + 1) + "']") &&
            ai.a.c($("[c='" + (a[0] - 1) + "," + (a[1] + 1) + "']"));

            $("[c='" + a[0] + "," + (a[1] - 1) + "']") &&
            ai.a.c($("[c='" + a[0] + "," + (a[1] - 1) + "']"));

            $("[c='" + a[0] + "," + a[1] + "']") &&
            ai.a.c($("[c='" + a[0] + "," + a[1] + "']"));

            $("[c='" + a[0] + "," + (a[1] + 1) + "']") &&
            ai.a.c($("[c='" + a[0] + "," + (a[1] + 1) + "']"));

            $("[c='" + (a[0] + 1) + "," + (a[1] - 1) + "']") &&
            ai.a.c($("[c='" + (a[0] + 1) + "," + (a[1] - 1) + "']"));

            $("[c='" + (a[0] + 1) + "," + a[1] + "']") &&
            ai.a.c($("[c='" + (a[0] + 1) + "," + a[1] + "']"));

            $("[c='" + (a[0] + 1) + "," + (a[1] + 1) + "']") &&
            ai.a.c($("[c='" + (a[0] + 1) + "," + (a[1] + 1) + "']"));
            th.setAttribute("aiArC",!0);
            console.warn("specialAction/clickAround:",a[0],a[1]);
            }
        },
        cE:function() {
            ai.dt.a.forEach(function(o,i) {
                o.forEach(function(o,i2) {
                    ai.a.c(o);
                });
            });
            console.warn("specialAction/clickAll");
        }
    },
    lp:{
        fA:function() {
            ai.dt.a.forEach(function(o,i) {
                o.forEach(function(o,i2) {
                    o.classList.contains("show")&&
                    ai.r(o)==o.getAttribute("v")&&ai.s.fAr(o);
                });
            });
            console.error("loop/flagIs");
        },
        cA:function() {
            ai.dt.a.forEach(function(o,i) {
                o.forEach(function(o,i2) {
                    o.classList.contains("show")&&
                    ai.gf(o)==o.getAttribute("v")&&ai.s.cAr(o);
                })
            })
            console.error("loop/clickIs");
        }
    },
    dt:{
        a:[],
        b:[]
    },
    c:function(x,y,t){
        if(typeof x!="object"){
            t?()=>ai.a.f(ai.dt.a[y][x]):ai.a.c(ai.dt.a[y][x]);
        } else {
            ai.a.c(x);
        }
        $("div>div>div")||location.reload(!1);
        $("div>div>div").innerHTML=="You lost."&&location.reload(!1);
    },
    r:function(th) {
        if(th.getAttribute("aiArC")&&th.getAttribute("aiArF")) return;
        var f = 0,
            a = th.getAttribute('c').split(","),
            m = 0;
        a[1] = ~~a[1];
        a[0] = ~~a[0];
        $("[c='" + (a[0] - 1) + "," + (a[1] - 1) + "']") ?
        $("[c='" + (a[0] - 1) +"," + (a[1] - 1) + "']").classList.contains("show") &&
        f++:m++;

        $("[c='" + (a[0] - 1) + "," + a[1] + "']") ?
        $("[c='" + (a[0] - 1) + "," + a[1] +"']").classList.contains("show") &&
        f++:m++;

        $("[c='" + (a[0] - 1) + "," + (a[1] + 1) + "']") ?
        $("[c='" + (a[0] - 1) +"," + (a[1] + 1) + "']").classList.contains("show") &&
        f++:m++;

        $("[c='" + a[0] + "," + (a[1] -1) + "']") ?
        $("[c='" +a[0] + "," + (a[1] - 1) +"']").classList.contains("show") &&
        f++:m++;

        $("[c='" + a[0] + "," + a[1] +"']") ?
        $("[c='" + a[0] +"," + a[1] + "']").classList.contains("show") &&
        f++:m++;

        $("[c='" + a[0] + "," + (a[1] +1) + "']") ?
        $("[c='" +a[0] + "," + (a[1] + 1) +"']").classList.contains("show") &&
        f++:m++;

        $("[c='" + (a[0] + 1) + "," + (a[1] - 1) + "']") ?
        $("[c='" + (a[0] + 1) +"," + (a[1] - 1) + "']").classList.contains("show") &&
        f++:m++;

        $("[c='" + (a[0] + 1) + "," + a[1] + "']") ?
        $("[c='" +(a[0] + 1) + "," + a[1] +"']").classList.contains("show") &&
        f++:m++;

        $("[c='" + (a[0] + 1) + "," + (a[1] + 1) + "']") ?
        $("[c='" + (a[0] + 1) +"," + (a[1] + 1) + "']").classList.contains("show") &&
        f++:m++;

        console.log("getData/hiddenAround:",a[0],a[1],"Return "+((9-m)-f));
        return (9-m)-f;
    },
    gf:function(th){
        if(th.getAttribute("aiArC")&&th.getAttribute("aiArF")) return;
        var f = 0,
            a = th.getAttribute('c').split(",");
        a[1] = ~~a[1];
        a[0] = ~~a[0];

        $("[c='" + (a[0] - 1) + "," + (a[1] - 1) + "']") &&
        $("[c='" + (a[0] - 1) +"," + (a[1] - 1) + "']").getAttribute('f') &&
        f++;

        $("[c='" + (a[0] - 1) + "," + a[1] + "']") &&
        $("[c='" +(a[0] - 1) + "," + a[1] +"']").getAttribute('f') &&
        f++;

        $("[c='" + (a[0] - 1) + "," + (a[1] + 1) + "']") &&
        $("[c='" + (a[0] - 1) +"," + (a[1] + 1) + "']").getAttribute('f') &&
        f++;

        $("[c='" + a[0] + "," + (a[1] -1) + "']") &&
        $("[c='" +a[0] + "," + (a[1] - 1) +"']").getAttribute('f') &&
        f++;

        $("[c='" + a[0] + "," + a[1] +"']") &&
        $("[c='" + a[0] +"," + a[1] + "']").getAttribute('f') &&
        f++;

        $("[c='" + a[0] + "," + (a[1] +1) + "']") &&
        $("[c='" +a[0] + "," + (a[1] + 1) +"']").getAttribute('f') &&
        f++;

        $("[c='" + (a[0] + 1) + "," + (a[1] - 1) + "']") &&
        $("[c='" + (a[0] + 1) +"," + (a[1] - 1) + "']").getAttribute('f') &&
        f++;

        $("[c='" + (a[0] + 1) + "," + a[1] + "']") &&
        $("[c='" +(a[0] + 1) + "," + a[1] +"']").getAttribute('f') &&
        f++;

        $("[c='" + (a[0] + 1) + "," + (a[1] + 1) + "']") &&
        $("[c='" + (a[0] + 1) +"," + (a[1] + 1) + "']").getAttribute('f') &&
        f++;

        console.log("getData/flagsAround:",a[0]+","+a[1],"Return "+f);
        return f;
    },
    sIL:undefined,
    gc:{
        sI:0,
        _:!1,
        t:200,
        f:function() {
            ai.gc._=!0;
        },
        ac:function() {
            ai.gc._=!1;
            console.error("_guess called");
            var c;
            do{
                c=ai.dt.a[Math.floor(Math.random()*dt.config.rows)][Math.floor(Math.random()*dt.config.cols)];
                if(~~$("#left").innerHTML.split(" ")[0]==0||!$("td:not(.show):not([f])")) break;
            }while((!(!c.classList.contains("show")&&!c.getAttribute('f'))))
            ai.c(c);
            console.error("_guess: "+c.getAttribute("c"));
        }
    },
    mSi:0
}

$("tr").forEach(function(o){
ai.dt.a.push([].slice.call(o.$("td")));
});

//First click
ai.c(Math.floor(dt.config.cols/2),Math.floor(dt.config.rows/2))
mSi=setInterval(function(){
    ai.gc._&&ai.gc.ac();
    setTimeout(()=>ai.lp.fA(),10);
    setTimeout(()=>ai.lp.cA(),75);
    if(~~$("#left").innerHTML.split(" ")[0]==0){
        ai.s.cE();
        clearInterval(mSi);
    }
    console.error("_Looped");
},100);
