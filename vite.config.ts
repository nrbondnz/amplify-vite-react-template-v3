import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Correct plugin name
import tsconfigPaths from 'vite-tsconfig-paths'; // Correct import of `vite-tsconfig-paths`

export default defineConfig({
  plugins: [react(), tsconfigPaths()] // Correct plugin usage
});