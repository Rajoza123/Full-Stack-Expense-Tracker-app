
import './App.css';
import {Routes,Route} from 'react-router-dom'
import { Homepage } from './pages/Homepage.js';
import RegisterForm from './pages/RegisterForm.js';
import LoginForm from './pages/LoginForm.js';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/login' element={<LoginForm/>}/>

      </Routes>
        
    </div>
  );
}

export default App;
