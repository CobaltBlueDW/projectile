/*
 * Base class for tabs of the hud
 * 
 * @returns {undefined}
 */

Requires([], function(){
    
    var jsO = NameSpace('jsOverlay');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    jsO.HUD = function(selector){
        this.BaseConstructor(selector);
    }
    
    //extends from ...
    jsO.HUD.prototype = new Object();
    
    //constructor declaration
    jsO.HUD.prototype.constructor = jsO.HUD;
    
    //members
    jsO.HUD.prototype.renderTo = null;
    jsO.HUD.prototype.tabs = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    jsO.HUD.prototype.HUDConstructor = function(selector){
        this.renderTo = this.createRenderContainer(selector);
        this.tabs = [];
    }
    
    jsO.HUD.prototype.createRenderContainer = function(selector){
        if (!selector) selector = this.renderTo;
        
        jQuery(selector).append("<div class='shs-overlaymenu'></div>");
        
        return selector+' .shs-overlaymenu';
    }
    
    jsO.HUD.prototype.render = function(selector){
        if (!selector) selector = this.renderTo;
        
        var html = "<div class='shs-tabs'></div>"
                 + "<div class='shs-tabzone'></div>";
        jQuery(selector).html(html);
        
        this.drawTabs(selector+' .shs-tabs');
        this.drawTabPage(selector+' .shs-tabzone');
        
        jQuery('.shs-overlaymenu .shs-tab').on('click', function(){
            var jthis = jQuery(this);
            if (!jthis.attr('tab')) return;
            jQuery('.shs-overlaymenu .shs-tabs > .shs-tab[tab]').removeClass('shs-active');
            jthis.addClass('shs-active');
            jQuery('.shs-overlaymenu .shs-tabzone > .shs-tabcontent').hide();
            jQuery('.shs-overlaymenu .shs-tabzone > .'+jthis.attr('tab')).show();

            var menu = jQuery('.shs-overlaymenu');
            if (menu.attr('collapsed') == "true") {
                menu.attr('collapsed', "false");
            }
        });
    }
    
    jsO.HUD.prototype.drawTabs = function(selector){
        var html = "";
        for(var i=0; i<this.tabs.length; i++){
            html += "<div class='shs-tabTarget-"+i+" shs-tab'></div>";
        }
        jQuery(selector).html(html);
        
        for(var i=0; i<this.tabs.length; i++){
            this.tabs[i].drawTab(selector+' .shs-tabTarget-'+i);
        }
    }
    
    jsO.HUD.prototype.drawTabPage = function(selector, tabIndex){
        if (!selector) selector = this.renderTo;
        
        
    }
    
}, 'jsOverlay.HUD');