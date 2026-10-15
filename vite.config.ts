import { defineConfig, type ViteDevServer, type PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleApi } from './server/api.mjs';

const apiMiddleware = (server: ViteDevServer | PreviewServer) => {
  server.middlewares.use((req, res, next) => {
    if (!req.url?.startsWith('/api/')) return next();
    handleApi(req, res).catch(() => {
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '요청을 처리하지 못했습니다.' }));
    });
  });
};

export default defineConfig({
  plugins: [react(), tailwindcss(), { name: 'consultation-api', configureServer: apiMiddleware, configurePreviewServer: apiMiddleware }],
  server: { port: 5173, strictPort: true, fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.data/**'] } },
  build: { rollupOptions: { output: { manualChunks: { motion: ['motion/react'], ui: ['@radix-ui/react-dialog'] } } } },
});
