import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function DashboardNavbar() {

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // =========================================
    // MOBILE MENU STATE
    // =========================================

    const [menuOpen, setMenuOpen] = useState(false);

    // =========================================
    // PROFILE DROPDOWN STATE
    // =========================================

    const [dropdownOpen, setDropdownOpen] = useState(false);

    // =========================================
    // AUTH STATE
    // =========================================

    const [auth, setAuth] = useState(() => {

        const stored = localStorage.getItem("auth");

        return stored
            ? JSON.parse(stored)
            : null;

    });

    // =========================================
    // USER
    // =========================================

    const user = auth
        ? auth.user
        : null;

    // =========================================
    // FRESH USER
    // =========================================

    const [freshUser, setFreshUser] = useState(null);

    // =========================================
    // ACTIVE PLAN
    // =========================================

    const [hasActivePlan, setHasActivePlan] = useState(false);

    // =========================================
    // TOKEN
    // =========================================

    const token = auth
        ? auth.token
        : null;

    // =========================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {

                setDropdownOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    // =========================================
    // FETCH USER DATA
    // =========================================

    useEffect(() => {

        if (!token) return;

        // =====================================
        // FETCH USER
        // =====================================

        fetch(
            "http://localhost:5000/api/getuser",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((res) => res.json())

            .then((data) => {

                if (data.success) {

                    setFreshUser(data.user);

                }

            })

            .catch(() => {});


        // =====================================
        // FETCH WORKOUT PLAN
        // =====================================

        fetch(
            "http://localhost:5000/api/my-workout-plan",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((res) => res.json())

            .then((data) => {

                setHasActivePlan(
                    !!data.success
                );

            })

            .catch(() => {

                setHasActivePlan(false);

            });

    }, [token]);

    // =========================================
    // DISPLAY USER
    // =========================================

    const displayUser =
        freshUser || user;

    // =========================================
    // AVATAR
    // =========================================

    const avatarSrc =

        displayUser &&
        displayUser.profilePicture

            ? `http://localhost:5000${displayUser.profilePicture}`

            : "https://i.pravatar.cc/100?img=12";

    // =========================================
    // LOGOUT
    // =========================================

    function logout() {

        localStorage.removeItem("auth");

        setAuth(null);

        setDropdownOpen(false);

        setMenuOpen(false);

        navigate("/login");

    }

    // =========================================
    // OPEN MOBILE MENU
    // =========================================

    function openMenu() {

        setMenuOpen(true);

        setDropdownOpen(false);

    }

    // =========================================
    // CLOSE MOBILE MENU
    // =========================================

    function closeMenu() {

        setMenuOpen(false);

    }

    // =========================================
    // TOGGLE PROFILE DROPDOWN
    // =========================================

    function toggleDropdown(event) {

        event.stopPropagation();

        setDropdownOpen(
            (previous) => !previous
        );

    }

    // =========================================
    // CLOSE DROPDOWN
    // =========================================

    function closeDropdown() {

        setDropdownOpen(false);

    }

    return (

        <>

            {/* =========================================
                MAIN NAVBAR
            ========================================= */}

            <nav className="dashboard-navbar">

                <div className="container dashboard-nav-inner">


                    {/* =====================================
                        LOGO
                    ===================================== */}

                    <div className="dashboard-logo">

                        FITNESS TRACKER<span>.</span>

                    </div>


                    {/* =====================================
                        DESKTOP NAVIGATION
                    ===================================== */}

                    <ul className="dashboard-nav-links">

                        <li>
                            <Link to="/dashboard">
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link to="/progress">
                                MY-Progress
                            </Link>
                        </li>

                        <li>
                            <Link to="/plans">
                                Membership
                            </Link>
                        </li>

                        <li>
                            <Link to="/schedule">
                                Schedule
                            </Link>
                        </li>

                        <li>
                            <Link to="/nschedule">
                                Nutrition-Logs
                            </Link>
                        </li>
                           <li>
                            <Link to="/support">
                                User-Support
                            </Link>
                        </li>


                        <li>
                            <Link to="/">
                                Back to Web
                            </Link>
                        </li>

                        {hasActivePlan && (

                            <li>

                                <Link to="/my-plan">
                                    My Plan
                                </Link>

                            </li>

                        )}

                    </ul>


                    {/* =====================================
                        USER PROFILE
                    ===================================== */}

                    <div
                        className="dashboard-user"
                        ref={dropdownRef}
                    >

                        {/* AVATAR */}

                        <img
                            src={avatarSrc}
                            alt="User"
                        />


                        {/* PROFILE DROPDOWN */}

                        <div className="dashboard-profile-dropdown">

                            {/* PROFILE BUTTON */}

                            <button

                                type="button"

                                className={`
                                    pf-admin-btn
                                    ${dropdownOpen
                                        ? "profile-dropdown-active"
                                        : ""
                                    }
                                `}

                                onClick={toggleDropdown}

                                aria-expanded={
                                    dropdownOpen
                                }

                            >

                                <span className="
                                    profile-username
                                ">

                                    {displayUser
                                        ? displayUser.username
                                        : "Guest"
                                    }

                                </span>

                                <span
                                    className={`
                                        profile-arrow
                                        ${dropdownOpen
                                            ? "arrow-up"
                                            : ""
                                        }
                                    `}
                                >
                                    ▼
                                </span>

                            </button>


                            {/* DROPDOWN MENU */}

                            {dropdownOpen && (

                                <div className="
                                    dashboard-profile-menu
                                ">

                                    {/* PROFILE */}

                                    <Link

                                        to="/profile"

                                        className="
                                            profile-menu-item
                                        "

                                        onClick={
                                            closeDropdown
                                        }

                                    >

                                        <span>
                                            👤
                                        </span>

                                        Profile

                                    </Link>


                                    {/* LOGOUT */}

                                    <button

                                        type="button"

                                        className="
                                            profile-menu-item
                                            logout-item
                                        "

                                        onClick={logout}

                                    >

                                        <span>
                                            ⎋
                                        </span>

                                        Logout

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =====================================
                        MOBILE HAMBURGER
                    ===================================== */}

                    <button

                        className="
                            dashboard-menu-toggle
                        "

                        type="button"

                        onClick={openMenu}

                        aria-label="
                            Open navigation menu
                        "

                    >

                        <span></span>
                        <span></span>
                        <span></span>

                    </button>

                </div>

            </nav>


            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}

            {menuOpen && (

                <div

                    className="
                        dashboard-menu-overlay
                    "

                    onClick={closeMenu}

                ></div>

            )}


            {/* =========================================
                MOBILE SIDE MENU
            ========================================= */}

            <aside

                className={`
                    dashboard-mobile-menu
                    ${menuOpen
                        ? "mobile-menu-open"
                        : ""
                    }
                `}

            >

                {/* =====================================
                    MOBILE MENU HEADER
                ===================================== */}

                <div className="
                    dashboard-mobile-menu-header
                ">

                    <div className="
                        dashboard-mobile-logo
                    ">

                        FITNESS TRACKER<span>.</span>

                    </div>


                    {/* CLOSE BUTTON */}

                    <button

                        type="button"

                        className="
                            dashboard-menu-close
                        "

                        onClick={closeMenu}

                        aria-label="
                            Close navigation menu
                        "

                    >

                        &times;

                    </button>

                </div>


                {/* =====================================
                    MOBILE MENU LINKS
                ===================================== */}

                <ul className="
                    dashboard-mobile-links
                ">

                    <li>

                        <Link
                            to="/dashboard"
                            onClick={closeMenu}
                        >

                            Home

                        </Link>

                    </li>


                    <li>

                        <Link
                            to="/progress"
                            onClick={closeMenu}
                        >

                            MY-Progress

                        </Link>

                    </li>


                    <li>

                        <Link
                            to="/plans"
                            onClick={closeMenu}
                        >

                            Membership

                        </Link>

                    </li>


                    <li>

                        <Link
                            to="/schedule"
                            onClick={closeMenu}
                        >

                            Schedule

                        </Link>

                    </li>


                    <li>

                        <Link
                            to="/nschedule"
                            onClick={closeMenu}
                        >

                            Nutrition-Logs

                        </Link>

                    </li>
 <li>
                            <Link to="/support">
                                User-Support
                            </Link>
                        </li>
                        
                        {hasActivePlan && (

                            <li>

                                <Link to="/my-plan">
                                    My Plan
                                </Link>

                            </li>

                        )}
                     <li>

                        <Link
                            to="/"
                            onClick={closeMenu}
                        >

                            Back To Web

                        </Link>

                    </li>


                    {hasActivePlan && (

                        <li>

                            <Link
                                to="/my-plan"
                                onClick={closeMenu}
                            >

                                My Plan

                            </Link>

                        </li>

                    )}

                </ul>

            </aside>

        </>

    );

}

export default DashboardNavbar;