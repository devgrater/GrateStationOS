class FileDecryptWindow extends GsWindow{
  
  onWindowReady(){
    this.startNewRandomTask();
  }
  
  generateRandomFileName(fileLength){
    let charset = "0123456789_ABCDEF-abcdef";
    let filetype = ["tar", "gz", "xar", "vtec", "dec", "tga", "exr", "mp4", "exe", "md", "bin", "dxc", "dll", "pak", "dtf"];
    let filename = "";
    for(let i = 0; i < fileLength; i++){
      filename += charset.charAt(random(0, charset.length));
    }
    filename += "." + random(filetype);
    //filename cleanup:
    while(filename.startsWith('_') || filename.startsWith('-')){
      filename = filename.substring(1);
    }

    return filename;
  }

  startNewRandomTask(){
    this.generateTaskInfo();
    this.passes = random(1, 4); //maximum of 3 passes
    this.passesDone = 0;
    this.filename = this.generateRandomFileName(random(6, 12));
  }

  generateTaskInfo(){
    this.taskTimeElapsed = 0;
    this.taskTimeRequired = random(1, 5);
    this.chanceToStuck = random() * 0.6; //cant stuck for too long!
  }

  updateTitle(filename){
    //also, just add a small progress indicator...
    let progress = this.taskTimeElapsed / this.taskTimeRequired;
    progress = constrain(progress, 0, 1);
    progress *= 100;
    this.title = "Decrypting " + filename + "..." + floor(progress) + "% (Pass " + (this.passesDone + 1) + "/" + floor(this.passes) + ")";
    
  }

  updateTaskProgress(dt){
    
    let stuckMeter = noise(this.lifespan);
    if(stuckMeter >= this.chanceToStuck){
      this.taskTimeElapsed += dt;
    }
    this.updateTitle(this.filename);
    this.checkTaskCompleted();
  }

  checkTaskCompleted(){
    //a small random chance to extend the task
    if(this.taskTimeElapsed > this.taskTimeRequired){
      this.passesDone += 1;
      if(this.passesDone >= this.passes - 1){
        //all done!
        this.startNewRandomTask();
      }
      else{
        this.generateTaskInfo();
      }
    }
  }
  
  drawWindowContent(dt){
    this.buffer.background(0);
    image(this.buffer, 0, 0, this.sizeX, this.sizeY);
  }

  update(dt){
    super.update(dt);
    this.updateTaskProgress(dt);
  }
  
  drawNeofetch(){
      this.buffer.push();
      //line(
        this.buffer.textFont("consolas");
        this.buffer.textAlign(CENTER, CENTER);
        this.buffer.fill(255, 0, 0);
        //this.buffer.textStyle(BOLD);
        this.buffer.push();
          this.buffer.textSize(16);
          
          this.buffer.text("GrateStation OS", this.sizeX * 0.5, this.sizeY * 0.5 - 8);
        this.buffer.pop();
        this.buffer.textSize(12);
        this.buffer.text("By DeveloGrater", this.sizeX * 0.5, this.sizeY * 0.5 + 8);
      this.buffer.pop();
    this.buffer.pop();
  }
  
 
}
