let canvas,
		img,
		pic,
    bgColor,
    fft,
    soundFile,
    soundSpectrum;
let snowflakes = [];

function preload(){
	img = loadImage("Unknown.png");
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.drop(gotFile); // allow the users to drop a mp3 and listen from the canvas
	bgColor = color(330,0,5);
  background(0);
	
	imageMode(CENTER);
	image(img, width/2, height/2, 180, 180);
	
	//Text information
  textAlign(CENTER);
	textFont('sans-serif');
	fill(255)
	textSize(38);
	text('Audio Visualizer', width/2, height/2-150);
	
	textSize(18);
  text('Drop your favorite MP3 file on the canva,', width/2, height/2+150);
	text('Click the canva to start', width/2, height/2+170);
}

function gotFile(file) {
  if((!soundFile) && (file.type == "audio")) { // if don't already have sound && is audio
		background(bgColor);
    soundFile = new p5.SoundFile(file.data); // create an audio file
    initSound(); // init sound & FFT 
    canvas.mouseClicked(togglePlay); // listen for mouse click to play sound
  }
}

function draw() {
  if(soundFile) {
		background(255);
		//imageMode(CENTER);
		//pic = image(img, width/2, height/2, 80, 80); // Hide the image when user clicks the image
		analyseSound();
		var myDataVal = getNewSoundDataValue("bass");
		var myDataVal2 = getNewSoundDataValue("treble");
		
		 let t = frameCount / 40; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(15); i++) {
    snowflakes.push(new snowfall()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
		
				
		var size = 300 * myDataVal;
		var size2 = 350 * myDataVal2;
		
		fill('#3cd184');
		ellipse(width/2, height/2, size2, size2);
		noStroke();
		snowflake(size);
	}
}

function snowfall() {
	c = color('#aff0f0');
	fill(c);
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(8, 2 * PI);
  this.size = random(2, 10);

	
  this.radius = sqrt(random(pow(width , 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.3; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}

function snowflake(a){
	c = color('#a9eed1');
	fill(c);
	translate(width/2, height/2);
  noStroke();
  for (let i = 0; i < 10; i ++) {
    ellipse(30, 45, 12, a); //change the four value to change the length of the flowers. 
    rotate(PI/5);
  }
}

function getNewSoundDataValue(freqType) { 
  return map(fft.getEnergy(freqType),0,255,0,1); // get energy from frequency, scaled from 0 to 1
}

function initSound() {
  fft = new p5.FFT(0.4,1024);
  soundFile.amp(0.3); //Changes the volume of the track
}

function togglePlay() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.loop();
  }
}

function analyseSound() {
  soundSpectrum = fft.analyze(); // spectrum is array of amplitudes of each frequency
}
