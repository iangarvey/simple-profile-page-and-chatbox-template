import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}`;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        console.log("Token:", token);

        const fetchMyProfile = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${apiUrl}api/myprofile`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            console.log("Profile response:", data);

            if (!response.ok) {
                setError(data.error || "Failed to fetch private data");
                return;
            }
            console.log("User data:", data.user);
            setUserData(data.user);
        };

        fetchMyProfile();
    }, [navigate]);

    if (error) {
        return <div className="container alert alert-danger">{error}</div>;
    }

    if (!userData) {
        return <div className="container">Loading...</div>;
    }
    return (
        <div>
            <div className="page-container d-flex align-items-center justify-content-center">
                <div className="profile-container d-flex flex-column align-items-center justify-content-center border border-3 w-50">
                     {/* Profile Picture Placeholder */}
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s" alt="Profile" className="rounded-full" />
                    <h1 style={{ textAlign: "center" }}>{userData.username}</h1>
                    <p style={{ textAlign: "center" }}>Welcome to your profile!</p>
                </div>
            </div>
        </div>
    );
};
