import { useState } from "react";

function BMI() {

    const [height,setHeight]=useState("");

    const [weight,setWeight]=useState("");

    const [bmi,setBMI]=useState("--");

    const [category,setCategory]=useState("Enter your details");

    const [color,setColor]=useState("");

    const [marker,setMarker]=useState(0);

    const calculateBMI=()=>{

        const h=parseFloat(height);

        const w=parseFloat(weight);

        if(!h || !w){

            setBMI("--");

            setCategory("Please enter valid numbers");

            setColor("");

            return;

        }

        const value=(w/((h/100)*(h/100))).toFixed(1);

        setBMI(value);

        let percent=0;

        if(value<18.5){

            setCategory("Underweight");

            setColor("#3b82f6");

            percent=(value/18.5)*12.5;

        }

        else if(value<25){

            setCategory("Healthy Weight");

            setColor("limegreen");

            percent=12.5+((value-18.5)/(25-18.5))*37.5;

        }

        else if(value<30){

            setCategory("Overweight");

            setColor("orange");

            percent=50+((value-25)/5)*25;

        }

        else{

            setCategory("Obese");

            setColor("red");

            percent=75+((value-30)/15)*25;

        }

        setMarker(Math.min(percent,98));

    }

    return(

<section className="section bmi-section">

<div className="container">

<div className="bmi-card">

<div className="row g-5 align-items-center">

<div className="col-lg-5">

<p className="eyebrow">

Know Your Numbers

</p>

<h2 className="section-title">

BMI <span className="text-accent">Calculator.</span>

</h2>

<p className="section-desc">

Get a quick snapshot of where you stand today.

</p>

</div>

<div className="col-lg-7">

<div className="row g-3">

<div className="col-sm-6">

<label className="form-label">

Height (cm)

</label>

<input

type="number"

className="form-control forge-input"

value={height}

onChange={(e)=>setHeight(e.target.value)}

/>

</div>

<div className="col-sm-6">

<label className="form-label">

Weight (kg)

</label>

<input

type="number"

className="form-control forge-input"

value={weight}

onChange={(e)=>setWeight(e.target.value)}

/>

</div>

<div className="col-12">

<button

className="btn btn-forge-primary w-100"

onClick={calculateBMI}

>

Calculate BMI

</button>

</div>

</div>

<div className="bmi-result show mt-4">

<div className="bmi-result-value">

<span>{bmi}</span>

<small style={{color}}>

{category}

</small>

</div>

<div className="bmi-bar">

<div

className="bmi-bar-marker"

style={{left:`${marker}%`}}

/>

</div>

<div className="bmi-scale">

<span>Underweight</span>

<span>Healthy</span>

<span>Overweight</span>

<span>Obese</span>

</div>

</div>

</div>

</div>

</div>

</div>

</section>

    )

}

export default BMI;