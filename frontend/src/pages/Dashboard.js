import DashboardNavbar from "../dashboard/DashboardNavbar";
import WelcomeCard from "../dashboard/WelcomeCard";
import WorkoutToday from "../dashboard/WorkoutToday";
import ProgressCard from "../dashboard/ProgressCard";
import CaloriesCard from "../dashboard/CaloriesCard";
import MembershipCard from "../dashboard/MembershipCard";
// import ScheduleCard from "../dashboard/ScheduleCard";

import "../dashboard/Dashboard.css";
import BMI from "../components/BMI";

function Dashboard() {

    return (

        <> 

            <DashboardNavbar />

            <main className="dashboard">

                <div className="container">

                    <WelcomeCard />

                    <div className="dashboard-grid">

                        <WorkoutToday />

                        <ProgressCard />

                        <CaloriesCard />

                        <MembershipCard />

                        {/* <ScheduleCard /> */}

                    </div>
                        <BMI/>

                </div>

            </main>

        </>

    );

}

export default Dashboard;