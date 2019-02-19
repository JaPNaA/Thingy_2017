class Img{
    constructor(s){
        this.src = s;
        this.e = document.createElement("img");
        this.e.src = this.src;
    }
    draw(x){
        x.drawImage(this.e, 0, 0, wdt(), hgt());
    }
}
