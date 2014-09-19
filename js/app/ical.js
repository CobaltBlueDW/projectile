/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

bootstrap.ready(function(){
Requires([], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.iCal = function(){
        this.iCalConstructor();
    }
    
    //extends from ...
    shs.iCal.prototype = new Object();
    
    //constructor declaration
    shs.iCal.prototype.constructor = shs.iCal;
    
    //members
    shs.iCal.prototype.data = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.iCal.prototype.iCalConstructor = function(){
        
    }
    
    shs.iCal.prototype.render = function(selector){
        jQuery(selector).html(
                  "<div class='shs-col shs-col1'>"
                + " <div style='margin:6px'>"
                + "  <h4 style='margin:0 4px 0;display:inline-block;'>Import: </h4>"
                + "  <input type='file' class='shs-uploadfile' />"
                + "  <div class='shs-import shs-button'>Import</div>"
                + "  <div class='shs-view shs-button'>View</div>"
                + " </div>"
                + " <textarea class='shs-icalContents'></textarea>"
                + " <div class='shs-icalImportAddRow'></div>"
                + "</div>"
        );
    }
    
    shs.iCal.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.iCal');
}, this);
