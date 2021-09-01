import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Manual from '../../../src/Manual'
import Count from './components/Count'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(0);
  
  useEffect(() => {
    setCount(1)
    setTimeout(() => {
      console.log(data);
      debugger
      setData((d) => {
        console.log(d);
        return 3
      } )
    }, 4000)
    return () => {
    };
  }, []);

  useEffect(() => {
    setData(1);
  },[])
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header> */}
      <div>
        <Manual deps={[count]}>
          <Count />
        </Manual>
      </div>
      <p>data:{data}</p>
      
    </div>
  )
}

export default App
