const puppeteer = require('puppeteer')
const request = require('request')
const APP_ENTRIES_URL = 'https://raw.githubusercontent.com/yjose/awesome-new/master/README.md'
const {promisify} = require('util')
const ENTRIES_FILENAME = 'entries.txt'
const {writeFileSync, existsSync, readFileSync} = require('fs')

const fetchEntries = async() => {
    try {
        const data = await promisify(request)(APP_ENTRIES_URL)
        return data.body
    } catch(ex) {
        console.log(ex)
        throw ex 
    }
}

const getEntries = async() => {
    if (!existsSync(ENTRIES_FILENAME)) {
        const data = await fetchEntries()
        let entries = data.split('\n').filter(line => line.startsWith('- ')).map(line => line.replace('- ', ''))
        const entriesText = entries.join('\n')
        writeFileSync(ENTRIES_FILENAME, Buffer.from(entriesText))
        console.log(entriesText)
    } else {
        let entries = readFileSync(ENTRIES_FILENAME).toString()
        console.log(entries)
    }
}

const createNew = async (app) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    await page.goto(`https://${app}.new`)
}

if (process.argv.length === 3) {
    createNew(process.argv[2])
} else {
    console.log("please enter an app from below")
    getEntries()
}
