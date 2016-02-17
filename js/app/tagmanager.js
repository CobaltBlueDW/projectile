/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

bootstrap.ready(function(){
Requires(['shs.Config', 'shs.HashTag'], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.TagManager = function(config){
        this.TagManagerConstructor(config);
    }
    
    //extends from ...
    shs.TagManager.prototype = new Object();
    
    //constructor declaration
    shs.TagManager.prototype.constructor = shs.TagManager;
    
    //members
    shs.TagManager.prototype.config = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.TagManager.prototype.TagManagerConstructor = function(config){
        this.config = config;
    }
    
    shs.TagManager.prototype.render = function(selector){
        jQuery(selector).html(
                  "<div class='shs-col shs-col2'>"
                + " <div style='margin:6px'>"
                + "  <h4 style='margin:0 4px 0;display:inline-block;'>Tag Settings</h4>"
                + "  <div><span>Tag: </span><span>#</span><input type='text' class='shs-tags-tagInput'/></div>"
                + "  <div><span>Auto Complete Label: </span><input type='text' class='shs-tags-labelInput'/></div>"
                + "  <div><span>Fill Text: </span><input type='text' class='shs-tags-valueInput'/></div>"
                + "  <div><span>Project: </span><input type='text' class='shs-tags-revenueStreamInput'/></div>"
                + "  <div><span>Task: </span><input type='text' class='shs-tags-taskInput'/></div>"
                + "  <div><span>Hours: </span><input type='text' class='shs-tags-hoursInput'/></div>"
                + "  <div><div class='shs-tags-save shs-button'>Update</div></div>"
                + " </div>"
                + "</div>"
        );
    }
    
}, 'shs.TagManager');
}, this);

