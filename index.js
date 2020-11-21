const {transmit,Candle,Symbol,ExchangeBase}=require('./core/js/model.js');
const {config}=require('./config/config.js');
const {Exchange}=require('./exchanges/js/'+config.exchange+'.js');


//Exchange.getTickers([new Symbol('BTC-USDT'),new Symbol('XRP-USDT')]);

Exchange.getTicks('btcusdt,ethusdt,ltcusdt',function(res){
  console.log(res);
});
