

//declare namspace for the bootstrap
window.bootstrap = {};
var boostrap = window.bootstrap;

//This file path should point to a manifet.json file containing all the files for the project
//The manifest format should be something like {"css":{"mycss":"file://./css/my.css","css2":"file://./dir2/file2.css"},"js":{...},"html:{...}}
bootstrap.serverURL = "http://localhost/projectile";
bootstrap.manifestURL = bootstrap.serverURL+"/manifest.json";
bootstrap.loadQueue = null;
bootstrap.readyQueue = [];


/**
 * A simple AJAX functin we will use to grab the manifest file
 * 
 * @param string url    the url of the request
 * @param Function callback   a callback function to send the reult to
 * @param Object context    a context to call the callback function from (what the 'this' variable will be)
 * @returns void
 */
bootstrap.callAjax = function(url, callback, context, extraParam){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback.call(context, xmlhttp.responseText, extraParam);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

bootstrap.ready = function(callback, context, extraParam){
    if ((this.loadQueue instanceof Object) && this.loadQueue.length == 0) {
        callback.call(context, extraParam);
    }
    this.readyQueue.push({'callback': callback, 'context': context, 'extraParams': extraParam});
}

bootstrap.completedLoadOf = function(key){
    this.loadQueue[key] = null;
    
    var isEmpty = true;
    for(var lq in this.loadQueue){
        if (this.loadQueue[lq]) isEmpty = false;
    }
    
    if (isEmpty){
        var cur = null;
        while (cur = this.readyQueue.pop()) {
            cur.callback.call(cur.context, cur.extraParam);
        }
    }
}

/**
 * This function starts the bootstrapping process
 * 
 * @returns {undefined}
 */
bootstrap.run = function(){
    if (!(this.loadQueue instanceof Object)) {
        this.loadQueue = {
            'addAppMeta': true
        };
    }
    
    this.callAjax(this.manifestURL, function(contents){
        this.manifest = JSON.parse(contents);
        
        if (this.manifest.css) {
            this.loadCSS(this.manifest.css);
        }
        if (this.manifest.js) {
            this.loadJS(this.manifest.js);
        }
        if (this.manifest.html) {
            this.loadTEXT(this.manifest.html);
        }
        if (this.manifest.text) {
            this.loadTEXT(this.manifest.text);
        }
        if (this.manifest.json) {
            this.loadTEXT(this.manifest.json);
        }
        
        this.addAppMeta();
        
    }, this);
}

/**
 * Adds css files to the page header
 * 
 * @param Object cssObj a list of named css files in the form {"name": "url", ...}
 * @returns void
 */
bootstrap.loadCSS = function(cssObj){
    for(var name in cssObj){
        var css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = this.resolveRelativeURL(cssObj[name]);
        css.name = name;
        this.loadQueue[css.href] = true;
        css.addEventListener('load', function(event){
            var url = event.target.href;
            bootstrap.completedLoadOf(url);
        }, false);
        document.getElementsByTagName('head')[0].appendChild(css);
    }
}

/**
 * Adds js files to the page header
 * 
 * @param Object jsObj a list of named js files in the form {"name": "url", ...}
 * @returns void
 */
bootstrap.loadJS = function(jsObj){
    for(var name in jsObj){
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.src = this.resolveRelativeURL(jsObj[name]);
        js.name = name;
        this.loadQueue[js.src] = true;
        js.addEventListener('load', function(event){
            var url = event.target.src;
            bootstrap.completedLoadOf(url);
        }, false);
        document.getElementsByTagName("head")[0].appendChild(js);
    }
}

/**
 * Adds text files to the page header
 * 
 * @param Object textObj a list of named text files in the form {"name": "url", ...}
 * @returns void
 */
bootstrap.loadTEXT = function(textObj){
    for(var name in textObj){
        var url = this.resolveRelativeURL(textObj[name]);
        this.loadQueue[url] = true;
        this.callAjax(url, function(contents, params){
            var text = document.createElement('script');
            text.type = 'text/plain';
            text.innerHTML = contents;
            text.setAttribute("name", params.name);
            document.getElementsByTagName("head")[0].appendChild(text);
            bootstrap.completedLoadOf(params.url);
        }, this, {'name':name, 'url':url});
    }
}

bootstrap.addAppMeta = function(){
    this.addMeta('appServerURL', this.serverURL);
    this.addMeta('appManifestURL', this.manifestURL);
    this.completedLoadOf('addAppMeta');
}

bootstrap.addMeta = function(name, value){
    var meta = document.createElement('meta');
    meta.setAttribute("name", name);
    meta.setAttribute("content", value);
    document.getElementsByTagName("head")[0].appendChild(meta);
}

/**
 * Strips the "file://" from a url if it exists, and if the url is relative
 * it returns an absolute url resolving the relativity from the location of
 * the manifest file
 * 
 * @param string url    a url, possibly with a "file://" prefix, and possibly relative
 * @returns string
 */
bootstrap.resolveRelativeURL = function(url){
    if (url.substr(0,7) == "file://") url = url.substr(7);

    if (url.substr(0,1) == '.') {
        url = this.serverURL +'/'+ url;
    }
    
    return url;
}

//start the app loading process
bootstrap.run();