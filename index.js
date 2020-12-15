const {SCF,Context,transmit,Candle,Symbol,ExchangeBase}=require('./core/js/model.js');
const {config}=require('./config/config.js');
const {Exchange}=require('./exchanges/js/'+config.exchange+'.js');
const HTTP=require('http');
const URL=require('url');
const {API}=require('./API.js');
const ReadLine=require("readline");
const Commander=require('./Commander.js');
console.log(Commander);
const rl=ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});
var readln_callback=Commander.exec;
const readln=function(){
  rl.question(">>> ",readln_back);
};
function readln_back(txt){
  if(readln_callback)readln_callback(txt,Context.activeObject);
  readln();
};


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

readln();
