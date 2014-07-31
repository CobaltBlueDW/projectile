/**
 * Context Helper for Base code
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
Requires([], function(){
    
    var CH = NameSpace('ext.ContextHelpers.Type');

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    CH.Base = function(selector){
        this.BaseConstructor(selector);
    }
    
    //extends from ...
    CH.Base.prototype = new Object();
    
    //constructor declaration
    CH.Base.prototype.constructor = CH.Base;
    
    CH.Base.prototype.heading = "Quick Links";
    CH.Base.prototype.renderTo = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    CH.Base.prototype.BaseConstructor = function(selector){
        this.renderTo = selector;
        this.bindToLinks();
    }
    
    /**
     * adds context menus for each link of this type
     * 
     * @param {type} params
     * @returns {undefined}
     */
    CH.Base.prototype.bindToLinks = function(){
        var self = this;
        jQuery(this.getLinkSelector()).each(function(index, element){
           jQuery(element).find('.ext-contexthelpers-nub').remove();
           var nub = self.getNub(element).prependTo(element);
        });
    }
    
    /**
     * returns selector for grabbing links to add context menus to
     * 
     * @returns {String}
     */
    CH.Base.prototype.getLinkSelector = function(){
        return 'a[href*="base.php?"]';
    }
    
    /**
     * returns a heading for the context menu
     * 
     * @param {element} element This variable can be used for overloading this 
     *  function where the element may have an affect on the header
     * @returns {String}
     */
    CH.Base.prototype.getHeading = function(element){
        return this.heading;
    }
    
    /**
     * returns a jQuery element "nub" which gets attached to the link and can be clicked to open the menu
     * 
     * @returns {jQuery}
     */
    CH.Base.prototype.getNub = function(element){
        var self = this;
        return jQuery("<div class='ext-contexthelpers-nub'></div>").on('click', function(event){
            event.preventDefault();
            self.drawMenu(self.renderTo, event, element);
            jQuery(self.renderTo).css({ top: event.pageY, left: event.pageX });
            jQuery(self.renderTo).show();
        });
    }
    
    /**
     * returns a menu
     * 
     * @param {element} element to base menu off of
     * @returns {jQuery}    a jQuery verion of an element
     */
    CH.Base.prototype.drawMenu = function(selector, event, element){
        var menu = " <div class='header'>"+this.getHeading(element)+"</div>"
                 + " <div class='content'>"
                 +    this.getLinks(ext.ContextHelpers.getURLParams(element))
                 + " </div>";
        jQuery(selector).html(menu);
        
        jQuery(selector).on('click', function(event){
            jQuery(selector).hide();
        });
    }
    
    /**
     * compiles and returns a list of links
     * 
     * @param {String} params   list of url params to append to urls
     * @returns {String}    html of links items
     */
    CH.Base.prototype.getLinks = function(params){
        text = this.makeLink("/example.php?"+params, "example");
        
        return text;
    }
    
    /**
     * returns a uniform link item
     * 
     * @param {String} url  the url
     * @param {String} text   url text
     * @returns {String}    html of a link
     */
    CH.Base.prototype.makeLink = function(url, text){
        return "<div class='ext-contexthelpers-menuitem'><a href='"+url+"'>"+text+"</a></div>";
    }
    
}, 'ext.ContextHelpers.Type.Base');
