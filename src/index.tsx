// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild-wasm'
import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'

const App = () => {
  const ref = useRef<any>()
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    })
  }

  useEffect(() => {
    startService()
  }, [])

  const onClick = async () => {
    if (!ref.current) return
    // Transpiling inputed code
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    })
    setCode(result.outputFiles[0].text)
  }

  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)} />
      <div>
        <button type='submit' onClick={onClick}>
          Submit
        </button>
        <pre>{code}</pre>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
