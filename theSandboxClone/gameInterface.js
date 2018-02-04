function invert(e) {
    var a = parseInt(e.slice(1), 16);
    if (!a) return "#FFFFFF";
    return "#" + (0xFFFFFF - a).toString(16).padStart(6, 0);
}

class ListInterface {
    constructor(opt) {
        this.elm = document.createElement("div");
        this.elm.classList.add("listInterface");

        var optdl = opt.data.length,
            onclick = function (e) {
                opt.onselect(this.$num, e);
            };
        for (let j = 0; j < optdl; j++) {
            let i = opt.data[j];

            let a = document.createElement("div");
            a.classList.add("item");

            {
                let b = document.createElement("div");
                b.classList.add("ico");
                b.style.backgroundColor = i.color;
                b.style.border = invert(i.color) + " 1px solid";

                a.appendChild(b);
            }

            {
                let b = document.createTextNode(i.name);
                a.appendChild(b);
            }

            {
                let b = document.createElement("div");
                b.classList.add("no");
                b.innerHTML = j;

                a.appendChild(b);
            }

            a.title = i.description;
            
            a.$num = j;

            a.addEventListener("click", onclick);

            this.elm.appendChild(a);
        }
    }
}

class ModulesInterface {
    constructor() {
        this.elm = document.createTextNode("Work-in-progress");
    }
}

export default class GameInterface {
    constructor(opt, data) {
        this.elm = document.createElement("div");
        this.elm.classList.add("gameInterface", "noselect");

        if (opt.width) { // -16px for 8px padding
            this.elm.style.width = opt.width - 16 + "px";
        }
        if (opt.height) {
            this.elm.style.height = opt.height - 16 + "px";
        }
        this.elm.style.backgroundColor = opt.backgroundColor || "transparent";
        this.elm.style.color = opt.color || "#000";

        for (let i of data) {
            let a = document.createElement("div");

            if (i.title) {
                let b = document.createElement("div");
                b.classList.add("title");
                b.innerHTML = i.title;

                a.appendChild(b);
            }

            switch (i.type) {
                case "list":
                    {
                        let c = new ListInterface(i);
                        a.appendChild(c.elm);
                        break;
                    }
                case "modules":
                    {
                        let c = new ModulesInterface(i);
                        a.appendChild(c.elm);
                        break;
                    }
            }

            this.elm.appendChild(a);
        }

        (window.targetNode || document.body).appendChild(this.elm);
    }
}