/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Requires([], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.iCal = function(serverURL, username){
        this.iCalConstructor(serverURL, username);
    }
    
    //extends from ...
    shs.iCal.prototype = new Object();
    
    //constructor declaration
    shs.iCal.prototype.constructor = shs.iCal;
    
    //members
    shs.iCal.prototype.data = null;
    shs.iCal.prototype.serverURL = null;
    shs.iCal.prototype.username = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.iCal.prototype.iCalConstructor = function(serverURL, username){
        this.data = this.getDefaultSettings();
        this.serverURL = serverURL;
        this.username = username;
    }
    
    shs.iCal.prototype.getDefaultSettings = function(){
        return {
            file: null,
            fileContents: null,
            events: null
        };
    }
    
    shs.iCal.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.iCal');

