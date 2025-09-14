// JavaScript for Alfonso's portfolio

// Interactive particle system
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, isActive: false };
        this.maxParticles = 160;
        
        console.log('Initializing particle system...');
        console.log('Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
        
        this.resizeCanvas();
        this.init();
        this.bindEvents();
        this.animate();
        
        console.log('Particle system ready!');
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    init() {
        // Create initial particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1,
                color: Math.random() > 0.5 ? '#00ffff' : '#0080ff',
                originalSpeedX: (Math.random() - 0.5) * 0.3,
                originalSpeedY: (Math.random() - 0.5) * 0.3
            });
        }
    }
    
    bindEvents() {
        // Detect mouse movement in the entire hero section
        const heroSection = document.getElementById('inicio');
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.isActive = true;
            
            // Debug log (remove later)
            if (Math.random() < 0.01) { // Only show 1% of the time to avoid saturation
                console.log('Mouse position:', this.mouse.x, this.mouse.y);
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            this.mouse.isActive = false;
            console.log('Mouse left hero section');
        });
        
        // Resize canvas
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // If mouse is active, apply attraction
            if (this.mouse.isActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    const attraction = 0.002;
                    
                    particle.speedX += dx * force * attraction;
                    particle.speedY += dy * force * attraction;
                    
                    // Limit maximum speed
                    const maxSpeed = 2;
                    const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                    if (currentSpeed > maxSpeed) {
                        particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                        particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
                    }
                }
            } else {
                // Gradually return to original speed
                particle.speedX += (particle.originalSpeedX - particle.speedX) * 0.002;
                particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.002;
            }
            
            // Apply movement
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Keep particles on screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Smooth opacity variation
            particle.opacity += (Math.random() - 0.5) * 0.01;
            particle.opacity = Math.max(0.05, Math.min(0.4, particle.opacity));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw mouse indicator if active
        if (this.mouse.isActive) {
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 30, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Convert opacity to hex
            const alpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fillStyle = particle.color + alpha;
            
            // Glow effect
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Connect nearby particles
        this.drawConnections();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize particle system
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        // Ensure canvas has correct size
        setTimeout(() => {
            new ParticleSystem(particleCanvas);
        }, 100);
    }

    // Initialize simple WebGL test
    initWebGLTest();

    // Initialize main WebGL demo
    initWebGLDemo();
    
    // Add data-text for glitch effect
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        heroTitle.setAttribute('data-text', heroTitle.textContent);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // Fixed header height
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll appearance animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Apply animation to tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Apply animation to timeline elements
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Function to change active nav based on visible section
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Listen to scroll to update active navigation
    window.addEventListener('scroll', updateActiveNav);

    // Function for scroll to top button (can be added later)
    function createScrollToTopButton() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #3498db;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;

        document.body.appendChild(scrollButton);

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.style.opacity = '1';
            } else {
                scrollButton.style.opacity = '0';
            }
        });
    }

    // Create scroll to top button
    createScrollToTopButton();

    // Function for future WebGPU implementations
    async function initWebGPU() {
        // This function will be expanded when adding WebGPU functionalities
        if ('gpu' in navigator) {
            console.log('WebGPU is compatible in this browser');
            // Here you can add WebGPU logic later
        } else {
            console.log('WebGPU is not compatible in this browser');
        }
    }

    // Call WebGPU function to check compatibility
    initWebGPU();

    console.log('Alfonso\'s portfolio loaded successfully! 🚀');
});

// Function to initialize simple WebGL test
function initWebGLTest() {
    const canvas = document.getElementById('webglTestCanvas');
    const statusElement = document.getElementById('webglStatus');
    const rendererElement = document.getElementById('webglRenderer');
    const versionElement = document.getElementById('webglVersion');
    
    if (!canvas) {
        console.log('WebGL canvas not found');
        return;
    }
    
    // Try to get WebGL context
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        statusElement.textContent = 'Not supported';
        statusElement.style.color = '#ff4444';
        console.log('WebGL is not compatible');
        return;
    }
    
    // WebGL is available
    statusElement.textContent = 'Active ✓';
    statusElement.style.color = '#00ff88';
    
    // Get renderer information
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        rendererElement.textContent = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } else {
        rendererElement.textContent = 'Information not available';
    }
    
    versionElement.textContent = gl.getParameter(gl.VERSION);
    
    console.log('WebGL inicializado correctamente');
    
    // Crear y renderizar un cuadro azul simple
    renderBlueSquare(gl);
}

