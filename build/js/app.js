
'use strict';

require('./backbone-shim');

var NZTAComponents = require('nzta-map-components'),
    Backbone = require('backbone'),
    MapModel = require('./components/mapModel'),
    UserControlsView = require('./components/userControlsView');

var app = new NZTAComponents.Application();

var vent = new Backbone.Wreqr.EventAggregator();

var map = new NZTAComponents.MapView({
    vent: vent,
    model: new MapModel()
});

app.addRegions({
    sidebarRegion: '#sidebar-region',
    popupRegion: '#popup-region',
    userControlsRegion: '#user-controls-region'
});

// app.sidebarRegion.show(new NZTAComponents.DrillDownMenuView({
//     vent: vent
// }));

// app.popupRegion.show(new NZTAComponents.PopupView({
//     vent: vent
// }));

app.userControlsRegion.show(new UserControlsView({
    vent: vent
}));

app.start();