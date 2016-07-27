(function () {

    var module = angular.module('sarsha.rightclick', []);

    module.directive('shRightClick', shRightClick);

    function shRightClick() {
        return {
            replace: true,
            link: function ($scope, $element, $attrs) {
                var elm = $element[0];
                var menuElement = null;

                elm.addEventListener("contextmenu", clickHandler);

                function createMenuElement() {
                    menuElement = document.createElement("div");
                    menuElement.classList.add('menu');
                }

                function clickHandler(evt) {
                    var isRightClick = evt.button === 2;
                    evt.preventDefault();

                    if (!menuElement) {
                        createMenuElement();
                    } else {
                        this.removeChild(menuElement);
                        menuElement = null;
                        return;
                    }

                    if (!isRightClick)
                        return;

                    var x = evt.pageX - this.offsetLeft;
                    var y = evt.pageY - this.offsetTop;

                    // todo: check if element is not absolute / relative / fixed

                    menuElement.style.left = x + "px";
                    menuElement.style.top = y + "px";

                    this.style.position = "relative";
                    this.appendChild(menuElement);
                }
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