'use strict';

var fs = require('fs');
var dotenvy, load, parse;

dotenvy = function (options, callback) {
    var path     = '.env';
    var encoding = 'utf8';
    var file, env;

    if (options != null) {
        if (typeof options === 'string') {
            path    = options;
            options = null;
        }
        else {
            if ('path' in options) {
                path = options.path;
            }
            if ('encoding' in options) {
                encoding = options.encoding;
            }
        }
    }

    if (callback == null) {
        file = fs.readFileSync(path, { encoding: encoding });
        env  = parse(file, options);
        load(env, options);
    }
    else {
        fs.readFile(path, { encoding: encoding }, function (error, file) {
            var env;
            if (error == null) {
                try {
                    env = parse(file, options);
                    load(env, options);
                }
                catch (error) {
                    callback(error);
                    return;
                }
            }
            callback(error, env);
        });
    }
};

load = function (env, options) {
    var overwrite = true;
    var write;

    if (options != null) {
        if ('overwrite' in options) {
            overwrite = options.overwrite;
        }
    }

    if (overwrite) {
        write = function (key) {
            var value = env[key];
            process.env[key] = (value == null) ? '' : value;
        };
    }
    else {
        write = function (key) {
            if (!(key in process.env)) {
                var value = env[key];
                process.env[key] = (value == null) ? '' : value;
            }
        };
    }

    Object.keys(env).forEach(write);
};

parse = function (source, options) {
    var env       = {};
    var comment   = '#';
    var sigil     = '$';
    var separator = '=';
    var quote     = '"';
    var split, quoted;

    if (options != null) {
        if ('comment' in options) {
            comment = options.comment;
        }
        if ('sigil' in options) {
            sigil = options.sigil;
        }
        if ('separator' in options) {
            separator = options.separator;
        }
        if ('quote' in options) {
            quote = options.quote;
        }
    }

    split  = new RegExp('^([^' + separator + ']*?)\\s*' + separator + '\\s*(.*)?$');
    quoted = new RegExp('^([' + quote + '])(\\.+)\\1$', 'g');

    source.toString().split(/\n/).forEach(function (line, index) {
        var match;

        line = line.trim();
        if ((line.length > 0) && (line[0] !== comment)) {
            match = line.match(split);
            if (match == null) {
                throw new SyntaxError('Invalid syntax on line ' + index + 1);
            }
            else {
                var key   = match[1];
                var value = match[2];
                var variable;
                if (value != null) {
                    if (value[0] === sigil) {
                        variable = value.substring(1);
                        value    = env[variable] || process.env[variable];
                    }
                    else if (value.substring(0, 2) === '\\' + sigil) {
                        value = value.substring(1);
                    }
                    else if (quoted.test(value)) {
                        value = value.replace(quoted, '$2').replace(/\\n/g, '\n');
                    }
                }
                env[key] = value;
            }
        }
    });

    return env;
};

module.exports = dotenvy;
exports.load   = load;
exports.parse  = parse;
