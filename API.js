const {SCF,transmit,Candle,Symbol,ExchangeBase}=require('./core/js/model.js');
const {config}=require('./config/config.js');
const {Exchange}=require('./exchanges/js/'+config.exchange+'.js');
const HTTP=require('http');
const URL=require('url');

class API{
  static run(url,request,response,context){
    var parts=url.pathname.split(/\/+/);
    switch(parts[2].toLowerCase()){
      case 'chart':
        if(parts.length>4){
          var timeframe=ExchangeBase.getTimeframeSeconds(parts[3]);
          var symbol=parts[4].toUpperCase();
          var count=(parts[5])?parseInt(parts[5]):100;
          var from=(parts[6])?parseInt(parts[6]):Math.floor(Date.now()/1000/timeframe);
          Exchange.getCandles(symbol,timeframe,from,count,function(res){
            var scf=new SCF();
            var dataset1=[];
            for(var i=0;i<res.length;i++){
              dataset1.push([res[i].open,res[i].close,res[i].high,res[i].low,res[i].volume]);
            }
            scf.datasets.push(dataset1);
            response.write(JSON.stringify(scf)); response.end();
          });
        }
        break;
      case 'strategy':
      if(parts[3]){
          if(parts[3].toLowerCase()=="instance"){
            var data=[];
            for(var i=0;i<context.strategyInstances.length;i++){
              var summery={};
              summery.name=context.strategyInstances[i].getName();
              summery.inputs=context.strategyInstances[i].inputs;
              summery.symbols=context.strategyInstances[i].symbols;
              data.push(summery);
            }
            response.write(JSON.stringify(data,null,4));
            response.end(); return;
          }
        }
        response.write(JSON.stringify(context.strategies,null,4));
        response.end(); return;
        break;
    }
  }
}
exports.API=API;
