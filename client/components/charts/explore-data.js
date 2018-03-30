import * as d3 from 'd3';

export default function drawExploreDataChart(dataset) {
  d3.select('#explore-data').html('');

  const graphWidth = document.getElementById('explore-data').offsetWidth;
  const graphHeight = 400;
  const margins = { top: 50, bottom: 50, left: 25, right: 5 };

  const svg = d3.select('#explore-data')
    .append('svg')
    .attr({
      width: graphWidth,
      height: graphHeight,
    });

  const yScale = d3.scale.linear()
    .domain([0, 800])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .innerTickSize(-graphWidth)
    .outerTickSize(0)
    .orient('left');

  const yLabel = svg.append('g')
    .attr('class', 'yAxis')
    .attr('transform', `translate(${margins.left},${margins.top})`)
    .call(yAxis);

  // add y axis label
  yLabel.append('text')
    .text('Dollars')
    .style('text-anchor', 'right')
    .attr('class', 'axisLabel')
    .attr('x', -margins.left)
    .attr('y', -20);

  const xScale = d3.scale.linear()
    .domain([-3701, 1146])
    .range([0, graphWidth - margins.left - margins.right]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .outerTickSize(5)
    .tickValues([-3000, -2000, -1000, 0, 1000])
    .orient('bottom');

  const xLabel = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(${margins.left},${graphHeight - margins.bottom})`)
    .call(xAxis);

  // add x axis label
  xLabel.append('text')
    .text('Days from IPO')
    .style('text-anchor', 'middle')
    .attr('x', (graphWidth - margins.left - margins.right) / 2)
    .attr('y', 40)
    .attr('class', 'axisLabel');

  const lineGroup = svg.append('g')
    .attr('class', 'lineGroup')
    .attr('transform', `translate(${margins.left},${margins.top})`);

  const convertLineData = d3.svg.line()
    .x(d => xScale(d.key))
    .y(d => yScale(d.value))
    .interpolate('step-after');

  // add vertical ipo line
  lineGroup.append('line')
    .attr('class', 'ipoLine')
    .attr('x1', xScale(0))
    .attr('x2', xScale(0))
    .attr('y1', yScale(0))
    .attr('y2', yScale(800))
    .style('stroke', '#000')
    .style('stroke-width', '0.5')
    .style('stroke-dasharray', '5,5');

  // add company lines
  lineGroup.selectAll('path.companyLine')
    .data(dataset)
    .enter()
    .append('path')
    .attr('class', 'companyLine')
    .attr('data-company', d => d.key)
    .attr('d', d => convertLineData(d.values))
    .style('stroke', '#cec6b9')
    .style('stroke-width', '0.5')
    .style('fill', 'none');

  const highlightLineGroup = svg.append('g')
    .attr('class', 'highlightLineGroup')
    .attr('transform', `translate(${margins.left},${margins.top})`);

  // add highlighted line
  highlightLineGroup.selectAll('path.highlightLine')
    .data(dataset)
    .enter()
    .append('path')
    .attr('class', 'highlightLine')
    .attr('data-company', d => d.key)
    .attr('d', d => convertLineData(d.values))
    .style('stroke', 'none')
    .style('stroke-width', '2')
    .style('fill', 'none');

  function mouseover(line) {
    highlightLineGroup.selectAll('path.highlightLine')
      .style('stroke', 'none');

    highlightLineGroup.select(`path.highlightLine[data-company="${line.key}"]`)
      .style('stroke', '#af516c');

    d3.select('#explore-name-value').text(line.key);
  }

  mouseover(dataset[11]); // default to something on load

  lineGroup.selectAll('path.companyLine')
    .on('mouseover', mouseover);

  d3.select('#explore-data-box').style('display', 'block');
}
