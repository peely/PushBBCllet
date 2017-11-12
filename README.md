# PushBBCllet
An application and API to register Pushbullet Access Tokens and Username pairs and push notifications to those Access Tokens using only the associated Username.


## To Run
You'll need [NodeJS](https://nodejs.org) and npm (npm should come with NodeJS) installed on the machine you wish to run this on. This was written with node v9.1.0 and npm v3.9.3 on Windows.


On your target machine, open your command window of choice, cd your way to your working directory, and clone this repo. Once that's done, cd into the newly created directory and run `npm install`


While not required, if you plan to make any changes to the code at all, I suggest installing the npm module [nodemon](https://www.npmjs.com/package/nodemon), `npm install -g nodemon`, and then run it with `nodemon --ignore public bin/www`. This will restart the server each time you make a change to a file not in the public directory.


Now its running you should be able to browse to [http://localhost:3000](http://localhost:3000) and see the index page

## The Index Page
This page gives you a GUI for the API. You can give it a Username and an Access Token, list all the registered users, and then send a notification to one of those registered users.


## Get an Access Token
Go to [Pushbullet](https://www.pushbullet.com) and open the [setting page](https://www.pushbullet.com/#settings). Click on "Create Access Token", copy the resultant string and save it somewhere of your choosing.

## Using the API
The GUI isn't for everyone. The server has three endpoints that allow you to Register a user, List all users and Push notifications.

### Register
To register, make a `POST` request to `/users/register`, with the form parameters `username` and `accessToken`. If you get a response with HTTP status 200, then the request was successful and the user has been registered. If the Username already exists, or the Username or Access Token sent to the server is blank, you will get a 403 response.

### List
Make a `GET` request to `/users/list`, a JSON object of the array of user objects is returned.

### Push
You push a notification to a registered account by making a `POST` request to `/users/push`. Include the parameters `title`, `message` and `username`, where the `username` is the username registered with the app of the user you wish to the notification to be sent to. If the call is successful, the response will have the HTTP status 200, and the returned object will have a status property with the value 0, and also include the returned pushbullet object in the `pushbulletResponse` property. Like so

```
{
    "status": 0,
    "pushbulletResponse":
    {
        "active": true,
        "iden": "ujDtrFA95gqsjAoIRwhIL6",
        "created": 1510510058.44779,
        "modified": 1510510058.4925048,
        "type": "note",
        "dismissed": false,
        "direction": "self",
        "sender_iden": "ujDtrFA95gq",
        "sender_email": "peelpeely@gmail.com",
        "sender_email_normalized": "peelpeely@gmail.com",
        "sender_name": "Matthew Peel",
        "receiver_iden": "ujDtrFA95gq",
        "receiver_email": "peelpeely@gmail.com",
        "receiver_email_normalized": "peelpeely@gmail.com",
        "title": "title",
        "body": "my new message"
    }
}

```

If the call was unsuccessful, e.g. the sent username does not exist in the array of registered users, then the return object has a `status` value of `1`, and the HTTP response code of 403.