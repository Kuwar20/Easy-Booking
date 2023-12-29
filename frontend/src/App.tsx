import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './index.css';
import Layout from './layouts/Layout'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />} />
          <Route path='/search' element={<>Search Page</>} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
