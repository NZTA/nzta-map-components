var Backbone = require('backbone'),
    _ = require('underscore'),
    NZTAComponents = require('../../index'),
    features = require('../fixtures/events');

describe('MapModel', function () {
    var mapModel;

    describe('_populateCollection', function () {
        beforeEach(function () {
            mapModel = new NZTAComponents.MapModel({
                featureCollection: new Backbone.Collection()
            });
        });

        it('should populate a collection with a complete list of features', function () {
            mapModel._populateCollection('featureCollection', features);
            expect(mapModel.get('featureCollection').models.length).to.be(features.length);
        });

        it('should populate a collection with a filtered list of features', function () {
            mapModel._populateCollection('featureCollection', features, { key: 'impact', value: 'Road Closed' });
            expect(mapModel.get('featureCollection').models.length).to.be(12);
        });
    });

    describe('_getFeatureTypeById', function () {
        beforeEach(function () {
            mapModel = new NZTAComponents.MapModel({
                featureCollection: new Backbone.Collection()
            });

            mapModel._populateCollection('featureCollection', features);
        });

        it('should return a feature matching the provided ID', function () {
            var featureId = '100997',
                featureModel = mapModel._getFeatureTypeById('featureCollection', featureId);

            expect(featureModel).to.be.an('object');
            expect(featureModel.get('properties').id).to.be(featureId);
        });

        it('should return undefined if the feature is not found', function () {
            var featureModel = mapModel._getFeatureTypeById('featureCollection', 'sup');

            expect(featureModel).to.be(void 0);
        });
    });

});
