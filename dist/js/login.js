$(document).ready(function() {

	var salt = "eFmVkPMF52GaEgW";
	var aes = new AesUtil();

	$('#loginError').hide();

	$('#loginButton').on('click', function() {
		var username = $('#username').val().trim();
		var password = $('#password').val().trim();

		$('#loginError').hide();

        if (validateFields(username, password)) {
        	var usernameEnc = ""+aes.encrypt(username);
			var passwordEnc = ""+CryptoJS.SHA256(password+salt);

            //tryLogin(usernameEnc, passwordEnc);
            tryLogin(username, password);
        }
    });

	function tryLogin(username, password) {
		$('#loginButton').html('<i class="fa fa-circle-o-notch fa-spin"></i> Logging in');
		var loginDetails = {username:username, password:password, isCitizen:false};
        $.ajax({
                "url" : url+"/login",
                "type" : "POST",
                "data" : JSON.stringify(loginDetails),
                "contentType" : "application/json; charset=utf-8",
                "dataType" : "json",    
                "success" : function(response) {
                    if (response.ID >= 0) {
						//SUCCESS
						$('#loginButton').html('<i class="fa fa-check"></i> Successfully logged in');
						login(
							response.ID, 
							response.name, 
							response.username);
						$(location).attr('href','./overview.html');
					} else {
						//ERRROR
						$('#loginError').show();
						$('#loginButton').html('Login');
						console.log("ERROR logging in");
						$('#password').val("");
					}
		        },
                "error": function(jqxhr,textStatus,errorThrown) {
                	$('#loginError').show();
					$('#loginButton').html('Login');
					$('#password').val("");
					console.log("ERROR logging in");
                    console.log(jqxhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
	}

	function validateFields(username, password) {
		var valid = true;
		
		if (username.length < 3) {
			valid = false
		}

		if (password.length < 3) {
			valid = false;
		}

		return valid;
	}
});