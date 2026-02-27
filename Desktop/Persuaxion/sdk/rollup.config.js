import resolve from '@rollup/plugin-node-resolve';
import commonjs  from '@rollup/plugin-commonjs';
import terser    from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',

  output: {
    file:    'dist/persuaxion.min.js',
    format:  'iife',        // No import/export — runs inline in Shopify ScriptTag
    name:    'Persuaxion',  // Exposed as window.Persuaxion for optional manual init
    indent:  false,
  },

  plugins: [
    // Resolve bare-name imports from node_modules (none expected in V1, but safe to include)
    resolve({ browser: true }),

    // Convert any CommonJS dependencies to ES modules before bundling
    commonjs(),

    // Minify and target ES2017 — Shopify ScriptTag supports all modern browsers
    terser({
      compress : { passes: 2, drop_console: true },
      mangle   : true,
      ecma     : 2017,   // Emit ES2017 syntax — async/await kept as-is, no transpile
      format   : { comments: false },
    }),
  ],
};
