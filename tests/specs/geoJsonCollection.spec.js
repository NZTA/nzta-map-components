var NZTAComponents = require('../../index'),
    features = require('../fixtures/events'),
    journeys = require('../fixtures/journeys');

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

    describe('_getFeaturesByRelation', function () {
        var geoJsonCollection = new NZTAComponents.GeoJsonCollection({
            model: NZTAComponents.GeoJsonModel
        });

        geoJsonCollection.set(journeys);

        it('should return all features that have the given relation', function () {
            expect(geoJsonCollection._getFeaturesByRelation('regions', '9').length).to.be(2);
        });
    });

});
