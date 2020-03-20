'use strict';
const lunr = require('lunr');
const fs = require('fs');

let searchCorpora = ['./fr/search.json', './es/search.json', './en/search.json'];

searchCorpora.map(searchFile => {
    let language = searchFile.split('/').reverse()[1].toUpperCase();
    fs.readFile(searchFile, 'utf8', (err, data) => {
        if (err) throw err;
        let searchBuilder = JSON.parse(data);

        const idx = lunr((builder) => {
            builder.ref('id');
            builder.field('title');
            builder.field('body');
            builder.metadataWhitelist = ['position']

            searchBuilder.forEach(function (doc) {
                builder.add(doc)
            }, builder)
        });

        let dir = './indices';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(`./indices/index${language}.json`, JSON.stringify(idx));

    });
});


