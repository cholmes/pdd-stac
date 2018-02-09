import "ol/ol.css";
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import sync from "ol-hashed";
import proj from "ol/proj";
import hashed from 'hashed';

import "../styles/map.scss";
//There's probably some netter way to do both this imports, and I'm not sure if it's even really getting in.
//import "../styles/ie10-viewport-bug-workaround.css";

var labels = new TileLayer({
  title: "Labels",
  source: new XYZ({
    url: "https://{1-4}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
  })
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "https://{1-4}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
      })
    }),

    new TileLayer({
      title: "Landsat Scene",
      type: "base",
      source: new XYZ({
        url: "https://tiles{0-3}.planet.com/v1/experimental/tiles/PSScene4Band/20170831_172754_101c/{z}/{x}/{y}.png?api_key=86838cd60d364ceab08d59cd9b56d259"
      })
    }),
    labels
  ],
  view: new View({
    //center: [0, 0],
    //zoom: 2
    center: proj.transform([-95.9119, 29.5551], "EPSG:4326", "EPSG:3857"),
    zoom: 11.5
  })
});

var labelCheck = document.getElementById("labels");
labelCheck.addEventListener("click", function() {
  labels.setVisible(labelCheck.checked);
});


document.getElementById("expand-button").addEventListener("click", function() {
  console.log("map", map);



  const container = document.getElementById("map");

  if (container.style.position == "fixed") {
    contract(container);
    update({
      fs: 0
    });
  } else {
    expand(container);
    update({
      fs: 1
    });
  }

  map.updateSize();


});

function expand(container) {
  const height = window.innerHeight;
  const width = window.innerWidth;
  container.style.display = "block";
  container.style.position = "fixed";
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  map.updateSize();
}

function contract(container) {
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
}


var state = {
  fs: 0
};

function listener(newState) {
  console.log("listener called");
  console.log("state is " + newState + " and fs is " + newState.fs);
  if ('fs' in newState) {
    //if (state.fs != 0) {}
    var fullScreen = newState.fs;
    if (fullScreen != 0) {
      expand(document.getElementById("map"));
    }
  }

}

// // register a state provider
var update = hashed.register(state, listener);


//TODO: Figure out handlebars helper functions for nicer formatting, like pulling out thumbnail, etc.
// Handlebars.registerHelper('link', function(object) {
//   var url = Handlebars.escapeExpression(object.href),
//       text = Handlebars.escapeExpression(object.rel);

//   return new Handlebars.SafeString(
//     "<a href='" + url + "'>" + text + "</a>"
//   );
// });

sync(map);