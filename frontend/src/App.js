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
import AuthGuard from './Authguard';
import Profile from './dashboard/Profile';
import WorkoutSession from './dashboard/Workoutsession';
import WorkoutSchedule from './dashboard/Workoutschedule';
import NutritionSchedule from './dashboard/Nutritionschedule';
import ForgotPassword from './pages/Forgotpassword';
import ResetPassword from './pages/Resetpassword';
import AllUsers from './Admindash/Allusers';
import SubscriptionPlans from './components/Subscriptionplans';
import SubscribeForm from './components/Subscribeform';
import AdminRequests from './Admindash/Adminrequests';
import MyPlan from './components/Myplan';
import AdminCreatePlan from './Admindash/Admincreateplan';
import ProgressPage from './dashboard/ProgressPage';


function App() {
  useForgeEffects();
  return (
      <>
<Routes>
  {/* authentication routes start*/}
    <Route path="/verify-email"element={<VerifyEmail/>}/>
      <Route path="/login"element={<Login/>}/>
  <Route path="/register"element={<Register/>}/>
  <Route path="/forgot-password" element={<ForgotPassword/>} />
<Route path="/reset-password" element={<ResetPassword/>} />
{/* authentication routes end */}

{/* user routes start */}
  <Route path="/"element={<Home/>}/>
  <Route path="/dashboard"element={<AuthGuard requiredRole="user"><Dashboard/></AuthGuard>}/>
    <Route path="/profile" element={<AuthGuard requiredRole="user"><Profile></Profile></AuthGuard>}/>
    <Route path = "/schedule" element={<AuthGuard requiredRole="user"><WorkoutSchedule/></AuthGuard>}/>
<Route path="/workout-session" element={<AuthGuard requiredRole="user"><WorkoutSession/></AuthGuard>} />
<Route path = "/nschedule" element={<AuthGuard requiredRole="user"><NutritionSchedule/></AuthGuard>}/>
<Route path="/plans" element={<AuthGuard requiredRole="user"><SubscriptionPlans/></AuthGuard>} />
<Route path="/subscribe/:planId" element={<AuthGuard requiredRole="user"><SubscribeForm/></AuthGuard>} />
<Route path="/my-plan" element={<AuthGuard requiredRole="user"><MyPlan/></AuthGuard>} />
<Route path="/progress" element={<AuthGuard requiredRole="user"><ProgressPage/></AuthGuard>} />

{/* user routes end */}

{/*admin routes start*/}
  <Route path="/admin"element={<AuthGuard requiredRole="Admin"><Adash/></AuthGuard>}/>
  
<Route path = "/allusers" element={<AuthGuard requiredRole="Admin"><AllUsers/></AuthGuard>}/>
<Route path="/admin/requests" element={<AuthGuard requiredRole="Admin"><AdminRequests/></AuthGuard>} />
<Route path="/admin/plans" element={<AuthGuard requiredRole="Admin"><AdminCreatePlan/></AuthGuard>} />
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
