const {transmit,Candle,Symbol,Tick,ExchangeBase}=require('../../core/js/model.js');
class Exchange extends ExchangeBase{
  static base_url="https://api.kucoin.com";
  static symbols=null;
  static getSymbols(codes,callback){
    if(Exchange.symbols){
      var ret=[];
      if(typeof(codes)=="string")codes=codes.toUpperCase().replace('-','').split(/[\s,]+/);
      for(var i=0;i<Exchange.symbols.length;i++){
        if(codes.indexOf(Exchange.symbols[i].code.replace('-',''))>=0)ret.push(Exchange.symbols[i]);
      }
      if(callback)callback(ret);
      return ret;
    }else{
      transmit(Exchange.base_url+"/api/v1/symbols","GET",null,function(res){
        var o=JSON.parse(res);
        if(o.code=="200000" && o.data){
          Exchange.symbols=[];
          for(var i=0;i<o.data.length;i++){
            Exchange.symbols.push(new Symbol(o.data[i].symbol,o.data[i].baseCurrency,o.data[i].quoteCurrency,
              parseFloat(o.data[i].baseMinSize),parseFloat(o.data[i].quoteMinSize),
              parseFloat(o.data[i].baseIncrement),parseFloat(o.data[i].quoteIncrement)
            ));
          }
          Exchange.getSymbols(codes,callback);
        }else if(callback)callback(null);
      });
    }
  }
  static getTicks(symbols,callback=null){
    //normalize symbols
    if(typeof(symbols)=='string')symbols=symbols.toUpperCase().replace('-','').split(/[\s,]+/);
    else if(symbols instanceof Array){
      for(var i=0;i<symbols.length;i++){
        if(symbols[i] instanceof Symbol) symbols[i]=symbols[i].code.toUpperCase().replace('-','');
        else symbols[i]=symbols[i].toUpperCase().replace('-','');
      }
    }
    console.log(symbols);
    //request the web
    transmit(Exchange.base_url+"/api/v1/market/allTickers","GET",null,function(res){
      var o=JSON.parse(res);
      if(o.code=="200000" && o.data){
        var ret=[]; var now=o.data.time;
        var ticker=o.data.ticker;
        for(var i=0;i<ticker.length;i++){
          if(symbols.indexOf(ticker[i].symbol.toUpperCase().replace('-',''))>=0){
            ret.push(new Tick(ticker[i].symbol,now,parseFloat(ticker[i].sell),parseFloat(ticker[i].buy),
            parseFloat(ticker[i].vol),parseFloat(ticker[i].changeRate)));
          }
        }
        if(callback)callback(ret);
      }else if(callback)callback(null);
    });
  }
  static getCandles(symbol,period=3600,from=0,count=100,callback=null){
    var now=parseInt(Date.now()/1000) - from*period;
    var start=now - count*period;
    var tf=(period/60)+"min";
    if(period>=3600){
      if(period>=86400){
        if(period>=604800){
          tf=(period/604800)+"week";
        }else tf=(period/86400)+"day";
      }else tf=(period/3600)+"hour";
    }console.log('timeframe:'+tf);
    if(typeof(symbol)=="object")symbol=symbol.code;
    transmit(Exchange.base_url+'/api/v1/market/candles?type='+tf+'&symbol='+symbol+
            '&startAt='+start+'&endAt='+now,'GET',null,function(res){
      var o=JSON.parse(res);
      if(o.code=='200000' && o.data){
        var ret=[]; var c=null;
        for(var i=0;i<o.data.length;i++){
          c=o.data[i];
          ret.push(new Candle(parseInt(c[0]),period,parseFloat(c[1]),parseFloat(c[3]),parseFloat(c[4]),parseFloat(c[2]),parseFloat(c[5]),symbol));
        }
        if(callback)callback(ret.reverse());
      }
    });
  }
}
exports.Exchange=Exchange;
