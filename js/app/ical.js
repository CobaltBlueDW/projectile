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
    shs.iCal.prototype.file = null;
    shs.iCal.prototype.fileContents = null;
    shs.iCal.prototype.events = null;
    shs.iCal.prototype.current = 0;
    
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

        var self = this;
        jQuery(selector+' .shs-uploadfile').on('change', function(e){
            self.file = e.target.files[0];

            var reader = new FileReader();
            reader.onload = function() {
                self.fileContents = this.result;
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
                    self.events.push({
                        description: event.summary,
                        duration: event.duration.hours+event.duration.minutes/60,
                        date: event.startDate
                    });
                };
                self.events = [];
                self.current = 0;
                parser.process(self.fileContents);
            };
            reader.readAsText(self.file);

        });
        jQuery(selector+' .shs-import').on('click', function(){
            TimeDay.addEditRow(jQuery('.timedayAddRow')[0], "new");
            setupRowInputInteractions(jQuery('.timedayAddRow')[0]);

            var cEvent = self.events[self.current];
            jQuery('input[name="timedayDate"]').val(simpleDateString(cEvent.date.toJSDate()));
            jQuery('input.timehours_input').click().val(cEvent.duration).blur();
            jQuery('input.timedayDescInput').click().val(cEvent.description).trigger('keydown');
            self.current++;
        });
        jQuery(selector+' .shs-view').on('click', function(){
            var html = '';
            for(var index in self.events){
                html += self.events[index].date+' ';
                html += self.events[index].enddate+' ';
                html += self.events[index].duration+' ';
                html += self.events[index].description+'\n';
            }
            jQuery(selector+' .shs-icalContents').text(html);
        });
    }
    
    shs.iCal.prototype.toString = function(){
        return JSON.stringify(this.data, null, 2);
    }
    
}, 'shs.iCal');
}, this);
