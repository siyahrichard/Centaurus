const {SCF,Context,transmit,Candle,Symbol,ExchangeBase}=require('./core/js/model.js');
const {config}=require('./config/config.js');
const {Exchange}=require('./exchanges/js/'+config.exchange+'.js');
const HTTP=require('http');
const URL=require('url');
const {API}=require('./API.js');

//Exchange.getTickers([new Symbol('BTC-USDT'),new Symbol('XRP-USDT')]);

/*Exchange.getCandles('LTC-USDT','3600',0,3,function(res){
  console.log(res);
});*/

if(config.globalTickDelay)Context.globalTickDelay=config.globalTickDelay;
var context=new Context(Exchange);
context.activate(config.strategies);

function log(x){console.log(x);}
HTTP.createServer((request,response)=>{
  response.writeHead(200, {'Content-Type': 'application/json'});
  var url=URL.parse(request.url,true);
  var path_parts=url.pathname.split(/\/+/);
  var ro={code:0,data:null,message:null};
  if(path_parts[1]=="api"){
    API.run(url,request,response,Context.activeObject);
  }else{
    ro.message="invalid request path";
    response.write(JSON.stringify(ro));
    response.end();
  }
}).listen(config.port);
