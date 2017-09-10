var Sling = function () {
    this.pos = createVector(width/2, height/4*3);
    this.pullBack = createVector(0, 0);
    this.pulling = false;
    this.projectile;
}

Sling.prototype.draw = function () {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.pullBack.mag()>0 ? this.pullBack.heading()-HALF_PI : 0);
    stroke(185, 127, 0);
    strokeWeight(10);
    line(-50, 0, 0, 60);
    line(50, 0, 0, 60);
    line(0, 60, 0, 110);
    strokeWeight(4);
    stroke(245, 210, 90);
    line(-50, 0, 0, this.pullBack.y);
    line(50, 0, 0, this.pullBack.y);
    pop();
    if (this.projectile) this.projectile.draw();
}

Sling.prototype.startAt = function(x, y) {
    if (y > height/5*3) {
        this.pulling = true;
        this.projectile = new Projectile(x, y);
    }
    this.pos.set(x, Math.max(y, height/4*3));
    console.log("start");
}

Sling.prototype.pull = function(x, y) {
    if (this.pulling) {
        this.pullBack.set(x - this.pos.x, y - this.pos.y);
        this.projectile.setPos(x, y);
    }
}

Sling.prototype.letGo = function(x, y) {
    if (this.pulling && this.pullBack.mag() > 15) {
        var velocity = this.pullBack.copy().mult(-0.5);
        console.log("firing towards "+velocity.x+", "+velocity.y);
        this.projectile.setPos(x, y);
        this.projectile.accelerate(velocity.x, velocity.y, -0.1);
    } else {
        this.projectile = null;
        console.log("dud");
    }
    this.pulling = false;
    this.pullBack.setMag(0.01);
    var tempProj = this.projectile;
    this.projectile = null;
    return tempProj;
}