import { NavLink } from 'react-router-dom';

const NavBar = () => {
	return (
		<div>
			<nav>
				<div className="nav-items container">
					<div className="logo">						
						<h1>Sales Manager Web Client</h1>
					</div>
					<ul>
						<li>
							<NavLink to="/">Upload</NavLink>
						</li>
						<li>
							<NavLink to="/transactions">All Transactions</NavLink>
						</li>
						<li>
							<NavLink to="/balance">Balance</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
};

export default NavBar;