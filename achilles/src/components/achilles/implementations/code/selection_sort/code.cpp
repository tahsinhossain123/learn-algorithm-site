#include <vector>
#include <iostream>

void selection_sort(std::vector<int>& arr) { // 2

	int n = arr.size(); // 3
	for (int i = 0; i < n - 1; i++) { // 4
		int minimum = i; // 5
		for (int j = i + 1; j < n; j++) { // 6
			if (arr[j] < arr[minimum]) { // 7
				minimum = j; // 8
			}
		}
		if (minimum != i) { // 9 
			std::swap(arr[i], arr[minimum]); // 10
		}
	}

}

void print_arr(const std::vector<int>& arr) {

	std::cout << "[";
	for (int i = 0; i < arr.size(); i++) {
		std::cout << arr[i];
		if (i != arr.size() - 1) {
			std::cout << ", ";
		}
	}
	std::cout << "]" << std::endl;

}

int main() {
	std::vector<int> arr = { 4, 3, 9, 8, 6, 1, 7, 5, 2 }; // 0
	selection_sort(arr); // 1
	print_arr(arr); // 11
	return 0;
}
