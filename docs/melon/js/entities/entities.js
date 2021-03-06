/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({
 
	init: function(x, y, settings) {
	    // call the constructor
	    this.parent(x, y, settings);
	 
	    // set the walking & jumping speed
	    this.setVelocity(5, 15);
	 
	    // adjust the bounding box
	    this.updateColRect(18, 36, -10, 50);
	 
	    // set the display to follow our position on both axis
	    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},

    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;

        }

        if (!this.jumping && !this.falling) {
        	this.doubleJumping = false;
        }

        if (me.input.isKeyPressed('jump')) {
        	if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            } else if (!this.doubleJumping) {
        		this.vel.y = -this.maxVel.y * me.timer.tick;
        		this.doubleJumping = true;
                this.jumping = true;
        	} 
        }
 
        // check & update player movement
        this.updateMovement();
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});