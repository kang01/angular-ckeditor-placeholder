/*! Angular CKEditor placeholder v0.0.0 | (c) 2014 Le Monde | License MIT */

(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) define(['angular', 'angular-ckeditor'], factory);
  // Global
  else factory(angular);
}(this, function (angular) {

  angular
  .module('ckeditorPlaceholder', ['ckeditor'])
  .directive('placeholder', ['$parse', placeholderDirective]);

  // Create setImmediate function.
  var setImmediate = window && window.setImmediate ? window.setImmediate : function (fn) {
    setTimeout(fn, 0);
  };

  /**
   * Placeholder directive.
   */

  function placeholderDirective($parse) {
    return {
      restrict: 'A',
      require: ['?ckeditor'],
      link: function (scope, element, attrs, ctrls) {
        var ckeditor = ctrls[0];
        if (! ckeditor) return ;

        var placeholder = attrs.placeholder;
        var className = 'placeholder';

        // Initialize placeholder.
        ckeditor.ready().then(function initialize() {
          // Listen events.
          ckeditor.instance.on('blur', show);
          ckeditor.instance.on('key', hide);
          ckeditor.instance.on('focus', hide);

          // Since placeholder is fake data,
          // the getData should be intercepted to send nothing.
          ckeditor.instance.on('getData', function (event) {
            if (isActive()) event.data.dataValue = '';
          });

          // And of course the placeholder must be removed
          // if data is set.
          ckeditor.instance.on('setData', function (event) {
            if (event.data.dataValue) hide();
          });

          // Try to display placeholder.
          setImmediate(show);
        });

        /**
         * Display the placeholder.
         */

        function show() {
          // If there is data, we don't show the placeholder.
          if (ckeditor.instance.getData()) return ;

          ckeditor.instance.container.addClass(className);
          ckeditor.instance.container.setHtml('<div contenteditable="false">' + placeholder  + '</div>');
        }

        /**
         * Hide the placeholder.
         */

        function hide() {
          // If not active, do nothing.
          if (! isActive()) return ;

          ckeditor.instance.container.removeClass(className);
          ckeditor.instance.container.setHtml('');
        }

        /**
         * Check if the placeholder is active or not.
         *
         * @returns {Boolean}
         */

        function isActive() {
          return ckeditor.instance.container.hasClass('placeholder');
        }
      }
    };
  }
}));