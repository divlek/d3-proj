/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    3.2 - Linear scales
 */

const margins = { left: 100, right: 10, top: 10, bottom: 150 };

const height = 400 - margins.top - margins.bottom;
const width = 600 - margins.left - margins.right;

var svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margins.left + margins.right)
  .attr('height', height + margins.top + margins.bottom);

var g = svg
  .append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

d3.json('data/buildings.json').then(function (data) {
  console.log(data);

  data.forEach((d) => {
    d.height = +d.height;
  });

  var x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, width])
    .paddingInner(0.4)
    .paddingOuter(0.2);

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.height)])
    .range([height, 0]); // Changed to reverse the y bars

  // X Label
  g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', width / 2)
    .attr('y', height + 140)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text("The word's tallest buildings");

  // Y Label
  g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(height / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Height (m)');

  var xaxisCall = d3.axisBottom(x);
  var yaxisCall = d3
    .axisLeft(y)
    .ticks(3)
    .tickFormat((d) => d + ' m');

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + 0 + ',' + height + ')')
    .call(xaxisCall)
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('x', -5)
    .attr('y', 10);

  g.append('g').attr('class', 'y axis').call(yaxisCall);

  var rects = g
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', (d) => y(d.height))
    .attr('x', (d) => {
      return x(d.name);
    })
    .attr('width', 40)
    .attr('height', function (d) {
      return height - y(d.height);
    })
    .attr('fill', function (d) {
      return 'grey';
    });
});
