var _ = require('underscore');
var through2 = require('through2');

module.exports = function (options) {
  options = _.defaults(options || {}, {
    size: 1,
    units: 'px pt',
    ignoreMediaQueries: true,
    ignoreFontSize: true
  });
  return through2.obj(function (file, enc, next) {
    if (file.isNull()) {
      this.push(file);
      return next();
    }
    var units = options.units.split(' ').join('|');
    var exp = ['(\\@media \\((?:max|min)-width: +?)?(font-size: ?)?(\\d+)(', units, ')'].join('');
    var re = new RegExp(exp, 'gi');
    var contents = String(file.contents);
    file.contents = new Buffer(contents.replace(re, function (match, $1, $2, $3, $4) {
      if ((options.ignoreMediaQueries && $1) || (options.ignoreFontSize && $2)) {
        return match;
      }
      if ($2) {
        return ['font-size:', String((parseInt($3, 10) * options.size)), $4].join('');
      }
      return [String((parseInt($3, 10) * options.size)), $4].join('');
    }));
    next(null, file);
  });
};
