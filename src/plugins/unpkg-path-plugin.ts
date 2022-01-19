// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild-wasm'

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    build.onResolve({ filter: /.*/ }, async (args: any) => {
      console.log('onResolve', args)
      return { path: args.path, namespace: 'a' }
    })

    // TODO: Dynamic fetching and loading NPM modules
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      console.log('onLoad', args)

      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: `
              import message from './message';
              console.log(message);
            `,
        }
      }
      return {
        loader: 'jsx',
        contents: 'export default "hi there!"',
      }
    })
  },
})
