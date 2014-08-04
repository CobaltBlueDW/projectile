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
    shs.Config = function(serverURL, username){
        this.BaseConstructor(serverURL, username);
    }
    
    //extends from ...
    shs.Config.prototype = new Object();
    
    //constructor declaration
    shs.Config.prototype.constructor = shs.Config;
    
    //members
    shs.Config.prototype.data = null;
    shs.Config.prototype.serverURL = null;
    shs.Config.prototype.username = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.Config.prototype.BaseConfig = function(){
        this.data = this.getDefaultSettings();
    }
    
    shs.Config.prototype.getDefaultSettings = function(){
        return {
            projList: {
                "Admin Activities": true,
                "Payroll Related": true,
            },
            taskList:{
                "Administrative": true
            },
            menu: {
                startCollapsed: true
            },
            autocomplete: {
                list: {
                    email: {
                        label: "email",
                        value: "email",
                        revenueStream: "   Admin Activities",
                        task: "Emails"
                    }
                }
            },
            record: true,
            hideUnused: false,
            autoFillTask: true,
            autoFillProject: true
        };
    }
    
    shs.Config.prototype.getRemoteSettings = function(callback, context, extraParam){
        var self = this;
        jQuery.ajax({
            url: this.serverURL+'/server/services/SpringAhead.php?func=getUserPreferences',
            method: 'POST',
            crossdomain: true,
            processData: false,
            data: JSON.stringify({username: this.username}),
            context: this,
            success: function(data, textStatus, jqXHR){
                //todo: signify completion
                if (jqXHR.responseJSON) {
                    self.data = jqXHR.responseJSON;
                    callback.call(context, self, extraParam);
                }
            }
        });
    }
    
    shs.Config.prototype.setRemoteSettings = function(callback, context, extraParam){
        jQuery.ajax({
            url: this.serverURL+'/server/services/SpringAhead.php?func=setUserPreferences',
            method: 'POST',
            crossdomain: true,
            processData: false,
            data: JSON.stringify({username:this.username, preferences:this.data}),
            context: this,
            success: function(data, textStatus, jqXHR){
                //todo: signify completion
                callback.call(context, self, extraParam);
            }
        });
    }
    
    shs.Config.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.Config');

