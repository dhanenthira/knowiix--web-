// ============================================================================
// technicalProblemsData.js
// Random Problem Generator & Multi-Language Problem Catalog (Java, Python, C, C++, JS)
// ============================================================================

export const SUPPORTED_LANGUAGES = ['java', 'python', 'c', 'cpp', 'javascript'];

export const LANGUAGE_LABELS = {
  java: 'Java (OpenJDK)',
  python: 'Python 3',
  c: 'C (GCC)',
  cpp: 'C++ (G++)',
  javascript: 'JavaScript (Node.js)'
};

export const LANGUAGE_ICONS = {
  java: '☕',
  python: '🐍',
  c: '⚙️',
  cpp: '⚡',
  javascript: '🌐'
};

// Standard multi-language starter templates generator for any problem
export function getStarterCodeForLanguage(language, problem) {
  const title = problem?.title || 'Technical Challenge';
  const lang = (language || 'python').toLowerCase();

  switch (lang) {
    case 'java':
      return `// Problem: ${title}
// Language: Java (OpenJDK)
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        
        // TODO: Read inputs and implement solution
        // Example: int n = sc.nextInt();
        
        System.out.println("Solution");
    }
}
`;
    case 'c':
      return `/* Problem: ${title}
 * Language: C (GCC)
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // TODO: Read input from standard input (scanf / fgets)
    
    printf("Solution\\n");
    return 0;
}
`;
    case 'cpp':
      return `// Problem: ${title}
// Language: C++ (G++)
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // TODO: Read input from cin and print output to cout
    
    cout << "Solution" << "\\n";
    return 0;
}
`;
    case 'javascript':
    case 'js':
      return `// Problem: ${title}
// Language: JavaScript (Node.js)
const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (!input) return;
    
    // TODO: Parse input lines and compute result
    console.log("Solution");
}

solve();
`;
    case 'python':
    case 'python3':
    default:
      return `# Problem: ${title}
# Language: Python 3
import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    
    # TODO: Read inputs and print result
    print("Solution")

if __name__ == '__main__':
    solve()
`;
  }
}

