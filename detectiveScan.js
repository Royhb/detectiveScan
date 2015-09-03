/**
 * Created by Roy Barkas on 3/09/2015.
 */
var argv        = require('minimist')(process.argv.slice(2));
var colors      = require('colors')
var detective   = require('detective')
var fs          = require('fs')
var path        = require('path')
var uf          = require('util').format
var scanHome    = argv.D || argv.dir || '.'
var jsonOut     = argv.j || argv.json || null
var jsonData    = {files: {}}
var masterList  = [];

    var NODE_PATH = process.env.NODE_PATH;  // for future use

    if (!jsonOut) { console.log('starting scan at directory %s', scanHome) }
    processDir(scanHome)

    function processDir (dir) {
        var files = fs.readdirSync(dir)
        files.forEach(function (file) {
            if (file) {
                if (path.extname(file) === '.js') {
                    processFile(dir, file)
                } else if (file !== '.' && file !== '..') {
                    var fullPath = dir + '/' + file
                    if (fs.lstatSync(fullPath).isDirectory()) {
                        try {
                            if (fs.lstatSync(fullPath).isDirectory()) {
                                processDir(fullPath);
                            }
                        } catch (err) {
                            if (!jsonOut) {
                                console.log(colors.magenta(uf('Skipping %s because: ', fullPath)))
                                console.log('    ', colors.red(err.message))
                            }
                        }
                    }
                }
            }
        })
    }

function processFile (dir, file) {
    var fullPath = dir + '/' + file;
    if (path.extname(fullPath) === '.js') {
        var src = fs.readFileSync(fullPath)
        var requires = detective(src)
        if (requires.length > 0) {
            requires.forEach(function (mod) {
                if (masterList.indexOf(mod) === -1) {
                    masterList.push(mod);
                }
            })

            if (jsonOut) {
                jsonData.files[fullPath] = requires
            } else {
                console.log(colors.yellow(uf('%s requires:', fullPath)))
                console.log(colors.cyan(uf('    %s', requires.join(', '))))
            }
        }
    }
}

if (jsonOut) {
    jsonData.masterList = masterList
    console.log(JSON.stringify(jsonData, null, 2))
} else {
    console.log(colors.green(masterList.join(', ')))
}