'use strict';
const lunr = require('lunr');
let searchEn = require('./search.json');
const fs = require('fs');


const idxEn = lunr((builder) => {
    builder.ref('id');
    builder.field('title');
    builder.field('body');
    builder.metadataWhitelist = ['position']

    searchEn.forEach(function (doc) {
        builder.add(doc)
    }, builder)
});

fs.writeFileSync('indexEN.json', JSON.stringify(idxEn));
