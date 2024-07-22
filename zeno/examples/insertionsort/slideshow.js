const Zeno = require("../../zeno.js");
const slideshow = require("../../slideshow.js");
const fs = require("fs");

const zeno = new Zeno();
const $ = zeno.proxy;

// const src = fs.readFileSync("src.js", "utf8");
const src = fs.readFileSync(__filename.replace(/slideshow\.js$/, "src.js"), "utf8");

const insertionSort = $("insertionSort", 2, ["^arr"], () => {
	$.n = $.arr.length;
	$(3);
	$.for("i", 1, i => i < $.n, i => ++i, 4, () => {
		$.j = $.i - 1;
		$(5);
		$.key = $.arr[$.i];
		$(6);
		$.while(() => $.j >= 0 && $.arr[$.j] > $.key, 7, () => {
			$.arr[$.j + 1] = $.arr[$.j];
			$(8);
			$.j = $.j - 1;
			$(9);
		});
		$.arr[$.j + 1] = $.key;
		console.log($.i, $.arr);
		$(10);
	});
	return [ undefined, 999 ];
});

$.arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ];
$(0);
insertionSort(1, $.arr);
$.log($.arr);
$(11);

if (process.argv[3] === "print") {
	$.print();
} else if (process.argv[3] === "concise") {
	$.printConcise();
} else {
	slideshow(zeno, src);
}
