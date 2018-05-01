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

import Button from './Button';

import { analyze } from 'web-audio-beat-detector';

// analyze(framework.audioSourceBuffer.buffer).then((bpm) => {
//   // the bpm could be analyzed 
//   framework.songBPM = bpm;
// })
// .catch((err) => {
//   // something went wrong 
//   console.log("couldn't detect BPM");
// });

//global dead line
let checkLine1 : number;
let checkLine2 : number;

const parseJson = require('parse-json');
let jsonFile: string; //jsonFile name

//list of buttons to create
let buttons = Array<Button>();

let points = 0;
let health = 100;
let startTime = 0;
let epsilon = 0.5;

let startTick = 0;
let endTick = 0;
let tickFrame = 0;

let keyBoard = Array<Mesh>();
let track: Track;
let gameDiff: string;
let startGame = false;
let loaded = false;
let parse = false;

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
  var musicPath = './src/resources/music/mp3/' + musicStr + '.mp3';

  fetch(musicPath)
    .then(r => r.arrayBuffer())
    .then(b => JukeBox.decodeAudioData(b))
    .then(data => {
      const audio_buf = JukeBox.createBufferSource();
      audio_buf.buffer = data;
      audio_buf.loop = false;
      audio_buf.connect(JukeBox.destination);
      audio_buf.start(0);
    });

  console.log(`Music On!` + musicStr);
}

function loadScene() {
  //Mario 
  marioString = readTextFile('./src/resources/obj/wahoo.obj');
  mario = new Mesh(marioString, vec3.fromValues(0, 0, 0));
  mario.translateVertices(vec3.fromValues(0, -5, -20));
  mario.create();

  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
}

