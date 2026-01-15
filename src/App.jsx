
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import KrestHRHomepage from './homepage'
import RequestDemo from './RequestDemo'
import Contact from './Contact'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<KrestHRHomepage />}/>
        <Route path='/requestdemo' element={<RequestDemo />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
     
    </Router>
  )
}

export default App
