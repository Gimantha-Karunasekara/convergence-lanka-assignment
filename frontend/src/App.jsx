import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router'
import Customers from './Customers'
import Create from './CreateCustomer'
import UpdateCustomer from './UpdateCustomer'
import DataUpload from './DataUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Customers />} />
        <Route path='/create' element={<Create />} />
        <Route path='/:id' element={<UpdateCustomer />} />
        <Route path='/upload' element={<DataUpload />} />
      </Routes>
    </>
  )
}

export default App
