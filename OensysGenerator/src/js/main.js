/* eslint-env browser */
'use strict';

import jquery from 'jquery';
// import formValidator from 'modules/formValidator.js';
import qrGenerator from 'modules/qrGenerator.js';

(function ($) {
  $(document).ready(function () {
    ready();
  });

  // Initalizing all modules
  function ready() {
    // formValidator();
    qrGenerator();
  }
})(jquery);
