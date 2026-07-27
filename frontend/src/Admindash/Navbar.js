import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth");
  });

  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navbarRef = useRef(null);
  const userMenuRef = useRef(null);

  // =========================================
  // GET USER FROM LOCAL STORAGE
  // =========================================
  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        setUser(parsedAuth?.user || null);
      } catch (error) {
        console.error("Invalid auth data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // =========================================
  // CLOSE NAVBAR / DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================
  useEffect(() => {
    function handleClickOutside(event) {
      // Close mobile navbar if click is outside navbar
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setNavOpen(false);
      }

      // Close user dropdown if click is outside user menu
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================
  // CLOSE MOBILE NAVBAR ON ESCAPE
  // =========================================
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setNavOpen(false);
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================================
  // LOGOUT
  // =========================================
  function logout() {
    localStorage.removeItem("auth");

    setToken(null);
    setUser(null);
    setNavOpen(false);
    setUserMenuOpen(false);

    navigate("/login");
  }

  // =========================================
  // NAV LINK CLICK
  // =========================================
  function handleNavLinkClick() {
    setNavOpen(false);
    setUserMenuOpen(false);
  }

  // =========================================
  // TOGGLE MOBILE NAVBAR
  // =========================================
  function toggleNavbar() {
    setNavOpen((prev) => !prev);

    // Close user dropdown when opening/closing mobile navbar
    setUserMenuOpen(false);
  }

  // =========================================
  // TOGGLE USER DROPDOWN
  // =========================================
  function toggleUserMenu() {
    setUserMenuOpen((prev) => !prev);
  }

  return (
    <nav
      className={`navbar navbar-dark sticky-top pf-navbar ${
        navOpen ? "pf-navbar-open" : ""
      }`}
      id="mainNav"
      ref={navbarRef}
    >
      <div className="container-fluid px-3 px-lg-4">

        {/* =========================================
            LOGO
        ========================================= */}
        <Link
          className="navbar-brand pf-brand"
          to="/admin"
          onClick={handleNavLinkClick}
        >
          <span className="pf-logo-mark">
            <i className="bi bi-lightning-charge-fill"></i>
          </span>

          FITNESS
          <span className="text-accent">TRACKER.</span>
        </Link>

        {/* =========================================
            MOBILE HAMBURGER / CLOSE BUTTON
        ========================================= */}
        <button
          className={`pf-mobile-toggle ${
            navOpen ? "pf-mobile-toggle-active" : ""
          }`}
          type="button"
          onClick={toggleNavbar}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={navOpen}
        >
          <i
            className={`bi ${
              navOpen ? "bi-x-lg" : "bi-list"
            }`}
          ></i>
        </button>

        {/* =========================================
            NAVIGATION
        ========================================= */}
        <div
          className={`pf-navbar-menu ${
            navOpen ? "pf-navbar-menu-open" : ""
          }`}
          id="navMain"
        >

          {/* =========================================
              NAV LINKS
          ========================================= */}
          <ul
            className="navbar-nav mx-auto pf-nav-links"
            id="navLinks"
          >

            <li className="nav-item">
              <Link
                to="/admin"
                className="nav-link "
                onClick={handleNavLinkClick}
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#reports"
                onClick={handleNavLinkClick}
              >
                Reports
              </a>
            </li>

            <li className="nav-item">
              <Link
                to="/Allusers"
                className="nav-link"
                onClick={handleNavLinkClick}
              >
                Users
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/plans"
                className="nav-link"
                onClick={handleNavLinkClick}
              >
                Add Plans
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/requests"
                className="nav-link"
                onClick={handleNavLinkClick}
              >
                Requests
              </Link>
            </li>


            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={handleNavLinkClick}
              >
                Back To Website
              </Link>
            </li>

          </ul>

          {/* =========================================
              USER ACTIONS
          ========================================= */}
          <div className="d-flex align-items-center gap-2 pf-nav-actions">

            {/* =========================================
                USER DROPDOWN
            ========================================= */}
            <div
              className="pf-user-dropdown"
              ref={userMenuRef}
            >

              <button
                className={`pf-admin-btn ${
                  userMenuOpen ? "pf-admin-btn-active" : ""
                }`}
                type="button"
                onClick={toggleUserMenu}
                aria-expanded={userMenuOpen}
              >

                {/* Avatar */}
                <span className="pf-avatar">
                  {user?.username
                    ? user.username.charAt(0).toUpperCase()
                    : "G"}
                </span>

                {/* Username */}
                <span className="pf-user-name">
                  {user ? user.username : "Guest"}
                </span>

                {/* Arrow */}
                <i
                  className={`bi ${
                    userMenuOpen
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
                  } pf-dropdown-arrow`}
                ></i>

              </button>

              {/* =========================================
                  DROPDOWN MENU
              ========================================= */}
              {userMenuOpen && (
                <div className="pf-dropdown pf-dropdown-show">

                  <Link
                    className="pf-dropdown-item"
                    to="/profile"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setNavOpen(false);
                    }}
                  >
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    className="pf-dropdown-item"
                    to="/settings"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setNavOpen(false);
                    }}
                  >
                    <i className="bi bi-gear"></i>
                    <span>Settings</span>
                  </Link>

                  <Link
                    className="pf-dropdown-item"
                    to="/help"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setNavOpen(false);
                    }}
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Help Center</span>
                  </Link>

                  <div className="pf-dropdown-divider"></div>

                  <button
                    className="pf-dropdown-item pf-logout-item"
                    type="button"
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;