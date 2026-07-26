import Navbar from "../Admindash/Navbar";
import Hero from "../Admindash/Hero";
import Features from "../Admindash/Features";
import Stats from "../Admindash/Stats";
import Analytics from "../Admindash/Analytics";
import Membership from "../Admindash/Membership";

import Attendance from "../Admindash/Attendance";
import Payments from "../Admindash/Payments";
import Previewcrd from "../Admindash/Previewcrd";
import "../Admindash/Admin.css";
function Adash (){
   return(
     <>
       <Navbar />
       <Hero />
       <Features />
       <Stats />
       <Analytics />
       <Membership />
       <Attendance />
       <Payments />
       <Previewcrd />
     </>
   )
}
export default Adash;