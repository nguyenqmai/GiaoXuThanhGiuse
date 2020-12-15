package com.themais.firebaseserver;

import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by nguyenqmai on 11/23/2020.
 */
public class BST {
     public static class TreeNode {
         int val;
         TreeNode left;
         TreeNode right;
         TreeNode() {}
         TreeNode(int val) { this.val = val; }
         TreeNode(int val, TreeNode left, TreeNode right) {
             this.val = val;
             this.left = left;
             this.right = right;
         }
     }

    public static class Solution3 {
        public boolean isValidBST(TreeNode root) {
            if (root == null)
                return true;
            return Solution3.leftValidBST(root.left, Long.MIN_VALUE, root.val) &&
                    Solution3.rightValidBST(root.right, root.val, Long.MAX_VALUE);
        }

        public static boolean leftValidBST(TreeNode root, long min, long max) {
            if (root == null)
                return true;
            return min <= root.val && root.val <= max &&
                    Solution3.leftValidBST(root.left, min, root.val) &&
                    Solution3.rightValidBST(root.right, root.val, max);
        }

        public static boolean rightValidBST(TreeNode root, long min, long max) {
            if (root == null)
                return true;
            return min <= root.val && root.val <= max &&
                    Solution3.leftValidBST(root.left, min, root.val) &&
                    Solution3.rightValidBST(root.right, root.val, max);
        }
    }

    public static class LevelOrderTraversal {
        public List<List<Integer>> levelOrder(TreeNode root) {
            Map<Integer, List<Integer>> accumulator = new HashMap<>();

            acc(root, 0, accumulator);
            List<List<Integer>> ret = new ArrayList<>();
            for (int i = 0; i < accumulator.size(); i++) {
                ret.add(accumulator.get(i));
            }
            return ret;
        }

        public static void acc(TreeNode root, int level, Map<Integer, List<Integer>> accumulator) {
            if (root == null)
                return;

            List<Integer> found = accumulator.get(level);
            if (!accumulator.containsKey(level)) {
                found = new ArrayList<>();
                accumulator.put(level, found);
            }
            found.add(root.val);

            acc(root.left, level + 1, accumulator);
            acc(root.right, level + 1, accumulator);
        }

    }

    @Test
    public void test3() {
         TreeNode input = new TreeNode(10, new TreeNode(5), new TreeNode(15, new TreeNode(6), new TreeNode(20)));
        input = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        input = new TreeNode(-2147483648, null, new TreeNode(2147483647));
        boolean value = new Solution3().isValidBST(input);
        int abc = 12;
    }

    @Test
    public void testLevelOrderTraversal() {
        TreeNode input = new TreeNode(10, new TreeNode(5, null, new TreeNode(7)), new TreeNode(15, new TreeNode(6), new TreeNode(20)));
//        input = new TreeNode(2, new TreeNode(1), new TreeNode(3));
//        input = new TreeNode(-2147483648, null, new TreeNode(2147483647));
        List<List<Integer>> value = new LevelOrderTraversal().levelOrder(input);
        int abc = 12;
    }
}
