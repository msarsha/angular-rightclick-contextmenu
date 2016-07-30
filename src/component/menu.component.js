(function () {
    angular
        .module('shContextMenu')
        .component('contextMenu', {
            bindings: {
                menuOptions: '<'
            },
            templateUrl: 'src/component/menu.html',
            controller: function () {
                this.$onInit = function () {
                   console.log(this.menuOptions);
                }

                this.onCLick = function($event){
                    debugger;
                }
            }
        })
})();