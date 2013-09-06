/* the in game stuff*/
game.PlayScreen = me.ScreenObject.extend({
 
    onResetEvent: function() {
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("area01");
    },
 
    /* ---
 
    action to perform when game is finished (state change)
 
    --- */
    onDestroyEvent: function() {
    }
 
});