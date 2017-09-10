/**
 * ABSTRACT Game prototype
 * To be inherited from by individual games.
 * Handles basic communication with the sketch 
 * (i.e. the main/intro layer)
 * as well as starting/stopping a game.
 * @param {P5Sketch} sketch The main sketch object
 */
var Game = function (sketch) {
    
    // Refer to mySketch to access P5.js/P5.play functionality
    // Documentation:
    // https://p5js.org/reference/
    // http://p5play.molleindustria.org/docs/classes/p5.play.html
    this.mySketch = sketch;
    
    // True if game has been told to stop.
    // Check this and finish up any animations or
    // saving of data, then call stoppedCallback
    this.stopping;
    
    // When done stopping your game, call this
    // callback to return to the main screen.
    this.stoppedCallback;
    
    // True if paused, false if running.
    // Check this in your game's draw()
    // and react accordingly in visuals/logic.
    // Please note that there's no general
    // pausing/unpausing mechanism implemented
    // in the Game prototype. But your game's
    // pause() method may be called from
    // the sketch, so deal with this boolean
    // even if your game doesn't support pausing.
    this.paused;
    
    console.log("Created Game");
}

// setup() is called once in the beginning of
// the game's life span (analogous to P5.js
// standard behavior).
// You will have to override this method in your 
// game and call it using Game.prototype.setup() from 
// your game's setup() function.
Game.prototype.setup = function () {
    this.stopping = false;
    this.paused = false;
}

// draw() is called once in the beginning of
// the game's life span (analogous to P5.js
// standard behavior).
// You will have to to override this method in your 
// game and call it using Game.prototype.draw() first 
// thing your game's draw() function.
Game.prototype.draw = function () {
    // Currently nothing here, but that may change
}

// stop() handles the game being told to stop,
// e.g. by the main program or by the game
// itself.
// You will have to to override this method in your 
// game in order to save data and finish
// up animations. Call it's super implementation using
// Game.prototype.stop() in your game's stop() function.
Game.prototype.stop = function (callback) {
    console.log("Stopping Game");
    this.stopping = true;
    this.stoppedCallback = callback;
}

// Handle pausing (may be called from outside your 
// game).
// You might want to override this method in your 
// game and call it using Game.prototype.pause() in 
// your game's pause() function.
Game.prototype.pause = function () {
    console.log("Pausing Game");
    this.paused = true;
}

// Handle upausing (may be called from outside your
// game).
// You might want to override this method in your 
// game and call it using Game.prototype.unpause() from 
// your game's unpause() function.
Game.prototype.unpause = function () {
    console.log("Unpausing Game");
    this.paused = false;
}