var jsdom = require('jsdom').jsdom;

function Window(markup, level, options) {
    var html = markup || '<html><body><div id="map"></div></body></html>',
        domLevel = level || null, // Will default to level3
        opt = options || {};

    var doc = jsdom(markup, level, options);

    return doc.parentWindow;
}

module.exports = Window;
