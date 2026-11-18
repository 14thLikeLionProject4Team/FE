import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: { chunkSizeWarningLimit: 1000 },
    server: {
      // 개발 서버(npm run dev)에서는 /__backend 로 보낸 요청을 백엔드로 대신 전달해요.
      // 브라우저 입장에서는 같은 주소로 요청하는 거라 CORS 에 막히지 않아요.
      // (배포된 Vercel 사이트는 VITE_API_URL 로 바로 요청해요)
      proxy: env.VITE_API_URL
        ? {
            '/__backend': {
              target: env.VITE_API_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/__backend/, ''),
            },
          }
        : undefined,
    },
  }
})
