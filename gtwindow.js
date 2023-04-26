let wm = new WindowManager();
let system = new SystemManager();
let theme = new ThemeManager();
//red theme
/*const themeStyle = {
  windowColor: [255, 0, 0],
  headbarTextColor: [0, 0, 0],
  accentColor: [255, 0, 0],
  primaryColor: [208, 0, 0],
  secondaryColor: [192, 0, 0],
  tertiaryColor: [128, 128, 0],
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

function setup() {
  textFont("consolas");
  system.setWindowDimensions(windowWidth, windowHeight);
  system.initialize();
  let template = new NeofetchWindow("GrateStation OS v1.0", 512, 512, 240, 120);
  let tw = new FileDecryptWindow("Test Window", 256, 256, 280, 240);
  let gol = new GameOfLifeWindow("ChemTr4il Analyzer", 384, 384, 480, 240);
  let call = new IncomingCallWindow("Caller ID", 840, 320, 360, 240);
  wm.startWindowInstance(template);
  wm.startWindowInstance(gol);
  wm.startWindowInstance(tw);
  wm.startWindowInstance(call);


  
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
