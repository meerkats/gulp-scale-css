var _ = require('underscore');
var through2 = require('through2');

module.exports = function (options) {
  options = _.defaults(options || {}, {
    size: 1,
    units: 'px pt'
  });
  return through2.obj(function (file, enc, next) {
    if (file.isNull()) {
      this.push(file);
      return next();
    }
    var units = options.units.split(' ').join('|');
    var exp = ['(\\@media \\((max|min)-width: +?)?(\\d+)(', units, ')'].join('');
    var re = new RegExp(exp, 'gi');
    var contents = String(file.contents);
    file.contents = new Buffer(contents.replace(re, function (match, $1, $2, $3, $4) {
      if ($1) {
        return match;
      }
      return String((parseInt($3, 10) * options.size)) + $4;
    }));
    next(null, file);
  });
};
