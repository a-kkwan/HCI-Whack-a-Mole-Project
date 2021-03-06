/* ================================================
     HCI LAB 2017 :: Whack a Mole p5.js game 
     Implemented by :: Amy Kwan 
     Supervisor :: Regan Mandryk 
================================================ */ 

// Variables for in game sprites used in the Whack-A-Mole game 
var img; // Mole's image 
var bg; // Background with sky, ground, holes 
var hole; // Image of the full hole 
var title;  // Title card for the game 
var numMoles = 9; // Number of moles created on screen 
var hammer; // Hammer image (idle)
var hammerHit; // Hammer image (hitting the mole/when clicked)

// Position hit box offset for the moles of all sizes 
var largeX = 30;
var largeY = 50; 
var smallX = 50;
var smallY = 20; 
var medX = 40; 
var medY = 40; 

// Proper locations, and height/width of game canvas
var wid = 1200; 
var hei = 900; 
var locations = []; 

// Create an array of mole objects 
var myMole = [];  

// Mole size :: large, small, medium 
var large = 210; 
var small = 52.5;
var medium = 105; 

// Positions of appearance for the moles 
var positions = [0, 3, 5, 6, 7, 1, 8, 5, 3, 2, 1, 7, 0, 1, 7, 2, 5, 3, 8, 6, 4, 2, 1, 7, 0, 6, 1, 8]; 
// Additional mole timing / position variables 
var current = 0;
var moleSpawn = positions[current]; // start location at 0 

// Current mole size variables (Moles appear three times at each distance)
// Mole sizes: 0 = Small, 1 = Medium, 2 = Large 
var whichOne = 0; 
var moleSizes = [2, 0, 1, 2, 1, 0, 1, 2, 2, 0, 1, 2, 0, 1, 2, 2, 0, 1, 0, 1, 2, 0, 1, 0, 2, 1, 2, 2]; 
var spawnSize = moleSizes[whichOne]; // start at location 0, which is a large mole 

// Cursor/Time Logging variables
var timeStamp; // time stamp for each click  
var mouseLocX; 
var mouseLocY; 

// Target Logging variables 
// Location, size, distance travelled, boolean if clicked on first try, time from shown to mouse down 
var targetX; // Mole location X
var targetY; // Mole location Y 
var sizeOfMole; // Size of the mole 
var clickedOnFirstTry = false; // true if clicked on first try, false otherwise 
var clickOnce = 0; // Counting variable to determine if they've clicked once 
var distance; // Small, medium, large distances

var timeShown = 0; 
var intermediateTime = 0; 
var timeFromShownToMouseDown = 0; 

// Save reference of previous mole 
var prevSpawnIndex = positions[current]; // Initially the same as current, distance should be 0 
var curSpawnIndex = positions[current]; 

