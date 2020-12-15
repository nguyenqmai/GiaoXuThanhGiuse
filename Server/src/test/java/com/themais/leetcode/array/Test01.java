package com.themais.leetcode.array;

import org.junit.Test;

import java.util.Arrays;
import java.util.List;

/**
 * Created by nguyenqmai on 11/24/2020.
 */
public class Test01 {
    public static class Solution {
        public int maxProfit(int[] prices) {
            int profit = 0;
            if (prices.length <= 1)
                return profit;


            int lowPos = findLowPrice(prices, 0);
                if (lowPos < prices.length) {
                    int maxValue = findHighPrice(prices, lowPos);
                    if (maxValue > prices[lowPos]) {
                        profit = maxValue - prices[lowPos];
                    }
                }
            return profit;
        }

        public static int findLowPrice(int[] prices, int start) {
            for (int pos = start; pos <= prices.length - 2; pos++) {
                if (prices[pos] < prices[pos + 1]) {
                    return pos;
                }
            }
            return prices.length;
        }

        public static int findHighPrice(int[] prices, int start) {
            int max = prices[start];
            for (int pos = start; pos < prices.length; pos++) {
                if (prices[pos] > max) {
                    max = prices[pos];
                }
            }
            return max;
        }
    }

    @Test
    public void testTradeStock() {
        List<int[]> cases = Arrays.asList(new int[] {2,1,2,1,0,1,2}, new int[]{7}, new int[]{7,8}, new int[]{9,8},new int[]{7,8,9}, new int[]{7,6,5,4,4,4,6}, new int[]{7,1,5,3,6,4}, new int[]{7,6,5,4,4,4}, new int[]{7,7,7});

        for (int[] input : cases) {
            int profit = (new Solution()).maxProfit(input);

            int abc = 123;
        }
    }
}
