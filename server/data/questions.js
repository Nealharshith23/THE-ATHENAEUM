export const initialQuestions = {
  setA: [
    {
      id: 1,
      text: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
      answer: "42",
      explanation: "The gap grows by 2 each time (+4, +6, +8, +10, +12). 30 + 12 = 42."
    },
    {
      id: 2,
      text: "Find the missing number: 3, 9, 27, 81, ?, 729",
      answer: "243",
      explanation: "Powers of 3 (3^1 to 3^6). Missing term is 3^5 = 243."
    },
    {
      id: 3,
      text: "Find the odd one out: 8, 27, 64, 100, 125, 216",
      answer: "100",
      explanation: "All others are perfect cubes (2^3, 3^3, 4^3, 5^3, 6^3). 100 is not a cube."
    },
    {
      id: 4,
      text: "Complete the series: 10, 20, 40, 70, 110, ?",
      answer: "160",
      explanation: "Differences increase by 10 (+10, +20, +30, +40, +50). 110 + 50 = 160."
    },
    {
      id: 5,
      text: "Find the next letter in the pattern: B, E, I, N, ?",
      answer: "T",
      explanation: "Gap increases: +3, +4, +5, +6. N + 6 positions = T."
    },
    {
      id: 6,
      text: "Find the next number: 2, 3, 5, 9, 17, ?",
      answer: "33",
      explanation: "Each term is double the previous term minus 1. 17 x 2 - 1 = 33."
    },
    {
      id: 7,
      text: "What comes next in the mixed series: J4, L9, N16, P25, ?",
      answer: "R36",
      explanation: "Letters skip one (J, L, N, P, R); numbers are perfect squares (2^2, 3^2, 4^2, 5^2, 6^2 = 36)."
    },
    {
      id: 8,
      text: "Determine the next term: 6, 13, 28, 59, ?",
      answer: "122",
      explanation: "Each term is double the previous term plus 1. 59 x 2 + 1 = 122."
    },
    {
      id: 9,
      text: "Find the missing term: Z1, X4, V9, T16, ?",
      answer: "R25",
      explanation: "Letters move backward by 2 (Z, X, V, T, R); numbers are perfect squares (1, 4, 9, 16, 25)."
    },
    {
      id: 10,
      text: "Complete the sequence: 5, 10, 17, 26, 37, ?",
      answer: "50",
      explanation: "Differences are consecutive odd numbers (+5, +7, +9, +11, +13). 37 + 13 = 50."
    },
    {
      id: 11,
      text: "What is the next number: 2, 5, 11, 23, 47, ?",
      answer: "95",
      explanation: "Each term is double the previous term plus 1. 47 x 2 + 1 = 95."
    },
    {
      id: 12,
      text: "Find the missing term: 1, 8, 27, 64, ?, 216",
      answer: "125",
      explanation: "Perfect cubes (1^3 to 6^3). Missing term is 5^3 = 125."
    },
    {
      id: 13,
      text: "Determine the next term: 5, 6, 14, 45, ?",
      answer: "184",
      explanation: "Pattern: previous x n + n (x1+1, x2+2, x3+3, x4+4). 45 x 4 + 4 = 184."
    },
    {
      id: 14,
      text: "Find the next value: 2, 9, 28, 65, ?",
      answer: "126",
      explanation: "Each term equals n^3 + 1 (for n = 1, 2, 3, 4, 5). 5^3 + 1 = 126."
    },
    {
      id: 15,
      text: "Complete the series: 7, 16, 37, 82, ?",
      answer: "175",
      explanation: "Each term is double the previous plus an increasing offset (+2, +5, +8, +11). 82 x 2 + 11 = 175."
    }
  ],
  setB: [
    {
      id: 1,
      text: "Find the next number: 5, 11, 23, 47, 95, ?",
      answer: "191",
      explanation: "Each term is double the previous term plus 1. 95 x 2 + 1 = 191."
    },
    {
      id: 2,
      text: "Complete the sequence: 1, 4, 9, 16, 25, ?, 49",
      answer: "36",
      explanation: "Perfect squares (1^2, 2^2...7^2). Missing term is 6^2 = 36."
    },
    {
      id: 3,
      text: "Find the missing term: 7, 14, 28, 56, ?, 224",
      answer: "112",
      explanation: "Each term is double the previous. 56 x 2 = 112."
    },
    {
      id: 4,
      text: "Letter pattern: A, D, I, P, ?",
      answer: "Y",
      explanation: "Positions are perfect squares (1, 4, 9, 16, 25). 25th letter is Y."
    },
    {
      id: 5,
      text: "Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, ?",
      answer: "21",
      explanation: "Fibonacci sequence. 8 + 13 = 21."
    },
    {
      id: 6,
      text: "Determine the next value: 4, 9, 20, 43, ?",
      answer: "90",
      explanation: "Double the previous plus an increasing offset (+1, +2, +3, +4). 43 x 2 + 4 = 90."
    },
    {
      id: 7,
      text: "Find the next term in decreasing series: 100, 96, 89, 79, ?",
      answer: "66",
      explanation: "Subtraction grows by 3 each step (-4, -7, -10, -13). 79 - 13 = 66."
    },
    {
      id: 8,
      text: "Complete the series: 3, 8, 15, 24, 35, ?",
      answer: "48",
      explanation: "Differences are consecutive odd numbers (+5, +7, +9, +11, +13). 35 + 13 = 48."
    },
    {
      id: 9,
      text: "Factorial series: 1, 2, 6, 24, 120, ?",
      answer: "720",
      explanation: "Factorial sequence. 6! = 720."
    },
    {
      id: 10,
      text: "Find the odd one out: 121, 144, 169, 200, 196, 225",
      answer: "200",
      explanation: "All others are perfect squares. 200 is not a square."
    },
    {
      id: 11,
      text: "Letter series: C, F, J, O, ?",
      answer: "U",
      explanation: "Gap grows (+3, +4, +5, +6). O + 6 = U."
    },
    {
      id: 12,
      text: "Interleaved series: 8, 12, 9, 13, 10, 14, ?",
      answer: "11",
      explanation: "Two interleaved series increase by 1. Primary series is 8, 9, 10, 11."
    },
    {
      id: 13,
      text: "Mixed series: M9, K7, I5, G3, ?",
      answer: "E1",
      explanation: "Letters step back by 2; numbers decrease by 2."
    },
    {
      id: 14,
      text: "Which letter pair does not fit: AB, DE, GH, JK, MO",
      answer: "MO",
      explanation: "In every valid pair, letters are adjacent. M and O skip a letter."
    },
    {
      id: 15,
      text: "Complete the series: 1, 3, 7, 15, 31, ?",
      answer: "63",
      explanation: "Double the previous term plus 1. 31 x 2 + 1 = 63."
    }
  ]
};
