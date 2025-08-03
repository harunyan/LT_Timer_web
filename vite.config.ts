import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Viteの設定情報
// Viteの設定ファイル
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/LT_Timer_web/' : '/',
  plugins: [react()],
})
