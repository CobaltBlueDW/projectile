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
                "857889,1,1": "   Admin Activities",
                "1499496,1,1": "   Developers"
            },
            taskList:{
                "192419": "Emails & Meetings"
            },
            menu: {
                startCollapsed: true
            },
            autocomplete: {
                list: {
                    email: {
                        label: "email/hipchat/JIRA/etc.",
                        value: "email/hipchat/JIRA/etc.",
                        task: "192419",
                        hours: 0.25,
                        project: "1499496,1,1"
                    }
                },
                singleOptionAutoSelect: true
            },
            iCal:{
                attemptFirstWordHashtag: true
            },
            record: true,
            hideUnused: false,
            autoFillTask: true,
            autoFillProject: true,
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
                + "<textarea class='shs-configList'>"+this.toString()+"</textarea>"
                + "<div class='shs-formrow'>"
                + " <div class='shs-remoteSave shs-button'>Save</div>"
                + " <div class='shs-remoteLoad shs-button'>Load</div>"
                + "</div>"
                + "</div>"
        );
        
        var self = this;
        jQuery(selector+' .shs-remoteSave').on('click', function(){
            //todo fix save bug
            var temp = JSON.parse(jQuery(selector+' .shs-configList').val());
            self.data = temp;
            self.setRemoteSettings();
            self.render();
        });
        jQuery(selector+' .shs-remoteLoad').on('click', function(){
            //todo fix load bug
            self.getRemoteSettings(self.render, self, selector);
        });
    }
    
    shs.Config.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.Config');
}, this);

