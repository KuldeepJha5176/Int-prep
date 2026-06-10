const BATCH2_CODING = {
  'stream-coding': [
    {
      tags: ['Odd-length words', 'uppercase', 'last word', 'filter map findLast'],
      q: 'Filter out odd-length words, map them to uppercase, return the last word',
      s: 'filter(w -> w.length()%2!=0), map(String::toUpperCase), reduce((a,b)->b) or collect then get last.',
      d: `<pre><code>List&lt;String&gt; words = List.of("apple","hi","banana","ok","cherry","go");

Optional&lt;String&gt; lastOddUpper = words.stream()
    .filter(w -&gt; w.length() % 2 != 0)    // odd-length: apple(5),banana(6)no,cherry(6)no
    .map(String::toUpperCase)
    .reduce((first, second) -&gt; second);   // keep last element

System.out.println(lastOddUpper.orElse("")); // "APPLE" (only odd-length here)

// With Java 21 .getLast() on SequencedCollection:
List&lt;String&gt; oddUpper = words.stream()
    .filter(w -&gt; w.length() % 2 != 0)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
String last = oddUpper.isEmpty() ? "" : oddUpper.getLast();</code></pre>`
    },
    {
      tags: ['Odd numbers', 'square', 'sum', 'mapToInt', 'Stream'],
      q: 'Find odd numbers, square them, and find their sum using Streams',
      s: 'filter(n -> n%2!=0), map(n -> n*n), mapToInt/reduce for sum.',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

int sumOfSquaredOdds = nums.stream()
    .filter(n -&gt; n % 2 != 0)       // 1, 3, 5, 7, 9
    .mapToInt(n -&gt; n * n)           // 1, 9, 25, 49, 81
    .sum();                          // 165

System.out.println(sumOfSquaredOdds); // 165

// Alternative with reduce:
int sum = nums.stream()
    .filter(n -&gt; n % 2 != 0)
    .map(n -&gt; n * n)
    .reduce(0, Integer::sum);</code></pre>`
    },
    {
      tags: ['Unique elements', 'String', 'Stream', 'distinct characters', 'chars'],
      q: 'Find unique elements in a string using Streams',
      s: 'Count each char. Unique = count == 1. Filter groupingBy map for chars with count 1.',
      d: `<pre><code>String str = "programming";

// Unique characters (appear exactly once)
List&lt;Character&gt; unique = str.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() == 1)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());

System.out.println(unique); // [o, a, i, n] (chars appearing once in "programming")</code></pre>`
    },
    {
      tags: ['Duplicate elements', 'String', 'Stream', 'chars', 'groupingBy'],
      q: 'Find duplicate elements in a string using Streams',
      s: 'Group chars by count, filter count > 1 to get duplicates.',
      d: `<pre><code>String str = "programming";

Set&lt;Character&gt; duplicates = str.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() &gt; 1)
    .map(Map.Entry::getKey)
    .collect(Collectors.toSet());

System.out.println(duplicates); // [g, r, m] (chars appearing more than once)

// With count:
Map&lt;Character, Long&gt; dupWithCount = str.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() &gt; 1)
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
System.out.println(dupWithCount); // {r=2, g=2, m=2}</code></pre>`
    },
    {
      tags: ['Vowel indexes', 'String', 'IntStream', 'filter', 'mapToObj'],
      q: 'Find indexes of all vowels in a string using Streams',
      s: 'IntStream.range over indices, filter where char is vowel, collect to list.',
      d: `<pre><code>String str = "Hello World";
String vowels = "aeiouAEIOU";

List&lt;Integer&gt; vowelIndexes = IntStream.range(0, str.length())
    .filter(i -&gt; vowels.indexOf(str.charAt(i)) &gt;= 0)
    .boxed()
    .collect(Collectors.toList());

System.out.println(vowelIndexes); // [1, 4, 7]
// H(0)e(1)l(2)l(3)o(4) (5)W(6)o(7)r(8)l(9)d(10)
// e=1, o=4, o=7</code></pre>`
    },
    {
      tags: ['Distinct ignoring case', 'Sort by length', 'Stream', 'TreeSet', 'Collector'],
      q: 'A list of strings — find distinct elements ignoring case and sort by length',
      s: 'Collect to TreeSet with case-insensitive comparator for distinct, then sort by length.',
      d: `<pre><code>List&lt;String&gt; words = List.of("Hello","hello","WORLD","world","Java","java","Stream");

List&lt;String&gt; result = words.stream()
    .collect(Collectors.collectingAndThen(
        Collectors.toCollection(() -&gt;
            new TreeSet&lt;&gt;(String.CASE_INSENSITIVE_ORDER)), // distinct ignoring case
        list -&gt; list.stream()
            .sorted(Comparator.comparingInt(String::length)) // sort by length
            .collect(Collectors.toList())
    ));

System.out.println(result); // [Java, Hello, World, Stream]

// Simpler approach:
List&lt;String&gt; result2 = words.stream()
    .map(String::toLowerCase)
    .distinct()
    .sorted(Comparator.comparingInt(String::length))
    .collect(Collectors.toList());
// [java, hello, world, stream]</code></pre>`
    },
    {
      tags: ['First non-repeating', 'Character list', 'Stream', 'groupingBy', 'LinkedHashMap'],
      q: 'Return first non-repeating character from a list of characters using Streams',
      s: 'groupingBy with LinkedHashMap to preserve order, filter count == 1, findFirst().',
      d: `<pre><code>List&lt;Character&gt; chars = List.of('a','b','c','a','b','d','e');

Optional&lt;Character&gt; firstNonRepeating = chars.stream()
    .collect(Collectors.groupingBy(
        Function.identity(),
        LinkedHashMap::new,    // preserve insertion order
        Collectors.counting()
    ))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() == 1)
    .map(Map.Entry::getKey)
    .findFirst();

System.out.println(firstNonRepeating.orElse('?')); // 'c' (a=2,b=2,c=1)</code></pre>`
    }
  ],

  dsa: [
    {
      tags: ['Swap Strings', 'Without third variable', 'XOR', 'StringBuilder', 'concat'],
      q: 'Swap two strings without using any third variable',
      s: 'String concatenation trick: s1=s1+s2, s2=s1.substring(0,s1.length()-s2.length()), s1=s1.substring(s2.length()). Or XOR on chars.',
      d: `<pre><code>// Method 1: String concatenation (no temp var)
String s1 = "Hello";
String s2 = "World";

s1 = s1 + s2;           // s1 = "HelloWorld"
s2 = s1.substring(0, s1.length() - s2.length()); // s2 = "Hello"
s1 = s1.substring(s2.length()); // s1 = "World"

System.out.println("s1=" + s1 + ", s2=" + s2); // s1=World, s2=Hello

// Method 2: Using XOR (for primitive chars, works character by character)
char a = 'X', b = 'Y';
a = (char)(a ^ b);
b = (char)(a ^ b);
a = (char)(a ^ b);
// a='Y', b='X'

// Method 3: StringBuilder (functional approach)
String str1 = "Java", str2 = "Spring";
StringBuilder sb = new StringBuilder(str1).append(str2);
str2 = sb.substring(0, str1.length());
str1 = sb.substring(str2.length() + str1.length() - str2.length());
// Wait, cleaner:
str1 = str1 + str2;
str2 = str1.substring(0, str1.length() - str2.length());
str1 = str1.substring(str2.length());</code></pre>`
    },
    {
      tags: ['O(1) insert retrieve remove random', 'Data Structure', 'HashMap Array', 'Design'],
      q: 'Design a data structure: insert, retrieve, remove, and return random element in O(1)',
      s: 'Use ArrayList (for O(1) random access/random) + HashMap (element → index for O(1) lookup/remove). Remove: swap with last element to avoid shifting.',
      d: `<pre><code>class RandomizedSet {
    private final List&lt;Integer&gt; list = new ArrayList&lt;&gt;();
    private final Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;(); // val → index
    private final Random rand = new Random();

    // O(1) — add to end, store index in map
    boolean insert(int val) {
        if (map.containsKey(val)) return false;
        list.add(val);
        map.put(val, list.size() - 1);
        return true;
    }

    // O(1) — swap with last, remove last (no shifting)
    boolean remove(int val) {
        if (!map.containsKey(val)) return false;
        int idx = map.get(val);
        int last = list.get(list.size() - 1);
        list.set(idx, last);         // put last at removed position
        map.put(last, idx);          // update last's index
        list.remove(list.size() - 1); // remove last
        map.remove(val);
        return true;
    }

    // O(1) — random index access in ArrayList
    int getRandom() {
        return list.get(rand.nextInt(list.size()));
    }
}
// All operations: O(1) average</code></pre>`
    }
  ]
}

export default BATCH2_CODING
