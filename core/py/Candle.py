class Candle:
    def __init__(self,time,period,open,high,low,close,volume,symbol=None):
        self.time=time
        self.period=period
        self.open=open
        self.high=high
        self.low=low
        self.close=close
        self.volume=volume
        self.symbol=symbol
    @staticmethod
    def get(index,period,symbol):
        c=Candle(0,period,0,0,0,0,0,symbol)
        return c
