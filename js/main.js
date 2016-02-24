
function simpleDateString(date){
    return (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
}

bootstrap.ready(function(){
Requires(['shs.Config', 'jsOverlay.HUD', 'jsOverlay.Tab', 'shs.TagManager', 'shs.TimeInput', 'shs.iCal', 'shs.Print'], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.Main = function(){
        this.MainConstructor();
    }
    
    //extends from ...
    shs.Main.prototype = new Object();
    
    //constructor declaration
    shs.Main.prototype.constructor = shs.Main;
    
    //members
    shs.Main.prototype.config = null;
    shs.Main.prototype.tagManager = null;
    shs.Main.prototype.iCal = null;
    shs.Main.prototype.print = null;
    shs.Main.prototype.serverURL = null;
    shs.Main.prototype.username = null;
    shs.Main.prototype.display = null;
    shs.Main.prototype.timeInput = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.Main.prototype.MainConstructor = function(){
        this.serverURL = jQuery('meta[name="appServerURL"]').attr('content');
        this.username = util.getCookie('LoginName', true);
    }
    
    shs.Main.prototype.run = function(){
        //load config
        this.config = new shs.Config(this.serverURL, this.username);
        
        //load #tags
        this.tagManager = new shs.TagManager(this.config);
        
        //create input manager
        this.timeInput = new shs.TimeInput(this.config);
        
        //load ical
        this.iCal = new shs.iCal(this.timeInput);
        
        //load print
        this.print = new shs.Print();
        
        //load display
        this.display = new jsOverlay.HUD('body');
        this.display.addTab("tags", new jsOverlay.Tab(null, "#Tags", this.tagManager));
        this.display.addTab("ical", new jsOverlay.Tab(null, "iCal", this.iCal));
        this.display.addTab("print", new jsOverlay.Tab(null, "Print", this.print));
        this.display.addTab("config", new jsOverlay.Tab(null, "Config", this.config));
        this.display.render();
        
        this.config.getRemoteSettings( function(){ this.display.render(); }, this);
        
        //add other interactions
        var self = this;
        window.setInterval(function(){ self.config.setRemoteSettings(); }, 1000*60);
        
        jQuery('#submitall').on('click', function(){
            jQuery.ajax({
                url: serverURL+'/server/services/SpringAhead.php?func=setUserPreferences',
                method: 'POST',
                crossdomain: true,
                processData: false,
                data: JSON.stringify({username:username, preferences:config}),
                context: this,
                success: function(data, textStatus, jqXHR){
                    //todo: signify completion
                }
            });
        });
        
        //setup menu
        if (this.config.data.menu && this.config.data.menu.startCollapsed) {
            this.display.toggleCollapse("true");
        }
        
        //load hooks
        jQuery(document).on('click', 'button.timedayAddRow', function(e){
            self.timeInput.renderTo('.timedaySectionBody');
        });
    };
    
    shs.app = new shs.Main();
    shs.app.run();
    
}, 'shs.Main');
}, this);