/*jslint evil: true, browser: true, immed: true, passfail: true, undef: true, newcap: true*/
/*global console, _FirebugCommandLine,  easyXDM, window, escape, unescape, JSON */

// #ifdef debug
/**
 * @class easyXDM.Debug
 * Utilities for debugging. This class is only present in the debug version.
 * @singleton
 * @namespace easyXDM
 */
easyXDM.Debug = {
    /**
     * Logs the message to console.log if available
     * @param {String} msg The message to log
     */
    log: function(msg){
        // Uses memoizing to cache the implementation
        var log;
        if (typeof console === "undefined" || typeof console.log === "undefined") {
            /**
             * Sets log to be an empty function since we have no output available
             * @ignore
             */
            log = function(){
            };
        }
        else {
            /**
             * Sets log to be a wrapper around console.log
             * @ignore
             * @param {String} msg
             */
            log = function(msg){
                console.log(location.host + "-" + new Date().valueOf() + ":" + msg);
            };
        }
        log(msg);
        easyXDM.Debug.log = log;
    },
    
    /**
     * Clears the current output element.
     */
    clear: function(){
        var clear;
        var el = document.getElementById("log");
        if (el) {
            /**
             * Sets trace to be a function that outputs the messages to the DOMElement with id "log"
             * @ignore
             * @param {String} msg
             */
            clear = function(){
                try {
                    el.innerHTML = "";
                } 
                catch (e) {
                    //In case we are unloading
                }
            };
        }
        else if (typeof console === "undefined" || typeof console.info === "undefined") {
            /**
             * Create log window
             * @ignore
             */
            var domain = location.host;
            var windowname = domain.replace(/\./g, "") + "easyxdm_log";
            var logWin = window.open("", windowname, "width=800,height=200,status=0,navigation=0,scrollbars=1");
            if (logWin) {
                el = logWin.document.getElementById("log");
                clear = function(){
                    try {
                        el.innerHTML = "";
                    } 
                    catch (e) {
                        //In case we are unloading
                    }
                };
            }
            else {
                clear = function(){
                };
            }
        }
        else if (console.clear) {
            clear = function(){
                console.clear();
            };
        }
        else if (_FirebugCommandLine.clear) {
            clear = function(){
                _FirebugCommandLine.clear();
            };
        }
        easyXDM.Debug.clear = clear;
    },
    
    /**
     * Will try to trace the given message either to a DOMElement with the id "log",
     * or by using console.info.
     * @param {String} msg The message to trace
     */
    trace: function(msg){
        // Uses memoizing to cache the implementation
        var trace;
        var el = document.getElementById("log");
        if (el) {
            /**
             * Sets trace to be a function that outputs the messages to the DOMElement with id "log"
             * @ignore
             * @param {String} msg
             */
            trace = function(msg){
                try {
                    el.appendChild(document.createElement("div")).appendChild(document.createTextNode(location.host + "-" + new Date().valueOf() + ":" + msg));
                    el.scrollTop = el.scrollHeight;
                } 
                catch (e) {
                    //In case we are unloading
                }
            };
        }
        else if (typeof console === "undefined" || typeof console.info === "undefined") {
            /**
             * Create log window
             * @ignore
             */
            var domain = location.host;
            var windowname = domain.replace(/\./g, "") + "easyxdm_log";
            var logWin = window.open("", windowname, "width=800,height=200,status=0,navigation=0,scrollbars=1");
            if (logWin) {
                var doc = logWin.document;
                if (doc.title !== "easyXDM log") {
                    doc.write("<html><head><title>easyXDM log " + domain + "</title></head>");
                    doc.write("<body><div id=\"log\"></div></body></html>");
                    doc.close();
                }
                el = doc.getElementById("log");
                trace = function(msg){
                    try {
                        el.appendChild(doc.createElement("div")).appendChild(doc.createTextNode(location.host + "-" + new Date().valueOf() + ":" + msg));
                        el.scrollTop = el.scrollHeight;
                    } 
                    catch (e) {
                        //In case we are unloading
                    }
                };
                trace("---- new logger at " + location.href);
            }
            else {
                // We are unable to use any logging
                trace = function(){
                };
            }
        }
        else {
            /**
             * Sets trace to be a wrapper around console.info
             * @ignore
             * @param {String} msg
             */
            trace = function(msg){
                console.info(location.host + "-" + new Date().valueOf() + ":" + msg);
            };
        }
        easyXDM.Debug.trace = trace;
        easyXDM.Debug.trace(msg);
    },
    /**
     * Creates a method usable for tracing.
     * @param {String} name The name the messages should be marked with
     * @return {Function} A function that accepts a single string as argument.
     */
    getTracer: function(name){
        return function(msg){
            easyXDM.Debug.trace(name + ": " + msg);
        };
    }
};
easyXDM.Debug.log("easyXDM present on '" + location.href);
easyXDM._trace = easyXDM.Debug.getTracer("easyXDM");
// #endif