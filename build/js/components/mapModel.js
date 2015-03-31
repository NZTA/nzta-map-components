'use strict';

var NZTAComponents = require('nzta-map-components'),
    $ = require('jquery');

var MapModel = NZTAComponents.MapModel.extend({

    initialize: function () {
        // setup the model.
        this.markers = new NZTAComponents.GeoJsonCollection();
        this.markers._setOptions({
            iconClass: 'marker-cluster',
            iconUrl: 'dist/images/marker-icon-2x.png'
        });

        // Run the initial data fetch.
        this._doFetch();

        // Add fetch calls into the poll collection.
        this._addToPollCollection('_doFetch', 60, true);
    },

    /**
     * @func _doFetch
     * @desc Fetch from the server.
     */
    _doFetch: function () {
        var self = this;

        // When all requests are complete, inform the view.
        $.when(
            $.getJSON('../../fixtures/markers.json')
        ).done(function (markers) {
            self.markers.set(markers);

            self.trigger('data.all', { 
                markers: self.markers
            });
        });
    }

});

module.exports = MapModel;
