/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

const margins = { left: 100, right: 10, top: 10, bottom: 150 };
const height = 400 - margins.top - margins.bottom;
const width = 600 - margins.left - margins.right;

var t = d3.transition().duration(750);

var g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margins.left + margins.right)
  .attr('height', height + margins.top + margins.bottom)
  .append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

var xaxisGroup = g
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(' + 0 + ',' + height + ')');

var yaxisGroup = g.append('g').attr('class', 'y axis');

var x = d3.scaleBand().range([0, width]).paddingInner(0.4).paddingOuter(0.2);

var y = d3.scaleLinear().range([height, 0]); // Changed to reverse the y bars

// X Label
g.append('text')
  .attr('class', 'x axis-label')
  .attr('x', width / 2)
  .attr('y', height + 140)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y Label
var yAxisLabel = g
  .append('text')
  .attr('class', 'y axis-label')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)');

var flag = true;
d3.json('data/revenues.json').then(function (data) {
  data.forEach((d) => {
    d.revenue = +d.revenue;
    d.profit = +d.profit;
  });

  d3.interval(() => {
    var newData = flag ? data : data.slice(1);
    flag = !flag;
    update(newData);
  }, 1000);

  update(data);
});

function update(data) {
  var value = flag ? 'revenue' : 'profit';

  var yLabelText = flag ? 'Revenue' : 'Profit';
  yAxisLabel.text(yLabelText);

  x.domain(data.map((d) => d.month));
  y.domain([0, d3.max(data, (d) => d[value])]);

  var xaxisCall = d3.axisBottom(x);
  xaxisGroup.transition(t).call(xaxisCall);

  var yaxisCall = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat((d) => '$ ' + d);
  yaxisGroup.transition(t).call(yaxisCall);

  // JOIN new data with old elements.
  var rects = g.selectAll('rect').data(data, (d) => d.month);

  // EXIT old elements not present in new data.
  rects
    .exit()
    .attr('fill', 'red')
    .transition(t)
    .attr('y', y(0))
    .attr('height', 0)
    .remove();

  // UPDATE old elements present in new data.
  /*
  // Replaced with merge() method below
  rects
    .attr('y', function (d) {
      return y(d[value]);
    })
    .attr('x', function (d) {
      return x(d.month);
    })
    .attr('height', function (d) {
      return height - y(d[value]);
    })
    .attr('width', x.bandwidth);
    */

  // ENTER new elements present in new data.
  rects
    .enter()
    .append('rect')
    .attr('x', (d) => {
      return x(d.month);
    })
    .attr('width', x.bandwidth)
    .attr('height', function (d) {
      return height - y(d[value]);
    })
    .attr('fill', function (d) {
      return 'grey';
    })
    .attr('y', y(0))
    .attr('height', 0)
    // And UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
    .attr('y', (d) => y(d[value]))
    .attr('height', (d) => height - y(d[value]));
}
