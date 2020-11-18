class Order{
  constructor(symbol,volume,price,type,clientId,ticket,id,executed_volume){
    this.symbol=symbol; this.price=price; this.type=type; this.volume=volume;
    this.openTime=0; this.closeTime; this.closePrice=0;
    this.tp=0; this.sl=0; this.mode=0; this.ticket=ticket;
    this.executed_volume=executed_volume; this.clientId=clientId; this.id=id;
  }
}
