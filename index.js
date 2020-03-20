'use strict';
const lunr = require('lunr');
const fs = require('fs');
const axios = require('axios');

let searchCorpora = ['https://programminghistorian.org/en/search.json', 'https://programminghistorian.org/fr/search.json', 'https://programminghistorian.org/es/search.json'];

searchCorpora.map(searchFile => {
    let language = searchFile.split('/').reverse()[1].toUpperCase();
    axios.get(searchFile).then((response)=>{
        let searchBuilder = response.data;
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
    }).catch((err) => {
        console.log(err);
    });
});

