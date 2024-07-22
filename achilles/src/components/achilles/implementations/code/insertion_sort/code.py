def insertion_sort(arr): # 2
    n = len(arr) # 3
    for i in range(1, n): # 4
        j = i # 5
        key = arr[i] # 6
        while j > 0 and arr[j-1] > key: # 7
            arr[j] = arr[j-1] # 8
            j -= 1 # 9
        arr[j] = key # 10

arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ] # 0
insertion_sort(arr) # 1
print(arr) # 11

    
