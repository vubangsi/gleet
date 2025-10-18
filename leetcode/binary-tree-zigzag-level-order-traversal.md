# Binary Tree Zigzag Level Order Traversal

**Difficulty:** Medium  |  **Topic:** Binary Trees

## Problem Summary
Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).

## Approach
Use a queue to perform a breadth-first traversal of the tree. Maintain a flag to determine the direction of traversal for each level. Store the values in a list and reverse them when necessary.

## Detailed Solution
```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        result = []
        queue = deque([root])
        left_to_right = True

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

            if not left_to_right:
                level_nodes.reverse()
            result.append(level_nodes)
            left_to_right = not left_to_right

        return result
```

## Complexity
Time Complexity: O(n), where n is the number of nodes in the tree. Space Complexity: O(n), for storing the nodes in the queue.
