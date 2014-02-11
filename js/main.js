

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
        jQuery('.shs-overlaymenu').attr('collapsed', "false");
    }
    
    //load hooks
    jQuery(document).on('click', 'button.timedayAddRow', function(e){
        jQuery('select.projId.dropdownfixedwidth option').attr('save', 0);
        for(var item in config.projList){
            //console.log(config.projList[item]);
            jQuery('select.projId.dropdownfixedwidth option').each(function(e){
                $jThis = jQuery(this);
                if ($jThis.text() == item) $jThis.attr('save', 1);
            });
        }
        if (config.hideUnused) {
            jQuery('select.projId.dropdownfixedwidth option[save!="1"]').hide();
        } else {
            jQuery('select.projId.dropdownfixedwidth option[save!="1"]').show();
        }
        
        jQuery('select.projId.dropdownfixedwidth').on('change', function(e){
            window.setTimeout(function(){
                jQuery('select.taskId.dropdownfixedwidth option').attr('save', 0);
                for(var item in config.taskList){
                    //console.log(config.taskList[item]);
                    jQuery('select.taskId.dropdownfixedwidth option').each(function(e){
                        $jThis = jQuery(this);
                        if ($jThis.text() == item) $jThis.attr('save', 1);
                    });
                }
                if (config.hideUnused) {
                    jQuery('select.taskId.dropdownfixedwidth option[save!="1"]').hide();
                } else {
                    jQuery('select.taskId.dropdownfixedwidth option[save!="1"]').show();
                }
            }, 100);
        });
        
        jQuery('select.projId.dropdownfixedwidth').on('blur', function(e){
            if (config.record) {
                var curVal = jQuery('select.projId.dropdownfixedwidth option[value="'+jQuery(this).val()+'"]').text();
                //console.log(curVal);
                if (config.projList[curVal] !== false) {
                    config.projList[curVal] = true;
                    printConfig(config, '.shs-configList');
                }
            }
        });
        
        jQuery('select.taskId.dropdownfixedwidth').on('blur', function(e){
            if (config.record) {
                var curVal = jQuery('select.taskId.dropdownfixedwidth option[value="'+jQuery(this).val()+'"]').text();
                //console.log(curVal);
                if (config.taskList[curVal] !== false) {
                    config.taskList[curVal] = true;
                    printConfig(config, '.shs-configList');
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
addJQuery(function(){
    jQuery('document').ready(function(){
        window.setTimeout(main, 1);
    });
});

