class SomeRandomGameWindow extends GsWindow{
    //raycast engine


    onWindowPreload() {
        super.onWindowPreload();
        this.logoImg = loadImage("assets/boop.png");

    }
    onWindowReady() {
        super.onWindowReady();
        this.fov = 60; //sizeX rays over 80 degrees
        //also draw some kind of controls for the player
        //so they dont have to use keyboard
        this.worldMap =
            [
                0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 1, 0,
                1, 0, 0, 0, 0, 1,
                0, 1, 0, 0, 1, 0,
                0, 0, 1, 1, 0, 0
            ];//populate later
        this.hcount = 20;
        this.vcount = 20;
        this.playerPosX = 5;
        this.playerPosY = 5;
        this.playerAngle = 30; //cos theta, -sine theta should return (1, 0)

        this.playerAngleRad = this.playerAngle * 3.1415926 / 180;
        this.fovRad = this.fov * 3.1415926 / 180;
        this.init_worldMap();
        this.spinDir = 1;
    }

    init_worldMap() {

        //scatter random cubes
        this.worldMap = [];
        for (let i = 0; i < this.hcount * this.vcount; i++) {
            this.worldMap.push(0);
        }

        let cubeCount = 100;

        let playerTileX = floor(this.playerPosX);
        let playerTileY = floor(this.playerPosY);
        for (let i = 0; i < cubeCount; i++) {
            let x = floor(random(1, this.hcount - 1));
            let y = floor(random(1, this.vcount - 1));

            if(Math.abs(x - playerTileX) < 2 && Math.abs(y - playerTileY) < 2){
                continue;
            }
            let tile = x + y * this.hcount;
            this.worldMap[tile] = 1;
        }



    }
    
    update(dt){


        let mapX = floor(this.playerPosX);
        let mapY = floor(this.playerPosY);
        let dirX = cos(this.playerAngleRad);
        let dirY = sin(this.playerAngleRad);

        let moveSpeed = 1 * dt;

        //simple logic:
        let hitResult = this.dda_Raycast(this.playerPosX, this.playerPosY, mapX, mapY, dirX, dirY);
        let distance = 999;
        if(hitResult[2]){
            distance = hitResult[0];
        }

        if(distance < 2){
            this.spin(dt);
        }
        else{
            //move forward 
            this.playerPosX += dirX * moveSpeed;
            this.playerPosY += dirY * moveSpeed;
        }

        if(this.playerPosX < 0 || this.playerPosX >= this.hcount || this.playerPosY < 0 || this.playerPosY >= this.vcount){
            this.playerPosX = 5;
            this.playerPosY = 5;
            //regen map
            this.init_worldMap();
        }

    }
    spin(dt){
        this.playerAngle += 30 * dt;
        this.playerAngleRad = this.playerAngle * 3.1415926 / 180;
    }

    dda_Raycast(posX, posY, mapX, mapY, dirX, dirY){
        //fake it till you make it....
        //let normalizedXY = normalize(dirX, dirY);
        let rayX = dirX;
        let rayY = dirY;

        let deltaX = rayX == 0? 0.00001 : Math.abs(1 / rayX);
        let deltaY = rayY == 0? 0.00001 : Math.abs(1 / rayY);

        let sideDistX = 0;
        let sideDistY = 0;

        let xIncr = 0;
        let yIncr = 0;

        if(rayX > 0){
            xIncr = 1;
            sideDistX = (mapX + 1 - posX) * deltaX;
        }
        else{
            xIncr = -1;
            sideDistX = (posX - mapX) * deltaX;
        }

        if(rayY > 0){
            yIncr = 1;
            sideDistY = (mapY + 1 - posY) * deltaY;
        }
        else{
            yIncr = -1;
            sideDistY = (posY - mapY) * deltaY;
        }

        let hit = false;
        let side = 0;
        let perpSideDist = 0;
        while(!hit){
            if(sideDistX < sideDistY){
                sideDistX += deltaX;
                mapX += xIncr;
                side = 0;
            }
            else{
                sideDistY += deltaY;
                mapY += yIncr;
                side = 1;
            }

            if(mapX < 0 || mapX >= this.hcount || mapY < 0 || mapY >= this.vcount){
                hit = false;
                break;
            }

            if(this.worldMap[mapX + mapY * this.hcount] > 0){
                hit = true;
                break;
            }

        }

        if(hit){
            if(side == 0){
                perpSideDist = sideDistX - deltaX;
            }
            else{
                perpSideDist = sideDistY - deltaY;
            }
        }
        return [perpSideDist, side, hit];
    }


