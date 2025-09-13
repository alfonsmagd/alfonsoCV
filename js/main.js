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
    
    // Vertex shader for 3D cube
    const vertexShaderSource = `
        attribute vec3 a_position;
        attribute vec3 a_color;
        
        uniform mat4 u_modelViewMatrix;
        uniform mat4 u_projectionMatrix;
        
        varying vec3 v_color;
        
        void main() {
            gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
            v_color = a_color;
        }
    `;
    
    const fragmentShaderSource = `
        precision mediump float;
        varying vec3 v_color;
        uniform vec3 u_colorOverride;
        uniform float u_useOverride;
        
        void main() {
            vec3 finalColor = mix(v_color, u_colorOverride, u_useOverride);
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    
    // Crear shaders y programa
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    
    // Cube vertices with more vibrant colors
    const vertices = new Float32Array([
        // Front face (cyan brillante)
        -1, -1,  1,   0, 1, 1,
         1, -1,  1,   0, 1, 1,
         1,  1,  1,   0, 1, 1,
        -1,  1,  1,   0, 1, 1,
        
        // Back face (azul brillante)
        -1, -1, -1,   0, 0.5, 1,
        -1,  1, -1,   0, 0.5, 1,
         1,  1, -1,   0, 0.5, 1,
         1, -1, -1,   0, 0.5, 1,
        
        // Top face (verde brillante)
        -1,  1, -1,   0, 1, 0.5,
        -1,  1,  1,   0, 1, 0.5,
         1,  1,  1,   0, 1, 0.5,
         1,  1, -1,   0, 1, 0.5,
        
        // Bottom face (amarillo brillante)
        -1, -1, -1,   1, 1, 0,
         1, -1, -1,   1, 1, 0,
         1, -1,  1,   1, 1, 0,
        -1, -1,  1,   1, 1, 0,
        
        // Right face (magenta brillante)
         1, -1, -1,   1, 0, 1,
         1,  1, -1,   1, 0, 1,
         1,  1,  1,   1, 0, 1,
         1, -1,  1,   1, 0, 1,
        
        // Left face (naranja brillante)
        -1, -1, -1,   1, 0.5, 0,
        -1, -1,  1,   1, 0.5, 0,
        -1,  1,  1,   1, 0.5, 0,
        -1,  1, -1,   1, 0.5, 0
    ]);
    
    // Índices para formar triángulos
    const indices = new Uint16Array([
         0,  1,  2,    0,  2,  3,    // front
         4,  5,  6,    4,  6,  7,    // back
         8,  9, 10,    8, 10, 11,    // top
        12, 13, 14,   12, 14, 15,    // bottom
        16, 17, 18,   16, 18, 19,    // right
        20, 21, 22,   20, 22, 23     // left
    ]);
    
    // Crear buffers
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
    // Obtener ubicaciones
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const colorOverrideLocation = gl.getUniformLocation(program, 'u_colorOverride');
    const useOverrideLocation = gl.getUniformLocation(program, 'u_useOverride');
    
    // Rotation variables
    let rotationX = 0;
    let rotationY = 0;
    let rotationZ = 0; // Add Z rotation
    let autoRotate = true;
    let currentColor = [1, 0, 0]; // rojo por defecto para que se note el cambio    
    
    // Event listeners para controles
    const rotationXSlider = document.getElementById('rotationX');
    const rotationYSlider = document.getElementById('rotationY');  
    const colorPicker = document.getElementById('colorPicker');
    const resetButton = document.getElementById('resetDemo');
    
    if (rotationXSlider) {
        rotationXSlider.addEventListener('input', (e) => {
            rotationX = parseFloat(e.target.value) * Math.PI / 180;
            autoRotate = false;
        });
    }
    
    if (rotationYSlider) {
        rotationYSlider.addEventListener('input', (e) => {
            rotationY = parseFloat(e.target.value) * Math.PI / 180;
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
            if (colorPicker) colorPicker.value = '#ff0000';
        });
    }
    
    // Función de renderizado
    function render() {
        // Auto rotation if enabled - only rotate on Y to spin on its axis
        if (autoRotate) {
            rotationY += 0.02; // Only Y rotation to spin on itself
        }
        
        // Configurar viewport
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        // Limpiar
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        
        // Usar programa
        gl.useProgram(program);
        
        // Projection matrix
        const projectionMatrix = createPerspectiveMatrix(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
        
        // Model-view matrix - CORRECT ORDER: Rotate first, then move
        const modelViewMatrix = createIdentityMatrix();
        
        // 1. FIRST: Apply rotations at origin (0,0,0) - cube spins on itself
        rotateMatrix(modelViewMatrix, rotationY, [0, 1, 0]); // Eje Y
        rotateMatrix(modelViewMatrix, rotationX, [1, 0, 0]); // Eje X
        rotateMatrix(modelViewMatrix, rotationZ, [0, 0, 1]); // Eje Z
        
        // 2. AFTER: Move the cube away from the camera
        translateMatrix(modelViewMatrix, [0, 0, -5]);


        
        // Configurar atributos
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 24, 0);
        
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 24, 12);
        
        // Configurar uniforms
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
        gl.uniform3fv(colorOverrideLocation, currentColor);
        gl.uniform1f(useOverrideLocation, 0.8); // Aumentar override para que el color se vea más
        
        // Dibujar
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        
        requestAnimationFrame(render);
    }
    
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

function translateMatrix(matrix, translation) {
    matrix[12] += translation[0];
    matrix[13] += translation[1];
    matrix[14] += translation[2];
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
    
    multiplyMatrix(matrix, rotMatrix);
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
