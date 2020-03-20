'use strict';
const lunr = require('lunr');
const fs = require('fs');

let searchEn = require('./search.json');
const idxEn = lunr((builder) => {
    builder.ref('id');
    builder.field('title');
    builder.field('body');
    builder.metadataWhitelist = ['position']

    searchEn.forEach(function (doc) {
        builder.add(doc)
    }, builder)
});

// let dir = './indices';
// if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir);
// }

fs.writeFileSync('indexEN.json', JSON.stringify(idxEn));
