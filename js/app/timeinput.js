/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
bootstrap.ready(function(){
Requires(['util', 'shs.HashTag'], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;
    var serverURL = jQuery('meta[name="appServerURL"]').attr('content');
    var username = util.getCookie('LoginName', true);

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.TimeInput = function(config){
        this.TimeInputConstructor(config);
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
    shs.TimeInput.prototype.renderTarget = null;
    shs.TimeInput.prototype.config = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.TimeInput.prototype.TimeInputConstructor = function(config){
        this.renderTarget = '.timedaySectionBody';
        this.config = config;
        this.resetPriorities();
    }
    
    shs.TimeInput.prototype.resetPriorities = function(){
        this.projectPriority = [];
        this.taskPriority = [];
        this.typePriority = [];
        this.hoursPriority = [];
        this.descriptionPriority = [];
        this.datePriority = [];
    }
    
    shs.TimeInput.prototype.renderTo = function(selector){
        this.renderTarget = selector;
        this.resetPriorities();
        this.render(selector);
    }
    
    shs.TimeInput.prototype.render = function(selector){
        if (!selector) selector = this.renderTarget;
        this.setupRowInputInteractions(selector);
        this.pushEntryInputs(selector);
    }
    
    shs.TimeInput.prototype.setupRowInputInteractions = function(selector){
        if (!selector) selector = this.renderTarget;
        
        this.setupProjectInteractions(selector);
        this.setupTaskInteractions(selector);
        this.setupDescriptionInteractions(selector);
        this.setupSaveInteractions(selector);
    }

    shs.TimeInput.prototype.setupProjectInteractions = function(selector){
        if (!selector) selector = this.renderTarget;
        var self = this;
        
        jQuery(selector+' select.projId').on('change', function(e){
            window.setTimeout(function(){
                self.pushTaskEntry(selector+' select.taskId');
            }, 100);
        });

        jQuery(selector+' select.projId').on('blur', function(e){
            if (self.config.data.record) {
                var curName = jQuery('select.projId option[value="'+jQuery(this).val()+'"]').text();
                var curVal = jQuery('select.projId option[value="'+jQuery(this).val()+'"]').val();

                // quit if it is the empty selection
                if (curName.trim() == "") {
                    return;
                }

                if (self.config.data.projList[curVal] !== false) {
                    self.config.data.projList[curVal] = curName;
                    self.config.render();
                }
            }
        });
    }
    
    shs.TimeInput.prototype.setupTaskInteractions = function(selector){
        if (!selector) selector = this.renderTarget;
        var self = this;
        
        jQuery(selector+' select.taskId').on('blur', function(e){
            if (self.config.data.record) {
                var curName = jQuery('select.taskId option[value="'+jQuery(this).val()+'"]').text();
                var curVal = jQuery('select.taskId option[value="'+jQuery(this).val()+'"]').val();

                // quit if it is the empty selection
                if (curName.trim() == "") {
                    return;
                }

                if (self.config.data.taskList[curVal] !== false) {
                    self.config.data.taskList[curVal] = curName;
                    self.config.render();
                }
            }
        });
    }

    shs.TimeInput.prototype.setupSaveInteractions = function(selector){
        if (!selector) selector = this.renderTarget;
        
        jQuery(selector+' button.save').on('click', (function(e, ui){
            //grab submit data
            var submitData = {
                projID: jQuery('select.projId').val(),
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
                    //console.log(jqXHR.responseJSON);
                }
            });
        }).bind(this));
    };

    shs.TimeInput.prototype.setupDescriptionInteractions = function(selector){
        if (!selector) selector = this.renderTarget;
        var self = this;
        jQuery(selector+' .timedayDescInput').autocomplete({
            delay: 500,
            minLength: 3,
            source: this.createDescriptionDD.bind(this),
            select: function(e, ui){
                //do the replacement
                var result = this.value.replace(/#\w+\-?\d*/i, ui.item.value);
                this.value = result;

                //update project
                if (ui.item.project) {
                    self.projectPriority.push(ui.item.project);
                }
                self.pushProjectEntry(selector+' select.projId');
                
                //update task
                if (ui.item.task) {
                    self.taskPriority.push(ui.item.task);
                }
                self.pushTaskEntry(selector+' select.taskId');
                
                jQuery(selector+' select.projId').trigger('change').trigger('blur');
                
                //update hours
                if (ui.item.hours) {
                    self.hoursPriority.push(ui.item.hours);
                }
                self.pushHoursEntry(selector+' input.timehours_input');

                //prompt re-check incase there are more hashtags
                window.setTimeout(function(){jQuery(selector+' .timedayDescInput').autocomplete("search");}, 100);

                //prevent default behavior
                return false;
            },
            response: function(e, ui){
                if (self.config.data.autocomplete.singleOptionAutoSelect && ui && ui.content && ui.content.length == 1) {
                    ui.item = ui.content[0];
                    jQuery(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
                    jQuery(this).autocomplete('close');
                }
            }
        });
    }
    
    shs.TimeInput.prototype.createDescriptionDD = function(request, response){
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
                    var tickets = jqXHR.responseJSON;
                    for(var i=0; i < tickets.length; i++){
                        tickets[i] = new shs.HashTag(
                                {
                                    tag: tickets[i].projectName+'-'+tickets[i].ticketNumber,
                                    label: tickets[i].projectName+'-'+tickets[i].ticketNumber+':  '+tickets[i].description,
                                    value: tickets[i].projectName+'-'+tickets[i].ticketNumber+':  '+tickets[i].description
                                },
                                tickets[i]
                        );
                    }
                    response(tickets);
                },
                error: function(data, textStatus, jqXHR){
                    response(null);
                }
            });

            return;
        } else if (this.config.data.autocomplete && this.config.data.autocomplete.list) {
            var results = [];
            var list = this.config.data.autocomplete.list;
            for(var key in list){
                if (key.indexOf(request) != -1) results.push(new shs.HashTag(list[key]));
            }
            return response(results);
        }

        return response(null);
    }

    shs.TimeInput.prototype.pushEntryInputs = function(selector){
        if (!selector) selector = this.renderTarget;
        
        this.pushDateEntry(selector+' .timedayDate');
        this.pushHoursEntry(selector+' .timehours_input');
        this.pushProjectEntry(selector+' .projId');
        this.pushTaskEntry(selector+' .taskId');
    }
    
    shs.TimeInput.prototype.pushProjectEntry = function(selector){
        var projectField = jQuery(selector);
        if (!(projectField.length > 0)) return;
        
        jQuery(selector+' option').attr('save', 0);
        
        //merge projectPriorities with this.config.data.projList
        for(var item in this.config.data.projList){
            if (this.projectPriority[item] == undefined){
                this.projectPriority[item] = {
                    priority: 1, 
                    input: item
                };
            }
        }
        
        //set priorities on all option tags
        for(var itemkey in this.projectPriority){
            var item = this.projectPriority[itemkey];
            jQuery(selector+' option').each(function(e){
                var jThis = jQuery(this);
                if (jThis.text() == item.input || jThis.val() == item.input) {
                    var priority = jThis.attr('save');
                    if (priority == undefined || parseInt(priority, 10) < item.priority){
                        jThis.attr('save', item.priority);
                    }
                }
            });
        }
        
        this.hideUnusedProjects(selector);
        
        //auto-select an option
        if (this.config.data.autoFillProject) {
            var max = { save:-1, value:null, text:null };
            jQuery(selector+' option[save]').each(function(){
                var thisSave = parseInt(jQuery(this).attr('save'), 10);
                if (thisSave > max.save) {
                    max.save = thisSave;
                    max.value = jQuery(this).val();
                    max.text = jQuery(this).text();
                }
            });
            
            //skip highlighting level priority changes so we don't auto-select a terrible choice
            if (max.save > 1) {
                jQuery(selector).val(max.value);
                // tell SpringAhead code about the update?
                projectChanged(jQuery('select.projId')[0]); // tell SpringAhead code about the update
                jQuery(selector).trigger('change').trigger('blur');
            }
        }
    }
    
    shs.TimeInput.prototype.hideUnusedProjects = function(selector){
        if (this.config.data.hideUnused) {
            jQuery(selector+' option:not([save])').hide();
            jQuery(selector+' option[save="0"]').hide();
        } else {
            jQuery(selector+' option:not([save])').show();
            jQuery(selector+' option[save="0"]').show();
        }
    }
    
    shs.TimeInput.prototype.pushTaskEntry = function(selector){
        var taskField = jQuery(selector);
        if (!(taskField.length > 0)) return;
        
        jQuery(selector+' option:not([save])').attr('save', 0);
        
        //merge projectPriorities with this.config.data.projList
        for(var item in this.config.data.taskList){
            if (this.taskPriority[item] == undefined){
                this.taskPriority[item] = {
                    priority: 1, 
                    input: item
                };
            }
        }
        
        //set priorities on all option tags
        for(var itemkey in this.taskPriority){
            var item = this.taskPriority[itemkey];
            jQuery(selector+' option').each(function(e){
                var jThis = jQuery(this);
                if (jThis.text() == item.input || jThis.val() == item.input) {
                    var priority = jThis.attr('save');
                    if (priority == undefined || parseInt(priority, 10) < item.priority){
                        jThis.attr('save', item.priority);
                    }
                }
            });
        }
        
        this.hideUnusedTasks(selector);
        
        //auto-select an option
        if (this.config.data.autoFillTask) {
            var max = { save:-1, value:null, text:null };
            jQuery(selector+' option[save]').each(function(){
                var thisSave = parseInt(jQuery(this).attr('save'), 10);
                if (thisSave > max.save) {
                    max.save = thisSave;
                    max.value = jQuery(this).val();
                    max.text = jQuery(this).text();
                }
            });
            
            jQuery(selector).val(max.value);
            // tell SpringAhead code about the update?
            jQuery(selector).trigger('change').trigger('blur');
        }
    }
    
    shs.TimeInput.prototype.hideUnusedTasks = function(selector){
        if (this.config.data.hideUnused) {
            jQuery(selector+' option:not([save])').hide();
            jQuery(selector+' option[save="0"]').hide();
        } else {
            jQuery(selector+' option:not([save])').show();
            jQuery(selector+' option[save="0"]').show();
        }
    }
    
    shs.TimeInput.prototype.pushHoursEntry = function(selector){
        var hoursField = jQuery(selector);
        if (!(hoursField.length > 0)) return;
        
        var priority = this.returnPriority(this.hoursPriority);
        if(priority && priority.priority > 0){
            if ( hoursField.attr('priority') == undefined || priority.priority > hoursField.attr('priority') ) {
                hoursField.attr('priority', priority.priority);
                hoursField.val(priority.input);
            }
        } else {
            hoursField.val(0);
        }
    }
    
    shs.TimeInput.prototype.pushDateEntry = function(selector){
        var dateField = jQuery(selector);
        if (!(dateField.length > 0)) return;
        
        var priority = this.returnPriority(this.datePriority);
        if (priority && priority.priority > 0) {
            dateField.attr('priority', priority.priority);
            dateField.val(priority.input);
        }
    }
    
    shs.TimeInput.prototype.returnPriority = function(priorityList){
        if (priorityList == undefined) return { priority:0, input:'' };
        
        var bestKey = null;
        var bestPriority = 0;
        for (var key in priorityList) {
            if (priorityList[key].input == null) continue;
            if (priorityList[key].priority === null) priorityList[key].priority = 1;
            if (priorityList[key].priority > bestPriority) {
                bestPriority = priorityList[key].priority;
                bestKey = key;
            }
        }
        
        return priorityList[bestKey];
    }
    
}, 'shs.TimeInput');
}, this);
