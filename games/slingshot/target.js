var Target = function (textContents, optionalImage) {
    this.contents = textContents;
    this.image = optionalImage;
    this.dims = createVector(width / 4 * 3, height / 5);
    this.pos = createVector(random(width), -this.dims.y/2, -8);
    this.vel = createVector(
        this.randomXVel(),
        1.3, // descension speed (TODO: speed factor - game must become faster)
        0.02 // moving towards viewer (range: -5 to +5)
    );
    this.angle = 0;
    this.opacity = 1.0;
    this.animatingYes = false;
    this.animatingNo = false;
    this.animatingDissolve = false;
    this.stopped = false;
}

Target.prototype.draw = function () {
    var w = this.dims.x;
    var h = this.dims.y;
    var halfW = w / 2;
    var halfH = h / 2;
    var pad = 10;
    var imgW = this.image ? this.image.width : 0;

    push()
    translate(this.pos.x, this.pos.y);
    scale((20 + this.pos.z) / 20);
    rotate(this.angle);
    rectMode(CENTER);
    stroke(220, this.opacity*255);
    if (this.animatingYes) {
        fill(0, 255, 0, 50*this.opacity);
    } else if (this.animatingNo) {
        fill(255, 0, 0, 50*this.opacity);
    } else {
        fill(255, this.opacity*255);
    }
    rect(0, 0, w, h);
    textAlign(LEFT, TOP);
    fill(0, this.opacity*255)
    noStroke();
    textSize(16);
    rectMode(CORNER);
    text(this.contents, -halfW + pad + imgW, -halfH + pad, w - pad * 2 - imgW, h - pad * 2);
    imageMode(CORNER);
    if (this.image) {
        tint(255, 255*this.opacity);
        image(this.image, -halfW, -halfH);
    }

    // YES/NO hit targets
    rectMode(CORNER)
    textAlign(CENTER, CENTER)
    noStroke();
    // right target = yes
    fill(0, 255, 0, 50*this.opacity);
    rect(0, halfH / 2, halfW, halfH / 2);
    fill(0, 255*this.opacity);
    text("PENSIONS", halfW / 2, halfH / 2 + halfH / 4)
        // left target = no
    fill(255, 0, 0, 50*this.opacity);
    rect(-halfW, halfH / 2, halfW, halfH / 2);
    fill(0, 255*this.opacity);
    text("NO PENSIONS", -halfW / 2, halfH / 2 + halfH / 4)
    pop();

    // Update movement
    if (this.animatingYes) {
        this.angle += 0.01;
        this.pos.x += 10.0;
        this.pos.y -= 4.0;
    } else if (this.animatingNo) {
        this.angle -= 0.2
        this.pos.add(this.vel);
        this.vel.y += 0.1; // grav
    } else if (this.animatingDissolve) {
        this.opacity -= 0.06;
        this.pos.add(this.vel);
        this.vel.x = this.vel.x * 0.7 + this.randomXVel() * 0.3;
    } else {
        this.pos.add(this.vel);
        this.vel.x = this.vel.x * 0.7 + this.randomXVel() * 0.3;
        if (this.pos.y > height/3*2) this.animatingDissolve = true;
    }
    // Target animatied out of screen to left/right or dissolved
    if (this.opacity <= 0 || this.pos.x < 0 - this.dims.x || this.pos.x > width + this.dims.x) {
        this.animatingYes = false;
        this.animatingNo = false;
        this.animatingDissolve = false;
        this.stopped = true;
    }
}

Target.prototype.hit = function (vector, callback) {
    if (!this.animatingYes && !this.animatingNo && !this.animatingDissolve) {
        var halfW = this.dims.x / 2;
        var halfH = this.dims.y / 2;
        if (vector.y > this.pos.y - halfH && vector.y < this.pos.y + halfH) {
            if (vector.x > this.pos.x && vector.x < this.pos.x + halfW) {
                // right target = YES
                this.animatingYes = true;
                return "YES";
            } else if (vector.x > this.pos.x - halfW && vector.x < this.pos.x) {
                // left target = NO
                this.vel.set(-10.0, -5.0, -0.1)
                this.animatingNo = true;
                return "NO";
            }
        }
    }
    return false;
}

Target.prototype.randomXVel = function () {
    return (this.pos.x < width / 2) ? random(-0.5, 1.0) : random(-1.0, 0.5);
}