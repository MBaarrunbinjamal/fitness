import './App.css';


import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import Cursor from "./components/Cursor";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";


import Home from "./components/Home";
import useForgeEffects from "./hooks/useForgeEffects";


import {Routes,Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Adash from "./pages/Adash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from './pages/VerifyEmail';


function App() {
  useForgeEffects();
  return (
      <>
<Routes>
  <Route path="/"element={<Home/>}/>
  <Route path="/verify-email"element={<VerifyEmail/>}/>
  <Route path="/dashboard"element={<Dashboard/>}/>
  <Route path="/admin"element={<Adash/>}/>
  <Route path="/login"element={<Login/>}/>
  <Route path="/register"element={<Register/>}/>
</Routes>

      <Preloader />
      <ScrollProgress />
      <Cursor />
      <BackToTop />
      <Footer />
        </>
  ); 
}

export default App;
