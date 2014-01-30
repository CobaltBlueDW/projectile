
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = " \
    option[save] { \
        font-weight: 900; \
    } \
    .shs-overlaymenu, .shs-overlaymenu-placeholder { \
        bottom: 0; \
        display: block; \
        height: 256px; \
        left: 0; \
        position: static; \
        width: 100%; \
    } \
    .shs-overlaymenu { \
        background: none repeat scroll 0 0 #DEE5F2; \
        border-top: 2px solid #333333; \
        bottom: 0; \
        display: block; \
        height: 256px; \
        left: 0; \
        position: fixed; \
        width: 100%; \
    } \
    .shs-button { \
        background: none repeat scroll 0 0 #F9FDFF; \
        border: 1px solid #333333; \
        border-radius: 4px; \
        padding: 2px; \
        display: inline-block; \
        cursor: pointer; \
    } \
    .shs-button:hover { \
        border-color: #FFFFFF; \
    } \
    .shs-menuCollapse { \
        position: absolute; \
        right: 5px; \
        top: 5px; \
    } \
    .shs-update { \
        font-wieght: 900; \
    } \
    .shs-configList { \
        height: 212px; \
        width: 425px; \
        display: block; \
    } \
";
document.body.appendChild(css);

function addJQuery(callback){
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
    script.addEventListener('load', function(){
        jQuery(document).ready(function(){
            callback.call();
        });
    }, false);
    document.body.appendChild(script);
}

var config = {
    projList: [
        "Admin Activities",
        "Payroll Related"
    ],
    taskList:[
        "Administrative"
    ],
    menu: {
        startCollapsed: true
    },
    record: true
};

function main(){
    //console.log('running main');
    
    //load menu
    jQuery('body').append("<div class='shs-overlaymenu'></div>");
    jQuery('body').append("<div class='shs-overlaymenu-placeholder'></div>");
    var menu = " \
        <div class='shs-menuCollapse shs-button'>_</div> \
        <div class='shs-col1'> \
            <h4 style='margin:0;display:inline-block;'>Config</h4> \
            <div class='shs-update shs-button'>Update</div> \
            <div class='shs-refresh shs-button'>Refresh</div> \
            <div class='shs-save shs-button'>Save</div> \
            <div class='shs-load shs-button'>Load</div> \
            <textarea class='shs-configList'></textarea> \
        </div> \
    ";
    jQuery('.shs-overlaymenu').html(menu);
    printConfig(config, '.shs-configList');
    
    //add menu interactions
    jQuery('.shs-overlaymenu .shs-menuCollapse').on('click', function(){
        var menu = jQuery('.shs-overlaymenu');
        if (menu.height() > 32) {
            jQuery('.shs-overlaymenu').css('height', 32);
        } else {
            jQuery('.shs-overlaymenu').css('height', 'inherit');
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
        jQuery('.shs-overlaymenu').css('height', 32);   //start collapsed
    }
    
    //load hooks
    jQuery('button.timedayAddRow').on('click', function(e,p){
        jQuery('select.projId.dropdownfixedwidth option').attr('save', 0);
        for(var item in config.projList){
            //console.log(config.projList[item]);
            jQuery('select.projId.dropdownfixedwidth option:contains("'+config.projList[item]+'")').attr('save', 1);
        }
        jQuery('select.projId.dropdownfixedwidth option[save!="1"]').hide();
        
        jQuery('select.projId.dropdownfixedwidth').on('change', function(e,p){
            window.setTimeout(function(){
                for(var item in config.taskList){
                    //console.log(config.taskList[item]);
                    jQuery('select.taskId.dropdownfixedwidth option:contains("'+config.taskList[item]+'")').attr('save', 1);
                }
                jQuery('select.taskId.dropdownfixedwidth option[save!="1"]').hide();
            }, 100);
        });
    });
}

function printConfig(config, target){
    jQuery(target).text(JSON.stringify(config, null, 2));
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
addJQuery(main);