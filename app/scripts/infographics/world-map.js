// World Map
var worldMap = (function(window, d3, queue, topojson){

  var module = {};

  d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

  var width = 1000,
      height = 700;

  var proj = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .scale(300);

  var sky = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .scale(400);

  var path = d3.geo.path().projection(proj).pointRadius(2);

  var swoosh = d3.svg.line()
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] })
        .interpolate("cardinal")
        .tension(.0);

  var links = [],
      arcLines = [];

  var svg = d3.select(".world-map").append("svg")
              .attr("width", width)
              .attr("height", height)
              .on("mousedown", mousedown);

  var places = {"type": "FeatureCollection","features": [
    { "type": "Feature", "properties": { "name": "Barcelona", "nameascii": "Barcelona", "adm0name": "Spain", "adm0_a3": "Spain", "adm1name": "Catalunya", "iso_a2": "ES", "note": null, "latitude": 40.4165000, "longitude": 2.1589900}, "geometry": { "type": "Point", "coordinates": [ 2.1589900, 41.3887900 ] } },
    { "type": "Feature", "properties": { "name": "Madrid", "nameascii": "Madrid", "adm0name": "Spain", "adm0_a3": "Spain", "adm1name": "Madrid", "iso_a2": "ES", "note": null, "latitude": 41.3887900, "longitude": -3.7025600}, "geometry": { "type": "Point", "coordinates": [ -3.7025600, 40.4165000 ] } },
    { "type": "Feature", "properties": { "name": "Singapore", "nameascii": "Singapore", "adm0name": "Singapore", "adm0_a3": "Singapore", "adm1name": "Singapore", "iso_a2": "SG", "note": null, "latitude": 1.2896700, "longitude": 103.8500700}, "geometry": { "type": "Point", "coordinates": [ 103.8500700, 1.2896700 ] } },
    { "type": "Feature", "properties": { "name": "San Francisco", "nameascii": "San Francisco", "adm0name": "San Francisco", "adm0_a3": "United States", "adm1name": "California", "iso_a2": "US", "note": null, "latitude": 37.7749300, "longitude": -122.4194200}, "geometry": { "type": "Point", "coordinates": [ -122.4194200, 37.7749300 ] } }
  ]};

  queue().defer(d3.json, "/scripts/world-110m.json").await(ready);

  function ready(error, world) {
    var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#fff");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#ddd");

    var globe_highlight = svg.append("defs").append("radialGradient")
          .attr("id", "globe_highlight")
          .attr("cx", "75%")
          .attr("cy", "25%");
        globe_highlight.append("stop")
          .attr("offset", "5%").attr("stop-color", "#fff")
          .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
          .attr("offset", "100%").attr("stop-color", "#bbb")
          .attr("stop-opacity","0.2");

    var globe_shading = svg.append("defs").append("radialGradient")
          .attr("id", "globe_shading")
          .attr("cx", "55%")
          .attr("cy", "45%");
        globe_shading.append("stop")
          .attr("offset","30%").attr("stop-color", "#fff")
          .attr("stop-opacity","0")
        globe_shading.append("stop")
          .attr("offset","100%").attr("stop-color", "#505962")
          .attr("stop-opacity","0.3")
    
    svg.append("path")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land noclicks")
      .attr("d", path);

    svg.append("circle")
      .attr("cx", width / 2).attr("cy", height / 2)
      .attr("r", proj.scale())
      .attr("class","noclicks")
      .style("fill", "url(#globe_shading)");

    svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
      .enter().append("path")
        .attr("class", "point")
        .attr("d", path);

    svg.append("g").attr("class","labels")
        .selectAll("text").data(places.features)
      .enter().append("text")
      .attr("class", "label")
      .text(function(d) { return d.properties.name })

    links = [{
      source: places.features[0].geometry.coordinates,
      target: places.features[1].geometry.coordinates
    },{
      source: places.features[1].geometry.coordinates,
      target: places.features[2].geometry.coordinates 
    },{
      source: places.features[2].geometry.coordinates,
      target: places.features[3].geometry.coordinates 
    }];

    // build geoJSON features from links array
    links.forEach(function(e,i,a) {
      var feature =   { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
      arcLines.push(feature)
    })

    svg.append("g").attr("class","arcs")
      .selectAll("path").data(arcLines)
      .enter().append("path")
        .attr("class","arc")
        .attr("d",path)

    svg.append("g").attr("class","flyers")
      .selectAll("path").data(links)
      .enter().append("path")
      .attr("class","flyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })

    
    refresh();
    position_labels();
  }

  function flying_arc(pts) {
    var source = pts.source,
        target = pts.target;

    var mid = location_along_arc(source, target, .5);
    var result = [ proj(source),
                   sky(mid),
                   proj(target) ]
    return result;
  }

  function position_labels() {
    var centerPos = proj.invert([width/2,height/2]);

    var arc = d3.geo.greatArc();

    svg.selectAll(".label")
      .attr("text-anchor",function(d) {
        var x = proj(d.geometry.coordinates)[0];
        return x < width/2-20 ? "end" :
               x < width/2+20 ? "middle" :
               "start"
      })
      .attr("transform", function(d) {
        var loc = proj(d.geometry.coordinates),
          x = loc[0],
          y = loc[1];
        var offsetx = x < width/2 ? -15 : 15;
        var offsety = -2;
        if (d.properties.name == "Madrid"){
          var offsety = +20;
        } else if(d.properties.name == "Barcelona"){
          var offsety = -15; 
        }
        return "translate(" + (x+offsetx) + "," + (y+offsety) + ")"
      })
      .style("display",function(d) {
        var d = arc.distance({source: d.geometry.coordinates, target: centerPos});
        return (d > 1.57) ? 'none' : 'inline';
      })
  }

  function refresh() {
    svg.selectAll("#resume-infographic-world-map .land").attr("d", path);
    svg.selectAll("#resume-infographic-world-map .point").attr("d", path);
    
    svg.selectAll("#resume-infographic-world-map .arc").attr("d", path)
      .attr("opacity", function(d) {
          return fade_at_edge(d)
      })

    svg.selectAll(".world-map .flyer")
      .attr("d", function(d) { return swoosh(flying_arc(d)) })
      .attr("opacity", function(d) {
        return fade_at_edge(d)
      }) 
  }

  function fade_at_edge(d) {
    var centerPos = proj.invert([width/2,height/2]),
        arc = d3.geo.greatArc(),
        start, end;
    // function is called on 2 different data structures..
    if (d.source) {
      start = d.source, 
      end = d.target;  
    }
    else {
      start = d.geometry.coordinates[0];
      end = d.geometry.coordinates[1];
    }
    
    var start_dist = 1.97 - arc.distance({source: start, target: centerPos}),
        end_dist = 1.97 - arc.distance({source: end, target: centerPos});
      
    var fade = d3.scale.linear().domain([-.1,0]).range([0,.1]) 
    var dist = start_dist < end_dist ? start_dist : end_dist; 

    return fade(dist)
  }

  function location_along_arc(start, end, loc) {
    var interpolator = d3.geo.interpolate(start,end);
    return interpolator(loc)
  }

  // modified from http://bl.ocks.org/1392560
  var m0, o0;
  function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    o0 = proj.rotate();
    d3.event.preventDefault();
  }
  function mousemove() {
    if (m0) {
      var m1 = [d3.event.pageX, d3.event.pageY]
        , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
      o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
      proj.rotate(o1);
      sky.rotate(o1);
      position_labels();
      refresh();
    }
  }
  function mouseup() {
    if (m0) {
      mousemove();
      m0 = null;
    }
  }

  function transition() {
    setInterval(function(){
      var o0 = proj.rotate();
      var o1 = [o0[0]-0.3, o0[1]];
      proj.rotate(o1);
      sky.rotate(o1);
      position_labels();
      refresh();   
    }, 60);
  };

  module.initRotation = function(){
    transition();
  };

  return module;

})(window, d3, queue, topojson);