let wm = new WindowManager();
let system = new SystemManager();
//red theme
/*
const themeStyle = {
  windowColor: [255, 0, 0],
  headbarTextColor: [0, 0, 0],
  accentColor: [255, 0, 0],
  primaryColor: [208, 0, 0],
  secondaryColor: [192, 0, 0],
  tertiaryColor: [128, 0, 0],
  quaternaryColor: [96, 0, 0],
  fifthColor: [64, 0, 0],
  backgroundColor: [0, 0, 0],
  minUnit: [16, 0, 0],
  colorRatio: [1, 0, 0]//minimal unit
}*/

//green theme:

const themeStyle = {
  windowColor: [0, 255, 0],
  headbarTextColor: [0, 0, 0],
  accentColor: [0, 255, 0],
  primaryColor: [0, 208, 0],
  secondaryColor: [0, 192, 0],
  tertiaryColor: [128, 128, 0],
  quaternaryColor: [0, 96, 0],
  fifthColor: [0, 64, 0],
  backgroundColor: [0, 0, 0],
  minUnit: [0, 16, 0],
  colorRatio: [0, 1, 0]//minimal unit
}

let applications = [];
let font = null;
function preload(){

  font = loadFont("assets/consola.ttf");
  let template = new NeofetchWindow("GrateStation OS v1.0", 831, 258, 240, 120);
  let tw = new FileDecryptWindow("Test Window", 669, 477, 280, 240);
  let gol = new GameOfLifeWindow("ChemTr4il Analyzer", 942, 749, 480, 240);
  let call = new IncomingCallWindow("Caller ID", 1004, 472, 360, 240);
  let cube3d = new Random3DObjectWindow("3D Cube", 1318, 515, 240, 320)
  let dvdPlayer = new DvdPlayerWindow("Insert DVD...", 1203, 200, 480, 240);
  let doom3d = new SomeRandomGameWindow("BOOP", 1614, 312, 320, 240)
  applications.push(template);
  applications.push(tw);
  applications.push(gol);
  applications.push(call);
  applications.push(cube3d);
  applications.push(dvdPlayer);
  applications.push(doom3d);
}

function setup() {
  system.setWindowDimensions(windowWidth, windowHeight);
  system.initialize();

  textFont(font);
  //change the following to a for loop instead:
  for(let i = 0; i < applications.length; i++){
    let app = applications[i];
    wm.startWindowInstance(app);
  }
}


function draw() {
  system.refreshScreen();
  wm.renderAllWindows(deltaTime * 0.001);
  wm.onMouseMoved(mouseX, mouseY, pmouseX, pmouseY);
}

function mousePressed(){
  wm.onMousePressed(mouseX, mouseY, mouseButton);
}

function mouseReleased(){
  wm.onMouseReleased(mouseX, mouseY, mouseButton);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}