# Binary Tree Right Side View

**Difficulty:** Medium  |  **Topic:** Binary Trees

## Problem Summary
Given a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

## Approach
Use a breadth-first search (BFS) approach to traverse the tree level by level. At each level, capture the last node's value to represent the right side view of the tree.

## Detailed Solution
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        right_view = []
        queue = deque([root])
        while queue:
            level_length = len(queue)
            for i in range(level_length):
                node = queue.popleft()
                if i == level_length - 1:
                    right_view.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return right_view
```

## Complexity
Time Complexity: O(n), Space Complexity: O(n)
