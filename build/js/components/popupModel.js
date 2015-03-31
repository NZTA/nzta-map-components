
'use strict';

var NZTAComponents = require('nzta-map-components');

var PopupModel = NZTAComponents.PopupModel.extend({

    initialize: function () {
        // Call super
        NZTAComponents.PopupModel.prototype.initialize.call(this);

        this.markers = new NZTAComponents.GeoJsonCollection();
    }

});

module.exports = PopupModel;
