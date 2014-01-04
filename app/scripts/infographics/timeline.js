// not used in the first version

(function(window, d3){
	var lanes = ["Education", "Professional Experience"],
		laneLength = lanes.length,
		items = [{"lane": 0, "id": "High School", "start": 2000, "end": 2004},
				{"lane": 0, "id": "Computer Engineering Degree", "start": 2004, "end": 2009},
				{"lane": 1, "id": "Banc Sabadell", "start": 2007, "end": 2008},
				{"lane": 1, "id": "Safelayer", "start": 2008, "end": 2010}]
		timeBegin = 2000,
		timeEnd = 2014;

	var m = [20, 5, 15, 150], //top right bottom left
		w = 1200 - m[1] - m[3],
		h = 200 - m[0] - m[2],
		miniHeight = laneLength * 12 + 50,
		mainHeight = h - miniHeight - 50;

	//scales
	var x = d3.scale.linear()
			.domain([timeBegin, timeEnd])
			.range([0, w]);
	var x1 = d3.scale.linear()
			.range([0, w]);
	var y1 = d3.scale.linear()
			.domain([0, laneLength])
			.range([0, mainHeight]);
	var y2 = d3.scale.linear()
			.domain([0, laneLength])
			.range([0, miniHeight]);

	var chart = d3.select(".timeline")
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.attr("class", "chart");
	
	chart.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", w)
		.attr("height", mainHeight);

	var main = chart.append("g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
				.attr("width", w)
				.attr("height", mainHeight)
				.attr("class", "main");

	var mini = chart.append("g")
				.attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
				.attr("width", w)
				.attr("height", miniHeight)
				.attr("class", "mini");
	
	//main lanes and texts
	main.append("g").selectAll(".laneLines")
		.data(items)
		.enter().append("line")
		.attr("x1", m[1])
		.attr("y1", function(d) {return y1(d.lane);})
		.attr("x2", w)
		.attr("y2", function(d) {return y1(d.lane);})
		.attr("stroke", "lightgray")

	main.append("g").selectAll(".laneText")
		.data(lanes)
		.enter().append("text")
		.text(function(d) {return d;})
		.attr("x", -m[1])
		.attr("y", function(d, i) {return y1(i + .5);})
		.attr("dy", ".5ex")
		.attr("text-anchor", "end")
		.attr("class", "laneText");
	
	//mini lanes and texts
	mini.append("g").selectAll(".laneLines")
		.data(items)
		.enter().append("line")
		.attr("x1", m[1])
		.attr("y1", function(d) {return y2(d.lane);})
		.attr("x2", w)
		.attr("y2", function(d) {return y2(d.lane);})
		.attr("stroke", "lightgray");

	mini.append("g").selectAll(".laneText")
		.data(lanes)
		.enter().append("text")
		.text(function(d) {return d;})
		.attr("x", -m[1])
		.attr("y", function(d, i) {return y2(i + .5);})
		.attr("dy", ".5ex")
		.attr("text-anchor", "end")
		.attr("class", "laneText");

	var itemRects = main.append("g")
						.attr("clip-path", "url(#clip)");
	
	//mini item rects
	mini.append("g").selectAll("miniItems")
		.data(items)
		.enter().append("rect")
		.attr("class", function(d) {return "miniItem" + d.lane;})
		.attr("x", function(d) {return x(d.start);})
		.attr("y", function(d) {return y2(d.lane + .5) - 5;})
		.attr("width", function(d) {return x(d.end - d.start);})
		.attr("height", 10);

	//mini labels
	mini.append("g").selectAll(".miniLabels")
		.data(items)
		.enter().append("text")
		.text(function(d) {return d.id;})
		.attr("x", function(d) {return x(d.start);})
		.attr("y", function(d) {return y2(d.lane + .5);})
		.attr("dy", ".5ex");

	//brush
	var brush = d3.svg.brush()
						.x(x)
						.on("brush", display);

	mini.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", 1)
		.attr("height", miniHeight - 1);

	display();
	
	function display() {
		var rects, labels,
			minExtent = brush.extent()[0],
			maxExtent = brush.extent()[1],
			visItems = items.filter(function(d) {return d.start < maxExtent && d.end > minExtent;});

		mini.select(".brush")
			.call(brush.extent([minExtent, maxExtent]));

		x1.domain([minExtent, maxExtent]);

		//update main item rects
		rects = itemRects.selectAll("rect")
		        .data(visItems, function(d) { return d.id; })
			.attr("x", function(d) {return x1(d.start);})
			.attr("width", function(d) {return x1(d.end) - x1(d.start);});
		
		rects.enter().append("rect")
			.attr("class", function(d) {return "miniItem" + d.lane;})
			.attr("x", function(d) {return x1(d.start);})
			.attr("y", function(d) {return y1(d.lane) + 10;})
			.attr("width", function(d) {return x1(d.end) - x1(d.start);})
			.attr("height", function(d) {return .8 * y1(1);});

		rects.exit().remove();

		//update the item labels
		labels = itemRects.selectAll("text")
			.data(visItems, function (d) { return d.id; })
			.attr("x", function(d) {return x1(Math.max(d.start, minExtent) + 2);});

		labels.enter().append("text")
			.text(function(d) {return d.id;})
			.attr("x", function(d) {return x1(Math.max(d.start, minExtent));})
			.attr("y", function(d) {return y1(d.lane + .5);})
			.attr("text-anchor", "start");

		labels.exit().remove();

	}
	
})(window, d3);