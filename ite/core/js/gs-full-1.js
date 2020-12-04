function gs()
{
};




gs.config=function(mode)
{
	gs.select.create=gsh.create;
	gs.select.send=gsnet.send;
	
	HTMLElement.prototype.attr=gsh.attr;
	HTMLElement.prototype.create=gsh.create;
	HTMLElement.prototype.val=gsh.val;
	HTMLElement.prototype.add=gsh.add;
	HTMLElement.prototype.remove=gsh.remove;
	HTMLElement.prototype.addClass=gsh.addClass;
	HTMLElement.prototype.removeClass=gsh.removeClass;
	HTMLElement.prototype.toggleClass=gsh.toggleClass;
	HTMLElement.prototype.get=gsh.get;
	HTMLElement.prototype.trigger=gsh.trigger;
	document.trigger=gsh.trigger;
	
	String.prototype.capitalize=gstring.capitalize;
	String.prototype.format=gstring.format;
	String.prototype.toInt=gstring.toInt;
	String.prototype.toFloat=gstring.toFloat;
	String.prototype.captalize=gstring.captalize;
	String.prototype.parse=gstring.parse;
	String.prototype.like=gstring.like;
	String.prototype.stripTags=gstring.stripTags;
	String.prototype.normalizeNumbers=gstring.normalizeNumbers;
	
	NodeList.prototype.attr=gsh.attr;
	NodeList.prototype.val=gsh.val;
	NodeList.prototype.remove=gsh.remove;
	NodeList.prototype.addClass=gsh.addClass;
	NodeList.prototype.removeClass=gsh.removeClass;
	NodeList.prototype.toggleClass=gsh.toggleClass;
	NodeList.prototype.indexOf=Array.prototype.indexOf;//add indexOf to NodeLists
	
	Object.prototype.toJson=function(){return JSON.stringify(this);};
	
	
	if(typeof(gsExtra)!="undefined"){
		gsExtra.selectedNodes=[];
		HTMLElement.prototype.selectable=gsExtra.selectable;
		HTMLElement.prototype.toggleSelect=gsExtra.toggleSelect;
		HTMLElement.prototype.select=gsExtra.select;
		HTMLElement.prototype.diselect=gsExtra.diselect;
		HTMLElement.prototype.movable=gsExtra.movable;
		gs.Gesture=gsGesture;
	}
	if(typeof(gsapp)!="undefined")gsapp.config();
	Event.prototype.stop=gsh.stopEvent;
};
gs.select=function(query,node,checkMultiple)
{
	if(!node)node=document;
	if(checkMultiple===undefined)checkMultiple=true;
	
	if(query.indexOf('/')>=0 && checkMultiple){
		var tmp=null; var q=null; index=0;
		queries=query.split("/"); var res=null;
		for(var i=0;i<queries.length;i++){
			q=queries[i];
			res=null;
			if(q.indexOf("[")>=0){
				if((r=/\[(\d+)\]/.exec(q))){
					q=q.replace(r[0],"");
					index=r[1].toInt();
				}
				else if((r=/\[\w+\]+/.exec(q))){
					res=gs.select(r[0],node);
					var rem=q.replace(r[0],'');
					index=0;
					if((r=/\[(\d+)\]/.exec(rem))){
						index=r[1].toInt();
					}
				}
			}else index=0;
			if(!res)res=gs.select(q,node,false);//select in last node
			if(res instanceof NodeList){
				node=res[index];
			}else{
				node=res;
			}
			if(!node)break;
		}
		return node;
	}else if(query[0]=="#")return node.querySelector(query);
	else return node.querySelectorAll(query);
};
function gsh()
{
};




gsh.load=function(type,url,callback)
{
	if(type.like("css")){
		var tag=document.createElement("link");
		tag.attr("rel","stylesheet");
		tag.attr("type","text/css");
		tag.attr("href",url);
	}else if(type.like("js") || type.like("javascript")){
		var tag=document.createElement('script');
		tag.attr("type","text/javascript");
		tag.attr("src",url);
	}
	if(callback)tag.onload=callback;
	document.head.add(tag);
};
gsh.attr=function(atr,value)
{
	if(this instanceof HTMLElement){
		if(value===undefined) return this.getAttribute(atr);
		else if(value===null)this.removeAttribute(atr);
		else this.setAttribute(atr,value);
	}else if(this instanceof NodeList){
		for(var i=0;i<this.length;i++)this[i].attr(atr,value);
	}
};
gsh.create=function(name)
{
	if(name)switch(name.toLowerCase()){
		case 'dialog':if(typeof(gsDialog)!="undefined")return gsDialog.create();break;
		case 'panel':if(typeof(gsPanel)!="undefined")return gsPanel.create();break;
		case 'closebutton':if(typeof(gsCloseButton)!="undefined")return gsCloseButton.create();break;
		case 'menu':if(typeof(gsMenu)!="undefined")return gsMenu.create();break;
		case 'combo':if(typeof(gsCombo)!="undefined")return gsCombo.create();break;
		case 'tab':
			if(typeof(gsTab)!="undefined")return gsTab.create();
			break;
		case 'tree':
			if(typeof(gsTree)!="undefined")return gsTree.create();
			break;
		case 'roller' : case 'rolleritems': if(typeof(gsRollerItems)!="undefined")return gsRollerItems.create(); break;
		case 'list' :  if(typeof(gsList)!="undefined")return gsList.create(); break;
	}
	return document.createElement(name?name:'div');
};
gsh.val=function(value)
{
	if(this instanceof HTMLElement){
		switch(this.nodeName.toLowerCase()){
			case 'input': case 'select': case 'textarea':
				if(value!==undefined)this.value=value;
				else return this.value;
				break;
			default:
				if(value!==undefined){
					if(value instanceof HTMLElement)this.add(value);
					else if(value instanceof Array){
						for(var i=0;i<value.length;i++)this.val(value[i]);
					}else this.innerHTML=value;
				}else return this.innerHTML;
				break;
		}
	}else if(this instanceof NodeList){
		var ret=[];
		for(var i=0;i<this.length;i++)ret[i]=this[i].val(value);
		return ret;
	}
};
gsh.add=function(element)
{
	this.appendChild(element);
};
gsh.remove=function(child)
{
	if(child)this.removeChild(child);
	else{
		if(this instanceof HTMLElement){
			this.parentElement.removeChild(this);
		}else if(this instanceof NodeList){
			for(var i=0;i<this.length;i++)this[i].remove();
		}
	}
};
gsh.addClass=function(cls)
{
	if(cls){
		if(this instanceof HTMLElement){
			if(cls.match(/\s+/)){var cs=cls.split(/\s+/);for(var i=0;i<cs.length;i++)this.addClass(cs[i]);return;}
			var current=this.attr('class');if(!current)current="";
			if(current.indexOf(cls)>=0){
				if(current.match(new RegExp("\\s+"+cls+"\\s+")))return;
				else if(current.match(new RegExp("^"+cls+"\\s+")))return;
				if(current.match(new RegExp("\\s+"+cls+"$")))return;
				if(current==cls)return;
			}
			if(current)current+=" ";
			current+=cls;
			this.attr('class',current);
		}else if(this instanceof NodeList){
			for(var i=0;i<this.length;i++)this[i].addClass(cls);
		}
	}
};
gsh.removeClass=function(cls)
{
	if(cls){
		if(this instanceof HTMLElement){
			if(cls.match(/\s+/)){var cs=cls.split(/\s+/);for(var i=0;i<cs.length;i++)this.removeClass(cs[i]);return;}
			var current=this.attr('class');if(!current)return;
			if(current.indexOf(cls)>=0){
				var reg=new RegExp("\\s+"+cls+"\\s+");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				reg=new RegExp("^"+cls+"\\s+");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				reg=new RegExp("\\s+"+cls+"$");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				if(current==cls)this.attr("class","");
			}
		}else if(this instanceof NodeList){
			for(var i=0;i<this.length;i++)this[i].removeClass(cls);
		}
	}
};
gsh.toggleClass=function(cls)
{
	if(cls){
		if(this instanceof HTMLElement){
			if(cls.match(/\s+/)){var cs=cls.split(/\s+/);for(var i=0;i<cs.length;i++)this.toggleClass(cs[i]);return;}
			var current=this.attr('class');if(!current)current="";
			if(current.indexOf(cls)>=0){
				var reg=new RegExp("\\s+"+cls+"\\s+");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				reg=new RegExp("^"+cls+"\\s+");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				reg=new RegExp("\\s+"+cls+"$");
				if(current.match(reg)){current=current.replace(reg," ");if(current.match(/^\s+$/))current=null;this.attr('class',current);return;}
				if(current==cls)this.attr("class","");
				return;
			}
			if(current)current+=" ";
			current+=cls;
			this.attr('class',current);
		}else if(this instanceof NodeList){
			for(var i=0;i<this.length;i++)this[i].toggleClass(cls);
		}
	}
};
gsh.get=function(query)
{
	return gs.select(query,this);
};
gsh.stopEvent=function()
{
	if(this.stopPropagation)this.stopPropagation();
	this.cancelBubble=true;
};
gsh.trigger=function(type)
{
	return this.dispatchEvent(new Event(type));
};
function gstring()
{
};




