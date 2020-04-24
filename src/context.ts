// Shader sources
const vertexShaderSource = `#version 300 es
in vec4 a_position;
 
void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 outColor;

void main() {
  // Nice color
  outColor = vec4(0, 0.4, 0, 1);
}
`;

// Context
let canvas = document.getElementById("canvas") as HTMLCanvasElement;

export let gl: WebGL2RenderingContext = canvas.getContext("webgl2");

console.log(canvas);

if (canvas == undefined) {
  throw new Error("Cannot find a canvas!");
}

if (gl) {
  console.log("WebGL2 is supported.");
} else {
  console.info("WebGL2 is not supported.");
}

// Compiled shaders and created programs
let fragment = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
let vertex = createShader(gl.VERTEX_SHADER, vertexShaderSource);

let program = createProgram(gl, vertex, fragment);

// Utility functions
function createShader(type, src) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    console.log("Shader compilation is ok xd 👌😂💯💯");
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    console.log("Created a program 😳");
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Buffers and other funny stuffs xDDD
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Creating a position buffer
let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let positions = [0.5, 0.5, 0, 0.5, 0, 0];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Vertex array
let vao = gl.createVertexArray();
gl.bindVertexArray(vao);

gl.enableVertexAttribArray(positionAttributeLocation);

//

let size = 2; // 2 components per iteration
let type = gl.FLOAT; // the data is 32bit floats
let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
let offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  false,
  stride,
  offset
);



// Clear
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use the program
gl.useProgram(program);

// Bind atribbute and buffer set
gl.bindVertexArray(vao);

let primitiveType = gl.TRIANGLES;
let drawOffset = 0;
let count = 3;
gl.drawArrays(primitiveType, drawOffset, count);

// Clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

function resize(canvas) {
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {
   
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

resize(gl.canvas);