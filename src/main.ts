import { vec3, vec4, mat3, mat4 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import * as fs from 'fs';

import Mesh from './geometry/Mesh';
import Track from './geometry/Track';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';

import { readTextFile } from './globals';
import { setGL } from './globals';

import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';

const parseJson = require('parse-json');
let jsonFile: string; //jsonFile name

//list of buttons to create
let buttons = Array<any>();
let buttonPos = Array<vec3>();
let buttonType = Array<string>();

let points = 0;
let health = 20;
let startTime = 0;
let epsilon = 0.5;

let keyBoard = Array<Mesh>();
let track: Track;
let gameDiff: string;
let startGame = false;
let loaded = false;
let parse = false;

let gameStartTime = 0;

let play = 0;
//shapes
let cube: Cube;
let square: Square;

//time
let count: number = 0.0;

//objects
let marioString: string; //objString name
let mario: Mesh;

let buttonAstr: string;
let buttonA: Mesh;
let downA: boolean;

let buttonFstr: string;
let buttonF: Mesh;
let downF: boolean;

let buttonSstr: string;
let buttonS: Mesh;
let downS: boolean;

let buttonDstr: string;
let buttonD: Mesh;
let downD: boolean;

let buttonJstr: string;
let buttonJ: Mesh;
let downJ: boolean;

let buttonKstr: string;
let buttonK: Mesh;
let downK: boolean;

let buttonLstr: string;
let buttonL: Mesh;
let downL: boolean;

let buttonPstr: string;
let buttonP: Mesh;
let downP: boolean;

//music 
var JukeBox: AudioContext;

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Difficulty: "easy",
  Song: "Run",
  'Load Scene': loadScene // A function pointer, essentially
};


function play_music() {
  JukeBox = new AudioContext();
  var musicStr = controls.Song;
  var musicPath = './resources/music/mp3/' + musicStr + '.mp3';

  fetch(musicPath)
    .then(r => r.arrayBuffer())
    .then(b => JukeBox.decodeAudioData(b))
    .then(data => {
      const audio_buf = JukeBox.createBufferSource();
      audio_buf.buffer = data;
      audio_buf.loop = true;
      audio_buf.connect(JukeBox.destination);
      audio_buf.start(0);
    });

  console.log(`Music On!` + musicStr);
}

function loadScene() {
  //Mario 
  marioString = readTextFile('./resources/obj/wahoo.obj');
  mario = new Mesh(marioString, vec3.fromValues(0, 0, 0));
  mario.translateVertices(vec3.fromValues(0, -5, -20));
  mario.create();

  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
}

