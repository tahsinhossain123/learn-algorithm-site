const Zeno = require("../../zeno.js");
const slideshow = require("../../slideshow.js");

const zeno = new Zeno();
const $ = zeno.proxy;

const src = 
`const people = [ // 0 [
	["John", 15],
	["Jane", 13],
	["Mike", 20],
	["Sara", 18],
	["Tom", 25],
	["Lily", 11],
	["Bob", 30],
	["Alice", 17],
	["Eve", 31],
	["Adam", 19]
]; // ] 0

const adults = []; // 1 [
const children = []; // ] 1

for (let i = 0; i < people.length; ++i) { // 2

	const person = people[i]; // 3
	const [name, age] = person; // 4

	if (age >= 18) { // 5
		adults.push(name); // 6
	} else { // 7
		children.push(name); // 8
	}
}

adults.sort(); // 9 [
children.sort(); // ] 9

console.log({ adults, children }); // 10`;

$.people = [
	["John", 15],
	["Jane", 13],
	["Mike", 20],
	["Sara", 18],
	["Tom", 25],
	["Lily", 11],
	["Bob", 30],
	["Alice", 17],
	["Eve", 31],
	["Adam", 19]
];

$(0);

$.adults = [];
$.children = [];
$(1);

$.for("i", 0, (i) => i < $.people.length, (i) => { return i + 1; }, 2, (i) => {
	
	$.person = $.people[i];
	$(3);
	[ $.name, $.age ] = $.person;
	$(4);

	zeno.if(() => $.age >= 18, 5, () => {
		$.adults.push($.name);
		$(6);

	}, 7, () => {
		$.children.push($.name);
		$(8);
	});

});

$.adults.sort();
$.children.sort();
$(9);

$.log({ adults: $.adults, children: $.children });

$(10);

if (process.argv[3] === "print") {
	$.print();
} else if (process.argv[3] === "concise") {
	$.printConcise();
} else {
	slideshow(zeno, src);
}
