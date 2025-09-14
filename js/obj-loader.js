// OBJ Loader for WebGL
class OBJLoader {
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        this.faces = [];
    }

    async loadOBJ(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            console.log('OBJ file loaded successfully');
            return this.parseOBJ(text);
        } catch (error) {
            console.error('Error loading OBJ file:', error);
            return null;
        }
    }

    parseOBJ(objText) {
        const lines = objText.split('\n');
        const vertices = [];
        const normals = [];
        const uvs = [];
        const faces = [];
        let mtlFile = null;

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('v ')) {
                // Vertex position
                const parts = line.split(/\s+/);
                vertices.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ]);
            } else if (line.startsWith('vn ')) {
                // Vertex normal
                const parts = line.split(/\s+/);
                normals.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ]);
            } else if (line.startsWith('vt ')) {
                // Texture coordinate
                const parts = line.split(/\s+/);
                uvs.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ]);
            } else if (line.startsWith('mtllib ')) {
                // Material library reference
                mtlFile = line.substring(7).trim();
                console.log('MTL file referenced:', mtlFile);
            } else if (line.startsWith('f ')) {
                // Face
                const parts = line.split(/\s+/).slice(1);
                const face = [];
                for (let part of parts) {
                    const indices = part.split('/');
                    face.push({
                        vertex: parseInt(indices[0]) - 1,
                        uv: indices[1] ? parseInt(indices[1]) - 1 : null,
                        normal: indices[2] ? parseInt(indices[2]) - 1 : null
                    });
                }
                faces.push(face);
            }
        }

        console.log(`Parsed OBJ: ${vertices.length} vertices, ${faces.length} faces, ${normals.length} normals, ${uvs.length} UVs`);
        return this.buildBufferData(vertices, normals, uvs, faces);
    }

    buildBufferData(vertices, normals, uvs, faces) {
        const positionData = [];
        const normalData = [];
        const uvData = [];
        const indices = [];

        let vertexIndex = 0;

        for (let face of faces) {
            if (face.length >= 3) {
                // Convert any polygon to triangles (fan triangulation)
                for (let i = 1; i < face.length - 1; i++) {
                    // Triangle: 0, i, i+1
                    for (let j of [0, i, i + 1]) {
                        const vertex = vertices[face[j].vertex];
                        if (!vertex) {
                            console.warn('Missing vertex at index:', face[j].vertex);
                            continue;
                        }
                        positionData.push(...vertex);

                        if (face[j].normal !== null && normals[face[j].normal]) {
                            const normal = normals[face[j].normal];
                            normalData.push(...normal);
                        } else {
                            // Calculate face normal if not provided
                            normalData.push(0, 0, 1);
                        }

                        if (face[j].uv !== null && uvs[face[j].uv]) {
                            const uv = uvs[face[j].uv];
                            uvData.push(...uv);
                        } else {
                            uvData.push(0, 0);
                        }

                        indices.push(vertexIndex++);
                    }
                }
            }
        }

        console.log('Buffer data built:', {
            positions: positionData.length / 3,
            normals: normalData.length / 3,
            uvs: uvData.length / 2,
            indices: indices.length
        });

        return {
            positions: new Float32Array(positionData),
            normals: new Float32Array(normalData),
            uvs: new Float32Array(uvData),
            indices: new Uint16Array(indices),
            vertexCount: indices.length
        };
    }
}

// Texture loader
async function loadTexture(gl, url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            
            // Flip Y coordinate
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            
            // Upload texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            
            // Set filtering
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            resolve(texture);
        };
        image.onerror = reject;
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}
