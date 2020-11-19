const {Candle,Symbol,ExchangeBase}=require('./core/js/model.js');
const {config}=require('./config/config.js');
const {Exchange}=require('./exchanges/js/'+config.exchange+'.js');

var candle=new Candle(0,0,1,2,3,4,5,new Symbol('xrpusdt','xrp','usdt'));
console.log(candle);

Exchange.getTickers([new Symbol('BTC-USDT'),new Symbol('XRP-USDT')]);
