export default class Canvas {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.X = this.canvas.getContext("2d");
        this.canvas.style.imageRendering = "pixelated";

        this._scale = 1;

        (window.targetNode || document.body).appendChild(this.canvas);
    }
    get width() {
        return this.canvas.width;
    }
    set width(e) {
        this.canvas.width = e;
        this._changeWH();
    }
    get height() {
        return this.canvas.height;
    }
    set height(e) {
        this.canvas.height = e;
        this._changeWH();
    }
    get bg() {
        return this.canvas.style.backgroundColor;
    }
    set bg(e) {
        this.canvas.style.backgroundColor = e;
    }
    get scale() {
        return this._scale;
    }
    set scale(e) {
        this._scale = e;
        this._changeWH();
    }
    _changeWH(e) {
        this.canvas.style.width = this.width * this.scale + "px";
        this.canvas.style.height = this.height * this.scale + "px";
    }
    clear() {
        this.X.clearRect(0, 0, this.width, this.height);
    }
    set(x, y, c) {
        this.X.fillStyle = c;
        this.X.fillRect(x, y, 1, 1);
    }
}