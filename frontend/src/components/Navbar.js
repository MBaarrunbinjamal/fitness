import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [token, setToken] = useState(localStorage.getItem("auth"));
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("hero");
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("auth");
        setToken(null);
        navigate("/login");
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
            const sections = document.querySelectorAll("section[id],header[id]");
            let current = "hero";
            sections.forEach(section => {
                const top = section.offsetTop - 140;
                if (window.scrollY >= top) {
                    current = section.id;
                }
            });
            setActive(current);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeMenu = () => setOpen(false);

    return (
        <nav className={`navbar navbar-expand-lg fixed-top custom-navbar ${scrolled ? "scrolled" : ""}`} id="mainNav">
            <div className="container">
                <a className="navbar-brand" href="#hero">
                    FITNESS TRACKER<span className="brand-dot">.</span>
                </a>

                <button className="navbar-toggler" onClick={() => setOpen(!open)}>
                    <span className="bar bar1"></span>
                    <span className="bar bar2"></span>
                    <span className="bar bar3"></span>
                </button>

                <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                      


                        <li className="nav-item">
                            <Link className={`nav-link ${active === "hero" ? "active" : ""}`} to="/#hero" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${active === "about" ? "active" : ""}`} href="#about" onClick={closeMenu}>
                                About
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${active === "programs" ? "active" : ""}`} href="#programs" onClick={closeMenu}>
                                Programs
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className={`nav-link ${active === "pricing" ? "active" : ""}`} href="#pricing" onClick={closeMenu}>
                                Pricing
                            </a>
                        </li> */}
                        <li className="nav-item">
                            <a className={`nav-link ${active === "gallery" ? "active" : ""}`} href="#gallery" onClick={closeMenu}>
                                Gallery
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className={`nav-link ${active === "contact" ? "active" : ""}`} href="#contact" onClick={closeMenu}>
                                Contact
                            </a>
                        </li> */}
                        <li className="nav-item">
                            <Link className={`nav-link ${active === "contact" ? "active" : ""}`} to="/dashboard" onClick={closeMenu}>
                                Dashboard
                            </Link>
                        </li>

                        {!token && (
                            <li className="nav-item ms-lg-3">
                                <Link to="/login" className="btn btn-forge-primary" onClick={closeMenu}>
                                    Join Now
                                </Link>
                            </li>
                        )}
                        {token && (
                            <li className="nav-item ms-lg-3">
                                <Link to="#" onClick={() => { logout(); closeMenu(); }}>Logout</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;