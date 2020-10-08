/*!
	Normalize-1.1.0.js: A collection of polyfills to standardize the JavaScript browser environment.
   Examples: window.console.log, Array.prototype.indexOf(), String.prototype.trim(), Array.forEach(), String.fromCodePoint(), etc.
   Yes, we know that you're a genius whiz-kid who writes all your own code from scratch.
	But sometimes, you'd rather not to. Deadlines, time constraints, or a subject too complicated or time-consuming
	to understand properly without serious effort, and you'd rather not spend that time, especially if someone else
	already has. So you decide (or are forced to) use a third-party library.

   But third-party code can be unreliable. Strange, hard-to-debug errors, third-party dependencies (with dependencies of their own). Many times you end up just
   writing the code you needed anyway. What if it could be avoided? Perhaps it can.
   normalize.js will help your third party code not break.

	Polyfill Order:

	General
	Number
	Math
	Array
	String
	Object
	Regexp

	| # | : Edited for formatting, (sometimes logic), cross-browser support
	#: marked as unneccesary to polyfill
	~: Not supported in Safari 1.
	!!: Want to polyfill, needs polyfill.

*/

/// -------------------------------------------------------- General purpose polyfills ---------------------------------------------------------------

"use strict";
"version 1.1.0";

// if undefined isn't undefined, undefined can be redefined
;(function(u) { if (undefined !== u) {
	try {
		Object.defineProperty(window, 'undefined', { value: u, enumerable: false, writable: false, configurable: false });
	}
	catch (e) { // Object.defineProperty isn't supported
		window['undefined'] = u;
	}
}})();

//;(function(u) { if (undefined !== u) { define( window, 'undefined', u ); } })();

/* Prevent IE / Legacy browsers from throwing on Element accessors, where Element isn't defined.
   Unlike for Node, third-party code usually doesn't check for that.
   We aren't bothering to truly polyfill IE-era browsers since they're so obsolete, but we do want any boilerplate code that runs to at least not throw any errors so we can redirect them
	or show a gracefully degraded user experience.
*/

if (typeof Element === 'undefined') { window.Element = function(){}; }
if (typeof CharacterData === 'undefined') { window.CharacterData = function(){}; }
if (typeof DocumentType === 'undefined') { window.DocumentType = function(){}; }


// Console-polyfill. MIT license | # | https://github.com/paulmillr/console-polyfill | Makes it safe to do console.log() always.
;(function(w) { if (!w.console) { w.console = {} }
	var con = w.console, prop, method, dummy = function(){}, properties = ['memory'];
	var methods = ('assert|clear|count|debug|dir|dirxml|error|exception|group|' +
	  'groupCollapsed|groupEnd|info|log|markTimeline|profile|profiles|profileEnd|' +
	  'show|table|time|timeEnd|timeline|timelineEnd|timeStamp|trace|warn|timeLog|trace').split('|'); // trace is twice??

	while (prop = properties.pop()) { if (!con[prop]) { con[prop] = {} }}
	while (method = methods.pop()) { if (!con[method]) { con[method] = dummy }}

	// Using `this` for web workers & supports Browserify / Webpack.
})((typeof window === 'undefined') ? this : window);


