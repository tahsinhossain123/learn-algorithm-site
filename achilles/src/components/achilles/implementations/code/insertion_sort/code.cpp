#include <vector>
#include <iostream>

void insertion_sort(std::vector<int>& arr) { // 2
	
	int n = arr.size(); // 3
	for (int i = 1; i < n; i++) { // 4
		int j = i - 1;
		int key = arr[i]; // 5
		while (j >= 0 && arr[j] > key) { // 6
			arr[j + 1] = arr[j]; // 7
			j = j - 1; // 8
		}
		arr[j + 1] = key; // 9
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
	insertion_sort(arr); // 1
	print_arr(arr); // 11
	return 0;
}
