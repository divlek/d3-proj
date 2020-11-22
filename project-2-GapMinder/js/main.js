/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const margins = { left: 100, right: 10, top: 10, bottom: 150 };
const height = 600 - margins.top - margins.bottom;
const width = 800 - margins.left - margins.right;

var g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margins.left + margins.right)
  .attr('height', height + margins.top + margins.bottom)
  .append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

// Add axis groups
var xaxisGroup = g
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(' + 0 + ',' + height + ')');

var yaxisGroup = g.append('g').attr('class', 'y axis');

var x = d3.scaleLog().range([0, width]).domain([142, 150000]);

var y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

var area = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);

var continentColor = d3.scaleOrdinal(d3.schemePastel1);

// X Label
g.append('text')
  .attr('class', 'x axis-label')
  .attr('x', width / 2)
  .attr('y', height + 120)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('GDP Per Capita ($)');

// Y Label
var yAxisLabel = g
  .append('text')
  .attr('class', 'y axis-label')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)');

// Add legend
var legendGroup = g
  .append('g')
  .attr('transform', 'translate(' + (width - 50) + ',' + (height - 100) + ')');

var continents = ['asia', 'americas', 'africa', 'europe'];

continents.forEach((c, i) => {
  let legendRow = legendGroup
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + i * 20 + ')')
    .attr('width', 75)
    .attr('height', 20);
  let legendColor = legendRow
    .append('rect')
    .attr('class', 'legend-color')
    .attr('width', 5)
    .attr('height', 5)
    .attr('fill', continentColor(c));
  let legendText = legendRow
    .append('text')
    .attr('class', 'legend-label')
    .attr('x', 10)
    .attr('y', 5)
    .attr('font-size', 12)
    .text(c)
    .style('text-transform', 'capitalize ');
});

// Year Label
var yearLabel = g
  .append('text')
  .attr('class', 'year')
  .attr('x', width)
  .attr('y', height + 120)
  .attr('font-size', '30px')
  .attr('fill', 'blue')
  .attr('text-anchor', 'end');

var yLabelText = 'Life Expectancy (Years)';
yAxisLabel.text(yLabelText);

var xaxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat((d) => '$' + d);
xaxisGroup.call(xaxisCall);

var yaxisCall = d3.axisLeft(y).ticks(10);
yaxisGroup.call(yaxisCall);

// Tool tip using d3-tip
var tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    var text =
      "<strong>Country:</strong> <span style='color:red'>" +
      d.country +
      '</span><br>';
    text +=
      "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>" +
      d.continent +
      '</span><br>';
    text +=
      "<strong>Life Expectancy:</strong> <span style='color:red'>" +
      d3.format('.2f')(d.life_exp) +
      '</span><br>';
    text +=
      "<strong>GDP Per Capita:</strong> <span style='color:red'>" +
      d3.format('$,.0f')(d.income) +
      '</span><br>';
    text +=
      "<strong>Population:</strong> <span style='color:red'>" +
      d3.format(',.0f')(d.population) +
      '</span><br>';
    return text;
  });

g.call(tip);

let formattedData;

d3.json('data/data.json').then(function (data) {
  console.log(data);

  // Clean data
  formattedData = data.map(function (year) {
    return year['countries']
      .filter(function (country) {
        var dataExists = country.income && country.life_exp;
        return dataExists;
      })
      .map(function (country) {
        country.income = +country.income;
        country.life_exp = +country.life_exp;
        return country;
      });
  });

  console.log('data.length =' + formattedData.length);

  /*
  d3.interval(() => {
    dataIndex = (dataIndex + 1) % formattedData.length;
    update(formattedData[dataIndex], dataIndex);
  }, 100);
  */

  update(formattedData[0], 0);
});

let playMode = false;
let interval;
let time = 0;
// Play/ Pause / Filter by continent event hookups
function step() {
  // At the end of our data, loop back
  time = time < 214 ? time + 1 : 0;
  update(formattedData[time], time);
}

const playButton = document.querySelector('#play-button');
playButton.addEventListener('click', () => {
  playMode = !playMode;
  playButton.innerText = playMode ? 'Pause' : 'Play';
  if (playMode) {
    interval = setInterval(() => {
      step();
    }, 100);
  } else {
    clearInterval(interval);
  }
});

const resetButton = document.querySelector('#reset-button');
resetButton.addEventListener('click', () => {
  time = 0;
  update(formattedData[time], time);
});

const continentSelect = document.querySelector('#continent-select');
continentSelect.addEventListener('change', () => {
  update(formattedData[time], time);
});

const inputYear = document.querySelector('#input-year');
inputYear.addEventListener('change', (event) => {
  //console.log(event.target.value);
  time = event.target.value - 1800;
  update(formattedData[time], time);
});

// Data is per year
function update(data, dataIndex) {
  var continent = document.querySelector('#continent-select').value;

  var data = data.filter(function (d) {
    if (continent == 'all') {
      return true;
    } else {
      return d.continent == continent;
    }
  });

  // Standard transition time for the visualization
  var t = d3.transition().duration(100);

  yearLabel.text('Year: ' + (1800 + dataIndex));

  // JOIN new data with old elements.
  var circles = g.selectAll('circle').data(data, (d) => d.country);

  console.log(circles);

  // EXIT old elements not present in new data.
  circles.exit().attr('class', 'exit').remove();

  //   // ENTER new elements present in new data.
  //   circles
  //     .enter()
  //     .append('circle')
  //     .attr('cx', (c) => {
  //       return x(c.income);
  //     })
  //     .attr('r', (c) => {
  //       return Math.sqrt(area(c.population) / Math.PI);
  //     })
  //     .attr('fill', function (c) {
  //       return continentColor(c.continent);
  //     })
  //     .attr('cy', (c) => y(c.life_exp))
  //     // And UPDATE old elements present in new data.
  // 	.merge(circles);

  // ENTER new elements present in new data.
  circles
    .enter()
    .append('circle')
    .attr('class', 'enter')
    .attr('fill', function (d) {
      return continentColor(d.continent);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .merge(circles)
    .transition(t)
    .attr('cy', function (d) {
      return y(d.life_exp);
    })
    .attr('cx', function (d) {
      return x(d.income);
    })
    .attr('r', function (d) {
      return Math.sqrt(area(d.population) / Math.PI);
    });
}
