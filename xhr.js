var Xhr = function(){
    
    var x = function(a){for(a=0; a<4;a++) try {return a ? new ActiveXObject([ ,"Msxml2","Msxml3","Microsoft"][a] + ".XMLHTTP"): new XMLHttpRequest}catch(e){}},
        encode = function(data) {
            if (typeof data === "string") {
                return data;
            }
            var e = encodeURIComponent,result = '';
            for (var k in data) {
                result = '&' + e(k) + '=' + e(data[k]);
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
                    var data = fetchAsText ? xhr.responseText : JSON.parse(xhr.responseText);
                    (xhr.status === 200 ? def.resolve : def.reject)(data,xhr.status);
                }
            };

            xhr.send(payload);
            
            def.abort = xhr.abort;
            
            return def;
        };
    
    return function(){
        
        var fetchAsText = false;
        
        this.json = function(){
            fetchAsText = false;
            return this;
        };
        
        this.text = function(){
            fetchAsText = true;
            return this;
        };
        
        this.get = function(url,data,headers){
            return request('GET',url,data,headers,fetchAsText);
        };
        
        this.post = function(url,data,headers){
            return request('POST',url,data,headers,fetchAsText);
        };
        
        this.put = function(url,data,headers){
            return request('PUT',url,data,headers,fetchAsText);
        };
        
        this.delete = function(url,data,headers){
            return request('DELETE',url,data,headers,fetchAsText);
        };
        
        this.spoof = function(data,status){
            return Promise().resolve(data,status || 200);
        };
    };
}();
