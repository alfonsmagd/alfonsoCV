# How to Use Your 3D Model

## 📁 File Structure
Place your model files in the `assets/models/` directory:

```
assets/
└── models/
    ├── your-model.obj      ← Your 3D model
    ├── your-model.mtl      ← Material file (optional)
    └── your-texture.png    ← Your texture image
```

## 🔧 Configuration Steps

### 1. Upload Your Files
- Copy your `.obj` file to `assets/models/`
- Copy your `.png` texture to `assets/models/`
- Copy your `.mtl` file to `assets/models/` (if you have one)

### 2. Update the Code
In `js/main.js`, find this line and replace with your file names:

```javascript
// Current (example model):
modelData = await objLoader.loadOBJ('assets/models/example-model.obj');

// Change to your model:
modelData = await objLoader.loadOBJ('assets/models/YOUR-MODEL-NAME.obj');
```

And for the texture:

```javascript
// Remove the checkerboard texture creation and replace with:
texture = await loadTexture(gl, 'assets/models/YOUR-TEXTURE-NAME.png');
```

### 3. Model Requirements
- **OBJ Format**: Standard Wavefront OBJ file
- **Faces**: Triangulated (triangles only, no quads)
- **UVs**: Texture coordinates included
- **Normals**: Vertex normals for proper lighting
- **Texture**: PNG or JPG format

### 4. Example Model Formats

**Supported OBJ format:**
```
v 0.0 1.0 0.0       # Vertex position
vt 0.5 1.0          # Texture coordinate
vn 0.0 1.0 0.0      # Vertex normal
f 1/1/1 2/2/2 3/3/3 # Face (vertex/texture/normal)
```

## 🎮 Controls
- ✅ **Rotation matrices are already working** (as you requested)
- 🎨 **Color picker**: Changes model tint
- ▶️ **Play/Pause**: Controls auto-rotation
- 🖱️ **Manual rotation**: Use mouse controls (if implemented)

## 🔧 Troubleshooting

### Model Not Loading?
1. Check browser console for errors
2. Verify file paths are correct
3. Ensure OBJ file is properly formatted
4. Check that texture file exists

### Model Too Big/Small?
Adjust the translation distance in the render function:
```javascript
// Make model closer (bigger on screen)
translateMatrix(modelViewMatrix, [0, 0, -3]);

// Make model further (smaller on screen)
translateMatrix(modelViewMatrix, [0, 0, -8]);
```

### Model Upside Down?
Add rotation to fix orientation:
```javascript
// Before existing rotations, add:
rotateMatrix(modelViewMatrix, Math.PI, [1, 0, 0]); // Flip X
// or
rotateMatrix(modelViewMatrix, Math.PI, [0, 0, 1]); // Flip Z
```

## 🎨 Customization

### Lighting
Adjust lighting in the render function:
```javascript
gl.uniform3fv(lightDirectionLocation, [0.5, 0.7, 0.5]); // Light direction
gl.uniform3fv(lightColorLocation, [1.0, 1.0, 1.0]);     // Light color
gl.uniform3fv(ambientColorLocation, [0.3, 0.3, 0.3]);   // Ambient light
```

### Color Override
Control how much the color picker affects the model:
```javascript
gl.uniform1f(useOverrideLocation, 0.3); // 0.0 = original texture, 1.0 = full color override
```

## 📋 Quick Start Checklist
- [ ] Upload your .obj file to `assets/models/`
- [ ] Upload your .png texture to `assets/models/`
- [ ] Update file paths in `js/main.js`
- [ ] Test in browser
- [ ] Adjust scale/position if needed
- [ ] Commit and push to GitHub

Your model will now rotate exactly like the cube did, but with your custom geometry and texture!
