/* eslint-env browser */
'use strict';

import jquery from 'jquery';
import qrGenerator from 'modules/qrGenerator.js';

(function ($) {
  $(document).ready(function () {
    ready();
  });

  // Initalizing all modules
  function ready() {
    qrGenerator();
  }
})(jquery);
