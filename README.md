# detectiveScan
Node.js package that is a wrapper for the detective module that scans a directory structure for required modules
##Invocation
###detectiveScan [-d || --dir] [,-j || --json] 
```
Starting at '.' or at the directory specified by the -d --dir argument, recursively scans for all .js files.  Whan a .js file is found, detective scans it for required modules.
When no -j or --json argument is provided, As each file scan completes, a line is emitted to stdout with the path/file name followed by a list of the modules that are required.
After all files have been scanned, a master list of all modules required by all files is shown.

If a -j or --json argument is provided, then data is accumulated and output as JSON once the scan is complete.
##Examples
 ```Shell
node detectiveScan -d /myModuleDirectory    //Scans all files found beneath myModuleDirectory and outputs human readable information stdout to stdout
node detectiveScan -d myModuleDirectory -j  //Scans all files found beneath myModuleDirectory and outputs a JSON object to stdout
node detectiveScan                          //Scans all files below '.' and outputs human readable information stdout to stdout
```