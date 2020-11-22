/*
 *    main.js
 *    Main entry to demo app
 */

var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

var g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// Time parser for x-scale
var parseTime = d3.timeParse('%Y');
// For tooltip
var bisectDate = d3.bisector(function (d) {
  return d.year;
}).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var rScale = d3.scaleLinear().range([2, 20]);
var rScaleHtml = d3.scaleLinear().range([2, 200]);

// Axis generators
var xAxisCall = d3.axisBottom();
var yAxisCall = d3
  .axisLeft()
  .ticks(6)
  .tickFormat(function (d) {
    return parseInt(d / 1000) + 'k';
  });

// Axis groups
var xAxis = g
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')');
var yAxis = g.append('g').attr('class', 'y axis');

// Y-Axis label
yAxis
  .append('text')
  .attr('class', 'axis-title')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .style('text-anchor', 'end')
  .attr('fill', '#5D6971')
  .text('Population)');

// Line path generator
var line = d3
  .line()
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.value);
  });

d3.json('data/example.json').then(function (data) {
  // Data cleaning
  data.forEach(function (d) {
    d.year = parseTime(d.year);
    d.value = +d.value;
  });

  // Set scale domains
  x.domain(
    d3.extent(data, function (d) {
      return d.year;
    })
  );
  y.domain([
    d3.min(data, function (d) {
      return d.value;
    }) / 1.005,
    d3.max(data, function (d) {
      return d.value;
    }) * 1.005
  ]);

  rScale.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    })
  ]);

  rScaleHtml.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    })
  ]);
  // Generate axes once scales have been set
  xAxis.call(xAxisCall.scale(x));
  yAxis.call(yAxisCall.scale(y));

  // Add line to chart
  g.append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('stroke-with', '3px')
    .attr('d', line(data));

  // Add label - Uncomment block below

  var label_array = [];
  var html_label_array = [];
  var anchor_array = [];
  var html_anchor_array = [];

  var labels = svg
    .append('g')
    .classed('labels-group', true)
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .classed('label', true)
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.value) + margin.top)
    .attr('id', (d, i) => {
      label_array.push({
        x: x(d.year) + margin.left,
        y: y(d.value) + margin.top,
        name: d.value,
        width: 0.0,
        height: 0.0
      });
      anchor_array.push({
        x: x(d.year) + margin.left,
        y: y(d.value) + margin.top,
        r: rScale(d.value)
      });
      return 'textlabel-' + i;
    })
    .text(function (d, i) {
      return d.value;
    });

  var links = svg
    .selectAll('.link')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('x1', function (d) {
      return x(d.year) + margin.left;
    })
    .attr('y1', function (d) {
      return y(d.value) + margin.top;
    })
    .attr('x2', function (d) {
      return x(d.year) + margin.left;
    })
    .attr('y2', function (d) {
      return y(d.value) + margin.top;
    })
    .attr('stroke-width', 0.6)
    .attr('stroke', 'gray')
    .attr('id', function (d) {
      d.textId = 'text' + d.id;
      d.lineId = 'line' + d.id;
      return 'line' + d.id;
    });

  var index = 0;
  labels.each(function () {
    label_array[index].width = this.getBBox().width;
    label_array[index].height = this.getBBox().height;
    index += 1;
  });

  d3.labeler()
    .label(label_array)
    .anchor(anchor_array)
    .width(width)
    .height(height)
    .start(100);

  labels
    .transition()
    .duration(800)
    .attr('x', function (d, i) {
      return label_array[i].x;
    })
    .attr('y', function (d, i) {
      return label_array[i].y;
    });

  links
    .transition()
    .duration(800)
    .attr('x2', function (d, i) {
      return label_array[i].x;
    })
    .attr('y2', function (d, i) {
      return label_array[i].y;
    });

  // Add label with HTML content - Uncomment block below
  /*
  var htmlLabelsGroup = svg.append('g').classed('html-labels-group', true);

  htmlLabelsGroup
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .classed('html-label-g', true)
    .append('foreignObject')
    .classed('html-label-obj', true)
    .attr('width', 100)
    .attr('height', 50)
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.value) + margin.top)
    .attr('id', (d, i) => {
      html_label_array.push({
        x: x(d.year) + margin.left,
        y: y(d.value) + margin.top,
        name: d.value,
        width: 0.0,
        height: 0.0
      });
      html_anchor_array.push({
        x: x(d.year) + margin.left,
        y: y(d.value) + margin.top,
        r: rScaleHtml(d.value)
      });
      return 'htmltextlabel-' + i;
    })
    .append('xhtml:body')
    .style('font', "14px 'Helvetica Neue'")
    .html(
      '<div style="border: 1px solid black; background-color: pink">Hello World</div>'
    );

  var htmlLabels = htmlLabelsGroup.selectAll('.html-label-g');
  var htmlLabelObjs = htmlLabelsGroup.selectAll('.html-label-obj');

  var htmlLabelLinks = svg
    .selectAll('.html-link')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'html-link')
    .attr('x1', function (d) {
      return x(d.year) + margin.left;
    })
    .attr('y1', function (d) {
      return y(d.value) + margin.top;
    })
    .attr('x2', function (d) {
      return x(d.year) + margin.left;
    })
    .attr('y2', function (d) {
      return y(d.value) + margin.top;
    })
    .attr('stroke-width', 0.6)
    .attr('stroke', 'gray')
    .attr('id', function (d) {
      d.textId = 'text' + d.id;
      d.lineId = 'line' + d.id;
      return 'line' + d.id;
    });

  var index = 0;
  htmlLabels.each(function () {
    html_label_array[index].width = this.getBBox().width;
    html_label_array[index].height = this.getBBox().height;
    index += 1;
  });

  d3.labeler()
    .label(html_label_array)
    .anchor(html_anchor_array)
    .width(width)
    .height(height)
    .start(100);

  htmlLabelLinks
    .transition()
    .duration(800)
    .attr('x2', function (d, i) {
      return html_label_array[i].x;
    })
    .attr('y2', function (d, i) {
      return html_label_array[i].y;
    });

  htmlLabels
    .transition()
    .duration(800)
    .attr('x', function (d, i) {
      return html_label_array[i].x;
    })
    .attr('y', function (d, i) {
      return html_label_array[i].y;
    });

  htmlLabelObjs
    .transition()
    .duration(800)
    .attr('x', function (d, i) {
      return html_label_array[i].x;
    })
    .attr('y', function (d, i) {
      return html_label_array[i].y;
    });
    */
});
