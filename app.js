(function () {
    angular
        .module('app', [
            'shContextMenu'
        ])
        .controller('appCtrl', function () {
            var self = this;

            self.items = [
                {
                    name: 'item 1',
                },
                {
                    name: 'item 2',
                },
                {
                    name: 'item 3',
                },
                {
                    name: 'item 4',
                },
            ]

            self.menuOptions = [
                {
                    label: 'save',
                    onClick: menuSave
                },
                {
                    divider: true
                },
                {
                    label: 'remove',
                    onClick: menuRemove
                },
                {
                    label: 'edit',
                    onClick: menuEdit
                }
            ]

            function menuSave($event) {
                console.log($event);
            }
            function menuRemove($event) {
                console.log($event);
            }
            function menuEdit($event) {
                console.log($event);
            }
        });
})();