import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const checkAuthStatus = () => {
			const token = localStorage.getItem("token");
			setLoggedIn(!!token);
		};
		checkAuthStatus();
		window.addEventListener('storage', checkAuthStatus);
		window.addEventListener('authChange', checkAuthStatus);

		return () => {
			window.removeEventListener('storage', checkAuthStatus);
			window.removeEventListener('authChange', checkAuthStatus);
		};
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setLoggedIn(false);

		// Notify other components of auth change
		window.dispatchEvent(new Event('authChange'));

		alert("You have been logged out successfully!");

		window.location.href = '/login';

	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
				{loggedIn ? (
					<button className="btn btn-danger" onClick={handleLogout}>
						Logout
					</button>
				) : (
					<Link to="/login">
						<button className="btn btn-success">Login</button>
					</Link>
				)}
				{loggedIn ? (
					<Link to="/myprofile">
						<button className="btn btn-info">My Profile</button>
					</Link>
				) : (
					<Link to="/register">
						<button className="btn btn-primary">Register</button>
					</Link>
				)}
			</div>
		</nav>
	);
};