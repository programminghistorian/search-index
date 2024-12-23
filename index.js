'use strict';
const lunr = require('lunr')
require("lunr-languages/lunr.stemmer.support")(lunr)
require('lunr-languages/lunr.fr')(lunr)
require('lunr-languages/lunr.es')(lunr)
require('lunr-languages/lunr.pt')(lunr)

const fs = require('fs');
const axios = require('axios');

const dir = './indices';
try {
    fs.rmdirSync(dir, {
        recursive: true
    });
    fs.mkdirSync(dir);
    console.log(`${dir} is deleted and remade!`);
} catch (err) {
    console.error(`Error while deleting ${dir}.`);
}

let searchCorpora = ['https://programminghistorian.org/en/search.json', 'https://programminghistorian.org/fr/search.json', 'https://programminghistorian.org/es/search.json', 'https://programminghistorian.org/pt/search.json'];

searchCorpora.map(searchFile => {
    let language = searchFile.split('/').reverse()[1];
    console.log('language', language);
    axios.get(searchFile).then((response)=>{
        let searchBuilder = response.data;
        const idx = lunr((builder) => {
            language != 'en' ? builder.use(lunr[language]) : null;
            builder.ref('id');
            builder.ref('url');
            builder.field('title');
            builder.field('body');
            builder.metadataWhitelist = ['position']

            searchBuilder.forEach(function (doc) {
                builder.add(doc)
            }, builder)
        });

        fs.writeFileSync(`./indices/index${language.toUpperCase()}.json`, JSON.stringify(idx));
    }).catch((err) => {
        console.log(err);
    });
});

