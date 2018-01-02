const recursive = require('recursive-readdir')
const crypto = require('crypto')
const fs = require('fs')
const request = require('request')
const domain = 'https://coinfy.com'

function readLocalFile(path) {
    return fs.readFileSync(path, 'utf8')
}

function sha1(data) {
    const shasum = crypto.createHash('sha1')
    shasum.update(data)
    return shasum.digest('hex')
}

recursive('./public', ['.*'], (err, paths) => {
    paths.forEach(path => {
        const url = `https://coinfy.com${path.replace('public', '')}`
        // console.log(sha1(readLocalFile(path)), path)
        request(url, (error, response, body) => {
            console.log(url, sha1(body), sha1(readLocalFile(path)))
        })
    })
})