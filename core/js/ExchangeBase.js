class ExchangeBase{
  static getSymbols(codes,callback){}
  static getTickers(symbols,callback=null){}
  static getCandles(symbol,period=3600,from=0,count=100,callback=null){}
  static sendOrder(order,callback=null){}
  static findOrder(params){}
  static closeOrder(order){}
  static getNamedPeriodOf(period){}
  static getNamedExecutionModeOf(execution){}
  static getTimeframeSeconds(tf_name){
    var tfs={
      'm1':60,
      'm5':300,
      'm10':600,
      'm15':900,
      'm30':1800,
      'h1':3600,
      'h4':14400,
      'h8':28800,
      'd1':86400,
      'w1':604800
    };
    return tfs[tf_name.toLowerCase()];
  }
}
