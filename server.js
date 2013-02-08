function pair(nb) {
	if (nb / 2 == Math.round(nb / 2)) return true;
	else return false;
}

var clientsStock = new Array();

var state_shake = 0;

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: 8080
	});

var clientId = 0;

// Let's connect to the server. 
wss.on('connection', function (ws) {

	clientId++;

	console.log("Client " + clientId + " has connected.");

	clientsStock.push(ws);

	if (pair(clientId) == true) {

		console.log('Client ' + clientId + ' has found a partner');

		otherClientWs = clientsStock[clientId - 2];

		// Sending code to tell the clients they found a partner
		// We remember the state of the link server-side.

		state = "1";

		ws.send('3');
		otherClientWs.send('4');

	} else {

		// Storing state without-partner server-side.
		state = "0";
	}


	// In case of a client disconnection, we store the state 0.

	ws.on('close', function (message) {
		console.log("Client " + clientId + " has disconnected.");
		state = "0";
	});


	// We listen for message from the client.

	ws.on('message', function (message) {

		if (message) console.log("Message received : " + message);
		
		

		if (state == "1") {

			if (ws == otherClientWs) {

				oCws = clientsStock[clientId - 1];

				if (state_shake == 0) {

					ws.send(message);
					oCws.send(message);

					if (message.substr(-1) === "#") {

						state_shake = 1;

						ws.send("~A > " + message);
						oCws.send("~A > " + message);

						ws.send('6');
						oCws.send('5');

					}
				}
			} else {

				if (state_shake == 1) {

					ws.send(message);
					otherClientWs.send(message);

					if (message.substr(-1) === "#") {
						state_shake = 2;
						ws.send("~B > " + message);
						otherClientWs.send("~B > " + message);

						ws.send('7');
						otherClientWs.send('7');

					}

				}

			}
		}

	});


});