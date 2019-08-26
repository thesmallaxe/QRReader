"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){
(function(global){
/* eslint-env browser */
'use strict';

var _jquery=typeof window!=="undefined"?window['jQuery']:typeof global!=="undefined"?global['jQuery']:null;var _jquery2=_interopRequireDefault(_jquery);
var _accordion=require('modules/accordion.js');var _accordion2=_interopRequireDefault(_accordion);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

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
(0,_accordion2.default)();
}
})(_jquery2.default);

}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});

},{"modules/accordion.js":2}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=



function(){
var accordion=$('.accordion');

if(accordion.length){
$('.toggle').click(function(e){
e.preventDefault();

var $this=$(this);

if($this.next().hasClass('active')&&$(this).hasClass('active')){
$('.toggle').removeClass('active');
$this.next().removeClass('active');
$this.next().slideUp(350);
}else{
// $('.toggle').removeClass('active');
$this.parent().parent().find('.accordion__content').removeClass('active');
// $this.parent().parent().find('.accordion__content').slideUp(350);
$this.toggleClass('active');
$this.next().toggleClass('active');
$this.next().slideToggle(350);
}
});
}
};

},{}]},{},[1]);