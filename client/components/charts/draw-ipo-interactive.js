/* eslint no-use-before-define: ["error", { "functions": false }]*/

// import d3 twice to fix Babel bug: https://github.com/d3/d3/issues/2733
import * as d3 from 'd3'; // eslint-disable-line
import { event as currentEvent } from 'd3'; // eslint-disable-line

export default function drawChart(preIPOdatasetString, postIPOdatasetString, userData) {
  const preIPOdataset = d3.csv.parse(preIPOdatasetString);
  const postIPOdataset = d3.csv.parse(postIPOdatasetString);

  d3.select('#ipo-draw-container').html('');

  const graphWidth = document.getElementById('ipo-draw-container').offsetWidth;
  const graphHeight = 400;
  const margins = { top: 40, bottom: 50, left: 30, right: 15 };

  const svg = d3.select('#ipo-draw-container')
    .append('svg')
    .attr({
      width: graphWidth,
      height: graphHeight,
    });

  const drag = d3.behavior.drag()
    .on('drag', dragmove);

  const yScale = d3.scale.linear()
    .domain([0, 80])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .innerTickSize(-graphWidth + margins.right + margins.left)
    .outerTickSize(0)
    .tickPadding(10)
    .orient('left');

  const yLabel = svg.append('g')
    .attr('class', 'yAxis')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)
    .call(yAxis);

  // add yAxis label
  yLabel.append('text')
    .text('Dollars')
    .style('text-anchor', 'right')
    .attr('class', 'axisLabel')
    .attr('x', -margins.left)
    .attr('y', -20);

  const xScale = d3.scale.linear()
    .domain([-84, 38])
    .range([0, graphWidth - margins.left - margins.right]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .outerTickSize(5)
    .orient('bottom');

  const xLabel = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(${margins.left}, ${graphHeight - margins.bottom})`)
    .call(xAxis);

  // add x-axis label
  xLabel.append('text')
    .text('Months from IPO')
    .style('text-anchor', 'middle')
    .attr('x', (graphWidth - margins.left - margins.right) / 2)
    .attr('y', 40)
    .attr('class', 'axisLabel');

  const connectingLinesGroup = svg.append('g')
    .attr('class', 'connectingLinesGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  const givenLineGroup = svg.append('g')
    .attr('class', 'givenLineGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add IPO line
  givenLineGroup.append('line')
    .attr('class', 'ipoLine')
    .attr('x1', xScale(0))
    .attr('x2', xScale(0))
    .attr('y1', yScale(0))
    .attr('y2', yScale(80))
    .style('stroke', '#000')
    .style('stroke-width', '0.5')
    .style('stroke-dasharray', '5,5');

  const convertGivenLineData = d3.svg.line()
    .x(d => xScale(d.months))
    .y(d => yScale(d.value))
    .interpolate('step-after');

  // add given line
  givenLineGroup.append('path')
    .datum(preIPOdataset)
    .attr('class', 'givenLine')
    .attr('d', d => convertGivenLineData(d))
    .style('stroke', '#505050')
    .style('stroke-width', '1');

  // add IPO point
  givenLineGroup.append('circle')
    .attr('class', 'ipoPoint')
    .attr('cx', xScale(preIPOdataset[preIPOdataset.length - 1].months))
    .attr('cy', yScale(preIPOdataset[preIPOdataset.length - 1].value))
    .attr('r', 5);

  const userDrawGroup = svg.append('g')
    .attr('class', 'userDrawGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  const firstTradePoint = userDrawGroup.append('circle')
    .datum({ x: 0.03, y: 50 })
    .attr('class', 'firstTradePoint draggable')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 5)
    .call(drag);

  const peakValuePoint = userDrawGroup.append('circle')
    .datum({ x: 19, y: 50 })
    .attr('class', 'peakValuePoint draggable')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 5)
    .call(drag);

  const currentValuePoint = userDrawGroup.append('circle')
    .datum({ x: 38, y: 50 })
    .attr('class', 'currentValuePoint draggable')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 5)
    .call(drag);

  const convertUserDrawLineData = d3.svg.line()
    .x(d => d.x)
    .y(d => d.y)
    .interpolate('linear');

  const userDrawLine = connectingLinesGroup
    .datum([{ x: xScale(0), y: yScale(44) },
      { x: firstTradePoint.attr('cx'), y: firstTradePoint.attr('cy') },
      { x: peakValuePoint.attr('cx'), y: peakValuePoint.attr('cy') },
      { x: currentValuePoint.attr('cx'), y: currentValuePoint.attr('cy') }])
    .insert('path', ':first-child')
    .attr('d', convertUserDrawLineData)
    .style('stroke', '#505050')
    .style('stroke-width', '1');

  function dragmove(d) {
    // change position of circles
    if (d3.select(this).classed('firstTradePoint')) {
      d3.select(this)
        .attr('cx', d.x = xScale(0.03))
        .attr('cy', d.y = Math.round(Math.max(0, Math.min(graphHeight - margins.top - margins.bottom, currentEvent.y))));

      d3.select('input#firstTradeInput').property('value', d3.round(yScale.invert(d.y)));
    } else if (d3.select(this).classed('peakValuePoint')) {
      d3.select(this)
        .attr('cx', d.x = Math.max(xScale(0), Math.min(graphWidth - margins.left - margins.right, currentEvent.x)))
        .attr('cy', d.y = Math.max(0, Math.min(graphHeight - margins.top - margins.bottom, currentEvent.y)));
      d3.select('input#peakValueInput').property('value', d3.round(yScale.invert(d.y)));

      d3.select('input#peakTimeInput').property('value', d3.round(xScale.invert(d.x)));
    } else {
      d3.select(this)
        .attr('cx', d.x = xScale(38))
        .attr('cy', d.y = Math.round(Math.max(0, Math.min(graphHeight - margins.top - margins.bottom, currentEvent.y))));

      d3.select('input#currentValueInput').property('value', d3.round(yScale.invert(d.y)));
    }

    redrawLineThroughPoints();
  }

  function redrawLineThroughPoints() {
    // change line with the points
    userDrawLine
      .datum([{ x: xScale(0), y: yScale(44) },
        { x: firstTradePoint.attr('cx'), y: firstTradePoint.attr('cy') },
        { x: peakValuePoint.attr('cx'), y: peakValuePoint.attr('cy') },
        { x: currentValuePoint.attr('cx'), y: currentValuePoint.attr('cy') }])
      .attr('d', convertUserDrawLineData);
  }

  const convertAnswerLineData = d3.svg.line()
    .x(d => xScale(d.months))
    .y(d => yScale(d.value))
    .interpolate('linear');

  // add answer line group
  svg.append('g')
    .attr('class', 'answerLineGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add answer line
  givenLineGroup.append('path')
    .datum(postIPOdataset)
    .attr('class', 'answerLine')
    .attr('d', d => convertAnswerLineData(d))
    .style('stroke', '#505050')
    .style('stroke-width', '0.5')
    .style('opacity', 0);

  givenLineGroup.selectAll('circle.aggregateTries.firstTradePoint')
    .data(Object.keys(userData.firstTrade))
    .enter()
    .append('circle')
    .attr('class', 'aggregateTries firstTradePoint')
    .attr('cx', xScale(0))
    .attr('cy', d => yScale(d))
    .attr('r', 5)
    .attr('data-numberGuesses', d => userData.firstTrade[d])
    .attr('opacity', 0);

  givenLineGroup.selectAll('circle.aggregateTries.peakValuePoint')
    .data(Object.keys(userData.peak))
    .enter()
    .append('circle')
    .attr('class', 'aggregateTries peakValuePoint')
    .attr('cx', d => xScale(JSON.parse(d)[1]))
    .attr('cy', d => yScale(JSON.parse(d)[0]))
    .attr('r', 5)
    .attr('data-numberGuesses', d => userData.peak[d])
    .attr('opacity', 0);

  givenLineGroup.selectAll('circle.aggregateTries.currentValuePoint')
    .data(Object.keys(userData.currentValue))
    .enter()
    .append('circle')
    .attr('class', 'aggregateTries currentValuePoint')
    .attr('cx', xScale(38))
    .attr('cy', d => yScale(d))
    .attr('r', 5)
    .attr('data-numberGuesses', d => userData.currentValue[d])
    .attr('opacity', 0);

  d3.selectAll('.ipo-control input').on('change', () => {
    if (d3.select(this).attr('id') === 'firstTradeInput') {
      const newValue = Math.round(Math.max(0, Math.min(80, this.value)));

      firstTradePoint
        .datum({ x: 0.03, y: newValue })
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));

      d3.select('input#firstTradeInput').property('value', d3.round(newValue));
    } else if (d3.select(this).attr('id') === 'peakValueInput') {
      const newValue = Math.round(Math.max(0, Math.min(80, this.value)));

      peakValuePoint
        .datum({ x: document.getElementById('peakTimeInput').value, y: newValue })
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));

      d3.select('input#peakValueInput').property('value', d3.round(newValue));
    } else if (d3.select(this).attr('id') === 'peakTimeInput') {
      const newValue = Math.round(Math.max(0, Math.min(38, this.value)));

      peakValuePoint
        .datum({ x: newValue, y: document.getElementById('peakValueInput').value })
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));

      d3.select('input#peakTimeInput').property('value', newValue);
    } else if (d3.select(this).attr('id') === 'currentValueInput') {
      const newValue = Math.round(Math.max(0, Math.min(80, this.value)));

      currentValuePoint
        .datum({ x: 38, y: newValue })
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));

      d3.select('input#currentValueInput').property('value', d3.round(newValue));
    }

    redrawLineThroughPoints();
  });

  function compareNumbers(a, b) {
    return a - b;
  }


  function getMaxValueMinusMax(arr) {
    arr = arr.sort(compareNumbers);
    arr.pop();
    return d3.extent(arr)[1];
  }

  const userGuessesColorFirst = d3.scale.linear()
    .range([0.05, 0.4])
    .domain([d3.extent(d3.values(userData.firstTrade))[0],
      getMaxValueMinusMax(d3.values(userData.firstTrade))])
    .clamp(true);

  const userGuessesColorPeak = d3.scale.linear()
    .range([0.15, 0.4])
    .domain([d3.extent(d3.values(userData.peak))[0],
      getMaxValueMinusMax(d3.values(userData.peak))])
    .clamp(true);

  const userGuessesColorCurrent = d3.scale.linear()
    .range([0.05, 0.4])
    .domain([d3.extent(d3.values(userData.currentValue))[0],
      getMaxValueMinusMax(d3.values(userData.currentValue))])
    .clamp(true);

  d3.select('#ipo-reveal-button').on('click', function () {
    // Disable draggable and inputs after answer shown
    document.getElementById('ipo-controls').style.pointerEvents = 'none';
    document.getElementById('ipo-draw-container').style.pointerEvents = 'none';

    d3.select(this).style('display', 'none');
    d3.select('.answerLine').style('opacity', 1);
    d3.selectAll('.aggregateTries.firstTradePoint').style('opacity', function () {
      return userGuessesColorFirst(this.getAttribute('data-numberGuesses'));
    });
    d3.selectAll('.aggregateTries.peakValuePoint').style('opacity', function () {
      return userGuessesColorPeak(this.getAttribute('data-numberGuesses'));
      // return Math.min(0.4, this.getAttribute('data-numberGuesses') * 0.15);
    });
    d3.selectAll('.aggregateTries.currentValuePoint').style('opacity', function () {
      return userGuessesColorCurrent(this.getAttribute('data-numberGuesses'));
    });
    d3.select('#ipo-outcome').style('opacity', '1');
    d3.select('#ipo-outcome').style('height', 'auto');
    d3.select('#ipo-outcome').style('margin-bottom', '2em');

    evaluateGuesses();
  });

  function evaluateGuesses() {
    const firstTradeInput = +document.getElementById('firstTradeInput').value;
    const peakValueInput = +document.getElementById('peakValueInput').value;
    const peakTimeInput = +document.getElementById('peakTimeInput').value;
    const currentValueInput = +document.getElementById('currentValueInput').value;

    // const correctAnswers = [61.35, 74.21, 4, 29.0]

    const guessDistance = Math.abs(firstTradeInput - 61.35) +
      Math.sqrt(Math.pow(peakValueInput - 74.21, 2) + Math.pow(peakTimeInput - 4, 2)) +
      Math.abs(currentValueInput - 29.0);

    // did you try?
    if (firstTradeInput === 50 &&
      peakValueInput === 50 &&
      peakTimeInput === 19 &&
      currentValueInput === 50) {
      return;
    } else if (firstTradeInput > 43.94 &&
        peakValueInput > firstTradeInput &&
        peakTimeInput < 19 &&
        currentValueInput < 43.94) { // is the general shape correct?
        // are you really close in value?
      if (guessDistance < 20) {
        document.getElementById('feedback-comparison').innerHTML = 'Great job!';
      } else { // not close in value
        document.getElementById('feedback-comparison').innerHTML = 'Good guess!';
      }
    } else { // shape isn't even close
      document.getElementById('feedback-comparison').innerHTML = 'Good try, but not quite.';
    }

    const distances = userData.distances;
    let numWorse = 0;
    for (const distance in distances) {
      if (+distance > guessDistance) {
        numWorse += distances[distance];
      }
    }
    const percentWorse = Math.round((numWorse * 100) / userData.userCount);
    document.getElementById('feedback-comparison').innerHTML += ` You did better than ${percentWorse} per cent of people who have tried so far.`;

    document.getElementById('feedback-comparison').innerHTML += ' <span class="tweet-container"><span class="tweet-label">Tweet your score: </span><span class="o-share__action o-share__icon--twitter" id="shareScore"><i></i></span></span>';

    const tweetButton = document.getElementById('shareScore');
    tweetButton.addEventListener('click', () => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&amp;text=Are%20you%20smarter%20than%20an%20IPO%20investor%3F%20I%20did%20better%20than%20${percentWorse}%25%20of%20people%20in%20this%20%40FT%20IPO%20valuation%20interactive&amp;related=%40FinancialTimes`, 'Tweet', 'width=500,height=300,scrollbars=no,location=0,statusbars=0,menubars=0,toolbars=0,resizable=0'));
  }
}
