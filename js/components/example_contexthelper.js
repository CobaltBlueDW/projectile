/**
 * Context Helper code
 *
 * @copyright Copyright 2013 Web Courseworks, Ltd.
 * @license   http://www.gnu.org/licenses/gpl-3.0.txt GNU Public License 3.0
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Requires(['ext.ContextHelpers.Type.Base', 'ext.ContextHelpers.Type.Users'], function(){
    
    var CH = NameSpace('ext.ContextHelpers');

    CH.placementSelector = 'body';
    CH.containerClass = 'ext-contexthelpers-menu';
    CH.menuSelector = CH.placementSelector+' .'+CH.containerClass;
    CH.typePool = null;

    CH.getURLParams = function(element){
        var href = element.getAttribute('href');
        return href.substr(href.indexOf('?')+1);
    }
    
    CH.createContextMenuContainer = function(selector){
        var html = "<div class='"+CH.containerClass+" block'></div>";
        jQuery(html).appendTo(selector).hide();
    }
    
    CH.startMenu = function(contextMenu, selector){
        return new contextMenu(selector);
    }
    
    CH.startAllMenus = function(selector){
        //load menus for any type that has ben defined
        //the config will load only the types that have been turned on
        CH.typePool = {};
        
        for(var type in CH.Type){
           if(type == 'Base') continue;
           CH.typePool[type] = CH.startMenu(CH.Type[type], selector);
        }
    }
    
    CH.updateLinksFor = function(linkClassName){
        CH.typePool[linkClassName].bindToLinks();
    }
    
    CH.updateLinks = function(){
        for(var className in CH.typePool){
            CH.updateLinksFor(className);
        }
    }

    jQuery().ready(function(){
        CH.createContextMenuContainer(CH.placementSelector);
        CH.startAllMenus(CH.menuSelector);
    });

}, 'ext.ContextHelpers');
