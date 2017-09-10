var IntroOverlay = function () {
    this.opacity = 0.0;
    this.fullOpacity = 0.8;
    this.stopped = false;
    this.stopping = false;
    this.stopCallback;
}

IntroOverlay.prototype.draw = function () {
    if (!this.stopped) {
        noStroke();
        fill(0, 255 * this.opacity);
        rectMode(CORNER);
        rect(0, 0, width, height);
        fill(255, 255 * this.opacity);
        textAlign(CENTER);
        textSize(20);
        text("The Slingshot Challenge", 10, 100, width-10, 100);
        textSize(16);
        text("Strange things have started flocking into your yard. Fend them off with your trusty slingshot!", 10, 200, width-10, 100);
        text("This Challenge asks you to classify tweets as being related to pensions or not. Try to hit the green target for YES and the red target for NO. Good luck!", 10, 300, width-10, 100);
        // TODO explain/show UI Elements
    }
    if (!this.stopping && this.opacity < this.fullOpacity) {
        this.opacity += 0.075;
        this.opacity = Math.min(this.opacity, this.fullOpacity);
    }
    else if (this.stopping && this.opacity > 0.0) {
        this.opacity -= 0.075;
        this.opacity = Math.max(this.opacity, 0.0);
    }
    else if (this.stopping && this.opacity <= 0.0) {
        this.stopped = true;
        if (this.stopCallback) this.stopCallback();
    }
}

IntroOverlay.prototype.stop = function (callback) {
    if (!this.stopped) {
        this.stopping = true;
        this.stopCallback = callback;
    } else {
        if (callback) callback();
    }
}