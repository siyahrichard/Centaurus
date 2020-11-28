class Indicator{
  constructor(symbol,timeframe,inputs){
    this.buffers=[];
    this.inputs=inputs?inputs:Indicator.getDefaultInputs()
  }
  onCalculate(calculated,totals){}
  getUID(){return "_";}
  static getDefaultInputs(){
    return [];
  }
}
