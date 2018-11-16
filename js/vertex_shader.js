var vertex_shader = `
  #version 300 es

  layout(std140, column_major) uniform;

  layout(location=0) in vec4 position;
  layout(location=1) in vec2 texUV;
  layout(location=2) in vec3 normal;

  uniform SceneUniforms {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 lightPosition;
  } uScene;

  uniform mat4 uModel;

  out vec3 vecPosition;
  out vec2 vecUV;
  out vec3 vecNormal;

  void main() {
    vec4 worldPosition = uModel * position;
    vecPosition = worldPosition.xyz;
    vecUV = texUV;
    vecNormal = mat3(uModel) * normal;
    gl_Position = uScene.viewProj * worldPosition;
  }
`;

function outputShader() {
  document.getElementsByClassName('main')[0].innerHTML = "<h1> Occlusion Culling </h1>";
}
