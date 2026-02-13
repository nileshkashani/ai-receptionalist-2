import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './components/main'
import Login from './components/login'
import Signup from './components/signup'
import Home from './components/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/main'element={<Main/>}/>
          <Route path='/login'element={<Login/>}/>
          <Route path='/signup'element={<Signup/>}/>
          <Route path='/'element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