function loadButtonsEasy() {
  buttonSstr = readTextFile('./src/resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./src/resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./src/resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./src/resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./src/resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./src/resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  keyBoard.push(buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL);
}

function loadButtonsHard() {
  buttonAstr = readTextFile('./src/resources/obj/button.obj');
  buttonA = new Mesh(buttonAstr, vec3.fromValues(0, 0, 0));
  buttonA.translateVertices(vec3.fromValues(-9.5, 0, 0));
  buttonA.create();

  buttonSstr = readTextFile('./src/resources/obj/button.obj');
  buttonS = new Mesh(buttonSstr, vec3.fromValues(0, 0, 0));
  buttonS.translateVertices(vec3.fromValues(-7, 0, 0));
  buttonS.create();

  buttonDstr = readTextFile('./src/resources/obj/button.obj');
  buttonD = new Mesh(buttonDstr, vec3.fromValues(0, 0, 0));
  buttonD.translateVertices(vec3.fromValues(-4.5, 0, 0));
  buttonD.create();

  buttonFstr = readTextFile('./src/resources/obj/button.obj');
  buttonF = new Mesh(buttonFstr, vec3.fromValues(0, 0, 0));
  buttonF.translateVertices(vec3.fromValues(-2, 0, 0));
  buttonF.create();

  buttonJstr = readTextFile('./src/resources/obj/button.obj');
  buttonJ = new Mesh(buttonJstr, vec3.fromValues(0, 0, 0));
  buttonJ.translateVertices(vec3.fromValues(2, 0, 0));
  buttonJ.create();

  buttonKstr = readTextFile('./src/resources/obj/button.obj');
  buttonK = new Mesh(buttonKstr, vec3.fromValues(0, 0, 0));
  buttonK.translateVertices(vec3.fromValues(4.5, 0, 0));
  buttonK.create();

  buttonLstr = readTextFile('./src/resources/obj/button.obj');
  buttonL = new Mesh(buttonLstr, vec3.fromValues(0, 0, 0));
  buttonL.translateVertices(vec3.fromValues(7, 0, 0));
  buttonL.create();

  buttonPstr = readTextFile('./src/resources/obj/button.obj');
  buttonP = new Mesh(buttonPstr, vec3.fromValues(0, 0, 0));
  buttonP.translateVertices(vec3.fromValues(9.5, 0, 0));
  buttonP.create();

  keyBoard.push(buttonA, buttonS, buttonD, buttonF, buttonJ, buttonK, buttonL, buttonP);
}

//read the JSON file determined by the user
//currntly doing a test midi json
async function parseJSON() {
  var musicStr = controls.Song;
  if (musicStr == 'Connect-Goofy') {
    musicStr = "Connect";
  }
  const musicPath = './src/resources/music/json/' + musicStr + '.json';

  try {
    const fetchResult = fetch(musicPath);
    const response = await fetchResult;
    const jsonData = await response.json();
    parseAfterReading(jsonData);
  } catch (e) {
    throw Error(e);
  }

  // fetch(musicPath)
  // .then(response => response.json())
  // .then(jsonResponse => parseAfterReading(jsonResponse));
}

function parseAfterReading(json: JSON) {
  if (controls.Difficulty == 'easy') {
    parseTracksEasy(json);
  } else if (controls.Difficulty == 'hard') {
    parseTracksHard(json);
  }

  // console.log("buttons: " + buttons.length);
  // console.log("parse" + buttons.length);
  buttons.sort(function (a: any, b: any) {
    return a.getTime() - b.getTime();
  });

  //create track mesh
  loadTrack();
  console.log("load track create");
}

//easy version
function parseTracksEasy(json: JSON) {
  //tracks are in an array
  var json2 = JSON.parse(JSON.stringify(json));
  var length = parseInt(JSON.stringify(json2.tracks.length));
  console.log("length: " + length);
  for (let i = 0; i < length; i++) {
    //track's notes are in an array
    var oneTrack = json2.tracks[i];
    let notes = oneTrack["notes"];
    var noteLength = parseInt(JSON.stringify(notes.length));
    console.log("LENGTH OF NOTES: " + noteLength);
    //if the track has notes to be played
    if (noteLength > 0) {
      var currTime = 0;
      for (let note of notes) {
        var number = parseFloat(JSON.stringify(note.midi));
        var time = parseFloat(JSON.stringify(note.time));
        var deltaTime = time - currTime;
        currTime = time;

        // console.log("time " + time);
        // console.log("dtime " + deltaTime);
        // console.log("midi " + number);

        //connect - 0.35
        //run - 0.25
        //if the time difference between one note and the other is :
        if (deltaTime > 0.5) {
          var b;
          if (number > 0 && number < 55) {
            b = new Button("S", time);
          } else if (number > 55 && number < 65) {
            b = new Button("D", time);
          } else if (number > 65 && number < 70) {
            b = new Button("F", time);
          } else if (number > 70 && number < 75) {
            b = new Button("J", time);
          } else if (number > 75 && number < 83) {
            b = new Button("K", time);
          } else if (number > 83 && number < 127) {
            b = new Button("L", time);
          }
          buttons.push(b);
        }
      }
    }
  }
}

//hard version
function parseTracksHard(json: JSON) {
  //tracks are in an array
  var json2 = JSON.parse(JSON.stringify(json));
  var length = parseInt(JSON.stringify(json2.tracks.length));
  console.log("length: " + length);
  for (let i = 0; i < length; i++) {
    //track's notes are in an array
    var oneTrack = json2.tracks[i];
    let notes = oneTrack["notes"];
    var noteLength = parseInt(JSON.stringify(notes.length));
    console.log("LENGTH OF NOTES: " + noteLength);
    //if the track has notes to be played
    if (noteLength > 0) {
      var currTime = 0;
      for (let note of notes) {
        var number = parseFloat(JSON.stringify(note.midi));
        var time = parseFloat(JSON.stringify(note.time));
        var deltaTime = time - currTime;
        currTime = time;

        console.log("time " + time);
        console.log("dtime " + deltaTime);
        console.log("midi " + number);

        //for buttons that happen 0.3
        //connect - 0.35
        //run - 0.25
        var max = 3;
        var min = -3;
        var rand = Math.random() * (max - min) + min;
        if (deltaTime > 0.5) {
          var b;
          if (number > 0 + rand && number < 66 + rand) {
            b = new Button("A", time);
          } else if (number > 66 + rand && number < 69 + rand) {
            b = new Button("S", time);
          } else if (number > 69 + rand && number < 73 + rand) {
            b = new Button("D", time);
          } else if (number > 73 + rand && number < 77 + rand) {
            b = new Button("F", time);
          } else if (number > 77 + rand && number < 79 + rand) {
            b = new Button("J", time);
          } else if (number > 79 + rand && number < 82 + rand) {
            b = new Button("K", time);
          } else if (number > 82 + rand && number < 85 + rand) {
            b = new Button("L", time);
          } else if (number > 85 + rand && number < 127) {
            b = new Button(";", time);
          }
          buttons.push(b);
        }
      }
    }
  }
}

function loadTrack() {
  //track 
  track = new Track(vec3.fromValues(0, 0, 0));
  if (controls.Difficulty == "easy") {
    loadTrackEasy();
    //loadInitialPositionsEasy();
    //loadOnly10Easy();
  } else if (controls.Difficulty == "hard") {
    loadTrackHard();
    //loadInitialPositionsHard();
    //loadOnly10Hard();
  }
  track.create();
  console.log("length of track pos: " + track.pos.length);
}

function loadTrackEasy() {
  //console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -2;
    // console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0, 0, 0);

    console.log("button: " + letter);

    if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    }

    button.translateVertices(pos); //translate button mesh
    one.setPosition(pos); //translate the button object

    track.addMesh(button); //add the mesh button to the track
  }
}

