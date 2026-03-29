import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // .env에서 VITE_BASE_URL을 읽어 로컬 개발용 proxy target으로 사용
    const env = loadEnv(mode, process.cwd(), '');
    const apiTarget = env.VITE_BASE_URL?.replace(/\/+$/, '') || 'https://dev.dorder-api.shop';
    return {
        plugins: [react(), basicSsl()],
        server: {
            port: 5173,
            proxy: {
                // 로컬에서 /api/v3/* 요청을 .env의 VITE_BASE_URL로 포워딩
                '/api/v3': {
                    target: apiTarget,
                    changeOrigin: true,
                    cookieDomainRewrite: { '.dorder-api.shop': 'localhost' },
                },
                '/api/v2': {
                    target: apiTarget,
                    changeOrigin: true,
                    cookieDomainRewrite: { '.dorder-api.shop': 'localhost' },
                },
            },
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@routes': path.resolve(__dirname, 'src/routes'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
                '@constants': path.resolve(__dirname, 'src/constants'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@services': path.resolve(__dirname, 'src/services'),
            },
        },
    };
});
