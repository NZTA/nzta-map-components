
'use strict';

var _ = require('underscore'),
    NZTAComponents = require('nzta-map-components');

var TrafficMapUserControlsView = NZTAComponents.UserControlsView.extend({

    template: _.template('\
        <div class="map-controls"> \
            <div class="section--map-nav"> \
                <ul class="map-nav--icon"> \
                    <li class="map-nav__item"> \
                        <a href="javascript:void(0)" id="zoomIn"> \
                            <i class="i i-map-plus"></i> \
                            <span class="sr-only">Zoom in</span> \
                        </a> \
                    </li> \
                    <li class="map-nav__item"> \
                        <a href="javascript:void(0)" id="zoomOut"> \
                            <i class="i i-map-minus"></i> \
                            <span class="sr-only">Zoom out</span> \
                        </a> \
                    </li> \
                </ul> \
                <ul class="map-nav--icon"> \
                    <li class="map-nav__item"> \
                        <a href="javascript:void(0)" id="locate"> \
                            <i class="i i-map-compass"></i> \
                            <span class="sr-only">Locate</span> \
                        </a> \
                    </li> \
                </ul> \
            </div> \
        </div> \
    ')

});

module.exports = TrafficMapUserControlsView;
