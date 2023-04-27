

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