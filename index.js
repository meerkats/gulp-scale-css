var _ = require('underscore');
var through2 = require('through2');

module.exports = function (options) {
    options = _.defaults(options || {}, {
        size: 1
    });
    return through2.obj(function (file, enc, next) {
        if (file.isNull()) {
            this.push(file);
            return next();
        }
        var re = /(\@media \((max|min)-width: +?)?(\d+)px/gi;
        var contents = String(file.contents);
        file.contents = new Buffer(contents.replace(re, function (match, $1, $2, $3) {
            if ($1) {
                return match;
            }
            return String((parseInt($3, 10) * options.size)) + 'px';
        }));
        next(null, file);
    });
};
