/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  BoxPanel, DockPanel, Widget, DockLayout
} from '@phosphor/widgets';

import '../ts/style/index.css';
import "@jpmorganchase/perspective-viewer";
import "@jpmorganchase/perspective-viewer-hypergrid";
import "@jpmorganchase/perspective-viewer-highcharts";

import {
  PSPWidget
} from './psp';

function main(): void {
  let psp = new PSPWidget('SummaryGrid', 'pnl/', 500);
  let psp2 = new PSPWidget('PnL-Bar', 'pnl/', 500);
  let psp3 = new PSPWidget('PnL-Line', 'pnl/', 500);

  psp.pspNode.setAttribute('columns', '["shares","px","apx","pnl","unrealized","realized"]');

  psp2.pspNode.setAttribute('row-pivots', '["symbol"]');
  psp2.pspNode.setAttribute('column-pivots', '[]');
  psp2.pspNode.setAttribute('columns', '["unrealized","realized","pnl"]');
  psp2.pspNode.setAttribute('aggregates', '{"shares":"last","px":"last","apx":"last","pnl":"last","unrealized":"last","realized":"last","symbol":"last","no":"last"}');
  psp2.pspNode.setAttribute('settings', 'true');
  psp2.pspNode.setAttribute('view', 'y_bar');

  psp3.pspNode.setAttribute('row-pivots', '[]');
  psp3.pspNode.setAttribute('column-pivots', '[]');
  psp3.pspNode.setAttribute('columns', '["no", "pnl"]');
  psp3.pspNode.setAttribute('aggregates', '{"shares":"last","px":"last","apx":"last","pnl":"last","unrealized":"last","realized":"last","symbol":"last","no":"last"}');
  psp3.pspNode.setAttribute('view', 'xy_line');

  let dock = new DockPanel();
  dock.addWidget(psp);
  dock.addWidget(psp2, { mode: 'split-right', ref: psp });
  dock.addWidget(psp3, { mode: 'split-bottom', ref: psp2 });
  dock.id = 'dock';

  /* hack for custom sizing */
  var layout = dock.saveLayout();
  var sizes: number[] = (layout.main as DockLayout.ISplitAreaConfig).sizes;
  sizes[0] = 0.4;
  sizes[1] = 0.6;
  dock.restoreLayout(layout);

  BoxPanel.setStretch(dock, 1);
  let main = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  main.id = 'main';
  main.addWidget(dock);

  window.onresize = () => { main.update(); };
  Widget.attach(main, document.body);
}


window.onload = main;




