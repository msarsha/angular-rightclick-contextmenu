'use strict';

/**
 * @ngdoc directive
 * @name contextMenuApp.directive:contextMenu
 * @description
 * # contextMenu
 * Custom Context Menu Directive
 */
angular.module('contextMenuApp')
    .directive('contextMenu', ['$document', '$window', function ($document, $window) {
        // Runs during compile
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                var contextMenuElm,
                    $contextMenuElm,
                    windowWidth = window.innerWidth,
                    windowHeight = window.innerHeight,
                    contextMenuWidth,
                    contextMenuHeight,
                    contextMenuLeftPos = 0,
                    contextMenuTopPos = 0,
                    $w = $($window),
                    caretClass = {
                        topRight: 'context-caret-top-right',
                        topLeft: 'context-caret-top-left',
                        bottomRight: 'context-caret-bottom-right',
                        bottomLeft: 'context-caret-bottom-left'
                    },
                    menuItems = $attr.menuItems;
                function createContextMenu() {
                    var fragment = document.createDocumentFragment();

                    contextMenuElm = document.createElement('ul'),
                        $contextMenuElm = $(contextMenuElm);
                    contextMenuElm.setAttribute('id', 'context-menu');
                    contextMenuElm.setAttribute('class', 'custom-context-menu');
                    
                    mountContextMenu($scope[menuItems], fragment);
                    
                    contextMenuElm.appendChild(fragment);
                    document.body.appendChild(contextMenuElm);
                    contextMenuWidth = $contextMenuElm.outerWidth(true);
                    contextMenuHeight = $contextMenuElm.outerHeight(true);
                }
                
                function mountContextMenu(menuItems, fragment){
                	menuItems.forEach(function (_item) {
                    	var li = document.createElement('li');
	                        
                        li.innerHTML = '<a>' + _item.label + ' <span class="right-caret"></span></a>';
                        
                        if (_item.action && _item.active) {
                            li.addEventListener('click', function () {
                                if (typeof $scope[_item.action] !== 'function') return false;
                                $scope[_item.action]($attr, $scope);
                            }, false);
                        }
                        
                        if(_item.divider){
                    		addContextMenuDivider(fragment);
                    	} 
                        
                        if (!_item.active) li.setAttribute('class', 'disabled');
                        
                        if(_item.subItems) {
                        	addSubmenuItems(_item.subItems, li)
                        }
                        
                        fragment.appendChild(li);
                    });
                }

                function addSubmenuItems(subItems, parentLi){
                    parentLi.setAttribute('class', 'dropdown-submenu')
                    var ul = document.createElement('ul');
                    parentLi.setAttribute("class", "dropdown-menu")
                    mountContextMenu(subItems, ul)
                        	
                    parentLi.appendChild(ul)
                }
                
                function addContextMenuDivider(fragment){
                	var divider = document.createElement('li');
            		divider.className = 'divider'
            		fragment.appendChild(divider);
                }

                /**
                 * Removing context menu DOM from page.
                 * @return {[type]} [description]
                 */
                function removeContextMenu() {
                    $('.custom-context-menu').remove();
                }

                /**
                 * Apply new css class for right positioning.
                 * @param  {[type]} cssClass [description]
                 * @return {[type]}          [description]
                 */
                function updateCssClass(cssClass) {
                    $contextMenuElm.attr('class', 'custom-context-menu');
                    $contextMenuElm.addClass(cssClass);
                }

                /**
                 * [setMenuPosition description]
                 * @param {[type]} e       [event arg for finding clicked position]
                 * @param {[type]} leftPos [if menu has to be pointed to any pre-fixed element like caret or corner of box.]
                 * @param {[type]} topPos  [as above but top]
                 */
                function setMenuPosition(e, leftPos, topPos) {
                    contextMenuLeftPos = leftPos || e.pageX;
                    contextMenuTopPos = topPos - $w.scrollTop() || e.pageY - $w.scrollTop();

                    if (window.innerWidth - contextMenuLeftPos < contextMenuWidth && window.innerHeight - contextMenuTopPos > contextMenuHeight) {
                        contextMenuLeftPos -= contextMenuWidth;
                        updateCssClass(caretClass.topRight);

                    } else if (window.innerWidth - contextMenuLeftPos > contextMenuWidth && window.innerHeight - contextMenuTopPos > contextMenuHeight) {
                        updateCssClass(caretClass.topLeft);
                    } else if (windowHeight - contextMenuTopPos < contextMenuHeight && windowWidth - contextMenuLeftPos > contextMenuWidth) {
                        contextMenuTopPos -= contextMenuHeight;
                        updateCssClass(caretClass.bottomLeft);

                    } else if (windowHeight - contextMenuTopPos < contextMenuHeight && windowWidth - contextMenuLeftPos < contextMenuWidth) {
                        contextMenuTopPos -= contextMenuHeight;
                        contextMenuLeftPos -= contextMenuWidth;
                        updateCssClass(caretClass.bottomRight);
                    }

                    $contextMenuElm.css({
                        left: contextMenuLeftPos,
                        top: contextMenuTopPos
                    }).addClass('context-caret shown');
                }

                /**
                 * CONTEXT MENU
                 * @param  {[type]} evt [description]
                 * @return {[type]}     [description]
                 */
                $element.on('contextmenu.dirContextMenu', function (evt) {
                    evt.preventDefault();
                    removeContextMenu();
                    createContextMenu();

                    /**
                     * If pointer node has specified, let the context menu
                     * apprear right below to that elem no matter
                     * where user clicks within that element.
                     */
                    if ($attr.pointerNode) {
                        var $pointer = $(this).find($attr.pointerNode);
                        contextMenuLeftPos = $pointer.offset().left + ($pointer.outerWidth(true) / 2);
                        contextMenuTopPos = $pointer.offset().top + $pointer.outerHeight(true);
                        setMenuPosition(evt, contextMenuLeftPos, contextMenuTopPos);
                    } else {
                        setMenuPosition(evt);
                    }

                    $w.on('keydown.dirContextMenu', function (e) {
                        if (e.keyCode === 27) {
                            removeContextMenu();
                        }
                    })

                }); //END (on)click.dirContextMenu

                $document.off('click.dirContextMenu').on('click.dirContextMenu', function (e) {
                    if (!$(e.target).is('.custom-context-menu') && !$(e.target).parents().is('.custom-context-menu')) {
                        removeContextMenu();
                    }
                });

                $w.off('scroll.dirContextMenu').on('scroll.dirContextMenu', function () {
                    removeContextMenu();
                });

                $w.on('resize.dirContextMenu', function () {
                    windowWidth = window.innerWidth;
                    windowHeight = window.innerHeight;
                    removeContextMenu();
                });

            }
        };
    }]);