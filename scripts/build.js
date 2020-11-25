const fs=require('fs');
var coreClasses=[
  'SCF','SCFDataset',
  'Candle','Context','ExchangeBase','FinanceEvent','Indicator','Order','Strategy','StrategyInput',
  'Symbol','Tester','Tick','transmit'
];

var txt=""; var ending="";
for(var i=0;i<coreClasses.length;i++){
  txt+=fs.readFileSync('./core/js/'+coreClasses[i]+'.js',{encoding:'utf8',flag:'r'})+"\r\n";
  ending+="exports."+coreClasses[i]+"="+coreClasses[i]+";\r\n";
}
console.log(txt+ending);

fs.writeFileSync('./core/js/model.js',txt+ending,{encoding:'utf8',flag:'w'});
