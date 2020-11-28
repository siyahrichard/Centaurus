const {InputParam,Indicator,Candle}=require('../../core/js/model.js');
class SMA extends Indicator{
  constructor(symbol,timeframe,inputs){
    this.symbol=symbol; this.timeframe=timeframe; this.buffers=[];
    this.buffers[0]=[];
    this.inputs=inputs?inputs:SMA.getDefaultInputs();
  }
  onCalculate(calculated,totals){
    var value=0; var candle=null; var first= (calculated > period) ? calculated - period : period;
    var period=InputParam.getByName(this.inputs,'period').value;
    var apply=InputParam.getByName(this.inputs,'apply_price').value;
    var candle=null;

    if(first==period){
      value=0;
      for(var j=0;j<period;j++){
        candle=Candle.get(symbol,timeframe,i+j);
        if(candle)value+=candle[apply];
      }
      this.buffers[0][first]=value/period;
      first++; //point frist to next
    }
    for(var i=first;i<totals;i++){
      value=0;
      candle=Candle.get(symbol,timeframe,i+j);
      if(candle)value=candle[apply];
      this.buffers[0][i]= this.getCurrentEMA(value,this.buffers[0][i-1]);
    }
  }
  getCurrentEMA(now_value,pervious_ema,period,smoothing=2){
    return (now_value * (smoothing / (1+period) )) + (pervious_ema * (1- (smoothing / (1+period) ) ));
  }
  getUID(){
    return this.symbol.toLowerCase().replace('-','_')+'_'+this.timeframe+'_'+this.period;
  }
  static getDefaultInputs(){
    return [
      new InputParam("Period","period",14,14,'int',0,0,0),
      new InputParam("Apply","apply_price",'close','close','string',0,0,0),
    ];
  }
}
