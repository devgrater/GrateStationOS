class Random3DObjectWindow extends GsWindow{
    onWindowPreload(){
        //this.shader = loadShader('assets/commcall.vert', 'assets/commcall.frag');

    }

    onWindowReady() {
        this.points = [
            [-0.5, -1.5, -1],
            [-0.5,  1.5, -1],
            [ 0.5, 1.5, -1],
            [ 0.5, -1.5, -1],
            [ 0.5,  1.5,  1],
            [-0.5,  1.5,  1],
            [-0.5, -1.5,  1],
            [ 0.5, -1.5,  1]
        ];
        this.pointOrder = [
            //[0,1],
            [1,2],
            //[2,3],
            [3,0],
            [3,6],
            [0,5],
            [2,7],
            [1,4],
            [4,5],
            //[4,7],
            [7,6],
            //[6,5]
        ]
        this.campos = [0, 0, 1];
        this.camDistance = 5;
        this.camdir = [0, 0, -1];
        this.camrdir = [1, 0, 0];
        this.camudir = [0, 1, 0];
        this.rotSpeed = 0.5; // in radians

    }

    rotateBaseCube(){

    }

    windowSetup(title, posX, posY, sizeX, sizeY){
        this.isMouseDragging = false;
        this.title = title;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.posX = posX;
        this.posY = posY;
        this.lifespan = 0;
        this.fractLifespan = 0;
        this.buffer = createGraphics(this.sizeX, this.sizeY, WEBGL);
        this.buffer.noSmooth();
        this.windowState = "NORMAL";
    }

    update(dt) {
        super.update(dt)

    }

    drawWindowContent(dt) {
        this.buffer.background(0);
        this.buffer.push();
        for(let i = 0; i < 10; i++){
            this.draw3DCubeAtTimeFrame(this.lifespan, i * 0.1 + 1)
        }
        this.buffer.pop();
        this.renderBuffer();
    }

    draw3DCubeAtTimeFrame(time, speedmul){
        let rotVal = this.rotSpeed * speedmul * time;
        let cosVal = Math.cos(rotVal);
        let sinVal = Math.sin(rotVal);
        let campos = [0, 0, 0];
        let camdir = [0, 0, 0];
        let camrdir = [0, 0, 0];


        campos[0] = -this.camDistance * sinVal;
        campos[2] = this.camDistance * cosVal;

        //camdir:
        camdir[0] = campos[0] / -this.camDistance;
        camdir[2] = campos[2] / -this.camDistance;

        //swizzle:
        camrdir[0] = camdir[2];
        camrdir[2] = -camdir[0];

        let size = Math.sin(time * speedmul);
        size += 1;
        size *= 0.5 * 0.3;

        this.draw3DCubeInPerspective(campos, camdir, this.camudir, camrdir);
    }

    draw3DCubeInPerspective(campos, camdir, camudir, camrdir){
        //for each point
        let projectedPoints = [];
        for(let i = 0; i < this.points.length; i++){
            let curPoint = this.points[i];
            //project:
            let projPointDst = ptDistanceProj(curPoint, campos, camdir);

            let projPos = ptProject(curPoint, projPointDst, camrdir, camudir);
            projectedPoints.push(projPos);
        }
        this.buffer.noFill();
        this.buffer.strokeWeight(1);
        this.buffer.noSmooth();
        this.buffer.stroke(themeStyle.primaryColor);

        let size = 256;
        for(let i = 0; i < this.pointOrder.length; i++){
            let linePoints = this.pointOrder[i];
            let pt0 = projectedPoints[linePoints[0]];
            let pt1 = projectedPoints[linePoints[1]];
            this.buffer.line(
                pt0[0] * size, pt0[1] * size,
                pt1[0] * size, pt1[1] * size
            );
        }
    }
}