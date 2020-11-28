class InputParam:
    def __init__(self,title,name,defaultValue,userValue,typeName='int',start=0,step=0,stop=0):
        self.title=title
        self.name=name
        self.defaultValue=defaultValue
        self.userValue=userValue
        self.typeName=typeName
        #optimzations
        self.start=start
        self.step=step
        self.stop=stop
