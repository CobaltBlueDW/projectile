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
    shs.Config = function(serverURL, username){
        this.ConfigConstructor(serverURL, username);
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
    shs.Config.prototype.ConfigConstructor = function(serverURL, username){
        this.data = this.getDefaultSettings();
        this.serverURL = serverURL;
        this.username = username;
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
                    if (callback instanceof Function) callback.call(context, self, extraParam);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                throw errorThrown+":"+jqXHR;
            }
        });
    }
    
    shs.Config.prototype.setRemoteSettings = function(callback, context, extraParam){
        var self = this;
        jQuery.ajax({
            url: this.serverURL+'/server/services/SpringAhead.php?func=setUserPreferences',
            method: 'POST',
            crossdomain: true,
            processData: false,
            data: JSON.stringify({username:this.username, preferences:this.data}),
            context: this,
            success: function(data, textStatus, jqXHR){
                //todo: signify completion
                if (callback instanceof Function) callback.call(context, self, extraParam);
            }
        });
    }
    
    shs.Config.prototype.render = function(selector){
        jQuery(selector).html(
                "<div class='shs-col shs-col1'>"
                + "<div style='margin:6px'>"
                + "<h4 style='margin:0 4px 0;display:inline-block;'>Config: </h4>"
                + "<div class='shs-update shs-button'>Update</div>"
                + "<div class='shs-refresh shs-button'>Refresh</div>"
                + "<div class='shs-remoteSave shs-button'>Remote Save</div>"
                + "<div class='shs-remoteLoad shs-button'>Remote Load</div>"
                + "</div>"
                + "<textarea class='shs-configList'>"+this.toString()+"</textarea>"
                + "</div>"
        );
        
        var self = this;
        jQuery(selector+' .shs-refresh').on('click', function(){
            self.render(selector);
        });
        jQuery(selector+' .shs-update').on('click', function(){
            var temp = JSON.parse(jQuery(selector+' .shs-configList').val());
            self.data = temp;
            self.render();
        });
        jQuery(selector+' .shs-remoteSave').on('click', function(){
            self.setRemoteSettings();
        });
        jQuery(selector+' .shs-remoteLoad').on('click', function(){
            self.getRemoteSettings(self.render, self, selector);
        });
    }
    
    shs.Config.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.Config');
}, this);

