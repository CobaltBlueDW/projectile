/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
    shs.TimeInput = function(){
        this.TimeInputConstructor();
    }
    
    //extends from ...
    shs.TimeInput.prototype = new Object();
    
    //constructor declaration
    shs.TimeInput.prototype.constructor = shs.TimeInput;
    
    //members
    shs.TimeInput.prototype.projectPriority = null;
    shs.TimeInput.prototype.taskPriority = null;
    shs.TimeInput.prototype.typePriority = null;
    shs.TimeInput.prototype.hoursPriority = null;
    shs.TimeInput.prototype.descriptionPriority = null;
    shs.TimeInput.prototype.datePriority = null;
    shs.TimeInput.prototype.renderTo = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.TimeInput.prototype.TimeInputConstructor = function(){
    }
    
    shs.TimeInput.prototype.render = function(selector){
        if (!selector) selector = '.timedaySectionBody';
        this.setupRowInputInteractions(selector);
        this.pushEntryInputs(selector);
    }
    
    shs.TimeInput.prototype.setupRowInputInteractions = function(selector){

        jQuery(selector+' select.projId option').attr('save', 0);
        for(var item in config.projList){
            //console.log(config.projList[item]);
            jQuery('select.projId option').each(function(e){
                $jThis = jQuery(this);
                if ($jThis.text() == item) $jThis.attr('save', 1);
            });
        }
        if (config.hideUnused) {
            jQuery('select.projId option[save!="1"]').hide();
        } else {
            jQuery('select.projId option[save!="1"]').show();
        }

        jQuery(selector+' select.projId').on('change', function(e){
            window.setTimeout(function(){
                console.log('updating task choice');

                //update save attributes
                jQuery('select.taskId option:not([save])').attr('save', 0);
                for(var item in config.taskList){
                    //console.log(config.taskList[item]);
                    jQuery('select.taskId option').each(function(e){
                        var jThis = jQuery(this);
                        if (jThis.text() == item) jThis.attr('save', parseInt(jThis.attr('save'))+1);
                    });
                }

                //handle hide action
                if (config.hideUnused) {
                    jQuery('select.taskId option[save="0"]').hide();
                } else {
                    jQuery('select.taskId option[save="0"]').show();
                }

                //auto-select an option
                if (config.autoFillTask) {
                    var max = { save:-1, value:null, text:null };
                    jQuery('select.taskId option').each(function(){
                        var thisSave = parseInt(jQuery(this).attr('save'));
                        if (thisSave > max.save) {
                            max.save = thisSave;
                            max.value = jQuery(this).val();
                            max.text = jQuery(this).text();
                        }
                    });

                    //console.log(max);
                    jQuery('select.taskId').val(max.value);
                    // tell SpringAhead code about the update?
                    jQuery('select.taskId').trigger('change').trigger('blur');
                }
            }, 100);
        });

        jQuery(selector+' select.projId').on('blur', function(e){
            if (config.record) {
                var curVal = jQuery('select.projId option[value="'+jQuery(this).val()+'"]').text();

                // quit if it is the empty selection
                if (curVal.trim() == "") {
                    return;
                }

                //console.log(curVal);
                if (config.projList[curVal] !== false) {
                    config.projList[curVal] = true;
                    printConfig(config, '.shs-configList');
                }
            }
        });

        jQuery(selector+' select.taskId').on('blur', function(e){
            if (config.record) {
                var curVal = jQuery('select.taskId option[value="'+jQuery(this).val()+'"]').text();

                // quit if it is the empty selection
                if (curVal.trim() == "") {
                    return;
                }

                //console.log(curVal);
                if (config.taskList[curVal] !== false) {
                    config.taskList[curVal] = true;
                    printConfig(config, '.shs-configList');
                }
            }
        });

        jQuery(selector+' .timedayDescInput').autocomplete({
            delay: 500,
            minLength: 3,
            source: function(request, response){
                //prepare request object
                var tags = request.term.match(/#[A-Za-z0-9-]+/);
                if (!tags) return response(null);
                request = tags[0].substring(1);

                var hyphen = request.indexOf('-');
                if (hyphen != -1){
                    var requestObj = {
                        projectName: request.substring(0, hyphen),
                        ticketNumber: parseInt(request.substr(hyphen+1, 6))
                    }

                    //send query
                    jQuery.ajax({
                        url: serverURL+'/server/services/SpringAhead.php?func=getShortTickets',
                        method: 'POST',
                        crossdomain: true,
                        processData: false,
                        data: JSON.stringify(requestObj),
                        context: this,
                        success: function(data, textStatus, jqXHR){
                            //console.log(jqXHR.responseJSON);
                            var tickets = jqXHR.responseJSON;
                            for(var i=0; i < tickets.length; i++){
                                tickets[i].label = tickets[i].projectName+'-'+tickets[i].ticketNumber+':  '+tickets[i].description;
                                tickets[i].value = tickets[i].label;
                            }
                            response(tickets);
                        }
                    });

                    return;
                } else if (config.autocomplete && config.autocomplete.list) {
                    var results = [];
                    var list = config.autocomplete.list;
                    for(var key in list){
                        //console.log(request+' '+key);
                        if (key.indexOf(request) != -1) results.push(list[key]);
                    }
                    return response(results);
                }

                return response(null);
            },
            select: function(e, ui){
                //do the replacement
                var result = this.value.replace(/#\w+\-?\d*/i, ui.item.value);
                this.value = result;

                //auto-fill the project
                //console.log(ui.item.revenueStream);
                if (config.autoFillProject && ui.item.revenueStream) {
                    var find = ui.item.revenueStream.trim();
                    jQuery('select.projId option').each(function(){
                        if (jQuery(this).text().trim() == find) {
                            //console.log(jQuery(this).text());
                            jQuery('select.projId').val(jQuery(this).val());
                            projectChanged(jQuery('select.projId')[0]); // tell SpringAhead code about the update

                            //update task priority
                            if (ui.item.task) {
                                var task = ui.item.task.trim();
                                jQuery('select.taskId option').each(function(){
                                    console.log(jQuery(this).text().trim());
                                    if (jQuery(this).text().trim() == task) {
                                        var save = parseInt(jQuery(this).attr('save'));
                                        if (!save) save = 0;
                                        jQuery(this).attr('save', save+10);
                                    }
                                });
                            }

                            jQuery('select.projId').trigger('change').trigger('blur');
                        }
                    });
                }

                //update hours
                if (ui.item.hours) {
                    jQuery('input.timehours_input').val(ui.item.hours);
                }

                //prompt re-check incase there are more hashtags
                window.setTimeout(function(){jQuery('.timedayDescInput').autocomplete("search");}, 100);

                //prevent default behavior
                return false;
            }
        });

        jQuery(selector+' button.save').on('click', function(e, ui){
            //grab submit data
            var submitData = {
                projID: jQuery('select.projId option[value="'+jQuery('select.projId').val()+'"]').text(),
                taskID: jQuery('select.taskId option[value="'+jQuery('select.taskId').val()+'"]').text(),
                hours: jQuery('input.timehours_input').val(),
                date: jQuery('input.date').val(),
                type: jQuery('select.timeTypeId option[value="'+jQuery('select.timeTypeId').val()+'"]').text(),
                description: jQuery('input.timedayDescInput').val()
            };

            //send submit data
            jQuery.ajax({
                url: serverURL+'/server/services/SpringAhead.php?func=submitTimeLog',
                method: 'POST',
                crossdomain: true,
                processData: false,
                data: JSON.stringify(submitData),
                context: this,
                success: function(data, textStatus, jqXHR){
                    console.log(jqXHR.responseJSON);
                }
            });
        });
    }

    shs.TimeInput.prototype.pushEntryInputs = function(target){
        var jTarget = jQuery(target);

        //update hour value if field exists
        var hoursField = jQuery(target+' input.timehours_input');
        if (hoursField.length() > 0) {
            var bestInput = 0;
            var bestPriority = 0;
            for (var hourInput in curEntryInputs.hours) {
                if (curEntryInputs.hours[hourInput].input == null) continue;
                if (curEntryInputs.hours[hourInput].priority === null) curEntryInputs.hours[hourInput].priority = 1;
                if (curEntryInputs.hours[hourInput].priority > bestPriority) {
                    bestPriority = curEntryInputs.hours[hourInput].priority;
                    bestInput = curEntryInputs.hours[hourInput].input;
                }
            }

            hoursField.val(bestInput);
        }

        //update date value if field exists

    }
    
}, 'shs.TimeInput');

