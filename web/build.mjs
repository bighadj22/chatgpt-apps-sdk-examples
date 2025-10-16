import * as esbuild from 'esbuild';

const watchMode = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/component.tsx'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/component.js',
  minify: true,
  sourcemap: false,
  target: 'es2020',
  jsx: 'automatic',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
};

if (watchMode) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(buildOptions);
  console.log('Build complete!');
}
