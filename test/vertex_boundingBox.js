var vertex_boundingBox = `#version 300 es

layout(std140, column_major) uniform;

layout(location=0) in vec4 position;

uniform SceneUniforms {
  mat4 viewProj;
  vec4 eyePosition;
  vec4 lightPosition;
} uScene;

uniform mat4 uModel;

void main() {
  gl_Position = uScene.viewProj * uModel * position;
}`
