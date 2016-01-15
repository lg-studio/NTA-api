var multiparty = require('multiparty');
var _ = require('underscore');

module.exports = (req, next) => {
    var fields = {};
    var files = [];

    var form = new multiparty.Form();

    form.on('error', function(e) {
        next(e);
    });

    form.on('close', function() {
        files = _.map(files, (e) => {
            var b = Buffer.concat(e.buffer, e.length);
            e.buffer = [];
            return {
                name: e.name,
                filename: e.filename,
                length: e.length,
                contentType: e.contentType,
                buffer: b
            }
        });

        //fields.files = files;
        next(null, fields, files)
    });

    form.on('part', function(part) {
        if (!part.filename) {
            fields[part.name] = null;
        } else if (files.length == 0) {
            files.push({
                name: part.name,
                filename: part.filename,
                length: 0,
                buffer: []
            });
        } else {
            if(files[files.length-1].filename != part.filename) {
                files.push({
                    name: part.name,
                    filename: part.filename,
                    length: 0,
                    buffer: []
                });
            }
        }

        part.on('data', function(chunk) {
            if(!part.filename) {
                fields[part.name] =  chunk.toString();
            } else if(files.length > 0) {
                files[files.length-1].buffer.push(chunk);
                files[files.length-1].length += chunk.length;

                if(!files[files.length-1].contentType)
                    files[files.length-1].contentType = part.headers['content-type'];
            }
        });

        // part.on('end', function() {});
    });

    form.parse(req);
};
