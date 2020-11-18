class FinanceEvent:
    def __init__(self,symbol,tick,candle,prev_candle):
        self.symbol=symbol
        self.tick=tick
        self.candle=candle
        self.prev_candle=prev_candle
