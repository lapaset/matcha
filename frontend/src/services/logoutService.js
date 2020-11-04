const handleLogout = () => {
	localStorage.removeItem('loggedMatchaUser');
	localStorage.removeItem('coordinates');
	window.location.href="/login";
}

export default { handleLogout };