// ==UserScript==
// @name        Lorenz
// @namespace   xkcd.com
// @description Run random paths in xkcd::Lorenz
// @include     http://xkcd.com/1350/*
// @version     1
// @grant       none
// ==/UserScript==

//author: Laurent Bulteau (aka edfel)


// This script is for personal use only
// use this script at your own risks
// remember: with great powers come great responsibilities
// this is probably full of bugs
// you have been warned
// I will not be held responsible for any shark-like problem
// ...
// still there? Then have fun!

/***** parameters: you can safely change this part   ***/

//pathDelay: time for each panel (ms)
pathDelay=3000;

//rollbackDelay: determine speed of "rollback" between two runs (ms)
rollbackDelay=100;

//number of runs for a multi-run session:
multiRuns=20;

//reset: setting to true would erase all previous runs from memory.
reset=false;





/**** Actual script: for those who know what they're doing   ***/

// kick-start

load();
placeButtons();


// sortByKey: sort a list of objects (tracks) by key "key"

function sortByKey(array) {
    return array.sort(function(a, b) {
        var x = a["key"]; var y = b["key"];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// lookup local storage for memorized tracks

function load() {
	data=localStorage.tracks;
	if (data==undefined || reset) {
	 tracks=[];
	} else {
	 tracks=JSON.parse(data);
	}
}
             
//save tracks to localstorage
function save() {
    tracks.push(thisTrack);
    data=JSON.stringify(sortByKey(tracks));
    localStorage.tracks = data;
}

             
// stops the last "setInterval". intervalID is a global variable
function stop() {
     $('#stopBtn').hide()
    clearInterval(intervalID);
}


// add buttons and textarea   to the page
function placeButtons(){
     var anchor = '#middleContainer';
  
     $(anchor) 
        .append('<br>');
             
      $(anchor) 
        .append('<input type="button" id="runBtn" value="Random story">')
        $('#runBtn').click(function () {
            remainingPaths=1;
            rollBack(true);
          });          
                    
      $(anchor) 
        .append('<input type="button" id="runBtnMulti" value="Run '+multiRuns+' times!">')
        $('#runBtnMulti').click(function () {
             remainingPaths=multiRuns;
             rollBack(true);
          });          
                 
             
      $(anchor) 
             .append('<input type="button" id="stopBtn" value="Stop" style="position:fixed;right:0;top:0">')
        $('#stopBtn').hide().click(function () {
            stop();
          });    
             
   

     $(anchor).append('<input type="button" id="exportBtn" value="Export">')
     $('#exportBtn').click(function () {
             text=localStorage.tracks;
             $('#exportTxt').val(text).select();
           //  text='<br><textarea rows="10" cols="80">'+text+"</textarea>";             
           //  $('#middleContainer').append(text);
            /* */
          }); 
             
             
  
     $(anchor).append('<br>');
    
     $(anchor).append('<textarea id="exportTxt"  rows="5" cols="80"></textarea>');
   
}
             
             // rollback function: clicks "back" buttons one by one
             //parameter: call for a new path when done
function rollBack(plusRandomPath) {
    $('#stopBtn').show()
   intervalID=setInterval(function() {
       rb=$(".rollback");
       if (rb.length) {
            rb.click()
       } else {
            stop();
            if (plusRandomPath) {
                randomPath();
            }            
       }
        
    }, rollbackDelay);
}
     
             
// check if some path has to be followed: rollback and call the path
             
function nextPath() {
    remainingPaths--
   if (remainingPaths>0) {
     rollBack(true); 
   }
}
//stop();
/**/
             
// follow a random path and remember track        
function randomPath() {
     // init
    thisTrack= new function() {};
    thisTrack.images=[];
    thisTrack.depth=0;
    thisTrack.optionCount=[];
    thisTrack.permalink=[];
    thisTrack.choices=[];
    thisTrack.key="*";
    thisTrack.timeStamp=new Date();
      $('#stopBtn').show();
    intervalID=setInterval(function() {    
        //each iteration             
        n=$(".option-choose").length-$(".option-line-writein").length;
        if (n>0) {
            // n options to choose
            i=Math.floor(Math.random()*n);
            t="abcd"[i];
            button=$("#comic").find(".option-choose:contains(" + t + ")")
            text=button.next().text();
            if (text=="continue") {
             text=">";
            }
            thisTrack.choices.push(text);
            thisTrack.depth++;
            thisTrack.optionCount.push(n);
            thisTrack.permalink.push(getPermalink());    
            thisTrack.key+=text.substring(0,20)+"*";          
           /**/
            button.click()
        } else {
            // no more options
            stop();           
            thisTrack.choices.push("...");
            thisTrack.optionCount.push(0);
            thisTrack.permalink.push(getPermalink());    
            
        
            save();
            nextPath();
        }
        
    }, pathDelay);
}

// read permalink
function getPermalink() {
    
    pl=$(".permalink");
    if (pl.length) {
        return pl.attr("href");
    } else {
        return "";
    }
    
}
 
