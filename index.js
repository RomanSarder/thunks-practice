function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);

	setTimeout(function(){
		cb(fake_responses[url]);
	},randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************
function makeLazyThunk (fn, ...args) {
	return function (innerCb) {
		fn(...args, innerCb)
	}
}

function makeEagerThunk (fn, ...args) {
	var cb;
	var result;

	fn(...args, function (response) {
		if (cb) {
			cb(response)
		} else {
			result = response
		}
	})

	return function getData (innerCb) {
		if (result) {
			return innerCb(result)
		} else {
			cb = innerCb
		}
	}
}


function getFileThunked(file) {
	var fn;
	var result;
	
	fakeAjax(file, function (response) {
		if (fn) {
			fn(response)
		} else {
			result = response
		}
	})

	return function getData (cb) {
		if (result) {
			cb(result)
		} else {
			fn = cb
		}
	}
}

function getFile (file, cb) {
	fakeAjax(file, function responseCallback (response) {
		cb(response)
	})
}

var getFileOneEager = makeEagerThunk(getFile, 'file1')
var getFileTwoLazyThunk = makeLazyThunk(getFile, 'file2')
var getFileThreeEagerThunk = makeEagerThunk(getFile, 'file3')

getFileTwoLazyThunk(res1 => {
	output(res1)

	getFileOneEager(res2 => {
		output(res2)

		getFileThreeEagerThunk(res3 => {
			output(res3)
		})
	})
})

