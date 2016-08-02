angular
    .module('app', [
        'shContextMenu'
    ])
    .controller('appCtrl', function () {
        var self = this;

        self.items = [
            {
                name: 'item 1',
                data: 'the data !'
            },
            {
                name: 'item 2',
                data: 'the data !'
            },
            {
                name: 'item 3',
                data: 'the data !'
            },
            {
                name: 'item 4',
                data: 'the data !'
            },
        ]
        
        self.menuOptions = 
        [
            {
                label: 'Save',      // menu option label
                onClick: menuSave   // on click handler
            },
            {
                label: 'Edit',
                onClick: menuEdit,
                disabled: function (dataContext) {
                    return dataContext.name === "item 2";
                }
            },
            {
                label: 'Details',
                onClick: menuEdit
            },
            {
                divider: true       // will render a divider
            },
            {
                label: 'Remove',
                onClick: menuRemove
            }
        ]
        
        self.anotherMenuOptions = 
        [
            {
                label: 'Different Menu',      // menu option label
                onClick: menuSave,   // on click handler
                disabled: function(dataContext){
                    return dataContext.name === "item 4";
                }
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
