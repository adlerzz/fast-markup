
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser";

const treeshake = {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
};

export default [
  {
    input: "src/main.ts",
    output: {
      file: "dist/fm.global.js",
      format: "iife",
      name: "fm"
    },
    plugins: [typescript()],
    treeshake
  },

  // Global standalone (IIFE)
  {
    input: "src/main.ts",
    output: {
      file: "dist/fm.global.min.js",
      format: "iife",
      name: "fm"
    },
    plugins: [typescript(), terser()],
    treeshake
  },

];