gstring.capitalize=function()
{
	return this[0].toUpperCase()+(this.substring(1,this.length).toLowerCase());
};
gstring.parseXml=function(xml)
{
	if (window.DOMParser){
	    parser = new DOMParser();
	    xmlDoc = parser.parseFromString(xml, "text/xml");
	}else{
	    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	    xmlDoc.async = false;
	    xmlDoc.loadXML(xml);
	}
	return xmlDoc;
};
gstring.format=function(data,dict)
{
	var arg=this; var label='';
	if(data instanceof Array){
		for(var i=0;i<data.length;i++){
			arg=arg.replace(new RegExp("\\{"+i+"\\}","g"),data[i]);
		}
	}else if(typeof(data)=="object"){
		var pat=/\%([\w\/\-_]+)\%/;
		var val=null;
		while((r=pat.exec(arg))){
			if(r[1].indexOf("/")>=0){
				val=gsapp.getAttributeByPath(data,r[1]);
				arg=arg.replace(r[0],val || val===0?val:"");
			}else{
				if(r[1].match(/\-lbl$/)){
					label=r[1].replace(/\-lbl$/,'');
					if(dict)if(dict[label]){ arg=arg.replace(r[0],dict[label]); continue;}
				}
				arg=arg.replace(r[0],
					data[r[1]] || data[r[1]]===0 ? data[r[1]] : ""
				);
			}
		}
	}
	return arg+"";
};
gstring.toInt=function()
{
	return parseInt(this.normalizeNumbers());
};
gstring.toFloat=function()
{
	return parseFloat(this.normalizeNumbers());
};
gstring.parse=function()
{
	try{ return JSON.parse(this); }catch(e){console.log("Warning: the string : ("+this+") is not json string.");}
	return null;
};
gstring.like=function(arg)
{
	if(this.toLowerCase()==arg.toLowerCase())return true;
	return false;
};
gstring.stripTags=function()
{
	return this.replace(/(<([^>]+)>)/ig,"").replace(/\&[\w\#]+;/ig,"");
};
gstring.normalizeNumbers=function()
{
	var enNums=[0,1,2,3,4,5,6,7,8,9];
	var faNums=['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
	var reg=null;
	var ret=this;
	for(var i=0;i<10;i++){
		reg=new RegExp(faNums[i],'g');
		ret=ret.replace(reg,enNums[i]);
	}
	return ret;
};
function gsnet(url,callback,method)
{
	
	this.url=null;
	this.callback=null;
	this.error=null;
	this.progress=null;
	this.data=null;
	this.method=null;
this.url=url?url:''; this.callback=callback?callback:null;  this.method=method?method:'GET'; this.data={};
	
	this.add=function(key,val)
	{
		this.data[key]=val;
		return this;
	};
	this.ifAdd=function(cond,key,val)
	{
		if(cond)this.data[key]=val;
		return this;
	};
	this.commit=function()
	{
		gsnet.send(this);
	};
};




gsnet.comon=function(o)
{
	
};
gsnet.send=function(req)
{
	if(!req.method)req.method="GET";
	if(!req.enctype)req.enctype='application/x-www-form-urlencoded';
	
	var xhr=new XMLHttpRequest();
	if(req.callback)xhr.callback=req.callback;
	if(req.onerror)xhr.onerror=req.onerror;
	
	xhr.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       if(req.callback)req.callback(this.responseText);
	    }
	};
	var query="";
	if(req.data){
		var keys=Object.keys(req.data);
		if(req.enctype!="multipart/form-data"){
			for(var i=0;i<keys.length;i++){
				if(query)query+="&";
				query+=keys[i]+"="+encodeURIComponent(req.data[keys[i]]);
			}
			if(req.method.like('get')) req.url+= (req.url.indexOf('?')<0?"?":"&")+query;
		}
	}
	
	try{
		xhr.open((req.method.like('get')?"GET":"POST"), req.url, true);
		xhr.withCredentials=true;
		xhr.setRequestHeader('Content-type',req.enctype);
		if(req.enctype!="multipart/form-data" || (!req.data)){
			xhr.send(req.method.like('post') && query?query:null);
		}else if(req.enctype=="multipart/form-data"){
			var fd=new FormData();
			for(var i=0;i<keys.length;i++){
				fd.add(keys[i],req.data[keys[i]]);
			}
			xhr.send(fd);
		}
	}catch(ex){
		console.log(ex);
		if(req.error)req.error(ex);
	}
};
function gsapp()
{
};



gsapp.form=null;
gsapp.dictionary=null;


gsapp.config=function()
{
	gsapp.form={};
	gs.app=gsapp;
	if(typeof(StrRes)!='undefined')gsapp.dictionary=StrRes;
};
gsapp.buildForm=function(o,view,par,className)
{
	if(!className){
		var classes=Object.keys(gsapp.form);
		for(var i=0;i<classes.length;i++){
			if(o instanceof gsapp.form[classes[i]].blueprint  || (gsapp.compareObjectType(o,gsapp.form[classes[i]].instance)===0)){
				className=classes[i];break;
			}
		}
	}
	if(!view)view=1;
	if(gsapp.form[className]){
		if(gsapp.form[className][view]){
			var dlg=gsapp.form[className][view];
			dlg=dlg.format(o,gsapp.dictionary).trim();
			
			if(par){
				par=typeof(par)=="string"?_("#"+par):par;
				var c=null;
				if(par.nodeName.toLowerCase()=="table" || par.nodeName.toLowerCase()=="tbody")c=_gs.create('tr');
				else if(par.nodeName.toLowerCase()=="ul")c=_gs.create('li');
				else if(gsapp.form[className][view].parentType)c=_gs.create(gsapp.form[className][view].parentType);
				else c=_.create();
				c.innerHTML=dlg;
				par.add(c);
				var call_default_bind=true;
				if(gsapp.form[className].blueprint)if(gsapp.form[className].blueprint.bind)call_default_bind=gsapp.form[className].blueprint.bind(o,c,view);
				if(call_default_bind || call_default_bind===undefined)gs.app.bind(o,c);
				return c;
			}
			return dlg;
		}
	}
	console.log("Warning: Object View Signature not font for {0} and view {1}".format([className,view]));
	return null;
};
gsapp.listItems=function(items,view,par,className)
{
	if(!className){
		var classes=Object.keys(gsapp.form);
		var o=items[0];
		for(var i=0;i<classes.length;i++){
			if(o instanceof gsapp.form[classes[i]].blueprint  || (gsapp.compareObjectType(o,gsapp.form[classes[i]].instance)===0)){
				className=classes[i];break;
			}
		}
	}
	var res=null; var ret="";
	for(var i=0;i<items.length;i++){
		items[i].gsitemindex=i;
		res=gsapp.buildForm(items[i],view,par,className);
		if(typeof(res)=="string"){
			if(res.toLowerCase().indexOf("<td>")===0)res="<tr>"+res+"</tr>";
			else if((view%2)===0)res="<li>"+res+"</li>";
			else res="<div>"+res+"</div>";
			ret+=res;
		}
	}
	return ret;
};
gsapp.compareObjectType=function(a,b)
{
	var keys1=Object.keys(a); var keys2=Object.keys(b);
	if(keys1.length==keys2.length || Math.abs(keys1.length - keys2.length)<=1){
		for(var i=0;i<keys1.length;i++){
			if(keys1[i]!="gsitemindex"){
				if(keys2.indexOf(keys1[i])<0)return 1;
			}
		}
	}else return 1;
	return 0;
};
gsapp.getAttributeByPath=function(o,path)
{
	var r=/^\/*([\w\-_]+)\/*/.exec(path);
	if(r){
		var my_path=r[1];
		path=path.replace(r[0],"");
		if(typeof(o[my_path])=="object"){
			if(path) return gsapp.getAttributeByPath(o[my_path],path);
		}
		return o[my_path];
	}
	return "";
};
gsapp.register=function(name,blueprint,object_instance)
{
	if(blueprint || object_instance){
		gsapp.form[name]={};
		gsapp.form[name].blueprint=blueprint;
		gsapp.form[name].instance=object_instance;
	}
};
gsapp.retrieve=function(c)
{
	var inps=c.get('[bind]'); var obj=null;
	for(var i=0;i<inps.length;i++){
		obj=gsapp.getBindingObject(inps[i]);
		if(obj){
			if(inps[i].attr('bindarray')){
				obj.length=0;
				for(var j=0;j<inps[i].childNodes.length;j++){
					obj[j]=gsapp.getSubBindingObject(inps[i].childNodes[j]);//.bindingObject;
				}
			}else{
				if(inps[i].attr('viewtype')){
					//if(inps[i].bindingObject)obj[inps[i].attr('bind')]=gsapp.retrieve(inps[i]);
					if(typeof(inps[i].bindingObject)=="undefined"){
						for(var j=0;j<inps[i].childNodes.length;j++){
							if(inps[i].childNodes[j].bindingObject){
								obj[inps[i].attr('bind')]=inps[i].childNodes[j].bindingObject;
								break;
							}
						}
					}
				}else{
					if(inps[i].attr('type')){
						if(inps[i].attr('type')=="checkbox"){
							var val=parseInt(inps[i].attr('value'));
							if(val>0){
								if(inps[i].checked)obj[inps[i].attr('bind')]|=val;
								else obj[inps[i].attr('bind')]&= obj[inps[i].attr('bind')]^val;
							}
							continue;
						}
					}
					obj[inps[i].attr('bind')]=inps[i].val();
				}
			}
		}
	}
	if(c.bindingObject)return c.bindingObject;
};
gsapp.bind=function(o,c)
{
	var inps=c.get('[bind]'); var a=null; var view=null; var viewType=null; var ctrl=null;
	for(var i=0;i<inps.length;i++){
		a=inps[i].attr('bind');
		if(o[a] || o[a]===0){
			if(typeof(o[a])=='object'){
				viewType=inps[i].attr('viewtype');
				view=inps[i].attr('view');
				if(!view)view=1;
				
				if(o[a] instanceof Array){
					inps[i].bindingObject=o[a];//object pointer to retrieve
					inps[i].attr('bindarray','true');
					//var subView=inps[i].attr('bindingview');
					//if(!subView)subView=view;
					for(var j=0;j<o[a].length;j++){
						if(typeof(o[a][j])=='object'){
							if(typeof(o[a][j])=="object")o[a][j].gsitemindex=j;
							ctrl=gsapp.buildForm(o[a][j],view,inps[i],viewType);
							if(typeof(o[a][j])=="object")ctrl.bindingObject=o[a][j];
							//if(ctrl)gsapp.bind(o[a],ctrl);
						}
					}
				}else{
					ctrl=gsapp.buildForm(o[a],view,inps[i],viewType);
					//gsapp.bind(o[a],inps[i]);
				}
			}else{
				if(inps[i].attr('type')){
					if(inps[i].attr('type')=="checkbox"){
						var val=parseInt(inps[i].attr('value'));
						if(val>0){
							if((o[a]&val)>0)inps[i].checked=true;
							else inps[i].checked=false;
						}
						continue;
					}
				}
				inps[i].val(o[a]);
			}
		}else inps[i].val(''); //clear
	}
	c.attr('bindObject','true');
	c.bindingObject=o;
};
gsapp.getBindingObject=function(c)
{
	if(c.bindingObject)return c.bindingObject;
	if(c.parentElement)return gsapp.getBindingObject(c.parentElement);
	return null;
};
gsapp.getSubBindingObject=function(c)
{
	if(c.bindingObject)return c.bindingObject;
	else{
		var o=null;
		for(var i=0;i<c.childNodes.length;i++){
			o= gsapp.getSubBindingObject(c.childNodes[i]);
			if(o)return o;
		}
	}
	return null;
};

function gsCloseButton()
{
};



gsCloseButton.defaultTheme='default';


gsCloseButton.create=function()
{
	var btn=_gs.create();
	btn.attr('control','gsCloseButton');
	btn.attr('theme',gsCloseButton.defaultTheme);
	
	var closeBtn=_gs.create();
	closeBtn.innerHTML="&#215;";
	closeBtn.attr('class','closeButtonOf');
	closeBtn.addEventListener('click',gsCloseButton.onClickClose);
	
	var titlePan=_gs.create('span');
	titlePan.val('cbtn');
	
	btn.add(titlePan);
	btn.titlePan=titlePan;
	btn.add(closeBtn);
	
	btn.setTitle=gsCloseButton.setTitle;
	return btn;
};
gsCloseButton.onClickClose=function(e)
{
	if(e.target.parentElement.onbeforeclose)if(!e.target.parentElement.onbeforeclose(e.target.parentElement))return;
	if(e.target.parentElement.onclose)e.target.parentElement.onclose(null);
	e.target.parentElement.remove();
	if(e.stopPropagation)e.stopPropagation();
	e.cancelBubble=true;
};
gsCloseButton.setTitle=function(title)
{
	this.titlePan.val(title);
};

function gsCombo()
{
};



gsCombo.listo=null;
gsCombo.defaultTheme='default';


gsCombo.create=function()
{
	var border=_gs.create();
	border.attr('control','gsCombo');
	border.attr('theme',gsCombo.defaultTheme);
	border.attr('filter','false');
	border.addEventListener('click',gsCombo.ondropdown);
	
	var btn=_gs.create('span');
	btn.innerHTML="&#9660;";
	
	var box=_gs.create('input');
	box.attr('type','text');
	box.addEventListener('keyup',gsCombo.onEnterText);
	box.addEventListener('click',gsCombo.selectText);
	
	var menu=_gs.create('menu');
	menu.lObj=border;
	
	border.add(btn); border.add(box);
	//btn.addEventListener('click',gsCombo.ondropdown);
	border.menu=menu;
	border.textbox=box;
	
	
	if(!gsCombo.listo)gsCombo.listo=[];
	gsCombo.listo.push(border);
	this.typeIndex=gsCombo.listo.indexOf(border);
	
	menu.onselectmenu=function(opt){
		var mn=opt.parentElement;
		mn.lObj.value=opt.attr('value');
		mn.lObj.selectedIndex=mn.childNodes.indexOf(opt);
		border.textbox.val(opt.val().stripTags());
		border.trigger('change');
	};
	
	border.addItem=gsCombo.addItem;
	border.setRTL=gsCombo.setRTL;
	border.setRTL(false);
	border.visibleMenu=false;
	return border;
};
gsCombo.ondropdown=function(e)
{
	var combo=e.target.parentElement;
	combo.visibleMenu=!JSON.parse(combo.menu.attr('visible'));
	if(combo.attr('filter')=="true"){
		if(combo.visibleMenu){
			combo.textbox.focus();
			for(var i=0;i<combo.menu.childNodes.length;i++)combo.menu.childNodes[i].style.display="";//remove display none of filter
		}else{
			for(var i=0;i<combo.menu.childNodes.length;i++)
				if(combo.menu.childNodes[i].innerHTML.stripTags().toLowerCase().indexOf(combo.textbox.val().trim().toLowerCase())<0)
					combo.menu.childNodes[i].style.display="none";
		}
	}
	combo.menu.visible(combo.visibleMenu);
	e.stop();
};
gsCombo.addItem=function(title,value,keywords)
{
	if(!this.value && this.value!==0)this.value=value;
	var item=this.menu.addMenu(title,value);
	if(this.value==value){
		this.textbox.val(title.stripTags());
		this.selectedIndex=this.menu.childNodes.indexOf(item);
	}
};
gsCombo.setRTL=function(rtl)
{
	this.attr('rtl',rtl?'true':'false');
	this.menu.setRTL(rtl);
	if(rtl){
		this.menu.keepRightTo=this;
		this.menu.keepLeftTo=null;
	}else{
		this.menu.keepRightTo=null;
		this.menu.keepLeftTo=this;
	}
};
gsCombo.onEnterText=function(e)
{
	var cmb=e.target.parentElement;
	var txt=e.target;
	var item=null;
	if(cmb.attr('filter')=="true"){
		if(cmb.menu.attr('visible')!='true')cmb.menu.visible(true);
		for(var i=0;i<cmb.menu.childNodes.length;i++){
			item=cmb.menu.childNodes[i];
			if(item.innerHTML.stripTags().toLowerCase().indexOf(txt.val().trim().toLowerCase())<0)
				item.style.display="none";
			else
				item.style.display="";
		}
	}
	if(cmb.menu.attr('visible')=="true"){
		cmb.menu.onkeyup(e);
	}
};
gsCombo.selectText=function(e)
{
	e.target.focus();
	e.target.setSelectionRange(0, e.target.value.length);
};

function gsDialog()
{
};



gsDialog.defaultTheme='default';


gsDialog.create=function()
{
	var dlg=_gs.create(); dlg.attr('control','gsDialog'); dlg.attr('theme',gsDialog.defaultTheme);
	dlg.attr('dialog','default');
	var border=_gs.create();border.attr('class','border');
	dlg.add(border);
	
	var titleBar=_gs.create(); titleBar.attr('class','title');
	var span=_gs.create('span'); span.innerHTML="&nbsp;"; titleBar.add(span);
	dlg.add(titleBar);
	
	var cnt=_gs.create(); cnt.attr('class','content');
	dlg.add(cnt);
	
	dlg.setMode=gsDialog.setMode;
	dlg.setButton=gsDialog.setButton;
	dlg.show=gsDialog.show;
	dlg.setTitle=gsDialog.setTitle;
	dlg.movable=gsDialog.movable;
	
	dlg.borderPan=border;
	dlg.titleBar=titleBar;
	dlg.contentPan=cnt;
	dlg.titleContainer=span;
	
	return dlg;
	
};
gsDialog.setMode=function(mode)
{
	this.attr('class','dialog main '+mode);
};
gsDialog.setButton=function(btn,vis)
{
	switch(btn.toLowerCase()){
		case 'close':
			if(vis){
				if(!this.closeButton){
					this.closeButton=_gs.create('button');
					this.closeButton.addClass('red btn');
					this.closeButton.dialogPointer=this;
					this.closeButton.addEventListener('click',function(e){e.target.dialogPointer.remove();});
					this.closeButton.innerHTML='&#10005';
					this.titleBar.add(this.closeButton);
				}else this.closeButton.removeClass('hide');
			}else this.closeButton.addClass('hide');
			break;
	}
};
gsDialog.show=function(par)
{
	if(this.parentElement)this.remove();
	if(!par)par=document.body;
	(typeof(par)=="string"?_gs('#'+par):par).add(this);
};
gsDialog.setTitle=function(title)
{
	this.titleContainer.val(title);
};
gsDialog.movable=function(arg)
{
	if(typeof(arg)=="undefined")arg=true;
	var callback=function(e){gsDialog.moveCallback(arguments.callee.dialog,e);}
	callback.dialog=this;
	this.titleBar.movable(arg,callback);
};
gsDialog.moveCallback=function(dialog,e)
{
	//var border=dialog.get('.border')[0];
	//var cnt=dialog.get('.content')[0];
	//var title=dialog.get('.title')[0];
	dialog.borderPan.style.left=e.x+'px'; dialog.borderPan.style.top=e.y+'px';
	dialog.contentPan.style.left=e.x+'px'; dialog.contentPan.style.top=(e.y+dialog.titleBar.offsetHeight)+"px";
};

function gsExtra()
{
};



gsExtra.selectedNodes=null;
gsExtra.bodyConfiged=null;
gsExtra.movingElement=null;


gsExtra.selectable=function(arg)
{
	if(arg===undefined)arg=true;
	if(this instanceof HTMLElement){
		if(arg){
			this.attr('selectable','selectable');
			this.addEventListener('click',gsExtra.toggleSelect);
		}else{
			this.attr('selectable',null);
			this.removeEventListener('click',gsExtra.toggleSelect);
			this.diselect();
		}
	}else if(this instanceof NodeList){
		for(var i=0;i<this.length;i++)this[i].selectable(arg);
	}
};
gsExtra.select=function()
{
	this.attr('selected','selected');
	if(gsExtra.selectedNodes.indexOf(this)<0){
		for(var i=0;i<gsExtra.selectedNodes.length;i++)gsExtra.selectedNodes[i].diselect();
		gsExtra.selectedNodes.push(this);
	}
};
gsExtra.diselect=function()
{
	this.attr('selected',null);
	var r=-1;
	if((r=gsExtra.selectedNodes.indexOf(this))>-1){
		gsExtra.selectedNodes.splice(r,1);
	}
};
gsExtra.toggleSelect=function(e)
{
	if(e)e.target.toggleSelect();
	else{
		if(this.attr('selected'))this.diselect();
		else this.select();
	}
	
};
gsExtra.movable=function(arg,callback)
{
	if(arg===undefined)arg=true;
	if(this instanceof HTMLElement){
		if(arg){
			if(callback)this.onmove=callback;
			this.attr('movable','movable');
			this.addEventListener('mousedown',gsExtra.startMoving);
			this.addEventListener('mouseup',gsExtra.stopMoving);
			//this.addEventListener('mousemove',gsExtra.move);
			if(!gsExtra.bodyConfiged){
				document.addEventListener('mousemove',gsExtra.move);
				gsExtra.bodyConfiged=true;
			}
		}else{
			this.attr('movable',null);
			this.removeEventListener('mousedown',gsExtra.startMoving);
			this.removeEventListener('mouseup',gsExtra.stopMoving);
			if(this.onmove)delete this.onmove;
			//this.removeEventListener('mousemove',gsExtra.move);
		}
	}else if(this instanceof NodeList){
		for(var i=0;i<this.length;i++)this[i].movable(arg);
	}
};
gsExtra.startMoving=function(e)
{
	gsExtra.movingElement=e.target;
	
	var rect=e.target.getClientRects()[0];
	e.target.deltaX=e.clientX-rect.x;
	e.target.deltaY=e.clientY-rect.y;
	
	e.target.style.position="absolute";//css alows to move only
};
gsExtra.stopMoving=function(e)
{
	gsExtra.movingElement=null;
};
gsExtra.move=function(e)
{
	if(gsExtra.movingElement){
		gsExtra.movingElement.style.left=e.clientX-gsExtra.movingElement.deltaX+"px";
		gsExtra.movingElement.style.top=e.clientY-gsExtra.movingElement.deltaY+"px";
		if(gsExtra.movingElement.onmove)
			gsExtra.movingElement.onmove({
				element:gsExtra.movingElement,
				clientX:e.clientX, clientY:e.clientY,
				x:(e.clientX-gsExtra.movingElement.deltaX),
				y:(e.clientY-gsExtra.movingElement.deltaY)
			});
	}
};
function gsGesture(right,left,top,bottom,toRight,toBottom,startPoints,endPoints)
{
	
	this.right=null;
	this.left=null;
	this.top=null;
	this.bottom=null;
	this.toRight=null;
	this.toBottom=null;
	this.startPoints=null;
	this.endPoints=null;
	this.target=null;
	this.dx=null;
	this.dy=null;
this.right=right?right:false; this.left=left?left:false; this.top=top?top:false; this.bottom=bottom?bottom:false;
this.toRight=toRight?toRight:false; this.toBottom=toBottom?toBottom:false;
this.startPoints=startPoints?startPoints:null; this.endPoints=endPoints?endPoints:null;
};




gsGesture.register=function(el,callback)
{
	el.ongesture=callback;
	el.addEventListener('touchstart',gsGesture.onTouchStart);
	el.addEventListener('touchend',gsGesture.onTouchEnd);
};
gsGesture.onTouchStart=function(e)
{
	var gesture=new gsGesture();
	gesture.startPoints=e.changedTouches;
	e.target.currentGesture=gesture;
};
gsGesture.onTouchEnd=function(e)
{
	if(e.target.currentGesture){
		var g=e.target.currentGesture;
		g.endPoints=e.changedTouches;
		g.target=e.target;
		//process
		var t1=g.startPoints[0];
		var t2=g.endPoints[0];
		if(t1.pageX>(window.innerWidth/2))g.right=true;
		else g.left=true;
		
		if(t2.pageX>(window.innerWidth/2))g.right=true;
		else g.left=true;
		
		if(t2.pageX>t1.pageX)g.toRight=true;
		
		g.dx=Math.abs(t2.pageX-t1.pageX);
		
		if(t1.pageY>(window.innerHeight/2))g.bottom=true;
		else g.top=true;
		
		if(t2.pageY>(window.innerHeight/2))g.bottom=true;
		else g.top=true;
		
		if(t2.pageY>t1.pageY)g.toBottom=true;
		g.dy=Math.abs(t2.pageY-t1.pageY);
		//propagate
		var el=e.target;
		do{
			if(el.ongesture){
				el.ongesture(g);
				break;
			}
			el=el.parentElement;
		}while(el);
	}
};

function gsItemList()
{
};



gsItemList.defaultTheme='default';


gsItemList.create=function()
{
	var ul=_gs.create('ul');
	ul.attr('control','gsItemList');
	ul.attr('theme',gsItemList.defaultTheme);
	
	ul.addItem=gsItemList.addItem;
	ul.getValues=gsItemList.getValues;
	
	return ul;
};
gsItemList.addItem=function(title,value)
{
	if(this.getValues().indexOf(value)<0){
		var li=_gs.create('li');
		if(value!==null)li.attr('value',value);
		
		var closeBtn=_gs.create();
		closeBtn.innerHTML="&#215;";
		closeBtn.attr('class','closeButtonOf');
		closeBtn.addEventListener('click',gsItemList.onClickClose);
		
		var titlePan=_gs.create('span');
		titlePan.val(title);
		
		li.add(titlePan);
		li.add(closeBtn);
		
		this.add(li);
	}
};
gsItemList.getValues=function()
{
	var ret=[];
	for(var i=0;i<this.childNodes.length;i++){
		if(this.childNodes[i].attr('value'))ret.push(this.childNodes[i].attr('value'));
	}
	return ret;
};
gsItemList.onClickClose=function(e)
{
	e.target.parentElement.remove();
};

function gsMenu()
{
};



gsMenu.listo=null;
gsMenu.configed=null;
gsMenu.defaultTheme='default';
gsMenu.activeObject=null;
gsMenu.menuBack=null;


gsMenu.create=function()
{
	if(!gsMenu.configed)gsMenu.config();
	var mn=_gs.create('ul');
	mn.attr('control','gsMenu');
	mn.attr('theme',gsMenu.defaultTheme);
	mn.attr('visible','false');
	mn.addMenu=gsMenu.addMenu;
	mn.visible=gsMenu.visible;
	mn.setRTL=gsMenu.setRTL;
	mn.onkeyup=gsMenu.onkeyup;
	mn.showContextMenu=gsMenu.showContextMenu;
	
	mn.selectedPosition=-1;
	//if(!gsMenu.listo)gsMenu.listo=[];
	//gsMenu.listo.push(mn);
	return mn;
};
gsMenu.addMenu=function(title,value)
{
	var li=_gs.create('li');
	if(title){
		li.addEventListener('click',gsMenu.onSelectMenu);
		li.val(title);
	}else li.attr('class','separator');
	if(value)li.attr('value',value);
	this.add(li);
	return li;
};
gsMenu.onSelectMenu=function(e)
{
	if(e.target.parentElement.onselectmenu)e.target.parentElement.onselectmenu(e.target);
	else e.target.parentElement.click();
	gsMenu.close();
};
gsMenu.close=function(e)
{
	if(gsMenu.activeObject)gsMenu.activeObject.visible(false);
	gsMenu.menuBack.addClass('hide');
};
gsMenu.visible=function(vis)
{
	if(vis===undefined)vis=true;
	if(vis){
		gsMenu.close();
		gsMenu.menuBack.removeClass('hide');
		gsMenu.activeObject=this;
		this.selectedPosition=-1;//not selected any menu
		if(!this.parentElement)document.body.appendChild(this);
		this.attr('visible','true');
		if(this.keepLeftTo && this.keepRightTo){
			this.attr("mode","relative");
			var rect=this.keepLeftTo.getClientRects()[0];
			this.style.left=rect.x+"px";
			this.style.width=rect.width+"px";
			this.style.top=(rect.y+this.keepLeftTo.offsetHeight)+"px";
		}else if(this.keepLeftTo){
			this.attr("mode","relative");
			var rect=this.keepLeftTo.getClientRects()[0];
			this.style.left=rect.x+"px";
			this.style.top=(rect.y+this.keepLeftTo.offsetHeight)+"px";
		}else if(this.keepRightTo){
			this.attr("mode","relative");
			var rect=this.keepRightTo.getClientRects()[0];
			var r2=this.getClientRects()[0];
			if(r2.width>10)this.style.left=(rect.x+rect.width-r2.width)+"px";
			this.style.top=(rect.y+this.keepRightTo.offsetHeight)+"px";
		}
		if(this.keepLeftTo || this.keepRightTo){//normilize top
			var rect=this.getClientRects()[0];
			if(window.innerHeight - 20 < rect.top + rect.height){
				var r2=this.keepLeftTo?this.keepLeftTo.getClientRects()[0]:this.keepRightTo.getClientRects()[0];
				this.style.top=(r2.top - rect.height) +"px";
				//this.style.bottom= r2.top+"px";
			}
		}
	}else{
		gsMenu.activeObject=null;
		this.attr('visible','false');
	}
};
gsMenu.config=function()
{
	//document.addEventListener('click',gsMenu.ondocumentclick);
	gsMenu.menuBack=_gs.create();
	gsMenu.menuBack.attr('id','gsMenuBackArea');
	gsMenu.menuBack.addClass('hide');
	document.body.add(gsMenu.menuBack);
	gsMenu.menuBack.addEventListener('click',gsMenu.close);
	gsMenu.configed=true;
	//gsMenu.listo=[];
};
gsMenu.setRTL=function(rtl)
{
	this.attr('rtl',rtl?'true':'false');
};
gsMenu.onkeyup=function(e)
{
	var visibles=0;
	for(var i=0;i<this.childNodes.length;i++){
		this.childNodes[i].attr('over','false');
		if(this.childNodes[i].style.display!="none")visibles++;
	}
	if(visibles>0){
		if(e.keyCode==38){//up arrow
			do{
				this.selectedPosition-=1;
				if(this.selectedPosition<0)this.selectedPosition=this.childNodes.length-1;
			}while(this.childNodes[this.selectedPosition].style.display=="none");
			this.childNodes[this.selectedPosition].attr('over','true');
		}else if(e.keyCode==40){//down arrow
			do{
				this.selectedPosition+=1;
				if(this.selectedPosition>this.childNodes.length-1)this.selectedPosition=0;
			}while(this.childNodes[this.selectedPosition].style.display=="none");
			this.childNodes[this.selectedPosition].attr('over','true');
		}else if(e.keyCode==13){//maybee enter on selected item
			if(this.childNodes[this.selectedPosition])
				this.childNodes[this.selectedPosition].click();
		}
	}
};
gsMenu.showContextMenu=function(e)
{
	gsMenu.close();
	gsMenu.menuBack.removeClass('hide');
	this.attr("mode","context");
	this.selectedPosition=-1;//not selected any menu
	if(!this.parentElement)document.body.appendChild(this);
	this.attr('visible','true');
	
	var x=e.clientX; var y=e.clientY;
	var rect=this.getClientRects()[0];
	if((x + rect.width) > (window.innerWidth - 50))x=x-rect.width;
	if((y + rect.height) > (window.innerHeight - 50))y=y-rect.height;
	this.style.left=x+"px";
	this.style.top=y+"px";
	e.stop();
	return false;
};

function gsPanel()
{
};



gsPanel.listo=null;
gsPanel.configed=null;
gsPanel.defaultTheme='default';


gsPanel.create=function()
{
	if(!gsPanel.configed)gsPanel.config();
	var pan=_gs.create();
	pan.attr('control','gsPanel');
	pan.attr('class','panel20');
	pan.attr('dock','right');
	pan.addEventListener('click',gsPanel.defaultOnClick);
	pan.attr('theme',gsPanel.defaultTheme);
	if(!gsPanel.listo)gsPanel.listo=[];
	gsPanel.listo.push(pan);
	
	pan.visible=gsPanel.visible;
	pan.dock=gsPanel.dock;
	return pan;
};
gsPanel.visible=function(vis)
{
	if(vis===undefined)vis=true;
	if(vis){
		if(!this.parentElement)document.body.appendChild(this);
		switch(this.attr('dock').toLowerCase()){
			case 'left':this.style.left="0px";break;
			case 'right':this.style.right="0px";break;
			case 'top':this.style.top="0px";break;
			case 'bottom':this.style.bottom="0px";break;
		}
		this.attr('visible','true');
	}else{
		switch(this.attr('dock').toLowerCase()){
			case 'left':this.style.left=(-this.offsetWidth-20)+"px";break;
			case 'right':this.style.right=(-this.offsetWidth-20)+"px";break;
			case 'top':this.style.top=(-this.offsetHeight-20)+"px";break;
			case 'bottom':this.style.bottom=(-this.offsetHeight-20)+"px";break;
		}
		this.attr('visible','false');
	}
	gsPanel.visibilitiesChanged();
};
gsPanel.dock=function(pos)
{
	this.attr('dock',pos);
	this.style.left="";this.style.right="";this.style.bottom="";this.style.top="";//onchange dock will clear old styles
};
gsPanel.onClickParent=function(e)
{
	if(gsPanel.listo){
		for(var i=0;i<gsPanel.listo.length;i++){
			if(!gsPanel.listo[i].attr("pinned")){
				gsPanel.listo[i].visible(false);
			}
		}
	}
};
gsPanel.config=function()
{
	document.addEventListener('click',gsPanel.onClickParent);
	gsPanel.configed=true;
	gsPanel.listo=[];
};
gsPanel.defaultOnClick=function(e)
{
	if(e.stopPropagation)e.stopPropagation();
	e.cancelBubble=true;
};
gsPanel.onClickClose=function(e)
{
	if(e.target.parentElement.onclose)e.target.parentElement.onclose(null);
	e.target.parentElement.remove();
	if(e.stopPropagation)e.stopPropagation();
	e.cancelBubble=true;
};
gsPanel.visibilitiesChanged=function()
{
	var minBottom=0;	var minTop=0;
	var minLeft=0;		var minRight=0;
	var pan=null;		var r=null;
	for(var i=0;i<gsPanel.listo.length;i++){
		pan=gsPanel.listo[i];
		var r=pan.attr('visible'); if(!r)r="false";
		if(r.like('true')){
			r=pan.attr('viewport'); if(!r)r='auto';
			if(r.like('full')){
				switch(pan.attr('dock').toLowerCase()){
					case 'left':
						if(pan.offsetWidth>minLeft)minLeft=pan.offsetWidth;
						break;
					case 'right':
						if(pan.offsetWidth<minRight)minRight=pan.offsetWidth;
						break;
					case 'top':
						if(pan.offsetHeight>minTop)minTop=pan.offsetHeight;
						break;
					case 'bottom':
						if(pan.offsetHeight>minBottom)minBottom=pan.offsetHeight;
						break;
				}
			}
		}
	}
	
	for(var i=0;i<gsPanel.listo.length;i++){
		pan=gsPanel.listo[i];
		var r=pan.attr('visible'); if(!r)r="false";
		if(r.like('true')){
			r=pan.attr('viewport'); if(!r)r='auto';
			if(!r.like('full')){
				switch(pan.attr('dock').toLowerCase()){
					case 'left': case 'right':
						pan.style.top=minTop+"px"; pan.style.bottom=minBottom+"px";
						break;
					case 'top': case 'bottom':
						pan.style.left=minLeft+"px"; pan.style.right=minRight+"px";
						break;
				}
			}
		}
	}
};

function gsTab()
{
};



gsTab.defaultTheme='default';


gsTab.create=function()
{
	var tab=_gs.create();
	tab.attr("control","gsTab");
	tab.attr("theme",gsTab.defaultTheme);
	
	var tabList=_gs.create('ul');
	tabList.attr('visible','true');
	tabList.visible=gsTab.tabListVisibile;
	tab.tabList=tabList;//set a pointer to the ul
	tab.add(tabList);//show in the control
	
	var container=gsPager.create();
	container.attr('visible','true');
	container.visible=gsTab.containerVisibile;
	tab.container=container;
	tab.add(container);
	
	
	tab.addTab=gsTab.addTab;
	return tab;
};
gsTab.addTab=function(title,content)
{
	var li=_gs.create('li');
	li.val(title);
	li.addEventListener('click',gsTab.onSelectTab);
	this.tabList.add(li);
	this.container.addPage(content);
};
gsTab.tabListVisible=function(vis)
{
	vis=(vis===undefined)?true:vis;
	tabList.attr('visible',vis?'true':'false');
	gsTab.correntVisibility(tab);
};
gsTab.containerVisible=function(vis)
{
	
};
gsTab.correctVisibility=function(tab)
{
	if(tab.tabList.attr('visible')=="true" && tab.container.attr('visible')=="true"){
		tab.container.style.height=(tab.offsetHeight-tab.tabList.offsetHeight)+"px";
	}else if(tab.tabList.attr('visible')=="true" && tab.container.attr('visible')=="false"){
	}else if(tab.tabList.attr('visible')=="false" && tab.container.attr('visible')=="true"){
	}
};
gsTab.onSelectTab=function(e)
{
	var tab=e.target.parentElement.parentElement;
	var index=tab.tabList.childNodes.indexOf(e.target);
	e.target.attr('active','true');
	tab.container.goPage(index);
	for(var i=0;i<tab.tabList.childNodes.length;i++){
		if(i!=index){
			tab.tabList.childNodes[i].attr('active','false');
		}
	}
};
function gsPager()
{
};



gsPager.defaultTheme='default';


gsPager.create=function()
{
	var d=_gs.create();
	d.addPage=gsPager.addPage;
	d.removePage=gsPager.removePage;
	d.goPage=gsPager.goPage;
	d.pages=[];
	return d;
};
gsPager.addPage=function(html,index)
{
	if(index>=0)this.pages[index]=html;
	else this.pages.push(html);
};
gsPager.removePage=function(index)
{
	this.pages.splice(index,1);
};
gsPager.goPage=function(index)
{
	if(this.pages[index]){
		if(typeof(this.pages[index])=="object"){this.innerHTML=""; this.appendChild(this.pages[index]);}
		else this.innerHTML=this.pages[index];
	}
};

function gsSlider()
{
};



gsSlider.currentSlider=null;
gsSlider.scrollTarget=null;
gsSlider.scrollDirection=null;
gsSlider.scrollStep=null;
gsSlider.scrollStepTime=null;
gsSlider.defaultTheme='default';


gsSlider.create=function()
{
	var slider=_gs.create();
	slider.attr('control','gsSlider'); slider.attr('theme',gsSlider.defaultTheme); slider.attr('direction','horizontal');
	slider.attr('autoplay','true'); slider.attr('step','100'); slider.attr('duration','300'); slider.enableScroll=true; slider.attr('interval','10000');
	//keeper
	var keeper=_gs.create(); keeper.attr('class','keeper');
	slider.add(keeper);
	//functions
	slider.addItem=gsSlider.addItem; slider.index=0;
	slider.go=gsSlider.go;
	slider.items=[];
	var container=_gs.create(); container.attr('class','sliderContainer'); container.onSlide=gsSlider.onSlide;
	slider.container=container;
	container.slider=slider;//add pointer to slider used in onSlide
	keeper.add(container);
	gsGesture.register(container,function(e){
		if(e.target.attr('class')!='sliderContainer'){
			e.target=e.target.parentElement;
			arguments.callee(e);
		}else e.target.onSlide(e);
	});
	container.onscroll=function(e){
		e.stop(); return false;
	};
	
	//create buttons
	var nextBtn=_gs.create('button'); nextBtn.addClass('next');
	nextBtn.onclick=gsSlider.next;
	keeper.add(nextBtn);
	
	var backBtn=_gs.create('button'); backBtn.addClass('back');
	backBtn.onclick=gsSlider.back;
	keeper.add(backBtn);
	
	var playBtn=_gs.create('button'); playBtn.addClass('play');
	playBtn.onclick=gsSlider.toggleAutoPlay;
	keeper.add(playBtn);
	
	slider.playedBefore=false;
	slider.autoPlayFunction=function(){
		var slider=arguments.callee.slider;
		if(slider.playedBefore)gsSlider.autoPlay(slider);
		else slider.playedBefore=true;
		
		setTimeout(arguments.callee,slider.attr('interval').toInt());
	};
	slider.autoPlayFunction.slider=slider;
	
	
	
	
	setTimeout(slider.autoPlayFunction,1000);
	return slider;
};
gsSlider.addItem=function(data,dataType,value,href)
{
	if(dataType.like('image')){
		var item=_gs.create('img');
		item.attr('src',data);
		
	}else{
		var item=_gs.create();
		if(typeof(data)=="string")item.innerHTML=data;
		else item.add(data);
	}
	item.attr('class','sliderPage');
	if(value || value===0)item.attr('value',value);
	if(href)item.attr('onclick',"window.location='"+href+"';");
	this.container.add(item);
	this.items.push(item);
};
gsSlider.go=function(index)
{
	gsSlider.currentSlider=this;
	if(this.attr('direction').like('horizontal')){
		if(index<this.items.length && index>=0){
			this.enableScroll=false;
			var step=this.attr('step').toInt();
			var duration=this.attr('duration').toInt();
			var offset=index*this.container.offsetWidth;
			if(offset<this.container.scrollLeft)step*=-1;
			this.index=index;
			gsSlider.scrollTarget=offset;
			gsSlider.scrollDirection="horizontal";
			gsSlider.scrollStep=step;
			gsSlider.scrollStepTime=parseInt(duration*step/Math.abs(offset-this.container.scrollLeft));
			gsSlider.animate();
		}else if(index<0)this.go(this.items.length-1);
		else if(index>=this.items.length)this.go(0);
	}
};
gsSlider.next=function()
{
	var par=this.parentElement.parentElement;
	par.go(par.index+1);
};
gsSlider.back=function()
{
	var par=this.parentElement.parentElement;
	par.go(par.index-1);
};
gsSlider.onSlide=function(e)
{
	/*var slider=this.parentElement.parentElement;
	if(slider.enableScroll){
		if(slider.attr('direction').like('horizontal')){
			var index=Math.round(e.target.scrollLeft/(e.target.scrollWidth / e.target.childNodes.length));
			if(e.target.scrollLeft>e.target.childNodes[index].offsetLeft)slider.go(index+1);
			else if(e.target.scrollLeft<e.target.childNodes[index].offsetLeft) slider.go(index-1);
		}
	}*/
	if(e.dx>100){
		var slider=e.target.slider;
		if(e.toRight)slider.go(slider.index-11);
		else slider.go(slider.index+1);
		slider.attr('autoplay','false');
	}
};
gsSlider.animate=function(pos)
{
	if(gsSlider.scrollDirection.like('horizontal')){
		var obj=gsSlider.currentSlider.container;
		if(Math.abs(obj.scrollLeft - gsSlider.scrollTarget)<=Math.abs(gsSlider.scrollStep)){
			obj.scrollLeft=gsSlider.scrollTarget;
			gsSlider.currentSlider.enableScroll=true;
			//finalyze
			//gsSlider.currentSlider=null;
		}else{
			obj.scrollLeft+=gsSlider.scrollStep;
			setTimeout(gsSlider.animate,gsSlider.scrollStepTime);
		}
	}
};
gsSlider.autoPlay=function(slider)
{
	if(slider.parentElement){
		if(slider.attr('autoplay').like('true')) slider.go(slider.index+1);
	}
};
gsSlider.toggleAutoPlay=function(e)
{
	var par=this.parentElement.parentElement;
	par.attr('autoplay',par.attr('autoplay').like('true')?'false':'true');
};

function gsSuggestBox()
{
};



gsSuggestBox.defaultTheme='default';


gsSuggestBox.create=function()
{
	var ctrl=_gs.create('div');
	ctrl.attr('control','gsSuggestBox');
	ctrl.attr('theme',gsSuggestBox.defaultTheme);
	ctrl.callback=gsSuggestBox.callback;
	ctrl.lastInput=null;
	var txt=_gs.create('input');
	txt.attr('type','text');
	txt.attr('autocomplete','off');
	txt.attr('spellcheck','false');
	txt.addEventListener('keyup',gsSuggestBox.onkeyup);
	ctrl.add(txt);
	ctrl.textbox=txt;
	ctrl.suggestor=null; //set method like getSuggest(arg,suggestBox) style
	ctrl.getSuggestTitle=null; //set method like getTitle(object) to get title if items are objects
	ctrl.onSelectSuggest=null; //on select suggests
	
	mn=_gs.create('menu');
	mn.keepLeftTo=ctrl;
	mn.keepRightTo=ctrl;
	mn.lObj=ctrl;
	mn.onselectmenu=function(opt){
		var mn=opt.parentElement;
		mn.lObj.value=opt.attr('value');
		mn.lObj.selectedIndex=mn.childNodes.indexOf(opt);
		mn.lObj.textbox.val(opt.val().stripTags());
		mn.lObj.trigger('change');
	};
	ctrl.suggestMenu=mn;
	return ctrl;
};
gsSuggestBox.onkeyup=function(e)
{
	var sg=e.target.parentElement;
	if(e.target.value!=this.lastInput && e.target.value.trim()){
		if(sg.getSuggest){
			sg.getSuggest(e.target.value,sg);
		}
	}else if(!e.target.value.trim())sg.suggestMenu.visible(false);
	
	if(e.charCode==13){
		if(sg.suggestMenu.selectedPosition<0)sg.trigger('change');
	}
	if(sg.suggestMenu.attr('visible')=="true"){
		sg.suggestMenu.onkeyup(e);
	}
	this.lastInput=e.target.value;
};
gsSuggestBox.callback=function(res)
{
	if(res instanceof Array){
		var mn=this.suggestMenu;
		mn.val('');//clear menus
		for(var i=0;i<res.length;i++){
			if(typeof(res[i])=="string"){
				mn.addMenu(res[i],res[i]);
			}else if(this.getSuggestTitle){
				var title=this.getSuggestTitle(res[i]);
				mn.addMenu(title,title);
			}else{
				console.log('please set getSuggestTitle method to the SuggestBox.');
				return;
			}
		}
		if(this.suggestMenu.attr('visible')!='true')this.suggestMenu.visible(true);
	}
};

function gsRollerItems()
{
};



gsRollerItems.defaultTheme='default';
gsRollerItems.fns=null;


gsRollerItems.create=function()
{
	var ctrl=_gs.create('ul');
	ctrl.attr('theme',gsRollerItems.defaultTheme);
	ctrl.attr('control','gsRollerItems');
	
	ctrl.listA=[];
	ctrl.listB=[];
	ctrl.attr('direction','left');
	ctrl.attr('duration','10000'); //each item crosses in duration mili seconds
	ctrl.attr('step','20');//every step move 20px
	ctrl.attr('margin','20');//between items
	
	ctrl.play=gsRollerItems.play;
	ctrl.getStep=gsRollerItems.getStep;
	ctrl.addItem=gsRollerItems.addItem;
	ctrl.addToEnd=gsRollerItems.addToEnd;
	if(!gsRollerItems.fns)gsRollerItems.fns=[];
	return ctrl;
};
gsRollerItems.play=function()
{
	this.toLeft=this.attr('direction').like('left')?true:false;
	this.duration=parseInt(this.attr('duration'));
	this.step=parseInt(this.attr('step'));
	this.stepDuration=(this.duration/this.getClientRects()[0].width)*this.step;
	
	var fn=function(){
		var roller=arguments.callee.roller;
		roller.getStep();
		setTimeout(arguments.callee,roller.stepDuration);
	};
	fn.roller=this;
	//gsRollerItems.fns.push(fn);
	setTimeout(fn,100);
};
gsRollerItems.getStep=function()
{
	var roller=this;
	roller.listA.length=0;
	for(var i=0;i<roller.childNodes.length;i++){
		var left=parseInt(roller.childNodes[i].style.left.replace('px',''));
		if(roller.toLeft){
			if((left+roller.childNodes[i].offsetWidth)<0){
				roller.listA.push(roller.childNodes[i]);
				//roller.childNodes[i].remove(); //romve from roller
			}else{
				roller.childNodes[i].style.left=(left-roller.step)+'px';
			}
		}else{
			if(left>roller.offsetWidth){
				roller.listA.push(roller.childNodes[i]);
				//roller.childNodes[i].remove(); //romve from roller
			}else {
				roller.childNodes[i].style.left=(left-roller.step)+'px';
			}
		}
	}
	for(var i=0;i<roller.listA.length;i++){roller.listA[i].remove();roller.addToEnd(roller.listA[i]);}
};
gsRollerItems.addItem=function(item)
{
	var li=_gs.create('li'); li.val(item);
	this.addToEnd(li);
};
gsRollerItems.addToEnd=function(child)
{
	if(!this.margin)this.margin=parseInt(this.attr('margin'));
	var left=0;
	if(this.childNodes.length>0){
		left=parseInt(this.childNodes[this.childNodes.length-1].style.left.replace('px',''))+this.childNodes[this.childNodes.length-1].offsetWidth+this.margin;
	}
	child.style.left=left+'px';
	this.add(child);
};

function gsList()
{
};



gsList.defaultTheme='default';


gsList.create=function()
{
	//if(!gsList.configed)gsList.config();
	var ls=_gs.create();
	ls.attr('control','gsList');
	ls.attr('theme',gsList.defaultTheme);
	
	ls.sort=gsList.sort;
	ls.view=gsList.view;
	ls.currentView=2;
	ls.add=gsList.addItem;
	ls.addItem=gsList.addItem;
	ls.onAddItem=gsList.onAddItem;
	ls.selfConfig=gsList.selfConfig;
	ls.itemList=[];
	ls.keepEnding=false;
	return ls;
};
gsList.sort=function(feature,desc)
{
	this.itemList=this.itemList.sort(function(a,b){
		var ret=1;
		if(a[feature]<a[feature])ret=-1;
		else if(a[feature]==a[feature])ret=0;
		
		if(desc)return -ret;
		else return ret;
	});
	
	for(var i=0;i<this.itemList.length;i++)gs.app.build(this.itemList[i],this.currentView,this,this.viewClassName);
	this.onAddItem();
};
gsList.view=function(viewNumber)
{
	if(this.currentView!=viewNumber){
		this.currentView=viewNumber;
		this.val('');
		for(var i=0;i<this.itemList.length;i++){
			gs.app.buildForm(this.itemList[i],viewNumber,this,this.viewClassName);
		}
		this.onAddItem();
	}
	
};
gsList.selfConfig=function(className,defaultView)
{
	this.viewClassName=className;
	this.defaultView=defaultView?defaultView:2;
	this.currentView=this.defaultView;
};
gsList.addItem=function(item)
{
	if(item instanceof Array)item.forEach(this.addItem);
	else{
		this.itemList.push(item);
		var ctrl= gs.app.build(item,this.currentView,this,this.viewClassName);
		this.onAddItem();
		return ctrl;
	}
};
gsList.onAddItem=function()
{
	if(this.keepEnding){
		this.scrollTop=this.scrollHeight;
	}
	this.trigger('itemadd');
};

function gsRichText()
{
};



gsRichText.defaultTheme='default';


gsRichText.create=function()
{
	var d=_gs.create();
	d.attr('contenteditable','true');
	d.attr('control','gsRichText');
	d.attr('theme',gsRichText.defaultTheme);
	d.val=gsRichText.val;
	d.text=gsRichText.text;
	return d;
};
gsRichText.val=function(html)
{
	if(html)this.innerHTML=html;
	else return this.innerHTML;
};
gsRichText.text=function(text)
{
	if(text)this.innerText=text;
	else return this.textContent;
};

function gsPreview()
{
};



gsPreview.defaultTheme='default';
gsPreview.nextSvg=null;
gsPreview.closeSvg=null;


gsPreview.create=function()
{
	var pr=_gs.create();
	pr.attr('control','gsPreview');
	pr.attr('theme',gsList.defaultTheme);
	pr.addClass('gsPreviewPan');
	
	pr.nav=gsPreview.nav;
	pr.close=gsPreview.close;
	pr.show=gsPreview.show;
	pr.index=0;
	pr.items=null;
	pr.image=_gs.create('img'); pr.video=_gs.create('video'); pr.audio=_gs.create('audio');
	pr.defaultType='image';
	
	if(!gsPreview.nextSvg)
	gsPreview.nextSvg="<svg xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 26.458333 26.458333\" height=\"100\" width=\"100\"> <g transform=\"translate(0,-270.54167)\" id=\"layer1\"> <g transform=\"matrix(0.96000002,0,0,0.96000002,0.52916689,11.350821)\" style=\"stroke:#bab8b6;stroke-opacity:1\" id=\"g5265\"> <circle style=\"opacity:1;fill:none;fill-opacity:1;stroke:#bab8b6;stroke-width:2.8404336;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" id=\"path5036\" cx=\"13.229166\" cy=\"283.77084\" r=\"11.808949\" /> <path style=\"fill:none;stroke:#bab8b6;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" d=\"M 2.3812499,284.03542 H 17.727082\" id=\"path5232\" /> <path style=\"fill:none;stroke:#bab8b6;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" d=\"m 14.022918,278.47918 5.291665,6.61458\" id=\"path5234\" /> <path style=\"fill:none;stroke:#bab8b6;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" d=\"m 14.022918,289.59166 5.291665,-6.61458\" id=\"path5234-0\" /> </g> </g></svg>";
	
	if(!gsPreview.closeSvg)
	gsPreview.closeSvg="<svg xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 26.458333 26.458334\" height=\"100\" width=\"100\"> <g transform=\"translate(0,-270.54165)\" id=\"layer1\"> <g id=\"g4542\"> <circle style=\"opacity:1;fill:none;fill-opacity:1;stroke:#bab8b6;stroke-width:2.683;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" id=\"path4485\" cx=\"13.229167\" cy=\"283.77081\" r=\"11.358451\" /> <path style=\"fill:none;stroke:#bab8b6;stroke-width:3;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" d=\"m 9.0467697,279.58841 8.3647943,8.3648\" id=\"path4487\" /> <path style=\"fill:none;stroke:#bab8b6;stroke-width:3;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\" d=\"m 17.411564,279.58841 -8.364794,8.3648\" id=\"path4487-5\" /> </g> </g></svg>";
	
	var nextBtn=_gs.create(); nextBtn.addClass('gsPreviewNext');
	nextBtn.innerHTML=gsPreview.nextSvg; pr.add(nextBtn);
	nextBtn.addEventListener("click",function(e){
		e.target.parentElement.nav(e.target.parentElement.index+1);
		e.stop();
	});
	
	var backBtn=_gs.create(); backBtn.addClass('gsPreviewBack');
	backBtn.innerHTML=gsPreview.nextSvg; pr.add(backBtn);
	backBtn.addEventListener("click",function(e){
		e.target.parentElement.nav(e.target.parentElement.index-1);
		e.stop();
	});
	
	var closeBtn=_gs.create(); closeBtn.addClass('gsPreviewClose');
	closeBtn.innerHTML=gsPreview.closeSvg; pr.add(closeBtn);
	closeBtn.addEventListener("click",function(e){
		e.target.parentElement.close();
		e.stop();
	});
	
	var view=_gs.create(); view.addClass('gsPreviewView'); pr.add(view);
	
	
	return pr;
};
gsPreview.show=function(items,par)
{
	if(!this.parentElement){
		if(par){
			if(typeof(par)=="string")par=_gs('#'+par);
			par.appendChild(this);
		}else document.body.appendChild(this);
	}
	
	if(items instanceof Array)this.items=items;
	this.nav(0);
};
gsPreview.nav=function(index)
{
	if(this.items instanceof Array){
		if(this.items.length>0){
			if(index>=this.items.length)index=0;
			else if(index<0)index=this.items.length-1;
			
			this.index=index;
			var item=this.items[index];
			var type=this.defaultType;
			if(typeof(item)=='object'){
				type=item.type; item=item.value;
			}
			var view=this.get('.gsPreviewView')[0];
			view.innerHTML='';
			switch(type.toLowerCase()){
				case 'html': view.innerHTML=item; break;
				case 'video': this.video.attr('src',item); view.add(this.video); break;
				case 'audio': this.audio.attr('src',item); view.add(this.audio); break;
				default:
					this.image.attr('src',item); view.add(this.image);
			}
		}
	}
};
gsPreview.close=function()
{
	if(this.parentElement){
		this.remove();
	}
};

function gsAutoZoom()
{
};



gsAutoZoom.bound=null;
gsAutoZoom.defaultTheme='default';
gsAutoZoom.border=3;
gsAutoZoom.vision=null;


gsAutoZoom.set=function(img)
{
	img.addClass('gsAutoZoom');
	img.addEventListener('mousemove',gsAutoZoom.onMove);
	img.addEventListener('mouseover',gsAutoZoom.onOver);
	img.addEventListener('mouseout',gsAutoZoom.onOut);
	
};
gsAutoZoom.onMove=function(e)
{
	window.autoZoomEvent=e;
	var img=e.target;
	var height=img.offsetHeight; var width=img.offsetWidth; var size=height;
	var rect=img.getClientRects()[0];
	
	if(gsAutoZoom.bound){
		var x=e.pageX-gsAutoZoom.bound.radius-(gsAutoZoom.border); var y=e.pageY-gsAutoZoom.bound.radius-(gsAutoZoom.border);
		if(x<rect.left+window.scrollX)x=rect.left+window.scrollX;
		else if(x+gsAutoZoom.bound.size+(gsAutoZoom.border*2)>(rect.left+window.scrollX+rect.width))
			x= (rect.left+window.scrollX+rect.width) - gsAutoZoom.bound.size -(gsAutoZoom.border*2);
		
		if(y<rect.top+window.scrollY)y=rect.top+window.scrollY;
			else if(y+gsAutoZoom.bound.size+(gsAutoZoom.border*2)>(rect.top+window.scrollY+rect.height))
				y= (rect.top+window.scrollY+rect.height) - gsAutoZoom.bound.size -(gsAutoZoom.border*2);
		
		gsAutoZoom.bound.style.left=x+"px"; gsAutoZoom.bound.style.top=y+"px";
		
		x-=(rect.left+window.scrollX+gsAutoZoom.border); if(x<0)x=0; y-=(rect.top+scrollY+gsAutoZoom.border); if(y<0)y=0;
		if(gsAutoZoom.vision){
			gsAutoZoom.vision.style.backgroundPosition="-"+(x*img.zoom*img.vsize)+"px -"+(y*img.zoom*img.vsize)+"px";
		}
	}
};
gsAutoZoom.onOver=function(e)
{
	var img=e.target;
	var rect=img.getClientRects()[0];
	
	var zoom=img.attr('zoom')?parseFloat(img.attr('zoom')):3;
	var vsize=img.attr('vision-size')?parseFloat(img.attr('vision-size')):2;
	img.zoom=zoom;
	img.vsize=vsize;
	var bound=gsAutoZoom.bound;
	if(!bound){
		bound=_gs.create();
		bound.attr('control','gsAutoZoom');
		bound.attr('theme',gsAutoZoom.defaultTheme);
		bound.addClass('bound');
		gsAutoZoom.bound=bound;
	}
	if(!bound.parentElement)document.body.add(bound);
	
	var height=img.offsetHeight; var width=img.offsetWidth;
	
	var bound_x=width/zoom;
	bound.size=bound_x;
	bound.radius=bound_x/2;
	bound.style.width=bound_x+"px"; bound.style.height=bound_x+"px";
	
	var vision=gsAutoZoom.vision;
	if(!vision){
		vision=_gs.create();
		vision.attr('control','gsAutoZoom');
		vision.attr('theme',gsAutoZoom.defaultTheme);
		vision.addClass('vision');
		gsAutoZoom.vision=vision;
	}
	if(!vision.parentElement)document.body.add(vision);
	vision.style.width = (bound.size+gsAutoZoom.border) * vsize * zoom +"px"; vision.style.height = (bound.size+gsAutoZoom.border) * vsize * zoom +"px";
	vision.style.top = rect.top + window.scrollY + "px";
	if(rect.left + rect.width < (window.innerWidth/2))vision.style.left=(rect.left+rect.width+gsAutoZoom.border*15)+"px";
	else vision.style.left=(rect.left-(bound.size*vsize*zoom)-gsAutoZoom.border*15)+"px";
	
	vision.style.backgroundImage="url('"+img.attr('src')+"')"; vision.style.backgroundSize=(zoom * vsize * width)+"px " + (zoom * vsize * height)+"px";
};
gsAutoZoom.onOut=function(e)
{
	if(gsAutoZoom.bound){
		gsAutoZoom.bound.remove();
	}
	if(gsAutoZoom.vision){
		gsAutoZoom.vision.remove();
	}
};

_gs=gs.select;
gs.config();