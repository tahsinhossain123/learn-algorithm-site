// const Zeno = require('../../zeno');
// const slideshow = require('../../slideshow');
import Zeno from './zeno.js';
import slideshow from './slideshow.js';

// let process = process;

var source = 
`function selectionSort(arr) { // 2

	const n = arr.length; // 3
	for (let i = 0; i < n - 1; i++) { // 4
		let minimum = i; // 5
		for (let j = i + 1; j < n; j++) { // 6
			if (arr[j] < arr[minimum]) { // 7
				minimum = j; // 8
			}
		}
		if (minimum !== i) { // 9
			[ arr[i], arr[minimum] ] = [ arr[minimum], arr[i] ]; // 10
		}
	}
} 

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
selectionSort(arr); // 1
console.log(arr); // 11
`;


const sections = source;

const zeno = new Zeno();
const $ = zeno.proxy;

$.arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ];
$(0);

const selectionSort = $("selectionSort", 2, ["^arr"], () => {
	$.n = $.arr.length;
	$(3);
	$.for("i", 0, i => i < $.n - 1, i => ++i, 4, i => {
		$.minimum = i;
		$(5);
		$.for("j", i + 1, j => j < $.n, j => ++j, 6, j => {
			$.if(() => $.arr[j] < $.arr[$.minimum], 7, () => {
				$.minimum = j;
				$(8);
			});
		});
		$.if(() => $.minimum !== i, 9, () => {
			const temp = [ $.arr[i], $.arr[$.minimum] ];
			$.arr[i] = temp[1];
			$.arr[$.minimum] = temp[0];
			$(10);
		});
	});
	return [ 999, undefined ];
});

selectionSort(1, $.arr);
$.log($.arr);
$(11);


// const merge = $("merge", 11, ["^arr", "start", "mid", "end", "^IGNORE: elemSources"], () => {
// 	$.leftArr = $.arr.slice($.start, $.mid + 1);
// 	$(12);
// 	$.rightArr = $.arr.slice($.mid + 1, $.end + 1);
// 	$(13);
//
// 	$.left = 0;
// 	$.right = 0;
// 	$.out = $.start;
// 	$(14);
//
// $.while(() => { return $.left < $.leftArr.length && $.right < $.rightArr.length }, 15, () => {
// 		$.if(() => { return $.leftArr[$.left] <= $.rightArr[$.right] }, 16, () => {
// 			$.arr[$.out] = $.leftArr[$.left];
// 			$(17);
// 			$["IGNORE: elemSources"][$.out] = 'l';
// 			$.left++;
// 			$(18);
// 			}, 19, () => {
// 				$.arr[$.out] = $.rightArr[$.right];
// 				$["IGNORE: elemSources"][$.out] = 'r';
// 				$(20);
// 				$.right++;
// 				$(21);
// 		});
// 		$.out++;
// 		$(22);
// 	});
//
// $.while(() => { return $.left < $.leftArr.length }, 23, () => {
// 		$.arr[$.out] = $.leftArr[$.left];
// 		$["IGNORE: elemSources"][$.out] = 'l';
// 		$(24);
// 		$.left++;
// 		$(25);
// 		$.out++;
// 		$(26);
// 	});
//
// 	zeno.set("IGNORE: elemSources", $["IGNORE: elemSources"].map((elem, idx) => idx <= $.end ? 'g' : elem));
//
// 	return [ 999, undefined ];
//
// });
//
// const sort = $("sort", 4, ["^arr", "start", "end", "^IGNORE: elemSources"], () => {
// 	if ($.if(() => { return $.start >= $.end }, 5, () => {
// 		return [ 6, undefined ];
// 	})) { return; }
//
// 	$.mid = Math.floor(($.start + $.end) / 2);
// 	$(7);
//
// 	sort(8, $.arr, $.start, $.mid, $["IGNORE: elemSources"]);
// 	sort(9, $.arr, $.mid + 1, $.end, $["IGNORE: elemSources"]);
// 	merge(10, $.arr, $.start, $.mid, $.end, $["IGNORE: elemSources"]);
//
// 	return [ 999, undefined ];
//
// });
//
// const mergesort = $("mergesort", 2, ["^arr", "^IGNORE: elemSources"], () => {
// 	sort(3, $.arr, 0, $.arr.length - 1, $["IGNORE: elemSources"]);
// 	return $.arr;
// });
//
// mergesort(1, $.arr, $["IGNORE: elemSources"]);

slideshow(zeno, sections);
