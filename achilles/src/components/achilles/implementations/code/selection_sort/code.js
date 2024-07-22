function selectionSort(arr) { // 2

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
