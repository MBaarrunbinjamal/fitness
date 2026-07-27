import { useNavigate } from "react-router-dom";

function WelcomeCard() {
    const navigate = useNavigate();

    const auth = localStorage.getItem("auth");

    let user = null;

    try {
        user = auth ? JSON.parse(auth)?.user : null;
    } catch (error) {
        console.error("Invalid auth data:", error);
    }

    const username = user?.username || "Member";

    return (
        <section className="welcome-card">

            {/* Decorative Glow */}
            <div className="welcome-card-glow"></div>

            {/* Content */}
            <div className="welcome-card-content">

                <span className="welcome-badge">
                    <i className="bi bi-stars"></i>
                    Welcome Back, {username}
                </span>

                <h1>
                    Ready For Today's Workout?
                </h1>

                <p>
                    Keep pushing yourself.
                    Every workout gets you closer to your goals.
                </p>

            </div>


            {/* Action */}
            <div className="welcome-card-action">

                <button
                    type="button"
                    className="btn-forge-primary welcome-workout-btn"
                    onClick={() => navigate("/workout-session")}
                >
                    <span>Start Workout</span>
                    <i className="bi bi-arrow-right"></i>
                </button>

            </div>

        </section>
    );
}

export default WelcomeCard;

