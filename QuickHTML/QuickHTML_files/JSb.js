document.getElementById('jsTest').innerHTML = "JS is now connected";
var a = document.getElementsByTagName('progress')[0],
    si = setInterval(function() {
        a.value += 0.015;
        if (a.value >= 1) {
            start();
            clearInterval(si);
        }
    }, 50);

function start() {
    document.body.innerHTML = "<h2> Start typing, everything you type will be reflected on this document, although you will not be able to see what your typing or your code. *Scripts don't work* </h2> <br><progress></progress>";
    a = document.getElementsByTagName('progress')[0];
    a.value = 0;
    var si = setInterval(function() {
        a.value += 0.005;
        if (a.value >= 1) {
            startA();
            clearInterval(si);
        }
    }, 40);
}
var x = new Array(222);
x[8] = "" /*backspace*/ ;
x[9] = "\t" /*tab*/ ;
x[13] = "<br>\n" /*enter*/ ;
x[16] = "" /*shift*/ ;
x[17] = "" /*ctrl*/ ;
x[18] = "" /*alt*/ ;
x[19] = "" /*pause/br*/ ;
x[20] = "" /*capLock*/ ;
x[27] = "" /*esc*/ ;
x[32] = " ";
x[33] = "" /*pgup*/ ;
x[34] = "" /*pgdwn*/ ;
x[35] = "" /*end*/ ;
x[36] = "" /*home*/ ;
x[37] = "" /*left*/ ;
x[38] = "" /*up*/ ;
x[39] = "" /*right*/ ;
x[40] = "" /*down*/ ;
x[45] = "" /*insert*/ ;
x[46] = "" /*del*/ ;
x[48] = "0";
x[49] = "1";
x[50] = "2";
x[51] = "3";
x[52] = "4";
x[53] = "5";
x[54] = "6";
x[55] = "7";
x[56] = "8";
x[57] = "9";
x[65] = "a";
x[66] = "b";
x[67] = "c";
x[68] = "d";
x[69] = "e";
x[70] = "f";
x[71] = "g";
x[72] = "h";
x[73] = "i";
x[74] = "j";
x[75] = "k";
x[76] = "l";
x[77] = "m";
x[78] = "n";
x[79] = "o";
x[80] = "p";
x[81] = "q";
x[82] = "r";
x[83] = "s";
x[84] = "t";
x[85] = "u";
x[86] = "v";
x[87] = "w";
x[88] = "x";
x[89] = "y";
x[90] = "z";
x[91] = "" /*leftWinKey*/ ;
x[92] = "" /*rightWinKey*/ ;
x[93] = "" /*select*/ ; /*---numPadKeys---*/
x[96] = "0";
x[97] = "1";
x[98] = "2";
x[99] = "3";
x[100] = "4";
x[101] = "5";
x[102] = "6";
x[103] = "7";
x[104] = "8";
x[105] = "9";
x[106] = "*";
x[107] = "+";
x[109] = "-";
x[110] = ".";
x[111] = "/";
x[112] = "" /*F1*/ ;
x[113] = "" /*F2*/ ;
x[114] = "" /*F3*/ ;
x[115] = "" /*F4*/ ;
x[116] = "" /*F5*/ ;
x[117] = "" /*F6*/ ;
x[118] = "" /*F7*/ ;
x[119] = "" /*F8*/ ;
x[120] = "" /*F9*/ ;
x[121] = "" /*F10*/ ;
x[122] = "" /*F11*/ ;
x[123] = "" /*F12*/ ;
x[144] = "" /*numLock*/ ;
x[145] = "" /*scrollLock*/ ;
x[186] = ";";
x[187] = "=";
x[188] = ",";
x[190] = ".";
x[191] = "/";
x[192] = "`" /*graveAccent*/ ;
x[219] = "[";
x[220] = "\\";
x[221] = "]";
x[222] = "'";
x[226] = "";
x[173] = "" /*muteButton*/ ;
x[174] = "" /*volDwn*/ ;
x[175] = "" /*volUp*/ ;
x[189] = "-";

