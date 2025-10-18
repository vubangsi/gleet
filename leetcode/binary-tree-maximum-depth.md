# Binary Tree Maximum Depth

**Difficulty:** Easy  |  **Topic:** Binary Trees

## Problem Summary
Given a binary tree, find its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

## Approach
Use a breadth-first search (BFS) approach to traverse the tree level by level, counting the number of levels until all nodes are processed.

## Detailed Solution
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        if not root:
            return 0
        queue = [root]
        depth = 0
        while queue:
            depth += 1
            for _ in range(len(queue)):
                node = queue.pop(0)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return depth
```

## Complexity
Time Complexity: O(n), where n is the number of nodes in the tree. Space Complexity: O(n) for the queue used in BFS.
