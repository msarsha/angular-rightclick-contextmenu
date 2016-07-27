(function () {

    var module = angular.module('sarsha.rightclick', []);

    module.directive('shRightClick', shRightClick);

    function shRightClick() {
        return function ($scope, $element, $attrs) {
            var elm = $element[0];
            var menuElement = null;

            elm.addEventListener("contextmenu", clickHandler);

            function createMenuElement() {
                menuElement = document.createElement("div");
                menuElement.classList.add('menu');
            }

            function bindBodyClick() {
                document.body.addEventListener("mousedown", bodyClickHandler);
            }

            function bodyClickHandler(e) {
                if (e.button !== 2 && menuElement)
                    destroy();
            };

            function destroy() {
                elm.removeChild(menuElement);
                menuElement = null;
                document.body.removeEventListener("mousedown", bodyClickHandler);
                // delete document.body.onmousedown;
            }

            function clickHandler(evt) {
                evt.preventDefault();
                var x = evt.pageX - elm.offsetLeft;
                var y = evt.pageY - elm.offsetTop;

                if (!menuElement) {
                    createMenuElement();
                    bindBodyClick();
                } else if (evt.button === 2) {
                    setMenuPosition(x, y);
                } else {
                    destroy();
                    return;
                }

                if (elm.style.position === "static")
                    elm.style.position = "relative";

                setMenuPosition(x, y);
                elm.appendChild(menuElement);
            }

            function setMenuPosition(x, y) {
                menuElement.style.left = x + "px";
                menuElement.style.top = y + "px";
            }
        }
    }


    module.directive('mouseMove', mouseMove);

    function mouseMove() {
        return {
            template: "<div><span>{{$ctrl.mx}}</span></div><div><span>{{$ctrl.my}}</span></div>",
            scope: {},
            controller: function ($scope) {
                var self = this;
                this.mx = 0;
                this.my = 0;

                this.update = function (x, y) {
                    $scope.$apply(function () {
                        self.mx = x;
                        self.my = y;
                    });
                }
            },
            controllerAs: '$ctrl',
            link: function ($scope, $element, $attrs) {
                document.addEventListener('mousemove', function (evt) {
                    $scope.$ctrl.update(evt.pageX, evt.pageY)
                })
            }
        }
    }
})();