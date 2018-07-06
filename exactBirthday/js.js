const M = document.getElementById("m"),
    BDI = document.getElementById("bdi"),
    BTI = document.getElementById("bti"),
    MC = document.getElementById("mc");
var bd = new Date(localStorage.exactBirthday || 0).getTime();

if(localStorage.exactBirthday){
    var a = localStorage.exactBirthday.split(" ");
    BDI.value = a[0];
    BTI.value = a[1];
}

BDI.addEventListener("change", function(){
    var a = "";
    if(BTI.value){
        a = " " + BTI.value;
    }
    bd = new Date(this.value+a).getTime();
    localStorage.exactBirthday = this.value + a;
});
BTI.addEventListener("change", function(){
    bd = new Date(BDI.value + " " + this.value).getTime();
    localStorage.exactBirthday = BDI.value + " " + this.value;
});
function resize(){
    if(innerWidth < innerHeight){
        M.classList.add("w");
        MC.classList.add("w");
    } else {
        M.classList.remove("w");
        MC.classList.remove("w");
    }
}
resize();
addEventListener("resize", resize);

function reqanf(){
    var n = Date.now();
    m.innerHTML = (n - bd) / 31557600000;
    requestAnimationFrame(reqanf);
}
reqanf();
