var Sky = function (img) {
    this.image = img;
    this.image.resize(0, height * 2);
    this.done = false;
    this.starting = false;
    this.doneCallback;

    this.risePercent = 0.0;
    this.fullRise = 1.0;
    this.yStart = height / 16 * 14;
    this.y = this.yStart;
    this.yTarget = height / 16 * 10.5;

}

Sky.prototype.draw = function () {
    //console.log(this.risePercent, this.y);
    imageMode(CENTER);
    push();
    translate(width / 3 * 2, this.y);
    rotate(frameCount / 500.0);
    tint(255, this.risePercent * 255);
    image(this.image, 0, 0);
    pop();
    if (this.starting && this.risePercent < this.fullRise) {
        this.risePercent += Math.max((1.0 - this.risePercent) / 10, 0.01);
        this.risePercent = Math.min(this.risePercent, 1.0);
        this.y = this.yStart - (this.yStart - this.yTarget) * this.risePercent;
    } else if (this.starting && this.risePercent >= 1.0) {
        this.done = true;
        this.starting = false;
        if (this.doneCallback) this.doneCallback();
    }
}

Sky.prototype.start = function (callback) {
    if (!this.done) {
        this.starting = true;
        this.doneCallback = callback;
    } else {
        if (callback) callback();
    }
}