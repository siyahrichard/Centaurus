class Candle{
  constructor(time,period,open,high,low,close,volume,symbol=null){
    this.time=time; this.open=open; this.high=high; this.low=low; this.close=close; this.volume=volume;
    this.symbol=symbol;
  }
  static get(index,period,symbol){
    return new Candle(0,period,0,0,0,0,0,symbol);
  }
}
