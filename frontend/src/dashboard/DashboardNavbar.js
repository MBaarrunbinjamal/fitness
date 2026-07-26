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

    var [freshUser, setFreshUser] = useState(null);
    var [hasActivePlan, setHasActivePlan] = useState(false);

    var token = auth ? auth.token : null;

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:5000/api/getuser", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setFreshUser(data.user);
                }
            })
            .catch(() => {});

        fetch("http://localhost:5000/api/my-workout-plan", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setHasActivePlan(!!data.success);
            })
            .catch(() => setHasActivePlan(false));
    }, [token]);

    var displayUser = freshUser || user;

    var avatarSrc = displayUser && displayUser.profilePicture
        ? `http://localhost:5000${displayUser.profilePicture}`
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
                    <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/progress">MY-Progress</Link></li>
                    <li><Link to='/plans'>Membership</Link></li>
                    <li><Link to="/schedule">Schedule</Link></li>
                    <li><Link to="/nschedule">Nutrition-Logs</Link></li>
                

                    {hasActivePlan && (
                        <li><Link to='/my-plans'>My Plan</Link></li>
                    )}
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
                                {displayUser ? displayUser.username : "Guest"}
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