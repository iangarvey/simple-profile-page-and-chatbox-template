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
            <h1>My Profile</h1>
            <p>username: {userData.username}</p>
            <p>Profile Picture Space</p>
        </div>
    );
};
