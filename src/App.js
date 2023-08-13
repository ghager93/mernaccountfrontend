import { Button } from '@mui/material';
import './App.css';
import LoginPage from './components/login/LoginPage';
import SignupPage from './components/signup/SignupPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const routes = [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/signup',
    component: SignupPage
  }
]



const App = () => {

  return (
    <Router basename="/">
      <main>
        <Button href={"/login"}>Login</Button>
        <Button href={"/signup"}>Sign Up</Button>
        <div className='App'>
          <Routes>
            <Route path='/' element={<p>No page!</p>} />
            {routes.map(({path, component: C}) => (
                      <Route key={path} path={path} element={<C />} />
                    ))}
          </Routes>

        </div>
      </main>
    </Router>
  );
}

export default App;
