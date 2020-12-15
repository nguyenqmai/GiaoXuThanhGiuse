package com.themais.firebaseserver;

import org.junit.Test;

import java.util.Arrays;

/**
 * Created by nguyenqmai on 10/26/2020.
 */
public class AddTwoNumbers {
      public static class ListNode {
          int val;
          ListNode next;
          ListNode() {}
          ListNode(int val) { this.val = val; }
          ListNode(int val, ListNode next) { this.val = val; this.next = next; }
      }

    class Solution {
        public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
            int carryOver = 0;
            ListNode end = null;
            ListNode start = end;
            do {
                int l1Value = 0;
                if (l1 != null) {
                    l1Value = l1.val;
                    l1 = l1.next;
                }

                int l2Value = 0;
                if (l2 != null) {
                    l2Value = l2.val;
                    l2 = l2.next;
                }
                int sum = carryOver + l1Value + l2Value;
                ListNode newNode = new ListNode(sum % 10);
                carryOver = sum / 10;
                if (end == null) {
                    start = newNode;
                    end = start;
                } else {
                    end.next = newNode;
                    end = end.next;
                }
            } while (l1 != null || l2 != null);
            if (end.val == 0)
                end = null;
            return start;
        }
    }

    @Test
    public void test() {
          new Solution().addTwoNumbers(new ListNode(2, new ListNode(4, new ListNode(3))),
                  new ListNode(5, new ListNode(6, new ListNode(4))));
        int abc = 12;
    }
}
