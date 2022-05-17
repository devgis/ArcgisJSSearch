/* global dojo */
//引用dojo
dojo.require("esri/map");
dojo.require("dojo/_base/lang");
dojo.require("dojo/json");
dojo.require("esri/config");
dojo.require("esri/tasks/GeometryService");
dojo.require("esri/tasks/AreasAndLengthsParameters");
dojo.require("dojo/dom-class");
dojo.require("esri/dijit/Popup");
dojo.require("esri/dijit/PopupTemplate");
dojo.require("esri/toolbars/draw");
dojo.require("esri/symbols/SimpleFillSymbol");
dojo.require("esri/geometry/Point");
dojo.require("dojo/on");
dojo.require("dojo/dom");
dojo.require("dojo/_base/Color");
dojo.require("esri/dijit/Scalebar");
dojo.require("esri/dijit/InfoWindowLite");
dojo.require("esri/dijit/InfoWindow");
dojo.require("dojo/dom-construct");
dojo.require("esri/symbols/SimpleMarkerSymbol");
dojo.require("esri/symbols/PictureMarkerSymbol");
dojo.require("esri/symbols/SimpleLineSymbol");
dojo.require("esri/graphic");
dojo.require("dojo/dom-style");
dojo.require("dojo/query");
dojo.require("esri/layers/GraphicsLayer");
dojo.require("dojox/widget/ColorPicker");
dojo.require("esri/layers/CSVLayer");
dojo.require("esri/Color");
dojo.require("esri/renderers/SimpleRenderer");
dojo.require("esri/InfoTemplate");
dojo.require("esri/urlUtils");
dojo.require("esri/geometry/scaleUtils");
dojo.require("esri/dijit/HomeButton");
dojo.require("esri/tasks/RouteTask");
dojo.require("esri/toolbars/navigation");
dojo.require("esri/tasks/RouteParameters");
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/InfoTemplate");
dojo.require("dijit/Menu");
dojo.require("dijit/MenuItem");
dojo.require("esri/geometry/jsonUtils");
var geometryService;
var map;

//此处需要配置
var mapServiceUrl="http://192.168.1.100:6080/arcgis/rest/services/USA/MapServer"; //地图URL
var shiplayerurl="http://192.168.1.100:6080/arcgis/rest/services/USA/MapServer/0"; //点图层URL

function InitMap() {
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
    map = new esri.Map("map", {
        slider: true,
        sliderPosition: "top-left", //bottom-left //top-right
        sliderStyle: "small", //large small
        logo: false //,
        //zoom: 6,
        //minZoom: 2
    });
    map.addLayer(layer); //将地图加入到地图中
    
    //鼠标划过
    var shiplayer = new esri.layers.FeatureLayer(shiplayerurl, {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["Name", "Warship_Na", "Battle_Nam"]
        });
    shiplayer.setDefinitionExpression("1=1");
    
    var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
    markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
    markerSymbol.setColor(new esri.Color("#00FFFF"));
    
    shiplayer.setRenderer(new esri.renderer.SimpleRenderer(markerSymbol));
    map.addLayer(shiplayer);
    
    
    
    require([
        "esri/map", "esri/layers/FeatureLayer",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", 
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/number", "dojo/dom-style", 
        "dijit/TooltipDialog", "dijit/popup", "dojo/domReady!"
      ], function(
        Map, FeatureLayer,
        SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle, 
        TooltipDialog, dijitPopup
      ) {
          dialog = new TooltipDialog({
            id: "tooltipDialog",
            style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
            });
            dialog.startup();
            
            map.on("load", function(){
                map.graphics.enableMouseEvents();
                map.graphics.on("mouse-out", closeDialog);
            });
        
          shiplayer.on("mouse-over", function(evt){
            var t = "<b>${Name}</b><hr><b>州名: </b>${Name}<br>"
            +"<b>军舰: </b>${Warship_Na}<br>"
            + "<b>战争: </b>${Battle_Nam}<br>";
    
            var content = esriLang.substitute(evt.graphic.attributes,t);
            var highlightGraphic = new Graphic(evt.graphic.geometry,markerSymbol);
            map.graphics.add(highlightGraphic);
            
            dialog.setContent(content);
    
            domStyle.set(dialog.domNode, "opacity", 0.85);
            dijitPopup.open({
            popup: dialog, 
            x: evt.pageX,
            y: evt.pageY
            });
          });
          function closeDialog() {
            map.graphics.clear();
            dijitPopup.close(dialog);
            }
        });
    
        
    
    
    
    /*
     on(dom.byId("bayonet"), "click", function () {
            //ShowDistanceConfig();
            selectType = "bayonet";
            if (selectWindo)
            {
                selectWindo.close();
            }
            ShowSelectWindo("卡口选择");
        });
        */
        
    
    
    //模糊查询
    
    //多条件查询
        
}
dojo.addOnLoad(InitMap);