// Curated Master Technical Problems Database
export const MASTER_TECHNICAL_PROBLEMS = [
  {
    id: 'tech-two-sum',
    slug: 'two-sum',
    title: 'Two Sum Target Indices',
    difficulty: 'easy',
    topic: 'Arrays & Hash Maps',
    category: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, find the two distinct indices such that their elements sum up to \`target\`.\n\nOutput the two 0-based indices separated by a space in ascending order. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    input_format: `First line contains integer N (size of array).\nSecond line contains N space-separated integers.\nThird line contains integer Target.`,
    output_format: `Print the two indices separated by a single space (e.g. "0 1").`,
    constraints: [
      '2 <= N <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Exactly one valid answer exists.'
    ],
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so output 0 1.'
      },
      {
        input: '3\n3 2 4\n6',
        output: '1 2',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so output 1 2.'
      }
    ],
    sample_test_cases: [
      { input: '4\n2 7 11 15\n9', expected_output: '0 1', is_hidden: false, explanation: 'Basic example' },
      { input: '3\n3 2 4\n6', expected_output: '1 2', is_hidden: false, explanation: 'Offset indices' }
    ],
    hidden_test_cases: [
      { input: '2\n3 3\n6', expected_output: '0 1', is_hidden: true },
      { input: '5\n-3 4 3 90 2\n0', expected_output: '0 2', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    n = int(lines[0].strip())\n    nums = list(map(int, lines[1].strip().split()))\n    target = int(lines[2].strip())\n    \n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            print(f"{seen[diff]} {i}")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        \n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                System.out.println(map.get(diff) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) {\n        scanf("%d", &nums[i]);\n    }\n    int target;\n    scanf("%d", &target);\n    \n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                printf("%d %d\\n", i, j);\n                free(nums);\n                return 0;\n            }\n        }\n    }\n    free(nums);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; i++) {\n        int diff = target - nums[i];\n        if (seen.find(diff) != seen.end()) {\n            cout << seen[diff] << " " << i << "\\n";\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}\n`
      }
    ],
    hints: [
      'A brute force O(N^2) checks all pairs. Can you use a Hash Map to achieve O(N) time?',
      'Store each number along with its index as you iterate through the list.'
    ]
  },
  {
    id: 'tech-valid-palindrome',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome String',
    difficulty: 'easy',
    topic: 'Two Pointers & Strings',
    category: 'Strings',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string \`s\`, output \`true\` if it is a palindrome, or \`false\` otherwise.`,
    input_format: `A single line containing the string S.`,
    output_format: `Print "true" (without quotes) if palindrome, else "false".`,
    constraints: ['1 <= S.length <= 10^5', 'S consists only of printable ASCII characters.'],
    examples: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 'race a car', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    sample_test_cases: [
      { input: 'A man, a plan, a canal: Panama', expected_output: 'true', is_hidden: false },
      { input: 'race a car', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: ' ', expected_output: 'true', is_hidden: true },
      { input: '0P', expected_output: 'false', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    s = lines[0]\n    clean = [c.lower() for c in s if c.isalnum()]\n    print("true" if clean == clean[::-1] else "false")\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine();\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) {\n                sb.append(Character.toLowerCase(c));\n            }\n        }\n        String filtered = sb.toString();\n        String rev = sb.reverse().toString();\n        System.out.println(filtered.equals(rev) ? "true" : "false");\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint main() {\n    char s[100005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    int left = 0, right = strlen(s) - 1;\n    while (left < right) {\n        while (left < right && !isalnum((unsigned char)s[left])) left++;\n        while (left < right && !isalnum((unsigned char)s[right])) right--;\n        if (tolower((unsigned char)s[left]) != tolower((unsigned char)s[right])) {\n            printf("false\\n");\n            return 0;\n        }\n        left++;\n        right--;\n    }\n    printf("true\\n");\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) return 0;\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        while (left < right && !isalnum(s[left])) left++;\n        while (left < right && !isalnum(s[right])) right--;\n        if (tolower(s[left]) != tolower(s[right])) {\n            cout << "false\\n";\n            return 0;\n        }\n        left++; right--;\n    }\n    cout << "true\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-max-subarray',
    slug: 'maximum-subarray-sum',
    title: 'Maximum Subarray Sum (Kadane)',
    difficulty: 'medium',
    topic: 'Dynamic Programming & Arrays',
    category: 'Algorithms',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and print its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.`,
    input_format: `First line contains N (size of array).\nSecond line contains N space-separated integers.`,
    output_format: `Print the maximum subarray sum.`,
    constraints: ['1 <= N <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '1\n1', output: '1', explanation: 'Single element subarray.' }
    ],
    sample_test_cases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expected_output: '6', is_hidden: false },
      { input: '5\n5 4 -1 7 8', expected_output: '23', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '1\n-1', expected_output: '-1', is_hidden: true },
      { input: '4\n-3 -2 -1 -4', expected_output: '-1', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    nums = list(map(int, lines[1].strip().split()))\n    max_sum = curr_sum = nums[0]\n    for x in nums[1:]:\n        curr_sum = max(x, curr_sum + x)\n        max_sum = max(max_sum, curr_sum)\n    print(max_sum)\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int maxSoFar = sc.nextInt();\n        int currMax = maxSoFar;\n        for (int i = 1; i < n; i++) {\n            int x = sc.nextInt();\n            currMax = Math.max(x, currMax + x);\n            maxSoFar = Math.max(maxSoFar, currMax);\n        }\n        System.out.println(maxSoFar);\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int first;\n    scanf("%d", &first);\n    int max_so_far = first;\n    int curr_max = first;\n    for (int i = 1; i < n; i++) {\n        int x;\n        scanf("%d", &x);\n        curr_max = (x > curr_max + x) ? x : curr_max + x;\n        if (curr_max > max_so_far) max_so_far = curr_max;\n    }\n    printf("%d\\n", max_so_far);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    long long first;\n    cin >> first;\n    long long max_sum = first, curr_sum = first;\n    for (int i = 1; i < n; i++) {\n        long long x;\n        cin >> x;\n        curr_sum = max(x, curr_sum + x);\n        max_sum = max(max_sum, curr_sum);\n    }\n    cout << max_sum << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-valid-parentheses',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses Matching',
    difficulty: 'easy',
    topic: 'Stack & Syntax',
    category: 'Data Structures',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    input_format: `A single string S containing bracket characters.`,
    output_format: `Print "true" if valid, else "false".`,
    constraints: ['1 <= S.length <= 10^4', 'S consists of parentheses only: "()[]{}"'],
    examples: [
      { input: '()[]{}', output: 'true', explanation: 'All brackets match correctly in order.' },
      { input: '(]', output: 'false', explanation: 'Mismatched closing bracket.' }
    ],
    sample_test_cases: [
      { input: '()[]{}', expected_output: 'true', is_hidden: false },
      { input: '(]', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '([{}])', expected_output: 'true', is_hidden: true },
      { input: '([)]', expected_output: 'false', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    s = lines[0].strip()\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                print("false")\n                return\n        else:\n            stack.append(char)\n    print("true" if not stack else "false")\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) {\n                System.out.println("false");\n                return;\n            }\n        }\n        System.out.println(stack.isEmpty() ? "true" : "false");\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[10005];\n    if (scanf("%s", s) != 1) return 0;\n    char stack[10005];\n    int top = -1;\n    for (int i = 0; s[i]; i++) {\n        char c = s[i];\n        if (c == '(' || c == '{' || c == '[') {\n            stack[++top] = c;\n        } else {\n            if (top == -1) { printf("false\\n"); return 0; }\n            char open = stack[top--];\n            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {\n                printf("false\\n"); return 0;\n            }\n        }\n    }\n    printf("%s\\n", top == -1 ? "true" : "false");\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!(cin >> s)) return 0;\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) { cout << "false\\n"; return 0; }\n            char open = st.top(); st.pop();\n            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {\n                cout << "false\\n"; return 0;\n            }\n        }\n    }\n    cout << (st.empty() ? "true" : "false") << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-binary-search',
    slug: 'binary-search-element',
    title: 'Binary Search in Sorted Array',
    difficulty: 'easy',
    topic: 'Binary Search',
    category: 'Algorithms',
    description: `Given a sorted array of \`N\` integers \`nums\` in ascending order, and a target value \`target\`, write a function to search for \`target\` in \`nums\`.\n\nIf \`target\` exists, print its 0-based index. Otherwise, print \`-1\`. You must write an algorithm with \`O(log n)\` runtime complexity.`,
    input_format: `First line contains integer N.\nSecond line contains N sorted integers.\nThird line contains integer target.`,
    output_format: `Print the 0-based index of target, or -1.`,
    constraints: ['1 <= N <= 10^5', '-10^4 <= nums[i], target <= 10^4', 'All integers in nums are unique and sorted ascending.'],
    examples: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1', explanation: '2 does not exist in nums so output -1.' }
    ],
    sample_test_cases: [
      { input: '6\n-1 0 3 5 9 12\n9', expected_output: '4', is_hidden: false },
      { input: '6\n-1 0 3 5 9 12\n2', expected_output: '-1', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '1\n5\n5', expected_output: '0', is_hidden: true },
      { input: '2\n2 5\n5', expected_output: '1', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines:\n        return\n    n = int(lines[0].strip())\n    nums = list(map(int, lines[1].strip().split()))\n    target = int(lines[2].strip())\n    \n    low, high = 0, n - 1\n    ans = -1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            ans = mid\n            break\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    print(ans)\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        \n        int l = 0, r = n - 1, ans = -1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) {\n                ans = mid;\n                break;\n            } else if (nums[mid] < target) {\n                l = mid + 1;\n            } else {\n                r = mid - 1;\n            }\n        }\n        System.out.println(ans);\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    int *nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);\n    int target;\n    scanf("%d", &target);\n    \n    int l = 0, r = n - 1, ans = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) { ans = mid; break; }\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    printf("%d\\n", ans);\n    free(nums);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    \n    int l = 0, r = n - 1, ans = -1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) { ans = mid; break; }\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << ans << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-fizzbuzz-ext',
    slug: 'fizzbuzz-generator',
    title: 'Custom FizzBuzz Sequence',
    difficulty: 'easy',
    topic: 'Basic Programming & Math',
    category: 'Basic Programming',
    description: `Given an integer \`N\`, print a sequence from 1 to N on separate lines, where:\n- For multiples of 3, print "Fizz"\n- For multiples of 5, print "Buzz"\n- For multiples of both 3 and 5, print "FizzBuzz"\n- For other numbers, print the number itself.`,
    input_format: `A single integer N.`,
    output_format: `Print N lines according to the FizzBuzz rules.`,
    constraints: ['1 <= N <= 1000'],
    examples: [
      { input: '5', output: '1\n2\nFizz\n4\nBuzz', explanation: 'Sequence from 1 to 5.' }
    ],
    sample_test_cases: [
      { input: '5', expected_output: '1\n2\nFizz\n4\nBuzz', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '15', expected_output: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0].strip())\n    for i in range(1, n + 1):\n        if i % 15 == 0: print("FizzBuzz")\n        elif i % 3 == 0: print("Fizz")\n        elif i % 5 == 0: print("Buzz")\n        else: print(i)\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) System.out.println("FizzBuzz");\n            else if (i % 3 == 0) System.out.println("Fizz");\n            else if (i % 5 == 0) System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) printf("FizzBuzz\\n");\n        else if (i % 3 == 0) printf("Fizz\\n");\n        else if (i % 5 == 0) printf("Buzz\\n");\n        else printf("%d\\n", i);\n    }\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) cout << "FizzBuzz\\n";\n        else if (i % 3 == 0) cout << "Fizz\\n";\n        else if (i % 5 == 0) cout << "Buzz\\n";\n        else cout << i << "\\n";\n    }\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-climbing-stairs',
    slug: 'climbing-stairs-ways',
    title: 'Climbing Stairs DP Combinations',
    difficulty: 'easy',
    topic: 'Dynamic Programming & Fibonacci',
    category: 'Dynamic Programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    input_format: `A single integer n.`,
    output_format: `Print the number of distinct ways.`,
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: '2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: '3', output: '3', explanation: '1. 1+1+1\n2. 1+2\n3. 2+1' }
    ],
    sample_test_cases: [
      { input: '2', expected_output: '2', is_hidden: false },
      { input: '3', expected_output: '3', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '4', expected_output: '5', is_hidden: true },
      { input: '5', expected_output: '8', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0].strip())\n    if n <= 2: print(n); return\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    print(b)\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        if (n <= 2) { System.out.println(n); return; }\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    if (n <= 2) { printf("%d\\n", n); return 0; }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    printf("%d\\n", b);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    if (n <= 2) { cout << n << "\\n"; return 0; }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    cout << b << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-reverse-words',
    slug: 'reverse-words-in-string',
    title: 'Reverse Words in a String',
    difficulty: 'medium',
    topic: 'Strings & Parsing',
    category: 'Strings',
    description: `Given an input string \`s\`, reverse the order of the words.\nA word is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.\nReturn a string of the words in reverse order concatenated by a single space, without leading or trailing spaces.`,
    input_format: `A single line with string S.`,
    output_format: `Print reversed words separated by single space.`,
    constraints: ['1 <= s.length <= 10^4', 's contains English letters, digits, and spaces.'],
    examples: [
      { input: 'the sky is blue', output: 'blue is sky the', explanation: 'Words in reverse order.' },
      { input: '  hello world  ', output: 'world hello', explanation: 'Reduce multiple spaces to single space.' }
    ],
    sample_test_cases: [
      { input: 'the sky is blue', expected_output: 'blue is sky the', is_hidden: false },
      { input: '  hello world  ', expected_output: 'world hello', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: 'a good   example', expected_output: 'example good a', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    words = lines[0].strip().split()\n    print(" ".join(reversed(words)))\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String[] words = sc.nextLine().trim().split("\\\\s+");\n        List<String> list = Arrays.asList(words);\n        Collections.reverse(list);\n        System.out.println(String.join(" ", list));\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n\nint main() {\n    char s[10005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    char words[500][100];\n    int count = 0;\n    char *token = strtok(s, " \\t\\r\\n");\n    while (token) {\n        strcpy(words[count++], token);\n        token = strtok(NULL, " \\t\\r\\n");\n    }\n    for (int i = count - 1; i >= 0; i--) {\n        printf("%s%s", words[i], i == 0 ? "\\n" : " ");\n    }\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) return 0;\n    stringstream ss(s);\n    string w;\n    vector<string> words;\n    while (ss >> w) words.push_back(w);\n    for (int i = (int)words.size() - 1; i >= 0; i--) {\n        cout << words[i] << (i == 0 ? "" : " ");\n    }\n    cout << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-prime-sieve',
    slug: 'count-prime-numbers',
    title: 'Count Primes Less Than N',
    difficulty: 'medium',
    topic: 'Math & Sieve of Eratosthenes',
    category: 'Math & Numbers',
    description: `Given an integer \`N\`, return the count of prime numbers that are strictly less than \`N\`.`,
    input_format: `A single integer N.`,
    output_format: `Print the total count of primes strictly less than N.`,
    constraints: ['0 <= N <= 10^6'],
    examples: [
      { input: '10', output: '4', explanation: 'There are 4 prime numbers less than 10: 2, 3, 5, 7.' },
      { input: '0', output: '0', explanation: 'No primes less than 0.' }
    ],
    sample_test_cases: [
      { input: '10', expected_output: '4', is_hidden: false },
      { input: '1', expected_output: '0', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '20', expected_output: '8', is_hidden: true },
      { input: '100', expected_output: '25', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0].strip())\n    if n <= 2: print(0); return\n    is_prime = [True] * n\n    is_prime[0] = is_prime[1] = False\n    for p in range(2, int(n**0.5) + 1):\n        if is_prime[p]:\n            for multiple in range(p * p, n, p):\n                is_prime[multiple] = False\n    print(sum(is_prime))\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        if (n <= 2) { System.out.println(0); return; }\n        boolean[] isPrime = new boolean[n];\n        Arrays.fill(isPrime, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int p = 2; p * p < n; p++) {\n            if (isPrime[p]) {\n                for (int m = p * p; m < n; m += p) isPrime[m] = false;\n            }\n        }\n        int cnt = 0;\n        for (boolean b : isPrime) if (b) cnt++;\n        System.out.println(cnt);\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1) return 0;\n    if (n <= 2) { printf("0\\n"); return 0; }\n    bool *prime = (bool*)malloc(n * sizeof(bool));\n    for (int i = 0; i < n; i++) prime[i] = true;\n    prime[0] = prime[1] = false;\n    for (int p = 2; p * p < n; p++) {\n        if (prime[p]) {\n            for (int m = p * p; m < n; m += p) prime[m] = false;\n        }\n    }\n    int cnt = 0;\n    for (int i = 0; i < n; i++) if (prime[i]) cnt++;\n    printf("%d\\n", cnt);\n    free(prime);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    if (n <= 2) { cout << 0 << "\\n"; return 0; }\n    vector<bool> prime(n, true);\n    prime[0] = prime[1] = false;\n    for (int p = 2; p * p < n; p++) {\n        if (prime[p]) {\n            for (int m = p * p; m < n; m += p) prime[m] = false;\n        }\n    }\n    int count = 0;\n    for (int i = 0; i < n; i++) if (prime[i]) count++;\n    cout << count << "\\n";\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'tech-merge-sorted',
    slug: 'merge-two-sorted-arrays',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    topic: 'Two Pointers & Arrays',
    category: 'Arrays',
    description: `Given two sorted integer arrays \`nums1\` and \`nums2\`, merge them into a single sorted array and output the sorted numbers separated by space.`,
    input_format: `First line: integer M (length of nums1).\nSecond line: M space-separated sorted integers.\nThird line: integer N (length of nums2).\nFourth line: N space-separated sorted integers.`,
    output_format: `Print M + N sorted integers separated by a single space.`,
    constraints: ['0 <= M, N <= 10^4', '-10^9 <= nums1[i], nums2[i] <= 10^9'],
    examples: [
      { input: '3\n1 2 3\n3\n2 5 6', output: '1 2 2 3 5 6', explanation: 'Merged sorted elements.' }
    ],
    sample_test_cases: [
      { input: '3\n1 2 3\n3\n2 5 6', expected_output: '1 2 2 3 5 6', is_hidden: false }
    ],
    hidden_test_cases: [
      { input: '1\n1\n0\n', expected_output: '1', is_hidden: true },
      { input: '2\n4 8\n2\n1 5', expected_output: '1 4 5 8', is_hidden: true }
    ],
    starter_codes: [
      {
        language: 'python',
        code: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    m = int(lines[0].strip())\n    a = list(map(int, lines[1].strip().split())) if m > 0 else []\n    n = int(lines[2].strip())\n    b = list(map(int, lines[3].strip().split())) if n > 0 else []\n    merged = sorted(a + b)\n    print(" ".join(map(str, merged)))\n\nif __name__ == '__main__':\n    solve()\n`
      },
      {
        language: 'java',
        code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt();\n        int[] a = new int[m];\n        for (int i = 0; i < m; i++) a[i] = sc.nextInt();\n        int n = sc.nextInt();\n        int[] b = new int[n];\n        for (int i = 0; i < n; i++) b[i] = sc.nextInt();\n        \n        int[] res = new int[m + n];\n        int i = 0, j = 0, k = 0;\n        while (i < m && j < n) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];\n        while (i < m) res[k++] = a[i++];\n        while (j < n) res[k++] = b[j++];\n        \n        StringBuilder sb = new StringBuilder();\n        for (int idx = 0; idx < res.length; idx++) {\n            sb.append(res[idx]).append(idx == res.length - 1 ? "" : " ");\n        }\n        System.out.println(sb.toString());\n    }\n}\n`
      },
      {
        language: 'c',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int m;\n    if (scanf("%d", &m) != 1) return 0;\n    int *a = (int*)malloc(m * sizeof(int));\n    for (int i = 0; i < m; i++) scanf("%d", &a[i]);\n    int n;\n    scanf("%d", &n);\n    int *b = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++) scanf("%d", &b[i]);\n    \n    int i = 0, j = 0;\n    int first = 1;\n    while (i < m && j < n) {\n        if (!first) printf(" ");\n        first = 0;\n        if (a[i] <= b[j]) printf("%d", a[i++]);\n        else printf("%d", b[j++]);\n    }\n    while (i < m) { if (!first) printf(" "); first = 0; printf("%d", a[i++]); }\n    while (j < n) { if (!first) printf(" "); first = 0; printf("%d", b[j++]); }\n    printf("\\n");\n    free(a); free(b);\n    return 0;\n}\n`
      },
      {
        language: 'cpp',
        code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int m;\n    if (!(cin >> m)) return 0;\n    vector<int> a(m);\n    for (int i = 0; i < m; i++) cin >> a[i];\n    int n;\n    cin >> n;\n    vector<int> b(n);\n    for (int i = 0; i < n; i++) cin >> b[i];\n    \n    int i = 0, j = 0;\n    bool first = true;\n    while (i < m && j < n) {\n        if (!first) cout << " ";\n        first = false;\n        if (a[i] <= b[j]) cout << a[i++];\n        else cout << b[j++];\n    }\n    while (i < m) { if (!first) cout << " "; first = false; cout << a[i++]; }\n    while (j < n) { if (!first) cout << " "; first = false; cout << b[j++]; }\n    cout << "\\n";\n    return 0;\n}\n`
      }
    ]
  }
];

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate a random dynamic problem on demand
export function generateProceduralProblem(seed = Date.now()) {
  const templates = [
    {
      topic: 'Array Math',
      category: 'Arrays',
      diff: 'easy',
      generate: () => {
        const factor = Math.floor(Math.random() * 5) + 2;
        const len = 5;
        const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1);
        const ans = nums.map(x => x * factor).join(' ');
        const id = `tech-gen-scale-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        return {
          id,
          slug: `array-scale-${factor}`,
          title: `Array Scaler (${factor}x Multiplier)`,
          difficulty: 'easy',
          topic: 'Array Transformation',
          category: 'Arrays',
          description: `Given an array of integers, scale every element by a factor of \`${factor}\` and output the resulting array.`,
          input_format: `First line contains N.\nSecond line contains N integers.`,
          output_format: `Print N scaled integers separated by a space.`,
          constraints: ['1 <= N <= 10^4', '1 <= nums[i] <= 10^3'],
          examples: [
            { input: `${len}\n${nums.join(' ')}`, output: ans, explanation: `Multiply each by ${factor}.` }
          ],
          sample_test_cases: [
            { input: `${len}\n${nums.join(' ')}`, expected_output: ans, is_hidden: false }
          ],
          hidden_test_cases: [
            { input: `3\n1 2 3`, expected_output: `${1*factor} ${2*factor} ${3*factor}`, is_hidden: true }
          ]
        };
      }
    },
    {
      topic: 'String Manipulation',
      category: 'Strings',
      diff: 'easy',
      generate: () => {
        const words = ['algorithm', 'structure', 'developer', 'placement', 'interview'];
        const word = words[Math.floor(Math.random() * words.length)];
        const vowels = ['a','e','i','o','u'];
        const count = [...word].filter(c => vowels.includes(c)).length;
        const id = `tech-gen-vowel-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        return {
          id,
          slug: `vowel-counter-${word}`,
          title: `Vowel Occurrence Counter`,
          difficulty: 'easy',
          topic: 'String Traversal',
          category: 'Strings',
          description: `Given an input string \`S\`, count the total number of vowels ('a', 'e', 'i', 'o', 'u', case-insensitive) present in the string.`,
          input_format: `A single line containing string S.`,
          output_format: `Print the total vowel count.`,
          constraints: ['1 <= S.length <= 10^4'],
          examples: [
            { input: word, output: String(count), explanation: `Vowels in "${word}" count up to ${count}.` }
          ],
          sample_test_cases: [
            { input: word, expected_output: String(count), is_hidden: false },
            { input: 'hello world', expected_output: '3', is_hidden: false }
          ],
          hidden_test_cases: [
            { input: 'xyz', expected_output: '0', is_hidden: true },
            { input: 'AEIOU', expected_output: '5', is_hidden: true }
          ]
        };
      }
    }
  ];

  const tmpl = templates[Math.floor(Math.random() * templates.length)];
  const prob = tmpl.generate();
  prob.supported_languages = SUPPORTED_LANGUAGES;
  prob.starter_codes = SUPPORTED_LANGUAGES.map(lang => ({
    language: lang,
    code: getStarterCodeForLanguage(lang, prob)
  }));
  return prob;
}

