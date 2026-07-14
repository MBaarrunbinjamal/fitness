import { Link } from "react-router-dom";

function DashboardNavbar() {

    return (

        <nav className="dashboard-navbar">

            <div className="container dashboard-nav-inner">

                <div className="dashboard-logo">

                    FORGE<span>.</span>

                </div>

                <ul>

                    <li>

                        <Link to="/">Home</Link>

                    </li>

                    <li>

                        <a href="#progress">Progress</a>

                    </li>

                    <li>

                        <a href="#membership">Membership</a>

                    </li>

                    <li>

                        <a href="#schedule">Schedule</a>

                    </li>

                </ul>

                <div className="dashboard-user">

                    <img

                        src="https://i.pravatar.cc/100?img=12"

                        alt="User"

                    />

                    <div>

                        <strong>Meer</strong>

                        <small>Premium Member</small>

                    </div>

                </div>

            </div>

        </nav>

    );

}

export default DashboardNavbar;