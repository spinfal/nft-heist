import fetch from 'node-fetch';
import fs from 'fs';
import download from 'image-downloader';

if (!fs.existsSync('./funged')) fs.mkdirSync('./funged');

const Self_Args = process.argv.slice(2);

if (!Self_Args.length) {
    console.log("node index.js <username>\nEX: node index.js turkeysmegaverse");
    process.exit();
}

const path = `./funged/${Self_Args[0]}/`;
if (!fs.existsSync(path)) fs.mkdirSync(path);

fetch(`https://api.opensea.io/api/v1/assets?collection=${Self_Args[0]}&format=json&limit=50`, {
    headers: {
        'X-Forwarded': '127.0.0.1',
        'User-Agent': 'Mozilla/5.0',
        'content-type': 'application/json'
    }
}).then(res => res.json()).then(json => {
    console.log('Checking if user has assets I can download...');
    if (json?.assets < 1) return console.error('The provided user has no assets in their collection to scrape.');
    console.log('User has assets in collection. Scraping...\n')
    json.assets.forEach(asset => {
        if (asset.image_url.length > 0) {
            fungeTheToken({
                url: asset.image_url,
                dest: `${path}/`
            });
        }
    });
});

const fungeTheToken = async (options) => {
    download.image(options)
        .then(({ filename }) => {
            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err))
};