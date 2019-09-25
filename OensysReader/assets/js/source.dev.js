"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){
(function(global){
/* eslint-env browser */
'use strict';

var _jquery=typeof window!=="undefined"?window['jQuery']:typeof global!=="undefined"?global['jQuery']:null;var _jquery2=_interopRequireDefault(_jquery);
var _animation=require('modules/animation.js');var _animation2=_interopRequireDefault(_animation);
var _takePhoto=require('modules/takePhoto.js');var _takePhoto2=_interopRequireDefault(_takePhoto);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

(function($){
$(document).ready(function(){
ready();

// Styleguide event when an element is rendered
$(window).bind("styleguide:onRendered",function(e){
ready();
});
});

// Initalizing all modules
function ready(){
(0,_animation2.default)();
(0,_takePhoto2.default)();
}
})(_jquery2.default);

}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});

},{"modules/animation.js":2,"modules/takePhoto.js":3}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=



function(){

var width,height,largeHeader,canvas,ctx,points,target,animateHeader=true;

// Main
if($('.landing').length){
initHeader();
initAnimation();
addListeners();
}

function initHeader(){
width=window.innerWidth;
height=window.innerHeight;
target={x:width/2,y:height/2};

largeHeader=document.getElementById('header');
largeHeader.style.height=height+'px';

canvas=document.getElementById('animation-canvas');
canvas.width=width;
canvas.height=height;
ctx=canvas.getContext('2d');

// create points
points=[];
for(var x=0;x<width;x=x+width/20){
for(var y=0;y<height;y=y+height/20){
var px=x+Math.random()*width/20;
var py=y+Math.random()*height/20;
var p={x:px,originX:px,y:py,originY:py};
points.push(p);
}
}

// for each point find the 5 closest points
for(var i=0;i<points.length;i++){
var closest=[];
var p1=points[i];
for(var j=0;j<points.length;j++){
var p2=points[j];
if(!(p1==p2)){
var placed=false;
for(var k=0;k<5;k++){
if(!placed){
if(closest[k]==undefined){
closest[k]=p2;
placed=true;
}
}
}

for(var k=0;k<5;k++){
if(!placed){
if(getDistance(p1,p2)<getDistance(p1,closest[k])){
closest[k]=p2;
placed=true;
}
}
}
}
}
p1.closest=closest;
}

// assign a circle to each point
for(var i in points){
var c=new Circle(points[i],2+Math.random()*2,'rgba(255,255,255,0.3)');
points[i].circle=c;
}
}

// Event handling
function addListeners(){
if(!('ontouchstart'in window)){
window.addEventListener('mousemove',mouseMove);
}
window.addEventListener('scroll',scrollCheck);
window.addEventListener('resize',resize);
}

function mouseMove(e){
var posx=0;
var posy=0;
if(e.pageX||e.pageY){
posx=e.pageX;
posy=e.pageY;
}else
if(e.clientX||e.clientY){
posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
}
target.x=posx;
target.y=posy;
}

function scrollCheck(){
if(document.body.scrollTop>height)animateHeader=false;else
animateHeader=true;
}

function resize(){
width=window.innerWidth;
height=window.innerHeight;
largeHeader.style.height=height+'px';
canvas.width=width;
canvas.height=height;
}

// animation
function initAnimation(){
animate();
for(var i in points){
shiftPoint(points[i]);
}
}

function animate(){
if(animateHeader){
ctx.clearRect(0,0,width,height);
for(var i in points){
// detect points in range
if(Math.abs(getDistance(target,points[i]))<4000){
points[i].active=0.3;
points[i].circle.active=0.6;
}else if(Math.abs(getDistance(target,points[i]))<20000){
points[i].active=0.1;
points[i].circle.active=0.3;
}else if(Math.abs(getDistance(target,points[i]))<40000){
points[i].active=0.02;
points[i].circle.active=0.1;
}else{
points[i].active=0;
points[i].circle.active=0;
}

drawLines(points[i]);
points[i].circle.draw();
}
}
requestAnimationFrame(animate);
}

function shiftPoint(p){
TweenLite.to(p,1+1*Math.random(),{
x:p.originX-50+Math.random()*100,
y:p.originY-50+Math.random()*100,ease:Circ.easeInOut,
onComplete:function onComplete(){
shiftPoint(p);
}});

}

// Canvas manipulation
function drawLines(p){
if(!p.active)return;
for(var i in p.closest){
ctx.beginPath();
ctx.moveTo(p.x,p.y);
ctx.lineTo(p.closest[i].x,p.closest[i].y);
ctx.strokeStyle='rgba(243,100,36,'+p.active+')';
ctx.stroke();
}
}

function Circle(pos,rad,color){
var _this=this;

// constructor
(function(){
_this.pos=pos||null;
_this.radius=rad||null;
_this.color=color||null;
})();

this.draw=function(){
if(!_this.active)return;
ctx.beginPath();
ctx.arc(_this.pos.x,_this.pos.y,_this.radius,0,2*Math.PI,false);
ctx.fillStyle='rgba(243,100,36,'+_this.active+')';
ctx.fill();
};
}

// Util
function getDistance(p1,p2){
return Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2);
}
};

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=



