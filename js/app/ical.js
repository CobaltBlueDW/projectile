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
    shs.iCal = function(config, TimeInput){
        this.iCalConstructor(config, TimeInput);
    }
    
    //extends from ...
    shs.iCal.prototype = new Object();
    
    //constructor declaration
    shs.iCal.prototype.constructor = shs.iCal;
    
    //static methods
    shs.iCal.prettyDate = function(jCalDate){
        return jCalDate.toJSDate().toLocaleTimeString("en-us", {
            weekday: "long", 
            year: "numeric", 
            month: "short",
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit"
        });
    }
    
    //members
    shs.iCal.prototype.renderTarget = null;
    shs.iCal.prototype.config = null;
    shs.iCal.prototype.file = null;
    shs.iCal.prototype.fileContents = null;
    shs.iCal.prototype.events = null;
    shs.iCal.prototype.current = 0;
    shs.iCal.prototype.timeInput = null;
    shs.iCal.prototype.play = false;
    shs.iCal.prototype.autoProgressChecker = null;
    shs.iCal.prototype.details = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.iCal.prototype.iCalConstructor = function(config, TimeInput){
        this.timeInput = TimeInput;
        this.config = config;
    }
    
    shs.iCal.prototype.render = function(selector){
        if (!selector) {
            selector = this.renderTarget;
        } else {
            this.renderTarget = selector;
        }
        
        jQuery(selector).html(
                "<div class='shs-col'>"
              + " <div style='margin:6px'>"
              + "  <h4 style='margin:0 4px 0;display:inline-block;'>Import: </h4>"
              + "  <input type='file' class='shs-uploadfile' />"
              + "  <div class='shs-play shs-button"+(this.play ? " shs-active" : "")+"'>"+(this.play ? "Pause" : "Play")+"</div>"
              + "  <span> | </span>"
              + "  <div class='shs-previous shs-button'>Previous</div>"
              + "  <div class='shs-send shs-button'>Send</div>"
              + "  <div class='shs-next shs-button'>Next</div>"
              + " </div>"
              + " <div class='shs-icalContents'></div>"
              + " <div class='shs-icalImportAddRow'></div>"
              + "</div>"
              + "<div class='shs-col'>"
              + "<h4>Details:</h4>"
              + "<div><span>Records:</span><span class='shs-ical-reccount'></span></div>"
              + "<div><span>Time:</span><span class='shs-ical-timesum'></span></div>"
              + "</div>"
        );

        this.drawiCalTable(selector+' .shs-icalContents');
        this.drawiCalDetails(selector);
        
        var self = this;
        jQuery(selector+' .shs-uploadfile').on('change', function(e){
            self.file = e.target.files[0];

            var reader = new FileReader();
            reader.onload = function() {
                self.fileContents = this.result;
                self.events = [];
                self.current = -1;

                var jCalData = new ICAL.Component(ICAL.parse(self.fileContents));

                //add all timezones manually, like a chump
                var vtimezones = jCalData.getAllSubcomponents("vtimezone");
                for(var key in vtimezones){
                    ICAL.TimezoneService.register(vtimezones[key]);
                }
                
                //parse all events
                var vevents = jCalData.getAllSubcomponents("vevent");
                for(var key in vevents){
                    var event = new ICAL.Event(vevents[key]);
                    
                    if (event.isRecurring()) {
                        var eventSet = event.iterator();
                        var occur;
                        while(occur = eventSet.next()){
                            var simpleEvent = {
                                uid: event.uid,
                                description: event.summary,
                                duration: event.duration.hours + event.duration.minutes/60,
                                date: occur
                            };
                            
                            if (!simpleEvent.enddate) {
                                occur.addDuration(event.duration);
                                simpleEvent.enddate = occur;
                            }
                            
                            self.events.push(simpleEvent);
                        }
                    } else if (event.isRecurrenceException()) {
                        
                        //find existing event to alter
                        for(var i=0; i< self.events.length; i++){
                            if (self.events[i].uid == event.uid) {
                                var absdiffsec = Math.abs(event.recurrenceId.subtractDateTz(self.events[i].date).toSeconds());
                                // To overcome Day Light Savings, we are doing a fuzzy identity check to within an hour (3600 secs) of each other.
                                // this would obviously break in the odd case where you'd have a recurrence pattern that places multiple occurance
                                // withing the same hour of one another, and there were occurance exceptions for them.
                                // I just don't care enough to spend anymore time on this. :/
                                if (absdiffsec <= 3600) {
                                    var alterThis = self.events[i];
                                    break;
                                }
                            }
                        }
                        
                        if (alterThis) {
                            if (event.summary) {
                                alterThis.description = event.summary;
                            }
                            if (event.duration) {
                                alterThis.duration = event.duration.hours + event.duration.minutes/60;
                            }
                            if (event.startDate) {
                                alterThis.date = event.startDate;
                            }
                            if (event.endDate) {
                                alterThis.enddate = event.endDate;
                            }
                        } else {
                            self.events.push({
                                description: event.summary,
                                duration: event.duration.hours + event.duration.minutes/60,
                                date: event.startDate,
                                enddate: event.endDate
                            });
                        }
                    } else {
                        self.events.push({
                            description: event.summary,
                            duration: event.duration.hours + event.duration.minutes/60,
                            date: event.startDate,
                            enddate: event.endDate
                        });
                    }
                }
                
                self.events.sort(function(a,b){
                    return a.date.compare(b.date);
                });
                
                self.render(selector);
            };
            reader.readAsText(self.file);
        });
        
        jQuery(selector+' .shs-next').on('click', function(){
            self.nextEvent();
            self.drawiCalTable(selector+' .shs-icalContents');
        });
        
        jQuery(selector+' .shs-previous').on('click', function(){
            self.prevEvent();
            self.drawiCalTable(selector+' .shs-icalContents');
        });
        
        jQuery(selector+' .shs-play').on('click', function(){
            self.play = !self.play;
            self.setupAutoProgress();
            self.render(selector);
        });
        
        jQuery(selector+' .shs-send').on('click', function(){
            self.sendCurrent();
        });
    }
    
    shs.iCal.prototype.drawiCalTable = function(selector){
        var html = '<table><tr><th>Date</th><th>Hours</th><th>Description</th></tr>';
        for(var index in this.events){
            html += '<tr eventindex="'+index+'">';
            html += '<td>'+shs.iCal.prettyDate(this.events[index].date)+'</td>';
            html += '<td>'+this.events[index].duration+'</td>';
            html += '<td>'+this.events[index].description+'</td>';
            html += '</tr>';
        }
        html += '</table>';
        jQuery(selector).html(html);
        jQuery(selector+' tr[eventindex='+this.current+']').addClass('shs-icalCurrentRow');
        
        var self = this;
        jQuery(selector+' tr[eventindex]').on('click', function(e){
            var newIndex = parseInt(jQuery(this).attr('eventindex'), 10);
            self.current = newIndex;
            self.drawiCalTable(selector);
        });
    }
    
    shs.iCal.prototype.setupAutoProgress = function(){
        if (!this.autoProgressChecker && this.play) {
            var self = this;
            this.autoProgressChecker = window.setInterval(function(){ 
                if (jQuery('.timedaySectionBody  button.save').length == 0) {
                    if (self.nextEvent()) {
                        self.sendCurrent();
                    } else {
                        self.play = false;
                        window.clearInterval(self.autoProgressChecker);
                        self.autoProgressChecker = null;
                    }
                    self.render();
                }
            }, 200);
        } else if (this.autoProgressChecker && !this.play) {
            window.clearInterval(this.autoProgressChecker);
            this.autoProgressChecker = null;
        }
    }
    
    shs.iCal.prototype.drawiCalDetails = function(selector){
        this.calculateDetails();
        jQuery(selector+' .shs-ical-reccount').text(this.details.reccount);
        jQuery(selector+' .shs-ical-timesum').text(this.details.timesum);
    }
    
    shs.iCal.prototype.calculateDetails = function(){
        if (!this.details) {
            this.details = {
                reccount: 0,
                timesum: 0
            };
        }
        
        //reset all stats
        this.details.reccount = 0;
        this.details.timesum = 0;
        
        for(var index in this.events){
            this.details.reccount++;
            this.details.timesum += this.events[index].duration;
        }
    }
    
    shs.iCal.prototype.sendCurrent = function(){
        TimeDay.addEditRow(jQuery('.timedayAddRow')[0], "new");
        this.timeInput.resetPriorities();
        this.timeInput.setupRowInputInteractions();

        var cEvent = this.events[this.current];
        
        //turn the first word into a hashtag if appropraite
        if (this.config.data.iCal.attemptFirstWordHashtag) {
            var firstWord = cEvent.description.split(" ")[0];
            if (this.config.data.autocomplete && this.config.data.autocomplete.list && this.config.data.autocomplete.list[firstWord]) {
                cEvent.description = "#"+cEvent.description;
            }
        }
        
        jQuery('input[name="timedayDate"]').val(simpleDateString(cEvent.date.toJSDate()));
        jQuery('input.timehours_input').click().val(cEvent.duration).attr('priority', 200).blur();
        jQuery('input.timedayDescInput').click().val(cEvent.description).trigger('keydown');
        jQuery('input.timehours_input').focus();
    }
    
    shs.iCal.prototype.nextEvent = function(){
        this.current++;
        if (this.current >= this.events.length) {
            this.current = this.events.length - 1;
            return false;
        }
        return true;
    }
    
    shs.iCal.prototype.prevEvent = function(){
        this.current--;
        if (this.current < 0) {
            this.current = 0;
            return false;
        }
        return true;
    }
    
    shs.iCal.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.iCal');
}, this);
