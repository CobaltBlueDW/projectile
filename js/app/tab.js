/*
 * Base class for tabs of the hud
 * 
 * @returns {undefined}
 */

bootstrap.ready(function(){
Requires([], function(){
    
    var jsO = NameSpace('jsOverlay');

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    jsO.Tab = function(selector){
        this.BaseConstructor(selector);
    }
    
    //extends from ...
    jsO.Tab.prototype = new Object();
    
    //constructor declaration
    jsO.Tab.prototype.constructor = jsO.Tab;
    
    //members
    jsO.Tab.prototype.label = "Label";
    jsO.Tab.prototype.renderTo = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    jsO.Tab.prototype.TabConstructor = function(selector){
        this.renderTo = selector;
    }
    
}, 'jsOverlay.Tab');
}, this);