// Generate a random set of problems
export function generateRandomProblemSet(count = 15) {
  const shuffledMaster = shuffle(MASTER_TECHNICAL_PROBLEMS).map(p => ({
    ...p,
    supported_languages: SUPPORTED_LANGUAGES,
    is_solved: false,
    total_submissions: Math.floor(Math.random() * 400) + 50,
    acceptance_rate: Math.round((Math.random() * 35 + 55) * 10) / 10
  }));

  // If count is greater than master, generate procedural additions
  const result = [...shuffledMaster];
  while (result.length < count) {
    const procedural = generateProceduralProblem();
    procedural.total_submissions = Math.floor(Math.random() * 200) + 20;
    procedural.acceptance_rate = 68.5;
    result.push(procedural);
  }

  return result.slice(0, count);
}

// Standard technical problem catalog - identical for all users
export function getStandardTechnicalProblemSet() {
  return MASTER_TECHNICAL_PROBLEMS.map((p, idx) => ({
    ...p,
    problem_number: idx + 1,
    supported_languages: SUPPORTED_LANGUAGES,
    is_solved: false,
    total_submissions: p.total_submissions || (280 + (idx * 37) % 190),
    acceptance_rate: p.acceptance_rate || (62 + (idx * 4.3) % 25)
  }));
}

