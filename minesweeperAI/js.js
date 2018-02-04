var dt = {
    config: {
        rows: 16,
        cols: 30,
        mines: 99,
        uncoverS: 10
    },
    dt: undefined,
    fc: true,
    time: {
        start: undefined
    },
    sI:{
        timeTrack:0
    }
};
if (dt.config.mines > dt.config.rows * dt.config.cols - 9) {
    throw "Too many mines";
}
if (dt.config.mines < dt.config.rows * dt.config.cols * 0.075) {
    throw "Too little mines";
}
window.dt = dt;
dt.dt = (function() {
    var a = 0,
        f = [];
    for (var d = 0; d < dt.config.rows; d++) {
        f.push(function() {
            var f = [];
            for (var e = 0; e < dt.config.cols; e++) {
                f.push(false);
            }
            return f;
        }());
    }
    do {
        var g = Math.floor(Math.random() * dt.config.rows),
            h = Math.floor(Math.random() * dt.config.cols);
        if (!f[g][h]) {
            f[g][h] = true;
            console.log(g, h);
            a++;
        }
    } while (a < dt.config.mines);
    return f;
}());
document.body.innerHTML = "<div><div>Loading...</div></div>";
document.body.appendChild($('<table><tbody></tbody></table>'));
$('tbody').innerHTML = (function() {
    var f = "";
    for (var a = 0; a < dt.config.rows; a++) {
        f += "<tr>";
        for (var b = 0; b < dt.config.cols; b++) {
            f += "<td m=" + (dt.dt[a][b] ? 1 : 0) + " v=" + (function() {
                var f = 0;
                dt.dt[a] && dt.dt[a][b - 1] && f++;
                dt.dt[a] && dt.dt[a][b + 1] && f++;
                dt.dt[a][b] && f++;
                dt.dt[a - 1] && dt.dt[a - 1][b - 1] && f++;
                dt.dt[a - 1] && dt.dt[a - 1][b] && f++;
                dt.dt[a - 1] && dt.dt[a - 1][b + 1] && f++;
                dt.dt[a + 1] && dt.dt[a + 1][b - 1] && f++;
                dt.dt[a + 1] && dt.dt[a + 1][b] && f++;
                dt.dt[a + 1] && dt.dt[a + 1][b + 1] && f++;
                return f;
            }()) + " c=" + a + "," + b + "></td>";
        }
        f += "</tr>";
    }
    return f;
}());
$('td').forEach(function(o) {
    o.addEventListener("click", function(e) {
        if (!this.getAttribute("f")) {
            if (!this.classList.contains('show')) {
                this.classList.add('show');
                if (!$("td:not(.show):not([m='1'])")) {
                    $('div>div>div').innerHTML = "You win!";
                    $('#time').innerHTML=(new Date().getTime()-dt.time.start)/1000+" seconds";
                    clearInterval(dt.sI.timeTrack);
                }
                if (~~this.getAttribute('m')) {
                    //setTimeout(() => location.reload(), 300);
                    $('td').forEach(function(o) {
                        o.classList.add('show')
                    });
                    $('div>div>div').innerHTML = "You lost.";
                    $('#time').innerHTML=(new Date().getTime()-dt.time.start)/1000+" seconds";
                    clearInterval(dt.sI.timeTrack);
                }
                if (this.getAttribute('v') == "0" && !this.getAttribute(
                        'ar')) {
                    var a = this.getAttribute('c').split(",");
                    a[1] = ~~a[1];
                    a[0] = ~~a[0];
                    this.setAttribute('ar', 1);
                    setTimeout(function() {
                        $("[c='" + (a[0] - 1) + "," + (
                                    a[1] - 1) +
                                "']") &&
                            $("[c='" + (a[0] - 1) + "," +
                                (a[1] - 1) +
                                "']").click();
                        $("[c='" + (a[0] - 1) + "," + (
                                a[1]) + "']") &&
                            $("[c='" + (a[0] - 1) + "," +
                                (a[1]) +
                                "']")
                            .click();
                        $("[c='" + (a[0] - 1) + "," + (
                                    a[1] + 1) +
                                "']") &&
                            $("[c='" + (a[0] - 1) + "," +
                                (a[1] + 1) +
                                "']").click();
                        $("[c='" + (a[0]) + "," + (a[1] -
                                1) + "']") &&
                            $("[c='" + (a[0]) + "," + (
                                    a[1] - 1) +
                                "']")
                            .click();
                        $("[c='" + (a[0]) + "," + (a[1]) +
                                "']") &&
                            $(
                                "[c='" + (a[0]) + "," +
                                (a[1]) +
                                "']").click();
                        $("[c='" + (a[0]) + "," + (a[1] +
                                1) + "']") &&
                            $("[c='" + (a[0]) + "," + (
                                    a[1] + 1) +
                                "']")
                            .click();
                        $("[c='" + (a[0] + 1) + "," + (
                                    a[1] - 1) +
                                "']") &&
                            $("[c='" + (a[0] + 1) + "," +
                                (a[1] - 1) +
                                "']").click();
                        $("[c='" + (a[0] + 1) + "," + (
                                a[1]) + "']") &&
                            $("[c='" + (a[0] + 1) + "," +
                                (a[1]) +
                                "']")
                            .click();
                        $("[c='" + (a[0] + 1) + "," + (
                                    a[1] + 1) +
                                "']") &&
                            $("[c='" + (a[0] + 1) + "," +
                                (a[1] + 1) +
                                "']").click();
                    }, dt.config.uncoverS);
                }
                if (dt.fc) {
                    if (~~this.getAttribute('m')) {
                        location.reload(!1);
                    }
                    dt.time.start = new Date().getTime();
                    $('div>div').innerHTML =
                        "<div>Data:</div> <dt id=time></dt><dt id=left></dt>";
                        $('#time').innerHTML="0 seconds";
                        $('#left').innerHTML=dt.config.mines+" mines left";
                    dt.sI.timeTrack=setInterval(function() {
                        $('#time').innerHTML = Math.floor(
                            (new Date().getTime() -
                                dt.time.start) /
                            1e3) + " seconds";
                    }, 37);
                }
                dt.fc = false;
            } else {
                if (e.isTrusted) {
                    var that = this;
                    if (!this.getAttribute('ar') && (function() {
                            var f = 0,
                                a = that.getAttribute('c').split(
                                    ",");
                            a[1] = ~~a[1];
                            a[0] = ~~a[0];
                            that.setAttribute('ar', 1);
                            $("[c='" + (a[0] - 1) + "," + (
                                a[1] - 1) + "']") && $(
                                "[c='" + (a[0] - 1) +
                                "," + (a[1] - 1) + "']"
                            ).getAttribute('f') && f++;
                            $("[c='" + (a[0] - 1) + "," + a[
                                    1] + "']") && $("[c='" +
                                    (a[0] - 1) + "," + a[1] +
                                    "']").getAttribute('f') &&
                                f++;
                            $("[c='" + (a[0] - 1) + "," + (
                                a[1] + 1) + "']") && $(
                                "[c='" + (a[0] - 1) +
                                "," + (a[1] + 1) + "']"
                            ).getAttribute('f') && f++;
                            $("[c='" + a[0] + "," + (a[1] -
                                    1) + "']") && $("[c='" +
                                    a[0] + "," + (a[1] - 1) +
                                    "']").getAttribute('f') &&
                                f++;
                            $("[c='" + a[0] + "," + a[1] +
                                "']") && $("[c='" + a[0] +
                                "," + a[1] + "']").getAttribute(
                                'f') && f++;
                            $("[c='" + a[0] + "," + (a[1] +
                                    1) + "']") && $("[c='" +
                                    a[0] + "," + (a[1] + 1) +
                                    "']").getAttribute('f') &&
                                f++;
                            $("[c='" + (a[0] + 1) + "," + (
                                a[1] - 1) + "']") && $(
                                "[c='" + (a[0] + 1) +
                                "," + (a[1] - 1) + "']"
                            ).getAttribute('f') && f++;
                            $("[c='" + (a[0] + 1) + "," + a[
                                    1] + "']") && $("[c='" +
                                    (a[0] + 1) + "," + a[1] +
                                    "']").getAttribute('f') &&
                                f++;
                            $("[c='" + (a[0] + 1) + "," + (
                                a[1] + 1) + "']") && $(
                                "[c='" + (a[0] + 1) +
                                "," + (a[1] + 1) + "']"
                            ).getAttribute('f') && f++;
                            return f == that.getAttribute(
                                'v');
                        }())) {
                        var a = this.getAttribute('c').split(
                            ",");
                        a[1] = ~~a[1];
                        a[0] = ~~a[0];
                        this.setAttribute('ar', 1);
                        $("[c='" + (a[0] - 1) + "," + (a[1] - 1) +
                                "']") &&
                            $("[c='" + (a[0] - 1) + "," + (a[1] -
                                    1) +
                                "']").click();
                        $("[c='" + (a[0] - 1) + "," + (a[1]) +
                                "']") &&
                            $("[c='" + (a[0] - 1) + "," + (a[1]) +
                                "']")
                            .click();
                        $("[c='" + (a[0] - 1) + "," + (a[1] + 1) +
                                "']") &&
                            $("[c='" + (a[0] - 1) + "," + (a[1] +
                                    1) +
                                "']").click();
                        $("[c='" + (a[0]) + "," + (a[1] - 1) +
                                "']") &&
                            $("[c='" + (a[0]) + "," + (a[1] - 1) +
                                "']")
                            .click();
                        $("[c='" + (a[0]) + "," + (a[1]) + "']") &&
                            $(
                                "[c='" + (a[0]) + "," + (a[1]) +
                                "']").click();
                        $("[c='" + (a[0]) + "," + (a[1] + 1) +
                                "']") &&
                            $("[c='" + (a[0]) + "," + (a[1] + 1) +
                                "']")
                            .click();
                        $("[c='" + (a[0] + 1) + "," + (a[1] - 1) +
                                "']") &&
                            $("[c='" + (a[0] + 1) + "," + (a[1] -
                                    1) +
                                "']").click();
                        $("[c='" + (a[0] + 1) + "," + (a[1]) +
                                "']") &&
                            $("[c='" + (a[0] + 1) + "," + (a[1]) +
                                "']")
                            .click();
                        $("[c='" + (a[0] + 1) + "," + (a[1] + 1) +
                                "']") &&
                            $("[c='" + (a[0] + 1) + "," + (a[1] +
                                    1) +
                                "']").click();
                    }
                }
            }
        }
    });
    o.addEventListener('auxclick', function() {
        if (!this.classList.contains('show'))
            this.getAttribute('f') ? this.setAttribute("f", "") :
            this.setAttribute('f', 1);
        dt.fc || ($('#left').innerHTML = dt.config.mines - $('[f="1"]', 2).length + " mines left");
    });
});
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, true);
$('div>div').innerHTML = "Click anywhere on the grey to start.";
