require('./component/menu.component.js');
require('./component/menu.css');

angular
    .module('shContextMenu', [
        'contextMenu'
    ])
    .directive('shContextMenu', contextDirective);

contextDirective.$inject = ['$compile'];
function contextDirective($compile) {
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

            ctrl.options = Object.assign({}, defaultOptions, ctrl.options);

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

                if (options.rtl)
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