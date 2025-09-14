// Blog JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Demo launch functionality
    const featuredExpandBtn = document.querySelector('.featured-expand-btn');
    const expandedContent = document.querySelector('.expanded-content');
    let isExpanded = false;

    if (featuredExpandBtn && expandedContent) {
        // Soporte para PC
        featuredExpandBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleExpandedContent();
        });
        
        // Soporte táctil para dispositivos móviles
        featuredExpandBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleExpandedContent();
        });
        
        // Estilo para feedback táctil
        featuredExpandBtn.style.webkitTapHighlightColor = 'transparent';
        featuredExpandBtn.style.touchAction = 'manipulation';
    }

    function toggleExpandedContent() {
        if (!isExpanded) {
            // Expand
            expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
            expandedContent.classList.add('active');
            featuredExpandBtn.textContent = '← Show Less';
            isExpanded = true;
            
            // Smooth scroll to expanded content after animation
            setTimeout(() => {
                const cardRect = document.querySelector('.featured-card').getBoundingClientRect();
                const headerOffset = 100;
                const scrollPosition = window.pageYOffset + cardRect.top - headerOffset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 300);
            
        } else {
            // Collapse
            expandedContent.style.maxHeight = '0px';
            expandedContent.classList.remove('active');
            featuredExpandBtn.textContent = 'Read More →';
            isExpanded = false;
            
            // Scroll back to the card
            setTimeout(() => {
                const cardRect = document.querySelector('.featured-card').getBoundingClientRect();
                const headerOffset = 100;
                const scrollPosition = window.pageYOffset + cardRect.top - headerOffset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Demo launch button functionality
    const demoLaunchBtn = document.querySelector('.demo-launch-btn');
    const demoCanvasContainer = document.querySelector('.demo-canvas-container');
    const demoCloseBtn = document.querySelector('.demo-close-btn');
    const webglCanvas = document.getElementById('webgl-demo-canvas');
    
    if (demoLaunchBtn && demoCanvasContainer) {
        demoLaunchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            launchWebGLDemo();
        });
    }
    
    if (demoCloseBtn) {
        demoCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeWebGLDemo();
        });
    }
    
    function launchWebGLDemo() {
        demoCanvasContainer.style.display = 'block';
        demoLaunchBtn.textContent = 'Demo Running...';
        demoLaunchBtn.disabled = true;
        
        // Scroll to canvas
        setTimeout(() => {
            demoCanvasContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
        
        // Initialize WebGL
        initWebGL();
    }
    
    function closeWebGLDemo() {
        demoCanvasContainer.style.display = 'none';
        demoLaunchBtn.textContent = '🚀 Launch Interactive Demo';
        demoLaunchBtn.disabled = false;
        
        // Stop WebGL animation
        if (window.webglAnimationId) {
            cancelAnimationFrame(window.webglAnimationId);
            window.webglAnimationId = null;
        }
    }

    // Share buttons functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent;
            
            if (buttonText.includes('Share')) {
                // Email share
                const subject = encodeURIComponent('Check out this graphics programming demo');
                const body = encodeURIComponent('I found this interesting graphics programming demo: ' + window.location.href);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            } else if (buttonText.includes('Copy')) {
                // Copy link
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                }).catch(() => {
                    showNotification('Could not copy link. Please copy manually.', 'error');
                });
            }
        });
    });

    // Contact links functionality
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        if (link.href === '#' || !link.href.includes('mailto:')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Contact information will be updated soon!', 'info');
            });
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '600',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        });

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #4caf50, #81c784)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #f44336, #e57373)';
                break;
            case 'info':
            default:
                notification.style.background = 'linear-gradient(45deg, #00ffff, #0080ff)';
                break;
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Scroll animations for content cards
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

    // Apply animation to cards
    const animatedElements = document.querySelectorAll('.featured-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    console.log('Simple blog functionality initialized successfully!');
    
    // WebGL Demo Implementation
    function initWebGL() {
        const canvas = document.getElementById('webgl-demo-canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            showNotification('WebGL not supported in this browser!', 'error');
            return;
        }
        
        // Vertex shader source
        const vertexShaderSource = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            varying lowp vec4 vColor;
            
            void main(void) {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
            }
        `;
        
        // Fragment shader source
        const fragmentShaderSource = `
            varying lowp vec4 vColor;
            
            void main(void) {
                gl_FragColor = vColor;
            }
        `;
        
        // Create shader function
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
        
        // Create shader program
        function createShaderProgram(gl, vsSource, fsSource) {
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
            
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.error('Error linking shader program:', gl.getProgramInfoLog(shaderProgram));
                return null;
            }
            
            return shaderProgram;
        }
        
        // Initialize shaders
        const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
        
        // Create cube vertices
        const positions = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];
        
        // Colors for each face
        const faceColors = [
            [1.0, 0.0, 1.0, 1.0],    // Front face: magenta
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [0.0, 1.0, 1.0, 1.0],    // Left face: cyan
        ];
        
        let colors = [];
        for (let j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
        }
        
        // Cube indices
        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];
        
        // Create buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        const buffers = {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
        
        // Matrix utilities
        function mat4Create() {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        
        function mat4Perspective(out, fovy, aspect, near, far) {
            const f = 1.0 / Math.tan(fovy / 2);
            const nf = 1 / (near - far);
            
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * far * near) * nf;
            out[15] = 0;
            
            return out;
        }
        
        function mat4Translate(out, a, v) {
            const x = v[0], y = v[1], z = v[2];
            
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            
            return out;
        }
        
        function mat4RotateY(out, a, rad) {
            const s = Math.sin(rad);
            const c = Math.cos(rad);
            const a00 = a[0];
            const a01 = a[1];
            const a02 = a[2];
            const a03 = a[3];
            const a20 = a[8];
            const a21 = a[9];
            const a22 = a[10];
            const a23 = a[11];
            
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            
            return out;
        }
        
        function mat4RotateX(out, a, rad) {
            const s = Math.sin(rad);
            const c = Math.cos(rad);
            const a10 = a[4];
            const a11 = a[5];
            const a12 = a[6];
            const a13 = a[7];
            const a20 = a[8];
            const a21 = a[9];
            const a22 = a[10];
            const a23 = a[11];
            
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            
            return out;
        }
        
        // Animation variables
        let rotation = 0.0;
        
        // Draw scene
        function drawScene() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            const fieldOfView = 45 * Math.PI / 180;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;
            const projectionMatrix = mat4Create();
            
            mat4Perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
            
            const modelViewMatrix = mat4Create();
            mat4Translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
            mat4RotateX(modelViewMatrix, modelViewMatrix, rotation * 0.7);
            mat4RotateY(modelViewMatrix, modelViewMatrix, rotation);
            
            // Bind position buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
            
            // Bind color buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
            
            // Bind index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
            
            // Use our shader program
            gl.useProgram(programInfo.program);
            
            // Set uniforms
            gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
            gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
            
            // Draw the cube
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
            
            // Update rotation
            rotation += 0.01;
            
            // Continue animation
            window.webglAnimationId = requestAnimationFrame(drawScene);
        }
        
        // Start animation
        drawScene();
        showNotification('WebGL demo launched successfully!', 'success');
    }
});