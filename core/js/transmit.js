const querystring=require('querystring');
const HTTP=require('http');
const HTTPS=require('https');
const FS=require('fs');
const URL=require('url');

function transmit(_url,request_type,data,callback){
  if(Context.activeObject)Context.activeObject.print("Requesting: "+_url)
  else console.log("Requesting: "+_url);
  var url=URL.parse(_url);
  var protocol=url.protocol.toLowerCase()=="http:"?HTTP:HTTPS;
  if(data){
    data=querystring.stringify(data);
  }
  var options={
    host:url.host,
    port: url.protocol.toLowerCase()=='http:'?'80':'443',
    path: url.path,
    method: request_type
  };
  if(request_type.toUpperCase()=="POST" && data){
    options.headers={
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':Buffer.byteLength(data)
    };
  }
  var req=protocol.request(options,function(res){
    res.setEncoding('utf8');
    var result="";
    res.on('data',function(chunk){
      result+=chunk;
    });
    res.on('end',function(){
      if(callback)callback(result);
    });
    res.on('error',function(error){
      console.log(error);
      if(callback)callback(null);
    });
  });
  if(request_type.toUpperCase()=="POST" && data){
    req.write(data);
  }
  req.end();
};
