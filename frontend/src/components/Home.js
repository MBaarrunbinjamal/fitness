import Navbar from "./Navbar";
import Hero from "./Hero";
import Why from "./Why";
import Services from "./Services";
import Pricing from "./Pricing";
import BMI from "./BMI";
import Gallery from "./Gallery";
import Trainers from "./Trainers";
// import Schedule from "./Schedule";
import Stats from "./Stats";
import Testimonials from "./Testimonials"; 
import FAQ from "./FAQ";
import Contact from "./Contact";

function Home(){

return(

<>
<Navbar />
            <Hero />
            <Why />
            <Services /> 
            <Pricing />
            <BMI />
            <Gallery />
            <Trainers />
            {/* <Schedule /> */}
            <Stats />
            <Testimonials />
            <FAQ />
            <Contact />
            
{/* <h1>Home</h1> */}

</>

);

}

export default Home; 