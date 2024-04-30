const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

function readDataset() {
    const data = fs.readFileSync('dataset.txt', 'utf-8');

    return data.split('\r\n');
}

async function getSongLyrics(song) {
    const response = await axios.get('https://genius.com/' + song + '-lyrics');
    const dom = new JSDOM(response.data);
    const lyricsRoot = dom.window.document.querySelector('#lyrics-root');
    const lyrics = lyricsRoot.textContent;
    const startIndex = lyrics.indexOf('Lyrics');
    const modifiedLyrics = lyrics.substring(startIndex + 6, lyrics.length - 7);

    return modifiedLyrics;
}


async function main() {
    const dataset = readDataset();

    for (const song of dataset) {
        const data = await getSongLyrics(song);
        const fileName = song + '.txt';
        fs.writeFileSync("lyrics/" + fileName, data);
        console.log(`Lyrics for ${song} saved to ${fileName}`);
        const delay = Math.floor(Math.random() * 20) + 1;
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }
}

main();