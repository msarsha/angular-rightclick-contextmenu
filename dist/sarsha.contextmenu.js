(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],2:[function(require,module,exports){
angular
    .module('contextMenu', [])
    .component('contextMenu', {
        bindings: {
            menuOptions: '<',
            data: '<',
            closeMenu: '&',
            options: '<'
        },
        templateUrl: 'src/component/menu.html',
        controller: function () {
            var self = this;

            this.onClick = function ($event, opt) {
                if (self.isOptionDisabled(opt))
                    return;

                self.closeMenu();
                opt.onClick({
                    option: opt,
                    dataContext: self.data
                });
            }

            this.isOptionDisabled = function (opt) {
                return opt.disabled && opt.disabled(self.data);
            }
        }
    })
},{}],3:[function(require,module,exports){
var css = ".sh_menu_container {\n  position: fixed;\n  height: auto;\n  background: #ececec;\n  z-index: 90001;\n  min-width: 150px;\n  border: 0.5px solid rgba(0,0,0,0.2);\n  border-radius: 2.5px;\n  box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.1);\n}\n.sh_menu_container ul {\n  list-style: none;\n  padding: 5px 0;\n  margin: 0;\n}\n.sh_menu_container ul.sh_menu_rtl {\n  direction: rtl;\n}\n.sh_menu_container ul li {\n  padding-right: 10px;\n  padding-left: 15px;\n  padding-bottom: 5px;\n  padding-top: 5px;\n  transition: all 0.15s;\n}\n.sh_menu_container ul li.sh_menu_item:hover {\n  cursor: pointer;\n  background: #4b8bec;\n  color: white;\n}\n.sh_context_mask {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 90000;\n}\n.sh_menu_divider {\n  height: 1px;\n  margin: 1px 1px 8px 1px;\n  overflow: hidden;\n  background-color: #ececec;\n  border-bottom: 1px solid #d0d0d0;\n  line-height: 10px;\n}\n.sh_menu_container ul li.sh_menu_disabled {\n  color: #d0d0d0;\n}\n.sh_menu_container ul li.sh_menu_disabled:hover {\n  cursor: not-allowed;\n  color: #d0d0d0;\n  background: #ececec;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/component/menu.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],4:[function(require,module,exports){
require('./component/menu.component.js');
require('./component/menu.css');

angular
    .module('shContextMenu', [
        'contextMenu'
    ])
    .directive('shContextMenu', contextDirective);

    contextDirective.$inject = ['$compile'];
    function contextDirective ($compile) {
        return {
            scope: {
                menuOptions: '<',
                contextData: '<',
                options: '<'
            },
            bindToController: true,
            controllerAs: '$ctrl',
            controller: angular.noop,
            link: function ($scope, element, attrs, ctrl) {
                var menuElement,
                    maskElement;

                var defaultOptions = {
                    rtl: false
                }

                ctrl.destroyElements = function () {
                    destroyElements();
                }

                ctrl.options = ctrl.options || defaultOptions;

                element.on('contextmenu', function (event) {
                    event.preventDefault();
                    var body = angular.element(document.body);

                    menuElement = buildMenuElement();
                    maskElement = buildMaskElement();

                    body.append(menuElement);
                    body.append(maskElement);

                    setMenuPosition(menuElement, event, ctrl.options);
                });

                function setMenuPosition(menuElement, event, options) {
                    var elmWidth = menuElement[0].offsetWidth;
                    var clientX = event.clientX;

                    if(options.rtl)
                        clientX = clientX - elmWidth;

                    menuElement[0].style.top = event.clientY + "px";
                    menuElement[0].style.left = clientX + "px";
                }

                function buildMenuElement() {
                    var $elm = angular.element('<context-menu options="$ctrl.options" close-menu="$ctrl.destroyElements()" menu-options="$ctrl.menuOptions" data="$ctrl.contextData" class="sh_menu_container"></context-menu>');
                    var linkFun = $compile($elm);
                    var content = linkFun($scope);

                    return content;
                }

                function buildMaskElement() {
                    var $elm = angular.element('<div class="sh_context_mask"></div>');
                    $elm.on('mousedown', function (e) {
                        destroyElements();
                    })

                    return $elm;
                }

                function destroyElements() {
                    menuElement.remove();
                    maskElement.remove();
                }
            }
        }
    }
},{"./component/menu.component.js":2,"./component/menu.css":3}]},{},[4]);

angular.module('shContextMenu').run(['$templateCache', function($templateCache) {$templateCache.put('src/component/menu.html','<ul ng-class="{sh_menu_rtl: $ctrl.options.rtl}">\n    <li ng-style="" ng-repeat="option in $ctrl.menuOptions" ng-class="{sh_menu_item: !option.divider, sh_menu_divider: option.divider, sh_menu_disabled: $ctrl.isOptionDisabled(option)}">\n        <div ng-click="$ctrl.onClick($event, option)" ng-if="!option.divider">\n            {{option.label}}\n        </div>\n    </li>\n</ul>');}]);