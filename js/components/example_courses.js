/**
 * Context Helper for Courses code
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
Requires(['ext.ContextHelpers.Type.Base'], function(){
    
    var CH = NameSpace('ext.ContextHelpers.Type');

    /**
     * Fabrication function
     * 
     * @returns ext.contexthelpers.Courses
     */
    CH.Courses = function(selector){
        this.BaseConstructor(selector);
        this.CoursesConstructor();
    }
    
    //extends from ...
    CH.Courses.prototype = new CH.Base();
    
    //constructor declaration
    CH.Courses.prototype.constructor = CH.Courses;
    
    /**
     * Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
     * is stored here.  This function should get called once, in the class-named function, after all super 
     * constructor calls.
     */
    CH.Courses.prototype.CoursesConstructor = function(){
    }
    
    /**
     * compiles and returns a list of links
     * 
     * @param {String} params   list of url params to append to urls
     * @returns {String}    html of links items
     */
    CH.Courses.prototype.getLinks = function(params){
        text = this.makeLink("/course/view.php?"+params, "View");
        text += this.makeLink("/course/edit.php?"+params, "Edit");
        text += this.makeLink("/enrol/users.php?"+params, "Enrol Users");
        text += this.makeLink("/grade/report/index.php?"+params, "Grades");
        
        return text;
    }
    
    /**
     * returns selector for grabbing links to add context menus to
     * 
     * @returns {String}
     */
    CH.Courses.prototype.getLinkSelector = function(){
        return 'a[href*="course/view.php?"]';
    }
    
}, 'ext.ContextHelpers.Type.Courses');