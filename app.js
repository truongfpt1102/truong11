var express = require('express')
var app = express();
var fs = require('fs');
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
//localhost:5000
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/insert', function (req, res) {
    res.render('insert');
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://truongls:truong1@asm2.egt6u.mongodb.net/test";
app.post('/doRegister', async (req, res) => {
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let dbo = client.db("ProductDB");
    let data = {
        name: inputName,
        price: inputPrice,
    }
        await dbo.collection("Product").insertOne(data);
        res.redirect('/listsanpham');
})
app.get("/listsanpham", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render("listsanpham", { model: result });
})
app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/listsanpham');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in 3000 port");
});