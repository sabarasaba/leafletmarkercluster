!function(t,e){"function"==typeof define&&define.amd?define(["leaflet"],t):"object"==typeof exports&&(module.exports="undefined"!=typeof e&&e.L?t(L):t(require("leaflet"))),"undefined"!=typeof e&&e.L&&(e.L.Locate=t(L))}(function(t){return t.MarkerClusterGroup=t.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,polygonOptions:{}},initialize:function(e){t.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=t.featureGroup(),this._featureGroup.on(t.FeatureGroup.EVENTS,this._propagateEvent,this),this._nonPointGroup=t.featureGroup(),this._nonPointGroup.on(t.FeatureGroup.EVENTS,this._propagateEvent,this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[]},addLayer:function(e){if(e instanceof t.LayerGroup){var i=[];for(var n in e._layers)i.push(e._layers[n]);return this.addLayers(i)}if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this;if(!this._map)return this._needsClustering.push(e),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom);var s=e,r=this._map.getZoom();if(e.__parent)for(;s.__parent._zoom>=r;)s=s.__parent;return this._currentShownBounds.contains(s.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,s):this._animationAddLayerNonAnimated(e,s)),this},removeLayer:function(e){if(e instanceof t.LayerGroup){var i=[];for(var n in e._layers)i.push(e._layers[n]);return this.removeLayers(i)}return e.getLatLng?this._map?e.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.setOpacity&&e.setOpacity(1)),this):this:(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push(e),this):(this._nonPointGroup.removeLayer(e),this)},addLayers:function(e){var i,n,s,r=this._map,o=this._featureGroup,a=this._nonPointGroup;for(i=0,n=e.length;n>i;i++)if(s=e[i],s.getLatLng){if(!this.hasLayer(s))if(r){if(this._addLayer(s,this._maxZoom),s.__parent&&2===s.__parent.getChildCount()){var h=s.__parent.getAllChildMarkers(),_=h[0]===s?h[1]:h[0];o.removeLayer(_)}}else this._needsClustering.push(s)}else a.addLayer(s);return r&&(o.eachLayer(function(e){e instanceof t.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()}),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)),this},removeLayers:function(e){var i,n,s,r=this._featureGroup,o=this._nonPointGroup;if(!this._map){for(i=0,n=e.length;n>i;i++)s=e[i],this._arraySplice(this._needsClustering,s),o.removeLayer(s);return this}for(i=0,n=e.length;n>i;i++)s=e[i],s.__parent?(this._removeLayer(s,!0,!0),r.hasLayer(s)&&(r.removeLayer(s),s.setOpacity&&s.setOpacity(1))):o.removeLayer(s);return this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),r.eachLayer(function(e){e instanceof t.MarkerCluster&&e._updateIcon()}),this},clearLayers:function(){return this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(t){delete t.__parent}),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new t.LatLngBounds;if(this._topClusterLevel)e.extend(this._topClusterLevel._bounds);else for(var i=this._needsClustering.length-1;i>=0;i--)e.extend(this._needsClustering[i].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(t,e){var i,n=this._needsClustering.slice();for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(n),i=n.length-1;i>=0;i--)t.call(e,n[i]);this._nonPointGroup.eachLayer(t,e)},getLayers:function(){var t=[];return this.eachLayer(function(e){t.push(e)}),t},getLayer:function(e){var i=null;return this.eachLayer(function(n){t.stamp(n)===e&&(i=n)}),i},hasLayer:function(t){if(!t)return!1;var e,i=this._needsClustering;for(e=i.length-1;e>=0;e--)if(i[e]===t)return!0;for(i=this._needsRemoving,e=i.length-1;e>=0;e--)if(i[e]===t)return!1;return!(!t.__parent||t.__parent._group!==this)||this._nonPointGroup.hasLayer(t)},zoomToShowLayer:function(t,e){var i=function(){if((t._icon||t.__parent._icon)&&!this._inZoomAnimation)if(this._map.off("moveend",i,this),this.off("animationend",i,this),t._icon)e();else if(t.__parent._icon){var n=function(){this.off("spiderfied",n,this),e()};this.on("spiderfied",n,this),t.__parent.spiderfy()}};t._icon&&this._map.getBounds().contains(t.getLatLng())?e():t.__parent._zoom<this._map.getZoom()?(this._map.on("moveend",i,this),this._map.panTo(t.getLatLng())):(this._map.on("moveend",i,this),this.on("animationend",i,this),this._map.setView(t.getLatLng(),t.__parent._zoom+1),t.__parent.zoomToBounds())},onAdd:function(t){this._map=t;var e,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.onAdd(t),this._nonPointGroup.onAdd(t),this._gridClusters||this._generateInitialClusters(),e=0,i=this._needsRemoving.length;i>e;e++)n=this._needsRemoving[e],this._removeLayer(n,!0);for(this._needsRemoving=[],e=0,i=this._needsClustering.length;i>e;e++)n=this._needsClustering[e],n.getLatLng?n.__parent||this._addLayer(n,this._maxZoom):this._featureGroup.addLayer(n);this._needsClustering=[],this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),this._zoom=this._map.getZoom(),this._currentShownBounds=this._getExpandedVisibleBounds(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)},onRemove:function(t){t.off("zoomend",this._zoomEnd,this),t.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),this._hideCoverage(),this._featureGroup.onRemove(t),this._nonPointGroup.onRemove(t),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(t){for(var e=t;e&&!e._icon;)e=e.__parent;return e||null},_arraySplice:function(t,e){for(var i=t.length-1;i>=0;i--)if(t[i]===e)return t.splice(i,1),!0},_removeLayer:function(t,e,i){var n=this._gridClusters,s=this._gridUnclustered,r=this._featureGroup,o=this._map;if(e)for(var a=this._maxZoom;a>=0&&s[a].removeObject(t,o.project(t.getLatLng(),a));a--);var h,_=t.__parent,u=_._markers;for(this._arraySplice(u,t);_&&(_._childCount--,!(_._zoom<0));)e&&_._childCount<=1?(h=_._markers[0]===t?_._markers[1]:_._markers[0],n[_._zoom].removeObject(_,o.project(_._cLatLng,_._zoom)),s[_._zoom].addObject(h,o.project(h.getLatLng(),_._zoom)),this._arraySplice(_.__parent._childClusters,_),_.__parent._markers.push(h),h.__parent=_.__parent,_._icon&&(r.removeLayer(_),i||r.addLayer(h))):(_._recalculateBounds(),i&&_._icon||_._updateIcon()),_=_.__parent;delete t.__parent},_isOrIsParent:function(t,e){for(;e;){if(t===e)return!0;e=e.parentNode}return!1},_propagateEvent:function(e){if(e.layer instanceof t.MarkerCluster){if(e.originalEvent&&this._isOrIsParent(e.layer._icon,e.originalEvent.relatedTarget))return;e.type="cluster"+e.type}this.fire(e.type,e)},_defaultIconCreateFunction:function(e){var i=e.getChildCount(),n=" marker-cluster-";return n+=10>i?"small":100>i?"medium":"large",new t.DivIcon({html:"<div><span>"+i+"</span></div>",className:"marker-cluster"+n,iconSize:new t.Point(40,40)})},_bindEvents:function(){var t=this._map,e=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(e||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),t.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(t){var e=this._map;e.getMaxZoom()===e.getZoom()?this.options.spiderfyOnMaxZoom&&t.layer.spiderfy():this.options.zoomToBoundsOnClick&&t.layer.zoomToBounds(),t.originalEvent&&13===t.originalEvent.keyCode&&e._container.focus()},_showCoverage:function(e){var i=this._map;this._inZoomAnimation||(this._shownPolygon&&i.removeLayer(this._shownPolygon),e.layer.getChildCount()>2&&e.layer!==this._spiderfied&&(this._shownPolygon=new t.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),i.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var t=this.options.spiderfyOnMaxZoom,e=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(t||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),e&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=this._map._zoom,this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var t=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._map._zoom,t),this._currentShownBounds=t}},_generateInitialClusters:function(){var e=this._map.getMaxZoom(),i=this.options.maxClusterRadius;this.options.disableClusteringAtZoom&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var n=e;n>=0;n--)this._gridClusters[n]=new t.DistanceGrid(i),this._gridUnclustered[n]=new t.DistanceGrid(i);this._topClusterLevel=new t.MarkerCluster(this,-1)},_addLayer:function(e,i){var n,s,r=this._gridClusters,o=this._gridUnclustered;for(this.options.singleMarkerMode&&(e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}}));i>=0;i--){n=this._map.project(e.getLatLng(),i);var a=r[i].getNearObject(n);if(a)return a._addChild(e),e.__parent=a,void 0;if(a=o[i].getNearObject(n)){var h=a.__parent;h&&this._removeLayer(a,!1);var _=new t.MarkerCluster(this,i,a,e);r[i].addObject(_,this._map.project(_._cLatLng,i)),a.__parent=_,e.__parent=_;var u=_;for(s=i-1;s>h._zoom;s--)u=new t.MarkerCluster(this,s,u),r[s].addObject(u,this._map.project(a.getLatLng(),s));for(h._addChild(u),s=i;s>=0&&o[s].removeObject(a,this._map.project(a.getLatLng(),s));s--);return}o[i].addObject(e,n)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(t.bind(this._processQueue,this),300))},_processQueue:function(){for(var t=0;t<this._queue.length;t++)this._queue[t].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){this._processQueue(),this._zoom<this._map._zoom&&this._currentShownBounds.contains(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,this._map._zoom)):this._zoom>this._map._zoom?(this._animationStart(),this._animationZoomOut(this._zoom,this._map._zoom)):this._moveEnd()},_getExpandedVisibleBounds:function(){if(!this.options.removeOutsideVisibleBounds)return this.getBounds();var e=this._map,i=e.getBounds(),n=i._southWest,s=i._northEast,r=t.Browser.mobile?0:Math.abs(n.lat-s.lat),o=t.Browser.mobile?0:Math.abs(n.lng-s.lng);return new t.LatLngBounds(new t.LatLng(n.lat-r,n.lng-o,!0),new t.LatLng(s.lat+r,s.lng+o,!0))},_animationAddLayerNonAnimated:function(t,e){if(e===t)this._featureGroup.addLayer(t);else if(2===e._childCount){e._addToMap();var i=e.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else e._updateIcon()}}),t.MarkerClusterGroup.include(t.DomUtil.TRANSITION?{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_animationZoomIn:function(e,i){var n,s=this._getExpandedVisibleBounds(),r=this._featureGroup;this._topClusterLevel._recursively(s,e,0,function(t){var o,a=t._latlng,h=t._markers;for(s.contains(a)||(a=null),t._isSingleParent()&&e+1===i?(r.removeLayer(t),t._recursivelyAddChildrenToMap(null,i,s)):(t.setOpacity(0),t._recursivelyAddChildrenToMap(a,i,s)),n=h.length-1;n>=0;n--)o=h[n],s.contains(o._latlng)||r.removeLayer(o)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(s,i),r.eachLayer(function(e){e instanceof t.MarkerCluster||!e._icon||e.setOpacity(1)}),this._topClusterLevel._recursively(s,e,i,function(t){t._recursivelyRestoreChildPositions(i)}),this._enqueue(function(){this._topClusterLevel._recursively(s,e,0,function(t){r.removeLayer(t),t.setOpacity(1)}),this._animationEnd()})},_animationZoomOut:function(t,e){this._animationZoomOutSingle(this._topClusterLevel,t-1,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t,this._getExpandedVisibleBounds())},_animationZoomOutSingle:function(t,e,i){var n=this._getExpandedVisibleBounds();t._recursivelyAnimateChildrenInAndAddSelfToMap(n,e+1,i);var s=this;this._forceLayout(),t._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(1===t._childCount){var r=t._markers[0];r.setLatLng(r.getLatLng()),r.setOpacity(1)}else t._recursively(n,i,0,function(t){t._recursivelyRemoveChildrenFromMap(n,e+1)});s._animationEnd()})},_animationAddLayer:function(t,e){var i=this,n=this._featureGroup;n.addLayer(t),e!==t&&(e._childCount>2?(e._updateIcon(),this._forceLayout(),this._animationStart(),t._setPos(this._map.latLngToLayerPoint(e.getLatLng())),t.setOpacity(0),this._enqueue(function(){n.removeLayer(t),t.setOpacity(1),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(e,this._map.getMaxZoom(),this._map.getZoom())))},_forceLayout:function(){t.Util.falseFn(document.body.offsetWidth)}}:{_animationStart:function(){},_animationZoomIn:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds())},_animationZoomOut:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds())},_animationAddLayer:function(t,e){this._animationAddLayerNonAnimated(t,e)}}),t.markerClusterGroup=function(e){return new t.MarkerClusterGroup(e)},t.MarkerCluster=t.Marker.extend({initialize:function(e,i,n,s){t.Marker.prototype.initialize.call(this,n?n._cLatLng||n.getLatLng():new t.LatLng(0,0),{icon:this}),this._group=e,this._zoom=i,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._bounds=new t.LatLngBounds,n&&this._addChild(n),s&&this._addChild(s)},getAllChildMarkers:function(t){t=t||[];for(var e=this._childClusters.length-1;e>=0;e--)this._childClusters[e].getAllChildMarkers(t);for(var i=this._markers.length-1;i>=0;i--)t.push(this._markers[i]);return t},getChildCount:function(){return this._childCount},zoomToBounds:function(){for(var t,e=this._childClusters.slice(),i=this._group._map,n=i.getBoundsZoom(this._bounds),s=this._zoom+1,r=i.getZoom();e.length>0&&n>s;){s++;var o=[];for(t=0;t<e.length;t++)o=o.concat(e[t]._childClusters);e=o}n>s?this._group._map.setView(this._latlng,s):r>=n?this._group._map.setView(this._latlng,r+1):this._group._map.fitBounds(this._bounds)},getBounds:function(){var e=new t.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,i){this._iconNeedsUpdate=!0,this._expandBounds(e),e instanceof t.MarkerCluster?(i||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(i||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_expandBounds:function(e){var i,n=e._wLatLng||e._latlng;e instanceof t.MarkerCluster?(this._bounds.extend(e._bounds),i=e._childCount):(this._bounds.extend(n),i=1),this._cLatLng||(this._cLatLng=e._cLatLng||n);var s=this._childCount+i;this._wLatLng?(this._wLatLng.lat=(n.lat*i+this._wLatLng.lat*this._childCount)/s,this._wLatLng.lng=(n.lng*i+this._wLatLng.lng*this._childCount)/s):this._latlng=this._wLatLng=new t.LatLng(n.lat,n.lng)},_addToMap:function(t){t&&(this._backupLatlng=this._latlng,this.setLatLng(t)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(t,e,i){this._recursively(t,0,i-1,function(t){var i,n,s=t._markers;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))},function(t){var i,n,s=t._childClusters;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(t,e,i){this._recursively(t,i,0,function(n){n._recursivelyAnimateChildrenIn(t,n._group._map.latLngToLayerPoint(n.getLatLng()).round(),e),n._isSingleParent()&&e-1===i?(n.setOpacity(1),n._recursivelyRemoveChildrenFromMap(t,e)):n.setOpacity(0),n._addToMap()})},_recursivelyBecomeVisible:function(t,e){this._recursively(t,0,e,null,function(t){t.setOpacity(1)})},_recursivelyAddChildrenToMap:function(t,e,i){this._recursively(i,-1,e,function(n){if(e!==n._zoom)for(var s=n._markers.length-1;s>=0;s--){var r=n._markers[s];i.contains(r._latlng)&&(t&&(r._backupLatlng=r.getLatLng(),r.setLatLng(t),r.setOpacity&&r.setOpacity(0)),n._group._featureGroup.addLayer(r))}},function(e){e._addToMap(t)})},_recursivelyRestoreChildPositions:function(t){for(var e=this._markers.length-1;e>=0;e--){var i=this._markers[e];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(t-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var s=this._childClusters.length-1;s>=0;s--)this._childClusters[s]._recursivelyRestoreChildPositions(t)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(t,e,i){var n,s;this._recursively(t,-1,e-1,function(t){for(s=t._markers.length-1;s>=0;s--)n=t._markers[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))},function(t){for(s=t._childClusters.length-1;s>=0;s--)n=t._childClusters[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))})},_recursively:function(t,e,i,n,s){var r,o,a=this._childClusters,h=this._zoom;if(e>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s);else if(n&&n(this),s&&this._zoom===i&&s(this),i>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s)},_recalculateBounds:function(){var e,i=this._markers,n=this._childClusters;for(this._bounds=new t.LatLngBounds,delete this._wLatLng,e=i.length-1;e>=0;e--)this._expandBounds(i[e]);for(e=n.length-1;e>=0;e--)this._expandBounds(n[e])},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}}),t.DistanceGrid=function(t){this._cellSize=t,this._sqCellSize=t*t,this._grid={},this._objectPoint={}},t.DistanceGrid.prototype={addObject:function(e,i){var n=this._getCoord(i.x),s=this._getCoord(i.y),r=this._grid,o=r[s]=r[s]||{},a=o[n]=o[n]||[],h=t.Util.stamp(e);this._objectPoint[h]=i,a.push(e)},updateObject:function(t,e){this.removeObject(t),this.addObject(t,e)},removeObject:function(e,i){var n,s,r=this._getCoord(i.x),o=this._getCoord(i.y),a=this._grid,h=a[o]=a[o]||{},_=h[r]=h[r]||[];for(delete this._objectPoint[t.Util.stamp(e)],n=0,s=_.length;s>n;n++)if(_[n]===e)return _.splice(n,1),1===s&&delete h[r],!0},eachObject:function(t,e){var i,n,s,r,o,a,h,_=this._grid;for(i in _){o=_[i];for(n in o)for(a=o[n],s=0,r=a.length;r>s;s++)h=t.call(e,a[s]),h&&(s--,r--)}},getNearObject:function(e){var i,n,s,r,o,a,h,_,u=this._getCoord(e.x),l=this._getCoord(e.y),d=this._objectPoint,p=this._sqCellSize,c=null;for(i=l-1;l+1>=i;i++)if(r=this._grid[i])for(n=u-1;u+1>=n;n++)if(o=r[n])for(s=0,a=o.length;a>s;s++)h=o[s],_=this._sqDist(d[t.Util.stamp(h)],e),p>_&&(p=_,c=h);return c},_getCoord:function(t){return Math.floor(t/this._cellSize)},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n}},function(){t.QuickHull={getDistant:function(t,e){var i=e[1].lat-e[0].lat,n=e[0].lng-e[1].lng;return n*(t.lat-e[0].lat)+i*(t.lng-e[0].lng)},findMostDistantPointFromBaseLine:function(t,e){var i,n,s,r=0,o=null,a=[];for(i=e.length-1;i>=0;i--)n=e[i],s=this.getDistant(n,t),s>0&&(a.push(n),s>r&&(r=s,o=n));return{maxPoint:o,newPoints:a}},buildConvexHull:function(t,e){var i=[],n=this.findMostDistantPointFromBaseLine(t,e);return n.maxPoint?(i=i.concat(this.buildConvexHull([t[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,t[1]],n.newPoints))):[t[0]]},getConvexHull:function(t){var e,i=!1,n=!1,s=null,r=null;for(e=t.length-1;e>=0;e--){var o=t[e];(i===!1||o.lat>i)&&(s=o,i=o.lat),(n===!1||o.lat<n)&&(r=o,n=o.lat)}var a=[].concat(this.buildConvexHull([r,s],t),this.buildConvexHull([s,r],t));return a}}}(),t.MarkerCluster.include({getConvexHull:function(){var e,i,n=this.getAllChildMarkers(),s=[];for(i=n.length-1;i>=0;i--)e=n[i].getLatLng(),s.push(e);return t.QuickHull.getConvexHull(s)}}),t.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var t,e=this.getAllChildMarkers(),i=this._group,n=i._map,s=n.latLngToLayerPoint(this._latlng);this._group._unspiderfy(),this._group._spiderfied=this,e.length>=this._circleSpiralSwitchover?t=this._generatePointsSpiral(e.length,s):(s.y+=10,t=this._generatePointsCircle(e.length,s)),this._animationSpiderfy(e,t)}},unspiderfy:function(t){this._group._inZoomAnimation||(this._animationUnspiderfy(t),this._group._spiderfied=null)},_generatePointsCircle:function(e,i){var n,s,r=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e),o=r/this._2PI,a=this._2PI/e,h=[];for(h.length=e,n=e-1;n>=0;n--)s=this._circleStartAngle+n*a,h[n]=new t.Point(i.x+o*Math.cos(s),i.y+o*Math.sin(s))._round();return h},_generatePointsSpiral:function(e,i){var n,s=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthStart,r=this._group.options.spiderfyDistanceMultiplier*this._spiralFootSeparation,o=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthFactor,a=0,h=[];for(h.length=e,n=e-1;n>=0;n--)a+=r/s+5e-4*n,h[n]=new t.Point(i.x+s*Math.cos(a),i.y+s*Math.sin(a))._round(),s+=this._2PI*o/a;return h},_noanimationUnspiderfy:function(){var t,e,i=this._group,n=i._map,s=i._featureGroup,r=this.getAllChildMarkers();for(this.setOpacity(1),e=r.length-1;e>=0;e--)t=r[e],s.removeLayer(t),t._preSpiderfyLatlng&&(t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng),t.setZIndexOffset&&t.setZIndexOffset(0),t._spiderLeg&&(n.removeLayer(t._spiderLeg),delete t._spiderLeg);i._spiderfied=null}}),t.MarkerCluster.include(t.DomUtil.TRANSITION?{SVG_ANIMATION:function(){return document.createElementNS("http://www.w3.org/2000/svg","animate").toString().indexOf("SVGAnimate")>-1}(),_animationSpiderfy:function(e,i){var n,s,r,o,a=this,h=this._group,_=h._map,u=h._featureGroup,l=_.latLngToLayerPoint(this._latlng);for(n=e.length-1;n>=0;n--)s=e[n],s.setOpacity?(s.setZIndexOffset(1e6),s.setOpacity(0),u.addLayer(s),s._setPos(l)):u.addLayer(s);h._forceLayout(),h._animationStart();var d=t.Path.SVG?0:.3,p=t.Path.SVG_NS;for(n=e.length-1;n>=0;n--)if(o=_.layerPointToLatLng(i[n]),s=e[n],s._preSpiderfyLatlng=s._latlng,s.setLatLng(o),s.setOpacity&&s.setOpacity(1),r=new t.Polyline([a._latlng,o],{weight:1.5,color:"#222",opacity:d}),_.addLayer(r),s._spiderLeg=r,t.Path.SVG&&this.SVG_ANIMATION){var c=r._path.getTotalLength();r._path.setAttribute("stroke-dasharray",c+","+c);var f=document.createElementNS(p,"animate");f.setAttribute("attributeName","stroke-dashoffset"),f.setAttribute("begin","indefinite"),f.setAttribute("from",c),f.setAttribute("to",0),f.setAttribute("dur",.25),r._path.appendChild(f),f.beginElement(),f=document.createElementNS(p,"animate"),f.setAttribute("attributeName","stroke-opacity"),f.setAttribute("attributeName","stroke-opacity"),f.setAttribute("begin","indefinite"),f.setAttribute("from",0),f.setAttribute("to",.5),f.setAttribute("dur",.25),r._path.appendChild(f),f.beginElement()}if(a.setOpacity(.3),t.Path.SVG)for(this._group._forceLayout(),n=e.length-1;n>=0;n--)s=e[n]._spiderLeg,s.options.opacity=.5,s._path.setAttribute("stroke-opacity",.5);setTimeout(function(){h._animationEnd(),h.fire("spiderfied")},200)},_animationUnspiderfy:function(e){var i,n,s,r=this._group,o=r._map,a=r._featureGroup,h=e?o._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):o.latLngToLayerPoint(this._latlng),_=this.getAllChildMarkers(),u=t.Path.SVG&&this.SVG_ANIMATION;for(r._animationStart(),this.setOpacity(1),n=_.length-1;n>=0;n--)i=_[n],i._preSpiderfyLatlng&&(i.setLatLng(i._preSpiderfyLatlng),delete i._preSpiderfyLatlng,i.setOpacity?(i._setPos(h),i.setOpacity(0)):a.removeLayer(i),u&&(s=i._spiderLeg._path.childNodes[0],s.setAttribute("to",s.getAttribute("from")),s.setAttribute("from",0),s.beginElement(),s=i._spiderLeg._path.childNodes[1],s.setAttribute("from",.5),s.setAttribute("to",0),s.setAttribute("stroke-opacity",0),s.beginElement(),i._spiderLeg._path.setAttribute("stroke-opacity",0)));setTimeout(function(){var t=0;for(n=_.length-1;n>=0;n--)i=_[n],i._spiderLeg&&t++;for(n=_.length-1;n>=0;n--)i=_[n],i._spiderLeg&&(i.setOpacity&&(i.setOpacity(1),i.setZIndexOffset(0)),t>1&&a.removeLayer(i),o.removeLayer(i._spiderLeg),delete i._spiderLeg);r._animationEnd()},200)}}:{_animationSpiderfy:function(e,i){var n,s,r,o,a=this._group,h=a._map,_=a._featureGroup;for(n=e.length-1;n>=0;n--)o=h.layerPointToLatLng(i[n]),s=e[n],s._preSpiderfyLatlng=s._latlng,s.setLatLng(o),s.setZIndexOffset&&s.setZIndexOffset(1e6),_.addLayer(s),r=new t.Polyline([this._latlng,o],{weight:1.5,color:"#222"}),h.addLayer(r),s._spiderLeg=r;this.setOpacity(.3),a.fire("spiderfied")},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),t.MarkerClusterGroup.include({_spiderfied:null,_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),t.Path.SVG&&!t.Browser.touch&&this._map._initPathRoot()},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){t.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(t){this._spiderfied&&this._spiderfied.unspiderfy(t)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(t){t._spiderLeg&&(this._featureGroup.removeLayer(t),t.setOpacity(1),t.setZIndexOffset(0),this._map.removeLayer(t._spiderLeg),delete t._spiderLeg)}}),t.MarkerClusterGroup},window);