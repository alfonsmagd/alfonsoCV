# Configuración de Tu Modelo 3D

## 📁 Estructura de Archivos
Tu modelo debe estar en `assets/model3D/` con estos archivos:

```
assets/
└── model3D/
    ├── model.obj       ← Tu archivo .obj (renombra tu archivo a "model.obj")
    ├── model.mtl       ← Tu archivo .mtl (renombra tu archivo a "model.mtl") 
    └── texture.png     ← Tu archivo .png (renombra tu archivo a "texture.png")
```

## 🔧 Pasos para Configurar

### 1. Renombrar Tus Archivos
Necesitas renombrar tus archivos para que coincidan con lo que espera el código:

- `tu-modelo.obj` → `model.obj`
- `tu-modelo.mtl` → `model.mtl`
- `tu-textura.png` → `texture.png`

### 2. Copiar Archivos
Copia los 3 archivos renombrados a la carpeta `assets/model3D/`

### 3. El Código Ya Está Configurado
El código JavaScript ya está configurado para cargar:
- `assets/model3D/model.obj`
- `assets/model3D/texture.png`

## 🎮 Funcionamiento
- ✅ **Las matrices de rotación permanecen igual** (como pediste)
- 🎨 **Color picker**: Cambia el tinte del modelo
- ▶️ **Play/Pause**: Controla la rotación automática
- 🔄 **Rotación**: El modelo girará sobre su propio eje Y

## 🔧 Si Tus Archivos Tienen Otros Nombres

Si prefieres mantener los nombres originales, modifica estas líneas en `js/main.js`:

```javascript
// Cambia estos nombres por los de tus archivos:
modelData = await objLoader.loadOBJ('assets/model3D/TU-ARCHIVO.obj');
texture = await loadTexture(gl, 'assets/model3D/TU-TEXTURA.png');
```

## 📋 Checklist Rápido
- [ ] Tus 3 archivos están en `assets/model3D/`
- [ ] Los archivos se llaman `model.obj`, `model.mtl`, `texture.png`
- [ ] El navegador puede acceder a los archivos (sin errores 404)
- [ ] El modelo aparece y rota en el WebGL demo

¡Tu modelo reemplazará completamente el cubo manteniendo las mismas matrices de rotación!