// Global cache for workspace problem lookup
const PROBLEM_CACHE = new Map();

function populateCache() {
  MASTER_TECHNICAL_PROBLEMS.forEach((p, idx) => {
    const fullProblem = {
      ...p,
      problem_number: idx + 1,
      supported_languages: SUPPORTED_LANGUAGES
    };
    if (p.id) PROBLEM_CACHE.set(p.id, fullProblem);
    if (p.slug) PROBLEM_CACHE.set(p.slug, fullProblem);
    PROBLEM_CACHE.set(String(idx + 1), fullProblem);
    PROBLEM_CACHE.set(String(p.id).replace('tech-', ''), fullProblem);
  });
}
populateCache();

export function registerProblemInCache(problem) {
  if (!problem) return;
  if (problem.id) PROBLEM_CACHE.set(String(problem.id), problem);
  if (problem.slug) PROBLEM_CACHE.set(String(problem.slug), problem);
  if (problem.problem_number) PROBLEM_CACHE.set(String(problem.problem_number), problem);
}

export function getCachedProblem(idOrSlug) {
  if (!idOrSlug) return null;
  const key = String(idOrSlug).trim();
  if (PROBLEM_CACHE.has(key)) return PROBLEM_CACHE.get(key);
  // Case-insensitive lookup fallback
  for (const [k, v] of PROBLEM_CACHE.entries()) {
    if (k.toLowerCase() === key.toLowerCase()) return v;
  }
  return null;
}
