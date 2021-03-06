const {InputParam,Indicator,Candle}=require('../../core/js/model.js');
class SMA extends Indicator{
  constructor(symbol,timeframe,inputs){
    this.symbol=symbol; this.timeframe=timeframe; this.buffers=[];
    this.buffers[0]=[];
    this.inputs=inputs?inputs:SMA.getDefaultInputs();
  }
  onCalculate(calculated,totals){
    var sum=0; var candle=null; var first= (calculated > period) ? calculated - period : period;
    var period=InputParam.getByName(this.inputs,'period').value;
    var apply=InputParam.getByName(this.inputs,'apply_price').value;

    for(var i=first;i<totals;i++){
      var sum=0;
      for(var j=0;j<period;j++){
        candle=Candle.get(symbol,timeframe,i+j);
        if(candle)sum+=candle[apply];
      }
      this.buffers[0][i]=sum/period;
    }
  }
  getUID(){
    var period=InputParam.getByName(this.inputs,'period').value;
    var apply=InputParam.getByName(this.inputs,'apply_price').value;
    return this.symbol.toLowerCase().replace('-','_')+'_'+this.timeframe+'_'+period+"_"+apply;
  }
  static getDefaultInputs(){
    return [
      new InputParam("Period","period",14,14,'int',0,0,0),
      new InputParam("Apply","apply_price",'close','close','string',0,0,0),
    ];
  }
}
