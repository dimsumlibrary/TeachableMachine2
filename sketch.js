// Teachable Machine
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/TeachableMachine/1-teachable-machine.html
// https://editor.p5js.org/codingtrain/sketches/PoZXqbu4v

let video;
let label = "Say the letter";
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/PJhpv0xpn/';

// Counter variable to keep track of the number of correct "A" classifications
let counter = 0;
// Number of correct "A" classifications required to stop the program
const requiredCount = 5;
// Variable to keep track of whether an "A" classification has been counted
let hasCounted = false;

function preload() {
  classifier = ml5.soundClassifier(modelURL + 'model.json');
}

function setup() {
  createCanvas(640, 520);
  classifyaudio();
}

function classifyaudio() {
  setTimeout(function() {
    classifier.classify(gotResults);
  }, 1500); // 5 second delay
}

function draw() {
  background(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width / 2, height - 16);
  let emoji = "🄰";
  if (label == "A" && !hasCounted) { // Only count "A" classifications if hasCounted is false
    emoji = "🙂";
    // Draw the message if the label is "A"
    textSize(46);
    textAlign(CENTER, CENTER);
    fill(300);
    text("Great job! You did it!", width / 2, height / 2 + 150);

    // Increment the counter if the label is "A" and hasCounted is false
    if (counter < requiredCount) {
      // Change the color of the circle from red to green
      fill(0, 255, 0);
      counter++;
    }
    if (counter === requiredCount) {
      console.log("Great job! You did it!");
      noLoop(); // Stop the program
    }

    // Pause for 2 seconds before accepting results again
    setTimeout(function() {
      label = "not A"; // Reset the label
      hasCounted = false; // Reset hasCounted
      classifyaudio(); // Classify again
    }, 3000);

    hasCounted = true; // Set hasCounted to true
  } else if (label == "not A") {
    emoji = "😢";
    hasCounted = false;
  }

  // Draw the emoji
  textSize(256);
  text(emoji, width / 2, height / 2);

  // Draw the counter circles on the canvas
  textSize(20);
  textAlign(LEFT, TOP);
  fill(255);
  text("Correct 'A' classifications: ", 15, 18);
  for (let i = 0; i < requiredCount; i++) {
    if (i < counter) {
      fill(0, 255, 0); // Green if classified correctly
    } else {
      fill(255, 0, 0); // Red otherwise
    }
    ellipse(20 + i * 20, 50, 13, 13);
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  if (results[0].confidence > 0.85) {
    label = results[0].label;
    if (label === "A") {
      // Pause for 2 seconds before incrementing the counter
      setTimeout(function() {
        // Check if hasCounted is false before counting the classification
        if (!hasCounted) {
          counter++;
          // Check if the required count has been reached
          if (counter >= requiredCount) {
            // Display a message and stop the classification
            textSize(32);
            textAlign(CENTER, CENTER);
            fill(255);
            console.log("Great job! You did it!");
            noLoop();
          } else {
            // Reset the label and classify again
            label = "not A";
            classifyaudio();
          }
          hasCounted = true; // Set hasCounted to true
        }
      }, 3000);
    }
  } else {
    // Reset the label and classify again
    label = "not A";
    classifyaudio();
    hasCounted = false; // Reset hasCounted
  }
}