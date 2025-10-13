const fs = require('fs')
const path = require('path')

const jsonStr = fs.readFileSync(path.join(__dirname,'html-structure.json'),'utf-8')
const html = fs.readFileSync(path.join(__dirname,'index-template.html'),'utf-8')

fs.writeFileSync(path.join(__dirname,'../docs/index.html'),html.replace('/*"DATA-PLACEHOLDER"*/[]/*"DATA-PLACEHOLDER"*/',JSON.stringify(JSON.parse(jsonStr))))