// Mole class 
function Mole (x, y, img) { 
    this.x = x; 
    this.y = y; 
    this.img = img; 
    this.hit = false; // Keep track of if the mole is whacked or not 
     
    this.totalMoleTime = int (random(30, 120)); 
    this.moleTime = 0; 

    this.graphics = createGraphics(140,160);
    this.gx = x*0.9; // Buffer canvas location x
    this.gy = y-130; // Buffer canvas location y

    //////////

    this.isOver = function() { 
       if (spawnSize == 2) { 
           return (mouseX >= (this.x-largeX) && mouseX <= (this.x-largeX)+100 && mouseY >= (this.y-largeY) && mouseY <= (this.y-largeY)+100);
       } else if (spawnSize == 0) { 
           return (mouseX >= (this.x-smallX) && mouseX <= (this.x-smallX)+100 && mouseY >= (this.y-smallY) && mouseY <= (this.y-smallY)+100);
       } else if (spawnSize == 1) { 
           return (mouseX >= (this.x-medX) && mouseX <= (this.x-medX)+100 && mouseY >= (this.y-medY) && mouseY <= (this.y-medY) + 100);
       }
    }

    this.showMole = function() { 
        // Moving up the mole above the hole, depending on the sizes, display it 
        // Clear the buffer first 
        this.graphics.clear(); 

        if (spawnSize == 0) { 
            this.graphics.image(img, 40, this.y-this.gy, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, 20, this.y-(this.gy+10), medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, -30, this.y-(this.gy+50), large, large); 
        }  

        // Log the target accordingly 
        logTarget();

        // Increment the timer for the mole appearance 
        timeShown++; 

        // Animation Speed 
        this.y = this.y - 5;

        // Change the bound of showing the mole depending on size 
        var bound; 
        if (spawnSize == 0) { // Small mole bound  
            bound = y - 20; 
        } else if (spawnSize == 2) { // Large mole bound 
            bound = y - 80;
        } else if (spawnSize == 1) { // Medium mole bound 
            bound = y - 40;
        }

        // Move up towards the upper bound of the hole 
        if (this.y <= bound) {
            this.y = bound;
        }
    }

    this.hideMole = function() { 
        // Hide the mole when mouse is pressed / when we have successfully whacked it 
        this.graphics.clear(); 

        if (spawnSize == 0) { 
            this.graphics.image(img, 40, this.y-this.gy, small, small);
        } else if (spawnSize == 1) { 
            this.graphics.image(img, 20, this.y-(this.gy+10), medium, medium);
        } else if (spawnSize == 2) { 
            this.graphics.image(img, -30, this.y-(this.gy+50), large, large); 
        }
       
        this.y = this.y + 10;
        var bound = y + 60;
        // Move down the the lower bound of the hole 
        if (this.y >= bound) {
            this.y = bound;

            // Check if it reaches the bottom, then if it has been hit 
            // Otherwise, keep spawning in the same position until it has been hit 
            if (this.hit) {
                if ((moleSpawn === positions[current])) {

                    /** Save the previous index for distance calculation */
                    prevSpawnIndex = moleSpawn; 
                    // console.log("Previous spawn index: " + prevSpawnIndex); 

                    current++; // If it has been hit, update the mole spawn index to a new position 
                    moleSpawn = positions[current]; 
                    this.next(); // Update the size only if it's been hit/advancing to next hole 

                    // If we exceeded the last position, loop to the beginning of the array 
                    if (current > 19) {
                        current = 0;
                        moleSpawn = positions[current]; 
                    }

                    /** Save the current index for distance calculation */
                    curSpawnIndex = moleSpawn; 
                    // console.log("Current spawn index: " + curSpawnIndex); 

                    // Have we successfully whacked a mole in one click? 
                    if (clickOnce === 1) { 
                        clickedOnFirstTry = true; 
                    } else { 
                        clickedOnFirstTry = false; 
                    }
                    // console.log(clickedOnFirstTry); 
                    resetClicks();

                    // Reset the timing variables to determine mouse clicks 
                    timeShown = 0;
                    timeFromShownToMouseDown = 0;
                }  
            }
            // Reset the timer after the mole hides for a little bit!
            if (this.moleTime >= 150){
                this.reset();
            }
        }
    }

    this.reset = function() { 
        this.totalMoleTime = int (random(30, 120)); 
        this.moleTime = 0;
    }

    this.next = function() { 
        // NOTE:    whichOne = (whichOne + 1) % 20    //  1 %20 = 1, 2%20 = 2, ..., 20 % 20 = 0 , 21 % 20
        whichOne++; // Update the size index 
        spawnSize = moleSizes[whichOne];

        if (whichOne > 19) { 
            whichOne = 0; 
            spawnSize = moleSizes[whichOne];
        }
    }

    this.updatePosition = function() { 
        // increment the time of the mole, then when it exceeds the total time . . . 
        this.moleTime++; 

        if (this.moleTime >= this.totalMoleTime) {
            // Update the position within the hide function 
            this.hideMole(); 
        }   
    }
}

// preload() :: load all of the necessary graphical components/sprites for the game 
function preload() { 
    // Load the holes
    hole = loadImage("buttonGame/images/hole_copy2.png");

    // Load the image of the background, on the canvas
    bg = loadImage("buttonGame/images/newbg.png"); 

    // load the image of the mole
    img = loadImage("buttonGame/images/molecpy2.png"); 
    
    // Load the hammer images 
    hammer = loadImage("buttonGame/images/hammer.png"); 
    hammerHit = loadImage("buttonGame/images/hammer2.png");
}

// setup() :: runs once, to set up the canvas used for the Whack a Mole Game 
function setup() {
    // Create the canvas size for the gaming interface 
    createCanvas(wid, hei);

    // Line up the hole locations as necessary 
    locations = [ { x:(wid/4), y: hei/4 }, { x:wid/4, y: hei/2 }, { x:wid/4, y: hei*0.75}, 
	{ x:wid/2, y:hei/4 }, { x:wid/2, y:hei/2}, { x:wid/2, y:hei*0.75 },
    { x:wid*0.75, y:hei/4}, { x:wid*0.75, y:hei/2 }, { x:wid*0.75, y:hei*0.75} ];
    
    // Create and initialize 9 new moles of each size
    for (var i = 0; i < numMoles; i++){
       myMole.push(new Mole(locations[i].x, locations[i].y, img));
    }
}

