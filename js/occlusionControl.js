function begin() {
  outputShader();
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var gl = canvas.getContext("webgl2");
  if(!gl) {
    console.error("WebGl 2 Not Supported!");
    document.body.innerHTML = "WebGL 2 is required to run this demo, sorry :(";
  } else {
    console.log("WebGL2 Initialized Okay!");
  }

  var viewport = [
    0,
    0,
    gl.drawingBufferWidth / 5,
    gl.drawingBufferHeight / 5
  ];

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


  // Using the vertex and fragment shaders defined in the js folder:

  // VERTEX SHADER //
  var vertexShaderSource = vertex_shader.trim();
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("vertexShader compilation failed!");
  } else {
    console.log("vertexShader compilation successful!");
  }


  // FRAGMENT SHADER //
  var fragmentShaderSource = fragment_shader.trim();
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("fragmentShader compilation failed!");
  } else {
    console.log("fragmentShader compilation successful!");
  }


  // PROGRAM //
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program Linker Error!!! " + gl.getProgramInfoLog(program));
  } else {
    console.log("Program link successful!");
  }


  /// BOUNDING BOXES ///

  // VERTEX BOUNDING BOX //
  var vertexBoundingBoxSource = vertex_boundingBox.trim();
  var vertexBoundingBox = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexBoundingBox, vertexBoundingBoxSource);
  gl.compileShader(vertexBoundingBox);
  if(!gl.getShaderParameter(vertexBoundingBox, gl.COMPILE_STATUS)) {
    console.error("Vertex Shader Bounding Box COMPILATION ERROR!!");
  } else {
    console.log("Vertex shader bounding box okay!");
  }


  // FRAGMENT BOUNDING BOX //
  var fragmentBoundingBoxSource = fragment_boundingBox.trim();
  var fragmentBoundingBox = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentBoundingBox, fragmentBoundingBoxSource);
  gl.compileShader(fragmentBoundingBox);
  if(!gl.getShaderParameter(fragmentBoundingBox, gl.COMPILE_STATUS)) {
    console.error("Fragment Shader Bounding Box COMPILATION ERROR!!");
  } else {
    console.log("Fragment shader bounding box okay!");
  }


  // BOUNDING BOX PROGRAM //
  var boundingBoxProgram = gl.createProgram();
  gl.attachShader(boundingBoxProgram, vertexBoundingBox);
  gl.attachShader(boundingBoxProgram, fragmentBoundingBox);
  gl.linkProgram(boundingBoxProgram);
  if(!gl.getProgramParameter(boundingBoxProgram, gl.LINK_STATUS)) {
    console.error("Bouding Box Program Linker Error!!! " + gl.getProgramInfoLog(boundingBoxProgram));
  } else {
    console.log("Bouding Box Program link successful!");
  }


  // HUD //

  // VERTEX HUD //
  var vertexHUDSource = vertex_hud.trim();
  var vertexHUD = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexHUD, vertexHUDSource);
  gl.compileShader(vertexHUD);
  if(!gl.getShaderParameter(vertexHUD, gl.COMPILE_STATUS)) {
    console.error("Vertex HUD compilation error!");
  } else {
    console.log("Vertex HUD compilation okay!");
  }


  // FRAGMENT HUD //
  var fragmentHUDSource = fragment_hud.trim();
  var fragmentHUD = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentHUD, fragmentHUDSource);
  gl.compileShader(fragmentHUD);
  if(!gl.getShaderParameter(fragmentHUD, gl.COMPILE_STATUS)) {
    console.error("Fragment HUD compilation error!");
  } else {
    console.log("Fragment HUD compilation okay!");
  }


  // HUD PROGRAM //
  var hudProgram = gl.createProgram();
  gl.attachShader(hudProgram, vertexHUD);
  gl.attachShader(hudProgram, fragmentHUD);
  gl.linkProgram(hudProgram);
  if(!gl.getProgramParameter(hudProgram, gl.LINK_STATUS)) {
    console.error("HUD program linker error! " + gl.getProgramInfoLog(hudProgram));
  } else {
    console.log("HUD program compilation okay!");
  }


  // LOCATIONS //


  var drawModelMatrixLocation = gl.getUniformLocation(program, "uModel");
  var drawTexLocation = gl.getUniformLocation(program, "tex");
  var sceneUnifromsLocation = gl.getUniformBlockIndex(program, "SceneUniforms");


  gl.uniformBlockBinding(program, sceneUnifromsLocation, 0);

  // Bounding Box Locations
  var boundingBoxModelMatrixLocation = gl.getUniformLocation(boundingBoxProgram, "uModel");

  // HUD Locations
  var hudViewProjectionLocation = gl.getUniformLocation(hudProgram, "uViewProj");
  var hudModelViewMatrixLocation = gl.getUniformLocation(hudProgram, "uModel");


  // GEOMETRY //

  var positionBuffer, uvBuffer, normalBuffer, indices;

  // !!!! SPHERES (CHANGE TO CUBES) !!!! //
  let radius = 0.6;
  var sphere = utils.createSphere({radius: radius});

  var sphereArray = gl.createVertexArray();
  gl.bindVertexArray(sphereArray);

  positionBuffer =  gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.uvs, gl.STATIC_DRAW);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(2);

  indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  sphere.boundingBox = utils.computeBoundingBox(sphere.positions, {geo: true});

  var boundingBoxArray = gl.createVertexArray();
  gl.bindVertexArray(boundingBoxArray);

  positionBuffer =  gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.boundingBox.geo.positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  gl.bindVertexArray(null);


  // OBJECTS //
  var GRID_DIMENSION = 6;
  var GRID_OFFSET = (GRID_DIMENSION / 2) - 0.5;
  var NUM_SPHERES = GRID_DIMENSION * GRID_DIMENSION;
  var spheres = new Array(NUM_SPHERES);

  for(var sphereCount = 0; sphereCount < NUM_SPHERES; ++sphereCount) {
    var x = Math.floor(sphereCount / GRID_DIMENSION) - GRID_OFFSET;
    var z = sphereCount % GRID_DIMENSION - GRID_OFFSET;

    spheres[sphereCount] = {
      rotate: [0, 0, 0], // global rotation
      tranlate: [x, 0, z],
      modelMatrix: mat4.create(),
      vertexArray: sphereArray,
      numElements: sphere.indices.length,
      boundingBox: sphere.boundingBox,
      boundingBoxVertexArray: boundingBoxArray,
      boundingBoxNumVertices: sphere.boundingBox.geo.positions.length / 3,

      query: gl.createQuery(),
      queryInProgress: false,
      occluded: false
    };

    console.log("Sphere Calculated");
  }

}
