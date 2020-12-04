var _=_gs;
var gse={};
gse.modeOpen="open";gse.modeClose="close";gse.modeToggle="toggle";
gse.positive=+1; gse.negative=-1; gse.neutral=0;
gse.notificationTimer=0; gse.vastRatio=1.4;gse.isVast=false;
gse.currentSidebarMode=gse.modeClose;
gse.messageCallback=null;
gse.events={};
gse.sidebar={};
gse.sidebar.menus=null;
gse.sidebar.currentMenuId=0;
gse.segment={};
gse.segment.stack=[];
gse.segment.stackSize=5;
gse.rootUrl="/";
gse.componentOpened=false;
gse.minHighResolution=1500;
gse.settings={sideSize:'min',vision:'dark'};
gse.start=function(){
	//TODO
	var ul=_('#sideMenuArea').get('ul')[0]; ul.val(''); gse.sidebar.buildMenu(ul);
	ul=_('#topMenuArea'); ul.val(''); gse.sidebar.buildMenu(ul);
	document.body.trigger('ready');
	gse.checkVast(); gse.checkPort();
	document.body.addEventListener("click",gse.events.bodyClick,false);
	window.addEventListener("resize",gse.events.windowResize,false);
	window.addEventListener("hashchange",gse.events.onhashchange,false);
	window.addEventListener("popstate",gse.events.onurlchange,false);

	if(localStorage){
		var settings=localStorage.getItem('gseSettings');
		if(settings){
			gse.settings=settings.parse();
		}
	}
	gse.sidebar.setSize(gse.settings.sideSize);
	document.body.attr('vision',gse.settings.vision);
};
gse.saveSettings=function(){
	localStorage.setItem('gseSettings',gse.settings.toJson());
};
gse.checkVast=function(){
	if((window.innerWidth/window.innerHeight)>=gse.vastRatio)gse.isVast=true;
	else gse.isVast=false;
	if(gse.isVast && document.body.attr('class').indexOf('with-top-menu')<0)gse.sidebar.show(gse.modeOpen);
	else gse.sidebar.show(gse.modeClose);
	document.body.attr('vast',gse.isVast?'true':'false');
	//check high resolution and 4k screens
	if(window.innerHeight> gse.minHighResolution || window.innerWidth> gse.minHighResolution)document.body.attr('hr','true');
	else document.body.attr('hr','false');
};
gse.checkPort=function(){
	if((window.innerHeight/window.innerWidth)>=gse.vastRatio){
		var ua=navigator.userAgent.toLowerCase();
		if(ua.indexOf('phone')>=0 || ua.indexOf('tablet')>=0 || ua.indexOf('mobile')>=0){
			document.body.attr('ort','port');
		}
	}
};
gse.sidebar.setSize=function(size){
	document.body.attr('sideSize',size);
	gse.sidebar.show(gse.modeOpen);
	gse.settings.sideSize=size; gse.saveSettings();
};
gse.setVision=function(vision){
	document.body.attr('vision',vision);
	gse.settings.vision=vision; gse.saveSettings();
};
gse.sidebar.show=function(mode){
	if(mode==gse.modeToggle){
		var current=document.body.attr('sidebar');
		if(current=="close")mode=gse.modeOpen;
		else mode=gse.modeClose;
	}
	gse.currentSidebarMode=mode;//store for fastening body click events
	document.body.attr('sidebar',mode);
};
gse.segment.put=function(data,navigation){
	gse.segment.stack.push({data:data,navigation:navigation});
	if(gse.segment.stack.length>gse.segment.stackSize)
		gse.segment.stack.splice(0,1);//remove oldest item
	_('#workArea').innerHTML="";
	_('#workArea').val(data);
	if(gse.segment.stack.length>1)_('#backBtn').removeClass('hide');
};
gse.segment.back=function(){
	gse.segment.stack.pop();
	var item=gse.segment.stack[gse.segment.stack.length-1];
	if(item){
		_('#workArea').innerHTML="";
		_('#workArea').val(item.data);
		if(item.navigation>0){
			gse.sidebar.currentMenuId=item.navigation;
			var lis=_('#sideMenuArea').get("li");
			for(var i=0;i<lis.length;i++){
				if(lis[i].attr('item-id')==item.navigation)lis[i].attr('selected','true');
				else lis[i].attr('selected','false');
			}
		}
	}
	if(gse.segment.stack.length<=1)_('#backBtn').addClass('hide');
};
gse.notify=function(text,type,vertical_pos,horizontal_pos,duration){
	if(text){
		//show notification
		clearTimeout(gse.notificationTimer);
		if(!type)type="info";
		if(!duration)duration=5;//5 seconds
		if(!horizontal_pos)horizontal_pos="side";
		if(!vertical_pos)vertical_pos="top";
		var h=horizontal_pos.toLowerCase();
		_('#notifyDialog').innerHTML=text;
		_('#notifyDialog').attr("class",type+" "+(vertical_pos.toLowerCase()=='bottom'?'bottom':'top')+
			" "+(h=='left' || h=='right'?h:'side'));
		_('#notifyDialog').attr('mode','open');
		gse.notificationTimer=setTimeout(gse.notify,duration*1000);
	}else{
		//hide notification
		_('#notifyDialog').attr('mode','close');
	}
};
gse.message=function(text,positiveTitle,negativeTitle,neutralTitle,callback){
	gse.messageCallback=callback;

	if(positiveTitle){_('#messagePosBtn').removeClass('hide');_('#messagePosBtn').innerHTML=positiveTitle;}
	else _('#messagePosBtn').addClass('hide');

	if(negativeTitle){_('#messageNegBtn').removeClass('hide');_('#messageNegBtn').innerHTML=negativeTitle;}
	else _('#messageNegBtn').addClass('hide');

	if(neutralTitle){_('#messageNeuBtn').removeClass('hide');_('#messageNeuBtn').innerHTML=neutralTitle;}
	else _('#messageNeuBtn').addClass('hide');
	_('#messageText').innerHTML=text;
	_('#messageContainer').attr('class','');
};
gse.setMessageResult=function(result){
	if(gse.messageCallback)gse.messageCallback(result);
	gse.messageCallback=null;
	_('#messageContainer').attr('class','hide');
};
gse.confirm=function(text,callback){
	gse.message(text,StrRes['ok'],null,StrRes['cancel'],callback);
};
gse.isOverComponent=false;
gse.overComponent=function(e){
	gse.isOverComponent=true;
};
gse.leaveComponent=function(e){ gse.isOverComponent=false; setTimeout(gse.leaveComponentBack,100); }
gse.leaveComponentBack=function(e){
	if(!gse.isOverComponent){
		_('.gse-component').addClass('closed');
	}

};
gse.showComponent=function(e){
	//console.log(e);
	if(e.target.nodeName.toLowerCase()=="li"){
		var li=e.target;
		var d=null;
		if(li.componentObject)d=li.componentObject;
		else{
			var type=li.attr('component-type');
			var view=parseInt(li.attr('component-view'));
			var d=_.create();
			d.attr('class','gse-component closed');//start from closed becuse of opacity animation
			li.componentObject=d; //keep to reuse
			d.addEventListener('mouseleave',gse.leaveComponent,false);
			d.addEventListener('mouseover',gse.overComponent,false);
			document.body.add(d);
			if(type && view && gs.app.form[type]){
				var o=new gs.app.form[type].blueprint();
				gs.app.buildForm(o,view,d,type);
			}else console.log('error while building component - object UI not found');
		}
		d.removeClass('closed');
		gse.componentOpened=true;
		var r=li.getClientRects()[0];
		if(li.parentElement.attr('id')=="topMenuArea" || document.body.attr('ort')=='port'){
			d.style.left=r.x+'px';
			d.style.top=(r.y+r.height)+'px';
			d.addClass('top');
		}else{
			d.style.left=(r.x+r.width)+'px';
			d.style.top=(r.y)+'px';
			d.addClass('side');
		}
	}else{
		e.target.parentElement.trigger(e.type);
	}
	if(e.type=="contextmenu")e.preventDefault();
	else if(e.type=="mouseover")gse.overComponent();
};
gse.sidebar.buildMenu=function(ul){
	if(gse.sidebar.menus){
		//var ul=_.create('ul');
		for(var i=0;i<gse.sidebar.menus.length;i++){
			var li=_.create('li');
			if(gse.sidebar.menus[i].icon){
				var img=_.create('img');
				img.attr('src',gse.sidebar.menus[i].icon);
				li.add(img);
			}
			if(gse.sidebar.menus[i].graph){
				var graph=_.create('div');
				graph.attr('class',"graph");
				graph.attr('icon',gse.sidebar.menus[i].graph);
				li.add(graph);
			}
			if(gse.sidebar.menus[i].title){
				var title=_.create('span');
				title.val(StrRes[gse.sidebar.menus[i].title]);
				li.add(title);
			}
			if(gse.sidebar.menus[i].class){
				li.attr('class',gse.sidebar.menus[i].class);
			}
			li.attr('keep',gse.sidebar.menus[i].keep?'true':'false');
			if(gse.sidebar.menus[i].component){
				li.addEventListener(gse.sidebar.menus[i].component.event,gse.showComponent,false);
				li.attr('component-type',gse.sidebar.menus[i].component.type);
				li.attr('component-view',gse.sidebar.menus[i].component.view);
				if(gse.sidebar.menus[i].component.event=="click"){
					li.attr('onclick','event.stop();');
				}else if(gse.sidebar.menus[i].component.event=="mouseover"){
					li.addEventListener('mouseleave',gse.leaveComponent,false);
				}
			}
			li.attr('item-id',gse.sidebar.menus[i].id);
			li.attr('selected','false');
			if(gse.sidebar.menus[i].navigator)li.attr('navigator','true');
			li.addEventListener('click',gse.sidebar.onItem);
			ul.add(li);
		}
		//_('#sideMenuArea').innerHTML="";
		//_('#sideMenuArea').val(ul);
	}
};
gse.sidebar.selectMenu=function(id,trigger_event=true){
	gse.sidebar.currentMenuId=id;
	_('#sideMenuArea').get("li").attr("selected","false");
	_('#sideMenuArea').get('[item-id="'+gse.sidebar.currentMenuId+'"').attr("selected","true");
	_('#topMenuArea').get("li").attr("selected","false");
	_('#topMenuArea').get('[item-id="'+gse.sidebar.currentMenuId+'"').attr("selected","true");
	if(_('#sideMenuArea').get('[item-id="'+gse.sidebar.currentMenuId+'"')[0].attr('keep')=='false' && document.body.attr('ort')!='land')gse.sidebar.show('close');
	if(trigger_event)document.body.trigger("selectmenu");
};
gse.sidebar.onItem=function(e){
	var li=e.target;
	while(li.nodeName.toLowerCase()!="li")li=li.parentElement;
	var id=parseInt(li.attr('item-id'));
	gse.sidebar.selectMenu(id);
};
/*--------------------- GSE Navigation ---------------------*/
//----------Hash
gse.allowHashEvent=true; gse.hash="";
gse.hnav=function(hash,trigger=true){
	if(!trigger){
		gse.allowHashEvent=false;
		setTimeout(gse.enableHashEvent,100);
	}
	window.location.hash=hash;
};
gse.enableHashEvent=function(){gse.allowHashEvent=true;};
gse.events.onhashchange=function(e){
	if(gse.allowHashEvent){
		gse.hash=window.location.hash.substring(1);
	}
}
//-----------URL
gse.url="";
gse.nav=function(path,title=null,from_root=true,trigger=true){
	if(!title)title=document.title;
	if(from_root){
		path=gse.rootUrl+path.replace(/^\//,"");
	}else{
		path=(window.location.pathname+"/"+path).replace(/\/+/,"/");
	}
	window.history.pushState("object or string",title,path);
	if(trigger)gse.events.onurlchange();
};
gse.events.onurlchange=function(e){
	gse.url=window.location.pathname.replace(new RegExp("^"+gse.rootUrl),"");
	document.trigger('urlchange');
};
/*----------------------- GSE EVENTS -----------------------*/
gse.events.bodyClick=function(e){
	if(!gse.isVast && gse.currentSidebarMode==gse.modeOpen)gse.sidebar.show(gse.modeClose);
	if(gse.componentOpened){
		_('.gse-component').addClass('closed');
		gse.componentOpened=false;
	}
};
gse.events.windowResize=function(e){
	gse.checkVast();
};