function renderBlueSquare(gl) {
    // Vertex shader source
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;
    
    // Fragment shader source
    const fragmentShaderSource = `
        precision mediump float;
        uniform vec3 u_color;
        void main() {
            gl_FragColor = vec4(u_color, 1.0);
        }
    `;
    
    // Function to create shader
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        return;
    }
    
    // Define vertices of the box (centered square)
    const vertices = new Float32Array([
        -0.5, -0.5,  // bottom left
         0.5, -0.5,  // bottom right
        -0.5,  0.5,  // top left
         0.5,  0.5   // top right
    ]);
    
    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    
    // Configure viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Usar programa
    gl.useProgram(program);
    
    // Configurar atributo de posición
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Establecer color azul
    gl.uniform3f(colorLocation, 0.0, 1.0, 1.0); // Cyan azul
    
    // Dibujar el cuadro
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    console.log('Cuadro azul WebGL renderizado');
    
    // Optional animation - rotate color
    let time = 0;
    function animate() {
        time += 0.01;
        
        // Cambiar color suavemente
        const r = 0.0;
        const g = (Math.sin(time) + 1) * 0.5;
        const b = 1.0;
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform3f(colorLocation, r, g, b);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Function for main WebGL Demo (3D rotating cube)
function initWebGLDemo() {
    const canvas = document.getElementById('webglCanvas');
    if (!canvas) {
        console.log('WebGL Demo canvas not found');
        return;
    }
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.log('WebGL not supported for main demo');
        canvas.style.background = '#330000';
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff4444';
        ctx.font = '20px Arial';
        ctx.fillText('WebGL not supported', 50, 200);
        return;
    }
    
    console.log('Main WebGL Demo initialized');
    
    // Vertex shader for 3D model with texture
    const vertexShaderSource = `
        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_texCoord;
        
        uniform mat4 u_modelViewMatrix;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_normalMatrix;
        
        varying vec3 v_normal;
        varying vec2 v_texCoord;
        varying vec3 v_position;
        
        void main() {
            gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
            v_normal = normalize((u_normalMatrix * vec4(a_normal, 0.0)).xyz);
            v_texCoord = a_texCoord;
            v_position = (u_modelViewMatrix * vec4(a_position, 1.0)).xyz;
        }
    `;
    
    const fragmentShaderSource = `
        precision mediump float;
        
        varying vec3 v_normal;
        varying vec2 v_texCoord;
        varying vec3 v_position;
        
        uniform sampler2D u_texture;
        uniform vec3 u_colorOverride;
        uniform float u_useOverride;
        uniform vec3 u_lightDirection;
        uniform vec3 u_lightColor;
        uniform vec3 u_ambientColor;
        
        void main() {
            // Sample texture
            vec4 textureColor = texture2D(u_texture, v_texCoord);
            
            // Basic lighting - normalizar dirección de luz y usar valores más suaves
            vec3 normal = normalize(v_normal);
            vec3 lightDir = normalize(u_lightDirection);
            float lightIntensity = max(dot(normal, lightDir), 0.0);
            
            // Suavizar la intensidad de luz para evitar el efecto todo-o-nada
            lightIntensity = pow(lightIntensity, 0.5);
            
            vec3 lighting = u_ambientColor + u_lightColor * lightIntensity;
            
            // Apply lighting to texture
            vec3 finalColor = textureColor.rgb * lighting;
            
            // Apply color override if needed
            finalColor = mix(finalColor, u_colorOverride, u_useOverride);
            
            gl_FragColor = vec4(finalColor, textureColor.a);
        }
    `;
    
    // Crear shaders y programa
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    // Load 3D model and texture
    let modelData = null;
    let texture = null;
    let modelLoaded = false;
    
    // Initialize OBJ loader
    const objLoader = new OBJLoader();
    
    // Load model and texture
    async function loadModel() {
        try {
            console.log('Loading model... Current URL:', window.location.href);
            
            // Try different path strategies for mobile compatibility
            const basePath = window.location.pathname.endsWith('/') ? 
                window.location.pathname : 
                window.location.pathname + '/';
                
            const modelPath = basePath + 'assets/model3D/avatar_final_refined_texturized.obj';
            const texturePath = basePath + 'assets/model3D/avatar_final_refined_color.png';
            
            console.log('Attempting to load:', {
                modelPath: modelPath,
                texturePath: texturePath,
                userAgent: navigator.userAgent.includes('iPhone') ? 'iPhone' : 'Other'
            });
            
            // Load OBJ model with explicit path
            modelData = await objLoader.loadOBJ(modelPath);
            
            // Load texture with explicit path  
            texture = await loadTexture(gl, texturePath);
            
            if (modelData && texture) {
                modelLoaded = true;
                console.log('3D model loaded successfully');
                console.log('Model vertices:', modelData.vertexCount);
                console.log('Model bounds check:', {
                    minPos: Math.min(...modelData.positions),
                    maxPos: Math.max(...modelData.positions)
                });
                setupModelBuffers();
            } else {
                throw new Error('Failed to load model or texture');
            }
        } catch (error) {
            console.error('Error loading 3D model:', error);
            console.log('Trying alternative absolute paths for mobile...');
            
            try {
                // Try absolute URLs as fallback for mobile
                const absoluteModelURL = window.location.origin + '/assets/model3D/avatar_final_refined_texturized.obj';
                const absoluteTextureURL = window.location.origin + '/assets/model3D/avatar_final_refined_color.png';
                
                console.log('Trying absolute URLs:', {
                    model: absoluteModelURL,
                    texture: absoluteTextureURL
                });
                
                modelData = await objLoader.loadOBJ(absoluteModelURL);
                texture = await loadTexture(gl, absoluteTextureURL);
                
                if (modelData && texture) {
                    modelLoaded = true;
                    console.log('3D model loaded successfully with absolute URLs');
                    setupModelBuffers();
                    return;
                }
            } catch (absoluteError) {
                console.error('Absolute URL loading also failed:', absoluteError);
            }
            
            console.log('All loading methods failed, using fallback geometry...');
            // Fallback to a simple plane if model fails to load
            createFallbackGeometry();
        }
    }
    
    // Setup buffers for the loaded model
    function setupModelBuffers() {
        if (!modelData || !modelData.positions) {
            console.error('Invalid model data');
            return;
        }
        
        console.log('Setting up model buffers...');
        // Position buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.positions, gl.STATIC_DRAW);
        
        // Normal buffer
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.normals, gl.STATIC_DRAW);
        
        // UV buffer
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, modelData.uvs, gl.STATIC_DRAW);
        
        // Index buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
        
        // Store buffer references
        modelData.positionBuffer = positionBuffer;
        modelData.normalBuffer = normalBuffer;
        modelData.uvBuffer = uvBuffer;
        modelData.indexBuffer = indexBuffer;
    }
    
    // Fallback geometry (simple plane) if model fails to load
    function createFallbackGeometry() {
        const positions = new Float32Array([
            -1, -1, 0,   1, -1, 0,   1, 1, 0,   -1, 1, 0
        ]);
        const normals = new Float32Array([
            0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1
        ]);
        const uvs = new Float32Array([
            0, 0,   1, 0,   1, 1,   0, 1
        ]);
        const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        
        modelData = {
            positions, normals, uvs, indices,
            vertexCount: indices.length
        };
        
        // Create white texture as fallback
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
        
        modelLoaded = true;
        setupModelBuffers();
    }
    
    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const normalLocation = gl.getAttribLocation(program, 'a_normal');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const normalMatrixLocation = gl.getUniformLocation(program, 'u_normalMatrix');
    const textureLocation = gl.getUniformLocation(program, 'u_texture');
    const colorOverrideLocation = gl.getUniformLocation(program, 'u_colorOverride');
    const useOverrideLocation = gl.getUniformLocation(program, 'u_useOverride');
    const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection');
    const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor');
    const ambientColorLocation = gl.getUniformLocation(program, 'u_ambientColor');
    
    // Rotation variables
    let rotationX = 0;
    let rotationY = 0;
    let rotationZ = 0; // Add Z rotation
    let autoRotate = true;
    let currentColor = [1, 0.8, 0.8]; // white by default 
    
    // Event listeners para controles
    const rotationXSlider = document.getElementById('rotationX');
    const rotationYSlider = document.getElementById('rotationY');  
    const colorPicker = document.getElementById('colorPicker');
    const resetButton = document.getElementById('resetDemo');
    
    if (rotationXSlider) {
        rotationXSlider.addEventListener('input', (e) => {
            rotationX = parseFloat(e.target.value) * Math.PI / 180;
            rotation.x = rotationX; // Sincronizar con controles avanzados
            const valueSpan = document.getElementById('rotationXValue');
            if (valueSpan) valueSpan.textContent = parseFloat(e.target.value).toFixed(0) + '°';
            autoRotate = false;
        });
    }
    
    if (rotationYSlider) {
        rotationYSlider.addEventListener('input', (e) => {
            rotationY = parseFloat(e.target.value) * Math.PI / 180;
            rotation.y = rotationY; // Sincronizar con controles avanzados
            const valueSpan = document.getElementById('rotationYValue');
            if (valueSpan) valueSpan.textContent = parseFloat(e.target.value).toFixed(0) + '°';
            autoRotate = false;
        });
    }
    
    if (colorPicker) {  
        colorPicker.addEventListener('input', (e) => {
            const hex = e.target.value;
            const r = parseInt(hex.substr(1, 2), 16) / 255;
            const g = parseInt(hex.substr(3, 2), 16) / 255;
            const b = parseInt(hex.substr(5, 2), 16) / 255;
            currentColor = [r, g, b];
            modelColor = [r, g, b]; // Sincronizar con controles avanzados
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            rotationX = 0;
            rotationY = 0;
            rotationZ = 0;
            autoRotate = true;
            currentColor = [1, 0, 0];
            if (rotationXSlider) rotationXSlider.value = 0;
            if (rotationYSlider) rotationYSlider.value = 0;
            if (colorPicker) colorPicker.value = '#ffffffff';
        });
    }
    
    // Variables adicionales para controles avanzados
    let rotation = { x: 0, y: 0, z: 0 };
    let scale = { x: 2, y: 2, z: 2 };
    let position = { x: 0, y: 0, z: 0 };
    let modelColor = [1.0, 1.0, 1.0];
    let colorIntensity = 1.0;
    let lightDirection = { x: 0.5, y: 0.7, z: 0.5 }; // Valores más suaves por defecto
    let lightColor = [1.0, 1.0, 1.0];
    let lightIntensity = 1.0;
    let ambientLight = 0.3;
    
    // Configurar controles WebGL adicionales
    setupAdvancedControls();
    
    function setupAdvancedControls() {
        // Controles de rotación Z
        const rotationZSlider = document.getElementById('rotationZ');
        const autoRotateCheckbox = document.getElementById('autoRotate');
        
        if (rotationZSlider) {
            rotationZSlider.addEventListener('input', (e) => {
                rotation.z = parseFloat(e.target.value) * Math.PI / 180;
                rotationZ = rotation.z;
                const valueSpan = document.getElementById('rotationZValue');
                if (valueSpan) valueSpan.textContent = parseFloat(e.target.value).toFixed(0) + '°';
                autoRotate = false;
            });
        }
        
        if (autoRotateCheckbox) {
            autoRotateCheckbox.addEventListener('change', (e) => {
                autoRotate = e.target.checked;
            });
        }
        
        // Controles de escala
        const scaleXSlider = document.getElementById('scaleX');
        const scaleYSlider = document.getElementById('scaleY');
        const scaleZSlider = document.getElementById('scaleZ');
        
        if (scaleXSlider) {
            scaleXSlider.addEventListener('input', (e) => {
                scale.x = parseFloat(e.target.value);
                const valueSpan = document.getElementById('scaleXValue');
                if (valueSpan) valueSpan.textContent = scale.x.toFixed(2);
            });
        }
        
        if (scaleYSlider) {
            scaleYSlider.addEventListener('input', (e) => {
                scale.y = parseFloat(e.target.value);
                const valueSpan = document.getElementById('scaleYValue');
                if (valueSpan) valueSpan.textContent = scale.y.toFixed(2);
            });
        }
        
        if (scaleZSlider) {
            scaleZSlider.addEventListener('input', (e) => {
                scale.z = parseFloat(e.target.value);
                const valueSpan = document.getElementById('scaleZValue');
                if (valueSpan) valueSpan.textContent = scale.z.toFixed(2);
            });
        }
        
        // Controles de posición
        const positionXSlider = document.getElementById('positionX');
        const positionYSlider = document.getElementById('positionY');
        const positionZSlider = document.getElementById('positionZ');
        
        if (positionXSlider) {
            positionXSlider.addEventListener('input', (e) => {
                position.x = parseFloat(e.target.value);
                const valueSpan = document.getElementById('positionXValue');
                if (valueSpan) valueSpan.textContent = position.x.toFixed(2);
            });
        }
        
        if (positionYSlider) {
            positionYSlider.addEventListener('input', (e) => {
                position.y = parseFloat(e.target.value);
                const valueSpan = document.getElementById('positionYValue');
                if (valueSpan) valueSpan.textContent = position.y.toFixed(2);
            });
        }
        
        if (positionZSlider) {
            positionZSlider.addEventListener('input', (e) => {
                position.z = parseFloat(e.target.value);
                const valueSpan = document.getElementById('positionZValue');
                if (valueSpan) valueSpan.textContent = position.z.toFixed(2);
            });
        }
        
        // Controles de color
        const modelColorPicker = document.getElementById('modelColor');
        const colorIntensitySlider = document.getElementById('colorIntensity');
        
        if (modelColorPicker) {
            modelColorPicker.addEventListener('input', (e) => {
                const color = hexToRgb(e.target.value);
                if (color) {
                    modelColor = [color.r / 255, color.g / 255, color.b / 255];
                    currentColor = modelColor;
                }
            });
        }
        
        if (colorIntensitySlider) {
            colorIntensitySlider.addEventListener('input', (e) => {
                colorIntensity = parseFloat(e.target.value);
                const valueSpan = document.getElementById('colorIntensityValue');
                if (valueSpan) valueSpan.textContent = colorIntensity.toFixed(2);
            });
        }
        
        // Controles de iluminación
        const lightDirXSlider = document.getElementById('lightDirX');
        const lightDirYSlider = document.getElementById('lightDirY');
        const lightDirZSlider = document.getElementById('lightDirZ');
        const lightColorPicker = document.getElementById('lightColor');
        const lightIntensitySlider = document.getElementById('lightIntensity');
        const ambientLightSlider = document.getElementById('ambientLight');
        
        if (lightDirXSlider) {
            lightDirXSlider.addEventListener('input', (e) => {
                lightDirection.x = parseFloat(e.target.value);
                const valueSpan = document.getElementById('lightDirXValue');
                if (valueSpan) valueSpan.textContent = lightDirection.x.toFixed(2);
            });
        }
        
        if (lightDirYSlider) {
            lightDirYSlider.addEventListener('input', (e) => {
                lightDirection.y = parseFloat(e.target.value);
                const valueSpan = document.getElementById('lightDirYValue');
                if (valueSpan) valueSpan.textContent = lightDirection.y.toFixed(2);
            });
        }
        
        if (lightDirZSlider) {
            lightDirZSlider.addEventListener('input', (e) => {
                lightDirection.z = parseFloat(e.target.value);
                const valueSpan = document.getElementById('lightDirZValue');
                if (valueSpan) valueSpan.textContent = lightDirection.z.toFixed(2);
            });
        }
        
        if (lightColorPicker) {
            lightColorPicker.addEventListener('input', (e) => {
                const color = hexToRgb(e.target.value);
                if (color) {
                    lightColor = [color.r / 255, color.g / 255, color.b / 255];
                }
            });
        }
        
        if (lightIntensitySlider) {
            lightIntensitySlider.addEventListener('input', (e) => {
                lightIntensity = parseFloat(e.target.value);
                const valueSpan = document.getElementById('lightIntensityValue');
                if (valueSpan) valueSpan.textContent = lightIntensity.toFixed(2);
            });
        }
        
        if (ambientLightSlider) {
            ambientLightSlider.addEventListener('input', (e) => {
                ambientLight = parseFloat(e.target.value);
                const valueSpan = document.getElementById('ambientLightValue');
                if (valueSpan) valueSpan.textContent = ambientLight.toFixed(2);
            });
        }
        
        // Botones de acción
        const resetControls = document.getElementById('resetControls');
        const savePreset = document.getElementById('savePreset');
        const loadPreset = document.getElementById('loadPreset');
        
        if (resetControls) {
            resetControls.addEventListener('click', resetAllControls);
        }
        
        if (savePreset) {
            savePreset.addEventListener('click', saveControlPreset);
        }
        
        if (loadPreset) {
            loadPreset.addEventListener('click', loadControlPreset);
        }
    }
    
    // Controles de ratón para rotación
    let mouseControls = {
        isDown: false,
        lastX: 0,
        lastY: 0,
        sensitivity: 0.01
    };
    
    // Añadir event listeners para controles de ratón
    canvas.addEventListener('mousedown', (e) => {
        mouseControls.isDown = true;
        mouseControls.lastX = e.clientX;
        mouseControls.lastY = e.clientY;
        canvas.style.cursor = 'grabbing';
        autoRotate = false; // Desactivar auto-rotación cuando se usa el ratón
        
        // Actualizar checkbox si existe
        const autoRotateCheckbox = document.getElementById('autoRotate');
        if (autoRotateCheckbox) {
            autoRotateCheckbox.checked = false;
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        mouseControls.isDown = false;
        canvas.style.cursor = 'grab';
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouseControls.isDown = false;
        canvas.style.cursor = 'grab';
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!mouseControls.isDown) return;
        
        const deltaX = e.clientX - mouseControls.lastX;
        const deltaY = e.clientY - mouseControls.lastY;
        
        // Rotar en Y (horizontal) y X (vertical)
        rotation.y += deltaX * mouseControls.sensitivity;
        rotation.x += deltaY * mouseControls.sensitivity;
        
        // Sincronizar con variables globales
        rotationY = rotation.y;
        rotationX = rotation.x;
        
        // Actualizar sliders si existen
        const rotationXSlider = document.getElementById('rotationX');
        const rotationYSlider = document.getElementById('rotationY');
        
        if (rotationXSlider) {
            rotationXSlider.value = (rotation.x * 180 / Math.PI).toFixed(0);
            const valueSpan = document.getElementById('rotationXValue');
            if (valueSpan) valueSpan.textContent = (rotation.x * 180 / Math.PI).toFixed(0) + '°';
        }
        
        if (rotationYSlider) {
            rotationYSlider.value = (rotation.y * 180 / Math.PI).toFixed(0);
            const valueSpan = document.getElementById('rotationYValue');
            if (valueSpan) valueSpan.textContent = (rotation.y * 180 / Math.PI).toFixed(0) + '°';
        }
        
        mouseControls.lastX = e.clientX;
        mouseControls.lastY = e.clientY;
    });
    
    // Configurar cursor inicial
    canvas.style.cursor = 'grab';
    
    // Función hexToRgb
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Función para resetear todos los controles
    function resetAllControls() {
        rotation = { x: 0, y: 0, z: 0 };
        scale = { x: 2, y:2, z: 2 };
        position = { x: 0, y: 0, z: 0 };
        modelColor = [1.0, 1.0, 1.0];
        colorIntensity = 1.0;
        lightDirection = { x: 0.5, y: 0.7, z: 0.5 }; // Valores más suaves
        lightColor = [1.0, 1.0, 1.0];
        lightIntensity = 1.0;
        ambientLight = 0.3;
        autoRotate = true;
        currentColor = [1, 0, 0];
        
        rotationX = 0;
        rotationY = 0;
        rotationZ = 0;
        
        updateAllControlsUI();
    }
    
    // Función para actualizar UI
    function updateAllControlsUI() {
        const elements = [
            { id: 'rotationX', value: rotation.x * 180 / Math.PI, display: 'rotationXValue', suffix: '°' },
            { id: 'rotationY', value: rotation.y * 180 / Math.PI, display: 'rotationYValue', suffix: '°' },
            { id: 'rotationZ', value: rotation.z * 180 / Math.PI, display: 'rotationZValue', suffix: '°' },
            { id: 'scaleX', value: scale.x, display: 'scaleXValue' },
            { id: 'scaleY', value: scale.y, display: 'scaleYValue' },
            { id: 'scaleZ', value: scale.z, display: 'scaleZValue' },
            { id: 'positionX', value: position.x, display: 'positionXValue' },
            { id: 'positionY', value: position.y, display: 'positionYValue' },
            { id: 'positionZ', value: position.z, display: 'positionZValue' },
            { id: 'colorIntensity', value: colorIntensity, display: 'colorIntensityValue' },
            { id: 'lightDirX', value: lightDirection.x, display: 'lightDirXValue' },
            { id: 'lightDirY', value: lightDirection.y, display: 'lightDirYValue' },
            { id: 'lightDirZ', value: lightDirection.z, display: 'lightDirZValue' },
            { id: 'lightIntensity', value: lightIntensity, display: 'lightIntensityValue' },
            { id: 'ambientLight', value: ambientLight, display: 'ambientLightValue' }
        ];
        
        elements.forEach(elem => {
            const slider = document.getElementById(elem.id);
            const display = document.getElementById(elem.display);
            if (slider) {
                slider.value = elem.value;
                if (display) {
                    display.textContent = elem.value.toFixed(elem.suffix ? 0 : 2) + (elem.suffix || '');
                }
            }
        });
        
        const autoRotateCheckbox = document.getElementById('autoRotate');
        if (autoRotateCheckbox) {
            autoRotateCheckbox.checked = autoRotate;
        }
        
        const oldColorPicker = document.getElementById('colorPicker');
        if (oldColorPicker) {
            const r = Math.round(currentColor[0] * 255).toString(16).padStart(2, '0');
            const g = Math.round(currentColor[1] * 255).toString(16).padStart(2, '0');
            const b = Math.round(currentColor[2] * 255).toString(16).padStart(2, '0');
            oldColorPicker.value = `#${r}${g}${b}`;
        }
    }
    
    // Función para guardar preset
    function saveControlPreset() {
        const preset = {
            rotation, scale, position, modelColor, colorIntensity,
            lightDirection, lightColor, lightIntensity, ambientLight, autoRotate
        };
        localStorage.setItem('webglControlPreset', JSON.stringify(preset));
        alert('Preset saved successfully!');
    }
    
    // Función para cargar preset
    function loadControlPreset() {
        const savedPreset = localStorage.getItem('webglControlPreset');
        if (savedPreset) {
            try {
                const preset = JSON.parse(savedPreset);
                rotation = preset.rotation || { x: 0, y: 0, z: 0 };
                scale = preset.scale || { x: 1, y: 1, z: 1 };
                position = preset.position || { x: 0, y: 0, z: 0 };
                modelColor = preset.modelColor || [1.0, 1.0, 1.0];
                colorIntensity = preset.colorIntensity || 1.0;
                lightDirection = preset.lightDirection || { x: 1, y: 1, z: 1 };
                lightColor = preset.lightColor || [1.0, 1.0, 1.0];
                lightIntensity = preset.lightIntensity || 1.0;
                ambientLight = preset.ambientLight || 0.3;
                autoRotate = preset.autoRotate !== undefined ? preset.autoRotate : true;
                
                rotationX = rotation.x;
                rotationY = rotation.y;
                rotationZ = rotation.z;
                currentColor = modelColor;
                
                updateAllControlsUI();
                alert('Preset loaded successfully!');
            } catch (error) {
                alert('Error loading preset: ' + error.message);
            }
        } else {
            alert('No saved preset found');
        }
    }
    
    // Función de renderizado
    function render() {
        // Auto rotation if enabled - only rotate on Y to spin on its axis
        if (autoRotate) {
            rotationY += 0.02; // Only Y rotation to spin on itself
        }
        
        // Skip rendering if model not loaded yet
        if (!modelLoaded || !modelData) {
            requestAnimationFrame(render);
            return;
        }
        
        // Configure viewport
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        // Clear
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        
        // Use program
        gl.useProgram(program);
        
        // Projection matrix
        const projectionMatrix = createPerspectiveMatrix(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
        
        // Model-view matrix - CORRECT ORDER: Scale, Rotate, then Translate
        const modelViewMatrix = createIdentityMatrix();
        
        // 1. FIRST: Scale the model using control values
        const scaleValues = [0.6 * scale.x, 0.6 * scale.y, 0.6 * scale.z];
        scaleMatrix(modelViewMatrix, scaleValues);
        
        // 2. SECOND: Apply rotations - model spins on its OWN axis
        rotateMatrix(modelViewMatrix, rotationY, [0, 1, 0]); // Y axis
        rotateMatrix(modelViewMatrix, rotationX, [1, 0, 0]); // X axis  
        rotateMatrix(modelViewMatrix, rotationZ, [0, 0, 1]); // Z axis
        
        // 3. LAST: Move the model using position controls
        const finalPosition = [position.x, position.y, -2 + position.z];
        translateMatrix(modelViewMatrix, finalPosition);
        
        // Normal matrix (for lighting)
        const normalMatrix = createIdentityMatrix();
        rotateMatrix(normalMatrix, rotationY, [0, 1, 0]);
        rotateMatrix(normalMatrix, rotationX, [1, 0, 0]);
        rotateMatrix(normalMatrix, rotationZ, [0, 0, 1]);
        
        // Setup position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        
        // Setup normal attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
        
        // Setup texture coordinate attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, modelData.uvBuffer);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocation, 0);
        
        // Setup uniforms
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
        gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix);
        
        // Color uniforms using control values
        const finalColor = [
            currentColor[0] * colorIntensity,
            currentColor[1] * colorIntensity,
            currentColor[2] * colorIntensity
        ];
        gl.uniform3fv(colorOverrideLocation, finalColor);
        gl.uniform1f(useOverrideLocation, 0.3); // Less override to show texture
        
        // Lighting uniforms using control values - sin normalizar para mejor control
        const lightDir = [lightDirection.x, lightDirection.y, lightDirection.z];
        const scaledLightColor = [
            lightColor[0] * lightIntensity,
            lightColor[1] * lightIntensity,
            lightColor[2] * lightIntensity
        ];
        const ambientColor = [ambientLight, ambientLight, ambientLight];
        
        gl.uniform3fv(lightDirectionLocation, lightDir);
        gl.uniform3fv(lightColorLocation, scaledLightColor);
        gl.uniform3fv(ambientColorLocation, ambientColor);
        
        // Draw model
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelData.indexBuffer);
        gl.drawElements(gl.TRIANGLES, modelData.vertexCount, gl.UNSIGNED_SHORT, 0);
        
        requestAnimationFrame(render);
    }
    
    // Start loading the model
    loadModel();
    
    render();
}

