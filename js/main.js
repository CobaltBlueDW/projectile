

function addJQuery(callback){
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
    script.addEventListener('load', function(){
        _jq(document).ready(function(){
            callback.call();
        });
    }, false);
    document.body.appendChild(script);
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
    record: true,
    hideUnused: false
};

function main(){
    //console.log('running main');
    var jQuery = _jq;
    
    //grab the server url
    var serverURL = jQuery('meta[name="appServerURL"]').attr('content');
    //console.log(serverURL);
    
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
        createCookie('shsConfg', config);
    });
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
                jQuery('select.taskId option').attr('save', 0);
                for(var item in config.taskList){
                    //console.log(config.taskList[item]);
                    jQuery('select.taskId option').each(function(e){
                        $jThis = jQuery(this);
                        if ($jThis.text() == item) $jThis.attr('save', 1);
                    });
                }
                if (config.hideUnused) {
                    jQuery('select.taskId option[save!="1"]').hide();
                } else {
                    jQuery('select.taskId option[save!="1"]').show();
                }
            }, 100);
        });
        
        jQuery('select.projId').on('blur', function(e){
            if (config.record) {
                var curVal = jQuery('select.projId option[value="'+jQuery(this).val()+'"]').text();
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
                //console.log(curVal);
                if (config.taskList[curVal] !== false) {
                    config.taskList[curVal] = true;
                    printConfig(config, '.shs-configList');
                }
            }
        });
        
        jQuery('.timedayDescInput').autocomplete({
            delay: 300,
            minLength: 3,
            source: function(request, response){
                //prepare request object
                request = request.term.trim();
                pound = request.indexOf('#');
                if (pound == -1) return response(null);
                hyphen = request.indexOf('-', pound);
                if (hyphen == -1) return response(null);
                
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
                            tickets[i].label = tickets[i].projectName+'-'+tickets[i].ticketNumber;
                            tickets[i].value = tickets[i].label+':  '+tickets[i].description;
                        }
                        response(tickets);
                    }
                });
            },
            select: function(e, ui){
                //console.log(ui.item.revenueStream);
                if (ui.item.revenueStream) {
                    var find = ui.item.revenueStream.trim();
                    jQuery('select.projId option').each(function(){
                        if (jQuery(this).text().trim() == find) {
                            //console.log(jQuery(this).text());
                            jQuery('select.projId').val(jQuery(this).val());
                            jQuery('select.projId').trigger('change').trigger('blur');
                            projectChanged(jQuery('select.projId')[0]); // tell SpringAhead code about the update
                        }
                    });
                }
            }
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

function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
               var c = ca[i];
               while (c.charAt(0)==' ') c = c.substring(1,c.length);
               if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
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

