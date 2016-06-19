"use strict";
import koa from 'koa';
import files from 'koa-static';

import MongoClient from 'mongodb';

let app = koa();
let port = process.env.WEBPORT || 3000;
let mongourl = process.env.MONGO_URL || "mongodb://localhost:27017";

app.use(files(__dirname + '/../public'));

let db;
MongoClient.connect(mongourl, (err, database) => {
    if (err) throw err;

    db = database;
    app.listen(3000, () => console.log('Listening on port: '+port));

});

app.use(function *(next){
    if (this.method !== 'POST' || this.path !== '/data/foos') return yield next;

    db.collection("foo").find({}).toArray((err, foos) => {
        if (err) throw err;
        this.body = foos;
    });
    // the request string is the flash message
    var message = yield rawBody(this.req, {
        encoding: 'utf8'
    });

    // push the message to the session
    this.session.messages = this.session.messages || [];
    this.session.messages.push(message);

    // tell the client everything went okay
    this.status = 204;
})
app.get('/data/foos', (req, res)=> {

});
