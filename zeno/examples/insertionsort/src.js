function insertionSort(arr) { // 2
	n = arr.length; // 3
	for (let i = 1; i < n; i++) { // 4
		let j = i - 1; // 5
		let key = arr[i]; // 6
		while (j >= 0 && arr[j] > key) { // 7
			arr[j + 1] = arr[j]; // 8
			j--; // 9
		}
		arr[j + 1] = key; // 10
	}
} 

let arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
insertionSort(arr); // 1
console.log(arr); // 12
