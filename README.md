# oeis.js
## A Javascript object for interacting with the OEIS ([OEIS.org](OEIS.org))

oeis.js contains a single object, `OEIS`, that has a set of properties and functions for querying the OEIS.

*The code has many helpful comments on how to use it in detail. Please read them when you need more documentation beyond this basic readme.*

## Installation

All of the code is contained within the `oeis.js` source file, located in `src/oeis.js`.  So to use `oeis.js` in your project, simply download the `oeis.js` source file and include it in your HTML like this:

`<script src="oeis.js"></script>`.

Feel free to clone the whole repository if you want to run the tests, which are currently just some function calls in an HTML file.

## Quick Start

This section is meant to get you using `oeis.js` quickly. For more comprehensive documentation on how to use `oeis.js`, please refer to the comments in the source file.

### Example 1 - Search OEIS by Sequence ID

`oeis.js` contains the singleton `OEIS`, which you can use to interact with the OEIS.  For example, to get the Fibonacci numbers (which has ID A000045), do:

`OEIS.searchByID("A000045", "json", console.log)`

The preceding function call specifies the sequence ID (A000045), the format that the results should be in (JSON), and a callback that should be called with the resulting data (console.log).

### Example 2 - Search OEIS by Terms

To search the OEIS for a series of terms - for example, `1,1,2,3,5`, do:

`OEIS.searchByTerms([1,1,2,3,5], "text", myFunction)`

This time, we searched the OEIS by an array of terms, specified the format to be OEIS's internal text format, and gave myFunction as the callback.

### Example 3 - Search OEIS by Search String

The OEIS can also be searched by a more general search term, as you might do if you were using the OEIS website. If you wanted to search for `2,3,6,16 "symmetric group" author:Stanley`, do:

`OEIS.searchByQuery("2,3,6,16 \"symmetric group\" author:Stanley", "json", myFunction)`

Note that the quotes around `symmetric group` have to be escaped since they are part of the search query. `OEIS.searchByQuery` will encode the query string as a URI, so there is no need for you to do that before calling it.

## Note on CORS

It appears that the OEIS does not have their server set up to allow cross-origin XMLHttpRequests, meaning that this code will not work within browsers unless they are specifically configured to allow cross-origin XMLHttpRequests.  While you can adjust your own browser so that it does not check the server's policies on cross-origin requests, this code generally will not work on default browser settings.  I've included a workaround by routing the requests through http://crossorigin.me.  This is a less-than-ideal solution which will be removed once the code is more stable, but in the meantime, please don't abuse crossorigin.me or OEIS by flooding them with requests with this code. Actually, please don't abuse either site at any time by flooding them with requests regardless of the functionality of this code.

This code should work in environments that do not check cross-origin policies, such as Phonegap and properly configured browsers, but I have not tested any of them yet.
