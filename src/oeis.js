var OEIS = new Object();

OEIS.proxy = "http://crossorigin.me/";
OEIS.endpoint = OEIS.proxy + "http://oeis.org/";
OEIS.lastRequest = "";

OEIS.searchByID = function (id, format, callback) {
    URL = OEIS.endpoint + "search?" + "q=" + "id:A" + id + "&" + "fmt=" + format;
    OEIS.doRequest(URL, callback);
};

OEIS.searchByTerms = function (terms, format, callback) {
    URL = OEIS.endpoint + "search?" + "q=" + terms.toString() + "&" + "fmt=" + format;
    OEIS.doRequest(URL, callback);
}

OEIS.createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
};

OEIS.doRequest = function (URL, callback) {
    var xhr = OEIS.createCORSRequest("GET", URL);
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    xhr.onload = function() {
        OEIS.lastRequest = xhr.responseText;
        if (callback) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
};
