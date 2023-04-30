

function lerpColorArray(c1, c2, t){
    return [
        lerp(c1[0], c2[0], t),
        lerp(c1[1], c2[1], t),
        lerp(c1[2], c2[2], t),
    ];
}

function addColorArray(c1, c2){
    return [
        c1[0] + c2[0],
        c1[1] + c2[1],
        c1[2] + c2[2]
    ];
}

function mulColorArray(c1, cs){
    return[
        c1[0] * cs,
        c1[1] * cs,
        c1[2] * cs
    ]
}

function normalizeColors(c1){
    return[
        c1[0] / 256.0,
        c1[1] / 256.0,
        c1[2] / 256.0
    ]
}

function ptDistance(p1, p2){
    let x = p2[0] - p1[0];
    let y = p2[1] - p1[1];
    let z = p2[2] - p1[2];
    return Math.sqrt(x * x + y * y + z * z);
}

function ptDot(p1, v1){
    return p1[0] * v1[0] + p1[1] * v1[1] + p1[2] * v1[2];
}

function ptDistanceProj(p1, p2, projv, rtVec, upVec){
    let x = p1[0] - p2[0];
    let y = p1[1] - p2[1];
    let z = p1[2] - p2[2];
    let distance = x * projv[0] + y * projv[1] + z * projv[2];
    return [ptDot(p1, rtVec) / distance, ptDot(p1, upVec) / distance];
}


function ptRotAndScale(p1, rotX, scale, tz){
    //1. rot and scale

}