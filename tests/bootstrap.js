var Window = require("./lib/window");

global.expect = require("expect.js");
global.window = new Window();
global.document = window.document;
global.navigator = window.navigator;

require('../index');
