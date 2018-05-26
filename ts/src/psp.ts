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

  constructor(name: string, route: string, interval: number) {
    super({ node: PSPWidget.createNode() });
    this.addClass('pspwidget');
    this.title.label = name;
    this.title.closable = false;
    this.title.caption = `Long description for: ${name}`;
    this._route = route;
    this._index = 0;
    this._interval = interval;
  }

  get pspNode(): HTMLInputElement {
    return this.node.getElementsByTagName('perspective-viewer')[0] as HTMLInputElement;
  }

  onAfterAttach(msg: Message) : void {
    setInterval(() => {
      var xhr1 = new XMLHttpRequest();
      xhr1.open('GET', this._route + this._index, true);
      xhr1.onload = function () { 
        var jsn = JSON.parse(xhr1.response);
        this.pspNode.update([jsn]);
        this._index = this._index + 1;
      }.bind(this);
      xhr1.send(null);
    }, this._interval);
  }

  protected onActivateRequest(msg: Message): void {
    if (this.isAttached) {
      this.pspNode.focus();
    }
  }

  private _index:number;
  private _route:string;
  private _interval:number;
}
