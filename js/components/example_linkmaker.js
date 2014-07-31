/**
 * Context Helper code
 *
 * @copyright Copyright 2013 Web Courseworks, Ltd.
 * @license   http://www.gnu.org/licenses/gpl-3.0.txt GNU Public License 3.0
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Requires(['ext.ContextHelpers', 'ext.ContextHelpers.Type.Base'], function(){
    
    var CH = NameSpace('ext.ContextHelpers');
    
    /**
     * Fabrication function
     * 
     * @returns ext.ContextHelpers.LinkMaker
     */
    CH.LinkMaker = function(selector){
        this.LinkMakerConstructor(selector);
    };
    
    //extends from ...
    CH.LinkMaker.prototype = {};
    
    //constructor declaration
    CH.LinkMaker.prototype.constructor = CH.Courses;
    
    //members
    CH.LinkMaker.prototype.placementSelector = null;
    CH.LinkMaker.prototype.containerClass = 'ext-contexthelpers-linkmaker';
    CH.LinkMaker.prototype.containerSelector = null;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    CH.LinkMaker.prototype.LinkMakerConstructor = function(selector){
        this.placementSelector = selector;
        this.createNub(this.placementSelector);
        this.createLinkMakerContainer(this.placementSelector);
        this.containerSelector = this.placementSelector+' .'+this.containerClass;
    };
    
    CH.LinkMaker.prototype.createLinkMakerContainer = function(selector){
        var html = "<div class='"+this.containerClass+" block'></div>";
        jQuery(html).appendTo(selector);
    };
    
    CH.LinkMaker.prototype.createNub = function(selector){
        var self = this;
        return jQuery("<div class='ext-contexthelpers-linkmaker-nub'></div>").on('click', function(event){
            event.preventDefault();
            self.render(self.containerSelector);
            jQuery(self.containerSelector).show();
        }).appendTo(selector);
    };
    
    CH.LinkMaker.prototype.render = function(selector){
        this.drawMenu(selector);
    };
    
    CH.LinkMaker.prototype.drawMenu = function(selector){
        //construct html
        var menu = "<div class='header'>"
                 + " Link Maker "
                 + "<span class='ext-contexthelpers-close ui-button'>x</span>"
                 + "</div>"
                 + "<div class='content'>"
                 + " <div class='ext-contexthelpers-userform ext-contexthelpers-form'></div>"
                 + " <div class='ext-contexthelpers-courseform ext-contexthelpers-form'></div>"
                 + " <div class='ext-contexthelpers-lpform ext-contexthelpers-form'></div>"
                 + "</div>";
        jQuery(selector).html(menu);
        
        this.drawUserForm(selector+' .ext-contexthelpers-userform');
        this.drawCourseForm(selector+' .ext-contexthelpers-courseform');
        this.drawLPForm(selector+' .ext-contexthelpers-lpform');
        
        //add interactions
        jQuery(selector+' .ext-contexthelpers-close').on('click', function(event){
            jQuery(selector).hide();
        });
    };
    
    CH.LinkMaker.prototype.drawUserForm = function(selector){
        //construct html
        var menu = "<div>"
                 + " <span> userid: </span>"
                 + " <input type='text' class='ext-contexthelpers-user-idfield' />"
                 + " <span class='ext-contexthelpers-user-make ui-button'>Make Link</span>"
                 + "</div>"
                 + "<div class='ext-contexthelpers-user-link'></div>";
        jQuery(selector).html(menu);
        
        //add interactions
        jQuery(selector+' .ext-contexthelpers-user-make').on('click', function(event){
            var userid = parseInt(jQuery(selector+' .ext-contexthelpers-user-idfield').val(), 10);
            jQuery(selector+' .ext-contexthelpers-user-link').html(
                    "<a href='/user/view.php?id="+userid+"'>UserID:"+userid+"</a>"
            );
            CH.updateLinksFor('Users');
        });
    };
    
    CH.LinkMaker.prototype.drawCourseForm = function(selector){
        //construct html
        var menu = "<div>"
                 + " <span> courseid: </span>"
                 + " <input type='text' class='ext-contexthelpers-course-idfield' />"
                 + " <span class='ext-contexthelpers-course-make ui-button'>Make Link</span>"
                 + "</div>"
                 + "<div class='ext-contexthelpers-course-link'></div>";
        jQuery(selector).html(menu);
        
        //add interactions
        jQuery(selector+' .ext-contexthelpers-course-make').on('click', function(event){
            var courseid = parseInt(jQuery(selector+' .ext-contexthelpers-course-idfield').val(), 10);
            jQuery(selector+' .ext-contexthelpers-course-link').html(
                    "<a href='/course/view.php?id="+courseid+"'>CourseID:"+courseid+"</a>"
            );
            CH.updateLinksFor('Courses');
        });
    };
    
    CH.LinkMaker.prototype.drawLPForm = function(selector){
        //construct html
        var menu = "<div>"
                 + " <span> lppid: </span>"
                 + " <input type='text' class='ext-contexthelpers-lp-lppidfield' />"
                 + " <span class='ext-contexthelpers-lp-make ui-button'>Make Link</span>"
                 + "</div>"
                 + "<div class='ext-contexthelpers-lp-link'></div>";
        jQuery(selector).html(menu);
        
        //add interactions
        jQuery(selector+' .ext-contexthelpers-lp-make').on('click', function(event){
            var lppid = parseInt(jQuery(selector+' .ext-contexthelpers-lp-lppidfield').val(), 10);
            jQuery(selector+' .ext-contexthelpers-lp-link').html(
                    "<a href='/ext/learningplan/view.php?id="+lppid+"'>ProfileID:"+lppid+"</a>"
            );
            CH.updateLinksFor('LearningPlans');
        });
    };
    
    jQuery().ready(function(){
        lm = new CH.LinkMaker('body');
    });

}, 'ext.ContextHelpers.LinkMaker');
