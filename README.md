# detectiveScan
Node.js package that is a wrapper for the detective module that scans a directory structure for required modules
##API
###detectiveScan(startDir='.')
```
Starting at directory './', recursively scans for all .js files.  Whan a .js file is found, detective scans it for required modules.
As each file scan completes, a line is emitted to stdout with the path/file name followed by a list of the modules that are required.
After all files have been scanned, a master list of all modules required by all files is shown.