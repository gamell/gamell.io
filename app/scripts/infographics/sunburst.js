(function(window, d3){

  // Chart module

  var chart = (function(d3){
    var module = {};

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    STATIC_DATES = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues([2004, 2007, 2010, 2013])
        .tickFormat(d3.format(".0f"))
        .tickPadding(10)
        .tickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(10)
        .tickValues([20, 40, 60, 80, 100])
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.p); });

    var svg = d3.select(".skills-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function calculateChartData(input){
      var data = [];
      var i = 0;
      input._proficiency.forEach(function(d){
        if(i<=STATIC_DATES.length){
          data.push({p: d, date: STATIC_DATES[i] });
          i++;
        }
      });

      return data;
    }

    function renderChart(data, input){

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0,100]);

      svg.append("g")
          .attr("class", "x-axis axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("x", 450)
          .attr("y", -8)
          .style("text-anchor", "end")
          .text("Time →");

      svg.append("g")
          .attr("class", "y-axis axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".91em")
          .style("text-anchor", "end")
          .text("Proficiency →");

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("id", "skills-chart-line")
          .attr("d", line)
          .attr("stroke", function(d){ return input._color; });
    }

    function refreshChart(input){
      var data = calculateChartData(input);
      var chartLine = d3.select("#skills-chart-line");
      if(chartLine[0][0] === null){
        renderChart(data, input);
      } else {
        chartLine.datum(data)
          .attr("d", line)
          .attr("stroke", function(d){ return input._color; });
      }
    }

    module.refreshChart = refreshChart;
    
    return module;

  })(d3);

  // sunburst code

  var w = 580,
      h = 580,
      r = Math.min(w, h) / Math.PI - 25,
      color = categoriesColors,
      //color = d3.scale.category20c(),
      b = { w: 116, h: 30, s: 3, t: 7 }, // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      totalSize;

  var vis = d3.select(".skills-sunburst").append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + (w / 2) + "," + h / 2 + ")");

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", r)
      .style("opacity", 0);

  var meanCombineArrays = function(arr1, arr2){ // function to combine two arrays
    var res = [];
    var length = arr1.length;
    if(arr1.length !== arr2.length) {
      res = (arr1.length>arr2.length) ? arr1 : arr2;
    } else {
      for(var i=0;i<length;i++){
        //var value = (arr1[i] < 60 || arr2[i] < 60) ? Math.max(arr1[i], arr2[i]) : (arr1[i]+arr2[i])/2;//Math.max(arr1[i],arr2[i]);
        var value = Math.max(arr1[i], arr2[i]) - Math.abs(arr1[i]-arr2[i])/8;
        res.push(value);
      }
    }
    return res;
  }

  var caluclateProficiency = function(o){ // recursive function to calculate the mean Proficiency level for non-leaf nodes
    if(o instanceof Array){ // base case
      return o;
    } else { // recursive
      var res = [];
      $.each(o, function(i, elem){ 
        res = meanCombineArrays(caluclateProficiency(elem), res);
      });
      return res;
    }
  }

  var partition = d3.layout.partition()
      .sort(null) /*function(a, b) { return d3.ascending(a.name, b.name); }*/
      .size([2 * Math.PI, r ])
      .children(function(d) { 
        if(d.value instanceof Array){ // leaf node
          d._proficiency = d.value;
          return d3.entries([d.value[d.value.length-1]]);
        } else {
          d._proficiency = caluclateProficiency(d.value);
          return isNaN(d.value) ? d3.entries(d.value) : null;  
        }
      })
      .value(function(d) { return d.value; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })//return d.x + d.dx; })
      .innerRadius(function(d) { return r / Math.PI * d.depth; })//return Math.sqrt(d.y); })
      .outerRadius(function(d) { return r / Math.PI * (d.depth + 1) - 1; })//return Math.sqrt(d.y + d.dy); });

  d3.json("/scripts/skills.json", function(json) {

    // init breadcrumb
    initializeBreadcrumbTrail();

    var g = vis.data(d3.entries(json)).selectAll("g")
      .data(partition)
      .enter().append("svg:g")
      .attr("display", function(d) { return d.depth ? null : "none"; }); // hide inner ring

    g.append("svg:path")
        .attr("d", arc)
        .attr("stroke", "#fff")
        .attr("fill", function(d) { d._color = color(d); return d._color; })
        .attr("fill-rule", "evenodd")
        .attr("display", function(d) { 
          return d.children ? null : "none"; })
        .on("mouseover", mouseover);
      
    g.append("svg:text")
        .attr("transform", function(d) { 
          var angle = (d.x + d.dx / 2 - Math.PI / 2) / Math.PI * 180;
          return "rotate(" + angle + ")"; 
        })
        .attr("x", function(d) { return r / Math.PI * d.depth })
        .attr("dx", "6") // margin
        .attr("dy", ".1em") // vertical-align
        .text(function(d) { return d.key; })
        .attr("display", function(d) { return d.children ? null : "none"; })
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select(".skills-sunburst").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = g.node().__data__.value;

    var center = vis.append("circle")
        .attr("r", r / Math.PI)
        .attr("opacity", 0);

    // we initialize the chart without any value
    initChart();

  });

  function initChart(){
    var initialData = {
      _proficiency: [0,0,0,0,0,0,0,0,0,0],
      children: null,
      value:0,
      key: "",
      depth: 1
    };
    chart.refreshChart(initialData);    
  }

  function mouseover(d) {

    chart.refreshChart(d);

    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray);

    // Fade all the segments.
    d3.selectAll(".skills-sunburst path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node) {return (sequenceArray.indexOf(node) >= 0);})
        .style("opacity", 1);
  }

  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .each("end", function() {
                d3.select(this).on("mouseover", mouseover);
              });
  }

  // Given a node in a partition layout, return an array of all of its ancestor
  // nodes, highest first, but excluding the root.
  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#skills-chart-breadcrumb").append("svg:svg")
        .attr("width", 500)
        .attr("height", 50)
        .attr("class", "trail");
  }

  // Generate a string that describes the points of a breadcrumb polygon.
  function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
  }

  // Update the breadcrumb trail to show the current sequence and percentage.
  function updateBreadcrumbs(nodeArray) {

    var baseColor = nodeArray[nodeArray.length-1]._color;
    var breadCrumbLength = nodeArray.length;

    // Data join; key function combines name and depth (= position in sequence).
    var g = d3.select("#skills-chart-breadcrumb .trail")
        .selectAll("g")
        .remove()

    g = d3.select("#skills-chart-breadcrumb .trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.key + d.depth; });

    // Add breadcrumb and label for entering nodes.
    var entering = g.enter().append("svg:g");

    function breadcrumbColor(d){
      return d._color;
      //return d3.rgb(baseColor).darker(breadCrumbLength-depth);
      //var colors = ["#007AFF", "#3395FF", "#66AFFF", "#99CAFF"];
      //return colors[depth-1 % 4];  
    };

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function(d) { 
            //d._backgroundColor = breadcrumbColor(d); 
            return d._color;
        });

    entering.append("svg:text")
        .attr("x", ((b.w) / 2) + 2 )
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("class", "breadcumb-text")
        .style("fill", function(d) { return brightness(d3.rgb(d._color)) < 150 ? "#fff" : "#000"; })
        .text(function(d) { return d.key; });

    // Set position for entering and updating nodes.
    g.attr("transform", function(d, i) {
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select(".trail")
        .style("visibility", "");

  }

  function brightness(rgb) {
    return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
  }

  var baseColor = 0;

  function categoriesColors(d){
    var BASE_COLORS = [  
        "#3182bd", // blues
        "#C86EDF", // purples
        "#FF9500", // oranges
        "#52BE65", // greens
        "#FF4981", // pinks
    ];
    var sameLevelRange = [-0.1, -0.05, 0];
    if(d.depth == 1){
      var color = BASE_COLORS[baseColor % 5];
      baseColor ++;
      return color;
    } else if(d.depth > 1){
      var sameLevelDifference = sameLevelRange[d.value%3]; //Math.abs(hashCode(d.key))
      return d3.rgb(d.parent._color).brighter((d.depth*0.2)+(sameLevelDifference*d.depth));
    }
  };

  function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

})(window, d3);