import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';


import '../ts/style/index.css';
import "@jpmorganchase/perspective-viewer";
import "@jpmorganchase/perspective-viewer-hypergrid";
import "@jpmorganchase/perspective-viewer-highcharts";


export
class PSPWidget extends Widget {

  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('perspective-viewer');
    node.appendChild(content);
    return node;
  }

  constructor(name: string) {
    super({ node: PSPWidget.createNode() });
    this.addClass('pspwidget');
    this.title.label = name;
    this.title.closable = false;
    this.title.caption = `Long description for: ${name}`;
  }

  get pspNode(): any {
    return this.node.getElementsByTagName('perspective-viewer')[0] as any;
  }

  protected onActivateRequest(msg: Message): void {
    if (this.isAttached) {
      this.pspNode.focus();
    }
  }

}