;(function( window, document, undefined ) {

	/*   Object.defineProperty convenience wrapper function.
		  Defaults to: {enumerable: false, writable: false, configurable: false}
		  Skips already defined properties; Many properties are read-only, and assigning a value to them if they're already defined
		  returns a TypeError in strict mode, so we have to be careful to only define them if they aren't already defined.
		  Won't throw if browser doesn't support Object.defineProperty.
	*/

	function define(obj, prop, val, options) {

		if (arguments.length === 3) { var userObj = options } // hoisted var

		var ecw = (function(o) {
		  if (typeof o === 'object' && o) { // not null
			  if (o.length === 3) { return o } // assume if array length of 3, its formatted correctly.

			  return [o.enumerable, o.configurable, o.writable];
		  }
		  return [0,0,0]; // default: not enumerable, configurable or writable
		})(options);

		var e = !!ecw[0], c = !!ecw[1], w = !!ecw[2];

		if (!(prop in obj)) { // only if prop isn't defined
			try {
			  Object.defineProperty(obj, prop, (userObj || {
				  value: val,
				  enumerable: e,
				  configurable: c,
				  writable: w
			  }));
			} catch (error) { // Object.defineProperty isn't supported
			  obj[prop] = val;
			}
		}
	}

	var cw = { configurable: true, writable: true }, CW = cw, _CW = CW, _cw = cw;

	function enumerate(obj) {
		for (var i in obj) { console.log(i, ':', obj[i]); }
	}

	function compare(f1, f2, arr) { // function to()
		if (typeof f1 !== 'function' || typeof f2 !== 'function') { return }
		for (var i=0;i<arr.length;i++) {
			console.log("F1: " + f1.name , f1(arr[i]), "F2:" + f2.name, f2(arr[i]))
		}
	}


// DOMContentLoaded Event polyfill | https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
// https://github.com/Kithraya/DOMContentLoaded v1.2.7 | MIT License (attribution isn't necessary, but appreciated <3)

DOMContentLoaded.version = "1.2.7";
function DOMContentLoaded() { "use strict";

    var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
    var alreadyRun, funcs = arguments;
		var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*\/")() );

    if (document.readyState === 'complete') { ready(null); return; }

    if (jscript_version < 9) { doIEScrollCheck(); return; }

    if (document[ael]) { document[ael]("DOMContentLoaded", ready, false); window[ael]("load", ready, false); } else
    if (aev in window) { window[aev]('onload', ready); }
    else { addOnload(ready); }

    function addOnload(fn) { var prev = window.onload;

        if (typeof addOnload.queue !== 'object') {
				addOnload.queue = [];
            if (typeof prev === 'function') { addOnload.queue.push( prev ); }
        }
        if (typeof fn === 'function') { addOnload.queue.push(fn) }

        window.onload = function() { for (var i=0; i < addOnload.queue.length; i++) { addOnload.queue[i]() } };
    }

    function dequeueOnload(fn, all) {
        if (typeof addOnload.queue === 'object') {
            for (var i = addOnload.queue.length-1; i >= 0; i--) {
                if (fn === addOnload.queue[i]) {
                    addOnload.queue.splice(i,1); if (!all) {break}
                }
            }
        }
    }

    function ready(time) {
        if (alreadyRun) {return} alreadyRun = true;

        var readyTime = +new Date();

		    detach();

        for (var i=0; i < funcs.length; i++) { var func = funcs[i];

            if (typeof func === 'function') {
                func.call(document, {
                  'readyTime': (time === null ? null : readyTime),
                  'funcExecuteTime': +new Date(),
                  'currentFunction': func
                });
            }
        }
    }

    function detach() {
        if (document[rel]) { document[rel]("DOMContentLoaded", ready); window[rel]("load", ready); } else
        if (dev in window) { window[dev]("onload", ready); }
        else { dequeueOnload(ready) }
    }

    function doIEScrollCheck() { // for use in IE < 9 only.
        if ( window.frameElement ) { try { window.attachEvent("onload", ready); } catch (e) { } return; }
        try {
            document.documentElement.doScroll('left');
        } catch(error) {
            setTimeout(function() {
                (document.readyState === 'complete') ? ready() : doIEScrollCheck();
            }, 50);
            return;
        }
        ready();
    }
}

// Uncomment this line to expose
/// window['DOMContentLoaded'] = DOMContentLoaded; // Tested via BrowserStack.

///------------------------------------------------------- Element / DOM manipulation polyfills -------------------------------------------------------------

Element.prototype.remove || (Element.prototype.remove = function() {
	if (this.parentNode) { this.parentNode.removeChild(this) }
});

/// ------------------------------------------------------ Window, Document property polyfills --------------------------------------------------------------
	define( window, 'isNaN', function(v) { return +v !== +v }, cw);

	if (!document['head']) {
		document.head = ('getElementsByTagName' in document) ? document.getElementsByTagName('head')[0] : document.all[1];
	}

///------------------------------------------------------- Number property polyfills --------------------------------------------------------------

	define(Number, 'EPSILON', Math.pow(2, -52)); // Static properties of Number
	define(Number, 'MAX_SAFE_INTEGER', 9007199254740991);
	define(Number, 'MIN_SAFE_INTEGER', -9007199254740991);
	define(Number, 'POSITIVE_INFINITY', Infinity);
	define(Number, 'NEGATIVE_INFINITY', -Infinity);
	define(Number, 'MAX_VALUE', 1.7976931348623157e+308);
	define(Number, 'MIN_VALUE', 5e-324);
	define(Number, 'NaN', NaN);

	define(Number, 'isNaN', function(i) { return typeof i === 'number' && (i !== i); }, cw);
	define(Number, 'isFinite', function(v) { return typeof v === 'number' && isFinite(v) }, cw);
	define(Number, 'isInteger', function(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }, cw);
	define(Number, 'isSafeInteger', function(v) { return Number.isInteger(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER }, cw);
	define(Number, 'parseInt', parseInt, cw);
	define(Number, 'parseFloat', parseFloat, cw);

	// if (!Number['isNumeric']) { Number.isNumeric = function(v) { } }

	// Number.prototype.toExponential() ~ Safari 1, Number.prototype.toFixed() ~ Safari 1
	// Number.prototype.toLocaleString() *, Number.prototype.toString() #, Number.prototype.valueOf() #

	/* Number.prototype.toString(), Number.prototype.valueOf() #
		function toLocaleStringSupportsOptions() {
			return !!(typeof Intl == 'object' && Intl && typeof Intl.NumberFormat == 'function');
		}
	*/

/// ------------------------------------------------------ Math property polyfills -----------------------------------------------------------------

	define(Math, 'E', 2.718281828459045); // Euler's Constant
	define(Math, 'LN10', 2.302585092994046); // Natural Logarithm
	define(Math, 'LN2', 0.6931471805599453); // etc.
	define(Math, 'LOG10E', 0.4342944819032518);
	define(Math, 'LOG2E', 1.4426950408889634);
	define(Math, 'PI', 3.141592653589793);
	define(Math, 'SQRT1_2', 0.7071067811865476);
	define(Math, 'SQRT2', 1.4142135623730951);

	/*	Methods that are listed as defined in all browsers since like IE3\4. Its really really highly unlikely that you would need to emulate them,
		but you can if you're especially paranoid.

		(✔️) : Math.abs(), Math.acos(), Math.asin(), Math.atan(), Math.atan2(), Math.ceil(), Math.cos(), Math.exp(),
		Math.floor(), Math.log(), Math.max(), Math.min(), Math.pow(), Math.random(), Math.round(), Math.sin(),
		Math.sqrt(), Math.tan().

	*/

	// Math.abs() /
	// Math.acos() /

	// Math.acosh() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh
	define( Math, 'acosh', function(x) { return Math.log(x + Math.sqrt(x * x - 1)); }, [0,1,1]); // { enumerable: false, configurable: true, writable: true }

	// Math.asin() /

	// Math.log1p() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p
	// Necessary to define before Math.asinh()
	define( Math, 'log1p', function(x) {
		x = Number(x);
		if (x < -1 || x !== x) { return NaN }
		if (x === 0 || x === Infinity) { return x }
		var nearX = (x + 1) - 1;
		return (nearX === 0 ? x : x * (Math.log(x + 1) / nearX));
	}, cw);

	// Math.asinh() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh
	define( Math, 'asinh', function(x) {
		var absX = Math.abs(x), w;
		if (absX < 3.725290298461914e-9) { return x } // |x| < 2^-28
		if (absX > 268435456) { w = Math.log(absX) + Math.LN2 }  // |x| > 2^28
		else if (absX > 2) {
			w = Math.log(2 * absX + 1 / (Math.sqrt(x * x + 1) + absX));  // 2^28 >= |x| > 2
		}
		else {
			var t = x * x, w = Math.log1p(absX + t / (1 + Math.sqrt(1 + t))) // log1p
		}
		return (x > 0 ? w : -w);
	}, cw);

	// Math.atan() /
	// Math.atan2() /

	// Math.atanh() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh
	define( Math, 'atanh', function(x) { return Math.log((1+x)/(1-x)) / 2 }, cw);

	// Math.cbrt() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt
	define( Math, 'cbrt', (function(pow) {
		return function(x) {
			 return x < 0 ? -pow(-x, 1/3) : pow(x, 1/3);	// ensure negative numbers remain negative
		};
	})(Math.pow), cw); // localize Math.pow to increase efficiency

	// Math.ceil() /

	// Math.clz32() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
	define( Math, 'clz32', (function(log, LN2){
		return function(x) {
			// Let n be ToUint32(x).
			// Let p be the number of leading zero bits in
			// the 32-bit binary representation of n.
			// Return p.
			var asUint = x >>> 0;
			if (asUint === 0) {
			   return 32;
			}
			return 31 - (log(asUint) / LN2 | 0) |0; // the "| 0" acts like math.floor
		};
	})(Math.log, Math.LN2), cw);

	// Math.cos() /

	// Math.cosh() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh
	define( Math, 'cosh', function(x) { return (Math.exp(x) + Math.exp(-x)) / 2; }, cw);

	// Math.exp() /

	// Math.expm1() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1
	define( Math, 'expm1', function(x) { return Math.exp(x) - 1 }, cw);

	// Math.floor() /

	// Math.fround() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround
	if (typeof Float32Array === 'function') {
		define( Math, 'fround',
			(function (array) {
				return function(x) { return array[0] = x, array[0] }
			})(new Float32Array(1)),
		cw);
	} else {
		define( Math, 'fround', function(arg) {
			arg = Number(arg);
			// Return early for ±0 and NaN.
			if (!arg) {return arg}
			var sign = arg < 0 ? -1 : 1;
			if (sign < 0) {arg = -arg;}
			// Compute the exponent (8 bits, signed).
			var exp = Math.floor(Math.log(arg) / Math.LN2);
			var powexp = Math.pow(2, Math.max(-126, Math.min(exp, 127)));
			// Handle subnormals: leading digit is zero if exponent bits are all zero.
			var leading = exp < -127 ? 0 : 1;
			// Compute 23 bits of mantissa, inverted to round toward zero.
			var mantissa = Math.round((leading - arg / powexp) * 0x800000);
			if (mantissa <= -0x800000) {return sign * Infinity}

			return sign * powexp * (leading - mantissa / 0x800000);
	   }, cw)
	}


	// Math.hypot() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
	define( Math, 'hypot', function() {
		var max = 0, s = 0, containsInfinity = false;

		for (var i = 0, len = arguments.length; i < len; ++i) {
		var arg = Math.abs(Number(arguments[i]));
		if (arg === Infinity) {containsInfinity = true}
		if (arg > max) {
		  s *= (max / arg) * (max / arg);
		  max = arg;
		}
		s += (arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max));
		}
		return containsInfinity ? Infinity : (max === 1 / 0 ? 1 / 0 : max * Math.sqrt(s));
	}, cw);


	// Math.imul() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
	define( Math, 'imul', function(opA, opB) {
		  opB |= 0; // ensure that opB is an integer. opA will automatically be coerced.
		  // floating points give us 53 bits of precision to work with plus 1 sign bit
		  // automatically handled for our convienence:
		  // 1. 0x003fffff /*opA & 0x000fffff*/ * 0x7fffffff /*opB*/ = 0x1fffff7fc00001
		  //    0x1fffff7fc00001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
		  var result = (opA & 0x003fffff) * opB;
		  // 2. We can remove an integer coersion from the statement above because:
		  //    0x1fffff7fc00001 + 0xffc00000 = 0x1fffffff800001
		  //    0x1fffffff800001 < Number.MAX_SAFE_INTEGER /*0x1fffffffffffff*/
		  if (opA & 0xffc00000 /*!== 0*/) { result += (opA & 0xffc00000) * opB |0; }
		  return result |0;
	}, cw);

	// Math.log() #

	// Math.log10 polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10
	define( Math, 'log10', function(x) { return Math.log(x) * Math.LOG10E }, cw);

	// Math.log1p(): placed before Math.asinh().

	// Math.log2() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2
	define( Math, 'log2', function(x) { return Math.log(x) * Math.LOG2E }, cw);

	// Math.max() #
	// Math.min() #
	// Math.pow() #
	// Math.random() #
	// Math.round() #

	// Math.sign() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
	define( Math, 'sign', function(x) {
		// If x is NaN, the result is NaN.
		// If x is -0, the result is -0.
		// If x is +0, the result is +0.
		// If x is negative and not -0, the result is -1.
		// If x is positive and not +0, the result is +1.
		return ((x > 0) - (x < 0)) || +x;
		// A more aesthetic pseudo-representation:
		//
		// ( (x > 0) ? 1 : 0 )  // if x is positive, then positive one
		//          +           // else (because you can't be both - and +)
		// ( (x < 0) ? -1 : 0 ) // if x is negative, then negative one
		//         ||           // if x is 0, -0, or NaN, or not a number,
		//         +x           // then the result will be x, (or) if x is
		//                      // not a number, then x converts to number
	}, cw);


	// Math.sin() /

	// Math.sinh() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh
	define( Math, 'sinh', function(x) { return (Math.exp(x) - Math.exp(-x)) / 2 }, cw);

	// Math.sqrt() /
	// Math.tan() /

	// Math.tanh() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh
	define( Math, 'tanh', function(x){
		var a = Math.exp(+x), b = Math.exp(-x);
		return (a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (a + b));
	}, cw);

	// Math.trunc() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/truncs
	define( Math, 'trunc', function(v) {
		v = +v;
		if (!isFinite(v)) {return v}
		return ((v - v % 1) || (v < 0 ? -0 : v === 0 ? v : 0));
	}, cw);


	// # End of Math polyfills

	/// --------------------------------------------------------------- Array property polyfills ---------------------------------------------------------------- //


	/*	Methods that are listed as defined in all browsers since like IE3\4. Its really really highly unlikely that you would need to emulate them,
		but you can if you're especially paranoid.

		Array.prototype.concat(),
	*/

	// Array.from() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
	// Production steps of ECMA-262, Edition 6, 22.1.2.1

	define( Array, 'from', (function() {   // TODO: check Array.from still works, due to having had to remove NFEs
		var symbolIterator;
		try {
		   symbolIterator = Symbol.iterator ? Symbol.iterator : 'Symbol(Symbol.iterator)';
		} catch (e) {
		   symbolIterator = 'Symbol(Symbol.iterator)';
		}

		var isCallable = function(fn) {
		   return (
				typeof fn === 'function' || Object.prototype.toString.call(fn) === '[object Function]'
			);
		};
		var toInteger = function (value) {
		   var number = Number(value);
		   if (isNaN(number)) { return 0 }
		   if (number === 0 || !isFinite(number)) { return number }
		   return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
		   var len = toInteger(value);
		   return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		var setGetItemHandler = function(isIterator, items) {
		   var iterator = isIterator && items[symbolIterator]();
		   return function(k) {
			   return isIterator ? iterator.next() : items[k];
		   };
		};

		var getArray = function (
			T,
			A,
			len,
		   getItem,
			isIterator,
			mapFn
		) {
		   // 16. Let k be 0.
		   var k = 0;
		   // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
		   while (k < len || isIterator) {
			   var item = getItem(k),
					  kValue = isIterator ? item.value : item;

			   if (isIterator && item.done) {
				   return A;
			   } else {
				if (mapFn) {
					A[k] = (typeof T === 'undefined') ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				   } else {
					A[k] = kValue;
				   }
			   }
			   k += 1;
		   }

		   if (isIterator) {
			   throw new TypeError('Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1');
		   } else {
			A.length = len;
		   }
		   return A;
		};

		// The length property of the from method is 1.
		return function(arrayLikeOrIterator /*, mapFn, thisArg */) {
		   // 1. Let C be the this value.
		   var C = this;

		   // 2. Let items be ToObject(arrayLikeOrIterator).
		   var items = Object(arrayLikeOrIterator);
		   var isIterator = isCallable(items[symbolIterator]);

		   // 3. ReturnIfAbrupt(items).
		   if (arrayLikeOrIterator == null && !isIterator) {
			throw new TypeError('Array.from requires an array-like object or iterator - not null or undefined');
		   }

		   // 4. If mapfn is undefined, then let mapping be false.
		   var mapFn = arguments.length > 1 ? arguments[1] : undefined;
		   var T;
		   if (typeof mapFn !== 'undefined') {
			   // 5. else
			   // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
			   if (!isCallable(mapFn)) {
				   throw new TypeError('Array.from: when provided, the second argument must be a function');
			   }

			   // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
			   if (arguments.length > 2) { T = arguments[2] }
		   }

		   // 10. Let lenValue be Get(items, "length").
		   // 11. Let len be ToLength(lenValue).
		   var len = toLength(items.length);

		   // 13. If IsConstructor(C) is true, then
		   // 13. a. Let A be the result of calling the [[Construct]] internal method
		   // of C with an argument list containing the single item len.
		   // 14. a. Else, Let A be ArrayCreate(len).
		   var A = isCallable(C) ? Object(new C(len)) : new Array(len);

		   return getArray(T, A, len,
			   setGetItemHandler(isIterator, items),
			   isIterator, mapFn
		   );
		};
	})(), { configurable: true, writable: true });

	// Array.isArray() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	define( Array, 'isArray', function(arg) { return Object.prototype.toString.call(arg) === '[object Array]' }, cw);

	// Array.of() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
	define( Array, 'of', function() { return Array.prototype.slice.call(arguments) }, [0,1,1]);

	// Array.prototype.concat() /

	// Array.prototype.copyWithin() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
	define( Array.prototype, 'copyWithin', function(target, start/*, end*/) {
		// Steps 1-2.
		if (this == null) { throw new TypeError('this is null or not defined') }

		var O = Object(this);

		// Steps 3-5.
		var len = O.length >>> 0;

		// Steps 6-8.
		var relativeTarget = target >> 0;

		var to = relativeTarget < 0 ?
			Math.max(len + relativeTarget, 0) : Math.min(relativeTarget, len);

		// Steps 9-11.
		var relativeStart = start >> 0;

		var from = relativeStart < 0 ?
		  Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

		// Steps 12-14.
		var end = arguments[2];
		var relativeEnd = end === undefined ? len : end >> 0;

		var final = relativeEnd < 0 ?
		  Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

		// Step 15.
		var count = Math.min(final - from, len - to);

		// Steps 16-17.
		var direction = 1;

		if (from < to && to < (from + count)) {
		  direction = -1;
		  from += count - 1;
		  to += count - 1;
		}

		// Step 18.
		while (count > 0) {
		  if (from in O) {
			 O[to] = O[from];
		  } else {
			 delete O[to];
		  }

		  from += direction;
		  to += direction;
		  count--;
		}

		// Step 19.
		return O;

	}, {configurable: true, writable: true});

	// Array.prototype.entries() !! No polyfill found, but wanted.

	// Array.prototype.every() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
	define( Array.prototype, 'every', function(callbackfn, thisArg) {
		'use strict';
		var T, k;
		if (this == null) { throw new TypeError('this is null or not defined') }

		// 1. Let O be the result of calling ToObject passing the this
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method
		//    of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if (typeof callbackfn !== 'function' && Object.prototype.toString.call(callbackfn) !== '[object Function]') {
		  throw new TypeError();
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) { T = thisArg }

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

		  var kValue;

		  // a. Let Pk be ToString(k).
		  //   This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty internal
		  //    method of O with argument Pk.
		  //   This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {
			var testResult;
			// i. Let kValue be the result of calling the Get internal method
			//    of O with argument Pk.
			kValue = O[k];

			// ii. Let testResult be the result of calling the Call internal method
			// of callbackfn with T as the this value if T is not undefined
			// else is the result of calling callbackfn
			// and argument list containing kValue, k, and O.
			if (T) { testResult = callbackfn.call(T, kValue, k, O) }
			else { testResult = callbackfn(kValue,k,O) }

			// iii. If ToBoolean(testResult) is false, return false.
			if (!testResult) { return false }
		  }
		  k++;
		}
		return true;

	}, { configurable: true, writable: true }); // enumerable: false


	// Array.prototype.fill() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
	define( Array.prototype, 'fill', function(value) {

	   // Steps 1-2.
	   if (this == null) { throw new TypeError('this is null or not defined') }

	   var O = Object(this);

	   // Steps 3-5.
	   var len = O.length >>> 0;

	   // Steps 6-7.
	   var start = arguments[1];
	   var relativeStart = start >> 0;

	   // Step 8.
	   var k = relativeStart < 0 ?
		 Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

	   // Steps 9-10.
	   var end = arguments[2];
	   var relativeEnd = end === undefined ? len : end >> 0;

	   // Step 11.
	   var finalValue = relativeEnd < 0 ?
		 Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

	   // Step 12.
	   while (k < finalValue) {
		 O[k] = value;
		 k++;
	   }

	   // Step 13.
	   return O;

	}, { configurable: true, writable: true });


	// Array.prototype.filter() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	define( Array.prototype, 'filter', function(func, thisArg) {
		'use strict';
		if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) ) { throw new TypeError() } // ?

		var len = this.length >>> 0,
			res = new Array(len), // preallocate array
			t = this, c = 0, i = -1;

		var kValue;
		if (thisArg === undefined) {
		  while (++i !== len){
			// checks to see if the key was set
			if (i in this){
			  kValue = t[i]; // in case t is changed in callback
			  if (func(t[i], i, t)){
				res[c++] = kValue;
			  }
			}
		  }
		}
		else {
		  while (++i !== len){
			// checks to see if the key was set
			if (i in this){
			  kValue = t[i];
			  if (func.call(thisArg, t[i], i, t)){
				res[c++] = kValue;
			  }
			}
		  }
		}

		res.length = c; // shrink down array to proper size
		return res;

	}, { configurable: true, writable: true });


	// Array.prototype.find() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	// Reference: https://tc39.github.io/ecma262/#sec-array.prototype.find

	define( Array.prototype, 'find', function(predicate) {
	   // 1. Let O be ? ToObject(this value).
	   if (this == null) { throw TypeError('"this" is null or not defined') }

	   var o = Object(this);

	   // 2. Let len be ? ToLength(? Get(O, "length")).
	   var len = o.length >>> 0;

	   // 3. If IsCallable(predicate) is false, throw a TypeError exception.
	   if (typeof predicate !== 'function') { throw TypeError('predicate must be a function') }

	   // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
	   var thisArg = arguments[1];

	   // 5. Let k be 0.
	   var k = 0;

	   // 6. Repeat, while k < len
	   while (k < len) {
		 // a. Let Pk be ! ToString(k).
		 // b. Let kValue be ? Get(O, Pk).
		 // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
		 // d. If testResult is true, return kValue.
		 var kValue = o[k];
		 if (predicate.call(thisArg, kValue, k, o)) { return kValue }
		 // e. Increase k by 1.
		 k++;
	   }
	   // 7. Return undefined.
	   return undefined;

	}, { configurable: true, writable: true });


	// Array.prototype.findIndex() polyfill  | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

	define( Array.prototype, 'findIndex', function(predicate) {
		 // 1. Let O be ? ToObject(this value).
		  if (this == null) { throw new TypeError('"this" is null or not defined') }

		  var o = Object(this);

		  // 2. Let len be ? ToLength(? Get(O, "length")).
		  var len = o.length >>> 0;

		  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
		  if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		  }

		  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
		  var thisArg = arguments[1];

		  // 5. Let k be 0.
		  var k = 0;

		  // 6. Repeat, while k < len
		  while (k < len) {
			// a. Let Pk be ! ToString(k).
			// b. Let kValue be ? Get(O, Pk).
			// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
			// d. If testResult is true, return k.
			var kValue = o[k];
			if (predicate.call(thisArg, kValue, k, o)) { return k }
			// e. Increase k by 1.
			k++;
		  }

		  // 7. Return -1.
		  return -1;

	}, { configurable: true, writable: true });


	// Array.prototype.forEach() polyfill | Production steps of ECMA-262, Edition 5, 15.4.4.18
	// Reference: http://es5.github.io/#x15.4.4.18
	define( Array.prototype, 'forEach', function(callback, thisArg) {

		if (this == null) { throw new TypeError('this is null or not defined') }

		var T, k;
		// 1. Let O be the result of calling toObject() passing the
		// |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get() internal
		// method of O with the argument "length".
		// 3. Let len be toUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If isCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") { throw new TypeError(callback + ' is not a function'); }

		// 5. If thisArg was supplied, let T be thisArg; else let
		// T be undefined.
		if (arguments.length > 1) { T = thisArg; }

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

		  var kValue;

		  // a. Let Pk be ToString(k).
		  //    This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty
		  //    internal method of O with argument Pk.
		  //    This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {

			// i. Let kValue be the result of calling the Get internal
			// method of O with argument Pk.
			kValue = O[k];

			// ii. Call the Call internal method of callback with T as
			// the this value and argument list containing kValue, k, and O.
			callback.call(T, kValue, k, O);
		  }
		  // d. Increase k by 1.
		  k++;
		}
		// 8. return undefined

	}, { configurable: true, writable: true });


	// Array.prototype.flat() !! polyfill wanted, creatable
	// Array.prototype.flatMap() !! polyfill wanted, creatable
	// Array.prototype.includes() !! polyfill wanted, creatable

	// Array.prototype.indexOf() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
	// Production steps of ECMA-262, Edition 5, 15.4.4.14 | Reference: http://es5.github.io/#x15.4.4.14

	define( Array.prototype, 'indexOf', function(searchElement, fromIndex) {
		"use strict";
		var k;

		if (this == null) { throw new TypeError('"this" is null or not defined') }

		var o = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of o with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = o.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) { return -1 }

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = fromIndex | 0;

		// 6. If n >= len, return -1.
		if (n >= len) { return -1 }

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		for (; k < len; k++) {
		// a. Let Pk be ToString(k).
		//   This is implicit for LHS operands of the in operator
		// b. Let kPresent be the result of calling the
		//    HasProperty internal method of o with argument Pk.
		//   This step can be combined with c
		// c. If kPresent is true, then
		//    i.  Let elementK be the result of calling the Get
		//        internal method of o with the argument ToString(k).
		//   ii.  Let same be the result of applying the
		//        Strict Equality Comparison Algorithm to
		//        searchElement and elementK.
		//  iii.  If same is true, return k.
			if (k in o && o[k] === searchElement) {return k}
		}
		return -1;

	}, { configurable: true, writable: true });

	// Array.prototype.join() /'
	// Array.prototype.keys() !! Polyfill wanted


	// Array.prototype.lastIndexOf() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
	// Production steps of ECMA-262, Edition 5, 15.4.4.15 | Reference: http://es5.github.io/#x15.4.4.15
	define( Array.prototype, 'lastIndexOf', function(searchElement /*, fromIndex*/) {
		'use strict';

		if (this == null) { throw new TypeError('this is null or not defined'); }

		var n, k, t = Object(this), len = t.length >>> 0;
		if (len === 0) { return -1 }

		n = len - 1;
		if (arguments.length > 1) {
		  n = Number(arguments[1]);
		  if (n != n) {
			n = 0;
		  }
		  else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		  }
		}

		for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
		  if (k in t && t[k] === searchElement) {
			return k;
		  }
		}
		return -1;

	}, { configurable: true, writable: true });

	// Array.prototype.length() - not necessary

	// Array.prototype.map() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
	// Production steps of ECMA-262, Edition 5, 15.4.4.19 | Reference: http://es5.github.io/#x15.4.4.19

	define( Array.prototype, 'map', function(callback/*, thisArg*/) {

		var T, A, k;

		if (this == null) { throw new TypeError('this is null or not defined') }

		// 1. Let O be the result of calling ToObject passing the |this|
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal
		//    method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== 'function') {
		  throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) { T = arguments[1] }

		// 6. Let A be a new array created as if by the expression new Array(len)
		//    where Array is the standard built-in constructor with that name and
		//    len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while (k < len) {

		  var kValue, mappedValue;

		  // a. Let Pk be ToString(k).
		  //   This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty internal
		  //    method of O with argument Pk.
		  //   This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {

			// i. Let kValue be the result of calling the Get internal
			//    method of O with argument Pk.
			kValue = O[k];

			// ii. Let mappedValue be the result of calling the Call internal
			//     method of callback with T as the this value and argument
			//     list containing kValue, k, and O.
			mappedValue = callback.call(T, kValue, k, O);

			// iii. Call the DefineOwnProperty internal method of A with arguments
			// Pk, Property Descriptor
			// { Value: mappedValue,
			//   Writable: true,
			//   Enumerable: true,
			//   Configurable: true },
			// and false.

			// In browsers that support Object.defineProperty, use the following:
			// Object.defineProperty(A, k, {
			//   value: mappedValue,
			//   writable: true,
			//   enumerable: true,
			//   configurable: true
			// });

			// For best browser support, use the following:
			A[k] = mappedValue;
		  }
		  // d. Increase k by 1.
		  k++;
		}

		// 9. return A
		return A;

	}, { configurable: true, writable: true });

	// Array.prototype.pop() +/
	// Array.prototype.push() +/

	// Array.prototype.reduce() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
	// Production steps of ECMA-262, Edition 5, 15.4.4.21 | Reference: http://es5.github.io/#x15.4.4.21
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce

	/* revisit this, unsure about the mdn polyfill */
	define( Array.prototype, 'reduce', function(callback /*, initialValue*/) {

      if (this == null) { throw new TypeError('this is null or not defined!') }
      if (typeof callback !== 'function') { throw new TypeError( callback + ' is not a function') }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // Steps 3, 4, 5, 6, 7
      var k = 0, value;

      if (arguments.length >= 2) { value = arguments[1]; }
	  else {
        while (k < len && !(k in o)) { k++ }

        // 3. If len is 0 and initialValue is not present,
        //    throw a TypeError exception.
        if (k >= len) { throw new TypeError('Reduce of empty array with no initial value') }

        value = o[k++];
      }

      // 8. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kPresent be ? HasProperty(O, Pk).
        // c. If kPresent is true, then
        //    i.  Let kValue be ? Get(O, Pk).
        //    ii. Let accumulator be ? Call(
        //          callbackfn, undefined,
        //          « accumulator, kValue, k, O »).
        if (k in o) { value = callback(value, o[k], k, o) }

        // d. Increase k by 1.
        k++;
      }

      // 9. Return accumulator.
      return value;

    }, { configurable: true, writable: true });


	// Array.prototype.reduceRight() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
	// Production steps of ECMA-262, Edition 5, 15.4.4.22 | Reference: http://es5.github.io/#x15.4.4.22

	define( Array.prototype, 'reduceRight', function(callback /*, initialValue*/) {
		'use strict';
		if (this == null) { throw new TypeError('this is null or not defined!') }

		if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function') }

		var t = Object(this), len = t.length >>> 0, k = len - 1, value;

		if (arguments.length >= 2) { value = arguments[1]; }
		else {
		  while (k >= 0 && !(k in t)) {
			k--;
		  }
		  if (k < 0) {
			throw new TypeError('Reduce of empty array with no initial value');
		  }
		  value = t[k--];
		}
		for (; k >= 0; k--) {
		  if (k in t) { value = callback(value, t[k], k, t); }
		}
		return value;

	}, {configurable: true, writable: true });


	// Array.prototype.reverse() +/
	// Array.prototype.shift() +/
	// Array.prototype.slice() +/

	// Array.prototype.some() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
	// Production steps of ECMA-262, Edition 5, 15.4.4.17 | Reference: http://es5.github.io/#x15.4.4.17
	define( Array.prototype, 'some', function(fun, thisArg) {
		'use strict';

		if (this == null) { throw new TypeError('Array.prototype.some called on null or undefined') }

		if (typeof fun !== 'function') { throw new TypeError() }

		var t = Object(this);
		var len = t.length >>> 0;

		for (var i = 0; i < len; i++) {
		  if (i in t && fun.call(thisArg, t[i], i, t)) {
			return true;
		  }
		}

		return false;

	}, cw);

	// Array.prototype.sort() +/

	// Array.prototype.splice();


	// NodeList.prototype.forEach() polyfill | https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
	if (window.NodeList && !NodeList.prototype.forEach) { NodeList.prototype.forEach = Array.prototype.forEach; }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// --------------------------------------------------------- String property polyfills ---------------------------------------------------------------

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	// String.prototype.trim() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
	define( String.prototype, 'trim', function() { return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') }, cw);


	// String.prototype.includes() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
	define( String.prototype, 'includes', function(search, start) {
		'use strict';
		if (search instanceof RegExp) { throw TypeError('first argument must not be a RegExp'); }
		if (start === undefined) { start = 0; }
		return (this.indexOf(search, start) !== -1);
	}, cw)


	// String.fromCodePoint() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint

	define( String, 'fromCodePoint', (function(stringFromCharCode) {
		return function() {
			var codeUnits = [], codeLen = 0, result = "";

			for (var index=0, len = arguments.length; index !== len; ++index) {

				var codePoint = +arguments[index];
				// correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
				// The surrounding `!(...)` is required to correctly handle `NaN` cases
				// The (codePoint>>>0) === codePoint clause handles decimals and negatives
				if (!(codePoint < 0x10FFFF && (codePoint >>> 0) === codePoint)) { throw RangeError("Invalid code point: " + codePoint) }
				if (codePoint <= 0xFFFF) { // BMP code point
					codeLen = codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
				  // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					codeLen = codeUnits.push(
						(codePoint >> 10) + 0xD800,  // highSurrogate
						(codePoint % 0x400) + 0xDC00 // lowSurrogate
					);
				}
				if (codeLen >= 0x3fff) {
				  result += stringFromCharCode.apply(null, codeUnits);
				  codeUnits.length = 0;
				}
			}
			return result + stringFromCharCode.apply(null, codeUnits);
		};
	 }(String.fromCharCode)), [0,1,1]);

	console.log(String.fromCodePoint(22222, 3344, 332, 134, 3, 666));



	// String.prototype.codePointAt() polyfill | # | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
	// https://mths.be/codepointat v0.2.0 by @mathias

	define( String.prototype, 'codePointAt', function(position) {

		  if (this == null) { throw TypeError('this is null or not defined!') }
		  var string = String(this);
		  var size = string.length;
		  // `ToInteger`
		  var index = position ? Number(position) : 0;
		  if (index != index) { index = 0; }  // better `isNaN`

		  // Account for out-of-bounds indices:
		  if (index < 0 || index >= size) { return undefined }
		  // Get the first code unit
		  var first = string.charCodeAt(index);
		  var second;
		  if ( // check if it’s the start of a surrogate pair
			first >= 0xD800 && first <= 0xDBFF && // high surrogate
			size > index + 1 // there is a next code unit
		  ) {
			second = string.charCodeAt(index + 1);
			if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
			  // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			  return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
			}
		  }
		  return first;

	}, { configurable: true, writable: true });



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// ------------------------------------------------------------- Object Property Polyfills ----------------------------------------------

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	// Object.keys() polyfill | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	define( Object, 'keys', (function() {
		'use strict';
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString', 'toLocaleString',
	          'valueOf', 'hasOwnProperty',
	          'isPrototypeOf', 'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function(obj) {
	      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj == null)) { // # was (===)
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) { result.push(prop) }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
   }()), { configurable: true, writable: true });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// --------------------------------------------------------- JSON Property Polyfills -------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//  json2.js | 2017-06-12 | Public Domain.
	//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	//  NOT CONTROL.

	//  This file creates a global JSON object containing two methods: stringify
	//  and parse. This file provides the ES5 JSON capability to ES3 systems.
	//  If a project might run on IE8 or earlier, then this file should be included.
	//  This file does nothing on ES5 systems.

	// # I had to remove excessive commenting and whitespace. 530 lines for just 2 functions is kind of ridiculous even for a development version,
	// # since we only need to look at the spec for reference anyways.

	// # JSON, JSON.parse(), JSON.stringify() polyfills | https://github.com/douglascrockford/JSON-js/blob/master/json2.js
	define( window, 'JSON', {}, { configurable: true, writable: true });

	;(function () {
	    "use strict";

	    var rx_one = /^[\],:{}\s]*$/;
	    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
	    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	    function f(n) { return (n < 10) ? "0" + n : n; } // Format integers to have at least two digits.

	    function this_value() { return this.valueOf() }

	    if (typeof Date.prototype.toJSON !== "function") {

			 define( Date.prototype, 'toJSON', function () {

	            return isFinite(this.valueOf())
	                ? (
	                    this.getUTCFullYear()
	                    + "-"
	                    + f(this.getUTCMonth() + 1)
	                    + "-"
	                    + f(this.getUTCDate())
	                    + "T"
	                    + f(this.getUTCHours())
	                    + ":"
	                    + f(this.getUTCMinutes())
	                    + ":"
	                    + f(this.getUTCSeconds())
	                    + "Z"
	                )
	                : null;
	        }, cw );

			  define( Boolean.prototype, 'toJSON', this_value , cw );
			  define( Number.prototype, 'toJSON', this_value, cw );
			  define( String.prototype, 'toJSON', this_value, cw );

	    }

	    var gap, indent, meta, rep;

	    function quote(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	        rx_escapable.lastIndex = 0;
	        return rx_escapable.test(string)
	            ? "\"" + string.replace(rx_escapable, function (a) {
	                var c = meta[a];
	                return typeof c === "string"
	                    ? c
	                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + "\""
	            : "\"" + string + "\"";
	    }


	    function str(key, holder) {

	// Produce a string from holder[key].

	        var i;          // The loop counter.
	        var k;          // The member key.
	        var v;          // The member value.
	        var length;
	        var mind = gap;
	        var partial;
	        var value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.

	        if (value && typeof value === "object" && typeof value.toJSON === "function") {
	            value = value.toJSON(key);
	        }

	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.

	        if (typeof rep === "function") { value = rep.call(holder, key, value) }

	// What happens next depends on the value's type.

	        switch (typeof value) {
	        case "string":
	            return quote(value);

	        case "number":

	// JSON numbers must be finite. Encode non-finite numbers as null.

	            return (isFinite(value))
	                ? String(value)
	                : "null";

	        case "boolean":
	        case "null":

	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce "null". The case is included here in
	// the remote chance that this gets fixed someday.

	            return String(value);

	// If the type is "object", we might be dealing with an object or an array or
	// null.

	        case "object":

	// Due to a specification blunder in ECMAScript, typeof null is "object",
	// so watch out for that case.

	            if (!value) { return "null" }

	// Make an array to hold the partial results of stringifying this object value.

	            gap += indent;
	            partial = [];

	// Is the value an array?

	            if (Object.prototype.toString.apply(value) === "[object Array]") {

	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.

	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || "null";
	                }

	// Join all of the elements together, separated with commas, and wrap them in
	// brackets.

	                v = partial.length === 0
	                    ? "[]"
	                    : gap
	                        ? (
	                            "[\n"
	                            + gap
	                            + partial.join(",\n" + gap)
	                            + "\n"
	                            + mind
	                            + "]"
	                        )
	                        : "[" + partial.join(",") + "]";
	                gap = mind;
	                return v;
	            }

	// If the replacer is an array, use it to select the members to be stringified.

	            if (rep && typeof rep === "object") {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === "string") {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (
	                                (gap)
	                                    ? ": "
	                                    : ":"
	                            ) + v);
	                        }
	                    }
	                }
	            } else {

	// Otherwise, iterate through all of the keys in the object.

	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (
	                                (gap)
	                                    ? ": "
	                                    : ":"
	                            ) + v);
	                        }
	                    }
	                }
	            }

	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.

	            v = partial.length === 0
	                ? "{}"
	                : gap
	                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
	                    : "{" + partial.join(",") + "}";
	            gap = mind;
	            return v;
	        }
	    }

	// If the JSON object does not yet have a stringify method, give it one.

	    if (typeof JSON.stringify !== "function") {
	        meta = {    // table of character substitutions
	            "\b": "\\b",
	            "\t": "\\t",
	            "\n": "\\n",
	            "\f": "\\f",
	            "\r": "\\r",
	            "\"": "\\\"",
	            "\\": "\\\\"
	        };
			  define( JSON, 'stringify', function(value, replacer, space) {

	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.

	            var i;
	            gap = ""; indent = "";

	// If the space parameter is a number, make an indent string containing that
	// many spaces.

	            if (typeof space === "number") {
	                for (i = 0; i < space; i += 1) { indent += " " }

	// If the space parameter is a string, it will be used as the indent string.

	            } else
					if (typeof space === "string") { indent = space }

	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.

	            rep = replacer;
	            if (replacer && typeof replacer !== "function" && (
	                typeof replacer !== "object"
	                || typeof replacer.length !== "number"
	            )) {
	                throw new Error("JSON.stringify");
	            }

	// Make a fake root object containing our value under the key of "".
	// Return the result of stringifying the value.

	            return str("", {"": value});
	        } , cw );
	    }


	// If the JSON object does not yet have a parse method, give it one.

	    if (typeof JSON.parse !== "function") {
			 define( JSON, 'parse', function(text, reviver) {

	// The parse method takes a text and an optional reviver function, and returns
	// a JavaScript value if the text is a valid JSON text.

	            var j;

	            function walk(holder, key) {

	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.

	                var k, v;
	                var value = holder[key];
	                if (value && typeof value === "object") {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) { value[k] = v }
										 else {
											 delete value[k]
										 }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }


	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many characters
	// incorrectly, either silently deleting them, or treating them as line endings.

	            text = String(text);
	            rx_dangerous.lastIndex = 0;
	            if (rx_dangerous.test(text)) {
	                text = text.replace(rx_dangerous, function (a) {
	                    return (
	                        "\\u"
	                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
	                    );
	                });
	            }

	// In the second stage, we run the text against regular expressions that look
	// for non-JSON patterns. We are especially concerned with "()" and "new"
	// because they can cause invocation, and "=" because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.

	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
	// replace all simple value tokens with "]" characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or "]" or
	// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

	            if (rx_one.test(
	                    text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")
	                )
	            ) {

	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.

	                j = eval("(" + text + ")");

	// In the optional fourth stage, we recursively walk the new structure, passing
	// each name/value pair to a reviver function for possible transformation.

	                return (typeof reviver === "function")
	                    ? walk({"": j}, "")
	                    : j;
	            }

	// If the text is not JSON parseable, then a SyntaxError is thrown.

	            throw new SyntaxError("JSON.parse");
	       } , cw );
	   }
	}());










//function isElement(element) { return element instanceof Element || element instanceof HTMLDocument; }

/*
	var hasTouchScreen = false;
if ("maxTouchPoints" in navigator) {
    hasTouchScreen = (navigator.maxTouchPoints > 0);
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = (navigator.msMaxTouchPoints > 0);
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}
if (hasTouchScreen) {}
*/

})( (function() {

	// # A globalThis polyfill | Adapted from https://mathiasbynens.be/notes/globalthis

	if (typeof window === 'object' && window.window === window) { return window } // all browsers + IE6-10 getter workaround
	if (typeof window === 'undefined' && typeof self !== 'undefined') { return self } // WebWorkers

	try { // both window and self are undefined

		Object.defineProperty( Object.prototype, '__magic__', { // hocus pocus
			get: function() {
				return this;
			},
			configurable: true // This makes it possible to 'delete' the getter later.
		});
		__magic__.globalThis = __magic__; // lolwat (perhaps make non-enumerable)
		delete Object.prototype.__magic__;

		return globalThis;

	} catch (e) {

		return (typeof globalThis === 'object') ? globalThis : ( (typeof global === 'object') ? global : this );

	}

})(), ((typeof document === 'undefined') ? {} : document) );
