import * as THREE from 'three';

// A canvas-backed "IDE" texture. Characters are appended one at a time by the scene's
// typing clock; each keystroke reports back so the keyboard can press a key.
const SNIPPET = `// api-gateway/src/server.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requireSession } from './auth/session.js';
import { routePolicy } from './config/adminRoutePolicy.js';
import { publish } from './bus/rabbitmq.js';

const app = express();
app.use(helmet(), rateLimit({ windowMs: 60_000, max: 300 }));

for (const svc of ['auth', 'user', 'product', 'order', 'cart']) {
  app.use(\`/api/\${svc}\`,
    requireSession,
    routePolicy.enforce,          // view / add / edit / delete
    createProxyMiddleware({ target: services[svc] }));
}

app.post('/api/order/checkout', async (req, res) => {
  const order = await Order.create(req.body, { transaction });
  await publish('order.created', { id: order.id });
  res.status(201).json(order);
});

app.listen(8080, () => log.info('gateway ready ✓'));
`;

const KEYWORD = /^(import|from|const|for|of|async|await|new|return|export)$/;
const COLORS = { text: '#d6dbf5', kw: '#c792ea', str: '#a5e8a1', com: '#5f6b8a', num: '#f7b267', fn: '#7fd3ff' };

export function createCodeScreen({ width = 1024, height = 640 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  let typed = 0;
  const lineH = 25;
  const padX = 64;
  const top = 58;
  const maxLines = Math.floor((height - top - 20) / lineH);

  function drawLine(line, x, y) {
    // Tiny tokenizer: comments, strings, keywords, numbers, calls.
    if (line.trimStart().startsWith('//')) {
      ctx.fillStyle = COLORS.com; ctx.fillText(line, x, y); return;
    }
    const tokens = line.split(/('[^']*'?|`[^`]*`?|\/\/.*$)/);
    let cx = x;
    for (const tk of tokens) {
      if (!tk) continue;
      if (tk.startsWith("'") || tk.startsWith('`')) { ctx.fillStyle = COLORS.str; ctx.fillText(tk, cx, y); cx += ctx.measureText(tk).width; continue; }
      if (tk.startsWith('//')) { ctx.fillStyle = COLORS.com; ctx.fillText(tk, cx, y); cx += ctx.measureText(tk).width; continue; }
      const parts = tk.split(/(\b(?:import|from|const|for|of|async|await|new|return|export)\b|\b\d[\d_]*\b|\b\w+(?=\())/);
      for (const p of parts) {
        if (!p) continue;
        ctx.fillStyle = KEYWORD.test(p) ? COLORS.kw : /^\d/.test(p) ? COLORS.num : /^\w+$/.test(p) && tk.includes(p + '(') ? COLORS.fn : COLORS.text;
        ctx.fillText(p, cx, y);
        cx += ctx.measureText(p).width;
      }
    }
  }

  function draw(blink) {
    ctx.fillStyle = '#0b0d17';
    ctx.fillRect(0, 0, width, height);
    // Title bar
    ctx.fillStyle = '#12152a';
    ctx.fillRect(0, 0, width, 38);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(22 + i * 22, 19, 7, 0, Math.PI * 2); ctx.fill(); });
    ctx.font = '600 17px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8b93b8';
    ctx.fillText('server.js — api-gateway', 100, 25);

    const visible = SNIPPET.slice(0, typed).split('\n');
    const start = Math.max(0, visible.length - maxLines);
    ctx.font = '19px "JetBrains Mono", monospace';
    ctx.textBaseline = 'alphabetic';
    for (let i = start; i < visible.length; i++) {
      const y = top + (i - start) * lineH + 14;
      ctx.fillStyle = '#3a4060';
      ctx.fillText(String(i + 1).padStart(2, ' '), 16, y);
      drawLine(visible[i], padX, y);
    }
    // Caret
    if (blink) {
      const last = visible[visible.length - 1] || '';
      const y = top + (visible.length - 1 - start) * lineH;
      ctx.fillStyle = '#7c5cff';
      ctx.fillRect(padX + ctx.measureText(last).width + 2, y, 10, 20);
    }
    texture.needsUpdate = true;
  }

  draw(true);

  return {
    texture,
    // Advance by one character; returns the char typed (or null while pausing at the end).
    step() {
      if (typed >= SNIPPET.length) { typed = 0; return null; }
      const ch = SNIPPET[typed++];
      return ch;
    },
    draw,
    dispose() { texture.dispose(); },
  };
}

// Small secondary screen: a live "service health" board.
export function createStatusScreen({ width = 512, height = 640 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const services = ['gateway', 'auth', 'user', 'product', 'form', 'cart', 'order', 'review', 'notify', 'email'];
  const history = Array.from({ length: 40 }, () => 0.3 + Math.random() * 0.4);

  function draw(t) {
    ctx.fillStyle = '#0b0d17'; ctx.fillRect(0, 0, width, height);
    ctx.font = '600 22px "JetBrains Mono", monospace'; ctx.fillStyle = '#8b93b8';
    ctx.fillText('services', 24, 42);
    ctx.font = '19px "JetBrains Mono", monospace';
    services.forEach((s, i) => {
      const y = 86 + i * 34;
      ctx.fillStyle = '#28c840'; ctx.beginPath(); ctx.arc(32, y - 6, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d6dbf5'; ctx.fillText(s, 50, y);
      ctx.fillStyle = '#5f6b8a'; ctx.fillText(`${(8 + ((i * 37 + Math.floor(t * 3)) % 40))}ms`, 380, y);
    });
    history.shift(); history.push(0.25 + 0.5 * Math.abs(Math.sin(t * 1.3)) * Math.random() + 0.1);
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3; ctx.beginPath();
    history.forEach((v, i) => { const x = 24 + i * 11.5; const y = 610 - v * 180; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
    ctx.fillStyle = '#5f6b8a'; ctx.font = '16px "JetBrains Mono", monospace'; ctx.fillText('rabbitmq · msgs/s', 24, 420);
    texture.needsUpdate = true;
  }
  draw(0);
  return { texture, draw, dispose() { texture.dispose(); } };
}
