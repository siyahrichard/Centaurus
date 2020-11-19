const {Candle,Symbol,ExchangeBase}=require('../../core/js/model.js');
class Exchange extends ExchangeBase{
  static base_url="https://api.kucoin.com";
  static getTickers(symbols,callback=null){
    for(var i=0;i<symbols.length;i++){
      var url=Exchange.base_url+"/api/v1/market/orderbook/level1?symbol="+symbols[i].code;
      console.log(url);
    }
  }
}
exports.Exchange=Exchange;
