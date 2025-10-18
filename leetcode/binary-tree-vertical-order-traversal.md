# Binary Tree Vertical Order Traversal

**Difficulty:** Medium  |  **Topic:** Binary Tree

## Problem Summary
Given a binary tree, return the vertical order traversal of its nodes' values. For each column, the nodes should be ordered from top to bottom, and if two nodes are in the same row, they should be ordered from left to right.

## Approach
Use a breadth-first search (BFS) approach to traverse the tree level by level while keeping track of the column index for each node. Use a map to store the nodes in each column, and then sort the columns before returning the result.

## Detailed Solution
```python
from collections import defaultdict, deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def verticalOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []

        column_table = defaultdict(list)
        queue = deque([(root, 0)])
        min_column = 0
        max_column = 0

        while queue:
            node, column = queue.popleft()
            if node:
                column_table[column].append(node.val)
                min_column = min(min_column, column)
                max_column = max(max_column, column)
                queue.append((node.left, column - 1))
                queue.append((node.right, column + 1))

        return [column_table[x] for x in range(min_column, max_column + 1)]
```

## Complexity
Time Complexity: O(N), Space Complexity: O(N)
