listAllUsers();

function registerUser(){
	var Username = $('#Username').val();
	var AccessToken = $('#AccessToken').val();

	//All ok
	$.ajax({
		url:'/users/register',
		type:'POST',
		data:{
			username:Username,
			accessToken: AccessToken
		}
	})
	.done(registerCallSuccess)
	.fail(ajaxFailure);
	

	function registerCallSuccess(res, status){
		console.log(status, res);

		alert('user registered!');
		listAllUsers();
	}

	function ajaxFailure(reqObj, status){
		console.log(status, reqObj);
		if(reqObj.status == 403){
			alert('Error! Either the Username or Access Token is blank, or the Username already exists!');
		}
		else{
			alert('An unknown error occured!');
		}
	}

	/*function registerErrorHandle(res){
		alert('user already exists!');
		switch(res.state){
			case 1:
				//Username already exists
				$('#Username').toggleClass('alert-danger', true);
				$('#Username').on('change', function(){ 
					$(this).toggleClass('alert-danger', false);
					$(this).off('change')
				})
			break;
			default:
				alert('An unknown error has occured');
			break;
		}
	}*/
}

function listAllUsers()
{
	$.ajax({
		url:'/users/list',
		type:'GET'
	})
	.done(listAllUsersCallSuccess)
	.fail(ajaxFailure);

	function listAllUsersCallSuccess(res, status){
		//STATUS
		populateUsersTable(res);
		populateUsersSelectMenu(res);
	}

	function populateUsersTable(res){
		//Build the table body

		var bodyHTML = "";
		$(res).each(function(i, user){
			bodyHTML += '<tr data-username="' + user.username + '">\n'
			bodyHTML += '\t<td>' + user.username + '</td>\n'
			bodyHTML += '\t<td>' + user.accessToken + '</td>\n'
			bodyHTML += '\t<td>' + moment(user.creationTime).format('DD/MM/YY HH:mm:ss') + '</td>\n'
			bodyHTML += '\t<td>' + user.numOfNotificationsPushed + '</td>\n'
			bodyHTML += '</tr>\n';
		});

		$('#allRegisteredUsersTable tbody tr').off('click');
		$('#allRegisteredUsersTable tbody').html(bodyHTML);
		$('#allRegisteredUsersTable tbody tr').on('click', function(e){
			var selectedUserName = $(this).data('username');
			$('#sendNotificationTo').val(selectedUserName);
		});
	}

	function populateUsersSelectMenu(res){
		var selectHTML = "";
		$(res).each(function(i, user){
			selectHTML += '<option value="' + user.username + '"> ' + user.username + '</option>\n'
		});
		$('#sendNotificationTo').html(selectHTML);

	}
}

function sendNotification()
{
	var notificationTitle = $('#notificationTitle').val();
	var notificationMessage = $('#notificationMessage').val();
	$.ajax({
		url:'/users/push',
		type:'POST',
		data:{
			title: notificationTitle,
			message: notificationMessage,
			username: $('#sendNotificationTo').val()
		}
	})
	.done(sendNotificationCallSuccess)
	.fail(ajaxFailure);

	function sendNotificationCallSuccess(res, status){
		listAllUsers();
		if(res.status == 0){
			alert('Notification sent successfully!');
			console.log(res.pushbulletResponse);
		}
		else{
			sendNotificationErrorHandle(res);
		}
	}

	function sendNotificationErrorHandle(res){
		switch(res.status){
			case 1:
			alert('User does not exist!');
			break;
			default:
			alert('An unknown error has occured');
			break;
		}
	}

	function ajaxFailure(reqObj, status){
		sendNotificationErrorHandle(reqObj.responseJSON);
	}
}


function ajaxFailure(reqObj, status){
	console.log(status, reqObj);
}