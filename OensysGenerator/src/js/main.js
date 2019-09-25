/* eslint-env browser */
'use strict';

import jquery from 'jquery';
import qrGenerator from 'modules/qrGenerator.js';
import animation from 'modules/animation.js';

(function ($) {
  $(document).ready(function () {
    ready();
  });

  // Initalizing all modules
  function ready() {
    qrGenerator();
    animation();
  }
})(jquery);
