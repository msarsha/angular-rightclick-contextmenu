# angular-rightclick-contextmenu

_Right click context menu for angular 1.5 - https://sarsha17.github.io/angular-right-click/_

### Build
To build close the repo and run:    `gulp`


### How to use:

* Add the `sh-context-menu` directive to the element you wish to enable the context menu functionality.
* Provide a options array that will contain the context menu objects using the `menu-options` binding.
* Provide a data context object using the `context-data` binding.

### `menu-options` 

`menu-options` should be an Array with the following structure:

````javascript
[
    {
        label: 'Save',        // menu option label
        onClick: function($event){  // on click handler
        }   
    },
    {
        label: 'Edit',
        onClick: menuEdit,
        disabled: function (dataContext) { // disabled handler
            return true;
        }
      },
      {
        label: 'Details',
        onClick: function($event){  // on click handler
        }   
      },
      {
        divider: true       // will render a divider
      },
      {
        label: 'Remove',
        onClick: function($event){  // on click handler
        }   
      }
  ]
````

#### The `onClick` handler

The `onClick` handler is a function with `$event` parameter.

The `$event` object will contain the following parameters:
* `option` object that contain the option the user pressed
* `dataContext` object that was injected using the `context-data` binding


#### The `disabled` handler

The `disabled` handler is a function with `dataContext` parameter.

This handler will be injected with the dataContext provided using the `context-data` binding
and will return true/false to disable the current menu option for the current dataContext



### `context-data` 

The `context-data` object will be injected into the `onClick` and `disabled` handlers.



### Examples:

Example can be found under `example/`
