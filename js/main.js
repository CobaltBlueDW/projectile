

function addJQuery(callback){
    //find server url old-school way
    var serverURL = document.getElementsByName("appServerURL")[0].getAttribute("content"); 
    var script = document.createElement("script");
    script.setAttribute("src", serverURL+"/js/extlibs/jqbundle.js");
    script.addEventListener('load', function(){
        _jq(document).ready(function(){
            callback.call();
        });
    }, false);
    document.head.appendChild(script);
}

function main(){
    //console.log('running main');
    var jQuery = _jq;
    
    //grab the server url
    var serverURL = jQuery('meta[name="appServerURL"]').attr('content');
    //console.log(serverURL);
    
    //grab username
    var username = util.getCookie('LoginName', true);
    //console.log(username);
    
    //load config
    var config = new shs.Config(serverURL, username);
    config.getRemoteSettings();
    
    //load menu
    jQuery('body').append("<div class='shs-overlaymenu'></div>");
    jQuery('body').append("<div class='shs-overlaymenu-placeholder'></div>");
    var menu = jQuery('head script[name="shsOverlayMenu"]').html();
    jQuery('.shs-overlaymenu').html(menu);
    // hack the display
    jQuery('.shs-configList').text(config.toString());
    
    //add menu interactions
    jQuery('.shs-overlaymenu .shs-menuCollapse').on('click', function(){
        var menu = jQuery('.shs-overlaymenu');
        if (menu.attr('collapsed') == "true") {
            jQuery('.shs-overlaymenu .shs-tabzone > .shs-tabcontent').hide();
            jQuery('.shs-overlaymenu .shs-tabzone > .'+jQuery('.shs-overlaymenu .shs-tab.shs-active').attr('tab')).show();
            menu.attr('collapsed', "false");
        } else {
            menu.attr('collapsed', "true");
        }
    });
    jQuery('.shs-overlaymenu .shs-tab').on('click', function(){
        var jthis = jQuery(this);
        if (!jthis.attr('tab')) return;
        jQuery('.shs-overlaymenu .shs-tabs > .shs-tab[tab]').removeClass('shs-active');
        jthis.addClass('shs-active');
        jQuery('.shs-overlaymenu .shs-tabzone > .shs-tabcontent').hide();
        jQuery('.shs-overlaymenu .shs-tabzone > .'+jthis.attr('tab')).show();
        
        var menu = jQuery('.shs-overlaymenu');
        if (menu.attr('collapsed') == "true") {
            menu.attr('collapsed', "false");
        }
    });
    
    //add config tab interactions
    jQuery('.shs-overlaymenu .shs-refresh').on('click', function(){
        //console.log(config);
        printConfig(config, '.shs-configList');
    });
    jQuery('.shs-overlaymenu .shs-update').on('click', function(){
        var temp = JSON.parse(jQuery('.shs-overlaymenu .shs-configList').val());
        //console.log(temp);
        config = temp;
    });
    //jQuery('.shs-overlaymenu .shs-save').on('click', function(){
    //    createCookie('shsConfg', config);
    //});
    //  add auto-save
    //window.setInterval(function(){ createCookie('shsConfg', config); }, 1000*10);
    //jQuery('.shs-overlaymenu .shs-load').on('click', function(){
    //    config = readCookie('shsConfg');   
    //});
    
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
    window.setInterval(function(){ 
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
    }, 1000*60);
    
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
    if (config.menu && config.menu.startCollapsed) {
        jQuery('.shs-overlaymenu').attr('collapsed', "true");
    }
    
    //load hooks
    jQuery(document).on('click', 'button.timedayAddRow', function(e){
        setupRowInputInteractions(e);
    });
}

function simpleDateString(date){
    return (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
}

// load jQuery and execute the main function
//bootstrap.ready(function(){    // If bootstrap is defined in the greasemonkey sandbox then it won't exist where this gets loaded to
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
//}, this);

