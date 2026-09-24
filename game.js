/*
 * NEON VOID - Cosmic Runner
 * A fast-paced neon-themed arcade survival game
 * Author: Generated with Kilo
 */

// Game State Manager
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover'
};

// ===== Audio System =====
class AudioManager {
    constructor() {
        this.ctx = null;
        this.sounds = new Map();
        this.masterVolume = 0.7;
        this.enabled = true;
    }

    async init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('WebAudio not supported, using fallback');
            this.enabled = false;
        }
        
        // Unlock audio context on first user interaction
        const unlock = () => {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => console.log('Audio resume failed:', e));
            }
            document.body.removeEventListener('touchstart', unlock);
            document.body.removeEventListener('click', unlock);
        };
        document.body.addEventListener('touchstart', unlock);
        document.body.addEventListener('click', unlock);
    }

    createSound(frequency, duration, type = 'sine', envelope = {}) {
        if (!this.enabled || !this.ctx) return null;
        
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
            
            const now = this.ctx.currentTime;
            const attack = envelope.attack || 0.001;
            const decay = envelope.decay || 0.1;
            const sustain = envelope.sustain || 0.5;
            const release = envelope.release || 0.2;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(sustain * this.masterVolume, now + attack);
            gain.gain.exponentialRampToValueAtTime(sustain * this.masterVolume, now + attack + decay);
            
            osc.start(now);
            osc.stop(now + duration);
            
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration - release);
            gain.gain.setValueAtTime(0, now + duration);
            
            return { osc, gain };
        } catch (e) {
            return null;
        }
    }

    playEngine(frequency, volume = 0.5) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(frequency, now);
        osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + 2);
        
        gain.gain.setValueAtTime(volume * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2);
        
        osc.start(now);
        osc.stop(now + 1.5);
        
        return { osc, gain };
    }

    playDash() {
        if (!this.enabled || !this.ctx) return;
        
        const sounds = [
            { freq: 220, time: 0 },
            { freq: 330, time: 0.05 },
            { freq: 440, time: 0.1 },
            { freq: 660, time: 0.15 }
        ];
        
        sounds.forEach(s => {
            const now = this.ctx.currentTime + s.time;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(s.freq, now);
            
            const duration = 0.15;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.4 * this.masterVolume, now + 0.001);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            osc.start(now);
            osc.stop(now + duration);
        });
    }

    playCollect() {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3 * this.masterVolume, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playHit() {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5 * this.masterVolume, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playLevelUp() {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const t = now + i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            
            const duration = 0.15;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3 * this.masterVolume, t + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
            
            osc.start(t);
            osc.stop(t + duration);
        });
    }
}

// ===== Particle System =====
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(x, y, vx, vy, life, color, size = 2, type = 'circle') {
        this.particles.push({
            x, y, vx, vy, life, maxLife: life, color, size, type,
            gravity: 0, drag: 0.98
        });
    }

    addExplosion(x, y, count = 20, baseColor = '#ff007f') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
            const speed = 50 + Math.random() * 150;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = 0.5 + Math.random() * 0.5;
            
            const hueShift = Math.random() * 40 - 20;
            const color = this.shiftHue(baseColor, hueShift);
            
            this.add(x, y, vx, vy, life, color, 2 + Math.random() * 2, 'circle');
        }
    }

    addSpark(x, y, vx, vy, count = 5, color = '#ffff00') {
        for (let i = 0; i < count; i++) {
            this.add(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                vx * (0.5 + Math.random()) + (Math.random() - 0.5) * 50,
                vy * (0.5 + Math.random()) + (Math.random() - 0.5) * 50,
                0.3 + Math.random() * 0.2,
                color,
                1 + Math.random(),
                'spark'
            );
        }
    }

    shiftHue(hex, degrees) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const h = this.rgbToHsv(r, g, b).h;
        const newH = ((h + degrees / 360) + 1) % 1;
        const srgb = this.hsvToRgb(newH, 1, 1);
        
        return `rgb(${Math.round(srgb.r * 255)}, ${Math.round(srgb.g * 255)}, ${Math.round(srgb.b * 255)})`;
    }

    rgbToHsv(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0;
        
        if (d !== 0) {
            if (max === r) h = ((g - b) / d) % 6;
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h *= 60;
            if (h < 0) h += 360;
        }
        
        const s = max === 0 ? 0 : d / max;
        return { h: h / 360, s, v: max };
    }

    hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return { r, g, b };
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity * 500 * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            
            p.life -= dt;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        ctx.save();
        
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            
            if (p.type === 'spark') {
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.globalAlpha = alpha * 0.9;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = p.size * 3 * alpha;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }

    clear() {
        this.particles = [];
    }
}

