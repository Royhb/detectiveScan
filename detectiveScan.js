/**
 * Created by Roy on 3/09/2015.
 */
var argv        = require('minimist')(process.argv.slice(2));
var colors      = require('colors')
var detective   = require('detective')
var fs          = require('fs')
var path        = require('path')
var uf          = require('util').format
var scanHome    = argv.D || argv.dir || '.'

var masterList  = [];
    var NODE_PATH = process.env.NODE_PATH;  // for future use

    console.log('starting scan at directory %s', scanHome)
    processDir(scanHome)

    function processDir (dir) {
        //console.log(colors.green(uf('processDir(%s)', dir)))

        var files = fs.readdirSync(dir)
        files.forEach(function (file) {
            if (file) {
                if (path.extname(file) === '.js') {
                    processFile(dir, file)
                } else if (file !== '.' && file !== '..') {
                    var fullPath = dir + '/' + file
                    if (fs.lstatSync(fullPath).isDirectory()) {
                        try {
                            //if (fs.lstatSync(dir + '/' + file).isDirectory()) {
                            if (fs.lstatSync(fullPath).isDirectory()) {
                                processDir(fullPath);
                            }
                        } catch (err) {
                            console.log(colors.magenta(uf('Skipping %s because: ', fullPath)))
                            console.log('    ', colors.red(err.message))
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

            console.log(colors.yellow(uf('%s requires:', fullPath)))
            console.log(colors.cyan(uf('    %s', requires.join(', '))))
        }
    }

}

console.log(colors.green(masterList.join(', ')))
console.log(process.env.NODE_PATH)