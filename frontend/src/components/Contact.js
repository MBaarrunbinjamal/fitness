import { useState } from "react";

function Contact() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (

            !form.name ||

            !form.email ||

            !form.subject ||

            !form.message

        ) {

            alert("Please fill all fields.");

            return;

        }

        setSuccess(true);

        setForm({

            name: "",

            email: "",

            subject: "",

            message: ""

        });

        setTimeout(() => {

            setSuccess(false);

        }, 5000);

    };

    return (

<section className="section contact-section" id="contact">

<div className="container">

<div className="row g-5">

<div className="col-lg-5">

<p className="eyebrow reveal-up">

Get In Touch

</p>

<h2 className="section-title reveal-up">

Let's start your <span className="text-accent">journey.</span>

</h2>

<p className="section-desc reveal-up">

Drop by, call, or send us a message.

</p>

<div className="contact-info mt-4">

<div className="contact-info-item">

<i className="bi bi-telephone"></i>

<div>

<strong>Phone</strong>

<span>+1 (555) 204-8890</span>

</div>

</div>

<div className="contact-info-item">

<i className="bi bi-envelope"></i>

<div>

<strong>Email</strong>

<span>hello@forgeclub.com</span>

</div>

</div>

<div className="contact-info-item">

<i className="bi bi-geo-alt"></i>

<div>

<strong>Location</strong>

<span>420 Iron Avenue, Metro City</span>

</div>

</div>

</div>

</div>

<div className="col-lg-7">

<form className="contact-form" onSubmit={handleSubmit}>

<div className="row g-3">

<div className="col-sm-6">

<div className="form-floating">

<input

type="text"

name="name"

className="form-control forge-input"

placeholder="Your Name"

value={form.name}

onChange={handleChange}

/>

<label>Your Name</label>

</div>

</div>

<div className="col-sm-6">

<div className="form-floating">

<input

type="email"

name="email"

className="form-control forge-input"

placeholder="Your Email"

value={form.email}

onChange={handleChange}

/>

<label>Your Email</label>

</div>

</div>

<div className="col-12">

<div className="form-floating">

<input

type="text"

name="subject"

className="form-control forge-input"

placeholder="Subject"

value={form.subject}

onChange={handleChange}

/>

<label>Subject</label>

</div>

</div>

<div className="col-12">

<div className="form-floating">

<textarea

name="message"

className="form-control forge-input"

style={{ height: "140px" }}

placeholder="Message"

value={form.message}

onChange={handleChange}

/>

<label>Message</label>

</div>

</div>

<div className="col-12">

<button

type="submit"

className="btn btn-forge-primary btn-lg magnetic"

>

<span>Send Message</span>

<i className="bi bi-arrow-up-right"></i>

</button>

{success && (

<p className="form-success show">

Message sent — we'll be in touch shortly.

</p>

)}

</div>

</div>

</form>

</div>

</div>

</div>

</section>

    );

}

export default Contact;