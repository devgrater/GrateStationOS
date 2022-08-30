class FileDecryptWindow extends GsWindow{
  
  onWindowReady(){
    this.filename = this.generateRandomFileName(8);
    this.title = "Decrypting " + this.filename + "...";
  }
  
  generateRandomFileName(fileLength){
    let charset = "0123456789_ABCDEF-abcdef";
    let filetype = ["tar", "gz", "xar", "vtec", "dec", "tga", "exr", "mp4", "exe", "md", "bin", "dxc", "dll", "pak", "dtf"];
    let filename = "";
    for(let i = 0; i < fileLength; i++){
      filename += charset.charAt(random(0, charset.length));
    }
    filename += "." + random(filetype);
    return filename;
  }
  
  drawWindowContent(dt){
    this.buffer.background(0);
    image(this.buffer, 0, 0, this.sizeX, this.sizeY);
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
