(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-env browser */
'use strict';

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);var _jquery2 = _interopRequireDefault(_jquery);
var _accordion = require('modules/accordion.js');var _accordion2 = _interopRequireDefault(_accordion);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

(function ($) {
  $(document).ready(function () {
    ready();

    // Styleguide event when an element is rendered
    $(window).bind("styleguide:onRendered", function (e) {
      ready();
    });
  });

  // Initalizing all modules
  function ready() {
    (0, _accordion2.default)();
  }
})(_jquery2.default);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"modules/accordion.js":2}],2:[function(require,module,exports){
'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =



function () {
  var accordion = $('.accordion');

  if (accordion.length) {
    $('.toggle').click(function (e) {
      e.preventDefault();

      var $this = $(this);

      if ($this.next().hasClass('active') && $(this).hasClass('active')) {
        $('.toggle').removeClass('active');
        $this.next().removeClass('active');
        $this.next().slideUp(350);
      } else {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9tb2R1bGVzL2FjY29yZGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBOztBQUVBLGdDO0FBQ0EsaUQ7O0FBRUEsQ0FBQyxVQUFVLENBQVYsRUFBYTtBQUNaLElBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBWTtBQUM1Qjs7QUFFQTtBQUNBLE1BQUUsTUFBRixFQUFVLElBQVYsQ0FBZSx1QkFBZixFQUF3QyxVQUFVLENBQVYsRUFBYTtBQUNuRDtBQUNELEtBRkQ7QUFHRCxHQVBEOztBQVNBO0FBQ0EsV0FBUyxLQUFULEdBQWlCO0FBQ2Y7QUFDRDtBQUNGLENBZEQsRUFjRyxnQkFkSDs7Ozs7Ozs7O0FDRmUsWUFBWTtBQUN6QixNQUFJLFlBQVksRUFBRSxZQUFGLENBQWhCOztBQUVBLE1BQUksVUFBVSxNQUFkLEVBQXNCO0FBQ3BCLE1BQUUsU0FBRixFQUFhLEtBQWIsQ0FBbUIsVUFBVSxDQUFWLEVBQWE7QUFDOUIsUUFBRSxjQUFGOztBQUVBLFVBQUksUUFBUSxFQUFFLElBQUYsQ0FBWjs7QUFFQSxVQUFJLE1BQU0sSUFBTixHQUFhLFFBQWIsQ0FBc0IsUUFBdEIsS0FBbUMsRUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixRQUFqQixDQUF2QyxFQUFtRTtBQUNqRSxVQUFFLFNBQUYsRUFBYSxXQUFiLENBQXlCLFFBQXpCO0FBQ0EsY0FBTSxJQUFOLEdBQWEsV0FBYixDQUF5QixRQUF6QjtBQUNBLGNBQU0sSUFBTixHQUFhLE9BQWIsQ0FBcUIsR0FBckI7QUFDRCxPQUpELE1BSU87QUFDTDtBQUNBLGNBQU0sTUFBTixHQUFlLE1BQWYsR0FBd0IsSUFBeEIsQ0FBNkIscUJBQTdCLEVBQW9ELFdBQXBELENBQWdFLFFBQWhFO0FBQ0E7QUFDQSxjQUFNLFdBQU4sQ0FBa0IsUUFBbEI7QUFDQSxjQUFNLElBQU4sR0FBYSxXQUFiLENBQXlCLFFBQXpCO0FBQ0EsY0FBTSxJQUFOLEdBQWEsV0FBYixDQUF5QixHQUF6QjtBQUNEO0FBQ0YsS0FqQkQ7QUFrQkQ7QUFDRixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXNsaW50LWVudiBicm93c2VyICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBqcXVlcnkgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IGFjY29yZGlvbiBmcm9tICdtb2R1bGVzL2FjY29yZGlvbi5qcyc7XHJcblxyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICByZWFkeSgpO1xyXG5cclxuICAgIC8vIFN0eWxlZ3VpZGUgZXZlbnQgd2hlbiBhbiBlbGVtZW50IGlzIHJlbmRlcmVkXHJcbiAgICAkKHdpbmRvdykuYmluZChcInN0eWxlZ3VpZGU6b25SZW5kZXJlZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICByZWFkeSgpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIEluaXRhbGl6aW5nIGFsbCBtb2R1bGVzXHJcbiAgZnVuY3Rpb24gcmVhZHkoKSB7XHJcbiAgICBhY2NvcmRpb24oKTtcclxuICB9XHJcbn0pKGpxdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBBY2NvcmRpb25cclxuICovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGFjY29yZGlvbiA9ICQoJy5hY2NvcmRpb24nKTtcclxuXHJcbiAgaWYgKGFjY29yZGlvbi5sZW5ndGgpIHtcclxuICAgICQoJy50b2dnbGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgaWYgKCR0aGlzLm5leHQoKS5oYXNDbGFzcygnYWN0aXZlJykgJiYgJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAkKCcudG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR0aGlzLm5leHQoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJHRoaXMubmV4dCgpLnNsaWRlVXAoMzUwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAkKCcudG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICR0aGlzLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5hY2NvcmRpb25fX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgLy8gJHRoaXMucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmFjY29yZGlvbl9fY29udGVudCcpLnNsaWRlVXAoMzUwKTtcclxuICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJHRoaXMubmV4dCgpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkdGhpcy5uZXh0KCkuc2xpZGVUb2dnbGUoMzUwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
