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
    utils.xformMatrix(spheres[sphereCount].modelMatrix, spheres[sphereCount].translate);
  }

  // sphereCountElement.innerHTML = spheres.lenth;


  // CAMERA //

  var projMatrix = mat4.create();
  mat4.perspective(projMatrix, Math.PI / 2, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10.0);

  var viewMatrix = mat4.create();
  var eyePosition = vec3.fromValues(0, 0, 5);
  mat4.lookAt(viewMatrix, eyePosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

  var viewProjMatrix = mat4.create();
  mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

  // BIRDS EYE CAMERA
  var projMatrixAssistCam = mat4.create();
  mat4.perspective(projMatrixAssistCam, Math.PI / 2, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10.0);

  var viewMatrixAssistCam = mat4.create();
  var eyePositionAssistCam = vec3.fromValues(0, 5, 0);
  mat4.lookAt(viewMatrixAssistCam, eyePositionAssistCam, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, -1));

  var viewProjMatrixAssistCam = mat4.create();
  mat4.multiply(viewProjMatrixAssistCam, projMatrixAssistCam, viewMatrixAssistCam);

  gl.useProgram(hudProgram);
  gl.uniformMatrix4fv(hudViewProjectionLocation, false, viewProjMatrix);
  gl.useProgram(null);

  var lightPosition = vec3.fromValues(1, 1, 40);

  var modelMatrix = mat4.create();
  var rotateXMatrix = mat4.create();
  var rotateYMatrix = mat4.create();

  var sceneUniformData = new Float32Array(24);
  sceneUniformData.set(viewProjMatrix);
  sceneUniformData.set(eyePosition, 16);
  sceneUniformData.set(lightPosition, 20);

  var sceneUniformBuffer = gl.createBuffer();
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, sceneUniformBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, sceneUniformData, gl.STATIC_DRAW);

  var assistCamUniformData = new Float32Array(24);
  assistCamUniformData.set(viewProjMatrixAssistCam);
  assistCamUniformData.set(eyePositionAssistCam);
  assistCamUniformData.set(lightPosition, 20);

  var assistCamUniformBuffer = gl.createBuffer();
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, assistCamUniformBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, assistCamUniformData, gl.STATIC_DRAW);


  // DEPTH DETERMINATION

  var sortPositionA = vec4.create();
  var sortPositionB = vec4.create();

  var sortModelView = mat4.create();

  function depthSort(a, b) {
    vec4.set(sortPositionA, a.tranlate[0], a.tranlate[1], a.tranlate[2], 1.0);
    vec4.set(sortPositionB, b.tranlate[0], b.tranlate[1], b.tranlate[2], 1.0);

    mat4.mul(sortModelView, viewMatrix, a.modelMatrix);
    vec4.transformMat4(sortPositionA, sortPositionA, sortModelView);
    mat4.mul(sortModelView, viewMatrix, b.modelMatrix);
    vec4.transformMat4(sortPositionB, sortPositionB, sortModelView);

    return sortPositionB[2] - sortPositionA[2];
  }


  // TEXTURE //

  var image = new Image();
  var firstFrame = true;
  var occludedSpheres = 0;

  image.onload = function() {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    var levels = Math.floor(Math.log2(Math.max(this.width, this.height))) + 1;
    gl.texStorage2D(gl.TEXTURE_2D, levels, gl.RGBA8, image.width, image.height);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.useProgram(program);
    gl.uniform1i(drawTexLocation, 0);
    gl.useProgram(null);

    var rotationMatrix = mat4.create();
    var sphere, boundingBox;
    var samplesPassed;

    var i;

    function draw() {
      occludedSpheres = 0;

      spheres.sort(depthSort);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.colorMask(true, true, true, true);
      gl.depthMask(true);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      for(i = 0; i < NUM_SPHERES; ++i) {
        sphere = spheres[i];
        boundingBox = sphere.boundingBox;

        sphere.rotate[1] += 0.003;

        utils.xformMatrix(sphere.modelMatrix, sphere.translate, null, sphere.scale);
        mat4.fromYRotation(rotationMatrix, sphere.rotate[1]);
        mat4.multiply(sphere.modelMatrix, rotationMatrix, sphere.modelMatrix);


        // OCCLUSION //


        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.useProgram(boundingBoxProgram);
        gl.bindVertexArray(sphere.boundingBoxVertexArray);
        gl.uniformMatrix4fv(boundingBoxModelMatrixLocation, false, sphere.modelMatrix);

        // QUERY FOR OCCLUSION //

        if(sphere.queryInProgress && gl.getQueryParameter(sphere.query, gl.QUERY_RESULT_AVAILABLE)) {
          sphere.occluded = !gl.getQueryParameter(sphere.query, gl.QUERY_RESULT);
          if(sphere.occluded) {
            occludedSpheres++;
          }
          sphere.queryInProgress = false;
        }

        // Initiate query and draw bounding box of the shape
        if(!sphere.queryInProgress) {
          gl.beginQuery(gl.ANY_SAMPLES_PASSED_CONSERVATIVE, sphere.query);
          gl.drawArrays(gl.TRIANGLES, 0, sphere.boundingBoxNumVertices);
          gl.endQuery(gl.ANY_SAMPLES_PASSED_CONSERVATIVE);
          sphere.queryInProgress = true;
        }
      // } else {
      //   sphere.occluded = false;
      // }

      if(!sphere.occluded) {
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.useProgram(program);
        gl.bindVertexArray(sphere.vertexArray);

        gl.uniformMatrix4fv(drawModelMatrixLocation, false, sphere.modelMatrix);

        gl.drawElements(gl.TRIANGLES, sphere.numElements, gl.UNSIGNED_SHORT, 0);
      }
    }
    // occludedSpheresElement.innerHTML = occludedSpheres;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
image.src = "../img/khronos_webgl.png";
}
