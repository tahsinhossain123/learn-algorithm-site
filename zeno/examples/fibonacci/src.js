const num = 6;

function fib(n) {
	if (n <= 1) {
		return n;
	}
	const num1 = fib(n - 1);
	const num2 = fib(n - 2);
	return num1 + num2;
}

const result = fib(num);
console.log(result);

