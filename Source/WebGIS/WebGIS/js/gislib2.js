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
//var mapServiceUrl="http://192.168.1.100:6080/arcgis/rest/services/USA/MapServer"; //地图URL
//var shiplayerurl="http://192.168.1.100:6080/arcgis/rest/services/USA/MapServer/0"; //点图层URL

var mapServiceUrl = "http://liyafei-server:6080/arcgis/rest/services/USA/MapServer"; //地图URL
var shiplayerurl = "http://liyafei-server:6080/arcgis/rest/services/USA/MapServer/0"; //点图层URL

function InitMap() {
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
    map = new esri.Map("foot", {
        slider: true,
        sliderPosition: "top-left", //bottom-left //top-right
        sliderStyle: "small", //large small
        logo: false //,
        //zoom: 6,
        //minZoom: 2
    });
    
    map.addLayer(layer); //将地图加入到地图中\

    var gLayer = new esri.layers.GraphicsLayer("gLayer");
    map.addLayer(gLayer);

    var bigstyle = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              18, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([256, 25, 23, 0.5]),
                6
              ),
              new esri.Color([233, 36, 32, 0.9])); // .setOffset(0, 15);

    //执行地图查询
    function searchMap() {
        //实例化QueryTask
        var queryTask = new esri.tasks.QueryTask(shiplayerurl);
        //查询参数
        var query = new esri.tasks.Query();
        //需要返回Geometry
        query.returnGeometry = true;
        //需要返回的字段
        query.outFields = ["FID", "Id", "Name", "Warship_Na", "Battle_Nam"];
        //查询条件
        query.where = "1=1";

        //进行查询，完成后调用showResults方法
        queryTask.execute(query, showResults);
    }

    //显示findTask的结果
    function showResults(results) {
        //清楚上一次的高亮显示
        gLayer.clear();

        var shipn = unescape(GetQueryString('id'));
        //查询军舰相关信息
        //查询
        $.ajax({
            url: "QueryState.ashx",
            type: "Post",
            async: false,
            data: "ShipName=" + escape(shipn), //"1=1",
            success: function (data) {
                //alert(data);
                //alert(data.length);
                var arr = eval(data);
                //alert(arr.length);
                if (arr && arr.length > 0) {
                    //$("#rstable").innerHTML = "cccccc";
                    for (var i = 0; i < results.features.length; i++) {
                        var graphic = results.features[i];

                        var bfind = false;
                        for(var m=0;m<arr.length;m++)
                        {
                            if (arr[m] == graphic.attributes.Name)
                            {
                                bfind = true;
                                break;
                            }
                        }

                        if (bfind)
                        {
                            //设置显示样式
                            graphic.setSymbol(bigstyle);
                            //添加到graphics进行高亮显示
                            gLayer.add(graphic);
                        }
                    }

                }
                else {
                    //不处理
                }
                return;
            },
            error: function (d) {
                if (d.status == 500) {
                    console.log("查询相关州失败！");
                }
            }
        });
    }

    searchMap();
    
    //鼠标划过
    //var shiplayer = new esri.layers.FeatureLayer(shiplayerurl, {
    //      mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
    //      outFields: ["Name", "Warship_Na", "Battle_Nam"]
    //    });
    //shiplayer.setDefinitionExpression("1=1");
    
    //var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
    //markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
    //markerSymbol.setColor(new esri.Color("#00FFFF"));
    
    //shiplayer.setRenderer(new esri.renderer.SimpleRenderer(markerSymbol));
    //map.addLayer(shiplayer);
    
    require([
        "esri/map", "esri/layers/FeatureLayer",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", 
        "esri/renderers/SimpleRenderer", "esri/graphic", "esri/lang",
        "esri/Color", "dojo/number", "dojo/dom-style", 
        "dijit/TooltipDialog", "dijit/popup", "dojo/on", "dojo/dom", "dojo/domReady!"
      ], function(
        Map, FeatureLayer,
        SimpleFillSymbol, SimpleLineSymbol,
        SimpleRenderer, Graphic, esriLang,
        Color, number, domStyle, 
        TooltipDialog, dijitPopup,on,dom
      ) {
          
          dialog = new TooltipDialog({
            id: "tooltipDialog",
            style: "position: absolute; width: 250px; font: normal normal normal 10pt Helvetica;z-index:100"
            });
            dialog.startup();
            
            map.on("load", function(){
                map.graphics.enableMouseEvents();
                //map.graphics.on("mouse-out", closeDialog);
            });
        
            gLayer.on("mouse-over", function (evt) {
                closeDialog();
                //alert('${Warship_Na}');
                var t = "<b>${Name}</b><hr><b>州名: </b>${Name}<br>"
                +"<b>军舰: </b>${Warship_Na}<br>"
                + "<b>战争: </b>${Battle_Nam}<br>";
    
                var content = esriLang.substitute(evt.graphic.attributes, t);

                //alert(evt.graphic.attributes.Name);

                var mycontent = "<b>" + evt.graphic.attributes.Name + "</b><hr><b>州名: </b>" + evt.graphic.attributes.Name + "<br>"
            + "<b>军舰: </b>"

                var warshipname = evt.graphic.attributes.Warship_Na;
                //warshipname = warshipname.replace(" ", "、") //"
                //warshipname = warshipname.replace(" ", "、") //"
                //warshipname = warshipname.replace("↵", "、") //"
                //warshipname = warshipname.replace(",", "、") //"
                var strs = new Array();
                warshipname = warshipname.replace(' ', '|');
                warshipname = warshipname.replace('、', '|');
                warshipname = warshipname.replace('↵', '|');
                strs = warshipname.split("|"); //字符分割 
                for (var i = 0; i < strs.length ; i++) {
                    mycontent += ' <a href="showship.html?id=' + escape(strs[i]) + '" target="_blank">' + strs[i] + '</a>';
                }
                mycontent += "<br>";
                mycontent += "<b>战争: </b>";
                var warname = evt.graphic.attributes.Battle_Nam;
                warname = warname.replace(' ', '|');
                warname = warname.replace('、', '|');
                warname = warname.replace('↵', '|');
                var strs2 = new Array();
                strs2 = warname.split("|"); //字符分割 
                for (var i = 0; i < strs2.length ; i++) {
                    mycontent += ' <a href="showar.html?id=' + strs2[i] + '" target="_blank">' + strs2[i] + '</a>';
                }
                mycontent += "<br>";

                //var highlightGraphic = new Graphic(evt.graphic.geometry,markerSymbol);
                //map.graphics.add(highlightGraphic);
            
                dialog.setContent(mycontent); //content
    
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

              on(dom.byId("btKeySearch"), "click", function () {

                  var words = $("#keywords").val();
                  var parm = " 舰名 like '%" + words + "%' or 编号 like '%" + words + "%' or 所属级别 like '%" + words + "%' or 战舰类型 like '%" + words + "%' or 所属国家 like '%" + words + "%' or 战舰简介 like '%" + words + "%' or convert(varchar(4),YEAR(服役时间)) like '%" + words+"%'";
                  window.open('result.html?data=' + escape(parm));
                  /*
                  //模糊查询
                  $.ajax({
                      url: "QueryShip.ashx",
                      type: "Post",
                      async: false,
                      data: parm, //"1=1",
                      success: function (data) {
                          alert(data);
                      },
                      error: function (d) {
                          if (d.status == 500) {
                              console.log("查询失败！");
                          }
                      }
                  });
                  */
              });

              on(dom.byId("btMuiltSearch"), "click", function () {
                  //多条件查询
                  var where = " 1=1";
                  var bianhao = $("#selbianhao").val();
                  if (bianhao == "全部") {
                      bianhao = "%";
                  }
                  else {
                      where += " and 编号 = '" + bianhao + "'";
                  }
                  var leixing = $("#sleixing").val();
                  if (leixing == "全部") {
                      leixing = "%";
                  }
                  else {
                      where += " and 战舰类型 = '" + leixing + "'";
                  }
                  var jibie = $("#sjibie").val();
                  if (jibie == "全部") {
                      jibie = "%";
                  }
                  else {
                      where += " and 所属级别 = '" + jibie + "'";
                  }
                  var nianfen = $("#snianfen").val();
                  if (nianfen == "全部") {
                      nianfen = "%";
                  }
                  else {
                      where += " and convert(varchar(4),YEAR(服役时间)) = '" + nianfen + "'";
                  }
                  //var parm = " 编号 like '%" + bianhao + "%' and 所属级别 like '%" + jibie + "%' and 战舰类型 like '%" + leixing + "%' and convert(varchar(4),YEAR(服役时间)) like '%" + nianfen + "%'";
              
                  window.open('result.html?data=' + where); //escape(parm)

                  /*
                  //模糊查询
                  $.ajax({
                      url: "QueryShip.ashx",
                      type: "Post",
                      async: false,
                      data: parm, //"1=1",
                      success: function (data) {
                          alert(data);
                      },
                      error: function (d) {
                          if (d.status == 500) {
                              console.log("查询失败！");
                          }
                      }
                  });
                  */
              });
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