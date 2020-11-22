//const data = [25, 20, 10, 12, 15];

const svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', 400)
  .attr('height', 200);

/*
const circle = svg
  .append('circle')
  .attr('cx', 100)
  .attr('cy', 100)
  .attr('r', 70)
  .attr('fill', 'blue');

const rect = svg
  .append('rect')
  .attr('x', 200)
  .attr('y', 100)
  .attr('width', 70)
  .attr('height', 150)
  .attr('fill', 'pink');

*/

/*
const circles = svg.selectAll('circle').data(data);

circles
  .enter()
  .append('circle')
  .attr('cx', function (d, i) {
    return (i*50) + 25
  })
  .attr('cy', 100)
  .attr('r', function (d, i) {
    return d;
  })
  .attr('fill', 'blue');

  */

d3.json('data/ages.json').then((data) => {
  data.forEach((d) => {
    d.age = +d.age;
  });

  const circles = svg.selectAll('circle').data(data);

  circles
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      return i * 50 + 25;
    })
    .attr('cy', 100)
    .attr('r', function (d, i) {
      return d.age;
    })
    .attr('fill', (d) => {
      if (d.name === 'Tony') {
        return 'blue';
      } else {
        return 'red';
      }
    });
});

const barChartData = [25, 20, 80, 12, 45];
const svgBarChart = d3
  .select('#bar-chart-area')
  .append('svg')
  .attr('width', 400)
  .attr('height', 200);

const rects = svgBarChart.selectAll('rect').data(barChartData);
const rectWidth = 20;
const rectGap = 25;
rects
  .enter()
  .append('rect')
  .attr('x', function (d, i) {
    return i * (rectWidth + rectGap);
  })
  .attr('y', 10)
  .attr('width', rectWidth)
  .attr('height', (d) => 3 * d)
  .attr('fill', 'gray');
