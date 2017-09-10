p5.disableFriendlyErrors = true;
const screenFactor = 1;
var longPressTimeOut = 0;
var game;
var games = [];
var particles;
var particleImg;
var moreMenuImg;

function preload() {
    // Intro/Menu data

    // this is a test of the second game's menu item (belongs in game's own main.js file)
    games.push({
        constructor: "TODO",
        text: "Countdown Swipe Challenge",
        description: "Swipe as fast as you can. How far do you get in 60 seconds?",
        menuAnimationFiles: ["games/countdown/menuitem_0001.png", "games/countdown/menuitem_0002.png"],
        preloadImages: {} // property "images" will be generated
    });

    // Preload assets
    console.log(games.length + " games found.")
    for (var i = 0; i < games.length; i++) {
        // Preload menu animation
        games[i].menuAnimation = loadAnimation.apply(null, games[i].menuAnimationFiles)
            // Preload game assets
        var imgFiles = games[i].preloadImages;
        var imgObjs = {};
        for (var p in imgFiles) {
            if (imgFiles.hasOwnProperty(p)) {
                imgObjs[p] = loadImage(imgFiles[p]);
            }
        }
        games[i].images = imgObjs;
    }

    particleImg = loadImage("assets/twitter_logo.png");
    moreMenuImg = loadImage("assets/more_menuitem.png");
}

function setup() {
    // General setup
    var w = Math.floor(displayWidth / screenFactor);
    var h = Math.floor(displayHeight / screenFactor);
    const canvas = createCanvas(w, h);
    canvas.elt.style.width = w * screenFactor;
    canvas.elt.style.height = h * screenFactor;
    window.addEventListener('orientationchange', handleOrientationChange);
    handleOrientationChange();
    frameRate(30);

    // Prepare menu images/animation
    for (var i = 0; i < games.length; i++) {
        var imgs = games[i].menuAnimation.images;
        for (var j = 0; j < imgs.length; j++) {
            imgs[j].resize(width - 10, 0);
        }
    }
    moreMenuImg.resize(width - 10, 0);

    // Prepare particle effect
    //particleImg.resize(20);
    particles = [];
    for (var i = 0; i < 8; i++) {
        particles.push(newParticle());
    }
}

function draw() {
    if (!game) {
        /////////// DRAW LOOP OF INTRO/MENU SCREEN ///////////////////
        background(0);
        drawParticles(false);
        noStroke();
        fill(255);
        textSize(16);
        textAlign(CENTER);
        text("Welcome to SwipeQuest", width / 2, 80);

        // Draw menu
        for (var i = 0; i < games.length + 1; i++) {
            if (i < games.length) {
                var anim = games[i].menuAnimation;
                var h = anim.getHeight();
                var y = (200 + h / 2) + i * (h + 10);
                animation(anim, width / 2, y);
                textSize(20);
                fill(0);
                textAlign(CENTER, CENTER);
                text(games[i].text, width / 3, y - h / 2 + 5, width / 3, h - 5);
            } else {
                var h = moreMenuImg.height;
                image(moreMenuImg, width / 2, (200 + h / 2) + i * (h + 10) - 10);
            }
        }
        drawParticles(true);
        updateParticles();
        //////////////////////////////////////////////////////////////
    } else {
        // Handle drawing the game
        game.draw();
        // Handle quitting the game from outside
        if (longPressTimeOut > 0 && frameCount > longPressTimeOut) {
            game.stop(function () {
                game = null;
                longPressTimeOut = 0;
            });
        }
    }
}

function touchStarted() {
    longPressTimeOut = frameCount + 90;
    if (game && game.touchStarted) {
        game.touchStarted();
    }
    return false;
}

function touchEnded() {
    if (longPressTimeOut > 0) {
        // short press
        longPressTimeOut = 0;
        if (!game) { // on title screen
            // check menu items
            for (var i = 0; i < games.length; i++) {
                var height = games[i].menuAnimation.getHeight();
                var y = 200 + i * (height + 10);
                if (mouseX > 5 && mouseX < width - 5 && mouseY > y + 5 && mouseY < y + height - 5) {
                    game = new games[i].constructor(this);
                    game.setup();
                    break;
                }
            }
        } else if (game && game.touchEnded) {
            game.touchEnded();
        }
    }
    return false;
}

function touchMoved() {
    if (game && game.touchMoved) {
        return game.touchMoved();
    }
}

function handleOrientationChange() {
    if (window.orientation == -90 || window.orientation == 90) {
        document.getElementById("landscape").style.display = "block";
        if (game) game.pause();
    } else {
        document.getElementById("landscape").style.display = "none";
    }
}


// Add some nice decoration
function newParticle() {
    var x = function () {
        if (random(-1, 1) >= 0) {
            return random(width, width + 150);
        } else {
            return random(-150, 0)
        }
    }();
    var xVel = function () {
        if (x > 0) {
            return random(-15, -8);
        } else {
            return random(15, 8);
        }
    }();
    return {
        pos: createVector(x, random(0, height + 100)),
        vel: createVector(xVel, random(-15, -8)),
        z: random(-10, 10)
    };
}

function drawParticles(frontElseBack) {
    imageMode(CENTER);
    var neededScaleDown = (width / 8) / particleImg.width;
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        if (frontElseBack && p.z > 0 || !frontElseBack && p.z <= 0) {
            push();
            translate(p.pos.x, p.pos.y);
            scale((20 + p.z) / 20 * neededScaleDown);
            if (p.vel.x > 0) {
                rotate(PI / 4.5 + p.vel.heading());
            } else {
                scale(-1, 1);
                rotate(PI / 4.5 - p.vel.heading() + PI);
            }
            image(particleImg, 0, 0);
            pop();
        }
    }
}

function updateParticles() {
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        if (p.pos.x < -200 || p.pos.x > width + 200 || p.pos.y < -200 || p.pos.y > height + 200) {
            particles[i] = newParticle();
        } else {
            p.pos.add(p.vel);
            p.vel.y += 0.3; // gravity
        }
    }
}