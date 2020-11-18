class Order:
    def __init__(self,symbol,volume,price,type,clientId,ticket,id,executed_volume):
        self.symbol=symbol
        self.price=price
        self.volume=volume
        self.type=type
        self.openTime=0
        self.closeTime
        self.closePrice=0
        self.executed_volume=executed_volume
        self.tp=0
        self.sl=0
        self.mode=0
        self.ticket=ticket
        self.clientId=clientId
        self.id=id
