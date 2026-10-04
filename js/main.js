'use strict';

// Keep navigation useful even when the 3D portrait is unavailable.
const links = [...document.querySelectorAll('.nav-link')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let navigationFrame = 0;
function updateNavigation() {
    navigationFrame = 0;
    const marker = window.innerWidth <= 700 ? 150 : 170;
    let current = sections[0];
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
    }
    for (const link of links) {
        const active = link.hash === `#${current.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }
}
window.addEventListener('scroll', () => {
    if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
document.getElementById('year').textContent = new Date().getFullYear();

async function initPortrait() {
    const canvas = document.getElementById('webglCanvas');
    const status = document.getElementById('avatar-status');
    const hint = document.getElementById('avatar-hint');
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    const showError = message => {
        status.textContent = message;
        status.hidden = false;
        hint.textContent = 'Alfonso Mateos · 3D portrait';
        canvas.removeAttribute('tabindex');
        canvas.style.cursor = 'default';
    };
    if (!gl) {
        showError('The 3D portrait is not available in this browser.');
        return;
    }
    let ready = false;
    let contextLost = false;
    let frame = 0;
    let program;
    let texture;
    const buffers = [];
    function shader(type, source) {
        const result = gl.createShader(type);
        gl.shaderSource(result, source);
        gl.compileShader(result);
        if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
            const message = gl.getShaderInfoLog(result);
            gl.deleteShader(result);
            throw new Error(message);
        }
        return result;
    }
    canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        contextLost = true;
        ready = false;
        cancelAnimationFrame(frame);
        frame = 0;
        showError('The 3D view was interrupted. Reload the page to restore it.');
    });
    try {
        const vertex = shader(gl.VERTEX_SHADER, `
            attribute vec3 a_position;
            attribute vec3 a_normal;
            attribute vec2 a_uv;
            uniform vec2 u_rotation;
            uniform mat4 u_projection;
            varying vec3 v_normal;
            varying vec2 v_uv;
            void main() {
                float cx = cos(u_rotation.x), sx = sin(u_rotation.x);
                float cy = cos(u_rotation.y), sy = sin(u_rotation.y);
                mat3 rx = mat3(1.,0.,0., 0.,cx,sx, 0.,-sx,cx);
                mat3 ry = mat3(cy,0.,-sy, 0.,1.,0., sy,0.,cy);
                mat3 rotation = rx * ry;
                vec3 position = rotation * a_position;
                position.z -= 3.65;
                gl_Position = u_projection * vec4(position, 1.);
                v_normal = rotation * a_normal;
                v_uv = a_uv;
            }
        `);
        const fragment = shader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            uniform sampler2D u_texture;
            uniform vec3 u_lightDirection;
            uniform vec3 u_lightColor;
            uniform vec3 u_fillColor;
            uniform float u_lightIntensity;
            varying vec3 v_normal;
            varying vec2 v_uv;
            void main() {
                vec3 tex = texture2D(u_texture, v_uv).rgb;
                float grey = dot(tex, vec3(.299, .587, .114));
                vec3 base = mix(vec3(grey), tex, .12);
                vec3 n = normalize(v_normal);
                float diffuse = max(dot(n, normalize(u_lightDirection)), 0.);
                vec3 fillDirection = normalize(vec3(-u_lightDirection.x, .25, .7));
                float fill = max(dot(n, fillDirection), 0.) * .18;
                float rim = pow(1. - abs(n.z), 3.) * .08;
                vec3 lighting = vec3(.40) + u_lightColor * diffuse * u_lightIntensity + u_fillColor * fill;
                gl_FragColor = vec4(base * lighting + u_fillColor * rim, 1.);
            }
        `);
        program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));

        // Relative URLs work at /, /index.html and GitHub Pages /alfonsoCV/.
        const model = await new OBJLoader().loadOBJ(new URL('assets/model3D/avatar_final_refined_texturized.obj', document.baseURI));
        if (!model || !model.vertexCount) throw new Error('The portrait has no geometry.');
        texture = await loadTexture(gl, new URL('assets/model3D/avatar_final_refined_color.png', document.baseURI));
        if (contextLost) return;
        const min = [Infinity, Infinity, Infinity];
        const max = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < model.positions.length; i++) {
            min[i % 3] = Math.min(min[i % 3], model.positions[i]);
            max[i % 3] = Math.max(max[i % 3], model.positions[i]);
        }
        const center = min.map((value, i) => (value + max[i]) / 2);
        const size = Math.max(...max.map((value, i) => value - min[i]));
        if (!Number.isFinite(size) || size <= 0) throw new Error('Invalid portrait dimensions.');
        for (let i = 0; i < model.positions.length; i++) {
            model.positions[i] = (model.positions[i] - center[i % 3]) * 2.3 / size;
        }
        gl.useProgram(program);
        for (const [name, data, size] of [['a_position', model.positions, 3], ['a_normal', model.normals, 3], ['a_uv', model.uvs, 2]]) {
            const buffer = gl.createBuffer();
            buffers.push(buffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            const location = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);
        const rotationLocation = gl.getUniformLocation(program, 'u_rotation');
        const projectionLocation = gl.getUniformLocation(program, 'u_projection');
        const lightDirectionLocation = gl.getUniformLocation(program, 'u_lightDirection');
        const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor');
        const fillColorLocation = gl.getUniformLocation(program, 'u_fillColor');
        const lightIntensityLocation = gl.getUniformLocation(program, 'u_lightIntensity');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const neutralLighting = [-.4, .7, 1, 1, 1, 1, .57, .79, .80, .65];
        let lightCurrent = [...neutralLighting];
        let lightFrom = [...neutralLighting], lightTarget = [...neutralLighting];
        let lightStart = -Infinity, lastLightChange = -Infinity, rotationTravel = 0;
        const lightPalette = [[.55, .93, 1], [1, .80, .62], [.80, .73, 1], [1, 1, 1]];

        function changeLighting(previousYaw, previousPitch, reset = false) {
            rotationTravel += Math.abs(yaw - previousYaw) + Math.abs(pitch - previousPitch);
            const now = performance.now();
            if (reset) {
                lightTarget = [...neutralLighting];
                rotationTravel = 0;
                lastLightChange = -Infinity;
            } else {
                if (rotationTravel < .001) return;
                // Change on the first movement, then at most five times per second.
                // Interpolation keeps even fast dragging free of abrupt flashes.
                if (lastLightChange !== -Infinity && (rotationTravel < .45 || now - lastLightChange < 200)) return;
                const keyColor = lightPalette[Math.floor(Math.random() * lightPalette.length)];
                const fillColor = lightPalette[Math.floor(Math.random() * lightPalette.length)];
                lightTarget = [Math.random() * 2.6 - 1.3, .15 + Math.random(), .5 + Math.random(),
                    ...keyColor, ...fillColor, .60 + Math.random() * .25];
                rotationTravel = 0;
                lastLightChange = now;
            }
            lightFrom = [...lightCurrent];
            lightStart = now;
        }
        let yaw = 0, pitch = 0;
        let pointer = null, previousX = 0, previousY = 0;
        function render(now = performance.now()) {
            frame = 0;
            if (!ready || contextLost || document.hidden) return;
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
            const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            gl.viewport(0, 0, width, height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            // Fit narrower canvases without cropping the portrait.
            const f = 1 / Math.tan(Math.PI / 8) * Math.min(1, width / height);
            gl.uniformMatrix4fv(projectionLocation, false, new Float32Array([
                f / (width / height),0,0,0, 0,f,0,0,
                0,0,-1.002,-1, 0,0,-.2002,0
            ]));
            gl.uniform2f(rotationLocation, pitch, yaw);
            const blend = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (now - lightStart) / 450));
            const eased = blend * blend * (3 - 2 * blend);
            lightCurrent = lightTarget.map((value, i) => lightFrom[i] + (value - lightFrom[i]) * eased);
            gl.uniform3fv(lightDirectionLocation, lightCurrent.slice(0, 3));
            gl.uniform3fv(lightColorLocation, lightCurrent.slice(3, 6));
            gl.uniform3fv(fillColorLocation, lightCurrent.slice(6, 9));
            gl.uniform1f(lightIntensityLocation, lightCurrent[9]);
            // OBJLoader expands every triangle: drawArrays avoids 16-bit index overflow.
            gl.drawArrays(gl.TRIANGLES, 0, model.vertexCount);
            // Stop rendering after the lighting transition settles.
            if (blend < 1) requestRender();
        }
        function requestRender() {
            if (ready && !frame && !document.hidden) frame = requestAnimationFrame(render);
        }
        canvas.addEventListener('pointerdown', event => {
            if (!event.isPrimary || event.button !== 0 || !ready) return;
            pointer = event.pointerId;
            previousX = event.clientX;
            previousY = event.clientY;
            canvas.setPointerCapture(pointer);
        });
        canvas.addEventListener('pointermove', event => {
            if (event.pointerId !== pointer) return;
            const previousYaw = yaw, previousPitch = pitch;
            yaw += (event.clientX - previousX) * .009;
            // Horizontal touch dragging rotates; vertical gestures still scroll the page.
            if (event.pointerType !== 'touch') pitch = Math.max(-.65, Math.min(.65, pitch + (event.clientY - previousY) * .006));
            previousX = event.clientX;
            previousY = event.clientY;
            changeLighting(previousYaw, previousPitch);
            requestRender();
        });
        function stopDrag(event) {
            if (event.pointerId !== pointer) return;
            if (canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
            pointer = null;
        }
        for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(event, stopDrag);
        canvas.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
            event.preventDefault();
            const previousYaw = yaw, previousPitch = pitch;
            if (event.key === 'ArrowLeft') yaw -= .12;
            if (event.key === 'ArrowRight') yaw += .12;
            if (event.key === 'ArrowUp') pitch = Math.max(-.65, pitch - .08);
            if (event.key === 'ArrowDown') pitch = Math.min(.65, pitch + .08);
            if (event.key === 'Home') yaw = pitch = 0;
            changeLighting(previousYaw, previousPitch, event.key === 'Home');
            requestRender();
        });
        new ResizeObserver(requestRender).observe(canvas);
        document.addEventListener('visibilitychange', requestRender);
        ready = true;
        status.hidden = true;
        render();
    } catch (error) {
        ready = false;
        buffers.forEach(buffer => gl.deleteBuffer(buffer));
        if (texture) gl.deleteTexture(texture);
        if (program) gl.deleteProgram(program);
        showError('The 3D portrait could not be loaded. Please reload to try again.');
        console.error('Portrait:', error);
    }
}
initPortrait();