// Funciones auxiliares para matrices
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linkando programa:', gl.getProgramInfoLog(program));
        return null;
    }
    
    return program;
}

function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function createPerspectiveMatrix(fovy, aspect, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fovy);
    const rangeInv = 1.0 / (near - far);
    
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ]);
}

function scaleMatrix(matrix, scale) {
    const scaleMatrix = new Float32Array([
        scale[0], 0, 0, 0,
        0, scale[1], 0, 0,
        0, 0, scale[2], 0,
        0, 0, 0, 1
    ]);
    
    // Multiply: result = matrix * scaleMatrix
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += matrix[i * 4 + k] * scaleMatrix[k * 4 + j];
            }
            result[i * 4 + j] = sum;
        }
    }
    
    // Copy result back to matrix
    for (let i = 0; i < 16; i++) {
        matrix[i] = result[i];
    }
}

function translateMatrix(matrix, translation) {
    const translateMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translation[0], translation[1], translation[2], 1
    ]);
    
    // Multiply: result = matrix * translateMatrix
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += matrix[i * 4 + k] * translateMatrix[k * 4 + j];
            }
            result[i * 4 + j] = sum;
        }
    }
    
    // Copy result back to matrix
    for (let i = 0; i < 16; i++) {
        matrix[i] = result[i];
    }
}

