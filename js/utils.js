function findInObjectArray(array, key, value) {
	for(var i = 0; i < array.length; i++) {
		var foundObject = array[i];
		if(foundObject[key] == value) {
			return foundObject;
		}
	}
	return null;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function countLoadedElements(functionToCall) {
    loadCounter++;
    if(loadCounter == externalCalls) {
        functionToCall();
    }
}