var http = require('http');
var mine = require('./mine.js').types;
var fs = require('fs');
var path=require('path');
var url=require('url');
var Rmarked = require('../index.js')([])

var DIR = './'


http.createServer(function(request, response) {

var layout = fs.readFileSync('./index.html',{encoding:'utf8'});

    if( require.url === '/' || request.url === '/index.html'){
        var md = fs.readFileSync('./test.md',{encoding:'utf8'});
        var m_html =  Rmarked(md);
        var html = layout.replace('{{content}}',m_html)
        response.writeHead(500, {
            'Content-Type': 'text/html'
        });
        response.write(html);
        response.end()
        return ;
    }
    var pathname = url.parse(request.url).pathname;
    console.log(pathname)
    var realPath = path.join(DIR, pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });

}).listen(8081,function(){
    console.log('http is listening at port 8081')
});
