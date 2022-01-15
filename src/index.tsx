// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild-wasm'
import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'

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

    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    })

    setCode(result.code)
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