// ===== Starfield Background =====
class Starfield {
    constructor() {
        this.stars = [];
        this.nebulae = [];
        this.init();
    }

    init() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                z: Math.random() * 0.8 + 0.2,
                size: Math.random() * 2 + 0.5,
                twinkle: Math.random() * Math.PI * 2,
                speed: 20 + Math.random() * 30
            });
        }
        
        this.nebulae = [];
        for (let i = 0; i < 5; i++) {
            this.nebulae.push({
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                radius: 150 + Math.random() * 200,
                hue: Math.random() * 60 + 240,
                alpha: 0.15 + Math.random() * 0.15,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    update(dt, scrollSpeed) {
        for (const star of this.stars) {
            star.x -= star.z * scrollSpeed * dt * 30;
            
            if (star.x < 0) {
                star.x = 1920;
                star.y = Math.random() * 1080;
            }
            
            star.twinkle += dt * 2;
        }
        
        for (const nebula of this.nebulae) {
            nebula.pulse += dt * 0.5;
            nebula.x -= scrollSpeed * dt * 10;
            
            if (nebula.x < -200) {
                nebula.x = 1920 + 200;
                nebula.y = Math.random() * 1080;
            }
        }
    }

    render(ctx, canvas) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Draw gradient background
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height, width);
        gradient.addColorStop(0, '#0a001a');
        gradient.addColorStop(1, '#000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw nebulae
        for (const nebula of this.nebulae) {
            const scaleX = width / 1920;
            const scaleY = height / 1080;
            const x = nebula.x * scaleX;
            const y = nebula.y * scaleY;
            const radius = nebula.radius * ((scaleX + scaleY) / 2);
            
            ctx.save();
            ctx.globalAlpha = nebula.alpha + Math.sin(nebula.pulse) * 0.05;
            
            const nebGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            nebGradient.addColorStop(0, `hsla(${nebula.hue}, 80%, 60%, 0.8)`);
            nebGradient.addColorStop(0.5, `hsla(${nebula.hue}, 60%, 50%, 0.3)`);
            nebGradient.addColorStop(1, `hsla(${nebula.hue}, 40%, 40%, 0)`);
            
            ctx.fillStyle = nebGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // Draw stars
        for (const star of this.stars) {
            const scaleX = width / 1920;
            const scaleY = height / 1080;
            const x = star.x * scaleX;
            const y = star.y * scaleY;
            
            ctx.save();
            ctx.globalAlpha = 0.4 + Math.sin(star.twinkle) * 0.3;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = star.z * 5;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

// ===== Player =====
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 30;
        this.height = 15;
        this.thrust = 1200;  // Much higher thrust
        this.maxSpeed = 900;  // Much higher max speed
        this.dashPower = 0;
        this.maxDash = 300;
        this.dashCooldown = 0;
        this.dashDirection = { x: 0, y: 0 };
        this.trailTimer = 0;
        this.invincible = 0;
        this.color = '#00e6ff';
        this.boost = false;
    }

    update(dt, input, obstacles) {
        // Normal movement
        if (!this.isDashing()) {
            if (input.left) this.vx -= this.thrust * dt;
            if (input.right) this.vx += this.thrust * dt;
            
            // Vertical movement
            if (input.up) this.vy -= this.thrust * dt;
            if (input.down) this.vy += this.thrust * dt;
            
            this.vx *= 0.90; // friction
            this.vy *= 0.90; // friction
            this.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vx));
            this.vy = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vy));
        }
        
        // Dash
        if (input.dash && this.dashPower > 50 && this.dashCooldown <= 0) {
            this.startDash(input);
        }
        
        if (this.isDashing()) {
            this.dashPower -= dt * 400;  // Drain slower for longer dashes
            const dashSpeed = 1200;
            this.vx = this.dashDirection.x * dashSpeed;
            this.vy = this.dashDirection.y * dashSpeed;
            this.invincible -= dt;
            
            // End dash if power is depleted
            if (this.dashPower <= 0) {
                this.invincible = 0;
               }
        }
        
        this.dashCooldown = Math.max(0, this.dashCooldown - dt);
        
        // Position update
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Boundary check
        const bounds = 20;
        this.x = Math.max(bounds, Math.min(1920 - bounds, this.x));
        this.y = Math.max(100, Math.min(980, this.y));
        
        // Regenerate dash over time
        if (this.dashPower < this.maxDash && !this.isDashing()) {
            this.dashPower = Math.min(this.maxDash, this.dashPower + dt * 100);  // Faster regen
        }
        
        // Trail particles
        this.trailTimer -= dt;
        if (this.trailTimer <= 0) {
            this.trailTimer = 0.05;
            if (this.isDashing()) {
                this.addTrailParticle(-40, 0, '#ff007f');
                this.addTrailParticle(-40, 5, '#ff007f');
            } else if (Math.abs(this.vx) > 100 || Math.abs(this.vy) > 100) {
                this.addTrailParticle(-20, this.vx > 0 ? 5 : -5, '#00e6ff');
            }
        }
    }

    startDash(input) {
        // Use input direction if available, otherwise use movement direction
        if (input.left || input.right || input.up || input.down) {
            this.dashDirection.x = (input.right ? 1 : 0) - (input.left ? 1 : 0);
            this.dashDirection.y = (input.down ? 1 : 0) - (input.up ? 1 : 0);
        } else {
            // Default to current movement direction
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 10) {
                this.dashDirection.x = this.vx / speed;
                this.dashDirection.y = this.vy / speed;
            } else {
                this.dashDirection.x = 1;  // Default right
                this.dashDirection.y = 0;
            }
        }
        
        // Normalize diagonal dashes
        const len = Math.sqrt(this.dashDirection.x * this.dashDirection.x + this.dashDirection.y * this.dashDirection.y);
        if (len > 0) {
            this.dashDirection.x /= len;
            this.dashDirection.y /= len;
        }
        
        this.invincible = 0.6;  // Longer invincibility
        this.dashCooldown = 1.0;  // Shorter cooldown for better feel
    }

    isDashing() {
        return this.dashPower > 0 && this.invincible > 0;
    }

    addTrailParticle(offsetX, offsetY, color) {
        const angle = Math.atan2(this.vy, this.vx);
        const px = this.x + Math.cos(angle) * offsetX - Math.sin(angle) * offsetY;
        const py = this.y + Math.sin(angle) * offsetX + Math.cos(angle) * offsetY;
        
        if (window.game && window.game.particles) {
            window.game.particles.add(
                px, py,
                -this.vx * 0.3 + (Math.random() - 0.5) * 30,
                -this.vy * 0.3 + (Math.random() - 0.5) * 30,
                0.3,
                color,
                3,
                'spark'
            );
        }
    }

    render(ctx) {
        const scaleX = ctx.canvas.width / 1920;
        const scaleY = ctx.canvas.height / 1080;
        const x = this.x * scaleX;
        const y = this.y * scaleY;
        const scale = (scaleX + scaleY) / 2;
        
        ctx.save();
        
        if (this.invincible > 0 && this.isDashing()) {
            ctx.globalAlpha = 0.5 + Math.sin(this.invincible * 20) * 0.3;
        }
        
        // Main ship body
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20 * scale;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.ellipse(x, y, 12 * scale, 5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ship front
        ctx.beginPath();
        ctx.moveTo(x + 12 * scale, y);
        ctx.lineTo(x + 18 * scale, y - 7 * scale);
        ctx.lineTo(x + 18 * scale, y + 7 * scale);
        ctx.closePath();
        ctx.fill();
        
        // Ship details
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * scale;
        ctx.shadowBlur = 15 * scale;
        ctx.strokeStyle = this.color;
        
        ctx.beginPath();
        ctx.ellipse(x - 5 * scale, y, 4 * scale, 1.5 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Engine glow
        const engineX = x - 15 * scale;
        ctx.shadowBlur = 20 * scale;
        ctx.shadowColor = this.isDashing() ? '#ff007f' : '#00e6ff';
        
        if (this.isDashing()) {
            ctx.fillStyle = '#ff007f';
            ctx.beginPath();
            ctx.moveTo(engineX, y);
            ctx.lineTo(engineX - 15 * scale, y - 10 * scale);
            ctx.lineTo(engineX - 15 * scale, y + 10 * scale);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillStyle = '#00e6ff';
            ctx.beginPath();
            ctx.moveTo(engineX, y);
            ctx.lineTo(engineX - 12 * scale, y - 6 * scale);
            ctx.lineTo(engineX - 12 * scale, y + 6 * scale);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    takeDamage() {
        if (this.invincible > 0) return false;
        return true;
    }

    collect(item) {
        if (item.type === 'dash') {
            this.dashPower = Math.min(this.maxDash, this.dashPower + 150);
        }
    }
}

// ===== Obstacle =====
class Obstacle {
    constructor(x, y, type, difficulty = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 45 + difficulty * 10;  // Even larger obstacles
        this.height = 45 + difficulty * 10;
        this.vx = -600 - difficulty * 80;  // Insanely fast obstacles
        this.vy = (Math.random() - 0.5) * 150;  // Very aggressive vertical movement
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
        
        // Color based on type
        const colors = {
            'shard': '#ff007f',
            'spike': '#ff4757',
            'orb': '#8a2be2'
        };
        this.color = colors[type] || '#ff007f';
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rotation += this.rotationSpeed * dt;
    }

    isOffScreen() {
        return this.x < -100;
    }

    checkCollision(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.width / 2 + 15;  // Slightly larger hitbox for fairness
    }

    render(ctx) {
        if (this.isOffScreen()) return;
        
        const scaleX = ctx.canvas.width / 1920;
        const scaleY = ctx.canvas.height / 1080;
        const x = this.x * scaleX;
        const y = this.y * scaleY;
        const scale = (scaleX + scaleY) / 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.scale(scale, scale);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        if (this.type === 'shard') {
            ctx.beginPath();
            ctx.moveTo(0, -this.height / 2);
            ctx.lineTo(this.width / 2, 0);
            ctx.lineTo(0, this.height / 2);
            ctx.lineTo(-this.width / 2, 0);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'spike') {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i;
                const px = Math.cos(angle) * this.width / 2;
                const py = Math.sin(angle) * this.width / 2;
                ctx.lineTo(px, py);
                const cx = Math.cos(angle + Math.PI / 4) * this.width / 3;
                const cy = Math.sin(angle + Math.PI / 4) * this.width / 3;
                ctx.lineTo(cx, cy);
            }
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'orb') {
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// ===== Collectible Item =====
class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 15;
        this.height = 15;
        this.vx = -150;
        this.vy = (Math.random() - 0.5) * 30;
        this.rotation = 0;
        this.rotationSpeed = 3;
        
        this.color = type === 'dash' ? '#00e6ff' : '#ffff00';
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rotation += this.rotationSpeed * dt;
    }

    isOffScreen() {
        return this.x < -100;
    }

    checkCollision(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.width + 10;
    }

    render(ctx) {
        const scaleX = ctx.canvas.width / 1920;
        const scaleY = ctx.canvas.height / 1080;
        const x = this.x * scaleX;
        const y = this.y * scaleY;
        const scale = (scaleX + scaleY) / 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        
        ctx.shadowBlur = 15 * scale;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        if (this.type === 'dash') {
            ctx.beginPath();
            ctx.moveTo(-8 * scale, 0);
            ctx.lineTo(8 * scale, 0);
            ctx.lineTo(0, 10 * scale);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, 10 * scale);
            ctx.lineTo(0, -10 * scale);
            ctx.lineTo(8 * scale, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// ===== Game Class =====
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.uiCanvas = document.getElementById('ui-canvas');
        this.uiCtx = this.uiCanvas.getContext('2d');
        
        this.particles = new ParticleSystem();
        this.starfield = new Starfield();
        this.player = new Player(200, 540);
        
        this.obstacles = [];
        this.collectibles = [];
        
        this.state = GameState.MENU;
        this.score = 0;
        this.distance = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.gameTime = 0;
        this.scrollSpeed = 300;  // Faster initial pace
        
        this.difficulty = 1;
        this.lastObstacleTime = 0;
        this.lastCollectibleTime = 0;
        this.lastLevelUpTime = 0;
        
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
            dash: false
        };
        
        this.keys = {};
        this.touchStart = null;
        this.touchStartTime = 0;
        
        this.audio = new AudioManager();
        this.engineSound = null;
        this.shakeAmount = 0;
        this.shakeDuration = 0;
        
        this.highScore = localStorage.getItem('neonVoidHighScore') || 0;
        this.resizeHandler = null;
        
        this.deltaTime = 0;
        this.lastTime = 0;
        this.fpsCounter = { frames: 0, time: 0, fps: 0 };
    }

    async init() {
        this.resizeHandler = this.resize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
        this.resize();
        
        this.setupEventListeners();
        
        // Audio may fail to initialize on some browsers without user interaction
        try {
            await this.audio.init();
        } catch (e) {
            console.log('Audio initialization deferred');
        }
        
        this.updateUI();
        this.lastTime = performance.now();
        this.gameLoop();
    }

    resize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        if (this.uiCanvas) {
            this.uiCanvas.width = rect.width;
            this.uiCanvas.height = rect.height;
        }
    }

    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.input.left = true;
                e.preventDefault();
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.input.right = true;
                e.preventDefault();
            }
            if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.input.up = true;
                e.preventDefault();
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.input.down = true;
                e.preventDefault();
            }
            if (e.code === 'Space') {
                this.input.dash = true;
                e.preventDefault();
            }
            if (e.code === 'Escape') {
                this.togglePause();
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.input.left = false;
                e.preventDefault();
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.input.right = false;
                e.preventDefault();
            }
            if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.input.up = false;
                e.preventDefault();
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.input.down = false;
                e.preventDefault();
            }
            if (e.code === 'Space') {
                this.input.dash = false;
                e.preventDefault();
            }
        });

        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStart = { x: touch.clientX, y: touch.clientY };
            this.touchStartTime = Date.now();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.touchStart) return;
            
            const touch = e.touches[0];
            const dx = touch.clientX - this.touchStart.x;
            const dy = touch.clientY - this.touchStart.y;
            
            if (Math.abs(dx) > 30) {
                this.input.left = dx < 0;
                this.input.right = dx > 0;
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchTime = Date.now() - this.touchStartTime;
            
            if (touchTime < 200 && this.touchStart) {
                this.input.dash = true;
                setTimeout(() => { this.input.dash = false; }, 100);
            }
            
            this.touchStart = null;
            this.input.left = false;
            this.input.right = false;
        });
        
        // Touch zones for mobile
        const leftZone = document.querySelector('.left-zone');
        const rightZone = document.querySelector('.right-zone');
        
        if (leftZone) {
            leftZone.addEventListener('touchstart', (e) => {
                this.input.left = true;
                e.preventDefault();
            });
            leftZone.addEventListener('touchend', (e) => {
                this.input.left = false;
                e.preventDefault();
            });
        }
        
        if (rightZone) {
            rightZone.addEventListener('touchstart', (e) => {
                this.input.right = true;
                this.input.dash = true;
                e.preventDefault();
            });
            rightZone.addEventListener('touchend', (e) => {
                this.input.right = false;
                this.input.dash = false;
                e.preventDefault();
            });
        }
    }

    startGame() {
        this.state = GameState.PLAYING;
        this.score = 0;
        this.distance = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.gameTime = 0;
        this.scrollSpeed = 200;
        this.difficulty = 1;
        this.obstacles = [];
        this.collectibles = [];
        this.player.x = 200;
        this.player.y = 540;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.dashPower = this.player.maxDash;
        this.player.dashCooldown = 0;
        this.player.invincible = 0;
        this.particles.clear();
        this.lastObstacleTime = 0;
        this.lastCollectibleTime = 0;
        this.lastLevelUpTime = 0;
        this.shakeAmount = 0;
        this.shakeDuration = 0;
        
        // Hide screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('start-screen')?.classList.remove('active');
        document.getElementById('hud')?.classList.remove('hidden');
        document.getElementById('mobile-controls')?.classList.remove('hidden');
        
        // Start engine sound
        this.engineSound = this.audio.playEngine(220 + this.player.dashPower * 0.3);
    }

    togglePause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            document.getElementById('pause-screen')?.classList.add('active');
            document.getElementById('hud')?.classList.add('hidden');
        } else if (this.state === GameState.PAUSED) {
            this.state = GameState.PLAYING;
            document.getElementById('pause-screen')?.classList.remove('active');
            document.getElementById('hud')?.classList.remove('hidden');
        }
    }

    gameOver() {
        this.state = GameState.GAMEOVER;
        
        // Show game over screen
        const gameOverScreen = document.getElementById('gameover-screen');
        gameOverScreen?.classList.add('active');
        
        // Hide HUD
        document.getElementById('hud')?.classList.add('hidden');
        document.getElementById('mobile-controls')?.classList.add('hidden');
        
        // Update stats
        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('final-distance').textContent = Math.floor(this.distance) + 'm';
        document.getElementById('final-time').textContent = 
            `${Math.floor(this.gameTime / 60)}:${String(Math.floor(this.gameTime % 60)).padStart(2, '0')}`;
        
        const newRecord = document.getElementById('new-record');
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('neonVoidHighScore', this.highScore);
            newRecord.classList.remove('hidden');
        } else {
            newRecord.classList.add('hidden');
        }
        
        // Play hit sound
        this.audio.playHit();
        
        // Screen shake
        this.shakeAmount = 20;
        this.shakeDuration = 0.5;
        
        // Explosion particles
        this.particles.addExplosion(this.player.x, this.player.y, 30, '#ff007f');
        this.particles.addExplosion(this.player.x, this.player.y, 20, '#ffff00');
    }

    updateUI() {
        document.getElementById('high-score').textContent = this.highScore.toLocaleString();
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('distance').textContent = Math.floor(this.distance) + 'm';
        
        const multElem = document.getElementById('multiplier');
        if (this.multiplier > 1) {
            multElem?.classList.remove('hidden');
            document.getElementById('mult-value').textContent = '×' + this.multiplier;
        } else {
            multElem?.classList.add('hidden');
        }
        
        const dashFill = document.getElementById('dash-fill');
        if (dashFill) {
            const percent = (this.player.dashPower / this.player.maxDash) * 100;
            dashFill.style.width = `${percent}%`;
        }
    }

    spawnObstacles(dt) {
        this.lastObstacleTime += dt;
        this.lastCollectibleTime += dt;
        
        const obstacleInterval = Math.max(0.08, 0.8 - this.difficulty * 0.15);
        if (this.lastObstacleTime >= obstacleInterval) {
            this.lastObstacleTime = 0;
            
            // Spawn 1-2 obstacles at once for more density
            const spawnCount = this.difficulty > 2 ? 2 : (Math.random() < 0.3 ? 2 : 1);
            for (let i = 0; i < spawnCount; i++) {
                const types = ['shard', 'spike', 'shard', 'orb', 'shard'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                const x = 1920 + 50 + i * 100;
                const y = 150 + Math.random() * 850;
                
                this.obstacles.push(new Obstacle(x, y, type, this.difficulty));
            }
        }
        
        if (this.lastCollectibleTime >= 1.5 + Math.random() * 2) {
            this.lastCollectibleTime = 0;
            const x = 1920 + 50;
            const y = 100 + Math.random() * 800;
            const types = ['dash', 'score'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            this.collectibles.push(new Collectible(x, y, type));
        }
    }

    updateDifficulty(dt) {
        this.scrollSpeed = 400 + this.distance * 0.2;  // Much faster pace
        this.difficulty = 1 + this.distance / 200;  // Faster difficulty ramp
        
        // Level up
        this.lastLevelUpTime += dt;
        if (this.lastLevelUpTime >= 0.5) {
            this.lastLevelUpTime = 0;
        }
    }

    gameLoop(timestamp) {
        if (!timestamp) timestamp = performance.now();
        if (!this.lastTime) this.lastTime = timestamp;
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        const dt = Math.min(0.05, Math.max(0, this.deltaTime));
        
        this.update(dt);
        this.render();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(dt) {
        if (this.state === GameState.PLAYING) {
            this.updateGame(dt);
        } else if (this.state === GameState.MENU) {
            this.updateMenu(dt);
        }
        
        // Always update particles
        this.particles.update(dt);
        this.starfield.update(dt, this.scrollSpeed);
        
        // Screen shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
        }
    }

    updateGame(dt) {
        this.gameTime += dt;
        this.distance += this.scrollSpeed * dt / 100;
        
        // Score
        const scoreGain = (this.scrollSpeed / 60) * this.multiplier * dt;
        this.score += scoreGain;
        
        // Update player
        this.player.update(dt, this.input, this.obstacles);
        
        // Spawn obstacles and collectibles
        this.spawnObstacles(dt);
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update(dt);
            
            if (obs.isOffScreen()) {
                this.obstacles.splice(i, 1);
                continue;
            }
            
            // Collision check
            if (obs.checkCollision(this.player) && this.player.takeDamage()) {
                this.gameOver();
                return;
            }
        }
        
        // Update collectibles
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const item = this.collectibles[i];
            item.update(dt);
            
            if (item.isOffScreen()) {
                this.collectibles.splice(i, 1);
                continue;
            }
            
            // Collection check
            if (item.checkCollision(this.player)) {
                this.collectibles.splice(i, 1);
                this.onCollect(item);
            }
        }
        
        // Update multiplier
        if (this.multiplierTimer > 0) {
            this.multiplierTimer -= dt;
            if (this.multiplierTimer <= 0) {
                this.multiplier = 1;
            }
        }
        
        // Update engine sound frequency
        if (this.engineSound && this.engineSound.osc) {
            const freq = 110 + this.scrollSpeed * 0.5 + this.player.dashPower * 0.3;
            try {
                this.engineSound.osc.frequency.setValueAtTime(freq, this.audio.ctx.currentTime);
            } catch (e) {}
        }
        
        // Update difficulty
        this.updateDifficulty(dt);
        
        // Update UI
        this.updateUI();
    }

    onCollect(item) {
        if (item.type === 'dash') {
            this.player.collect(item);
            this.audio.playCollect();
        } else if (item.type === 'score') {
            this.score += 100 * this.multiplier;
            this.multiplier = Math.min(10, this.multiplier + 1);
            this.multiplierTimer = 5;
            
            // Add particles
            this.particles.addSpark(this.player.x, this.player.y, 0, 0, 8, '#ffff00');
            this.particles.addExplosion(this.player.x, this.player.y, 10, '#ffff00');
            this.audio.playCollect();
        }
    }

    updateMenu(dt) {
        // Background animation for menu
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        if (this.shakeDuration > 0) {
            const shakeX = (Math.random() - 0.5) * this.shakeAmount;
            const shakeY = (Math.random() * 0.5) * this.shakeAmount;
            ctx.save();
            ctx.translate(shakeX, shakeY);
        }
        
        // Draw starfield
        this.starfield.render(ctx, this.canvas);
        
        // Draw particles
        this.particles.render(ctx);
        
        // Draw game objects
        if (this.state === GameState.PLAYING) {
            for (const obs of this.obstacles) {
                obs.render(ctx);
            }
            
            for (const item of this.collectibles) {
                item.render(ctx);
            }
            
            this.player.render(ctx);
        } else if (this.state === GameState.MENU) {
            this.renderMenu(ctx);
        }
        
        if (this.shakeDuration > 0) {
            ctx.restore();
        }
        
        // FPS Counter (for debugging)
        this.fpsCounter.frames++;
        this.fpsCounter.time += this.deltaTime;
        if (this.fpsCounter.time >= 1) {
            this.fpsCounter.fps = this.fpsCounter.frames;
            this.fpsCounter.frames = 0;
            this.fpsCounter.time = 0;
        }
    }

    renderMenu(ctx) {
        // Draw animated player ship
        this.player.y = 540 + Math.sin(this.gameTime * 2) * 10;
        this.player.render(ctx);
    }
}

// ===== Event Handlers =====
function setupButtonEvents() {
    document.getElementById('start-btn')?.addEventListener('click', () => {
        game.startGame();
    });
    
    document.getElementById('resume-btn')?.addEventListener('click', () => {
        game.togglePause();
    });
    
    document.getElementById('restart-btn')?.addEventListener('click', () => {
        game.startGame();
    });
    
    document.getElementById('quit-btn')?.addEventListener('click', () => {
        game.state = GameState.MENU;
        document.getElementById('pause-screen')?.classList.remove('active');
        document.getElementById('start-screen')?.classList.add('active');
        document.getElementById('hud')?.classList.add('hidden');
    });
    
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
        game.startGame();
    });
    
    document.getElementById('menu-btn')?.addEventListener('click', () => {
        game.state = GameState.MENU;
        document.getElementById('gameover-screen')?.classList.remove('active');
        document.getElementById('start-screen')?.classList.add('active');
    });
}

// ===== Initialize Game =====
let game;

window.addEventListener('load', () => {
    game = new Game();
    game.init().then(() => {
        setupButtonEvents();
        window.game = game;
        console.log('Neon Void game initialized');
    }).catch(e => {
        console.error('Game initialization error:', e);
        setupButtonEvents();
        window.game = game;
    });
});