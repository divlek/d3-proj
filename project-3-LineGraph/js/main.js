/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    CoinStats
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

var t = function () {
  return d3.transition().duration(1000);
};

// Time parser for x-scale
var parseTime = d3.timeParse('%d/%m/%Y');

// Year parser for x-scale labels
var parseYear = d3.timeFormat('%Y');

// For tooltip
var bisectDate = d3.bisector(function (d) {
  return d.date;
}).left;

// Add the line for the first time
g.append('path')
  .attr('class', 'line')
  .attr('fill', 'none')
  .attr('stroke', 'grey')
  .attr('stroke-width', '3px');

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3
  .axisBottom()
  .ticks(5)
  .tickFormat((d) => parseYear(d));
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
var yAxisLabel = yAxis
  .append('text')
  .attr('class', 'axis-title')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .style('text-anchor', 'end')
  .attr('fill', '#5D6971');

var coinTypes = null;
let dataFormatted = [];
document.querySelector('#coin-select').addEventListener('change', (event) => {
  updateChart(dataFormatted);
});

document.querySelector('#var-select').addEventListener('change', (event) => {
  updateChart(dataFormatted);
});

d3.json('data/coins.json').then(function (data) {
  // Data cleaning
  coinTypes = Object.keys(data);

  dataFormatted = [];
  coinTypes.forEach((coin) => {
    let coinArray = data[coin];
    coinArray.forEach((c) => {
      c['24h_vol'] = +c['24h_vol'];
      c.market_cap = +c.market_cap;
      c.price_usd = +c.price_usd;
      //c.date = parseTime(c.date);
      c['date'] = parseTime(c['date']);
    });

    dataFormatted.push(coinArray);
  });

  updateChart(dataFormatted);
});

function updateChart(dataFormatted) {
  let coinType = document.querySelector('#coin-select').value;
  let coinProp = document.querySelector('#var-select').value;

  let idx = coinTypes.findIndex((c) => c === coinType);
  var data = dataFormatted[idx];

  // Set scale domains
  x.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );
  y.domain([
    d3.min(data, function (d) {
      return d[coinProp];
    }) * 1.005,
    d3.max(data, function (d) {
      return d[coinProp];
    }) * 1.005
  ]);

  // Fix for format values
  var formatSi = d3.format('.2s');
  function formatAbbreviation(x) {
    var s = formatSi(x);
    switch (s[s.length - 1]) {
      case 'G':
        return s.slice(0, -1) + 'B';
      case 'k':
        return s.slice(0, -1) + 'K';
    }
    return s;
  }

  // Generate axes once scales have been set
  xAxisCall.scale(x);
  xAxis.transition(t()).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));

  // Yaxis label
  yAxisLabel.text(coinProp).style('text-transform', 'capitalize');

  // Line path generator
  var line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d[coinProp]);
    });

  // Update our line path
  g.select('.line').transition(t).attr('d', line(data));

  /******************************** Tooltip Code ********************************/

  var focus = g.append('g').attr('class', 'focus').style('display', 'none');

  focus
    .append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('y1', 0)
    .attr('y2', height);

  focus
    .append('line')
    .attr('class', 'y-hover-line hover-line')
    .attr('x1', 0)
    .attr('x2', width);

  focus.append('circle').attr('r', 7.5);

  focus.append('text').attr('x', 15).attr('dy', '.31em');

  g.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', function () {
      focus.style('display', null);
    })
    .on('mouseout', function () {
      focus.style('display', 'none');
    })
    .on('mousemove', mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = d1 && d0 ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
    focus.attr(
      'transform',
      'translate(' + x(d.date) + ',' + y(d[coinProp]) + ')'
    );
    focus.select('text').text(d[coinProp]);
    focus.select('.x-hover-line').attr('y2', height - y(d[coinProp]));
    focus.select('.y-hover-line').attr('x2', -x(d.date));
  }

  /******************************** Tooltip Code ********************************/
}
