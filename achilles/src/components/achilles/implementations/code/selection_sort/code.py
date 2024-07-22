def selection_sort(arr): # 2

	n = len(arr) # 3
	for i in range(0, n - 1): # 4
		minimum = i # 5
		for j in range(i + 1, n): # 6
			if arr[j] < arr[minimum]: # 3
				minimum = j # 8
		if minimum != i: # 9
			arr[i], arr[minimum] = arr[minimum], arr[i] # 10

arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ] # 1
selection_sort(arr) # 12
print(arr) # 13
