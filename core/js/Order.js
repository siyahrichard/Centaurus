class Order{
  constructor(symbol,price,type,clientId,ticket,id){
    this.symbol=symbol; this.price=price; this.type=type;
    this.openTime=0; this.closeTime; this.closePrice=0;
    this.tp=0; this.sl=0; this.mode=0;
    this.ticket=ticket; this.clientId=clientId; this.id=id;
  }
}
