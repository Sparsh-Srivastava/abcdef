import React from "react";
import { useHistory } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Navbar.scss";

const Navbar = () => {
	const history = useHistory();
	return (
		<nav className="srm-nav">
			<div className="nav-logo">
				<Logo />
			</div>
			<div className="nav-list">
				<p onClick={() => history.push("/landing")}>Back</p>
				<p onClick={() => history.push("/landing")}>Posts</p>
			</div>
		</nav>
	);
};

export default Navbar;
