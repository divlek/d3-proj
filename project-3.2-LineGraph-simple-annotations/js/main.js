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

  // Add annotation labels
  /*
  const labels = [
    {
      data: { year: '2007', value: 770500 },
      dy: -70,
      dx: 0,
      //subject: { text: 'C', y: 'bottom' },
      id: 'minimize-badge',
      connector: { end: 'arrow' }
    },
    {
      data: { year: '2010', value: 772400 },
      dy: -70,
      dx: 0,
      note: { align: 'left' },
      //subject: { text: 'A', y: 'bottom' },
      id: 'minimize-badge',
      connector: { end: 'arrow' }
    },
    {
      data: { year: '2013', value: 777100 },
      //dy: -70,
      // dx: 0,
      //subject: { text: 'B' },
      id: 'minimize-badge',
      connector: { end: 'arrow' }
    },
    {
      data: { year: '2015', value: 782300 },
      //dy: -70,
      // dx: 0,
      //subject: { text: 'B' },
      id: 'minimize-badge',
      connector: { end: 'arrow', lineType: 'horizontal' }
    }
  ].map((l) => {
    l.note = Object.assign({}, l.note, {
      title: `Value: ${l.data.value}`,
      label: `${l.data.year}`
    });
    return l;
  });

  window.makeAnnotations = d3
    .annotation()
    .annotations(labels)
    .editMode(true)
    .type(d3.annotationCalloutElbow)
    .accessors({
      x: (d) => x(parseTime(d.year)) + margin.left,
      y: (d) => y(d.value) + margin.top
    })
    .accessorsInverse({
      date: (d) => timeFormat(x.invert(d.x)),
      close: (d) => y.invert(d.y)
    })
    .on('subjectover', function (annotation) {
      //cannot reference this if you are using es6 function syntax
      debugger;
      this.append('text')
        .attr('class', 'hover')
        .text(annotation.note.title)
        .attr('text-anchor', 'middle')
        .attr(
          'y',
          annotation.subject.y && annotation.subject.y == 'bottom' ? 50 : -40
        )
        .attr('x', -15);

      this.append('text')
        .attr('class', 'hover')
        .text(annotation.note.label)
        .attr('text-anchor', 'middle')
        .attr(
          'y',
          annotation.subject.y && annotation.subject.y == 'bottom' ? 70 : -60
        )
        .attr('x', -15);
    })
    .on('subjectout', function (annotation) {
      this.selectAll('text.hover').remove();
    });

  svg.append('g').attr('class', 'annotation-test').call(makeAnnotations);
*/
  // Add label - Uncomment block below

  var textLabels = svg
    .append('g')
    .classed('labels-group', true)
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .classed('label', true)
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.value) + margin.top)
    .attr('id', (d, i) => 'textlabel-' + i)
    .text(function (d, i) {
      return d.value;
    });

  // Add label with HTML content - Uncomment block below

  var htmlLabelsGroup = svg.append('g').classed('html-labels-group', true);

  htmlLabelsGroup
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .classed('html-label-g', true)
    .attr('id', (d, i) => 'html-label-g-' + i)
    .append('foreignObject')
    .classed('html-label-obj', true)
    .attr('width', 100)
    .attr('height', 100)
    .attr('x', (d) => x(d.year) + margin.left)
    .attr('y', (d) => y(d.value) + margin.top)
    .append('xhtml:body')
    .style('font', "14px 'Helvetica Neue'")
    .html(
      (d, i) =>
        '<div style="border: 1px solid black; background-color: pink">' +
        d.value +
        '</div>'
    );

  // Add forced layout for labels
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
      return x(d.year) + 27;
    })
    .attr('y2', function (d) {
      return y(d.value) + 27;
    })
    .attr('stroke-width', 0.6)
    .attr('stroke', 'gray')
    .attr('id', function (d) {
      d.textId = 'text' + d.id;
      d.lineId = 'line' + d.id;
      return 'line' + d.id;
    });

  function ticked() {
    /*
    textLabels
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });

    links
      .attr('x2', function (d, i) {
        let bbox = document.getElementById('textlabel-' + i).getBBox();
        return bbox.x + bbox.width / 2;
      })
      .attr('y2', function (d, i) {
        let bbox = document.getElementById('textlabel-' + i).getBBox();
        return bbox.y + bbox.height;
      });
      */

    var htmlLabels = htmlLabelsGroup.selectAll('foreignObject');
    htmlLabels
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });

    links
      .attr('x2', function (d, i) {
        let bbox = document.querySelector('#html-label-g-' + i).getBBox();
        //return bbox.x + bbox.width / 2;
        return bbox.x;
      })
      .attr('y2', function (d, i) {
        let bbox = document.querySelector('#html-label-g-' + i).getBBox();
        //return bbox.y + bbox.height;
        return bbox.y;
      });
  }

  function simulationEnd() {
    console.log('Simulation ended');

    /*
    links
      .attr('x2', function (d, i) {
        let bbox = document.getElementById('textlabel-' + i).getBBox();
        return bbox.x + bbox.width / 2;
      })
      .attr('y2', function (d, i) {
        let bbox = document.getElementById('textlabel-' + i).getBBox();
        return bbox.y + bbox.height;
      });
      */

    links
      .attr('x2', function (d, i) {
        let bbox = document.querySelector('#html-label-g-' + i).getBBox();
        //return bbox.x + bbox.width / 2;
        return bbox.x;
      })
      .attr('y2', function (d, i) {
        let bbox = document.querySelector('#html-label-g-' + i).getBBox();
        //return bbox.y + bbox.height;
        return bbox.y;
      });
  }

  var collide = d3
    .bboxCollide((a) => {
      console.log('Collide ' + JSON.stringify(a));
      return [
        [5, 10],
        [-5, -10]
      ];
    })
    .strength(0.5)
    .iterations(1);

  /*
  var simulation = d3
    .forceSimulation(data)
    .force(
      'x',
      d3
        .forceX((a) => x(a.year))
        .strength(
          (a) => 0.1
          //Math.max(0.25, Math.min(3, Math.abs(a.x - x(a.year)) / 20))
        )
    )
    .force(
      'y',
      d3
        .forceY((a) => y(a.value))
        .strength(
          (a) => 0.1
          //Math.max(0.25, Math.min(3, Math.abs(a.y - y(a.value)) / 20))
        )
    )
    .force('collision', collide)
    .alpha(0.5)
    .on('tick', ticked)
    .on('end', simulationEnd);
          */

  //update the simulation based on the data

  var simulation = d3
    .forceSimulation(data)
    .force(
      'forceX',
      d3
        .forceX()
        .strength(
          (a) => 0.1
          //Math.max(0.25, Math.min(3, Math.abs(a.x - x(a.year)) / 20))
        )
        .x((d) => {
          return x(d.year);
          //return width * 0.5;
        })
    )
    .force(
      'forceY',
      d3
        .forceY()
        .strength(0.1)
        .y((d) => {
          return y(d.value);
          // return height * 0.5 })
        })
    )
    .force(
      'center',
      d3
        .forceCenter()
        .x(width * 0.5 + margin.left)
        .y(height * 0.5 + margin.top)
    )
    .force('charge', d3.forceManyBody().strength(1))
    .force(
      'collision',
      d3
        .forceCollide()
        .strength(0.5)
        .radius(function (d) {
          return 60;
          //return d.radius;
        })
        .iterations(1)
    )
    .alpha(0.5)
    .on('tick', ticked)
    .on('end', simulationEnd);

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
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr('transform', 'translate(' + x(d.year) + ',' + y(d.value) + ')');
    focus.select('text').text(d.value);
    focus.select('.x-hover-line').attr('y2', height - y(d.value));
    focus.select('.y-hover-line').attr('x2', -x(d.year));
  }

  /******************************** Tooltip Code ********************************/
});
