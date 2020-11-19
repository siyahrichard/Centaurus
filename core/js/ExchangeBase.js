class ExchangeBase{
  static getSymbols(codes){}
  static getCandles(symbol,from=0,count=100){}
  static getTickers(symbols,callback=null){}
  static sendOrder(order){}
  static findOrder(params){}
  static closeOrder(order){}
  static getNamedPeriodOf(period){}
  static getNamedExecutionModeOf(execution){}
}
