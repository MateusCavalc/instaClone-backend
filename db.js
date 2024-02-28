const { MongoClient } = require('mongodb');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;

// const url = 'mongodb://localhost:27017';
const url = 'mongodb://mateus:a1b2c3d4@localhost:27017/admin';

const client = new MongoClient(url);

module.exports.insertDoc = async (req) => {

    let insertResult = null;

    let d = new Date();

    let sentFiles = req.files // req.files contain the files sent from origin (connect-multiparty)
    let path_origem = sentFiles.arquivo.path;

    const dot_idx = sentFiles.arquivo.originalFilename.indexOf('.');
    const serverFilename = sentFiles.arquivo.originalFilename.substr(0, dot_idx) + '_' + d.getTime() + sentFiles.arquivo.originalFilename.substr(dot_idx);
    let path_destino = './uploads/' + serverFilename;

    let postDados = {
        url_imagem: serverFilename,
        titulo: req.body.titulo
    };

    try {
        await client.connect();

        insertResult = await client.db('instagram')
            .collection('posts')
            .insertOne(postDados);

        await client.close();

    } catch (err) {
        return { error: err.toString() };
    }

    fs.rename(path_origem, path_destino, (err) => {
        if (err)
            return { error: err };
    });

    return insertResult;

}

module.exports.readAllDocs = async () => {

    let readAllResult = null;

    try {
        await client.connect();

        readAllResult = await client.db('instagram')
            .collection('posts')
            .find().toArray();

        await client.close();

    } catch (err) {
        return { error: err.toString() };
    }

    return readAllResult;

}

module.exports.updateById = async (req) => {

    let updateResult = null;
    const comentarioId = new ObjectId();

    try {
        await client.connect();

        updateResult = await client.db('instagram')
            .collection('posts')
            .updateOne(
                {
                    _id: new ObjectId(req.params.id)
                },
                {
                    $push: {
                        comentarios: {
                            id_comentario: comentarioId,
                            comentario: req.body.comentario
                        }
                    }
                });

        updateResult.comentario_id = comentarioId;

        await client.close();

    } catch (err) {
        return { error: err.toString() };
    }

    return updateResult;

}

module.exports.deleteById = async (req) => {

    let deleteResult = null;

    try {
        await client.connect();

        deleteResult = await client.db('instagram')
            .collection('posts')
            .updateOne(
                {},
                {
                    $pull: {
                        comentarios: { id_comentario: new ObjectId(req.params.id) }
                    }
                });

        await client.close();

    } catch (err) {
        console.log(err);
        return { error: err.toString() };
    }

    return deleteResult;

}