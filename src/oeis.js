var OEIS = new Object();

// OEIS.proxy is a hack to get around browsers' CORS security functionality. This will be removed once most of the class's functionality is implemented and tested.
OEIS.proxy = "http://crossorigin.me/";
OEIS.endpoint = OEIS.proxy + "http://oeis.org/";
OEIS.lastRequest = "";

// Searches the OEIS by the sequence's ID (e.g. A000045)
// id: The ID of the sequence. Must be a string preceded by an 'A' and have six digits. Example: "A000045"
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByID = function (id, format, callback) {
    URL = OEIS.endpoint + "search?" + "q=" + "id:" + id + "&" + "fmt=" + format;
    OEIS.doRequest(URL, format, callback);
};

// Searches the OEIS by terms in a sequence (e.g. 1,1,2,3,5)
// terms: an array of the terms
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByTerms = function (terms, format, callback) {
    URL = OEIS.endpoint + "search?" + "q=" + terms.toString() + "&" + "fmt=" + format;
    OEIS.doRequest(URL, format, callback);
}

// Based heavily on code found on www.html5rocks.com by
// Monsur Hossain.
// https://www.html5rocks.com/en/tutorials/cors/
// Convenience method that creates and returns an XMLHttpRequest. Not meant for public use. For making requests, please use the OEIS.searchBy() family of functions.
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

// Convenience method that executes an XMLHttpRequest. Not meant for public use. For making requests, please use OEIS.searchBy() family of functions.
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
