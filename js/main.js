

function addJQuery(callback){
    //find server url old-school way
    var serverURL = document.getElementsByName("appServerURL")[0].getAttribute("content"); 
    var script = document.createElement("script");
    script.setAttribute("src", serverURL+"/js/jq-1.11.0_jqui-1.10.4_min.js");
    script.addEventListener('load', function(){
        _jq(document).ready(function(){
            callback.call();
        });
    }, false);
    document.head.appendChild(script);
}

var config = {
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

function main(){
    //console.log('running main');
    var jQuery = _jq;
    
    //grab the server url
    var serverURL = jQuery('meta[name="appServerURL"]').attr('content');
    //console.log(serverURL);
    
    //grab username
    var username = readCookie('LoginName', true);
    //console.log(username);
    
    //load config
    var tempConfig = readCookie('shsConfg');
    if (tempConfig && tempConfig instanceof Object) {
        config = tempConfig;
    }
    
    //load menu
    jQuery('body').append("<div class='shs-overlaymenu'></div>");
    jQuery('body').append("<div class='shs-overlaymenu-placeholder'></div>");
    var menu = jQuery('head script[name="shsOverlayMenu"]').html();
    jQuery('.shs-overlaymenu').html(menu);
    printConfig(config, '.shs-configList');
    
    //add menu interactions
    jQuery('.shs-overlaymenu .shs-menuCollapse').on('click', function(){
        var menu = jQuery('.shs-overlaymenu');
        if (menu.attr('collapsed') == "true") {
            menu.attr('collapsed', "false");
        } else {
            menu.attr('collapsed', "true");
        }
    });
    jQuery('.shs-overlaymenu .shs-refresh').on('click', function(){
        //console.log(config);
        printConfig(config, '.shs-configList');
    });
    jQuery('.shs-overlaymenu .shs-update').on('click', function(){
        var temp = JSON.parse(jQuery('.shs-overlaymenu .shs-configList').val());
        //console.log(temp);
        config = temp;
    });
    jQuery('.shs-overlaymenu .shs-save').on('click', function(){
        createCookie('shsConfg', config, 365);
    });
    //  add auto-save
    window.setInterval(function(){ createCookie('shsConfg', config, 365); }, 1000*10);
    jQuery('.shs-overlaymenu .shs-load').on('click', function(){
        config = readCookie('shsConfg');
    });
    
    //setup menu
    if (config.menu && config.menu.startCollapsed) {
        jQuery('.shs-overlaymenu').attr('collapsed', "true");
    }
    
    //load hooks
    jQuery(document).on('click', 'button.timedayAddRow', function(e){
        jQuery('select.projId option').attr('save', 0);
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
        
        jQuery('select.projId').on('change', function(e){
            window.setTimeout(function(){
                console.log('updating task choice');
                
                //update save attributes
                jQuery('select.taskId option:not([save])').attr('save', 0);
                for(var item in config.taskList){
                    //console.log(config.taskList[item]);
                    jQuery('select.taskId option').each(function(e){
                        $jThis = jQuery(this);
                        if ($jThis.text() == item) $jThis.attr('save', parseInt($jThis.attr('save'))+1);
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
        
        jQuery('select.projId').on('blur', function(e){
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
        
        jQuery('select.taskId').on('blur', function(e){
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
        
        jQuery('.timedayDescInput').autocomplete({
            delay: 500,
            minLength: 3,
            source: function(request, response){
                //prepare request object
                request = request.term.trim();
                pound = request.indexOf('#');
                if (pound == -1) return response(null);
                
                hyphen = request.indexOf('-', pound);
                if (hyphen != -1){
                    var requestObj = {
                        projectName: request.substring(pound+1, hyphen),
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
                    var request = request.match(/#\w+/);
                    if (!request) return response(null);
                    request = request[0].substring(1);
                    
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
                
                //prevent default behavior
                return false;
            }
        });
        
        jQuery('button.save').on('click', function(e, ui){
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
    });
}

function printConfig(config, target){
    jQuery(target).val(JSON.stringify(config, null, 2));
}

function createCookie(name, value, days) {
        if (days) {
               var date = new Date();
               date.setTime(date.getTime()+(days*24*60*60*1000));
               var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        if (value instanceof Object) {
           value = JSON.stringify(value);
        }
        document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name, raw) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
               var c = ca[i];
               while (c.charAt(0)==' ') c = c.substring(1,c.length);
               if (c.indexOf(nameEQ) == 0) {
                   var val = c.substring(nameEQ.length,c.length);
                   if (!raw) val = JSON.parse(val);
                   return val;
               }
        }
        return null;
}

function eraseCookie(name) {
        createCookie(name,"",-1);
}

// load jQuery and execute the main function
if (typeof(_jq) != "undefined") {
    _jq('document').ready(function(){
        window.setTimeout(main, 1);
    });
} else {
    addJQuery(function(){
        _jq('document').ready(function(){
            window.setTimeout(main, 1);
        });
    });
}

