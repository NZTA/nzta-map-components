
'use strict';

var _ = require('underscore'),
    NZTAComponents = require('nzta-map-components');

var PopupView = NZTAComponents.PopupView.extend({

    template: _.template('\
        <div class="popup-view"> \
            <p><%= feature.id %></p> \
        </div> \
    '),

    _onRoute: function (handler, params) {
        if (this._isPopupRoute(params)) {
            this._handlePopupRoute(params);
        }
    },

    _onMapData: function (features) {
        this.model.markers.set(features.markers.models);
    },

    _isPopupRoute: function (params) {
        var isPopupRoute = true;

        switch (params[0]) {
            case 'markers':
                break;
            default:
                isPopupRoute = false;
        }

        return isPopupRoute;
    },

    _handlePopupRoute: function (params) {
        var collectionName = params[0];

        // If there's no data available yet, wait until there is before handling the route.
        if (this.model[collectionName].models.length === 0) {
            this.listenToOnce(this.model[collectionName], 'add', function () {
                this._handlePopupRoute(params);
            }, this);
            return;
        }

        this._openPopup(this.model[collectionName]._getFeatureById(params[1] + '/' + params[2]));
    }
});

module.exports = PopupView;
