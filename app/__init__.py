import ujson
from flask import request

from .app import app


sign = lambda x: (1, -1)[x<0]


def _read(filename='trades.txt'):
    ret = []
    with open(filename, 'r') as fp:
        for line in fp:
            splits = line.split(' ')
            ret.append({'amt': int(splits[0]), 'px': round(float(splits[1]), 2)})
    return ret


class pnl_helper(object):
    def __init__(self):
        self._trades = _read()
        self._records = []

        # lets say the first one is "free"
        self._pnl = 0.0
        self._px = self._trades[0]['px']
        self._shares = self._trades[0]['amt']
        self._realized = 0.0
        self._avg_price = self._px

        self._records.append({'shares': self._shares, 'px': self._px, 'apx': self._avg_price, 'pnl': self._pnl+self._realized, 'unrealized': self._pnl, 'realized': self._realized})

        for trade in self._trades[1:]:
            self.exec(trade['amt'], trade['px'])

    def exec(self, amt, px):
        if sign(amt) == sign(self._shares):
            # increasing position
            self._avg_price = (self._avg_price*self._shares + px*amt)/(self._shares + amt)
            self._shares += amt
            self._pnl = (self._shares * (px-self._avg_price))
        else:
            if abs(amt) > abs(self._shares):
                # do both
                diff = self._shares
                self._shares = amt + self._shares

                # take profit/loss
                self._realized += (diff * (px - self._avg_price))

                # increasing position
                self._avg_price = px

            else:
                # take profit/loss
                self._shares += amt

                self._pnl = (self._shares * (px-self._avg_price))
                self._realized += (amt * (self._avg_price-px))
        self._records.append({'shares': self._shares, 'px': px, 'apx': self._avg_price, 'pnl': self._pnl+self._realized, 'unrealized': self._pnl, 'realized': self._realized})

    def record(self, index):
        return self._records[min(index, len(self._records))]


PNLH = pnl_helper()


@app.route('/pnl/<no>')
def pnl(no):
    rec = PNLH.record(int(no))
    rec['symbol'] = '1'
    rec['no'] = no
    return ujson.dumps(PNLH.record(int(no)))


@app.route('/pnlall')
def pnlall():
    return ujson.dumps(PNLH._records)
