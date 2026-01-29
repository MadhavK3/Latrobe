/**
 * Modern 3D Visualization - Floating Particles
 */

class ModernScene {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.particles = [];

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.camera.position.z = 50;

        // Create floating particles
        this.createParticles();

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x667eea, 1, 100);
        pointLight.position.set(0, 0, 20);
        this.scene.add(pointLight);
    }

    createParticles() {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const colors = [0x667eea, 0x764ba2, 0x4facfe, 0xf093fb];

        for (let i = 0; i < 100; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                emissive: colors[Math.floor(Math.random() * colors.length)],
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6
            });

            const particle = new THREE.Mesh(geometry, material);

            particle.position.x = (Math.random() - 0.5) * 100;
            particle.position.y = (Math.random() - 0.5) * 100;
            particle.position.z = (Math.random() - 0.5) * 100;

            particle.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };

            this.scene.add(particle);
            this.particles.push(particle);
        }
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;

            gsap.to(this.camera.position, {
                x: x * 5,
                y: y * 5,
                duration: 1
            });
        });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();

        // Animate particles
        this.particles.forEach(particle => {
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;

            // Bounce off boundaries
            if (Math.abs(particle.position.x) > 50) particle.userData.velocity.x *= -1;
            if (Math.abs(particle.position.y) > 50) particle.userData.velocity.y *= -1;
            if (Math.abs(particle.position.z) > 50) particle.userData.velocity.z *= -1;

            // Gentle rotation
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });

        this.camera.lookAt(0, 0, 0);
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.cityScene = new ModernScene();
});
