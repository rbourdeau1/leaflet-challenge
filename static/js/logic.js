var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
    createFeatures(data.features);
});

function magColor(magnitude) {
    switch (true) {
    case magnitude > 5:
        return '#581845';
    case magnitude > 4:
        return '#900C3F';
    case magnitude > 3:
        return '#C70039';
    case magnitude > 2:
        return '#FF5733';
    case magnitude > 1:
       return '#FFC300';
    default:
        return '#DAF7A6';
    }
}
function createFeatures(earthquakeData) {
      // Create a GeoJSON layer containing the features array on the earthquakeData object
      // Run the onEachFeature function once for each piece of data in the array
 
      var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(quakes, points) {
            return L.circleMarker(points, {
                radius: (quakes.properties.mag) * 8,                
            });
        },

        style: function(quakes, points) {
            return {opacity: 1,
                    fillColor: magColor(quakes.properties.mag),
                    color: 'black',
                    stroke: true,
                    weight: 0.2
            }
        },        
 
        onEachFeature: function (quakes, points) {
            points.bindPopup("<h3>" + quakes.properties.place + " | Magnitude " + quakes.properties.mag +
              "</h3><hr><p>" + new Date(quakes.properties.time) + "</p>");
          }
      });
    
      // Sending our earthquakes layer to the createMap function
      createMap(earthquakes);
    }

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend')
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#DAF7A6",
        "#FFC300",
        "#FF5733",
        "#C70039",
        "#900C3F",
        "#581845"
        ];
      for (var i=0; i < grades.length; i++)  {
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i>" +
            grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + "<br>" : '+');
        }
        return div;
      return div
    };
    legend.addTo(myMap);

    }
    
