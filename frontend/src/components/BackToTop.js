import { useEffect, useState } from "react";

function BackToTop() {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setShow(window.scrollY > 500);

        };

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);

    }, []);

    return (

<button

id="backToTop"

className={`back-to-top ${show ? "show" : ""}`}

onClick={() =>
window.scrollTo({
top:0,
behavior:"smooth"
})
}

>

<i className="bi bi-arrow-up"></i>

</button>

    );

}

export default BackToTop;