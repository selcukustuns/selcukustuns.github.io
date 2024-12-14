"use strict";

let canvas, gl, program;
let modelMatrix, viewMatrix, projectionMatrix;
let modelMatrixLoc, colorLoc;

let rotationAngle = 0;
let speed = 0.5;

let coneBuffer, smallConeBuffer, groundBuffer, bladeBuffer;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Shader programını oluştur
    program = initShadersFromText(gl, vertexShaderText, fragmentShaderText);
    gl.useProgram(program);

    // Uniform değişkenlerin yerlerini al
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    colorLoc = gl.getUniformLocation(program, "uColor");

    // Tüm buffer'ları kur
    setupBuffers();

    // Çizim döngüsünü başlat
    render();
};

function setupBuffers() {
    // Zemin vertex verileri
    const groundVertices = [
        vec3(-1, -1, -1),
        vec3(1, -1, -1),
        vec3(1, -1, 1),
        vec3(-1, -1, 1),
    ];
    groundBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(groundVertices), gl.STATIC_DRAW);

    // Büyük koni vertex verileri (Yükseklik ve taban büyütülmüş)
    const coneVertices = [
        vec3(0, 0, 0),          // Zirve
        vec3(-0.2, -1.5, -0.2), // Taban
        vec3(0.2, -1.5, -0.2),  // Taban
        vec3(0.2, -1.5, 0.2),   // Taban
        vec3(-0.2, -1.5, 0.2),  // Taban
        vec3(-0.2, -1.5, -0.2), // Taban
    ];
    coneBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(coneVertices), gl.STATIC_DRAW);

    // Küçük koni vertex verileri (Z ekseni boyunca paralel)
    const smallConeVertices = [
        vec3(0, 0, 0.2),       // Keskin uç (+z)
        vec3(-0.05, -0.05, 0), // Taban
        vec3(0.05, -0.05, 0),  // Taban
        vec3(0.05, 0.05, 0),   // Taban
        vec3(-0.05, 0.05, 0),  // Taban
        vec3(-0.05, -0.05, 0), // Taban
    ];
    smallConeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(smallConeVertices), gl.STATIC_DRAW);

    // Pervaneler için vertex verileri
    const bladeVertices = [
        vec3(-0.1, 0, 0),
        vec3(0.1, 0, 0),
        vec3(0.1, 0.6, 0),
        vec3(-0.1, 0.6, 0),
    ];
    bladeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bladeVertices), gl.STATIC_DRAW);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Görüş ve projeksiyon matrislerini ayarla
    projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100);
    viewMatrix = lookAt(vec3(0, 2, 5), vec3(0, 0, 0), vec3(0, 1, 0));

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "viewMatrix"), false, flatten(viewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    // Zemin, büyük koni, küçük koni ve pervaneleri çiz
    drawGround();
    drawCone();
    drawSmallCone();
    drawBlades();

    // Pervanelerin dönüş açısını güncelle
    rotationAngle += speed;
    requestAnimationFrame(render);
}

function drawGround() {
    gl.bindBuffer(gl.ARRAY_BUFFER, groundBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(mat4()));
    gl.uniform4fv(colorLoc, vec4(0.6, 0.4, 0.2, 1.0)); // Kahverengi zemin
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, coneBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(mat4()));
    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0)); // Siyah büyük koni
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
}

function drawSmallCone() {
    gl.bindBuffer(gl.ARRAY_BUFFER, smallConeBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

    let transform = mat4();
    transform = mult(transform, translate(0, 0.2, 0)); // Küçük koniyi büyük koninin üstüne yerleştir
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(transform));

    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0)); // Siyah küçük koni
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
}

function drawBlades() {
    const colors = [
        vec4(1.0, 0.0, 0.0, 1.0), // Kırmızı
        vec4(0.0, 1.0, 0.0, 1.0), // Yeşil
        vec4(0.0, 0.0, 1.0, 1.0)  // Mavi
    ];

    for (let i = 0; i < 3; i++) {
        let bladeTransform = mat4();
        bladeTransform = mult(bladeTransform, translate(0, 0.2, 0.2)); // Pervaneleri küçük koninin keskin ucuna taşı
        bladeTransform = mult(bladeTransform, rotateZ(rotationAngle + i * 120));
        gl.bindBuffer(gl.ARRAY_BUFFER, bladeBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, "vPosition"), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, "vPosition"));

        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(bladeTransform));
        gl.uniform4fv(colorLoc, colors[i]); // Kırmızı, Yeşil, Mavi sırasıyla
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

function initShadersFromText(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Vertex shader compilation error: " + gl.getShaderInfoLog(vertexShader));
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Fragment shader compilation error: " + gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Shader program linking error: " + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}
