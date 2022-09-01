class GameOfLifeWindow extends GsWindow{
  
    onWindowReady(){
        //create grids, game of life.
        this.cellSize = 10;
        this.timeUntilNextStep = 0;
        this.stepTime = 0.03;
        this.cellCountX = floor(this.sizeX / this.cellSize);
        this.cellCountY = floor(this.sizeY / this.cellSize);
        //two buffers, flattened.
        this.isHoldingMouse = false;
        this.toggleMode = 0;
        this.isPaused = false;
        this.initializeGolBuffer(this.cellCountX, this.cellCountY);
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
        for(let i = 0; i < ccx; i++){
            for(let j = 0; j < ccy; j++){
                let currentCelval = this.getCellValue(i, j, ccx, ccy, this.bufferA);
                let currentNeutrientVal = this.getCellValue(i, j, ccx, ccy, this.neutrientBuffer);
                this.drawGolCel(i, j, currentCelval, 0, 0, currentNeutrientVal);
            }
        }
    }

    drawGolCel(px, py, cellValue, isNewLife, isNewDead, neutrient){
        let cellXPos = px * this.cellSize;
        let cellYPos = py * this.cellSize;
        let neutrientNormalized = neutrient / 16;
        let golFill = neutrientNormalized * 192;
        this.buffer.fill(golFill, 0, 0);
        //this.buffer.stroke((1 - cellValue) * 32 + 64 * isNewDead, 0, 0);
        this.buffer.strokeWeight(0.1);
        this.buffer.rect(cellXPos, cellYPos, this.cellSize, this.cellSize);
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
        for(let i = 0; i < 20; i++){
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

        for(let i = 0; i < ccx; i++) {
            for (let j = 0; j < ccy; j++) {
                let currentNeutrient = this.getCellValue(i, j, ccx, ccy, this.neutrientBuffer);
                currentNeutrient -= 1;

                currentNeutrient = constrain(currentNeutrient, 0, 16);
                let cellIndex = j * ccx + i;
                this.neutrientBuffer[cellIndex] = currentNeutrient;
                this.drawGolCel(i, j, 0, 0, 0, currentNeutrient);

            }
        }
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
        //this.buffer.background(0);
        //this.drawGolCel(this.cellCountX, this.cellCountY);
        //image(this.buffer, 0, 0, this.sizeX, this.sizeY);
        this.renderBuffer();
    }
  }
  