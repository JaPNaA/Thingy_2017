//var space--
var siT, si, hasL = false,
    setUp;

//getTime vars
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var month = new Array(12);
month[0] = "January";
month[1] = "Febuary";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
//--

//function space--

//sets and clear interval
function sI(sn) {
    clearInterval(si);

    switch (sn) {

        case 0:

            document.body.innerHTML = "<span class=Error> Error reloading page... </span>"
            setInterval(function() {
                location.reload(true);
            }, 5000);
            clearInterval(si);
            break;

        case 1:

            si = setInterval(function() {
                //update time
                var a = new gTim();
                gbi("day").innerHTML = a[0];
                gbi("month").innerHTML = a[1];
                gbi("date").innerHTML = a[2];
                gbi("year").innerHTML = a[3];
                gbi("hour").innerHTML = a[4][0];
                gbi('minute').innerHTML = a[4][1];
                gbi('second').innerHTML = a[4][2];
                gbi('millisecond').innerHTML = a[4][3];
            }, siT);
            break;
        case 2:
            debugger
            break;2
            
        default:
            document.body.innerHTML = "<span class=Error> Error reloading page... </span>"
            setInterval(function() {
                location.reload(true);
            }, 5000);
            clearInterval(si);
            break;
    }
}

//First launch/relaunch
function fL() {
    if (hasL) {
        //Hide Elements
        //clear/reset Intervals
    } else {
        //create Elements
        //add Events
        makeSetUp(checkSetUp());
    }
    
}

//get time
function gTim() {
    //get time
    var nd = new Date();
    /*get time parts and return*/
    return [weekday[nd.getDay()], month[nd.getMonth()], nd.getDate(), nd.getFullYear(), fTim(nd)]
}

//formated Hr Mins Secs Millsecs
function fTim(nd) {
    var fHr = nd.getHours(),
        fMin = nd.getMinutes(),
        fSec = nd.getSeconds(),
        fMils = nd.getMilliseconds(),
        Pm = false;

    // fHr

    if (nd.getHours() >= 12) {
        fHr = nd.getHours() - 12;
        Pm = true;
        if (fHr == 0) {
            fHr = 12;
        }
    }
    if (fHr < 10) {
        fHr = "0" + fHr;
    }

    // fMin

    if (nd.getMinutes() < 10) {
        fMins = "0" + nd.getMinutes();
    }

    // fSec
    if (nd.getSeconds() < 10) {
        fSec = "0" + nd.getSeconds();
    }

    //fMils
    if (nd.getMilliseconds() < 100) {
        fMils = "0" + nd.getMilliseconds();
        if (nd.getMilliseconds() < 10) {
            fMils = "00" + nd.getMilliseconds();
        }
    }
    return [fHr, fMin, fSec, fMils, Pm];
}

function gbi(a) {
    return document.getElementById(a);
}
//setUp
function makeSetUp(ss) {
    switch(ss){
        case 1:
            wIn = document.createElement("span");
            wIn.id = "containerD";
            wIn.innerHTML = '<span id=day>~</span>, <span id=month>~</span> <span id=date>~</span>, <span id=year>~</year> ';
            document.body.appendChild(wIn);
            wIn = document.createElement("span");
            wIn.id = "containerT";
            wIn.innerHTML = " <span id=hour>~</span>:<span id=minute>~</span>:<span id=second>~</span>.<span id=millisecond>~</span>";
            document.body.appendChild(wIn);
            sI(1);
        break;
            
        case 2:
            wIn= document.createElement("span");
            wIn.id="containerD";
            wIn.className="s2_containerD";
            wIn.innerHTML= "<span id=day>~</span>, <span id=month>~</span> <span id=date>~</span>, <span id=year>~</year><br>";
            document.body.appendChild(wIn);
            wIn = document.createElement("span");
            wIn.id = "containerT";
            wIn.className="s2_containerT";
            wIn.innerHTML = "<br><span id=hour>~</span>:<span id=minute>~</span>:<span id=second>~</span>.<span id=millisecond>~</span>";
            document.body.appendChild(wIn);
            sI(1);
        break;
        
        default:
            sI(0)
        break;
        
    }
}
function checkSetUp(){
    return prompt('Use setup number...', 0)-1+1;
}
//Launchpad
fL();