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

	$('#createAccount').on('show.bs.modal', function (event) {
        var modal = $(this);

        resetCreateAccountModal();

        $("#newAccountSubmit").off("click").on("click", function() {
        	var fullname = modal.find('#fullname').val().trim();
        	var email = modal.find('#email').val().trim();
        	var password1 = modal.find('#passwordOne').val().trim();
        	var password2 = modal.find('#passwordConfirm').val().trim();

        	if (validateFields(fullname, email, password1, password2)) {
        		var newUser = createNewUserDetails(fullname, email, password1);
        		$('#newAccountSubmit').html('<i class="fa fa-cog fa-spin"></i> Creating your account');
        		$.ajax({
	                "url" : url+"/login/register",
	                "type" : "POST",
	                "data" : JSON.stringify(newUser),
	                "contentType" : "application/json; charset=utf-8",
	                "dataType" : "json",    
	                "success" : function(response) {
	                    if (response.ID >= 0) {
							//SUCCESS
							console.log(response);
							$('#newAccountSubmit').html('<i class="fa fa-check"></i> Account created');
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
			        }
	            });
        	}
        });
    });

    function validateFields(fullname, email, password1, password2) {
    	if (fullname == undefined || fullname.length == 0 || fullname == "") {
    		$('#error').html('<i class="fa fa-times"/> You must not leave your name blank.');
    		return false;
    	}

    	if (email == undefined || email.length == 0 || email == "") {
    		$('#error').html('<i class="fa fa-times"/> You must not leave your email blank.');
    		return false;
    	}

    	if (email.indexOf('@') == -1 || !email.endsWith('.gov.uk')) {
    		$('#error').html('<i class="fa fa-times"/> You can only signup with a government email.');
    		return false;
    	}

    	if (password1 == undefined || password1.length == 0 || password1 == "") {
    		$('#error').html('<i class="fa fa-times"/> You must not leave your password blank.');
    		return false;
    	}

    	if (password2 == undefined || password2.length == 0 || password2 == "") {
    		$('#error').html('<i class="fa fa-times"/> You must not leave your password confirmation field blank.');
    		return false;
    	}

    	if (password1 != password2) {
    		$('#error').html('<i class="fa fa-times"/> Your passwords do not match.');
    		return false;
    	}

    	return true;
    }

    function createNewUserDetails(fullname, email, password1) {
    	return {
    		username: email,
    		password: password1,
    		name: fullname,
    		isCitizen: false
    	};
    }

    function resetCreateAccountModal() {
    	$("#fullname").val("");
        $("#email").val("");
        $("#passwordOne").val("");
        $("#passwordConfirm").val("");

        $("#error").html('');
        $('#newAccountSubmit').html('<i class="fa fa-plus"></i> Create account');
    }
});