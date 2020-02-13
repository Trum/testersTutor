const express = require('express');
const bodyParser = require("body-parser");

export class Server {
	app;
	port: number;
	private httpServer: any;

	constructor(port: number) {
		this.port = port;
	}

	async start() {
		let keys = [];
		const port = this.port;
		this.app = express();
		this.app.use(bodyParser.urlencoded({extended: false}));
		this.app.use(bodyParser.json());

		this.app.post('/login', function (req, res) {

			const email = req.body.email;
			const pwd = req.body.password;

			if (email.toLocaleString() === 'em@il.com'.toLocaleString()
				&& pwd === 'success') {
				const key = Math.random().toString(36).substring(2, 15);
				keys.push(key);
				res.status(201).send({key: key});
			} else {
				res.status(404).send('not found');
			}
		});


		this.app.get('/login', function (req, res) {
			res.send('Hello World!');
		});


		this.app.get('/events', function (req, res) {
			res.status(200).send([
				{id: 'id_1', name: 'event1Name'},
				{id: 'id_2', name: 'event2Name'},
				{id: 'id_3', name: 'event3Name'},
				{id: 'id_4', name: 'event4Name'},
				{id: 'id_5', name: 'event5Name'},
				{id: 'id_6', name: 'event6Name'},
			]);
		});


		this.app.get('/schools', function (req, res) {
			res.status(502).send([
				{id: 'id_1', name: 'event1Name'},
				{id: 'id_2', name: 'event2Name'},
				{id: 'id_3', name: 'event3Name'},
				{id: 'id_4', name: 'event4Name'},
				{id: 'id_5', name: 'event5Name'},
				{id: 'id_6', name: 'event6Name'},
			]);
		});

		this.app.get('/users', function (req, res) {

			const key = req.headers.usid;

			if (keys.indexOf(key) !== -1) {
				res.status(200).send([
					{id: 'id_1', firstName: 'firstName1'},
					{id: 'id_2', firstName: 'firstName2'},
					{id: 'id_3', firstName: 'firstName3'},
					{id: 'id_4', firstName: 'firstName4'},
					{id: 'id_5', firstName: 'firstName5'},
					{id: 'id_6', firstName: 'firstName6'},
				]);
			} else {
				res.status(401).send({error: 'unauthorized'})
			}

		});


		this.httpServer = this.app.listen(port, function () {
			console.log(`Example server listening on port ${port}!`);
		});


	}

	stop() {
		this.httpServer.close();
		console.log('Server shooting down');
	}
}