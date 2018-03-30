import './styles.scss';
import './components/charts/chart1.scss';
import './components/charts/draw-ipo-interactive.scss';
import './components/charts/explore-data.scss';

import drawIPOInteractive from './components/charts/draw-ipo-interactive';
import drawExploreDataChart from './components/charts/explore-data';
import drawNumberCap from './components/charts/chart1';
import drawIssuanceChart from './components/charts/issuance';

import numCapUnicorns from './components/charts/data/numCapUnicorns.csv';
import preIPOdataset from './components/charts/data/preipodata.csv';
import postIPOdataset from './components/charts/data/postipodata.csv';
import userData from './components/charts/data/userData.json';
import capitalFormationData from './components/charts/data/formatted-capital-formation-minified.json';
import issuanceData from './components/charts/data/issuance-data.csv';

drawNumberCap(numCapUnicorns);
drawIPOInteractive(preIPOdataset, postIPOdataset, userData);
drawExploreDataChart(capitalFormationData);
drawIssuanceChart(issuanceData);

let windowWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (Math.abs(window.innerWidth - windowWidth) > 10) {
    windowWidth = window.innerWidth;

    drawNumberCap(numCapUnicorns);
    drawIPOInteractive(preIPOdataset, postIPOdataset, userData);
    drawExploreDataChart(capitalFormationData);
    drawIssuanceChart(issuanceData);
  }
});
