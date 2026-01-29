/**
 * Urban Infrastructure Digital Twin - Visualizations
 * Handles Canvas animations and complex visual effects
 */

class CityGrid {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.gridLines = [];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createGrid();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.createGrid();
    }

    createGrid() {
        this.gridLines = [];
        // Perspective Grid setup
        const horizon = this.height * 0.35; // Higher horizon for more depth
        const gridSpacing = 40;

        // Vertical lines (perspective)
        for (let x = -this.width; x < this.width * 2; x += gridSpacing) {
            this.gridLines.push({
                x1: x,
                y1: this.height,
                x2: (x - this.width / 2) * 0.1 + this.width / 2, // Stronger convergence
                y2: horizon,
                type: 'vertical'
            });
        }

        // Horizontal lines
        for (let y = this.height; y > horizon; y -= gridSpacing * 0.5) {
            const progress = (y - horizon) / (this.height - horizon);
            // Skip some lines for rhythm
            if (Math.round(y) % 3 === 0) continue;

            this.gridLines.push({
                y: y,
                type: 'horizontal'
            });
        }
    }

    drawGrid() {
        // Gradient fade for grid
        const gradient = this.ctx.createLinearGradient(0, this.height * 0.4, 0, this.height);
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0)');
        gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.1)'); // Teal glow
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0.05)');

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1;
        this.ctx.shadowBlur = 0;

        this.gridLines.forEach(line => {
            this.ctx.beginPath();
            if (line.type === 'vertical') {
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
            } else {
                this.ctx.moveTo(0, line.y);
                this.ctx.lineTo(this.width, line.y);
            }
            this.ctx.stroke();
        });
    }

    spawnParticle() {
        // More active traffic
        if (Math.random() > 0.85) {
            const type = Math.random() > 0.5 ? 'vertical' : 'horizontal';
            let particle = {};

            if (type === 'vertical') {
                const lines = this.gridLines.filter(l => l.type === 'vertical');
                const line = lines[Math.floor(Math.random() * lines.length)];

                particle = {
                    x: line.x2,
                    y: line.y2,
                    targetX: line.x1,
                    targetY: line.y1,
                    speed: 5 + Math.random() * 5, // Faster
                    size: 1.5,
                    color: '#10b981', // Green
                    trail: []
                };
            } else {
                const y = this.height - Math.random() * (this.height * 0.6);
                particle = {
                    x: 0,
                    y: y,
                    targetX: this.width,
                    targetY: y,
                    speed: 8 + Math.random() * 5, // Faster
                    size: 1.5,
                    color: '#3b82f6', // Blue
                    trail: []
                };
            }
            this.particles.push(particle);
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Capture trail position
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 15) p.trail.shift();

            // Move
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;

            if (Math.abs(dx) < 1 && Math.abs(dy) < 1 || p.x > this.width || p.y > this.height) {
                this.particles.splice(i, 1);
                continue;
            }

            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * p.speed;
            p.y += Math.sin(angle) * p.speed;

            // Draw Trail
            this.ctx.beginPath();
            for (let j = 0; j < p.trail.length; j++) {
                const point = p.trail[j];
                this.ctx.lineTo(point.x, point.y);
            }
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = p.size;
            // Trail fades out at tail
            this.ctx.globalAlpha = 0.5;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;

            // Draw Head
            this.ctx.fillStyle = '#fff';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Add subtle background fade instead of clear for motion blur feel? 
        // No, keep clean for tech look.

        this.drawGrid();
        this.spawnParticle();
        this.updateParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const cityGrid = new CityGrid('cityGrid');
});