function loadTrackHard() {
  // console.log("buttons: " + buttons.length);
  //since you have a list of buttons, lets create them all at once
  //the user will travel forward on the line
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -2;

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    //connect = 
    //bts run = -5
    var pos = vec3.fromValues(0, 0, 0);

    if (letter == 'A') {
      pos = vec3.fromValues(-9.5, 0, time * spacing);
    } else if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    } else if (letter == ';') {
      pos = vec3.fromValues(9.5, 0, time * spacing);
    }

    button.translateVertices(pos);
    one.setPosition(pos);

    track.addMesh(button);
  }
}

function loadInitialPositionsEasy() {
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;
    console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0, 0, 0);
    if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    }

    button.translateVertices(pos);
    one.setPosition(pos);

    console.log("set positions initally: " + pos);

    //track.addMesh(button);
  }
}

function loadOnly10Easy() {
  track = new Track(vec3.fromValues(0, 0, 0));
  //from the list of buttons
  //only load 10 onto the track
  //update each time
  for (var i = 0; i < 10; i++) {
    var currButt = buttons[i];
    // var letter = currButt.getLetter();
    //console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = currButt.getPosition();
    button.translateVertices(pos);
    buttons[i].setPosition(pos);

    // console.log("get time: " + i + " " + currButt.getTime());
    // console.log("set positions: " + i  + " " + pos);

    track.addMesh(button);
  }
}

function loadInitialPositionsHard() {
  //set the initial position of the buttons
  for (let one of buttons) {
    var letter = one.getLetter();
    var time = one.getTime();
    var spacing = -1;

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = vec3.fromValues(0, 0, 0);

    if (letter == 'A') {
      pos = vec3.fromValues(-9.5, 0, time * spacing);
    } else if (letter == 'S') {
      pos = vec3.fromValues(-7, 0, time * spacing);
    } else if (letter == 'D') {
      pos = vec3.fromValues(-4.5, 0, time * spacing);
    } else if (letter == 'F') {
      pos = vec3.fromValues(-2, 0, time * spacing);
    } else if (letter == 'J') {
      pos = vec3.fromValues(2, 0, time * spacing);
    } else if (letter == 'K') {
      pos = vec3.fromValues(4.5, 0, time * spacing);
    } else if (letter == 'L') {
      pos = vec3.fromValues(7, 0, time * spacing);
    } else if (letter == ';') {
      pos = vec3.fromValues(9.5, 0, time * spacing);
    }

    button.translateVertices(pos);
    one.setPosition(pos);
    // console.log("set positions initally: " + pos);
    // track.addMesh(button);
  }
}

function loadOnly10Hard() {
  track = new Track(vec3.fromValues(0, 0, 0));
  //from the list of buttons
  //only load 10 onto the track
  for (var i = 0; i < 10; i++) {
    var currButt = buttons[i];
    // var letter = currButt.getLetter();
    // console.log("parse letters to make into:" + letter);

    let buttonStr = readTextFile('./src/resources/obj/button.obj');
    let button = new Mesh(buttonStr, vec3.fromValues(0, 0, 0));

    var pos = currButt.getPosition();
    button.translateVertices(pos);

    //console.log("set positions initally: " + pos);
    track.addMesh(button);
  }
}

