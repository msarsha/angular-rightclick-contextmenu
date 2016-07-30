(function () {
    angular
        .module('shContextMenu')
        .component('contextMenu', {
            bindings: {
                menuOptions: '<',
                data: '<',
                closeMenu: '&'
            },
            templateUrl: 'src/component/menu.html',
            controller: function () {
                var self = this;

                this.$onInit = function () {
                    console.log(this.menuOptions);
                }

                this.onClick = function ($event, opt) {
                    self.closeMenu();

                    opt.onClick({
                        option: opt,
                        dataContext: self.data
                    });
                }
            }
        })
})();