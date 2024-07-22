const Zeno = require('../../zeno');
const slideshow = require('../../slideshow');

var source = 
`const num = 6; // 0

function fib(n) { // 1
	if (n <= 1) { // 2
		return n; // 3
	}
	const num1 = fib(n - 1); // 4
	const num2 = fib(n - 2); // 5
	return num1 + num2; // 6
}

const result = fib(num); // 7
console.log(result); // 8`;

const cppSource = `#include <iostream>

int fib(int n) { // 1
	if (n <= 1) { // 2
		return n; // 3
	}
	int num1 = fib(n - 1); // 4
	int num2 = fib(n - 2); // 5
	return num1 + num2; // 6
}

int main() {
	int num = 6; // 0
	int result = fib(num); // 7
	std::cout << result << endl; // 8
}`;

const sections = process.argv[2] === "cpp" ? cppSource : source;

const zeno = new Zeno();
const $ = zeno.proxy;

$.num = 6;
$(0);

const fib = $("fib", 1, ["n"], n => {

	if ($.if(_ => $.n <= 1, 2, _ => {
		return [3, $.n];
	})) { return; }

	$.num1 = fib(4, n - 1);
	$(4);

	$.num2 = fib(5, n - 2);
	$(5);

	return [6, $.num1 + $.num2];
});

$.result = fib(7, $.num);
$(7);

$.log($.result);
$(8);

if (process.argv[3] === "print") {
	$.print();
} else if (process.argv[3] === "concise") {
	$.printConcise();
} else {
	slideshow(zeno, sections);
}

