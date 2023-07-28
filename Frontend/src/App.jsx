import './style.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Employee from './Components/Employee'
import Profile from './Components/Profile'
import Home from './Components/Home'
import AddEmployee from './Components/AddEmployee'

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}>
              <Route path='' element={<Home />} />
              <Route path='/employee' element={<Employee />} />
              <Route path='/create' element={<AddEmployee />} />
              <Route path='/profile' element={<Profile />} />
          </Route>
        <Route path='/Login' element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
      )
}

export default App