function(){
// Database Setup
var firebaseConfig={
apiKey:"AIzaSyAX0g-faZYiULDy_QiLMBxaigNBB85VAPI",
authDomain:"reception-management.firebaseapp.com",
databaseURL:"https://reception-management.firebaseio.com",
projectId:"reception-management",
storageBucket:"reception-management.appspot.com",
messagingSenderId:"192413503859",
appId:"1:192413503859:web:c8f9e78f7000d4ea"};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database=firebase.database();
// let filesRef = storageRef.child('photos/' + this.ID + '.jpg');

// Grab elements, create settings, etc.
var photoCanvas=document.getElementById('canvas');
var context=photoCanvas.getContext('2d');
var video=document.getElementById('video');
var mediaConfig={video:true};
var errBack=function errBack(e){
console.log('An error has occurred!',e);
};
var videoWidth=640;
var videoHeight=480;

// Retrieve Data
var ref=database.ref('visitors');
ref.on('value',gotData,errData);

function gotData(data){
console.log(data.val());
}

function errData(err){
console.log('Error!');
console.log(err);
}

// Put video listeners into place
if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream){
// video.src = window.URL.createObjectURL(stream);
video.srcObject=stream;
video.play();
});
}

/* Legacy code below! */else
if(navigator.getUserMedia){// Standard
navigator.getUserMedia(mediaConfig,function(stream){
video.src=stream;
video.play();
},errBack);
}else if(navigator.webkitGetUserMedia){// WebKit-prefixed
navigator.webkitGetUserMedia(mediaConfig,function(stream){
video.src=window.webkitURL.createObjectURL(stream);
video.play();
},errBack);
}else if(navigator.mozGetUserMedia){// Mozilla-prefixed
navigator.mozGetUserMedia(mediaConfig,function(stream){
video.src=window.URL.createObjectURL(stream);
video.play();
},errBack);
}

// Has class function
function hasClass(element,cls){
return(' '+element.className+' ').indexOf(' '+cls+' ')>-1;
}

// Trigger photo take
document.getElementById('snap').addEventListener('click',function(){
var video=document.getElementById('video');
var photoCanvas=document.getElementById('canvas');
var snapButton=document.getElementById('snap');

context.drawImage(video,0,0,videoWidth,videoHeight);
var image=photoCanvas.toDataURL('image/jpeg',0.65);

if(!snapButton.classList.contains('active')){
video.className='fadeOut';
photoCanvas.className='fadeIn';
snapButton.classList='btn-submit btn--small active';
snapButton.textContent="Retake Photo";
}else{
video.className='fadeIn';
photoCanvas.className='fadeOut';
snapButton.classList='btn-submit btn--small';
snapButton.textContent="Take Photo";
}
});

document.getElementById('proceed').addEventListener('click',function(){
// Write or Update Data
var visitorID=sessionStorage.getItem("visitorID");
var photoCanvas=document.getElementById('canvas');
var image=photoCanvas.toDataURL('image/jpeg',0.65);

firebase.database().ref('/visitors/'+visitorID).once('value').then(function(snapshot){

var visitorData=snapshot.val();

console.log(visitorData);

visitorData.profilePicture=image;

firebase.database().ref("visitors/"+visitorID).set(visitorData,function(error){
if(error){
console.log('Not done');
}else{
console.log('done');
}
});
});
});
};

},{}]},{},[1]);