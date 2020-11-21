class ExchangeBase{
  static getSymbols(codes,callback){}
  static getTickers(symbols,callback=null){}
  static getCandles(symbol,period=3600,from=0,count=100,callback=null){}
  static sendOrder(order){}
  static findOrder(params){}
  static closeOrder(order){}
  static getNamedPeriodOf(period){}
  static getNamedExecutionModeOf(execution){}
}