var y = new Array(222);
y[8] = "" /*backspace*/ ;
y[9] = "\t" /*tab*/ ;
y[13] = "\n" /*enter*/ ;
y[16] = "" /*shift*/ ;
y[17] = "" /*ctrl*/ ;
y[18] = "" /*alt*/ ;
y[19] = "" /*pause/br*/ ;
y[20] = "" /*capLock*/ ;
y[27] = "" /*esc*/ ;
y[32] = " ";
y[33] = "" /*pgup*/ ;
y[34] = "" /*pgdwn*/ ;
y[35] = "" /*end*/ ;
y[36] = "" /*home*/ ;
y[37] = "" /*left*/ ;
y[38] = "" /*up*/ ;
y[39] = "" /*right*/ ;
y[40] = "" /*down*/ ;
y[45] = "" /*insert*/ ;
y[46] = "" /*del*/ ;
y[48] = ")";
y[49] = "!";
y[50] = "@";
y[51] = "#";
y[52] = "$";
y[53] = "%";
y[54] = "^";
y[55] = "&";
y[56] = "*";
y[57] = "(";
y[65] = "A";
y[66] = "B";
y[67] = "C";
y[68] = "D";
y[69] = "E";
y[70] = "F";
y[71] = "G";
y[72] = "H";
y[73] = "I";
y[74] = "J";
y[75] = "K";
y[76] = "L";
y[77] = "M";
y[78] = "N";
y[79] = "O";
y[80] = "P";
y[81] = "Q";
y[82] = "R";
y[83] = "S";
y[84] = "T";
y[85] = "U";
y[86] = "V";
y[87] = "W";
y[88] = "X";
y[89] = "Y";
y[90] = "Z";
y[91] = "" /*leftWinKey*/ ;
y[92] = "" /*rightWinKey*/ ;
y[93] = "" /*select*/ ; /*---numPadKeys---*/
y[96] = "0";
y[97] = "1";
y[98] = "2";
y[99] = "3";
y[100] = "4";
y[101] = "5";
y[102] = "6";
y[103] = "7";
y[104] = "8";
y[105] = "9";
y[106] = "*";
y[107] = "+";
y[109] = "-";
y[110] = ".";
y[111] = "/";
y[112] = "" /*F1*/ ;
y[113] = "" /*F2*/ ;
y[114] = "" /*F3*/ ;
y[115] = "" /*F4*/ ;
y[116] = "" /*F5*/ ;
y[117] = "" /*F6*/ ;
y[118] = "" /*F7*/ ;
y[119] = "" /*F8*/ ;
y[120] = "" /*F9*/ ;
y[121] = "" /*F10*/ ;
y[122] = "" /*F11*/ ;
y[123] = "" /*F12*/ ;
y[144] = "" /*numLock*/ ;
y[145] = "" /*scrollLock*/ ;
y[186] = ":";
y[187] = "+";
y[188] = "<";
y[190] = ">";
y[191] = "?";
y[192] = "~" /*graveAccent*/ ;
y[219] = "{";
y[220] = "|";
y[221] = "}";
y[222] = "\"";
y[226] = "";
y[173] = "" /*muteButton*/ ;
y[174] = "" /*volDwn*/ ;
y[175] = "" /*volUp*/ ;
y[189] = "_";
var dbd = "";
function startA() {
    resume();
    upd();
    window.addEventListener("keydown", function(e) {
        if (!document.getElementsByTagName('textarea')[0]) {
            switch (e.keyCode) {
                case 8:
                    dbd = dbd.substring(0, dbd.length - 1);
                    upd();
                    break;

                case 27:
                    document.body.innerHTML = "<textarea class=txta>" + dbd + "</textarea><br><button onclick='resume()'>Apply/Resume</button><button onclick='save();'>Save</button> <button onclick='getSave()'>Import from save </button>";
                    var txt = document.getElementsByTagName('textarea')[0];
                    txt.style = "width:"+window.innerWidth * 0.9+"; height:"+window.innerHeight * 0.9+";";
                    break;

                default:
                    if (!listenForShiftKey(e)) {
                        dbd += x[e.keyCode];
                    } else {
                        dbd += y[e.keyCode];
                    }
                    upd();
                    break;
            }
        }
    }, true);
}


function listenForShiftKey(e) {
    var evt = e || window.event;
    if (evt.shiftKey) {
        return true;
    } else {
        return false;
    }
}

function resume() {
    if(document.getElementsByTagName('textarea')[0]){
        dbd = document.getElementsByTagName('textarea')[0].value;
    }
    document.body.innerHTML="<span id=mainC></span><span class=cursor>|</span><hr><input id=codeView class=inP readonly='readonly'></input>";
    upd();
}

function upd(){
    document.getElementById('mainC').innerHTML = dbd;
    document.getElementById('codeView').value=dbd.substring(dbd.length-16, dbd.length)+"<-|";
}

function save(){
    setCookie('savedThing', dbd, 120)
    resume();
}

function getSave(){
    dbd=document.cookie.substring(11,document.cookie.length)
    resume();
    upd();
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}