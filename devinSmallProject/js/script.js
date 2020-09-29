var urlBase = 'http://cop4331.fun/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

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
			alert("User/Password combination incorrect\n " + "hash: " + hash);
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
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userAddResult").innerHTML = "User has been added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	var contactList = [];
	var j = 0;
	var i = 0;
	var srch = document.getElementById("searchText").value;

	document.getElementById("contactSearchResult").innerHTML = "";

	readCookie();

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
				var jsonObject = JSON.parse( xhr.responseText );

				jsonObject.forEach(item => {
					length = Object.entries(item).length;

					Object.entries(item).forEach(([key, value]) => 
					{
						j++;

						if(j == 1 )
						{
							contacts[i] = `${key}: ${value} `;
						}
						else if(j == length) 
						{
							contacts[i] += ` ${key}: ${value} `;
						}
						else
						{
							contacts[i] += ` ${key}: ${value} `;
						}
					});
					contacts[i] += "<br />\r\n";
					i++;
					j = 0;
				});
				document.getElementsByTagName("p")[0].innerHTML = contacts.join(" ");; 
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
	var contacts = [];
	var i = 0;
	var j = 0;

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
				var jsonObject = JSON.parse( xhr.responseText );

				jsonObject.forEach(item => {
					length = Object.entries(item).length;

					Object.entries(item).forEach(([key, value]) => 
					{
						j++;

						if(j == 1 )
						{
							contacts[i] = `${key}: ${value} `;
						}
						else if(j == length) 
						{
							contacts[i] += ` ${key}: ${value} `;
						}
						else
						{
							contacts[i] += ` ${key}: ${value} `;
						}
					});
					contacts[i] += "<br />\r\n";
					i++;
					j = 0;
				});

				saveListCookie(contacts);
				document.getElementsByTagName("p")[0].innerHTML = contacts.join(" ");; 
			}
		};

		xhr.send(jsonPayload);

	}
	catch(err)
	{
		document.getElementById("contactResult").innerHTML = err.message;
	}
}

function deleteContact()
{
	var firstName = "Javier";
	var lastName = "Gonzalez";
	var email = "test23@gmail.com";
	var phoneNumber = "123445"

	readCookie();

	var jsonPayload = '{"userID" : "' + userId + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phoneNumber" : "' + phoneNumber + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				listContacts();
				document.getElementById("userDeleteResult").innerHTML = "User has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userDeleteResult").innerHTML = err.message;
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
