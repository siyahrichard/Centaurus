class ExchangeBase:
    @staticmethod
    def getSymbols(codes,callback=None):
        pass
    @staticmethod
    def getCandles(symbol,from=0,count=100,callback=None):
        pass
    @staticmethod
    def getTickers(symbols,callback=None):
        pass
    @staticmethod
    def sendOrder(order):
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
