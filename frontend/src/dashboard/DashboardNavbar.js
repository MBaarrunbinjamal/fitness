import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Dropdown from "bootstrap/js/dist/dropdown";

function DashboardNavbar() {
    var dropdownRef = useRef(null);
    var navigate = useNavigate();

    useEffect(() => {
        if (dropdownRef.current) {
            new Dropdown(dropdownRef.current);
        }
    }, []);

    var [auth, setAuth] = useState(() => {
        var stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : null;
    });
    var user = auth ? auth.user : null;

    var avatarSrc = user && user.profilePicture
        ? `http://localhost:5000${user.profilePicture}`
        : "https://i.pravatar.cc/100?img=12";

    function logout() {
        localStorage.removeItem("auth");
        setAuth(null);
        navigate("/login");
    }

    return (
        <nav className="dashboard-navbar">
            <div className="container dashboard-nav-inner">
                <div className="dashboard-logo">
                    FORGE<span>.</span>
                </div>

                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#progress">Progress</a></li>
                    <li><a href="#membership">Membership</a></li>
                    <li><Link to="/schedule">Schedule</Link></li>
                    <li><Link to="/nschedule">Nutrition-Logs</Link></li>
                </ul>

                <div className="dashboard-user">
                    <img src={avatarSrc} alt="User" />

                    <div className="dropdown">
                        <button
                            ref={dropdownRef}
                            className="pf-admin-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="d-none d-xl-inline ms-2">
                                {user ? user.username : "Guest"}
                            </span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end ">
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    Profile
                                </Link>
                            </li>
                        <li>
    <button className="dropdown-item logout-item" onClick={logout}>
        Logout
    </button>
</li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default DashboardNavbar;