import { defineConfig, Plugin } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync, writeFileSync, existsSync } from 'fs'

function projectImagesPlugin(): Plugin {
  const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.bmp']);
  const projectsDir = resolve(__dirname, 'public/res/projects');

  function generateManifest() {
    if (!existsSync(projectsDir)) return;
    const manifest: Record<string, string[]> = {};

    for (const dir of readdirSync(projectsDir)) {
      const fullPath = resolve(projectsDir, dir);
      if (!statSync(fullPath).isDirectory()) continue;

      const images = readdirSync(fullPath)
        .filter(f => IMAGE_EXTS.has(f.substring(f.lastIndexOf('.')).toLowerCase()))
        .sort();

      manifest[dir] = images;
    }

    writeFileSync(resolve(projectsDir, 'manifest.json'), JSON.stringify(manifest));
  }

  return {
    name: 'project-images',
    buildStart() { generateManifest(); },
    configureServer(server) {
      generateManifest();
      server.watcher.on('all', (_event, path) => {
        if (path.includes('res/projects') || path.includes('res\\projects')) {
          generateManifest();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [projectImagesPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        terminal: resolve(__dirname, 'terminal.html'),
        legal: resolve(__dirname, 'mentions-legales.html')
      }
    }
  }
})
