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
    shs.Print = function(){
        this.PrintConstructor();
    }
    
    //extends from ...
    shs.Print.prototype = new Object();
    
    //constructor declaration
    shs.Print.prototype.constructor = shs.Print;
    
    //members
    shs.Print.prototype.config = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.Print.prototype.PrintConstructor = function(){
        this.config = {};
    }
    
    shs.Print.prototype.render = function(selector){
        jQuery(selector).html(
                "<div>"
                + "nothing to see here"
                + "</div>"
        );
        
        this.promptPrint();
    }
    
    shs.Print.prototype.promptPrint = function(){
        var curURL = window.location.href.toString();
        curURL = curURL.replace('TimeDay', 'TimecardView');
        curURL = curURL.replace(/\&timeStyle=\d*\&viewType=\d*/ig, '');
        curURL = curURL.replace(/\&timeCycle=\d*\&groupBy=\w*\&showStatus=\w*/ig, '');
        
        var winPrint = window.open(curURL, "Print Window");
        winPrint.onafterprint = (function(){ this.close(); }).bind(winPrint);
        winPrint.onload = (function(){ this.print(); }).bind(winPrint);
    }
    
}, 'shs.Print');
}, this);

