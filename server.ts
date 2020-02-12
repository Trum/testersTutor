const express = require('express');
const bodyParser     =        require("body-parser");

export class Server {
    app;
    port: number;
    private httpServer: any;

    constructor(port: number) {
        this.port = port;
    }

    async start(){
        const port = this.port
        // var express = require('express');
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        //
        this.app.post('/login', function (req, res) {

            const email = req.body.email;
            const pwd = req.body.password;

            if (email.toLocaleString() === 'em@il.com'.toLocaleString()
            && pwd === 'success') {
                res.status(201).send('Welcome');
            } else {
                res.status(404).send('not found');
            }
        });


        this.app.get('/login', function (req, res) {
            res.send('Hello World!');
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