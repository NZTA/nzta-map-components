var NZTAComponents = require('../../index'),
    features = require('../fixtures/events');

describe('GeoJsonCollection', function () {

    describe('_getFeaturesByPropertyValue', function () {
        var geoJsonCollection = new NZTAComponents.GeoJsonCollection({
            model: NZTAComponents.GeoJsonModel
        });

        geoJsonCollection.set(features);

        it('should get all features matching the key value filter', function () {
            expect(geoJsonCollection._getFeaturesByPropertyValue('impact', 'Road Closed').length).to.be(12);
        });
    });

});
