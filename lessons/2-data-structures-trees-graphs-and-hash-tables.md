# Data Structures: Trees, Graphs, and Hash Tables

## Overview
In this lesson, we will explore three fundamental data structures: Trees, Graphs, and Hash Tables. Understanding these data structures is crucial for solving complex problems efficiently and is a foundational skill in computer science and software development. We will discuss their characteristics, use cases, and provide practical examples to solidify your understanding.

## Key Concepts

### Trees
- **Definition**: A tree is a hierarchical data structure consisting of nodes, where each node has a value and a list of references to child nodes.
- **Types of Trees**:
  - **Binary Tree**: Each node has at most two children.
  - **Binary Search Tree (BST)**: A binary tree where the left child is less than the parent node, and the right child is greater.
  - **Balanced Trees**: Such as AVL Trees and Red-Black Trees, which maintain a balanced height for efficient operations.
- **Common Operations**:
  - Insertion
  - Deletion
  - Traversal (In-order, Pre-order, Post-order)

### Graphs
- **Definition**: A graph is a collection of nodes (vertices) and edges that connect pairs of nodes.
- **Types of Graphs**:
  - **Directed vs. Undirected**: Directed graphs have edges with a direction, while undirected graphs do not.
  - **Weighted vs. Unweighted**: Weighted graphs have edges with weights (costs), while unweighted graphs do not.
- **Common Algorithms**:
  - Depth-First Search (DFS)
  - Breadth-First Search (BFS)
  - Dijkstra's Algorithm (for shortest paths)

### Hash Tables
- **Definition**: A hash table is a data structure that implements an associative array, a structure that can map keys to values.
- **Key Concepts**:
  - **Hash Function**: Converts a key into an index in the hash table.
  - **Collision Resolution**: Techniques such as chaining (linked lists) or open addressing (probing).
- **Common Operations**:
  - Insertion
  - Deletion
  - Lookup

## Code Walkthrough

### Example: Binary Search Tree Implementation

```python
class TreeNode:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, key):
        if self.root is None:
            self.root = TreeNode(key)
        else:
            self._insert_rec(self.root, key)

    def _insert_rec(self, node, key):
        if key < node.val:
            if node.left is None:
                node.left = TreeNode(key)
            else:
                self._insert_rec(node.left, key)
        else:
            if node.right is None:
                node.right = TreeNode(key)
            else:
                self._insert_rec(node.right, key)

    def inorder_traversal(self, node):
        if node:
            self.inorder_traversal(node.left)
            print(node.val, end=' ')
            self.inorder_traversal(node.right)

# Example Usage
bst = BinarySearchTree()
bst.insert(5)
bst.insert(3)
bst.insert(7)
bst.inorder_traversal(bst.root)  # Output: 3 5 7
```

### Example: Graph Traversal using BFS

```python
from collections import deque

class Graph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, u, v):
        if u not in self.graph:
            self.graph[u] = []
        self.graph[u].append(v)

    def bfs(self, start):
        visited = set()
        queue = deque([start])
        visited.add(start)

        while queue:
            vertex = queue.popleft()
            print(vertex, end=' ')
            for neighbor in self.graph.get(vertex, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

# Example Usage
g = Graph()
g.add_edge(1, 2)
g.add_edge(1, 3)
g.add_edge(2, 4)
g.bfs(1)  # Output: 1 2 3 4
```

### Example: Hash Table Implementation

```python
class HashTable:
    def __init__(self):
        self.size = 10
        self.table = [[] for _ in range(self.size)]

    def hash_function(self, key):
        return hash(key) % self.size

    def insert(self, key, value):
        index = self.hash_function(key)
        for kv in self.table[index]:
            if kv[0] == key:
                kv[1] = value
                return
        self.table[index].append([key, value])

    def lookup(self, key):
        index = self.hash_function(key)
        for kv in self.table[index]:
            if kv[0] == key:
                return kv[1]
        return None

# Example Usage
ht = HashTable()
ht.insert("name", "Alice")
print(ht.lookup("name"))  # Output: Alice
```

## Practice Exercises

1. **Binary Tree Traversal**: Implement a function to perform a level-order traversal of a binary tree. Use a queue to help with the traversal.

2. **Graph Shortest Path**: Write a function that uses Dijkstra's algorithm to find the shortest path from a starting vertex to all other vertices in a weighted graph.

3. **Hash Table Collision Handling**: Modify the hash table implementation to include a method for deleting a key-value pair. Ensure that it handles collisions appropriately.

## Key Takeaways
- Trees, graphs, and hash tables are essential data structures that enable efficient data organization and retrieval.
- Understanding the properties and operations of these structures is crucial for algorithm design and optimization.
- Practice implementing and using these data structures to solidify your understanding and improve your problem-solving skills.