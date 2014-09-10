/*
 * Base class for tabs of the hud
 * 
 * @returns {undefined}
 */

bootstrap.ready(function(){
Requires([], function(){
    
    var jsO = NameSpace('jsOverlay');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    jsO.HUD = function(selector){
        this.HUDConstructor(selector);
    }
    
    //extends from ...
    jsO.HUD.prototype = new Object();
    
    //constructor declaration
    jsO.HUD.prototype.constructor = jsO.HUD;
    
    //members
    jsO.HUD.prototype.renderTo = null;
    jsO.HUD.prototype.tabs = null;
    jsO.HUD.prototype.curTab = null;
    jsO.HUD.prototype.collapseTab = true;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    jsO.HUD.prototype.HUDConstructor = function(selector){
        this.renderTo = this.createRenderContainer(selector);
        this.tabs = {};
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
        this.drawTabPage(selector+' .shs-tabzone', this.curTab);
        
        var self = this;
        jQuery('.shs-overlaymenu .shs-tab').on('click', function(){
            var jthis = jQuery(this);
            if (!jthis.attr('tab')) return;
            self.curTab = jthis.attr('tab');
            
            self.render();
        });
        jQuery('.shs-overlaymenu .shs-menuCollapse').on('click', function(){
            var menu = jQuery(selector);
            if (menu.attr('collapsed') == "true") {
                menu.attr('collapsed', "false");
            } else {
                menu.attr('collapsed', "true");
            }
        });
    }
    
    jsO.HUD.prototype.drawTabs = function(selector){
        var html = "";
        for(var i in this.tabs){
            html += "<div class='shs-tabTarget-"+i+" shs-tab "+( i==this.curTab ? "shs-active" : "" )+"' tab='"+i+"' ></div>";
        }
        if (this.collapseTab) {
            html += "<div class='shs-menuCollapse shs-tab'>_</div>";
        }
        jQuery(selector).html(html);
        
        for(var i in this.tabs){
            this.tabs[i].drawTab(selector+' .shs-tabTarget-'+i);
        }
    }
    
    jsO.HUD.prototype.drawTabPage = function(selector, tabName){
        if (!selector) selector = this.renderTo;

        this.tabs[tabName].drawTabPage(selector);        
    }
    
    jsO.HUD.prototype.addTab = function(tabName, tabObj){
        if (tabName.indexOf(' ') > -1) throw new Exception("Tab name ("+tabName+") has a space in it.");
        if (!(this.tabs instanceof Object)) this.tabs = {};
        this.tabs[tabName] = tabObj;
        
        if (this.curTab === null) {
            this.curTab = tabName;
        }
    }
    
    jsO.HUD.prototype.showTab = function(tabName, selector){
        this.curTab = tabName;
        this.render(selector);
    }
    
}, 'jsOverlay.HUD');
}, this);