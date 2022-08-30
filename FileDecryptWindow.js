class FileDecryptWindow extends GsWindow{
  
  onWindowReady(){
    this.startNewRandomTask();
    this.decryptWindowHeight = 80; //half height
    this.decryptWindowWidth = 280;
  }
  
  generateRandomFileName(fileLength){
    const charset = "0123456789_ABCDEF-abcdef";
    const filetype = ["tar", "gz", "xar", "vtec", "dec", "tga", "exr", "mp4", "exe", "md", "bin", "dxc", "dll", "pak", "dtf"];
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
    this.filename = this.generateRandomFileName(random(3, 7));
    //generate new taskbit:
    this.generateTaskBits();
  }

  generateTaskInfo(){
    this.taskTimeElapsed = 0;
    this.timeElapsedSinceLastJob = 0;
    this.taskTimeRequired = random(1, 7);
    this.chanceToStuck = random() * 0.6; //cant stuck for too long!
  }

  updateTitle(filename){
    //also, just add a small progress indicator...
    
    let title = "Decrypting " + filename + " (" + floor(this.progress * 100) + "%, Pass " + (this.passesDone + 1) + "/" + floor(this.passes) + ")";
    //truncate extra:
    this.title = title;
  }

  
  generateTaskBits(){
    //bunch of random hex
    //each having a weight of how much has been done
    const hexInfo = "0123456789ABCDEF";
    //generate a string...
    this.taskBits = [];
    this.progressNeeded = [];
    this.corruption = [];
    for(let i = 0; i < 32; i++){ //4 By 8 Grid, each grid containing 4 hex codes
      let taskByte = "";
      let offset = [];
      let progress = random();
      for(let j = 0; j < 4; j++){
        taskByte += hexInfo.charAt(random(0, hexInfo.length));
        if(random() > 0.2){
          offset.push(((progress * 15 + random()) / 16) * 0.95);
        }
        else{
          offset.push(random() * 0.95); //random error
        }
      }
      this.taskBits.push(taskByte);
      this.progressNeeded.push(offset);
      this.corruption.push(1.0);
    }
  }

  corruptTaskBits(){
    const hexInfo = "0123456789ABCDEF";
    for(let i = 0; i < 32; i++){ //4 By 8 Grid, each grid containing 4 hex codes
      if(random() < 0.3){
        let offset = [];
        let taskByte = "";
        for(let j = 0; j < 4; j++){
          //if its corrupted
          if(random() < 0.5){
            taskByte += hexInfo.charAt(random(0, hexInfo.length));
            offset.push(random() * 0.95 + this.passesDone);
            //taskByte += hexInfo.charAt(random(0, hexInfo.length));
          }
          else{
            taskByte += this.taskBits[i][j];
            offset.push(this.progressNeeded[i][j]);
            //taskByte += hexInfo.charAt(random(0, hexInfo.length));
          }

        }
        this.taskBits[i] = taskByte;
        this.progressNeeded[i] = offset;
        this.corruption[i] = random();
      }
      else{
        this.corruption[i] = 1.0;
      }
    }
  }


  updateTaskProgress(dt){
    let progress = this.taskTimeElapsed / this.taskTimeRequired;
    progress = constrain(progress, 0, 1);
    this.progress = progress;
    this.unclampedProgress = progress + this.passesDone;
    let stuckMeter = noise(this.lifespan);
    this.timeElapsedSinceLastJob += dt;
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
        this.corruptTaskBits();
      }
    }
  }
  
  drawDecryptionWindow(){
    this.buffer.push();
      this.buffer.textFont("consolas");
      this.buffer.fill(255, 0, 0);
      this.buffer.textSize(12);
      this.buffer.textAlign("center", "center");        
      this.buffer.textStyle(BOLD);
      //////////////////////////////////////////
      //          DECRYPTION EFFECT           //
      // _0AF  __0D  D0_A  F_F1               //
      //////////////////////////////////////////
      let gridWidth = this.decryptWindowWidth / 8;
      let gridHeight = this.decryptWindowHeight / 4;
      let timeBegun = this.timeElapsedSinceLastJob; //0.5sec lerp
      let lerpProgress = constrain(timeBegun / 0.5, 0, 1);
      this.buffer.push();
        this.buffer.translate(gridWidth * 0.5, gridHeight * 0.5);
        for(let i = 0; i < 8; i++){ //horizontal
          for(let j = 0; j < 4; j++){
            let xPos = i / 8 * this.decryptWindowWidth;
            let yPos = j / 4 * this.decryptWindowHeight;
            let showedBits = "";
            let index = j * 8 + i;
            let showedCount = 1;
            let levelOfCorruption = this.corruption[index];
            for(let k = 0; k < 4; k++){
              if(this.progressNeeded[index][k] < this.unclampedProgress){
                showedBits += this.taskBits[index].charAt(k);
                showedCount += 1;
              }
              else{
                showedBits += "_";
              }
            }
            if(showedCount == 5){
              this.buffer.push()
              this.buffer.fill(192, 0, 0);
              
              this.buffer.translate(-gridWidth * 0.5, -gridHeight * 0.5);
              this.buffer.rect(xPos, yPos, gridWidth, gridHeight);
              this.buffer.pop();
              this.buffer.fill(0, 0, 0);
            }
            else{
              if(levelOfCorruption < 1.0){
                this.buffer.push()
                this.buffer.fill(lerp(255, 128 * levelOfCorruption, lerpProgress), 0, 0);
                  this.buffer.translate(-gridWidth * 0.5, -gridHeight * 0.5);
                  this.buffer.rect(xPos, yPos, gridWidth, gridHeight);
                this.buffer.pop();
                this.buffer.fill(255, 0, 0);
              }
              else{
                this.buffer.fill(255 * showedCount / 5, 0, 0);
              }
              
            }
            
            this.buffer.text(showedBits, xPos, yPos);
          }
        }
      this.buffer.pop();
  }

  drawDecryptionLog(){

  }

  drawWindowContent(dt){
    this.buffer.background(0);
    //draw task bits:
    //calculate block:
    this.drawDecryptionWindow();
    this.buffer.pop();
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
