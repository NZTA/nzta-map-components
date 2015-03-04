/**
 * @file A collection of Backbone components useful for building NZTA maps.
 */

/*jshint multistr: true */

(function (root, factory) {

    var Backbone = root.Backbone,
        _ = root._,
        Cocktail = root.Cocktail;

    if (Backbone === void 0) {
        Backbone = root.Backbone = require('backbone');
    }

    if (_ === void 0) {
        _ = root._ = require('underscore');
    }

    if (Cocktail === void 0) {
        Cocktail = root.Cocktail = require('backbone.cocktail');
    }

    if (Backbone.$ === void 0) {
        Backbone.$ = require('jquery');
    }

    if (Backbone.Marionette === void 0) {
        Backbone.Marionette = require('backbone.marionette');
    }

    if (Backbone.Associations === void 0) {
        Backbone = require('backbone-associations');
    }

    module.exports = factory(Backbone, _, Cocktail);

}(window, function (Backbone, _, Cocktail) {

    var NZTAComponents = {};

    var Router = Backbone.Marionette.AppRouter.extend({

        routes: {
            '': '_handleNav',
            ':action/:type(/:id)': '_handleNav'
        },

        _previousFragment: null,

        _handleNav: function(action, type, id) { }
    });

    var router = new Router();

    var browserHelpersMixin = {
        _isIE: function () {
            return navigator.appVersion.indexOf("MSIE ") !== -1;
        },
        _isIE9: function () {
            return navigator.appVersion.indexOf("MSIE 9.") !== -1;
        }
    };

    var eventsMixin = {
        initialize: function () {
            // Add hook for routing
            this.listenTo(router, 'route', function (handler, params) {
                if (typeof this._onRoute === 'function') {
                    this._onRoute(handler, params);
                }
            }, this);
        }
    };

    var featureHelpersMixin = {
        /**
         * @func _getRelationsForFeature
         * @param {Array} relatedModels - The models related to your feature.
         * @param {String} featureType - The type of feature you have e.g. 'regions'.
         * @param {String} featureId - The the ID of the feature you have.
         * @return {Array}
         * @desc Given a feature, get all related models of a specific type.
         */
        _getRelationsForFeature: function (relatedModels, featureType, featureId) {
            return _
                .chain(relatedModels)
                .filter(function (model) {
                    var relationArray = model.get('properties')[featureType];

                    // Make sure the featureType exists on the model.
                    if (relationArray === void 0 || relationArray.length === 0) {
                        return false;
                    }

                    return _.findWhere(relationArray, { id: featureId }) !== void 0;
                })
                .unique(function (model) {
                    return model.get('properties').id;
                })
                .value();
        }
    };

    /**
     * @module DrillDownMenuView
     * @extends Marionette.LayoutView
     * @desc Top level component for creating a Drill Down Menu. Has child {@link DrillDownPanelView} components.
     */
    NZTAComponents.DrillDownMenuView = Backbone.Marionette.LayoutView.extend({

        /**
         * @func initialize
         * @override
         * @param {object} options
         */
        initialize: function (options) {
            var defaultPanel;

            this._panelViews = [];

            defaultPanel = this._createPanel(options.defaultPanel, options.defaultCollectionKey);

            // If there's no model defined by the inheriting class, set up a default.
            if (this.model === void 0) {
                this.model = new Backbone.Model();
            }

            this.model.set({
                baseUrlSegment: this.options.baseUrlSegment || '',
                currentPanelViewCid: defaultPanel.cid,
                backUrlSegment: null,
                currentUrlSegment: null
            });
        },

        /**
         * @func onRender
         * @override
         */
        onRender: function () {
            // Render the default panel view.
            this.defaultPanelRegion.show(this._panelViews[0]);
        },

        /**
         * @func _getPanelByUrlSegment
         * @param {string} urlSegment - The URL segment of the panel you're looking for.
         * @return {object}
         * @desc Get a panel by it's URL segment.
         */
        _getPanelByUrlSegment: function (urlSegment) {
            return _.filter(this._panelViews, function (panelView) {
                if (panelView.model === void 0) {
                    return false;
                }

                return panelView.model.get('urlSegment') === urlSegment;
            });
        },

        /**
         * @func _showNewPanelView
         * @param {Object} panelView
         */
        _showNewPanelView: function (panelView) {
            var panelRegion = null;

            // hide the default panel
            this._panelViews[0].$el.hide();

            panelRegion = this._createPanelRegion(panelView.cid);
            panelRegion.show(panelView);
        },

        /**
         * @func _setBackUrlSegment
         * @return {string} The URL segment being navigated away from.
         * @desc Set the 'back' URL segment. Called before navigating to a new route.
         */
        _setBackUrlSegment: function () {
            var baseUrlSegment = this.model.get('baseUrlSegment'),
                backUrlSegment = this.model.get('backUrlSegment'),
                currentUrlSegment = this.model.get('currentUrlSegment');

            if (backUrlSegment === null || backUrlSegment === baseUrlSegment) {
                currentUrlSegment = baseUrlSegment;
            } else {
                currentUrlSegment = currentUrlSegment;
            }

            this.model.set('backUrlSegment', currentUrlSegment);

            return currentUrlSegment;
        },

        /**
         * @func _navigateMenuForward
         * @param {string} urlSegment - The URL segment we're navigating to.
         * @desc Navigates the menu forward one step.
         */
        _navigateMenuForward: function (urlSegment) {
            var forwardUrl = this.model.get('baseUrlSegment') + urlSegment;

            this._setBackUrlSegment();

            // Remove the previous panel if it's not the default panel.
            if (this._panelViews.length > 1) {
                this._removePanel(this.model.get('currentPanelViewCid'));
            }

            this.model.set('currentUrlSegment', forwardUrl);

            router.navigate(forwardUrl, { trigger: true });
        },

        /**
         * @func _navigateMenuBack
         * @param {string} cid - The CID of the current panel.
         * @desc Navigates the menu back one step.
         */
        _navigateMenuBack: function (cid) {
            var backUrlSegment = this._setBackUrlSegment(),
                trigger = backUrlSegment === '' ? true : false,
                currentPanel = this._panelViews[this._panelViews.length - 2];

            this.model.set({
                currentPanelViewCid: currentPanel.cid,
            });

            currentPanel.$el.addClass('anim-reveal').show();

            this._removePanel(cid);

            this.model.set('currentUrlSegment', backUrlSegment);

            router.navigate(backUrlSegment, { trigger: trigger });
        },

        /**
         * @func _createPanelRegion
         * @param {Object} cid
         * @desc Create a DOM element and region object for a panel view.
         */
        _createPanelRegion: function (cid) {
            this.$el.append('<div class="view-absolute panel-region-' + cid + '"></div>');

            return this.addRegion('panelRegion' + cid, '.panel-region-' + cid);
        },

        /**
         * @func _removePanel
         * @param {Object} cid
         * @desc Remove a panel from the DrillDownMenuView.
         */
        _removePanel: function (cid) {
            // Remove the view from _panelViews.
            this._panelViews = _.without(this._panelViews, _.findWhere(this._panelViews, { cid: cid }));

            // Remove the view's region. This also destroys the view instance.
            this.removeRegion('panelRegion' + cid);

            // Remove the view wrapper from the DOM
            this.$el.find('.panel-region-' + cid).remove();
        },

        /**
         * @func _createPanel
         * @param {Object} ViewConstructor Constructor for the view you want put inside the panel.
         * @return {Object} The newly created View.
         * @desc Create a panel within the DrillDownMenuView.
         */
        _createPanel: function (ViewConstructor, collectionKey, collectionFilter, modelValues) {
            var panelView = new ViewConstructor({ vent: this.options.vent }),
                models;

            this.listenTo(panelView, 'drillDownMenu.navigate.forward', this._navigateMenuForward, this);
            this.listenTo(panelView, 'drillDownMenu.navigate.back', this._navigateMenuBack, this);

            // Populate the panel's model
            if (modelValues !== void 0) {
                panelView.model.set(modelValues);
            }

            // Populate the panel's collection
            if (collectionFilter !== void 0) {
                models = this._getRelationsForFeature(this.model.get(collectionKey).models, collectionFilter.key, collectionFilter.value);
            } else {
                models = this.model.get(collectionKey).models;
            }
            panelView.collection.add(models);

            this._panelViews.push(panelView);

            return panelView;
        }
    });
    Cocktail.mixin(NZTAComponents.DrillDownMenuView, eventsMixin, browserHelpersMixin, featureHelpersMixin);

    /**
     * @module DrillDownPanelView
     * @extends Marionette.CompositeView
     * @desc A sub-component used to create Drill Down Menus. Child of {@link DrillDownMenuView}. Has {@link DrillDownItemView} child components.
     */
    NZTAComponents.DrillDownPanelView = Backbone.Marionette.CompositeView.extend({

        childView: NZTAComponents.DrillDownItemView,

        childViewContainer: '.items',

        /**
         * @func templateHelpers
         * @override
         */
        templateHelpers: function () {
            return {
                items: this.collection.toJSON()
            };
        },

        events: {
            'click .back': '_navigateMenuBack',
            'click .list__link': '_navigateMenuForward'
        },

        /**
         * @func initialize
         * @override
         */
        initialize: function () {
            this.model = new Backbone.Model();
            this.collection = new Backbone.Collection();

            // Automatically re-render the view when the collection changes.
            this.listenTo(this.collection, 'change', function () {
                this.render();
            }, this);
        },

        /**
         * @func onShow
         * @override
         */
        onShow: function () {
            this.$el.find('.view-absolute').addClass('anim-reveal');
        },

        /**
         * @func _navigateMenuForward
         * @param {object} e - Event object.
         * @desc Navigate the menu forward (drill down).
         */
        _navigateMenuForward: function (e) {
            this.trigger('drillDownMenu.navigate.forward', Backbone.$(e.currentTarget).data('feature'));
        },

        /**
         * @func _navigateMenuBack
         * @desc Navigate the menu back.
         */
        _navigateMenuBack: function () {
            this.trigger('drillDownMenu.navigate.back', this.cid);
        }
    });
    Cocktail.mixin(NZTAComponents.DrillDownPanelView, eventsMixin, browserHelpersMixin, featureHelpersMixin);

    /**
     * @module DrillDownItemView
     * @extends Marionette.ItemView
     * @desc Child component of {@link DrillDownPanelView}. Used in creating Drill Down Menus.
     */
    NZTAComponents.DrillDownItemView = Backbone.Marionette.ItemView.extend({

        /**
         * @func onShow
         * @override
         */
        onShow: function () {
            this.$el.closest('.view-absolute').addClass('anim-reveal');
        }

    });
    Cocktail.mixin(NZTAComponents.DrillDownItemView, browserHelpersMixin, featureHelpersMixin);

    /**
     * @module GeoJsonCollection
     * @extends Backbone.Collection
     * @desc For dealing with {@link GeoJsonModel} models.
     */
    NZTAComponents.GeoJsonCollection = Backbone.Collection.extend({
        /**
         * @func fetch
         * @override
         * @desc Preprocessing GeoJSON response before populating models. We're overriding this because we need to deal with `resp.features` property inside the success callback, rather than the standard `resp` property.
         */
        fetch: function(options) {
            options = options ? _.clone(options) : {};

            if (options.parse === void 0) {
                options.parse = true;
            }

            var success = options.success;
            var collection = this;

            options.success = function(resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp.features, options);

                if (success) {
                    success(collection, resp, options);
                }

                collection.trigger('sync', collection, resp, options);
            };

            return this.sync('read', this, options);
        },

        /**
         * @func _getFeaturesByPropertyValue
         * @param {string} key - The key on the GeoJSON feature's `properties` to check against.
         * @param {string} value - The value of `key`.
         * @desc Get list of GeoJSON features filtered by a `properties` value.
         */
        _getFeaturesByPropertyValue: function (key, value) {
            return _.filter(this.models, function (featureModel) {
                return featureModel.get('properties')[key] === value;
            });
        },

        /**
         * @func _getFeatureById
         * @param {string} featureId - The ID of the feature you're looking for.
         * @return {object}
         */
        _getFeatureById: function (featureId) {
            return _.filter(this.models, function (featureModel) {
                return featureModel.get('properties').id === featureId;
            })[0];
        },

        /**
         * @func _getFeaturesByRelation
         * @param {string} relationKey - The property where the relation is on the model.
         * @param {string} relationId - The ID of the relation.
         * @return {array} - Filtered list of models
         * @desc Filter the collection by related data.
         */
        _getFeaturesByRelation: function (relationKey, relationId) {
            return _.filter(this.models, function (geoJsonModel) {
                var relation = geoJsonModel.get('properties')[relationKey];

                // Make sure the relation exists on the model.
                if (relation === void 0 || relation.length === 0) {
                    return false;
                }

                return _.findWhere(relation, { id: relationId }) !== void 0;
            });
        }
    });
    
    /**
     * @module GeoJsonModel
     * @extends Backbone.AssociatedModel
     * @desc Represents a GeoJSON feature.
     */
    NZTAComponents.GeoJsonModel = Backbone.AssociatedModel.extend({

        /**
         * @func _getDisplayTime
         * @return {string}
         * @desc Get a display friendly string representing the time it will take to travel the feature.
         */
        _getDisplayTime: function() {
            var displayTime = null,
                length = parseFloat(this.get('properties').totalLength),
                speed = parseFloat(this.get('properties').speed),
                timeMinute = 0,
                timeHours = 0,
                timeMinuteStr = '',
                timeHourStr = '';

            // Are there any errors in the data?
            if (isNaN(length) || isNaN(speed) || speed <= 0 || length <= 0) {
                return displayTime;
            }

            // Calculate the time (distance/speed per minute)
            timeMinute = Math.ceil(length / (speed / 60));

            // If this is too big, show with hours too.
            if (timeMinute > 60) {
                timeHours = Math.floor(timeMinute / 60);
                timeMinute -= timeHours * 60;
            }

            timeMinuteStr = timeMinute === 1 ? '1 min' : timeMinute + ' mins';
            timeHourStr = timeHours === 1 ? '1 hour' : timeHours + ' hours';

            if (timeHours > 0 && timeMinute === 0) {
                displayTime = timeHourStr;
            } else if (timeHours > 0) {
                displayTime = timeHourStr + ' ' + timeMinuteStr;
            } else {
                displayTime = timeMinuteStr;
            }

            return displayTime;
        }

    });

    /**
     * @module MapModel
     * @extends Backbone.AssociatedModel
     * @desc The model for {@link MapView}.
     */
    NZTAComponents.MapModel = Backbone.AssociatedModel.extend({

        defaults: {
            popupFeatureId: null
        },

        /**
         * @func _populateCollection
         * @param {string} collectionKey - The key on MapModel to populate.
         * @param {array} features - GeoJSON features to populate the collection with.
         * @param {object} [filter] - Filter features by key/value.
         * @param {string} filter.key - Match against this key on the feature's `properties`.
         * @param {string} filter.value - Only populate the collection with features who's `filter.key` match this value.
         * @return {object} The collection.
         * @desc Populate a collection on MapModel with a set of GeoJSON features.
         */
        _populateCollection: function (collectionKey, features, filter) {
            var collection = this.get(collectionKey);

            if (filter !== void 0) {
                collection.set(_.filter(features, function (feature) {
                    return feature.properties[filter.key] === filter.value;
                }));
            } else {
                collection.set(features);
            }

            return collection;
        },

        /**
         * @func _getFeatureTypeById
         * @param {string} collectionKey - MapModel key where the collection is.
         * @param {string} featureId - ID of the feature you want.
         * @return {object} GeoJSON feature.
         * @desc Get a feature model ID.
         */
        _getFeatureTypeById: function (collectionKey, featureId) {
            return _.filter(this.get(collectionKey).models, function (featureModel) {
                return featureModel.get('properties').id === featureId;
            })[0];
        }
    });

    /**
     * @module MapView
     * @extends Marionette.ItemView
     * @desc Used for displaying the Map.
     */
    NZTAComponents.MapView = Backbone.Marionette.ItemView.extend({

        /**
         * @func initialize
         * @override
         */
        initialize: function () {
            this.model = new NZTAComponents.MapModel();
        }

    });
    Cocktail.mixin(NZTAComponents.MapView, eventsMixin, browserHelpersMixin);

    /**
     * @module PopupModel
     * @extends Backbone.AssociatedModel
     * @desc The model for {@link PopupView}.
     */
    NZTAComponents.PopupModel = Backbone.AssociatedModel.extend({
        relations: [
            {
                type: Backbone.One,
                key: 'feature',
                relatedModel: NZTAComponents.GeoJsonModel
            }
        ],
        defaults: {
            hidden: true,
            type: null,
            feature: function () {
                return new NZTAComponents.GeoJsonModel();
            }
        }
    });

    /**
     * @module PopupView
     * @extends Marionette.LayoutView
     * @desc Used for displaying detailed information about a Map feature.
     */
    NZTAComponents.PopupView = Backbone.Marionette.LayoutView.extend({

        events: {
            'click .close': '_closePopup'
        },

        /**
         * @func initialize
         * @override
         */
        initialize: function () {
            this.model = new NZTAComponents.PopupModel();
        },

        /**
         * @func onRender
         * @override
         */
        onRender: function () {
            if (this.model.get('hidden') === false) {
                // Add a display class to <body> which animates the Popup into view and hides the Sidebar.
                // Not an ideal solution, but it's how the Pattern Library works.
                // We're using a _.defer to apply the CSS class after rendering happens.
                // This is because the popup needs to transition into view, and adding the
                // class during the render cycle means the animation doesn't happen.
                _.defer(function () {
                    $('body').addClass('modal-active');
                });
            } else {
                _.defer(function () {
                    $('body').removeClass('modal-active');
                });
            }
        },

        /**
         * @func _openPopup
         * @param {Object} featureModel - Backbone Model representing the feature.
         * @desc Open the Popup and display some feature data.
         */
        _openPopup: function (featureModel) {
            this.model.set({
                'hidden': false,
                'feature': featureModel,
                'type': featureModel.get('properties').featureType
            });

            this.render();

            this.options.vent.trigger('popup.afterOpen', this.model.get('feature'));
        },

        /**
         * @func _closePopup
         * @desc Close the popup and reset it's state.
         */
        _closePopup: function () {
            var backFragment = router._previousFragment !== null ? router._previousFragment : '';

            // Reset the model
            this.model.set({
                'hidden': true,
                'feature': null,
                'type': null
            });

            this.render();

            router.navigate(backFragment, { trigger: false });
            router._previousFragment = null;

            this.options.vent.trigger('popup.afterClose');
        }
    });
    Cocktail.mixin(NZTAComponents.PopupView, eventsMixin, browserHelpersMixin);

    /**
     * @module router
     * @extends Marionette.AppRouter
     * @desc A singleton router instance.
     */
    NZTAComponents.router = router;

    /**
     * @module UserControlsView
     * @extends Marionette.ItemView
     * @desc User controls for the Map.
     */
    NZTAComponents.UserControlsView = Backbone.Marionette.ItemView.extend({

        template: _.template('\
            <div class="map-controls"> \
                <div class="section--view-type-nav"> \
                    <ul class="map-nav--view-type"> \
                        <li class="nav__item"> \
                            <a id="mobile-control-map-button" href="javascript:void(0)">Map</a> \
                        </li> \
                    </ul> \
                    <ul class="map-nav--view-type"> \
                        <li class="nav__item"> \
                            <a id="mobile-control-list-button" href="javascript:void(0)">List</a> \
                        </li> \
                    </ul> \
                </div> \
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
                    <ul class="map-nav--icon"> \
                        <li class="map-nav__item toggle-tools"> \
                            <a href="javascript:void(0)" class="" id="viewOptions"> \
                                <i class="i i-map-cog"></i> \
                                <span class="sr-only">View options</span> \
                            </a> \
                        </li> \
                    </ul> \
                    <div id="key"></div> \
                </div> \
            </div> \
        '),

        events: {
            'click #zoomIn': '_zoomIn',
            'click #zoomOut': '_zoomOut',
            'click #locate': '_locateUser',
            'click #viewOptions': '_toggleLayerOptions',
            'click #mobile-control-map-button': '_handleMobileControlMapButton',
            'click #mobile-control-list-button': '_handleMobileControlListButton'
        },

        /**
         * @func onRender
         * @override
         */
        onRender: function () {
            this.$el.find('#key').replaceWith(this.options.mappy.key.domElement);
        },

        /**
         * @func _zoomIn
         * @param {object} e - Event object.
         * @desc Zooms the Map in.
         */
        _zoomIn: function (e) {
            this.options.mappy.map.zoomIn(e.shiftKey ? 3 : 1);
        },

        /**
         * @func _zoomOut
         * @param {object} e - Event object.
         * @desc Zooms the Map out.
         */
        _zoomOut: function (e) {
            this.options.mappy.map.zoomOut(e.shiftKey ? 3 : 1);
        },

        /**
         * @func _locateUser
         * @desc Pan to the user's location on the Map.
         */
        _locateUser: function () {
            this.options.mappy.map.locate({setView: true, maxZoom: this.options.mappy.map.getZoom()});
        },

        /**
         * @func _toggleLayerOptions
         * @desc Shows / hides the layer checkboxes.
         */
        _toggleLayerOptions: function () {
            $('body').toggleClass('tools-active');
        },

        /**
         * @func _handleMobileControlMapButton
         * @desc Hides the mobile specific controls.
         */
        _handleMobileControlMapButton: function () {
            $('body').removeClass('list-active');
        },

        /**
         * @func _handleMobileControlListButton
         * @desc Shows the mobile specific controls.
         */
        _handleMobileControlListButton: function () {
            $('body').addClass('list-active');
        }
    });
    Cocktail.mixin(NZTAComponents.UserControlsView, eventsMixin, browserHelpersMixin);

    return NZTAComponents;
}));
