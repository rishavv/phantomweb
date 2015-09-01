var webserver = require('webserver');
var page = require('webpage').create(),
    method, address, elementId;

var server = webserver.create();
var service = server.listen(5000, function(request, response) {
	try{
		var reqParams = _extractParamsFromUrl(request.url);
    	_assignParameters(reqParams);
    }
    catch(err){
    	console.log(err);
		response.statusCode = 500;
		response.write('Error' +err);
		response.close();
    }
	page.viewportSize = {
        width: 1920,
        height: 1080
	};
	
	page.open(address, function(status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
        response.statusCode = 500;
        response.write('FAIL to load the address');
        response.close();
    } else {
    	if(method == 'convertsvg'){
    		window.setTimeout(function() {
        	try{
        		 var clipRect = page.evaluate(function(elementId) {
		            return document.querySelector('#' + elementId).getBoundingClientRect();
		        }, elementId);
		        page.clipRect = {
		            top: clipRect.top,
		            left: clipRect.left,
		            width: clipRect.width,
		            height: clipRect.height
		        };
		        var base64 = page.renderBase64('JPEG');
		        response.statusCode = 200;
				response.write(base64);
				response.close();
        	}catch(err){
        		response.statusCode = 500;
				response.write('Error '+err);
				response.close();
        	}	       
	    	}, 3000);
    	}
    	else{
    		window.setTimeout(function() {
        	try{
        		var htmlbody = page.evaluate(function() {
			    	return document.body.innerHTML;
			    });
		        response.statusCode = 200;
				response.write(htmlbody);
				response.close();
        	}catch(err){
        		response.statusCode = 500;
				response.write('Error '+err);
				response.close();
        	}	       
	    	}, 3000);
    	}   
    }
	});

});

var _extractParamsFromUrl = function(url) {
    try {
        var reqParams = _getReqParams(url);
    } catch (err) {
        console.log(err);
        throw err;
    }
    return reqParams;
}

var _getReqParams = function(url) {
    var url = url.slice(url.indexOf('?') + 1, url.length).split('&');
    var reqParams = {};
    for (var i = 0; i < url.length; i++) {
        reqParams[url[i].split('=')[0]] = url[i].split('=')[1];
    }
    console.log('request params ' + JSON.stringify(reqParams));
    return reqParams;
}


var _assignParameters = function(reqParams) {
	if(_isNullOrEmpty(reqParams.method)){
		console.log('No method provided');
        throw 'Invalid parameters';
	}

	if(reqParams.method == 'convertsvg'){
		method = reqParams.method;
		if (_isNullOrEmpty(reqParams.pathtofile) || _isNullOrEmpty(reqParams.elementid)) {
        console.log('Invalid parameters');
        throw 'Invalid parameters';
	    } else {
	        address = reqParams.pathtofile;
	        elementId = reqParams.elementid;
	    }

	}
	else if(reqParams.method == 'renderhtml'){
		if (_isNullOrEmpty(reqParams.pathtofile)){
			throw 'Invalid parameters';
		}
		else{
			method = reqParams.method;
			address = reqParams.pathtofile;
		}
	}
	else{
		console.log('Invalid method !');
        throw 'Invalid parameters';
	}
}

var _isNullOrEmpty = function(str) {
        if (str === undefined || str === null || str.length == 0){
        	return true;
        }
        else {
        	return false;
        }
}