function rotateMatrix(matrix, angle, axis) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const x = axis[0], y = axis[1], z = axis[2];
    
    const rotMatrix = new Float32Array([
        c + x*x*(1-c), x*y*(1-c) - z*s, x*z*(1-c) + y*s, 0,
        y*x*(1-c) + z*s, c + y*y*(1-c), y*z*(1-c) - x*s, 0,
        z*x*(1-c) - y*s, z*y*(1-c) + x*s, c + z*z*(1-c), 0,
        0, 0, 0, 1
    ]);
    
    // Multiply: result = matrix * rotMatrix
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += matrix[i * 4 + k] * rotMatrix[k * 4 + j];
            }
            result[i * 4 + j] = sum;
        }
    }
    
    // Copy result back to matrix
    for (let i = 0; i < 16; i++) {
        matrix[i] = result[i];
    }
}

function multiplyMatrix(a, b) {
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += a[i * 4 + k] * b[k * 4 + j];
            }
            result[i * 4 + j] = sum;
        }
    }
    
    for (let i = 0; i < 16; i++) {
        a[i] = result[i];
    }
}

function normalizeVector(vector) {
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    if (length === 0) return [0, 0, 1]; // Default direction
    return [vector[0] / length, vector[1] / length, vector[2] / length];
}

