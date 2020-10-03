var urlBase = 'http://cop4331.fun/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";


	var jsonTest =
	`[
		{
			"id": "12345"
			"name": "asdf"
		},
		{
			"id": "543121"
			"name": "jkhll"
		}
	]`;

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
	var contactList = [];
	var j = 0;
	var i = 0;
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

				var jsonObject = JSON.parse( xhr.responseText );

				jsonObject.forEach(item => {
					length = Object.entries(item).length;

					Object.entries(item).forEach(([key, value]) =>
					{
						j++;

						if(j == 1 )
						{
							contactList[i] = `${key}: ${value} `;
						}
						else if(j == length)
						{
							contactList[i] += ` ${key}: ${value} `;
						}
						else
						{
							contactList[i] += ` ${key}: ${value} `;
						}
					});
					contactList[i] += "<br />\r\n";
					i++;
					j = 0;
				});
                document.getElementById("here")[0].innerHTML = contacts.join(" ");;

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

				var data = JSON.parse(xhr.responseText) ;
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

function deleteContact()
{
	var userId = "82";

	readCookie();

	var jsonPayload = '{"contactID" : "' + userId + '"}';
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

				// Return if an error was encounter
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
