/*
 * A super lightweight cross browser ajax implementation
 * uses Promise
 */

var Xhr = function(){

	var x = function(a){for(a=0; a<4;a++) try {return a ? new ActiveXObject([ ,"Msxml2","Msxml3","Microsoft"][a] + ".XMLHTTP"): new XMLHttpRequest}catch(e){}},
		encode = function(data) {
			if (typeof data === "string") {
				return data;
			}
			var e = encodeURIComponent,result = '';
			for (var k in data) {
				result += '&' + e(k) + '=' + e(data[k]);
			}
			return result.substr(1);
		},
		request = function(method,url,data,headers,fetchAsText){
			var def = Promise(),
				xhr = x(),
				payload = encode(data || {});

			if (method === 'GET' && payload) {
				url += '?' + payload;
				payload = null;
			}

			xhr.open(method,url,true);
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

			for (var h in headers || {}) {
				xhr.setRequestHeader(h, headers[h]);
			}

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					(xhr.status === 200 ? def.resolve : def.reject)({
						data: JSON.parse(xhr.responseText),
						status: xhr.status,
						headers: xhr.getResponseHeader
					});
				}
			};

			xhr.send(payload);

			def.abort = xhr.abort;

			return def;
		};

	return {

		'get' : function(url,data,headers){
			return request('GET',url,data,headers);
		},

		'post' : function(url,data,headers){
			return request('POST',url,data,headers);
		},

		'put' : function(url,data,headers){
			return request('PUT',url,data,headers);
		},

		'delete' : function(url,data,headers){
			return request('DELETE',url,data,headers);
		},
        // Fake an async call using supplied data
		'spoof' : function(data,headers,status){
			return Promise().resolve({
				data : data,
				headers : function(header){
					return headers ? headers.header : null;
				},
				status : status || 200
			});
		}
	};
}();
