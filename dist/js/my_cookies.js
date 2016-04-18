function checkLoggedIn() {
	var ID = Cookies.get('ID');
	var name = Cookies.get("name");
	var username = Cookies.get("username");

	if (ID == undefined || name == undefined || username == undefined) {
		window.location = "./login.html";
	}
}

function getCurrentUsername() {
	//return Cookies.get('username');
	return 'marek';
}

function getCurrentName() {
	//return Cookies.get('name');
	return 'Marek Gov';
}

function getCurrentID() {
	//return Cookies.get('ID');
	return 3;
}

function login(ID, name, username) {
	Cookies.set("ID", ID);
	Cookies.set("name", name);
	Cookies.set("username", username);
}

function logout() {
	Cookies.remove('ID');
	Cookies.remove('name');
	Cookies.remove('username');
	window.location = "./login.html";
}

$(document).ready(function() { 
	$('#loggedInUser').html('<b>'+getCurrentName()+'</b>');
});
