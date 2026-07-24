import { useNavigate } from "react-router-dom";

function WelcomeCard() {
    var navigate = useNavigate();

    var auth = localStorage.getItem("auth");
    var user = auth ? JSON.parse(auth).user : null;

    return (
        <section className="welcome-card">
            <div>
                <span className="badge">
                    Welcome Back {user?.username } 
                </span>

                <h1>
                    Ready For Today's Workout?
                </h1>

                <p>
                    Keep pushing yourself.
                    Every workout gets you closer to your goals.
                </p>
            </div>

            <button
                className="btn-forge-primary"
                onClick={() => navigate("/workout-session")}
            >
                Start Workout
            </button>
        </section>
    );
}

export default WelcomeCard;