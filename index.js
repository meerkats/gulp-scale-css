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
      var original_size = parseInt($3, 10);
      var new_size = parseInt((original_size * options.size), 10);
      if (new_size === 0 && original_size !== 0) {
        new_size = 1;
      }
      if ($2) {
        return ['font-size:', String(new_size), $4].join('');
      }
      return [String(new_size), $4].join('');
    }));
    next(null, file);
  });
};
