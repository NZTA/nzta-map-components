
'use strict';

var _ = require('underscore'),
    NZTAComponents = require('nzta-map-components');

var TrafficMapUserControlsView = NZTAComponents.UserControlsView.extend({

    template: _.template('\
        <div class="map-controls"> \
            <ul class="list-group"> \
                <li class="list-group-item"> \
                    <a href="javascript:void(0)" id="zoomIn"> \
                        <span class="glyphicon glyphicon-zoom-in"></span> \
                    </a> \
                </li> \
                <li class="list-group-item"> \
                    <a href="javascript:void(0)" id="zoomOut"> \
                        <span class="glyphicon glyphicon-zoom-out"></span> \
                    </a> \
                </li> \
                <li class="list-group-item"> \
                    <a href="javascript:void(0)" id="locate"> \
                        <span class="glyphicon glyphicon-screenshot"></span> \
                    </a> \
                </li> \
            </ul> \
        </div> \
    ')

});

module.exports = TrafficMapUserControlsView;