    drawPlayerViewport(){
        //first lets just cast 80 rays:

        this.buffer.background(0);
        this.buffer.loadPixels();
        let oneOverSizeX = 1 / this.sizeX;
        let mapX = Math.floor(this.playerPosX);
        let mapY = Math.floor(this.playerPosY);
        for(let px = 0; px < this.sizeX; px++){
            //DDA:
            let pc = px * oneOverSizeX - 0.5;
            let rayAngle = this.fovRad * pc + this.playerAngleRad;
            let cosAngle = Math.cos(rayAngle);
            let sinAngle = Math.sin(rayAngle);

            let dirX = cosAngle;
            let dirY = sinAngle;

            let hitResult = this.dda_Raycast(this.playerPosX, this.playerPosY, mapX, mapY, dirX, dirY);
            let hitAnything = hitResult[2];
            let side = hitResult[1];
            let perpSideDist = hitResult[0];

            let hitposWsX = this.playerPosX + dirX * perpSideDist;
            let hitposWsY = this.playerPosY + dirY * perpSideDist;

            let hitpos = side == 0? hitposWsY : hitposWsX;

            //let hitPos = [dirX * perpSideDist, dirY * perpSideDist];
            //let hitPosProj = hitPos[0] * planeNormalX + hitPos[1] * planeNormalY;

            //draw the wall
            if(hitAnything)
                this.setBufferWallStrip(px, hitpos, side, perpSideDist * Math.cos(rayAngle - this.playerAngleRad));



        }
        this.buffer.updatePixels();
    }

    setBufferWallStrip(x, pos, side, distance)
    {
        //first we calculate the lineheight
        let lineHeight = Math.floor(this.sizeY / distance);
        let drawStart = -Math.ceil(lineHeight * 0.5) + Math.floor(this.sizeY * 0.5);
        if(drawStart < 0){
            drawStart = 0;
        }
        let drawEnd = Math.ceil(lineHeight * 0.5) + Math.floor(this.sizeY * 0.5);
        if(drawEnd >= this.sizeY){
            drawEnd = this.sizeY - 1;
        }

        let drawDist = drawEnd - drawStart;

        //now we draw the wall
        let color = themeStyle.secondaryColor;
        let colorIndex = 0;
        

        let shouldDrawFullStrip = false;
        let shouldDither = false;
        let sideBrightness = side == 0? 1 : 0.5;
        let brightness = exp(-distance * 0.25) * sideBrightness;

        let fractionalPos = pos - Math.floor(pos);
        for(let p2 = 0; p2 <= 1; p2+=0.25){
            let diff = Math.abs(p2 - fractionalPos);
            if(diff < 0.005){
                shouldDrawFullStrip = true;
                break;
            }
            else if(diff < 0.01){
                shouldDrawFullStrip = true;
                shouldDither = true;
                break;
            }
        }

        for(let y = drawStart; y < drawEnd; y++){
            
            if(!shouldDrawFullStrip && y >= (drawStart + 2) && y <= drawEnd - 3) continue;
            if(shouldDither && y % 2 == 0) continue;

            let index = (x + y * this.sizeX) * 4;
            this.buffer.pixels[index] = color[0] * brightness;
            this.buffer.pixels[index + 1] = color[1] * brightness;
            this.buffer.pixels[index + 2] = color[2] * brightness;
        }
    }

    drawWindowContent(dt) {
        this.buffer.background(0);
        //draw task bits:
        //calculate block:
        this.buffer.push();
        this.drawPlayerViewport();
        this.buffer.tint(themeStyle.primaryColor);
        this.buffer.image(this.logoImg, this.sizeX * 0.5 - this.logoImg.width * 0.5, this.sizeY * 0.35 - this.logoImg.height * 0.5);
        this.buffer.pop();
        this.renderBuffer();
    }


}