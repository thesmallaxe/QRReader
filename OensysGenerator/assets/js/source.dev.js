"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){
(function(global){
/* eslint-env browser */
'use strict';

var _jquery=typeof window!=="undefined"?window['jQuery']:typeof global!=="undefined"?global['jQuery']:null;var _jquery2=_interopRequireDefault(_jquery);

var _qrGenerator=require('modules/qrGenerator.js');var _qrGenerator2=_interopRequireDefault(_qrGenerator);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

(function($){
$(document).ready(function(){
ready();
});

// Initalizing all modules
function ready(){
// formValidator();
(0,_qrGenerator2.default)();
}
})(_jquery2.default);// import formValidator from 'modules/formValidator.js';

}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});

},{"modules/qrGenerator.js":2}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=



function(){
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

var codeWriter=new ZXing.BrowserQRCodeSvgWriter();
var svgElement=void 0;

// Form elements
var visitorID='v'+Math.random().toString(36).substr(2,6);
var name=$('#name').val();
var contact=$('#contact').val();
var nic=$('#nic').val();
var email=$('#email').val();
var vehicleNo=$('#vehicle-no').val();

// Sending data to Firebase Database
function writeUserData(visitorID,name,contact,nic,email,vehicleNo){
firebase.database().ref("visitors/"+visitorID).set({
ID:visitorID,
Name:name,
Contact:contact,
NIC:nic,
Email:email,
Vehicle:vehicleNo});

}

// Filling background colour of Canvas
function fillCanvasBackgroundWithColor(canvas,color){
var context=canvas.getContext('2d');

context.save();
context.globalCompositeOperation='destination-over';

context.fillStyle=color;
context.fillRect(0,0,canvas.width,canvas.height);
context.restore();
}

// Function write QR
function writeQR(){
// Calling Firebase Write
writeUserData(visitorID,name,contact,nic,email,vehicleNo);

// Write QR
svgElement=codeWriter.writeToDom(
'#result',
JSON.stringify(visitorID,name,contact,nic,email,vehicleNo),
250,
250);

}

// File download function
function save_as_svg(){
var svg_data=$("#result svg").html();//put id of your svg element here

var head='<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';

//if you have some additional styling like graph edges put them inside <style> tag
// var style = '<style>circle {cursor: pointer;stroke-width: 1.5px;}text {font: 10px arial;}path {stroke: DimGrey;stroke-width: 1.5px;}</style>'

var full_svg=head+svg_data+"</svg>";
var blob=new Blob([full_svg],{type:"image/svg+xml"});
saveAs(blob,"graph.svg");
};

// Form validation
function validate(){
var isFormValid=true;

$("input:required").each(function(){
if($.trim($(this).val()).length==0){
$(this).addClass("highlight");
isFormValid=false;
$(this).focus();
}else
{
$(this).removeClass("highlight");

// Disable the button
$('#submitBtn').attr("disabled",true);
}
});

if(!isFormValid){
alert("Please fill in all the required fields (indicated by *)");
}else{
// Call write QR function
writeQR();
}

return isFormValid;
}

// Defining form button element
var submitBtn=$('#submitBtn');

submitBtn.click(function(e){
e.preventDefault();

// Call validate function
validate();

// Call download function
save_as_svg();
});
};

},{}]},{},[1]);