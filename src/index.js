(function () {
    angular
        .module('shContextMenu', [])
        .directive('shContextMenu', function ($compile) {
            return {
                scope: {
                    menuOptions: '<',
                    contextData: '<'
                },
                bindToController: true,
                controllerAs: '$ctrl',
                controller: angular.noop,
                link: function ($scope, element, attrs, ctrl) {
                    var menuElement,
                        maskElement;

                    element.on('contextmenu', function (event) {
                        event.preventDefault();
                        var body = angular.element(document.body);
                        
                        menuElement = buildMenuElement();
                        maskElement = buildMaskElement();

                        setMenuPosition(menuElement, event);

                        body.append(menuElement);
                        body.append(maskElement);
                    });

                    function setMenuPosition(menuElement, event) {
                        menuElement[0].style.top = event.clientY + "px";
                        menuElement[0].style.left = event.clientX + "px";
                    }

                    function buildMenuElement() {
                        var $elm = angular.element('<context-menu menu-options="$ctrl.menuOptions" data="$ctrl.contextData" class="sh_menu_container"></context-menu>');
                        var linkFun = $compile($elm);
                        var content = linkFun($scope);

                        return content;
                    }

                    function buildMaskElement() {
                        var $elm = angular.element('<div class="sh_context_mask"></div>');
                        $elm.on('mousedown', function (e) {
                            menuElement.remove();
                            maskElement.remove();
                        })

                        return $elm;
                    }
                }
            }
        });
})();