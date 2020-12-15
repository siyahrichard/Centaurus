const {ExchangeBase}=require('./core/js/model.js');
exports.exec=function(txt,context){
  var parts=txt.split(/\s+/);
  switch(parts[0].toLowerCase()){
    case 'get':
      ///////////////////////////////////////////////
      switch(parts[1].toLowerCase()){
        case 'candle':
          if(parts.length==5){
            context.getCandle(parts[2].toUpperCase(),
                  ExchangeBase.getTimeframeSeconds(parts[3].toLowerCase()),
                  parseInt(parts[4]),function(res){
                      console.log(res);
                  });
          }
          break;
        case 'tick':
          var symbol=parts[2].toUpperCase();
          context.exchange.getTicks([symbol],function(res){
              console.log("Ask: "+res[symbol].ask+" Bid: "+res[symbol].bid);
          });
      }
      ///////////////////////////////////////////////
      break;
      case 'log':
        context.flushPrint();
        break;
  }
};
/*commands
get candle symbol period index


*/
