// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild-wasm'
import axios from 'axios'

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // eslint-disable-next-line consistent-return
    build.onResolve({ filter: /.*/ }, async (args: any) => {
      console.log('onResolve', args)
      if (args.path === 'index.js') {
        return { path: args.path, namespace: 'a' }
      }
      return { namespace: 'a', path: `https://unpkg.com/${args.path}` }
    })

    // TODO: Dynamic fetching and loading NPM modules
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      console.log('onLoad', args)

      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
        }
      }

      const { data } = await axios.get(args.path)
      return {
        loader: 'jsx',
        contents: data,
      }
    })
  },
})
