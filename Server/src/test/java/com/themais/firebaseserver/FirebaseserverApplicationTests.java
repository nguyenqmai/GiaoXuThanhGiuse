package com.themais.firebaseserver;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FirebaseserverApplicationTests {

    public int findNextLowestPrice(int[] prices, int start) {
        if (prices.length == start)
            return -1;

        int pos = start + 1;
        while (pos < prices.length) {
            if (prices[pos - 1] < prices[pos])
                return pos - 1;
            pos += 1;
        }
        return pos -1;
    }

    public int findNextHighestPrice(int[] prices, int start) {
        if (prices.length == start)
            return -1;

        int pos = start + 1;
        while (pos < prices.length) {
            if (prices[pos - 1] > prices[pos])
                return pos - 1;
            pos += 1;
        }
        return pos - 1;
    }

    public int findNextPoint(int[] prices, int start, boolean isLowPoint) {
        if (prices.length == start)
            return -1;

        int pos = start + 1;
        while (pos < prices.length) {
            if (isLowPoint) {
                if (prices[pos - 1] < prices[pos])
                    return pos - 1;
            } else {
                if (prices[pos - 1] > prices[pos])
                    return pos - 1;
            }
            pos += 1;
        }
        return pos - 1;
    }

    public int maxProfit(int[] prices) {


        if (prices.length <= 1)
            return 0;

        if (prices.length == 2) {
            return (prices[1] <= prices[0]) ? 0 : prices[1] - prices[0];
        }

        int profit = 0;
        int start = 0;
        do {
            int lastLowestPricePos = findNextPoint(prices, start, true);
            if (lastLowestPricePos >= 0) {
                int lastHighestPricePos = findNextPoint(prices, lastLowestPricePos, false);
                if (lastHighestPricePos > lastLowestPricePos) {
                    profit += prices[lastHighestPricePos] - prices[lastLowestPricePos];
                    start = lastHighestPricePos;
                } else {
                    start = prices.length;
                }
            } else {
                start = prices.length;
            }
        } while (start < prices.length);

        return profit;
    }

    @Test
    public void contextLoads() {
        int[] input = {7,7,7,7,6,4,3,1,1,1,1,2,2,2,2,2};
        int profit = maxProfit(input);
        Arrays.sort(input);
        int abc = 12;
    }

}

