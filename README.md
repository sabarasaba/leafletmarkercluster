Leaflet-Marker-Cluster
=====================

Forked from [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster).

### Extra features
* AMD/CommonJS support
* Leverage clusterClick action to users.


### Usage
Create a new MarkerClusterGroup, add your markers to it, then add it to the map

```javascript
var markers = new L.MarkerClusterGroup();
markers.addLayer(new L.Marker(getRandomLatLng(map)));
... Add more layers ...
map.addLayer(markers);
```