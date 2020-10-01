const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://organicUser:organicPassword@cluster0.tviz5.mongodb.net/organicDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productCollection = client.db("organicDb").collection("products");
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then((result) => {
            res.redirect('/');
        })
    })

    app.get('/productsinfo', (req, res) => {
        productCollection.find({})
        .toArray((err, products) => {
            res.send(products);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0 ? true : false);
        })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id : ObjectId(req.params.id)})
        .toArray((err, result) => {
            res.send(result[0]);
        })
    })

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({_id : ObjectId(req.params.id)},
        {
            $set:{ price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => res.send(result.modifiedCount > 0));
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000);