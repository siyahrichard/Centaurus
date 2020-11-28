class MACrossoverStrategy extends Strategy{
  constructor(symbols,inputs,context){
    this.symbols=symbols?symbols:[];
    this.inputs=inputs?inputs:MACrossoverStrategy.getDefaultInputs();
    this.context=context;

    this.symbol=this.symbols[0];
  }
  onInit(){
    var fastIndiInputs=SMA.getDefaultInputs();
    fastIndiInputs.period=InputParam.getByName(this.inputs,"inp_fast").value;
    fastIndiInputs.apply="close";

    var slowIndiInputs=SMA.getDefaultInputs();
    slowIndiInputs.period=InputParam.getByName(this.inputs,"inp_slow").value;
    slowIndiInputs.apply="close";



    this.context.addIndicator(this.symbol,period,SMA,fastIndiInputs);
    this.context.addIndicator(this.symbol,period,SMA,slowIndiInputs);

    return true;
  }
  onTick(e){
    return true;
  }
  onTimer(){
    return true;
  }
  static getDefaultInputs(){
    return [
      new InputParam("Fast MA","inp_fast",14,14,'int',2,2,30),
      new InputParam("Slow MA","inp_slow",20,20,'int',4,2,100),
      new InputParam("Volume","inp_vol",0.01,0.01,'float',0.01,0.01,0.01)
      new InputParam("Take profit","inp_tp",0.1,0.1,'float',0.1,0.1,0.1),
      new InputParam("Stop loss","inp_sl",0.1,0.1,'float',0.1,0.1,0.1),
    ];
  }
}
