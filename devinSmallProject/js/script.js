var urlBase = 'http://cop4331.fun/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contactID = "";
var phoneNumber = "";
var email = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var hash = md5( password );
	password = hash;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"email" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;
		console.log(userId);

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

        window.location.href = "http://cop4331.fun/manageContacts.html";
		saveCookie();

	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
    }

    return false;
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function saveListCookie(contacts)
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "contacts=" + contacts + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
		else if( tokens[0] == "contacts" )
		{
			contacts = parseInt( tokens[1].trim() );
		}

	}

	/*
	if( userId < 0 )
	{
		window.location.href = "http://cop4331.fun/index.html";
	}
	else
	{
		document.getElementById("welcomeheader").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
	}
	*/

}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "http://cop4331.fun/logout.html";
}

function createContact()
{
	readCookie();

	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phoneNumber = document.getElementById("phoneNumber").value;

	document.getElementById("userAddResult").innerHTML = "";

	var jsonPayload = '{"userID" : "' + userId + '", "firstName" : "' +  firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phoneNumber" : "' + phoneNumber + '"}';
	var url = urlBase + '/Add.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userAddResult").innerHTML = "User has been added";
				window.location.href = "http://cop4331.fun/manageContacts.html";
				return;
			}
		};

	}
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	var srch = document.getElementById("searchText").value;

	document.getElementById("contactSearchResult").innerHTML = "";

	readCookie();

	/*
	// If user has no contacts, display an error and return.
	if(contacts.length < 1 || contacts == undefined){
		document.getElementById("contactSearchResult2").innerHTML = "Nothing to search for. You currently don't have any contacts";
		return;
	}
	*/

	var jsonPayload = '{"search" : "' + srch + '", "userID" : "' + userId + '"}';
	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = xhr.responseText;

				if(jsonObject[jsonObject.length-2] == "[")
				{
					document.getElementById("contactSearchResult").innerHTML = "Sorry, no results found for " + srch;
					return 0;
				}

				var data = JSON.parse(xhr.responseText) ;
				console.log(data);

				var value = '<button class="btn btn-info btn-sm" onclick="updateContact()">Edit</button> <button type="Button" class="btn btn-danger btn-sm" onclick="deleteContact()">Delete</button>';

				data.forEach(function (arrayItem) {
					arrayItem["delete"] = value;
				});


                $(document).ready(function () {
                    $('table').bootstrapTable('load', data);
                });

                $('table').bootstrapTable("hideLoading");

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function listContacts()
{
	readCookie();

	var jsonPayload = '{"userID" : "' + userId + '"}';
	var url = urlBase + '/ListContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
                // $(function() {
                //     $('#table').bootstrapTable({
                //       data: data,
                //       formatLoadingMessage: function() {
                //         return '<b>This is a custom loading message...</b>';
                //       }
                //     });

                //     $("#table").bootstrapTable("showLoading");

                //     setTimeout(function() {
                //       $("#table").bootstrapTable("hideLoading");
                //     }, 1000);
                //   });

				var data = JSON.parse(xhr.responseText) ;
				data.forEach(function (arrayItem) {

					contactID = arrayItem["contactID"];
					firstName = arrayItem["firstName"];
					lastName = arrayItem["lastName"];
					phoneNumber = arrayItem["phoneNumber"];
					email = arrayItem["email"];

					// onclick= "manageContacts(' + firstName + ',' + lastName + ',' + email + ',' + phoneNumber + ')";"
					var value = '<button class="btn btn-info btn-sm" onclick= "getContactToEdit(' + firstName + ',' + lastName + ',' + email + ',' + phoneNumber + ');">Edit</button>' +
					'<button type="Button" class="btn btn-danger btn-sm" onclick="deleteContact(' + contactID + ');">Delete</button>';
					arrayItem["delete"] = value;
				});

				$(document).ready(function () {
					$('table').bootstrapTable({

                      data: data,
                      formatLoadingMessage: function ()
                      {
                          return ""
                      },
                      hideLoading: true
					});
				});

				$('table').bootstrapTable("hideLoading");

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactResult").innerHTML = err.message;
	}
}

function deleteContact(contactID)
{

	readCookie();

	var jsonPayload = '{"contactID" : "' + contactID + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	document.getElementById("userDeleteResult").innerHTML = "";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				// Return if there was an error
				if(jsonObject["error"] == "No Contact Found")
				{
					document.getElementById("userDeleteResult").innerHTML = "Trouble deleting contact";
					return;
				}

				document.getElementById("userDeleteResult").innerHTML = "User has been deleted";
				window.location.href = "http://cop4331.fun/manageContacts.html";
			}

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userDeleteResult").innerHTML = err.message;
	}

}

function getContactToEdit(firstName2, lastName2, email2, phoneNumber2){

	firstName = firstName2;
	lastName = lastName2;
	phoneNumber = phoneNumber2;
	email = email2;

	window.location.href = "http://cop4331.fun/editContact.html";

}

function manageContacts(firstName, lastName, email, phoneNumber){

	var srchFirstName = document.getElementById("firstName").value;
	var srchLastName = document.getElementById("lastName").value;
	var srchEmail = document.getElementById("email").value;
	var srchPhoneNumber = document.getElementById("phoneNumber").value;

	if(srchFirstName != '\0')
		firstName = srchFirstName;
	else if(srchLastName != '\0')
		lastName = srchLastName;
	else if(srchEmail != '\0')
		email = srchEmail;
	else if(srchPhoneNumber != '\0')
		phoneNumber = srchPhoneNumber;


	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phoneNumber" : "' + phoneNumber + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	document.getElementById("updateResult").innerHTML = "";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				// Return if there was an error
				if(jsonObject["error"] == "Contact could not be updated.")
				{
					document.getElementById("userDeleteResult").innerHTML = "Trouble updating contact";
					return;
				}

				document.getElementById("updateResult").innerHTML = "User has been updated";
				window.location.href = "http://cop4331.fun/manageContacts.html";
			}

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("updateResult").innerHTML = err.message;
	}

}

function doSignup()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var question1 = document.getElementById("question1").value;
	var question2 = document.getElementById("question2").value;
	hash = md5( password );
	password = hash;

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "password" : "' + password + '", "email" : "' + email + '", "question1" : "' + question1 + '", "question2" : "' + question2 + '"}';
	var url = urlBase + '/SignUp.' + extension;

	document.getElementById("signUpResult").innerHTML = "";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("signUpResult").innerHTML = "You have signed up successfully";
				window.location.href = "http://cop4331.fun/index.html";
				return;
			}

		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
    }
}

function resetPassword
{
	userId = 0;

	var login = document.getElementById("email").value;
	var q1 = document.getElementById("question1").value;
	var q2 = document.getElementById("question2").value;

	document.getElementById("resetResult").innerHTML = "";

	var jsonPayload = '{"email" : "' + email + '", "question1" : "' + question1 + '", "question2" : "' + question2 + '"}';
	var url = urlBase + '/ResetPassword.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userEmail = jsonObject.email;
		userQ1 = jsonObject.question1;
		userQ2 = jsonObject.question2;
		console.log(userEmail);

		if( userEmail < 1 || userQ1 !== q1 || userQ2 !== q2 )
		{
			document.getElementById("resetResult").innerHTML = "Incorrect security question answers or email.";
			return;
		}

        window.location.href = "http://cop4331.fun/index.html";
		saveCookie();

	}
	catch(err)
	{
		document.getElementById("resetResult").innerHTML = err.message;
    }

    return false;
}
