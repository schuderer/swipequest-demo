var Projectile = function (x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
}

Projectile.prototype.draw = function () {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.pos.y / height + 0.5);
    noStroke();
    fill(180);
    ellipse(0, 0, 20, 20);
    pop();
    
    // update movement
    this.pos.add(this.vel);
}

Projectile.prototype.getPos = function () {
    return this.pos;
}

Projectile.prototype.setPos = function (x, y) {
    this.pos.set(x, y);
}

Projectile.prototype.accelerate = function (x, y) {
    this.vel.x += x;
    this.vel.y += y;
}
