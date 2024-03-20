const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const db = require('./db');
const fs = require('fs');

let app = express();

// body-parser conf
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());

app.use(function (req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
});

app.get('/', (req, res) => {
    res.send({ msg: 'oie' });
});

// (CREATE)
app.post('/api', async (req, res) => {

    const insertResult = await db.insertDoc(req);

    if (insertResult.error) {
        res.status(500).json(insertResult);
        return;
    }

    res.json(insertResult);

});

// (READ)
app.get('/api', async (req, res) => {

    const readAllResult = await db.readAllDocs();

    if (readAllResult.error) {
        res.status(500).json(readAllResult);
        return;
    }

    res.json(readAllResult);

});

// (READ by id)
app.get('/api/:id', (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota 

    MongoClient.connect(url, (err, db) => {
        if (err) res.json(err)
        db.collection('posts').find({ _id: ObjectId(req.params.id) }).toArray((err, rec) => {
            if (err)
                res.json(err);
            else
                res.json(rec);

            db.close();
        });
    });

});

// (GET IMAGE by name)
app.get('/imagens/:imagem', function (req, res) {

    var img = req.params.imagem;

    fs.readFile('./uploads/' + img, function (err, content) {
        if (err) {
            res.status(400).json(err);
            return;
        }

        res.writeHead(200, { 'content-type': 'image/jpg' });
        res.end(content);
    })
});

// (UPDATE by id)
app.put('/api/:id', async (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota

    const updateResult = await db.updateById(req);

    if (updateResult.error) {
        res.status(500).json(updateResult);
        return;
    }

    res.json(updateResult);

});

// (DELETE by id)
app.delete('/api/:id', async (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota

    const deleteResult = await db.deleteById(req);

    if (deleteResult.error) {
        res.status(500).json(deleteResult);
        return;
    }

    res.json(deleteResult);

});

const port = 4001;

app.listen(port, () => {
    console.log(`Servidor ONLINE (Porta ${port})`)
});