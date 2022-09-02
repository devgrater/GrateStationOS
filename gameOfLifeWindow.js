class GameOfLifeWindow extends GsWindow{
  
    onWindowReady(){
        //create grids, game of life.
        this.cellSize = 10;
        this.timeUntilNextStep = 0;
        this.stepTime = 0.1;
        this.cellCountX = floor(this.sizeX / this.cellSize);
        this.cellCountY = floor(this.sizeY / this.cellSize);
        //two buffers, flattened.
        this.isHoldingMouse = false;
        this.toggleMode = 0;
        this.isPaused = false;
        this.initializeGolBuffer(this.cellCountX, this.cellCountY);
        this.golBuffer = createGraphics(this.cellCountX, this.cellCountY); //alter this directly:
        this.golBuffer.loadPixels();
        for(let i = 0; i < this.cellCountX * this.cellCountY * 4; i++){
                this.golBuffer.pixels[i] = i % 4 === 3? 255 : 0;
        }
        this.golBuffer.updatePixels();
        this.cellGridBuffer = createGraphics(this.sizeX, this.sizeY);
        this.cellGridBuffer.background(255);
            this.cellGridBuffer.push();
            this.cellGridBuffer.stroke(0);
            this.cellGridBuffer.strokeWeight(7);
                for(let i = 0; i <= this.cellCountX; i++){
                    let lineXPos = i * this.cellSize;
                    this.cellGridBuffer.line(lineXPos, 0, lineXPos, this.sizeY);
                }
                for(let i = 0; i <= this.cellCountY; i++){
                    let lineYPos = i * this.cellSize;
                    this.cellGridBuffer.line(0, lineYPos, this.sizeX, lineYPos);
                }
            this.cellGridBuffer.pop();

        //this.glintRange = 100;
        //this.cellGridBuffer = createGraphics(this.glintRange, this.glintRange);
    }
    
    initializeGolBuffer(ccx, ccy){
        this.bufferA = [];
        this.bufferB = [];
        this.neutrientBuffer = [];
        for(let i = 0; i < ccx; i++){
            for(let j = 0; j < ccy; j++){
                let gridValue = random() > 0.5? 1 : 0;
                this.bufferA.push(gridValue);
                this.bufferB.push(gridValue);
                this.neutrientBuffer.push(0);
                //everytime a cell dies, add 2 neutrient to all neighbours and itself
                //6 neutrient creates a new life
            }
        }
    }

    redrawGolCel(ccx, ccy){
        this.golBuffer.loadPixels();
        for(let i = 0; i < ccx; i++){
            for(let j = 0; j < ccy; j++){
                //this.golBuffer[]
                //let currentNeutrientVal = this.getCellValue(i, j, ccx, ccy, this.neutrientBuffer);
                /*let currentCelval = this.getCellValue(i, j, ccx, ccy, this.bufferA);

                this.drawGolCel(i, j, currentCelval, 0, 0, currentNeutrientVal);*/
                let index = (i + j * ccx);
                let neutrientVal = this.neutrientBuffer[index];
                this.setGolPixel(index, neutrientVal / 16);
            }
        }
        this.golBuffer.updatePixels();
    }

    setGolPixel(index, nval){

        let rindex = index * 4;
        this.golBuffer.pixels[rindex    ] = nval * themeStyle.secondaryColor[0];
        this.golBuffer.pixels[rindex + 1] = nval * themeStyle.secondaryColor[1];
        this.golBuffer.pixels[rindex + 2] = nval * themeStyle.secondaryColor[2];
        //this.golBuffer.pixels[rindex * 3] = 1;
    }

    update(dt){
        super.update(dt);
        if(!this.isPaused){
            this.timeUntilNextStep -= dt;
            if(this.timeUntilNextStep < 0){
                this.updateGolCel(this.cellCountX, this.cellCountY);
                this.timeUntilNextStep = this.stepTime;
            }
        }

    }

    updateGolCel(ccx, ccy){
        for(let i = 0; i < 10; i++){
            let rx = random(0, ccx);
            let ry = random(0, ccy);
            let index = floor(ry * ccx + rx);
            this.bufferA[index] = 1;
        }

        //how?
        //for each grid...
        for(let i = 0; i < ccx; i++){
            for(let j = 0; j < ccy; j++){

                //check neutrients from last round:
                //if a life is born, the neutrient is all removed.


                let cellVal = 0;
                let currentCelval = 0;
                for(let ox = -1; ox <= 1; ox++){
                    for(let oy = -1; oy <= 1; oy++){
                        if(ox === 0 && oy === 0){
                            currentCelval = this.getCellValue(i, j, ccx, ccy, this.bufferA);
                        }
                        else{
                            cellVal += this.getCellValue(i + ox, j + oy, ccx, ccy, this.bufferA);
                        }
                    }
                }

                
                
                let isNewLife = 0;
                let isNewDead = 0;
                if(currentCelval === 1){
                    if(cellVal === 2 || cellVal === 3){
                        currentCelval = 1;
                    }  
                    else{
                        currentCelval = 0;
                        isNewDead = 1;
                    }
                }
                else{
                    if(cellVal === 3){
                        currentCelval = 1;
                        isNewLife = 1;
                    }
                    else{
                        currentCelval = 0;
                    }
                }


                //chemtrail:
                if(isNewDead === 1){
                    for(let ox = -1; ox <= 1; ox++){
                        for(let oy = -1; oy <= 1; oy++){
                            let increment = 1;
                            //if(ox === 0) increment += 1;
                            //if(oy === 0) increment += 1;
                            this.addToNeighbourBuffer(i + ox, j + oy, ccx, ccy, this.neutrientBuffer, increment);
                        }
                    }
                }


                //write to grid b:
                let cellIndex = j * ccx + i;
                this.bufferB[cellIndex] = currentCelval;

            }
        }

        this.golBuffer.loadPixels();
        for(let i = 0; i < ccx; i++) {
            for (let j = 0; j < ccy; j++) {
                let currentNeutrient = this.getCellValue(i, j, ccx, ccy, this.neutrientBuffer);
                currentNeutrient -= 1;

                currentNeutrient = constrain(currentNeutrient, 0, 16);
                let neutrientNormalized = currentNeutrient / 16;
                let cellIndex = j * ccx + i;
                this.neutrientBuffer[cellIndex] = currentNeutrient;
                //this.drawGolCel(i, j, currentNeutrient);
                this.setGolPixel(cellIndex, neutrientNormalized);
            }
        }
        this.golBuffer.updatePixels();
        //swap ab:
        let temp = this.bufferA;
        this.bufferA = this.bufferB;
        this.bufferB = temp;
    }
    
    getCellValue(posX, posY, ccx, ccy, buff){
        if(posX < 0 || posY < 0 || posX >= ccx || posY >= ccy){
            return 0;
        }
        else{
            let cellIndex = posY * ccx + posX;
            return buff[cellIndex];
        }
    }

    addToNeighbourBuffer(posX, posY, ccx, ccy, buff, val){
        if(posX < 0 || posY < 0 || posX >= ccx || posY >= ccy){
            return;
        }
        else{
            let cellIndex = posY * ccx + posX;
            buff[cellIndex] = buff[cellIndex] + val;
        }
    }

    onMouseDownWindow(mx, my, pressedButton){
        let relativeMouse = this.getPositionRelativeToWindow(mx, my);
        let gridIndex = this.getMouseCurrentIndex(relativeMouse.x, relativeMouse.y);
        if(pressedButton == RIGHT){
            //this.updateGolCel(this.cellCountX, this.cellCountY);
            this.isPaused = !this.isPaused;
        }
        else{
            if(gridIndex >= 0){
                let currentValue = this.bufferA[gridIndex];
                this.toggleMode = currentValue === 0? 1 : 0;
                this.isHoldingMouse = true;
                
            }
        }

        
    }
  
    //mouse x relative, mouse y relative
    getMouseCurrentIndex(mxr, myr){
        if(mxr < 0 || myr < 0 || mxr >= this.sizeX || myr >= this.sizeY) return -1;
        let gridX = floor(mxr / this.cellSize);
        let gridY = floor(myr / this.cellSize);
        //toggle the value!
        let gridIndex = gridY * this.cellCountX + gridX;
        
        return gridIndex;//let currentValue = this.bufferA[gridIndex];
    }

    onMouseUpWindow(mx, my, pressedButton){
        this.isHoldingMouse = false;
    }

    //relative coordinates:
    onMouseMoveWindow(mx, my){
        if(this.isHoldingMouse){
            let relativeMouse = this.getPositionRelativeToWindow(mx, my);
            let mouseIndex = this.getMouseCurrentIndex(relativeMouse.x, relativeMouse.y);
            if(mouseIndex > 0){
                this.bufferA[mouseIndex] = this.toggleMode;
                this.redrawGolCel(this.cellCountX, this.cellCountY);
            }
        }
    }

    drawWindowContent(dt){
        //this.buffer.push();
        this.buffer.blendMode(BLEND);
        this.buffer.background(0);
        //this.buffer.image(this.golBuffer, 0, 0, this.sizeX, this.sizeY);
        this.buffer.image(this.golBuffer, 0, 0, this.sizeX, this.sizeY);
        this.buffer.blendMode(MULTIPLY);
        this.buffer.image(this.cellGridBuffer, 0, 0, this.sizeX, this.sizeY);
        //this.buffer.background(0);
        //this.drawGolCel(this.cellCountX, this.cellCountY);
        //image(this.buffer, 0, 0, this.sizeX, this.sizeY);
        this.renderBuffer();
    }
  }
  