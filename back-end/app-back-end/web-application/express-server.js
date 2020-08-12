'use strict';

const express = require('express');
const app = (module.exports = express());
const ejs = require('ejs');
const session = require('client-sessions');
const bodyParser = require('body-parser');
const {RSA_NO_PADDING} = require('constants');
const path = require('path');

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static('./views'));
app.use(bodyParser.json());

app.use(
    session({
        cookieName: 'session',
        secret: 'secretKey',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
    }),
);
app.use(bodyParser.text({type: 'text/html'}));
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        next();
    }
});

function requireLogin(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/', (req, res, next) => {
    res.render('index');
});
