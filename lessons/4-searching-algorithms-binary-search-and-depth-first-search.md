# Searching Algorithms: Binary Search and Depth-First Search

## Overview
Searching algorithms are fundamental to computer science, enabling efficient data retrieval. This lesson focuses on two prominent searching techniques: **Binary Search** and **Depth-First Search (DFS)**. Binary Search is used for searching in sorted arrays, while DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. Understanding these algorithms is crucial for optimizing search operations in various applications.

## Key Concepts

### Binary Search
- **Definition**: A searching algorithm that finds the position of a target value within a sorted array.
- **Time Complexity**: O(log n), where n is the number of elements in the array.
- **Requirements**: The array must be sorted prior to applying binary search.
- **Process**:
  1. Start with two pointers: `low` (beginning of the array) and `high` (end of the array).
  2. Calculate the middle index: `mid = (low + high) / 2`.
  3. Compare the middle element with the target:
     - If equal, return the index.
     - If the target is less than the middle element, search the left half.
     - If the target is greater, search the right half.
  4. Repeat until the target is found or the pointers cross.

### Depth-First Search (DFS)
- **Definition**: A graph traversal algorithm that explores as far as possible along each branch before backtracking.
- **Time Complexity**: O(V + E), where V is the number of vertices and E is the number of edges.
- **Types**: Can be implemented using recursion or a stack.
- **Process**:
  1. Start from a selected node (source).
  2. Mark the node as visited.
  3. Explore each adjacent unvisited node recursively.
  4. Backtrack when no unvisited adjacent nodes are left.

## Code Walkthrough

### Binary Search Implementation in Python
```python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            low = mid + 1  # Search in the right half
        else:
            high = mid - 1  # Search in the left half
            
    return -1  # Target not found

# Example usage
sorted_array = [1, 3, 5, 7, 9, 11]
target_value = 7
result = binary_search(sorted_array, target_value)
print(f'Target found at index: {result}')
```

### Depth-First Search Implementation in Python
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)  # Process the node
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}
dfs(graph, 'A')
```

## Practice Exercises

1. **Binary Search Exercise**:
   - Write a function that takes a sorted list of integers and a target integer. Return the index of the target if found; otherwise, return -1. Test your function with various inputs.

2. **DFS Exercise**:
   - Modify the DFS function to return a list of nodes in the order they were visited. Test it with the provided graph example and print the result.

3. **Binary Search Edge Cases**:
   - Implement a binary search function that handles edge cases, such as an empty array or a target that is less than the smallest element or greater than the largest element in the array. Ensure it returns appropriate results for these cases.

## Key Takeaways
- **Binary Search** is efficient for searching in sorted arrays, significantly reducing the number of comparisons needed.
- **Depth-First Search** is a powerful graph traversal technique that can be implemented recursively or iteratively.
- Mastery of these algorithms enhances problem-solving skills in computer science and software development.
- Practice implementing these algorithms in various scenarios to solidify understanding and improve coding proficiency.