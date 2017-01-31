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