// draw() :: animation function, displaying the visual components of the game 
function draw() {
    // Fill the background of the whack a mole game 
    image(bg, 0, 0, wid, hei); 
  
    // New Holes location 
    loadHoles(); 

    // Show and hide the moles 
    playGame();

    // Display the hammer images to indicate whacking the mole 
    displayHammer();

    // Display the mouse locations in the data and also the time when clicked 
    mouseLoc();
}

// loadHoles() :: load the correct positions of all holes 
function loadHoles() { 
    for (var i = 0; i < numMoles; i ++) {
        image(hole, locations[i].x*0.88, locations[i].y, 162, 64);
    }
}

// playGame() :: play the game, show and hide the moles 
function playGame() { 
    // Show all of the 9 moles and update their position, according to their mole spawn index
    myMole[moleSpawn].showMole();        
    myMole[moleSpawn].updatePosition();

    if (myMole[moleSpawn].hit) { 
        myMole[moleSpawn].hideMole(); 
    }
    
    // Control the buffer position and display the buffer along with the moles 
    image(myMole[moleSpawn].graphics, myMole[moleSpawn].gx, myMole[moleSpawn].gy);
}

// displayHammer() :: Display the hammer as the cursor, changes depending if a mole is hit or not 
function displayHammer() { 
    // If the mouse is pressed/mole is hit, change the hammer 
    if (mouseIsPressed) {
        image(hammerHit, mouseX-15, mouseY-50, 80, 80);
    } else { 
        image(hammer, mouseX-15, mouseY-50, 80, 80); 
    }
}

// mousePressed() :: Set the hit variable of the mole accordingly if the mouse is over the mole 
function mousePressed() {
   // console.log("mouseX: " + mouseX);
   // console.log("mouseY: " + mouseY);

    for (var i = 0; i < numMoles; i++) {
        //console.log(myMole[i].isOver());
        if (myMole[i].isOver()) {
            myMole[i].hit = true; 
            //console.log("Mole hit: " + myMole[i].hit);
        } else {
            myMole[i].hit = false; 
        } 
    }
    clickOnce++; // Increase the counter whenever you press to track if we have 
    // successfully clicked in one try 
    // console.log(clickOnce);

    // Update timed appearance, previous mole time saved as intermediate time 
    timeFromShownToMouseDown = timeShown;
    intermediateTime = timeFromShownToMouseDown;         
    timeShown = 0;
}

/** LOGGING FUNCTIONS */

// resetClicks() :: Reset the click counter back to 0 to check if we whacked a mole on first try 
function resetClicks() { 
    clickOnce = 0; 
}

// mouseLoc() :: Track the mouse locations in the game 
function mouseLoc() { 
    timeStamp = new Date(); 
    // console.log(timeStamp); 

    var mouseData = {
        timing: timeStamp, 
        xPos: mouseX, 
        yPos: mouseY,
        action: "mouse"
    };
    $.post("#", mouseData);
}

function logTarget () { 
    // Target location 
    /*
    if (mouseIsPressed) {
        targetX = mouseX;
        targetY = mouseY;  
    }
    */
    targetX = myMole[curSpawnIndex].x; 
    targetY = locations[curSpawnIndex].y; // Mole's X and Y is where the location of the hole is located at 

    // Target Size 
    if (spawnSize == 2) { // Large mole 
        sizeOfMole = large;         
    } else if (spawnSize == 1) { // Medium mole
        sizeOfMole = medium; 
    } else if (spawnSize == 0) { // Small mole 
        sizeOfMole = small; 
    }

    // Distance travelled 
    distance = dist(myMole[prevSpawnIndex].x, locations[prevSpawnIndex].y, myMole[curSpawnIndex].x, locations[curSpawnIndex].y);

    // console.log ("Location: " + targetX + " " + targetY + ", Size of the mole: " + sizeOfMole + ", Distance travelled from previous to next spawn: " + distance + ", Time from shown to mouse down: " + timeFromShownToMouseDown); 

    var targetData = { 
        locX: targetX, 
        locY: targetY, 
        moleSize: sizeOfMole, 
        firstTryClick: clickedOnFirstTry, 
        distanceTravelled: distance, 
        timeShownFromClick: timeFromShownToMouseDown,
        action: "target"
    }; 
    $.post("#", targetData);
}
