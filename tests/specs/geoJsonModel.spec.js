var NZTAComponents = require('../../index');

describe('GeoJsonModel', function () {
    var geoJsonModel;

    describe('_getDisplayTime', function () {
        beforeEach(function () {
            geoJsonModel = new NZTAComponents.GeoJsonModel({
                properties: {
                    totalLength: "0",
                    speed: "0"
                }
            });
        });

        it('should return null if there is bad data', function () {
            expect(geoJsonModel._getDisplayTime()).to.be(null);

            geoJsonModel.set({
                properties: {
                    totalLength: "100",
                    speed: "0"
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be(null);

            geoJsonModel.set({
                properties: {
                    totalLength: "0",
                    speed: "100"
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be(null);

            geoJsonModel.set({
                properties: {
                    totalLength: "100",
                    speed: void 0
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be(null);

            geoJsonModel.set({
                properties: {
                    totalLength: void 0,
                    speed: "100"
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be(null);
        });

        it('should display "min" and "mins" correctly', function () {
            geoJsonModel.set({
                properties: {
                    totalLength: "1",
                    speed: "60"
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be('1 min');

            geoJsonModel.set({
                properties: {
                    totalLength: "100",
                    speed: "100"
                }
            });
            expect(geoJsonModel._getDisplayTime()).to.be('60 mins');
        });

        it('should display hours if there are more than 60 minutes', function () {
            geoJsonModel.set({
                properties: {
                    totalLength: "500",
                    speed: "100"
                }
            });

            expect(geoJsonModel._getDisplayTime()).to.be('5 hours');
        });

        it('should display hours and minutes if a trip takes n hours and n minutes', function () {
            geoJsonModel.set({
                properties: {
                    totalLength: "100",
                    speed: "30"
                }
            });

            expect(geoJsonModel._getDisplayTime()).to.be('3 hours 20 mins');
        });
    });
});
