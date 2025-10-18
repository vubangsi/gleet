# Binary Tree Level Order Traversal

**Difficulty:** Medium  |  **Topic:** Tree/BFS

## Problem Summary
Given a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

## Approach
Use a queue to perform a breadth-first search (BFS) on the binary tree. Start from the root and traverse each level, adding nodes to the queue and collecting their values in a list.

## Detailed Solution
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            level_nodes = []
            for _ in range(level_size):
                node = queue.popleft()
                level_nodes.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level_nodes)
        return result
```

## Complexity
Time Complexity: O(n), where n is the number of nodes in the tree. Space Complexity: O(n) for storing the queue.
