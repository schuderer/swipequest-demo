var Slingshot = function (sketch) { // constructor extends Game's constructor
    Game.call(this, sketch);

    this.sky;
    this.groundImg;
    this.tLogo;
    this.intro;
    this.targets;
    this.targetGenerationTimeout;
    this.sling;
    this.projectile;

    // for database test
    this.nofLaunches;
    this.dbResultsRef;
    this.dbLastResultKey;
}

// inherit from Game (game.js)
Slingshot.prototype = Object.create(Game.prototype);
Slingshot.prototype.constructor = Slingshot;

// Create and register Game Manifest
Slingshot.prototype.manifest = {
    constructor: Slingshot,
    text: "Slingshot Challenge",
    menuAnimationFiles: ["games/slingshot/menuitem_0001.png", "games/slingshot/menuitem_0002.png"], // property "menuAnimation" will be created
    preloadImages: {
        sky: "games/slingshot/sky.png",
        ground: "games/slingshot/ground.png",
        tlogo: "games/slingshot/tlogo.png"
    } // property "images" will be generated
};
if (games) {
    games.push(Slingshot.prototype.manifest);
} else {
    console.log("Unable to register manifest: global variable 'games' does not exist.")
}

Slingshot.prototype.setup = function () {
    Game.prototype.setup();

    this.sky = new Sky(this.manifest.images.sky);
    this.groundImg = this.manifest.images.ground;
    this.groundImg.resize(width * 2, 0);
    this.tLogo = this.manifest.images.tlogo;
    this.intro = new IntroOverlay();
    this.targets = [];
    this.targetGenerationTimeout = 0;
    this.sling = new Sling();
    this.dbResultsRef = firebase.database().ref('results/tweets');

    var dataRef = firebase.database().ref('data/tweets');
    var self = this;
    dataRef.once('value').then(function (snapshot) {
        self.tweets = snapshot.val();
        // todo: make sure game doesn't start before data has been fetched
    });

    // Database test
    var self = this;
    var slingshotRef = firebase.database().ref('games/slingshot');
    nofLaunches = slingshotRef.once('value').then(function (snapshot) {
        self.nofLaunches = snapshot.val().launches;
        slingshotRef.set({
            launches: self.nofLaunches + 1
        });
    });
    nofLaunches = slingshotRef.on('value', function (snapshot) {
        self.nofLaunches = snapshot.val().launches;
    });
}

Slingshot.prototype.draw = function () {
    Game.prototype.draw();

    if (!this.paused) {
        // draw stuff
        background(0);
        this.sky.draw();
        imageMode(CENTER);
        image(this.groundImg, width / 2, height);
        textSize(12);
        noStroke();
        fill(0);
        text("Long press to exit.\nThis game has been opened " + this.nofLaunches + " times.", 10, height - 20);

        if (this.intro) {
            this.intro.draw();
        } else {
            if (this.tweets.length > 0 && this.targetGenerationTimeout < frameCount && random(1000) > 980) {
                this.targets.push(new Target(this.tweets[int(random(this.tweets.length))], this.tLogo));
                this.targetGenerationTimeout = frameCount + 50;
            }
            for (var i = this.targets.length - 1; i >= 0; i--) {
                this.targets[i].draw();
                var hit = this.projectile && this.targets[i].hit(this.projectile.getPos());
                if (hit) {
                    this.dbLastResultKey = this.dbResultsRef.push({
                        tweetText: this.targets[i].contents,
                        classification: (hit === "YES") ? true : false,
                        timestamp: (new Date()).toUTCString(),
                        userId: 0
                    }).key;
                    this.projectile = null;

                    // TODO: count scores, undo last hit, etc.
                }
                if (this.targets[i].stopped) this.targets.splice(i, 1); // remove element
            }
            this.sling.draw();
            if (this.projectile) {
                this.projectile.draw();
                this.projectile.accelerate(0, 0, -0.01);
            }
        }
    }
}

Slingshot.prototype.touchStarted = function () {
    if (!this.intro) {
        this.sling.startAt(mouseX, mouseY);
    }
}

Slingshot.prototype.touchMoved = function () {
    this.sling.pull(mouseX, mouseY);
}

Slingshot.prototype.touchEnded = function () {
    if (this.intro) {
        var self = this;
        this.intro.stop(function () {
            self.intro = undefined;
            self.sky.start();
        });
    } else {
        this.projectile = this.sling.letGo(mouseX, mouseY);
    }
}


Slingshot.prototype.stop = function (callback) {
    Game.prototype.stop(callback);

    // Clean up
    var sprites = getSprites();
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].remove();
    }

    if (callback) callback();
}