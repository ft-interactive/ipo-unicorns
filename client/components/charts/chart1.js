import * as d3 from 'd3';

export default function drawNumberCap(data) {
  const numCapUnicorns = d3.csv.parse(data);
  d3.select('#numberCap').html('');

  const graphWidth = document.getElementById('numberCap').offsetWidth;
  const graphHeight = 200;
  const margins = { top: 40, bottom: 30, left: 30, right: 50 };

  const svg = d3.select('#numberCap')
    .append('svg')
    .attr({
      width: graphWidth,
      height: graphHeight,
    });

  const format = d3.time.format('%d/%m/%Y');

  const yScale = d3.scale.linear()
    .domain([0, 180])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .innerTickSize((-graphWidth + margins.right + margins.left) - 10)
    .outerTickSize(0)
    .tickPadding(10)
    .tickValues([0, 30, 60, 90, 120, 150, 180])
    .orient('left');

  const yLabel = svg.append('g')
    .attr('class', 'yAxis')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)
    .call(yAxis);

  const yScaleCap = d3.scale.linear()
    .domain([0, 600000])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxisCap = d3.svg.axis()
    .scale(yScaleCap)
    .tickValues([0, 100000, 200000, 300000, 400000, 500000, 600000])
    .orient('right')
    .tickFormat(d => d / 1000);

  const yLabelCap = svg.append('g')
    .attr('class', 'yAxis yAxisCap')
    .attr('transform', `translate(${(graphWidth - margins.right) + 30}, ${margins.top})`)
    .call(yAxisCap);

  // add y axis companies label
  yLabel.append('text')
    .text('Companies')
    .style('text-anchor', 'right')
    .attr('class', 'axisLabel')
    .attr('x', -margins.left)
    .attr('y', -20);

  // add y axis market cap label
  yLabelCap.append('text')
    .text('Market cap ($bn)')
    .style('text-anchor', 'end')
    .attr('class', 'axisLabel')
    .attr('x', 20)
    .attr('y', -20);

  const xScale = d3.time.scale()
    .domain([format.parse('01/01/2012'), format.parse('01/05/2016')])
    .range([0, graphWidth - margins.left - margins.right]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .outerTickSize(5)
    .ticks(6)
    .orient('bottom');

  // add x axis
  svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(${margins.left}, ${graphHeight - margins.bottom})`)
    .call(xAxis);

  const numBarGroup = svg.append('g')
    .attr('class', 'numBarGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add numunicorns bars
  numBarGroup.selectAll('rect.numUnicorns')
    .data(numCapUnicorns)
    .enter()
    .append('rect')
    .attr('class', 'numUnicorns')
    .attr('width', ((graphWidth - margins.left - margins.right) * 0.8) / numCapUnicorns.length)
    .attr('height', d => graphHeight - margins.top - margins.bottom - yScale(d.numUnicorns))
    .attr('x', d => xScale(format.parse(d.date)))
    .attr('y', d => yScale(d.numUnicorns))
    .style('fill', '#efb1af');

  const totalCapGroup = svg.append('g')
    .attr('class', 'totalCapGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  const convertLineData = d3.svg.line()
    .x(d => xScale(format.parse(d.date)))
    .y(d => yScaleCap(d.totalCap))
    .interpolate('linear');

  // add total cap line
  totalCapGroup.append('path')
    .datum(numCapUnicorns)
    .attr('class', 'totalCapLine')
    .attr('d', d => convertLineData(d))
    .style('stroke', '#af516c')
    .style('stroke-width', '2');
}
