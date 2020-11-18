class Order:
    def __init__(self,symbol,price,type,clientId,ticket,id):
        self.symbol=symbol
        self.price=price
        self.type=type
        self.openTime=0
        self.closeTime
        self.closePrice=0
        self.tp=0
        self.sl=0
        self.mode=0
        self.ticket=ticket
        self.clientId=clientId
        self.id=id
