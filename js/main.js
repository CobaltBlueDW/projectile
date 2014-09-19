
function simpleDateString(date){
    return (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
}

bootstrap.ready(function(){
Requires(['shs.Config', 'jsOverlay.HUD', 'jsOverlay.Tab', 'shs.TagManager'], function(){
    
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
    shs.Main.prototype.serverURL = null;
    shs.Main.prototype.username = null;
    shs.Main.prototype.display = null;
    
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
        this.config.getRemoteSettings();

        //load #tags
        this.tagManager = new shs.TagManager(this.config);
        
        //load ical
        this.iCal = new shs.iCal();

        //load display
        this.display = new jsOverlay.HUD('body');
        this.display.addTab("config", new jsOverlay.Tab(null, "Config", this.config));
        this.display.addTab("tags", new jsOverlay.Tab(null, "#Tags", this.tagManager));
        this.display.addTab("ical", new jsOverlay.Tab(null, "iCal", this.iCal));
        this.display.render();

        //add ical tab interactions
        jQuery('.shs-icaltab .shs-uploadfile').on('change', function(e){
            ical.file = e.target.files[0];

            var reader = new FileReader();
            reader.onload = function() {
                ical.fileContents = this.result;
                //ical = ICAL.parse(ical.fileContents);
                //if (ical) {
                //    jQuery('.shs-icaltab .shs-icalContents').text(JSON.stringify(ical, null, " "));
                //}

                var parser = new ICAL.ComponentParser({
                    parseEvent: true,
                    parseTimezone: false
                });
                parser.onevent = function(event){
                    //console.log(event);
                    ical.events.push({
                        description: event.summary,
                        duration: event.duration.hours+event.duration.minutes/60,
                        date: event.startDate
                    });
                };
                ical.events = [];
                ical.current = 0;
                parser.process(ical.fileContents);
            };
            reader.readAsText(ical.file);

        });
        jQuery('.shs-icaltab .shs-import').on('click', function(){
            TimeDay.addEditRow(jQuery('.timedayAddRow')[0], "new");
            setupRowInputInteractions(jQuery('.timedayAddRow')[0]);

            var cEvent = ical.events[ical.current];
            jQuery('input[name="timedayDate"]').val(simpleDateString(cEvent.date.toJSDate()));
            jQuery('input.timehours_input').click().val(cEvent.duration).blur();
            jQuery('input.timedayDescInput').click().val(cEvent.description).trigger('keydown');
            ical.current++;
        });
        jQuery('.shs-icaltab .shs-view').on('click', function(){
            var html = '';
            for(var index in ical.events){
                html += ical.events[index].date+' ';
                html += ical.events[index].enddate+' ';
                html += ical.events[index].duration+' ';
                html += ical.events[index].description+'\n';
            }
            jQuery('.shs-icaltab .shs-icalContents').text(html);
        });

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

        jQuery('.shs-overlaymenu .shs-remoteSave').on('click', function(){
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

        jQuery('.shs-overlaymenu .shs-remoteLoad').on('click', function(){
            jQuery.ajax({
                url: serverURL+'/server/services/SpringAhead.php?func=getUserPreferences',
                method: 'POST',
                crossdomain: true,
                processData: false,
                data: JSON.stringify({username: username}),
                context: this,
                success: function(data, textStatus, jqXHR){
                    //todo: signify completion
                    if (jqXHR.responseJSON) {
                        config = jqXHR.responseJSON;
                        //createCookie('shsConfg', config);
                    }
                }
            });
        });

        //setup menu
        if (this.config.menu && this.config.menu.startCollapsed) {
            jQuery('.shs-overlaymenu').attr('collapsed', "true");
        }

        //load hooks
        jQuery(document).on('click', 'button.timedayAddRow', function(e){
            setupRowInputInteractions(e);
        });
    }
    
    shs.app = new shs.Main();
    shs.app.run();
    
}, 'shs.Main');
}, this);

