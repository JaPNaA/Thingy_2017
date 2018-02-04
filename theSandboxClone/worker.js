export default class WebWorker {
    constructor(src) {
        this.worker = new Worker(src);
        this.event = {
            map: []
        };
        this.worker.addEventListener("message", e => this.onmessage(e.data));
    }
    cmd(cmd, ...dt) {
        switch (cmd) {
            case "setMap":
                this.worker.postMessage(["setMap", dt[0], dt[1], dt[2]]);
                break;
            case "iterate":
                this.worker.postMessage(["iterate"]);
                break;
            case "setBlock":
                this.worker.postMessage(["setBlock", dt[0], dt[1], dt[2]]);
        }
    }
    onmessage(e) {
        for (let i of this.event[e[0]]) {
            i(e.slice(1));
        }
    }
    on(type, callback) {
        this.event[type].push(callback);
    }
}