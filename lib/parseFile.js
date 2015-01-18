var esprima = require('esprima');

var esprimaOptions = {
    comment: true,
    attachComment: true,
    tolerant: true,
    loc: true
};

var exp = module.exports = {
    parse: parseCode,
    parseComment: parseComment
};

function parseCode(code) {
    var tokens = esprima.parse(code, esprimaOptions);
    // tokens.comments.forEach(function(comment) {
    // type value loc
    // console.log(parseComment(comment));
    // });
    return tokens;
};

var ANNOTATION_RE = /@(\w+)\s+(.+)$/gi;

function parseComment(comment) {
    var lines, annotations = [];

    console.log('comment', comment);

    if (comment.type == 'Block') {
        lines = comment.value.split('\n');
    } else {
        lines = [comment.value];
    }

    lines.forEach(function(line) {
        var match = ANNOTATION_RE.exec(line);

        console.log(match);
        if (match) {
            annotations.push({
                name: match[1],
                value: match[2]
            });
        }
    });

    return annotations;
};
