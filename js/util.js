function loadResource(url, type) {
	var ele = null;
	if(type == 'css') {
		ele = document.createElement("link");  
		ele.setAttribute("rel", "stylesheet");  
		ele.setAttribute("type", "text/css");  
		ele.setAttribute("href", url);
	} else if('script') {
		ele = document.createElement("script");
		ele.setAttribute("type", "text/javascript");
		ele.setAttribute("src", url);
	}
	if(!ele) {
		return;
	}
	var heads = document.getElementsByTagName("head");
	if(heads.length) {
		heads[0].appendChild(ele);
	} else {
		document.documentElement.appendChild(ele);
	}
}


function ajax(method, url, callback) {
	method = method || 'GET';
	var httpReq = new XMLHttpRequest();
	httpReq.onreadystatechange = function() {
		if(httpReq.readyState == 4 && httpReq.status == 200) {
			var data = httpReq.responseText;
			data = eval(data);
			if(callback) {
				callback(data);
			}
		} else {
			console.log(method + ' url ' + url + ' failed..');	
		}
	}
	httpReq.open(method, url, true);
	httpReq.send(null);
}