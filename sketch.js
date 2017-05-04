/* ================================================
     HCI LAB 2017 :: Whack a Mole p5.js game 
     Implemented by :: Amy Kwan 
     Supervisor :: Regan Mandryk 
================================================ */ 

// Variables for in game sprites used in the Whack-A-Mole game 
var img; // Mole 
var bg; // Background with sky, ground, holes 
var title;  // Title card for the game 
var front = []; // Front of the hole 
var back; // Back of the hole 

// Position variables for the holes 
var holeFront = [];
var holeBack = []; 

// Control the mole's position 
var moleX; 
var moleY; 

// setup() :: runs once, to set up the canvas used for the Whack a Mole Game 
function setup() {
    // Create the canvas size for the gaming interface 
    createCanvas(800, 800);
    // Load all necessary graphics 
    loadGraphics();

}

// loadGraphics() :: load all of the necessary graphical components/sprites for the game 
function loadGraphics() { 
    // Load the title image for the whack a mole game 
    title = loadImage("assets/text.png");
    
    // Load the image of the background, with an 800x800 canvas size 
    bg = loadImage("assets/whackamolescreen.png"); 

    // load the image of the mole
    img = loadImage("assets/molecpy.png"); 

    // Back of the hole to hide the mole 
    back = loadImage("assets/back.png");    
    // Front of the hole to hide the mole 
    for (var i = 0; i < 8; i++) { 
        front[i] = loadImage("assets/front" + i + ".png"); 
    }
}

// initial() :: load the initial state of the Whack a mole game, by placing holes on the background 
function initialState() { 
    // Load initial title card here 

    // Add the individual holes on the scree, back then front 
    image(back,88,223.8);
    image(front[0], 0, 221); // mole hides behind the front 

    image(back,362,223.8);
    image(front[1], 297, 221);

    image(back,618,223.8);
    image(front[2], 575, 221);
    // Second Row of Holes 
    image(back,228,406.8);
    image(front[3], 138, 404);

    image(back,480,406.8);
    image(front[4], 382, 404);
    // Third Row of Holes 
    image(back,88,624.8);
    image(front[5], 0, 622);

    image(back,365,624.8);
    image(front[6], 285, 622.5);

    image(back,631,624.8);
    image(front[7], 525, 622.5);
}

// draw() :: animation function, displaying the visual components of the game 
function draw() {
    // Fill the background of the whack a mole game 
    background (bg); 

    initialState(); 

    showMole();
}

function showMole() { 
     // Add the image of the mole to the game screen 
    image(img, 63, 140, 162, 162); // 250px down to hide 
}

function updateMole() { 
    moleX = random (50, 350); 
    moley = random (50, 350); 
}