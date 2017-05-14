var OEIS = new Object();

// OEIS.proxy is a hack to get around browsers' CORS security functionality. This will be removed once most of the class's functionality is implemented and tested.
OEIS.proxy = "http://crossorigin.me/";
OEIS.endpoint = OEIS.proxy + "http://oeis.org/";
// OEIS.lastRequest stores the response text of the last request to OEIS
OEIS.lastRequest = "";
// language that the search results should be in. defaults to "english"
OEIS.language = "english";

// Searches the OEIS by the sequence's ID (e.g. A000045)
// id: The ID of the sequence. Must be a string preceded by an 'A' and have six digits. Note that if the ID is not in the correct sequence, OEIS will treat it as a general search query and may return more than one result. Example: "A000045"
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByID = function (id, format, callback) {
    URL = OEIS.endpoint + "search?" + "language=" + OEIS.language + "&" + "q=" + "id:" + id + "&" + "fmt=" + format;
    OEIS.doRequest(URL, format, callback);
};

// Searches the OEIS by terms in a sequence (e.g. 1,1,2,3,5) with start=0.
// terms: an array of the terms
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByTerms = function (terms, format, callback) {
    OEIS.searchByTermsAndStart(terms, start=0, format, callback);
}

// Searches the OEIS by terms in a sequence (e.g. 1,1,2,3,5) and a start.
// terms: an array of the terms
// start: OEIS returns at most 10 results at a time, so start is used to adjust which results are retrieved. Example: start=0 gets the first 10 search results, start=10 will get the next 10 search results, etc.
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByTermsAndStart = function (terms, start, format, callback) {
    URL = OEIS.endpoint + "search?" + "language=" + OEIS.language + "&" + "q=" + terms.toString() + "&" + "fmt=" + format + "&" + "start=" + start;
    OEIS.doRequest(URL, format, callback);
}

// Searches the OEIS by a query string (e.g. '2,3,6,16 "symmetric group" author:Stanley')
// queryString: A string consisting of a query similar to what one might type in the search bar on the OEIS website. This string will be URI encoded before the request is sent, so the string really should be as one would type on the website. Example: '2,3,6,16 "symmetric group" author:Stanley'
// format: "json" or "text"
// callback: a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
OEIS.searchByQuery = function (queryString, format, callback) {
    URL = OEIS.endpoint + "search?" + "language=" + OEIS.language + "&" + "q=" + encodeURIComponent(queryString)+ "&" + "fmt=" + format;
    OEIS.doRequest(URL, format, callback);
};

// Retrieves the graph for a sequence by the sequence's ID.
// id: A string containing the ID of the sequence. Example: "A000045".
// format: "png"
// callback: a function that is called with the search results passed as an argument. The argument is returned as data since the format is PNG.
OEIS.getGraphForSequenceID = function (id, format, callback) {
    URL = OEIS.endpoint + id + "/graph?png=1";
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
//TODO: add xhr.onerror
//TODO: add xhr.ontimeout
OEIS.doRequest = function (URL, format, callback) {
    var xhr = OEIS.createCORSRequest("GET", URL);
    if (!xhr) {
        throw new Error('CORS not supported');
    }
    // xhr.onload is called after a successful request.
    xhr.onload = function () {
        OEIS.lastRequest = xhr.responseText;
        if (callback) {
            // Check if format is set in order to determine in which format to return the response.
            if (format) {
                // check if format has toLowerCase and trim methods (i.e. check if format is a string)
                if (format.toLowerCase && format.trim) {
                    cleanFormat = format.toLowerCase().trim();
                    if (cleanFormat === "json") {
                        callback(JSON.parse(xhr.responseText));
                    }
                    else if (cleanFormat === "text") {
                        callback(xhr.responseText);
                    }
                    else if (cleanFormat === "png") {
                        callback(xhr.response);
                    }
                }
            }
            else {
                callback(xhr.responseText);
            }
        }
    };
    xhr.send();
};
