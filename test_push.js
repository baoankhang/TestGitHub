var apn = require ('apn');

var tokens = ["4a5b53ade23fb6028f50a43bd9b3e5433e05c784f851396e43caa55e27fca0ac"];//,"064c4baf71a974e951dca0fa8703ec39972405f58ab08fbb0de1868ae738a3a5,4405c49e9dc0478acede93d08260eeb82e599f30e37757b72b663b61791ea1da"

if(tokens[0] == "<insert token here>") {
	console.log("Please set token to a valid device token for the push notification service");
	process.exit();
}

// Create a connection to the service using mostly default parameters.

var service = new apn.connection({ gateway:'gateway.sandbox.push.apple.com',production:false });

service.on('connected', function() {
    console.log("Connected");
});

service.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

service.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode == 8) {
        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});

service.on('timeout', function () {
    console.log("Connection Timeout");
});

service.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

service.on('socketError', console.error);

pushNotificationToMany();
// If you plan on sending identical paylods to many devices you can do something like this.
function pushNotificationToMany() {
    console.log("Sending the same notification each of the devices with one call to pushNotification.");
    // var note = new apn.notification("{ aps: { badge: 1, alert: you have email } }");
    var note = new apn.notification();
    // note.setAlertText("you have email");
    // note.badge = 1;
    // note.notification_type = 1;
    // note.message_thread_id = 232;
    // note.set('notification_type',1);
    // note.set('message_thread_id',51);
    // note.payload = "{\"notification_type\": 1,\"message_thread_id\":51}";
    note.payload.parameters.set('test', 1);
    //"{\"notification_type\": 1,\"message_thread_id\":51},\"aps\":{\"alert\":\"you have email\", \"badge\":1}"
    console.log(note);
//{\"notification_type\": 1,\"message_thread_id\":51}
    // note.sound = "YOSHIDA.m4a";
    service.pushNotification(note, tokens);
}


// If you have a list of devices for which you want to send a customised notification you can create one and send it to and individual device.
// function pushSomeNotifications() {
//     console.log("Sending a tailored notification to %d devices", tokens.length);
//     for (var i in tokens) {
//         var note = new apn.notification();
//         note.setAlertText("Hello, from DHT Solutions Solutions! You are number: " + i);
//         note.badge = i;

//         service.pushNotification(note, tokens[i]);
//     }
// }

// pushSomeNotifications();
