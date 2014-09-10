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
    jsO.Tab = function(selector, label, renderableObj){
        this.TabConstructor(selector, label, renderableObj);
    }
    
    //extends from ...
    jsO.Tab.prototype = new Object();
    
    //constructor declaration
    jsO.Tab.prototype.constructor = jsO.Tab;
    
    //members
    jsO.Tab.prototype.label = "Label";
    jsO.Tab.prototype.renderTo = null;
    jsO.Tab.prototype.renderableContent = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    jsO.Tab.prototype.TabConstructor = function(selector, label, renderableObj){
        this.renderTo = selector;
        if (label) this.label = label;
        if (renderableObj) this.renderableContent = renderableObj;
    }
    
    jsO.Tab.prototype.drawTab = function(selector){
        jQuery(selector).html(this.label);
    }
    
    jsO.Tab.prototype.drawTabPage = function(selector){
        jQuery(selector).html("<div class='shs-tabcontent'></div>");
        
        this.renderableContent.render(selector+' .shs-tabcontent');
    }
    
}, 'jsOverlay.Tab');
}, this);
