class ExchangeBase:
    @staticmethod
    def getSymbols(codes,callback=None):
        pass
    @staticmethod
    def getCandles(symbol,period=3600,from=0,count=100,callback=None):
        pass
    @staticmethod
    def getTickers(symbols,callback=None):
        pass
    @staticmethod
    def sendOrder(order,callback=None):
        pass
    @staticmethod
    def findOrder(params):
        pass
    @staticmethod
    def getNamedPeriodOf(period):
        pass
    @staticmethod
    def getNamedExecutionModeOf(execution):
        pass
