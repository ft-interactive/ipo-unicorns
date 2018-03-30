import * as d3 from 'd3';

export default function drawIssuanceChart(data) {
  const issuanceData = d3.csv.parse(data);
  d3.select('#issuance').html('');

  const graphWidth = document.getElementById('issuance').offsetWidth;
  const graphHeight = 200;
  const margins = { top: 40, bottom: 30, left: 15, right: 50 };

  const svg = d3.select('#issuance')
    .append('svg')
    .attr({
      width: graphWidth,
      height: graphHeight,
    });

  const format = d3.time.format('%Y');

  const yScaleCap = d3.scale.linear()
    .domain([0, 50000])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxisCap = d3.svg.axis()
    .scale(yScaleCap)
    .innerTickSize((-graphWidth - margins.right) + 10)
    .orient('right')
    .tickFormat(d => d / 1000)
    .ticks(4);

  const yLabelCap = svg.append('g')
    .attr('class', 'yAxis yAxisCap')
    .attr('transform', `translate(${(graphWidth - margins.right) + 30}, ${margins.top})`)
    .call(yAxisCap);

  // add y axis label deal value
  yLabelCap.append('text')
    .text('Deal value ($bn)')
    .style('text-anchor', 'start')
    .attr('class', 'axisLabel')
    .attr('x', -graphWidth + margins.left + margins.right + 45)
    .attr('y', -20);

  const xScale = d3.time.scale()
    .domain([format.parse('1995'), format.parse('2016')])
    .range([0, graphWidth - margins.left - margins.right]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .outerTickSize(5)
    .ticks(6)
    .orient('bottom');

  // add x axis
  svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(${margins.left},${graphHeight - margins.bottom})`)
    .call(xAxis);

  const numBarGroup = svg.append('g')
    .attr('class', 'numBarGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add deal value bars
  numBarGroup.selectAll('rect.dealValue')
    .data(issuanceData)
    .enter()
    .append('rect')
    .attr('class', 'dealValue')
    .attr('width', ((graphWidth - margins.left - margins.right) * 0.8) / issuanceData.length)
    .attr('height', d => graphHeight - margins.top - margins.bottom - yScaleCap(d.value))
    .attr('x', d => xScale(format.parse(d.year)))
    .attr('y', d => yScaleCap(d.value))
    .style('fill', '#bb6d82');
}
