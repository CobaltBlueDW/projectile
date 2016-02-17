/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
bootstrap.ready(function(){
Requires(['util'], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;
    var serverURL = jQuery('meta[name="appServerURL"]').attr('content');
    var username = util.getCookie('LoginName', true);

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.HashTag = function(config, ticketInfo){
        this.HashTagConstructor(config, ticketInfo);
    }
    
    //extends from ...
    shs.HashTag.prototype = new Object();
    
    //constructor declaration
    shs.HashTag.prototype.constructor = shs.HashTag;
    
    //members
    shs.HashTag.prototype.tag = null;
    shs.HashTag.prototype.label = null;
    shs.HashTag.prototype.value = null;
    shs.HashTag.prototype.project = null;
    shs.HashTag.prototype.task = null;
    shs.HashTag.prototype.type = null;
    shs.HashTag.prototype.hours = null;
    shs.HashTag.prototype.description = null;
    shs.HashTag.prototype.date = null;
    shs.HashTag.prototype.ticket = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.HashTag.prototype.HashTagConstructor = function(config, ticketInfo){
        if (config.tag) this.tag = config.tag;
        if (config.label) this.label = config.label;
        if (config.value) this.value = config.value;
        if (config.revenueStream && !config.project) config.project = config.revenueStream;
        
        this.project = this.prepPriority(config.project);
        this.task = this.prepPriority(config.task);
        this.type = this.prepPriority(config.type);
        this.hours = this.prepPriority(config.hours);
        this.description = this.prepPriority(config.description);
        this.date = this.prepPriority(config.date);
        this.assignTicket(ticketInfo);
    }
    
    shs.HashTag.prototype.prepPriority = function(obj){
        if (obj == undefined) return null;
        if (typeof obj === 'string' || obj instanceof String) obj = { priority: 10, input: obj };
        if (typeof obj === 'number' || obj instanceof Number) obj = { priority: 10, input: obj };
        if (obj.input == undefined) return null;
        if (obj.priority === undefined) obj.priority = 1;
        
        return obj;
    }
    
    shs.HashTag.prototype.assignTicket = function(ticketInfo){
        if (ticketInfo == undefined) return null;
        
        this.ticket = ticketInfo;
        if (ticketInfo.revenueStream) {
            this.project = this.prepPriority({ priority: 100, input: ticketInfo.revenueStream });
        }
    }
    
}, 'shs.HashTag');
}, this);
