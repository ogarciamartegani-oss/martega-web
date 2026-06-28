import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  plugins: [react()],
  // En local carga las vars desde martega-os (donde está el .env compartido).
  // En Vercel (producción) las vars vienen del panel de Vercel, no de un fichero.
  envDir: isDev ? '../martega-os' : '.',
})
