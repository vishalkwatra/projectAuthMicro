const express = require('express');

const hdb = require('hdb');
const xsenv = require('@sap/xsenv');
const services = xsenv.getServices({ hana: { tag: 'database' } });
const hanaInstanceCredentials = services.hana;

const port = process.env.port || 8080;

const hdiConfig = {
    host: hanaInstanceCredentials.host,
    port: hanaInstanceCredentials.port,
    user: hanaInstanceCredentials.hdi_user,
    password: hanaInstanceCredentials.hdi_password,
    useTLS: true
};

const app = express();

const client = hdb.createClient(hdiConfig);
client.on('error', function (err) {
    console.error('Network connection error', err);
});


app.get('/Student', (req, res) => {
    console.log('select * from "' + hanaInstanceCredentials.schema + '" ."STUDENT"');
    client.connect(function (err) {
        if (err) {
            console.error('Connect error', err);
            res.status(500).end("Internal Server error in db connection");
        }
        client.exec('select * from "' + hanaInstanceCredentials.schema + '" ."STUDENT"', function (err, rows) {
            client.end();
            if (err) {
                console.error('Execute error:', err);
                res.status(500).end("Internal Server error in getting data");
            }
            console.log('Results:', rows);
            res.send(rows);
        });
    });

});

app.get("/Student/:id", (req, res) => {
    if (typeof req.params.id !== "undefined" && req.params.id) {
        console.log('select * from "' + hanaInstanceCredentials.schema + '" ."STUDENT" where id = ' + req.params.id);
        client.connect(function (err) {
            if (err) {
                console.error('Connect error', err);
                res.status(500).end("Internal Server error in db connection");
            }
            client.exec('select * from "' + hanaInstanceCredentials.schema + '" ."STUDENT" where id = ' + req.params.id, function (err, rows) {
                client.end();
                if (err) {
                    console.error('Execute error:', err);
                    res.status(500).end("Internal Server error in getting data");
                }
                console.log('Results:', rows);
                res.send(rows);
            });
        });
    } else {
        res.status(500).end("Internal Server Error -No ID Passed");
    }
});

app.listen(port);
