/**
 * Util Functions
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

/**
 *  Returns the given namespace.  If it doesn't exist it creates it.
 *  
 *  @param string path A period delimiter class/namespace path to create. e.g. 'cooking.units.cups'
 *  @return object A reference to the namespace if created, and False, if namespace already exists.
 */
function NameSpace(path){
    if(!path) throw new Exception('function "NameSpace" requires at least 1 argument "path".');
    var path = path.split(".");
    var curNS = window;

    for(var i=0; i<path.length; i++){
        if(typeof curNS[path[i]] == "undefined"){
            //alert(path[i]);
            curNS[path[i]] = new Object();
        }
        curNS = curNS[path[i]];
    }

    return curNS;
}

//create util namespace
var U = NameSpace('util');

/**
 * Attempts to resolve a NameSpace returning fals if it oesn't exist
 * 
 * @param {String} path a referential object path
 * @returns {Boolean|Object}
 */
U.getNameSpace = function(path){
    if(!path) throw new Exception('function "getNameSpace" requires at least 1 argument "path".');
    var path = path.split(".");
    var curNS = window;

    for(var i=0; i<path.length; i++){
        if(typeof curNS[path[i]] != "undefined"){
            curNS = curNS[path[i]];
        }else{
            return false;
        }
    }

    return curNS;
}

U.unloadedCode = [];
function Requires(requirements, funcEnclosure, name){
    //add enclosure to load list
    if(requirements || funcEnclosure){
        if(!(funcEnclosure instanceof Function)) throw new Exception('Second parameter to "Requires()" needs to be a function');
        if(Object.prototype.toString.call(requirements) !== '[object Array]') throw new Exception('First parameter to "Requires()" needs to be an array.');
        
        U.unloadedCode.push({
            'requirements': requirements,
            'funcEnclosure': funcEnclosure,
            'name': name
        });
    }
    
    //go through add list and add all that can be added
    var loadedSomething = false;
    for(var uc = 0; uc < U.unloadedCode.length; uc++){
        var readyToLoad = true;
        for(var r=0; r < U.unloadedCode[uc].requirements.length; r++){
            if(!U.getNameSpace(U.unloadedCode[uc].requirements[r])){
                readyToLoad = false;
                break;
            }
        }
        if(readyToLoad){
            U.unloadedCode[uc].funcEnclosure();
            U.unloadedCode.splice(uc, 1);
            uc--;
            loadedSomething = true;
        }
    }
    if(loadedSomething && U.unloadedCode.length > 0){
        Requires();
    }
}

/** 
 * Takes a list of Objects and returns a single object consisting of all elements of given objects
 * They are joined in the oder given, so if 2 objects have the same element, the one that appears later 
 * in the list will be the one that appears in the returned object.
 * This function can be usefull for making one object extend from multiple other objects, or joining associative arrays
 * 
 * @param variable objects Either a list of parameters that are all objects, or a single array of objects
 * @return Object An Object made-up of all elements of all given parameter objects
 */
U.join = function(objects){
    if(arguments.length == 0) return false;
    var objs = arguments;
    if(arguments.length == 1 && objects instanceof Array) objs = objects;

    var newObj = new Object();
    for(var i=0; i<objs.length; i++){
        for(var key in objs[i]){
            newObj[key] = objs[i][key];
        }
    }

    return newObj;
}

U.decodeURI = function(url) {
  var request = {};
  var pairs = url.substring(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return request;
}

U.encodeURI = function(array) {
  var pairs = [];
  for (var key in array)
    if (array.hasOwnProperty(key))
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(array[key]));
  return pairs.join('&');
}

U.setCookie = function(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

U.getCookie = function(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