function loadButtonsEasy() {
  buttonSstr = readTextFile('./resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  keyBoard.push(buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL);
}

function loadButtonsHard() {
  buttonAstr = readTextFile('./resources/obj/button.obj');
  buttonA = new Mesh(buttonAstr, vec3.fromValues(0, 0, 0));
  buttonA.translateVertices(vec3.fromValues(-9.5, 0, 0));
  buttonA.create();

  buttonSstr = readTextFile('./resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  buttonPstr = readTextFile('./resources/obj/button.obj');
  buttonP = new Mesh(buttonPstr, vec3.fromValues(0, 0, 0));
  buttonP.translateVertices(vec3.fromValues(9.5, 0, 0));
  buttonP.create();

  keyBoard.push(buttonA, buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL, buttonP);
}

//read the JSON file determined by the user
//currntly doing a test midi json
function parseJSON() {
  var musicStr = controls.Song;
  var musicPath = './resources/music/json/' + musicStr + '.json';

  jsonFile = readTextFile(musicPath);
  const json = jsonFile;

  var midi = parseJson(json);
  //console.log(midi);
  var tracks = midi["tracks"];
  //console.log("midi" + tracks.length);
  if(controls.Difficulty == 'easy') {
    parseTracksEasy(tracks);
  } else if (controls.Difficulty == 'hard') {
    parseTracksHard(tracks);
  }
}

//easy version
function parseTracksEasy(tracks: any) {
  //tracks are in an array
  for (let track of tracks) {
    //console.log("track" + track.length);
    //track's notes are in an array
    let notes = [];
    notes = track["notes"];
    //if the track has notes to be played
    if (notes.length > 0) {
      var currTime = 0;
      for (let note of notes) {
        //name, midi, time, velocity, duration
        //time passed per note
        var time = note["time"];
        var deltaTime = time - currTime;
        currTime = time;

        var number = note["midi"];
        var duration = note["duration"];

        //for buttons that happen 0.3
        //connect - 0.35
        //run - 0.25
        if (deltaTime > 0.5) {
          //cutoffs: 28, 40, 52, 64, 76, 88, 100
          if (number > 0 && number < 55) {
            //console.log("15 to 40");
            let obj = {
              letter: "S",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 55 && number < 65) {
            //console.log("40 to 52");
            let obj = {
              letter: "D",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 65 && number < 70) {
            //console.log("64 to 76");
            let obj = {
              letter: "F",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 70 && number < 75) {
            let obj = {
              letter: "J",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 75 && number < 83) {
            let obj = {
              letter: "K",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 83 && number < 127) {
            let obj = {
              letter: "L",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          }
        }
      }
    }
  }
}

//easy version
function parseTracksHard(tracks: any) {
  //tracks are in an array
  for (let track of tracks) {
    console.log("track" + track.length);
    //track's notes are in an array
    let notes = [];
    notes = track["notes"];
    //if the track has notes to be played
    if (notes.length > 0) {
      var currTime = 0;
      for (let note of notes) {
        //name, midi, time, velocity, duration
        //time passed per note
        var time = note["time"];
        var deltaTime = time - currTime;
        currTime = time;

        var number = note["midi"];
        var duration = note["duration"];

        //for buttons that happen 0.3
        //connect - 0.35
        //run - 0.25
        var max = 3;
        var min = -3;
        var rand = Math.random() * (max - min) + min;
        if (deltaTime > 0.4) {
          if(number > 0 + rand && number < 66 + rand) {
            let obj = {
              letter: "A",
              mark: time,
              duration: duration
            }
          }
          //cutoffs: 28, 40, 52, 64, 76, 88, 100
          if (number > 66 + rand && number < 69 + rand) {
            let obj = {
              letter: "S",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 69 + rand && number < 73 + rand) {
            let obj = {
              letter: "D",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 73 + rand && number < 77 +rand) {
            let obj = {
              letter: "F",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 77 + rand && number < 79 + rand) {
            let obj = {
              letter: "J",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 79 + rand && number < 82 + rand) {
            let obj = {
              letter: "K",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 82 + rand && number < 85 + rand) {
            let obj = {
              letter: "L",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          } else if (number > 85 + rand && number < 127) {
            let obj = {
              letter: ";",
              mark: time,
              duration: duration
            }
            buttons.push(obj);
          }
        }
      }
    }
  }
}

function loadTrack() {
  //track 
  track = new Track(vec3.fromValues(0, 0, 0));
  if(controls.Difficulty == "easy") {
    loadTrackEasy();
  } else if (controls.Difficulty == "hard") {
    loadTrackHard();
  }
  //console.log("track loads");
  track.create();
  //console.log("track positions" + track.pos);
}

function loadTrackEasy() {
  //console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for (let one of buttons) {
    var letter = one.letter;
    var duration = one.duration;
    var time = one.mark;
    var spacing = -6;

    buttonType.push(letter);
    //console.log("loading each button with: "  + letter);
    //console.log("loading each button at: " + time);

    let buttonStr = readTextFile('./resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    //connect = 
    //bts run = -5
    var pos = vec3.fromValues(0,0,0);

    if (letter == 'S') {
      //console.log("loading each button with: "  + 'S');
      pos = vec3.fromValues(-7, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'D') {
      //console.log("loading each button with: "  + 'D');
      pos = vec3.fromValues(-4.5, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
      button.translateVertices(pos);
    }
    buttonPos.push(pos);
   
    track.addMesh(button);
  }
}

function loadTrackHard() {
 // console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for (let one of buttons) {
    var letter = one.letter;
    var duration = one.duration;
    var time = one.mark;
    var spacing = -5;
    buttonType.push(letter);

    let buttonStr = readTextFile('./resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    //connect = 
    //bts run = -5
    var pos = vec3.fromValues(0,0,0);

    if(letter == 'A') {
      pos = vec3.fromValues(-9.5, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
      button.translateVertices(pos);
    } else if (letter == ';') {
      pos = vec3.fromValues(9.5, 0, time * spacing);
      button.translateVertices(pos);    
    }

    buttonPos.push(pos);

    track.addMesh(button);
  }
}

function main() {
  for(let button of buttons) {
   console.log("b" + button.letter);
  }
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  //document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Difficulty', ['easy', 'hard']);
  gui.add(controls, 'Song', ['Run', 'Connect', 'Connect-Goofy', 'Cheerup', 'Megalovania']);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 5, 15), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.4, 0.3, 0.9, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  //mario
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  //key buttons
  const button_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/button-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/button-frag.glsl')),
  ]);

  //the track buttons
  const track_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/track-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/track-frag.glsl')),
  ]);

  //transparent
  const plate_lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/plate-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/plate-frag.glsl')),
  ]);

  //change fov
  //camera.fovy = 1.5;

  // This function will be called every frame
  function tick() {

    var timeRightNow = Date.now();
    var timeSinceStart = timeRightNow - startTime;
    var timeSinceStartSec = timeSinceStart / 1000;

    //console.log("time counting: " + timeSinceStartSec);

    if(!startGame && controls.Difficulty == "easy") {
      console.log("load easy mesh buttons");
      //load easy mesh buttons
      loadButtonsEasy();
      loaded = true;
    } else if(!startGame && controls.Difficulty == "hard"){
      //load 
      console.log("load hard mesh buttons");
      loadButtonsHard();
      loaded = true;
    }

    var currTime = new Date();

    //disable rollover controls
    camera.controls.rotationSpeed = 0;
    camera.controls.translationSpeed = 0;
    camera.controls.zoomSpeed = 0;

    camera.update();
    stats.begin();

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    let base_color = vec4.fromValues(200 / 255, 60 / 255, 200 / 255, 1);

    //mario
    lambert.setGeometryColor(base_color);
    renderer.render(camera, lambert, [mario]);

    //plate
    base_color = vec4.fromValues(150 / 255, 240 / 255, 255 / 255, 1);
    plate_lambert.setGeometryColor(base_color);
    renderer.render(camera, plate_lambert, [square]);

    //buttons
    base_color = vec4.fromValues(255 / 255, 160 / 255, 200 / 255, 1);
    button_lambert.setGeometryColor(base_color);

    //user has not started game
    if(!startGame && controls.Difficulty == "easy") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL]);
    } else if(!startGame && controls.Difficulty == "hard") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonA, buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL, buttonP]);
    }

       //U_tIME
    //user starts game
    if (startGame) {
      // console.log("positions: " + buttonPos.length);
      // console.log("types: " + buttonType.length);

      //calculate the buttons positions as the track moves across
      count++;
      console.log("count: " + count);

      var temp = Array<vec3>();
      for(let buttonPosi of buttonPos) {
        var originalPos = buttonPosi;
        var newPos = vec3.fromValues(buttonPosi[0], buttonPosi[1], buttonPosi[2] + count * 0.1); 
        temp.push(newPos);
      }
      buttonPos = temp;

      var currentPos = buttonPos[0];
      //console.log(currentPos);
      //check for each button, if the user has pressed the correct button
      if(currentPos[2] >= 0 - epsilon && currentPos[2] <= 0 + epsilon) {
        // console.log("time since start: " + timeSinceStartSec);
        // console.log("button time e: " + buttonTimes[0]);
        
        var letter = buttonType[0];
        if(letter == 'A') {
          console.log("letter pu: A + time " + timeSinceStartSec);
          if(downA) {
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'S') {
          console.log("letter pu: S + time " + timeSinceStartSec);
          if(downS) {
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'D') {
          console.log("letter pu: D + time " + timeSinceStartSec);
          if(downD) {
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'F') {
          console.log("letter pu: F + time " + timeSinceStartSec);
          if(downF) {
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'J') {
          console.log("letter pu: J + time " + timeSinceStartSec);
          if(downJ) {
            console.log("point: " + points);
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'K') {
          console.log("letter pu: K + time " + timeSinceStartSec);
          if(downK) {
            console.log("point: " + points);
            points++;
          } else {
            health--;
          }
        } 
        if(letter == 'L') {
          console.log("letter pu: L + time " + timeSinceStartSec);
          if(downL) {
            console.log("point: " + points);
            points++;
          } else {
            health--;
          }
        } 
        if(letter == ';') {
          if(downP) {
            console.log("letter pu: ; + time " + timeSinceStartSec);
            points++;
          } else {
            health--;
          }
        }
        
        document.getElementById("health").innerHTML = "Health: " + health;
        document.getElementById("points").innerHTML = "Score: " + points;

        if(health <= 0) {
          console.log("health IS zero");
          document.getElementById("game").innerHTML = "YOU LOSE!";
          startGame = false;
          JukeBox.close();
        }

        //remove first element
        buttonType.shift();
        buttonPos.shift();
      }

      //  //current easy buttons
      if (controls.Difficulty == "easy") {
        if (downS) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonS]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonS]);
        }
        if (downD) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonD]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonD]);
        }

        if (downF) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonF]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonF]);
        }

        if (downJ) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonJ]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonJ]);
        }

        if (downK) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonK]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonK]);
        }

        if (downL) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonL]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonL]);
        }
      } else if (controls.Difficulty == "hard") {
        if (downA) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonA]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonA]);
        }
        if (downS) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonS]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonS]);
        }
        if (downD) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonD]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonD]);
        }

        if (downF) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonF]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonF]);
        }

        if (downJ) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonJ]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonJ]);
        }

        if (downK) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonK]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonK]);
        }

        if (downL) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonL]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonL]);
        }  
        
        if (downP) {
          button_lambert.setPressed(1);
          renderer.render(camera, button_lambert, [buttonP]);
        } else {
          button_lambert.setPressed(0);
          renderer.render(camera, button_lambert, [buttonP]);
        }
      }

      //render track
      base_color = vec4.fromValues(65 / 255, 105 / 255, 225 / 255, 1);
      track_lambert.setTime(count);
      track_lambert.setGeometryColor(base_color);
      renderer.render(camera, track_lambert, [track]);
    }
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  //listen to key press
  window.addEventListener('keydown', keyPressed, false);
  window.addEventListener('keyup', keyReleased, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();

function keyReleased(event: KeyboardEvent) {
  console.log("key released");
  console.log("key released" + event.keyCode);
  switch (event.keyCode) {
    case 65:
      //A
      downA = false;
      break;
    case 83:
      //S
      downS = false;
      break;
    case 68:
      //D
      downD = false;
      break;
    case 70:
      //F
      downF = false;
      break;
    case 74:
      //J
      downJ = false;
      break;
    case 75:
      //K
      downK = false;
      break;
    case 76:
      //L
      downL = false;
      break;
    case 186:
      //;
      downP = false;
      break;
  }
}

function keyPressed(event: KeyboardEvent) {
  console.log("key pressed");
  console.log("key pressed" + event.keyCode);
  switch (event.keyCode) {
    case 65:
      //A
      downA = true;
      break;
    case 83:
      //S
      downS = true;
      break;
    case 68:
      //D
      downD = true;
      break;
    case 70:
      //F
      downF = true;
      break;
    case 74:
      //J
      downJ = true;
      break;
    case 75:
      //K
      downK = true;
      break;
    case 76:
      //L
      downL = true;
      break;
    case 186:
      //;
      downP = true;
      break;
    case 32:
      //space bar
      //pause
      startGame = false;
      break;
    case 86:
      if(play == 0) {
        play_music();
        parseJSON();
        console.log("load track create");
        loadTrack();
        for(let button of buttons) {
          console.log("track record:" + button.letter);
        }
      } 

      if(controls.Difficulty == "easy") {
        epsilon = 1.5;
      }
      else if(controls.Difficulty == "hard") {
        epsilon = 1.2;
      }
      
      //display status
      document.getElementById("game").innerHTML = "In progress: " + controls.Song;
      document.getElementById("health").innerHTML = "Health: " + health;
      document.getElementById("points").innerHTML = "Score: " + points;
      
      var d = Date.now();
      startTime = d;
      console.log("start Time " + startTime);

      play++;
      document.getElementById('visualizerInfo').style.visibility = "hidden";
      startGame = true;
      break;
  }
}

