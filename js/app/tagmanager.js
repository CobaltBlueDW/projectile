/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

bootstrap.ready(function(){
Requires(['shs.Config', 'shs.HashTag'], function(){
    
    var shs = NameSpace('shs');
    var jQuery = _jq;

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Users
     */
    shs.TagManager = function(config){
        this.TagManagerConstructor(config);
    }
    
    //extends from ...
    shs.TagManager.prototype = new Object();
    
    //constructor declaration
    shs.TagManager.prototype.constructor = shs.TagManager;
    
    //members
    shs.TagManager.prototype.config = null;
    shs.TagManager.prototype.selectedTag = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    shs.TagManager.prototype.TagManagerConstructor = function(config){
        this.config = config;
        for (var key in this.config.data.autocomplete.list) {
            this.selectedTag = key;
            break;
        }
    }
    
    shs.TagManager.prototype.render = function(selector){
        var curTag = 
        jQuery(selector).html(
                "<div class='shs-row shs-row1'>"
               +" <span class='shs-col shs-col1'>"
               +" <div style='margin:6px'>"
               +"  <div class='shs-formrow'><h4 class='shs-formlabel'>Switch to: </h4><select class='shs-tags-tagsList'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Tag: </span><span>#</span><input type='text' class='shs-tags-tagInput'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Auto Complete Label: </span><input type='text' class='shs-tags-labelInput'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Fill Text: </span><input type='text' class='shs-tags-valueInput'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Project: </span><select class='shs-tags-projectInput'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Task: </span><select class='shs-tags-taskInput'/></div>"
               +"  <div class='shs-formrow'><span class='shs-formlabel'>Hours: </span><input type='text' class='shs-tags-hoursInput'/></div>"
               +"  <div class='shs-formrow'><div class='shs-tags-save shs-button'>Save</div><div class='shs-tags-delete shs-button'>Delete</div></div>"
               +" </div>"
               +" </span>"
               +"</div>"
        );

        //add tag select options
        var tagListHTML = '';
        for(var tag in this.config.data.autocomplete.list){
            tagListHTML += '<option value="'+tag+'">'+tag+'</option>';
        }
        jQuery(selector+' .shs-tags-tagsList').html(tagListHTML);
        
        //add project select options
        var projListHTML = '<option value="">( None )</option>';
        for(var tag in this.config.data.projList){
            projListHTML += '<option value="'+tag+'">'+this.config.data.projList[tag]+'</option>';
        }
        jQuery(selector+' .shs-tags-projectInput').html(projListHTML);
        
        //add task select options
        var taskListHTML = '<option value="">( None )</option>';
        for(var tag in this.config.data.taskList){
            taskListHTML += '<option value="'+tag+'">'+this.config.data.taskList[tag]+'</option>';
        }
        jQuery(selector+' .shs-tags-taskInput').html(taskListHTML);
        
        this.fillForm(selector, this.selectedTag);
        
        //apply behaviors
        var self = this;
        jQuery('.shs-tags-tagsList').change(function(e){
            self.fillForm(selector, jQuery(this).val());
        });
        jQuery('.shs-tags-save').click(function(e){
            self.saveFormToTag(selector);
            self.selectedTag = jQuery(selector+' .shs-tags-tagInput').val();
            self.config.setRemoteSettings();
            self.render(selector);
        });
        jQuery('.shs-tags-delete').click(function(e){
            for(var item in self.config.data.autocomplete.list){
                self.selectedTag = item;
                break;
            }
            delete self.config.data.autocomplete.list[jQuery(selector+' .shs-tags-tagInput').val()];
            self.config.setRemoteSettings();
            self.render(selector);
        });
    }
    
    shs.TagManager.prototype.fillForm = function(selector, tag){
        if (tag === undefined) {
            tag = this.selectedTag;
        }
        this.selectedTag = tag;
        var formData = this.config.data.autocomplete.list[tag];
        formData.tag = tag;
        
        jQuery(selector+' .shs-tags-tagsList').val(formData.tag);
        jQuery(selector+' .shs-tags-tagInput').val(formData.tag);
        jQuery(selector+' .shs-tags-labelInput').val(formData.label);
        jQuery(selector+' .shs-tags-valueInput').val(formData.value);
        jQuery(selector+' .shs-tags-projectInput').val(formData.project);
        jQuery(selector+' .shs-tags-taskInput').val(formData.task);
        jQuery(selector+' .shs-tags-hoursInput').val(formData.hours);
    }
    
    shs.TagManager.prototype.saveFormToTag = function(selector){
        if (jQuery(selector+' .shs-tags-tagInput').val() == '') {
            return;
        }
        
        var tag = {
            tag: jQuery(selector+' .shs-tags-tagInput').val()
        };
        if (jQuery(selector+' .shs-tags-labelInput').val() != '') {
            tag.label = jQuery(selector+' .shs-tags-labelInput').val();
        }
        if (jQuery(selector+' .shs-tags-valueInput').val() != '') {
            tag.value = jQuery(selector+' .shs-tags-valueInput').val();
        }
        if (jQuery(selector+' .shs-tags-projectInput').val() != '') {
            tag.project = jQuery(selector+' .shs-tags-projectInput').val();
        }
        if (jQuery(selector+' .shs-tags-taskInput').val() != '') {
            tag.task = jQuery(selector+' .shs-tags-taskInput').val();
        }
        if (jQuery(selector+' .shs-tags-hoursInput').val() != '') {
            tag.hours = jQuery(selector+' .shs-tags-hoursInput').val();
        }
        
        this.config.data.autocomplete.list[tag.tag] = tag;
    }
    
}, 'shs.TagManager');
}, this);

