import "ol/ol.css";
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import XYZ from "ol/source/xyz";
import sync from "ol-hashed";
import proj from "ol/proj";

import "../styles/map.scss";

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
        url:
          "https://tiles{0-3}.planet.com/v1/experimental/tiles/Landsat8L1G/LC80220342017251LGN00/{z}/{x}/{y}.png?api_key=86838cd60d364ceab08d59cd9b56d259"
      })
    }),
    labels
  ],
  view: new View({
    //center: [0, 0],
    //zoom: 2
    center: proj.transform([-88.10678, 37.47465], "EPSG:4326", "EPSG:3857"),
    zoom: 8
  })
});

var labelCheck = document.getElementById("labels");
labelCheck.addEventListener("click", function() {
  labels.setVisible(labelCheck.checked);
});

//TODO: Figure out a way to render this full screen.
document.getElementById("expand-map").addEventListener("click", function() {
  console.log("map", map);

  const height = window.innerHeight;
  const width = window.innerWidth;

  const container = document.getElementById("map");
  container.style.display = "block";
  container.style.position = "fixed";
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;

  map.updateSize();

  // TODO: add to hash
});

// TODO: add a "minimize map button on map after going full screen"

sync(map);
