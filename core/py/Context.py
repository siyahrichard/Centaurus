class Context:
    activeObject=None
    def __init__(self,strategy,symbols,inputs,memo):
        self.stategy=strategy
        self.symbols=symbols
        self.inputs=inputs
        self.memo=memo
    def activate(self):
        Context.activeObject=self
