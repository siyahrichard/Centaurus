class Candle{
  constructor(time,period,open,high,low,close,volume,symbol=null){
    this.time=time; this.open=open; this.high=high; this.low=low; this.close=close; this.volume=volume;
    this.symbol=symbol; this.period=period;
  }
  static get(symbol,period,index){
    return Context.activeObject.getCandle(symbol,period,index);
  }
  static shift(value=0,period=3600){
    return Math.floor(Date.now()/1000/period) - value;
  }
}
