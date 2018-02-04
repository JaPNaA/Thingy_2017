var data=localStorage.apl2MeanMediumMode_data||[];
console.log(data);
if(typeof data!="object")
data=data.split(";;");
data.__proto__.ins=function(e){
this.unshift(e);
if(this.length>100){
this.pop()
}
localStorage.apl2MeanMediumMode_data=data.join(";;");
}
window.addEventListener("beforeunload",function(){
localStorage.apl2MeanMediumMode_data=data.join(";;");
},false);
window.data=data;

document.body.innerHTML="<h1> apl2 - Mean, Medium, Mode </h1><textarea placeholder='~#[command] [empty]-Random [list](\",\" seperate) \ntype ** ~#help for help **'></textarea> <div id=main></main>";
document.getElementsByTagName("textarea")[0].addEventListener("keydown",function(e){
if(e.keyCode==188||e.keyCode==32){
var d=this.value.substring(this.value.length-2,this.value.length);
if(d==", "||d==""||d=="~#"){
e.preventDefault();
}else{
this.value+=", ";
e.preventDefault();
}
}

if(e.keyCode==13){
if(this.value.substring(0,2)=="~#"){
switch(this.value.substring(2,this.value.length).split(" ").join("")){
case "l":
case "last":
case "prev":
case "restore":
this.value=data[0]||null;
break;

case "2":
this.value=data[1]||null;
break;

case "3":
this.value=data[2]||null;
break;

case "4":
this.value=data[3]||null;
break;

case "5":
this.value=data[4]||null;
break;

case "all":
var that=this;
document.getElementById("main").innerHTML="<span>"+data.join("</span><br><br><span>")+"</span>";
[].slice.call(document.getElementsByTagName("span")).forEach(function(o,x){
o.id=x;
o.addEventListener("click",function(){
that.value=data[~~this.id];
},true);
});
break;
//Insert ~#help here
default:
this.value="unknown command";
}
}else{
start(this.value);
data.ins(this.value);
}
e.preventDefault();
}
},true);

function start(k){
var a=[],b=0,c;
a=k.split(",");
if(a.length<2){
for(var i=0; i<1001; i++){
a.push(Math.floor(Math.random()*1000)+1);
}
}
a.forEach(function(o,x){
a[x]=o-1+1;
});
a.forEach(function(o){
b+=o;
});
c=a.sort(function(j,k){return j-k;});
document.getElementById("main").innerHTML="<b>Mean</b><br>"+(b/a.length+"<br><br><b>Median</b><br>")+ (function(){
var f=(a.length-1)/2;
if(f%1==0){
return c[f];
}else{
return (c[Math.floor(f)]+c[Math.ceil(f)])/2;
}

}()+"<br><br><b>Mode</b><br>")+(function(){

var a=[],l,t=0,g=[],gt=0;
c.forEach(function(o){
if(l==o){
t++;
} else {
a.push(l+":"+t);
t=1;
}
l=o;
});
a.push(l+":"+t);

a.forEach(function(o){
var b=o.split(":");
if(b[1]-1+1>gt){
g=[o];
gt=b[1]-1+1;
} else if(b[1]-1+1==gt){
g.push(o);
}
});

return g.join(", ");
}()+"<br><br><b>Least to Greatest</b><br>")+c.join(", ");
}