function main() {
  //debugger;
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

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
    startTick = Date.now();

    var timeRightNow = Date.now();
    var timeSinceStart = timeRightNow - startTime;
    var timeSinceStartSec = timeSinceStart / 1000;
    //console.log("time counting: " + timeSinceStartSec);

    if (!startGame && controls.Difficulty == "easy") {
      // console.log("load easy mesh buttons");
      //load easy mesh buttons
      loadButtonsEasy();
      loaded = true;
    } else if (!startGame && controls.Difficulty == "hard") {
      //load 
      // console.log("load hard mesh buttons");
      loadButtonsHard();
      loaded = true;
    }

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
    if (!startGame && controls.Difficulty == "easy") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL]);
    } else if (!startGame && controls.Difficulty == "hard") {
      button_lambert.setGeometryColor(base_color);
      renderer.render(camera, button_lambert, [buttonA, buttonS, buttonD, buttonF, buttonK, buttonJ, buttonL, buttonP]);
    }

    //user starts game
    if (startGame && buttons.length > 100) {
      //render track
      base_color = vec4.fromValues(65 / 255, 105 / 255, 225 / 255, 1);
      track_lambert.setGeometryColor(base_color);
      renderer.render(camera, track_lambert, [track]);

      //calculate the buttons positions as the track moves across
      //with time since start
      var rate = 2.0;
      var time = timeSinceStartSec;
      var distance = time * rate;

      //calculate distance with dT
      // var rate2 = 0.009;
      // time = tickFrame;
      // var distance2 = time * rate2;
      // console.log("distance: " + distance2 + " " + distance);

      //update the position of all buttons
      // for (let button of buttons) {
      //   var originalPos = button.getPosition();
      //   var newPos = vec3.fromValues(originalPos[0], originalPos[1], originalPos[2] + distance2);
      //   button.setPosition(newPos);
      //   //console.log("new Positions: " + newPos);
      // }
      track_lambert.setTime(distance);
      //translate the track
      //track.translateVertices(vec3.fromValues(0, 0, 1));

      //reload the track
      // if(controls.Difficulty == 'easy') {
      //   loadOnly10Easy();
      // } else {
      //   loadOnly10Hard();
      // }

      for (var i = 0; i < 5; i++) {
        var curr = buttons[i];
        var time = curr.getTime();
       // console.log("time Z " + time + " position " + curr.getPosition());
        var checkTime1 = timeSinceStartSec - epsilon;
        var checkTime2 = timeSinceStartSec + epsilon;
        if (time >= checkTime1 && time <= checkTime2) {
          //var position = curr.getPosition();
          //var checkPosZ = position[2];
          //console.log("position Z " + checkPosZ );
         // console.log("check this position mark: " + checkLine1 + " " + checkLine2);
          //console.log("button position: " + position + " button time: " + time + " check this time mark: " + checkTime1 + " " + checkTime2);
          // if (checkPosZ >= checkLine1 && checkPosZ <= checkLine2) {
            // console.log("new: " + position[2]);
            // console.log("a button passed z: " + position + " " + letter);
            var letter = curr.getLetter(); 
            //console.log("letter that passed: " + letter + " pos: " + position + " time: " + time);
            if (letter == 'A') {
              if (downA) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'S') {
              if (downS) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'D') {
              if (downD) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'F') {
              if (downF) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'J') {
              if (downJ) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'K') {
              if (downK) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == 'L') {
              if (downL) {
                points++;
              } else {
                health--;
              }
            }
            if (letter == ';') {
              if (downP) {
                points++;
              } else {
                health--;
              }
            }

            document.getElementById("health").innerHTML = "Health: " + health;
            document.getElementById("points").innerHTML = "Score: " + points;

            if (health <= 0) {
              console.log("health IS zero");
              document.getElementById("game").innerHTML = "YOU LOSE!";
              startGame = false;
              JukeBox.close();
            }
            buttons.shift();
          }
      //  }
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
    }

    stats.end();
    endTick = Date.now();
    tickFrame = endTick - startTick;
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
      if (play == 0) {
        window.setTimeout(parseJSON(), 100000);
        //parseJSON();
        //start music
        window.setTimeout(play_music(), 5000);
        //parse JSON file

        if (controls.Difficulty == "easy") {
          epsilon = .2;
        }
        else if (controls.Difficulty == "hard") {
          epsilon = .2;
        }
  
        checkLine1 = 0 - epsilon;
        checkLine2 = 0 + epsilon;
        
        var d = Date.now();
        startTime = d;
        startGame = true;

      //display status
      document.getElementById("game").innerHTML = "In progress: " + controls.Song;
      document.getElementById("health").innerHTML = "Health: " + health;
      document.getElementById("points").innerHTML = "Score: " + points;
      }

      document.getElementById('visualizerInfo').style.visibility = "hidden";

      play++;

      break;
  }
}

