// Framework
Element.prototype.i = function(e) {
    if (e === undefined) {
        return this.$("[i]", 2);
    } else {
        return this.$("[i='" + e + "']", 1);
    }
};
Element.prototype.v = function(e) {
    return this.value * 1;
};
Array.prototype.on = Element.prototype.on = function(e, f) {
    e.split(" ").forEach(function(o) {
        if (this.typeof == "array") {
            this.forEach(function(i) {
                i.addEventListener(o, f);
            });
        } else {
            this.addEventListener(o, f);
        }
    });
};
Array.prototype.typeof = "array";
Element.prototype.typeof = "element";

// Pythagoras
(function() {
    var e = $("#pythagoras");
    e.i().on("keyup change", function(x) {
        var filled = [],
            nFilled = [],
            me = x.path[0];
        me.a = false;
        e.i().forEach(function(o) {
            if (o.value != "" && o.value * 1 !== NaN && !o.a) {
                filled.push(o);
            } else {
                nFilled.push(o);
            }
        });
        if (filled.length < 2) return;
        if (!nFilled.length) return;
        if (me != e.i(0)) {
            e.i(0).value = Math.sqrt(
                Math.pow(e.i(1).v(), 2) + Math.pow(e.i(2).v(), 2)
            );
            e.i(0).a = !0;
        } else {
            nFilled[0].value = Math.sqrt(
                Math.pow(e.i(0).v(), 2) - Math.pow((filled[1] || e.i(1)).v(), 2)
            );
            nFilled[0].a = !0;
        }
    });
})();

(function() {
    var e = $("#circles");
    e.i().on("change keyup", function(x) {
        var me = x.path[0];
        if (me == e.i(0)) {
            // radius
            e.i(1).value = me.v() * 2 || "";
            e.i(2).value = me.v() * 2 * Math.PI || "";
            e.i(3).value = me.v() ** 2 * Math.PI || "";
        }
        if (me == e.i(1)) {
            // diameter
            e.i(0).value = me.v() / 2 || "";
            e.i(2).value = me.v() * Math.PI || "";
            e.i(3).value = (me.v() / 2) ** 2 * Math.PI || "";
        }
        if (me == e.i(2)) {
            // circumference
            e.i(0).value = me.v() / Math.PI / 2 || "";
            e.i(1).value = me.v() / Math.PI || "";
            e.i(3).value = (me.v() / Math.PI / 2) ** 2 * Math.PI || "";
        }
        if (me == e.i(3)) {
            // area
            let r = Math.sqrt(me.v() / Math.PI);
            e.i(0).value = r;
            e.i(1).value = r * 2;
            e.i(2).value = r * 2 * Math.PI;
        }
    });
})();

(function() {
    var e = $("#regPolygon");
    e.i().on("change keyup", function(x) {
        if (e.i(0).v() && e.i(1).v()) {
            e.i(2).value = e.i(1).v() * e.i(0).v() / 2;
        }
    });
})();

// Cone
// side = PI * radius * slant
// base = PI * r ** 2
// SA = side + base