// Personal Messages System
class PersonalMessagesSystem {
    constructor() {
        this.messagesContainer = document.getElementById('personal-messages');
        this.currentStates = {
            blueColor: false,
            zRotation: false,
            highLight: false
        };
        this.lastZRotation = 0;
        this.lastLightIntensity = 0;
        this.messageTimeouts = {};
        
        this.initializeWatchers();
    }
    
    initializeWatchers() {
        // Watch color picker for blue color
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.checkBlueColor(e.target.value);
            });
        }
        
        // Watch Z rotation
        const rotationZ = document.getElementById('rotationZ');
        if (rotationZ) {
            rotationZ.addEventListener('input', (e) => {
                this.checkZRotation(parseFloat(e.target.value));
            });
        }
        
        // Watch light direction values
        const lightIntensity = document.getElementById('lightIntensity');

        if (lightIntensity) {
            lightIntensity.addEventListener('input', (e) => {
                this.checkLightIntensity(parseFloat(e.target.value));
            });
        }
    }
    
    checkBlueColor(colorValue) {
        // Convert hex to RGB and check if it's predominantly blue
        const r = parseInt(colorValue.substr(1, 2), 16);
        const g = parseInt(colorValue.substr(3, 2), 16);
        const b = parseInt(colorValue.substr(5, 2), 16);
        
        const isBlue = b > 150 && b > r && b > g;
        
        if (isBlue && !this.currentStates.blueColor) {
            this.showMessage('xbox', '🎮 My first console was the original Xbox with Jet Set Radio Future! Those graphics marked me forever and inspired me to pursue computer graphics.', 'blue');
            this.currentStates.blueColor = true;
        } else if (!isBlue) {
            this.currentStates.blueColor = false;
        }
    }
    
    checkZRotation(rotation) {
        const rotationChange = Math.abs(rotation - this.lastZRotation);
        
        if (rotationChange > 0.5 && !this.currentStates.zRotation) {
            this.showMessage('rotation', '😵‍💫 Oops! I get dizzy easily and have a terrible sense of direction. Please don\'t make me rotate too much!', 'orange');
            this.currentStates.zRotation = true;
            
            // Reset state after 3 seconds
            setTimeout(() => {
                this.currentStates.zRotation = false;
            }, 3000);
        }
        
        this.lastZRotation = rotation;
    }
    
    checkLightIntensity(intensity) {
        if (intensity > 0.7 && !this.currentStates.highLight) {
            this.showMessage('light', '✨ I\'m a light lover and offline ray tracing enthusiast! "Ray tracing" is one of my favorite words. Realistic lighting is pure visual magic.', 'yellow');
            this.currentStates.highLight = true;
            
            // Reset state after 4 seconds
            setTimeout(() => {
                this.currentStates.highLight = false;
            }, 4000);
        } else if (intensity <= 0.5) {
            this.currentStates.highLight = false;
        }
    }
    
    showMessage(messageId, text, color) {
        // Clear existing timeout for this message
        if (this.messageTimeouts[messageId]) {
            clearTimeout(this.messageTimeouts[messageId]);
        }
        
        // Remove existing message if any
        const existing = document.getElementById(`message-${messageId}`);
        if (existing) {
            existing.remove();
        }
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.id = `message-${messageId}`;
        messageDiv.className = `personal-message ${color}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <button class="close-message" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add message to container
        this.messagesContainer.appendChild(messageDiv);
        
        // Auto-hide after 8 seconds
        this.messageTimeouts[messageId] = setTimeout(() => {
            if (messageDiv && messageDiv.parentElement) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    messageDiv.remove();
                }, 300);
            }
        }, 8000);
        
        // Animate in
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Initialize the personal messages system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new PersonalMessagesSystem();
    }, 1000); // Wait a bit for WebGL to initialize
});

// Random effects for Alfonso's image
document.addEventListener('DOMContentLoaded', () => {
    const alfonsoImage = document.querySelector('.hero-image');
    if (alfonsoImage) {
        const effects = [
            { transform: 'scale(1.1) rotate(5deg)', filter: 'hue-rotate(45deg)' },
            { transform: 'scale(1.15) rotate(-3deg)', filter: 'hue-rotate(90deg) saturate(1.5)' },
            { transform: 'scale(1.08) rotate(2deg)', filter: 'hue-rotate(180deg) brightness(1.2)' },
            { transform: 'scale(1.12) rotate(-5deg)', filter: 'hue-rotate(270deg) contrast(1.3)' },
            { transform: 'scale(1.1) rotate(3deg)', filter: 'hue-rotate(360deg) saturate(1.3) brightness(1.1)' },
            { transform: 'scale(1.13) rotate(-2deg)', filter: 'hue-rotate(120deg) sepia(0.3)' },
            { transform: 'scale(1.09) rotate(4deg)', filter: 'hue-rotate(240deg) invert(0.1)' },
            { transform: 'scale(1.11) rotate(-1deg)', filter: 'hue-rotate(60deg) blur(0.5px)' }
        ];
        
        let isHovering = false;
        let resetTimeout = null;
        
        function resetImage() {
            alfonsoImage.style.transform = '';
            alfonsoImage.style.filter = '';
            alfonsoImage.style.transition = '';
        }
        
        function applyRandomEffect() {
            if (!isHovering) return;
            
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            
            // Clear any existing styles and force reset
            resetImage();
            
            // Use requestAnimationFrame to ensure the reset is processed
            requestAnimationFrame(() => {
                if (!isHovering) return;
                
                alfonsoImage.style.transition = 'all 0.3s ease';
                alfonsoImage.style.transform = randomEffect.transform;
                alfonsoImage.style.filter = randomEffect.filter;
            });
        }
        
        alfonsoImage.addEventListener('mouseenter', () => {
            isHovering = true;
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }
            applyRandomEffect();
        });
        
        alfonsoImage.addEventListener('mouseleave', () => {
            isHovering = false;
            
            // Apply reset with transition
            alfonsoImage.style.transition = 'all 0.3s ease';
            alfonsoImage.style.transform = 'scale(1)';
            alfonsoImage.style.filter = 'none';
            
            // Complete reset after transition
            resetTimeout = setTimeout(() => {
                if (!isHovering) {
                    resetImage();
                }
            }, 350);
        });
    }
});

// Cursor Light Effect for Professional Skills Section
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.getElementById('skills-features');
    if (skillsSection) {
        const lightEffect = skillsSection;
        
        skillsSection.addEventListener('mousemove', (e) => {
            const rect = skillsSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update the position of the light effect
            lightEffect.style.setProperty('--mouse-x', x + 'px');
            lightEffect.style.setProperty('--mouse-y', y + 'px');
            
            // Show the light effect
            const afterElement = window.getComputedStyle(lightEffect, '::after');
            lightEffect.style.setProperty('--light-opacity', '1');
        });
        
        skillsSection.addEventListener('mouseleave', () => {
            // Hide the light effect when mouse leaves
            lightEffect.style.setProperty('--light-opacity', '0');
        });
        
        skillsSection.addEventListener('mouseenter', () => {
            // Show the light effect when mouse enters
            lightEffect.style.setProperty('--light-opacity', '1');
        });
    }
});
