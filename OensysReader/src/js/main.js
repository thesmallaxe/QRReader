/* eslint-env browser */
'use strict';

import jquery from 'jquery';
import animation from 'modules/animation.js';
import takePhoto from 'modules/takePhoto.js';

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
    animation();
    takePhoto();
  }
})(jquery);
