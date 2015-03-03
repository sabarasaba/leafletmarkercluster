Leaflet-Marker-Cluster
=====================

Forked from [.eaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).

### Extra features
* AMD/CommonJS support
* Ability to customize cluster actions depending on the accuracy of the child pins.
* Exposes more events: `onClusterClick`, `onClusterTransitionFinished`


### Usage
Create a new MarkerClusterGroup, add your markers to it, then add it to the map

```javascript
var markers = new L.MarkerClusterGroup();
markers.addLayer(new L.Marker(getRandomLatLng(map)));
... Add more layers ...
map.addLayer(markers);
```