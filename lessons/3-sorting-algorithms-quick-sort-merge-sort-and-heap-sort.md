# Sorting Algorithms: Quick Sort, Merge Sort, and Heap Sort

## Overview
Sorting algorithms are fundamental in computer science, enabling efficient data organization. This lesson focuses on three advanced sorting algorithms: Quick Sort, Merge Sort, and Heap Sort. Each algorithm has its unique approach, advantages, and use cases. By the end of this lesson, you will understand how these algorithms work and when to use them.

## Key Concepts

### 1. Quick Sort
- **Description**: A divide-and-conquer algorithm that selects a 'pivot' element and partitions the array into two sub-arrays: elements less than the pivot and elements greater than the pivot.
- **Time Complexity**: Average case O(n log n), worst case O(n²) (when the smallest or largest element is always chosen as the pivot).
- **Space Complexity**: O(log n) due to recursive stack space.

### 2. Merge Sort
- **Description**: Another divide-and-conquer algorithm that divides the array into halves, sorts each half, and then merges them back together.
- **Time Complexity**: O(n log n) for all cases.
- **Space Complexity**: O(n) due to the temporary arrays used for merging.

### 3. Heap Sort
- **Description**: Utilizes a binary heap data structure to sort elements. It first builds a max heap from the input data, then repeatedly extracts the maximum element and rebuilds the heap.
- **Time Complexity**: O(n log n) for all cases.
- **Space Complexity**: O(1) as it sorts in place.

## Code Walkthrough

### Quick Sort Implementation
```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
```

### Merge Sort Implementation
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example usage
print(merge_sort([3, 6, 8, 10, 1, 2, 1]))
```

### Heap Sort Implementation
```python
def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

# Example usage
arr = [3, 6, 8, 10, 1, 2, 1]
heap_sort(arr)
print(arr)
```

## Practice Exercises

1. **Quick Sort Challenge**: Modify the Quick Sort implementation to choose the pivot as the median of the first, middle, and last elements of the array. Test your implementation with a variety of input arrays.

2. **Merge Sort Variations**: Implement a version of Merge Sort that sorts in descending order. Compare the performance of your implementation with the original version.

3. **Heap Sort Application**: Create a function that generates a random list of integers and sorts it using Heap Sort. Measure the time taken to sort lists of varying sizes (e.g., 100, 1000, 10000 elements) and analyze the results.

## Key Takeaways
- **Quick Sort** is efficient for average cases but can degrade to O(n²) in the worst case. It is often faster in practice due to its cache efficiency.
- **Merge Sort** guarantees O(n log n) performance and is stable, making it suitable for linked lists and large datasets.
- **Heap Sort** is an in-place algorithm that maintains O(n log n) performance and is useful when memory usage is a concern.
- Understanding the strengths and weaknesses of each algorithm helps in selecting the right one for specific applications.