import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — сборка открывается из любой папки сервера, не только из корня.
export default defineConfig({ base: './', plugins: [react()] });
