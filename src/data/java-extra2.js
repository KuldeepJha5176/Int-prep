const JAVA_EXTRA2 = {
  oop: [
    {
      tags: ['Real-world', 'Business Logic', 'Abstraction', 'Encapsulation', 'Examples'],
      q: 'Real-world business logic applications for abstraction and encapsulation',
      s: 'Abstraction: PaymentGateway.pay() hides Stripe/Razorpay internals. Encapsulation: User.setPassword() hashes before storing — field is private, logic is protected.',
      d: `<h4>Abstraction — real-world examples</h4>
<ol>
<li><strong>Payment Gateway.</strong> <code>PaymentService.processPayment(order)</code> — you don't know if it calls Stripe, Razorpay, or PayPal internally.</li>
<li><strong>Notification Service.</strong> <code>NotificationService.send(message)</code> — hides whether it uses SMS, Email, Push, or WhatsApp.</li>
<li><strong>Repository Pattern.</strong> <code>UserRepository.findById(id)</code> — hides whether it's querying MySQL, MongoDB, or an in-memory store.</li>
</ol>
<h4>Encapsulation — real-world examples</h4>
<ol>
<li><strong>Password hashing.</strong> <code>setPassword(raw)</code> stores BCrypt hash; caller never deals with hashing logic.</li>
<li><strong>Account balance.</strong> <code>debit(amount)</code> validates sufficient funds before deducting — business rule is encapsulated.</li>
<li><strong>OrderStatus transitions.</strong> Only allowed transitions (PLACED→SHIPPED→DELIVERED) enforced inside the class — no external code can set invalid state.</li>
</ol>
<pre><code>class BankAccount {
    private double balance; // encapsulated
    public void debit(double amount) {
        if (amount <= 0 || amount > balance)
            throw new InsufficientFundsException();
        balance -= amount; // business rule protected inside class
    }
}</code></pre>`
    },
    {
      tags: ['Overriding', 'Protected to Public', 'Access Widening', 'OK', 'Compile'],
      q: 'Does overriding work when changing access modifier from protected to public?',
      s: 'YES — protected→public is WIDENING access, which is allowed. public→protected is NARROWING, which causes a compile error. Widening is always safe.',
      d: `<pre><code>class Parent {
    protected void show() { System.out.println("Parent"); }
}

class Child extends Parent {
    @Override
    public void show() { // ✅ widening protected → public is ALLOWED
        System.out.println("Child");
    }
}

class BadChild extends Parent {
    // @Override
    // void show() { } // ✅ same (package-private) - depends on context

    // COMPILE ERROR — cannot narrow:
    // @Override
    // private void show() { } // ❌ narrowing
}</code></pre>
<p>Rule: override access modifier can be <strong>same or wider</strong>. protected can become public. public cannot become anything else.</p>`
    }
  ],

  streams: [
    {
      tags: ['Functional Interfaces', 'Stream API', 'Predicate', 'Function', 'Consumer', 'List'],
      q: 'Can you name some functional interfaces used in Stream API?',
      s: 'filter→Predicate, map→Function, forEach→Consumer, flatMap→Function, reduce→BinaryOperator, sorted→Comparator, collect→Collector, anyMatch→Predicate.',
      d: `<table>
<tr><th>Stream Method</th><th>Functional Interface</th><th>Signature</th></tr>
<tr><td>filter()</td><td>Predicate&lt;T&gt;</td><td>T → boolean</td></tr>
<tr><td>map()</td><td>Function&lt;T,R&gt;</td><td>T → R</td></tr>
<tr><td>forEach()</td><td>Consumer&lt;T&gt;</td><td>T → void</td></tr>
<tr><td>flatMap()</td><td>Function&lt;T, Stream&lt;R&gt;&gt;</td><td>T → Stream&lt;R&gt;</td></tr>
<tr><td>reduce()</td><td>BinaryOperator&lt;T&gt;</td><td>T,T → T</td></tr>
<tr><td>sorted()</td><td>Comparator&lt;T&gt;</td><td>T,T → int</td></tr>
<tr><td>anyMatch/allMatch</td><td>Predicate&lt;T&gt;</td><td>T → boolean</td></tr>
<tr><td>mapToInt()</td><td>ToIntFunction&lt;T&gt;</td><td>T → int</td></tr>
<tr><td>generate()</td><td>Supplier&lt;T&gt;</td><td>() → T</td></tr>
<tr><td>peek()</td><td>Consumer&lt;T&gt;</td><td>T → void</td></tr>
</table>`
    },
    {
      tags: ['Lambda', 'Functional Interface', 'Relationship', 'Target Type', 'SAM'],
      q: 'What is the relationship between Lambda and functional interfaces?',
      s: 'A lambda is an anonymous implementation of a functional interface. Lambda expression is the shorthand — the compiler infers which functional interface to implement from the context (target type).',
      d: `<pre><code>// Functional interface
@FunctionalInterface
interface Greeting { void greet(String name); }

// Lambda IS an implementation of Greeting
Greeting g = name -> System.out.println("Hello, " + name);
// Equivalent anonymous inner class:
Greeting g2 = new Greeting() {
    @Override public void greet(String name) {
        System.out.println("Hello, " + name);
    }
};

// Target typing — compiler infers from context
Runnable r = () -> System.out.println("Running"); // Runnable.run()
Comparator&lt;String&gt; c = (a, b) -> a.compareTo(b); // Comparator.compare()
Predicate&lt;Integer&gt; p = n -> n > 0;               // Predicate.test()</code></pre>
<p>Every lambda expression must match the signature of exactly one abstract method in a functional interface. The FI provides the <strong>target type</strong>.</p>`
    }
  ],

  collections: [
    {
      tags: ['ConcurrentHashMap', 'Internal', 'Segment', 'CAS', 'Java 8', 'Synchronized Bucket'],
      q: 'What is the internal working of ConcurrentHashMap?',
      s: 'Java 7: 16 segments (each a ReentrantLock). Java 8: lock-free reads, CAS for inserts, synchronized only on bucket level for updates. Better concurrency than Java 7.',
      d: `<h4>Java 7 — Segment-based locking</h4>
<p>Map divided into 16 segments (default). Each segment is a ReentrantLock-protected HashMap. Max 16 threads writing concurrently.</p>
<h4>Java 8 — Bucket-level locking (better)</h4>
<ol>
<li><strong>Reads are lock-free</strong> — volatile reads on Node arrays.</li>
<li><strong>First insert into empty bucket</strong> — CAS (no lock).</li>
<li><strong>Updates to existing bucket</strong> — synchronized on the bucket's head node only.</li>
<li><strong>Treeify at 8</strong> — same as HashMap, uses Red-Black Tree per bucket.</li>
</ol>
<pre><code>// Atomic size tracking
private final LongAdder sumCount = new LongAdder(); // no contention on count

// No null keys/values allowed — null used as sentinel internally</code></pre>`
    },
    {
      tags: ['HashMap vs TreeMap', 'Time Complexity', 'Order', 'O(1) vs O(log n)'],
      q: 'Difference between HashMap and TreeMap with time complexities',
      s: 'HashMap: no order, O(1) average. TreeMap: sorted order (Red-Black Tree), O(log n) for all operations. HashMap faster; TreeMap needed for range queries and sorted keys.',
      d: `<table>
<tr><th>Feature</th><th>HashMap</th><th>TreeMap</th></tr>
<tr><td>Order</td><td>None</td><td>Natural or custom Comparator</td></tr>
<tr><td>put/get/remove</td><td>O(1) avg, O(log n) Java 8 worst</td><td>O(log n) always</td></tr>
<tr><td>Null key</td><td>1 null key allowed</td><td>Not allowed (NPE)</td></tr>
<tr><td>Null value</td><td>Allowed</td><td>Allowed</td></tr>
<tr><td>Internal structure</td><td>Array + LinkedList/Tree</td><td>Red-Black Tree</td></tr>
<tr><td>Use case</td><td>Fast lookup</td><td>Range queries, sorted keys, ceiling/floor</td></tr>
</table>
<pre><code>TreeMap&lt;Integer, String&gt; tm = new TreeMap&lt;&gt;();
tm.put(3,"c"); tm.put(1,"a"); tm.put(2,"b");
System.out.println(tm); // {1=a, 2=b, 3=c} — sorted!
tm.firstKey();    // 1
tm.lastKey();     // 3
tm.subMap(1, 3);  // {1=a, 2=b} — range query</code></pre>`
    },
    {
      tags: ['HashSet', 'Internal', 'HashMap backed', 'Dummy Value', 'add/contains'],
      q: 'HashSet internal working. How is it different from TreeSet?',
      s: 'HashSet backed by HashMap — elements stored as keys, dummy PRESENT object as value. add(e)=map.put(e, PRESENT). contains(e)=map.containsKey(e). TreeSet backed by TreeMap — sorted order, O(log n).',
      d: `<pre><code>// HashSet internal:
private static final Object PRESENT = new Object(); // dummy value
private final HashMap&lt;E, Object&gt; map = new HashMap&lt;&gt;();

public boolean add(E e) { return map.put(e, PRESENT) == null; }
public boolean contains(Object o) { return map.containsKey(o); }
public boolean remove(Object o) { return map.remove(o) == PRESENT; }</code></pre>
<table>
<tr><th>Feature</th><th>HashSet</th><th>TreeSet</th></tr>
<tr><td>Backing</td><td>HashMap</td><td>TreeMap (Red-Black Tree)</td></tr>
<tr><td>Order</td><td>None</td><td>Sorted (natural or Comparator)</td></tr>
<tr><td>add/contains</td><td>O(1) avg</td><td>O(log n)</td></tr>
<tr><td>Null element</td><td>1 null allowed</td><td>Not allowed</td></tr>
</table>`
    },
    {
      tags: ['HashSet', 'LinkedHashSet', 'TreeSet', '3-way Comparison', 'Order', 'Complexity'],
      q: 'HashSet vs LinkedHashSet vs TreeSet — internal working comparison',
      s: 'HashSet: no order O(1). LinkedHashSet: insertion order O(1). TreeSet: sorted order O(log n). All backed by corresponding Map implementations.',
      d: `<table>
<tr><th>Feature</th><th>HashSet</th><th>LinkedHashSet</th><th>TreeSet</th></tr>
<tr><td>Backing</td><td>HashMap</td><td>LinkedHashMap</td><td>TreeMap (Red-Black)</td></tr>
<tr><td>Order</td><td>None</td><td>Insertion order</td><td>Sorted (natural/custom)</td></tr>
<tr><td>add/contains</td><td>O(1) avg</td><td>O(1) avg</td><td>O(log n)</td></tr>
<tr><td>Null</td><td>1 null</td><td>1 null</td><td>No null</td></tr>
<tr><td>Use case</td><td>Fast unique check</td><td>Unique + insertion order</td><td>Sorted unique, range</td></tr>
</table>
<pre><code>Set&lt;String&gt; hs  = new HashSet&lt;&gt;(Set.of("b","a","c")); // [a,b,c] or any order
Set&lt;String&gt; lhs = new LinkedHashSet&lt;&gt;(); lhs.add("b"); lhs.add("a"); // [b,a]
Set&lt;String&gt; ts  = new TreeSet&lt;&gt;(Set.of("b","a","c")); // [a,b,c] always sorted</code></pre>`
    },
    {
      tags: ['NavigableSet', 'NavigableMap', 'ceiling', 'floor', 'higher', 'lower'],
      q: 'What is NavigableSet and NavigableMap interface?',
      s: 'Extend SortedSet/SortedMap with navigation methods: ceiling(e)=≥e, floor(e)=≤e, higher(e)=>e, lower(e)=<e, pollFirst(), pollLast(). TreeSet/TreeMap implement these.',
      d: `<pre><code>NavigableSet&lt;Integer&gt; ns = new TreeSet&lt;&gt;(Set.of(1,3,5,7,9));

ns.ceiling(4);  // 5 — smallest element ≥ 4
ns.floor(4);    // 3 — largest element ≤ 4
ns.higher(5);   // 7 — strictly greater than 5
ns.lower(5);    // 3 — strictly less than 5
ns.pollFirst(); // 1 — remove and return smallest
ns.pollLast();  // 9 — remove and return largest
ns.headSet(5);  // [1,3] — less than 5
ns.tailSet(5);  // [5,7,9] — ≥ 5
ns.subSet(3,7); // [3,5] — between 3 (inclusive) and 7 (exclusive)
ns.descendingSet(); // [9,7,5,3,1] — reverse order</code></pre>`
    },
    {
      tags: ['SortedMap', 'Interface', 'firstKey', 'lastKey', 'subMap', 'headMap'],
      q: 'What is SortedMap interface?',
      s: 'SortedMap extends Map — keys in ascending order. Methods: firstKey(), lastKey(), headMap(toKey), tailMap(fromKey), subMap(from,to), comparator(). TreeMap implements it.',
      d: `<pre><code>SortedMap&lt;String, Integer&gt; sm = new TreeMap&lt;&gt;(Map.of("c",3,"a",1,"b",2));

sm.firstKey();          // "a"
sm.lastKey();           // "c"
sm.headMap("b");        // {a=1}        — keys < "b"
sm.tailMap("b");        // {b=2, c=3}   — keys >= "b"
sm.subMap("a","c");     // {a=1, b=2}   — keys in ["a","c")
sm.comparator();        // null (natural ordering)

// Hierarchy:
// Map → SortedMap → NavigableMap → TreeMap</code></pre>`
    },
    {
      tags: ['CopyOnWriteArrayList', 'Blocking', 'Bounded', 'BlockingQueue', 'ArrayBlockingQueue'],
      q: 'CopyOnWriteArrayList — what is Blocking and Bounded in Collections?',
      s: 'CopyOnWriteArrayList: write creates new copy, read lock-free. Blocking collections (BlockingQueue) block on put/take when full/empty. Bounded = fixed capacity limit.',
      d: `<pre><code>// CopyOnWriteArrayList — read-heavy, write-rare
CopyOnWriteArrayList&lt;String&gt; cowList = new CopyOnWriteArrayList&lt;&gt;();
cowList.add("a"); // creates new internal array copy

// Blocking Collection — blocks thread when full (put) or empty (take)
BlockingQueue&lt;String&gt; bq = new LinkedBlockingQueue&lt;&gt;(); // unbounded
bq.put("msg");   // blocks if full
String msg = bq.take(); // blocks if empty

// Bounded — fixed max capacity
BlockingQueue&lt;String&gt; bounded = new ArrayBlockingQueue&lt;&gt;(100); // max 100
bounded.offer("msg", 1, TimeUnit.SECONDS); // wait up to 1s

// SynchronousQueue — zero capacity, each put must wait for a take
SynchronousQueue&lt;String&gt; sq = new SynchronousQueue&lt;&gt;();</code></pre>`
    },
    {
      tags: ['List', 'Internal Implementation', 'ArrayList', 'LinkedList', 'AbstractList'],
      q: 'What is List internal implementation?',
      s: 'List is an interface. ArrayList=dynamic Object array. LinkedList=doubly-linked list with Node. Vector=synchronized ArrayList. CopyOnWriteArrayList=thread-safe copy-on-write.',
      d: `<pre><code>// ArrayList internals
Object[] elementData; // the backing array
int size;             // current number of elements
// Growth: newCapacity = oldCapacity + (oldCapacity >> 1) // 1.5x

// LinkedList internals
class Node&lt;E&gt; {
    E item;
    Node&lt;E&gt; next;
    Node&lt;E&gt; prev;
}
Node&lt;E&gt; first; // head
Node&lt;E&gt; last;  // tail
int size;

// Interface hierarchy:
// Iterable → Collection → List
//            implements: ArrayList, LinkedList, Vector, CopyOnWriteArrayList
//            AbstractList is the skeletal implementation</code></pre>`
    }
  ],

  java8: [
    {
      tags: ['Local Record', 'Inside Method', 'Java 16', 'Scope'],
      q: 'Can we create a local record inside a method?',
      s: 'YES — since Java 16. A local record is defined inside a method body, visible only within that method. Implicitly static, cannot access non-static outer members.',
      d: `<pre><code>public void processData(List&lt;String[]&gt; rows) {
    // Local record — only visible in this method
    record NameAge(String name, int age) {}

    List&lt;NameAge&gt; people = rows.stream()
        .map(r -> new NameAge(r[0], Integer.parseInt(r[1])))
        .toList();

    people.forEach(p -> System.out.println(p.name() + " is " + p.age()));
}
// NameAge is not accessible outside processData()</code></pre>
<p>Local records are implicitly <code>static</code> — they don't capture the enclosing instance, only effectively-final local variables.</p>`
    },
    {
      tags: ['Anonymous Inner Class', 'Inline', 'New Interface', 'Implementation'],
      q: 'What are Anonymous Inner Classes?',
      s: 'Inline, one-time class definitions with no name. Extend a class or implement an interface on the spot. Used for event listeners, Runnable, Comparator before Java 8 lambdas.',
      d: `<pre><code>// Anonymous inner class implementing an interface
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running!");
    }
};
new Thread(r).start();

// Anonymous class extending an abstract class
abstract class Greeter { abstract void greet(); }
Greeter g = new Greeter() {
    @Override
    void greet() { System.out.println("Hello from anon!"); }
};
g.greet();

// Before Java 8: Comparator
Collections.sort(list, new Comparator&lt;String&gt;() {
    @Override
    public int compare(String a, String b) { return a.compareTo(b); }
});
// Java 8+: replace with lambda
Collections.sort(list, (a, b) -> a.compareTo(b));</code></pre>`
    },
    {
      tags: ['Outer Class Static', 'Why not', 'Top-level', 'JVM', 'Static Class'],
      q: 'Why can\'t outer class be static?',
      s: 'Static class means only one class-level instance per JVM — not meaningful for outer classes. static on outer class would prevent creating instances at all. Only nested classes can be static.',
      d: `<p>The <code>static</code> keyword on a class has meaning only within another class (nested context):</p>
<ul>
<li><strong>Static nested class:</strong> doesn't need an instance of the outer class to be created. Makes sense.</li>
<li><strong>Outer class as static:</strong> would mean you can't instantiate it (like a utility class). Java uses <code>final class + private constructor</code> for this instead.</li>
</ul>
<pre><code>// Java's way of making a "static" (non-instantiable) outer class:
public final class MathUtils {
    private MathUtils() { } // private constructor = cannot instantiate
    public static int square(int x) { return x * x; }
}

// Nested static class — valid
class Outer {
    static class StaticNested { } // no outer instance needed
    class Inner { }              // needs outer instance
}</code></pre>`
    }
  ],

  exceptions: [
    {
      tags: ['finally scope', 'Variables', 'try block', 'Access'],
      q: 'What is the finally scope?',
      s: 'finally block has access to the same variables visible in the try-catch scope. Variables declared inside try {} are NOT accessible in finally. finally always runs regardless of exception.',
      d: `<pre><code>public void example() {
    String result = null; // accessible in try, catch, finally

    try {
        int x = 10; // only accessible inside try block
        result = "success";
        // throw new Exception("test");
    } catch (Exception e) {
        result = "error";
        // x is NOT accessible here
    } finally {
        System.out.println(result); // "success" or "error"
        // x is NOT accessible here either
        // finally always runs — even with return or exception in try/catch
    }
}</code></pre>`
    },
    {
      tags: ['Inner try', 'Uncaught', 'Propagation', 'Outer catch', 'Exception'],
      q: 'What happens if an exception is not caught in an inner try block?',
      s: 'It propagates to the outer try-catch block. If no outer handler, it propagates up the call stack. Finally blocks of inner try still execute before propagation.',
      d: `<pre><code>try {                                    // outer try
    try {                                // inner try
        throw new IOException("inner"); // uncaught in inner
    } finally {
        System.out.println("inner finally runs"); // still executes!
    }
    // IOException propagates here
} catch (IOException e) {
    System.out.println("Caught in outer: " + e.getMessage()); // caught here
}
// Output:
// inner finally runs
// Caught in outer: inner</code></pre>`
    },
    {
      tags: ['JUnit', 'Exception', 'assertThrows', 'ExpectedException', 'Testing'],
      q: 'Exception handling in JUnit',
      s: 'JUnit 5: assertThrows(ExpectedEx.class, () -> methodThatThrows()). JUnit 4: @Test(expected=Ex.class) or ExpectedException rule. assertThrows also returns the exception for assertion.',
      d: `<pre><code>// JUnit 5 (preferred)
@Test
void shouldThrowOnNegativeAge() {
    IllegalArgumentException ex = assertThrows(
        IllegalArgumentException.class,
        () -> new User("Alice", -1) // must throw
    );
    assertEquals("Age cannot be negative", ex.getMessage());
}

// JUnit 4 — simple
@Test(expected = IllegalArgumentException.class)
void testThrows() { new User("Alice", -1); }

// JUnit 4 — with message check
@Rule
public ExpectedException thrown = ExpectedException.none();

@Test
void testWithMessage() {
    thrown.expect(IllegalArgumentException.class);
    thrown.expectMessage("Age cannot be negative");
    new User("Alice", -1);
}</code></pre>`
    }
  ],

  jvm: [
    {
      tags: ['Custom ClassLoader', 'Java 7', 'Java 8', 'loadClass', 'URLClassLoader'],
      q: 'How do you load a custom class loader in Java 7 vs Java 8?',
      s: 'Java 7: extend ClassLoader, override findClass() or loadClass(). Java 8: same approach but OSGi/modules added complexity. Java 9+: Module system changes ClassLoader hierarchy.',
      d: `<pre><code>// Custom ClassLoader (works Java 7, 8, 11+)
public class MyClassLoader extends ClassLoader {
    private final String classPath;

    public MyClassLoader(String classPath) {
        super(ClassLoader.getSystemClassLoader()); // parent delegation
        this.classPath = classPath;
    }

    @Override
    protected Class&lt;?&gt; findClass(String name) throws ClassNotFoundException {
        try {
            byte[] bytes = loadClassBytes(name); // read .class file bytes
            return defineClass(name, bytes, 0, bytes.length);
        } catch (IOException e) {
            throw new ClassNotFoundException(name, e);
        }
    }
}

// Usage
MyClassLoader loader = new MyClassLoader("/path/to/classes/");
Class&lt;?&gt; clazz = loader.loadClass("com.app.Plugin");
Object instance = clazz.getDeclaredConstructor().newInstance();</code></pre>
<p><strong>Java 9+:</strong> Boot ClassLoader is now a named module loader. <code>sun.misc.Unsafe</code> access restricted. Use <code>ModuleLayer</code> for module-aware class loading.</p>`
    },
    {
      tags: ['JVM Threads', 'Stack', 'Heap', 'Per Thread', 'Shared'],
      q: 'What are the threads in JVM — Stack, Heap, PC Register details?',
      s: 'Each thread gets its own Stack + PC Register + Native Method Stack. Heap and Metaspace are shared across ALL threads. Stack frames hold local vars, operand stack, return values.',
      d: `<pre><code>// Per-thread components:
Thread-1: Stack (frames), PC Register, Native Method Stack
Thread-2: Stack (frames), PC Register, Native Method Stack

// Shared across ALL threads:
Heap: all objects, arrays, String pool
Metaspace: class bytecode, static fields, method info

// Stack frame contains:
- Local variable array (local vars + params)
- Operand stack (for expressions)
- Constant pool reference
- Return address</code></pre>
<table>
<tr><th>Component</th><th>Shared or Per-Thread</th><th>Stores</th></tr>
<tr><td>Heap</td><td>Shared</td><td>Objects, arrays</td></tr>
<tr><td>Metaspace</td><td>Shared</td><td>Class metadata, static fields</td></tr>
<tr><td>Stack</td><td>Per thread</td><td>Method frames, local variables</td></tr>
<tr><td>PC Register</td><td>Per thread</td><td>Current instruction address</td></tr>
<tr><td>Native Stack</td><td>Per thread</td><td>Native method calls</td></tr>
</table>`
    },
    {
      tags: ['GC Types', 'Serial', 'Parallel', 'G1', 'ZGC', 'Default GC'],
      q: 'What is the default GC? Types of GC? How does JVM default GC work?',
      s: 'Java 8: Parallel GC (server default). Java 9+: G1 GC default. Types: Serial, Parallel, CMS (deprecated), G1, ZGC, Shenandoah. G1 divides heap into regions for predictable pauses.',
      d: `<table>
<tr><th>GC</th><th>Default Since</th><th>Pause</th><th>Best For</th></tr>
<tr><td>Serial GC (-XX:+UseSerialGC)</td><td>Client JVM</td><td>Stop-the-world</td><td>Single CPU, small heap</td></tr>
<tr><td>Parallel GC (-XX:+UseParallelGC)</td><td>Java 8 server</td><td>Stop-the-world multi-thread</td><td>Throughput-focused</td></tr>
<tr><td>G1 GC (-XX:+UseG1GC)</td><td>Java 9+</td><td>Configurable (-XX:MaxGCPauseMillis)</td><td>Balanced latency+throughput</td></tr>
<tr><td>ZGC (-XX:+UseZGC)</td><td>Java 15+</td><td>&lt;10ms</td><td>Low-latency large heaps</td></tr>
<tr><td>Shenandoah</td><td>Java 15+</td><td>&lt;10ms</td><td>Low-latency, RedHat</td></tr>
</table>
<p><strong>G1 GC:</strong> Heap divided into equal-sized regions (~1-32MB). Some regions are Eden, Survivor, Old. G1 picks regions with most garbage first (hence "Garbage-First").</p>`
    }
  ],

  designpatterns: [
    {
      tags: ['One of Each Type', 'Creational', 'Structural', 'Behavioral', 'Example'],
      q: 'Give one type of each of the 3 categories of design patterns with examples',
      s: 'Creational: Singleton (one DB pool instance). Structural: Facade (OrderFacade hides payment+inventory+shipping). Behavioral: Observer (OrderPlaced event notifies Email+Inventory).',
      d: `<ol>
<li><strong>Creational — Singleton.</strong> DB connection pool with exactly one shared instance across the app.</li>
<li><strong>Structural — Facade.</strong> <code>CheckoutFacade.checkout(cart)</code> internally calls PaymentService, InventoryService, ShippingService — client calls one method.</li>
<li><strong>Behavioral — Observer.</strong> When order placed → <code>ApplicationEventPublisher</code> notifies EmailService, InventoryService, InvoiceService simultaneously.</li>
</ol>
<pre><code>// Creational (Singleton)
Connection pool = DataSourcePool.getInstance();

// Structural (Facade)
checkoutFacade.checkout(cart);

// Behavioral (Observer)
publisher.publishEvent(new OrderPlacedEvent(order));
// → email listener, inventory listener, invoice listener all respond</code></pre>`
    },
    {
      tags: ['Design Patterns', 'Project', 'Spring Boot', 'Real Use'],
      q: 'What design patterns are used in your project?',
      s: 'Singleton (Spring beans), Factory (notification/payment type), Builder (@Builder + DTOs), Strategy (discount/pricing), Observer (ApplicationEvents), Repository, Facade (service orchestration).',
      d: `<ol>
<li><strong>Singleton</strong> — All Spring beans are singleton by default. ConnectionPool, ConfigManager.</li>
<li><strong>Factory</strong> — NotificationFactory creates Email/SMS/Push handler based on type.</li>
<li><strong>Builder</strong> — Lombok @Builder for Order, User, DTO objects to avoid telescoping constructors.</li>
<li><strong>Strategy</strong> — Different pricing/discount strategies (seasonal, loyalty) swapped at runtime.</li>
<li><strong>Observer</strong> — Spring ApplicationEvents for loose coupling: OrderPlaced → email + inventory + analytics.</li>
<li><strong>Repository</strong> — Spring Data JPA repositories abstract DB access.</li>
<li><strong>Template Method</strong> — AbstractService with common pre/post hooks, subclasses override specific steps.</li>
</ol>`
    }
  ],

  tricky: [
    {
      tags: ['Compound Assignment', 'aa += (aa=5)*(aa/5)', 'Output', 'Evaluation Order'],
      q: 'Compound assignment: aa += (aa = 5) * (aa / 5); — if aa=10, output?',
      s: 'aa = 10 + (5) * (5/5) = 10 + 5*1 = 15. Left side aa=10 captured first, then (aa=5) sets aa=5, then (aa/5)=1, multiply=5, then 10+5=15.',
      d: `<pre><code>int aa = 10;
// Step 1: left side 'aa' captured as 10
// Step 2: (aa = 5) → aa becomes 5, expression evaluates to 5
// Step 3: (aa / 5) → 5/5 = 1 (aa is now 5)
// Step 4: 5 * 1 = 5
// Step 5: aa = 10 + 5 = 15
aa += (aa = 5) * (aa / 5);
System.out.println(aa); // 15</code></pre>`
    },
    {
      tags: ['Static method', 'Instance variable', 'Compile error', 'Cannot reference'],
      q: 'Static method accessing instance variable — does it compile?',
      s: 'NO. Static methods belong to the class — they have no implicit "this" reference. Accessing an instance variable from a static method = COMPILE ERROR.',
      d: `<pre><code>class Counter {
    private int count = 0;           // instance variable
    private static int total = 0;    // class variable

    static void reset() {
        total = 0;                   // ✅ OK — static accessing static
        count = 0;                   // ❌ COMPILE ERROR: non-static field 'count'
                                     // cannot be referenced from a static context
    }
}
// Fix: pass instance as parameter
static void reset(Counter c) { c.count = 0; }</code></pre>`
    },
    {
      tags: ['Overriding', 'method(double)', 'method(int)', 'Widening', 'Dispatch'],
      q: 'new Y().method(100) where Y overrides only method(double) — which is called?',
      s: 'method(double) is called. 100 is int, but Y doesn\'t override method(int), so it widens to double and calls Y.method(double).',
      d: `<pre><code>class X {
    void method(int i) { System.out.println("X.method(int)"); }
    void method(double d) { System.out.println("X.method(double)"); }
}
class Y extends X {
    @Override
    void method(double d) { System.out.println("Y.method(double)"); }
    // method(int) NOT overridden
}

new Y().method(100); // "Y.method(double)"
// 100 is int, Y.method(int) doesn't exist → inherits X.method(int)...
// Wait — Y overrides method(double). Overloading resolution:
// method(int i) exists in X, not overridden in Y
// method(double d) exists in Y (overridden)
// new Y().method(100) → int 100 matches method(int) → X.method(int) called
// Output: "X.method(int)"
// Because Y didn't override method(int), X's method(int) is called.
// If Y had overridden method(int) it would call Y.method(int).</code></pre>
<p><strong>Answer:</strong> <code>X.method(int)</code> is called. Y only overrode <code>method(double)</code>, not <code>method(int)</code>, so the inherited X.method(int) handles int 100.</p>`
    },
    {
      tags: ['Fibonacci', 'Wrong return type', 'Compile', 'void', 'int'],
      q: 'Fibonacci code with wrong return type — will it compile?',
      s: 'Depends on the mismatch. Returning int from void method → compile error. Returning int from String method → compile error. Missing return statement → compile error.',
      d: `<pre><code>// Case 1: void method returning value — COMPILE ERROR
void fib(int n) {
    return n <= 1 ? n : fib(n-1) + fib(n-2); // COMPILE ERROR: void cannot return value
}

// Case 2: int method returning String — COMPILE ERROR
int fib(int n) {
    return "fibonacci"; // COMPILE ERROR: incompatible types: String cannot be converted to int
}

// Case 3: Missing return in non-void — COMPILE ERROR
int fib(int n) {
    if (n <= 1) return n;
    // COMPILE ERROR: missing return statement
}

// Correct:
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2); // ✅
}</code></pre>`
    },
    {
      tags: ['String objects', 'sdf+dgh+new String', 'Count', 'SCP', 'Heap'],
      q: 'System.out.println("sdf" + "dgh" + new String("dgh")) — how many objects created?',
      s: '2 objects. "sdf"+"dgh" is compile-time constant → "sdfdgh" in SCP (1 SCP obj). new String("dgh") creates 1 heap object + "dgh" in SCP (if not already there).',
      d: `<pre><code>System.out.println("sdf" + "dgh" + new String("dgh"));

// Step 1: "sdf" + "dgh"
//   Both string literals → compiler concatenates at compile time
//   → "sdfdgh" stored in SCP (0 or 1 SCP object — may already exist)

// Step 2: new String("dgh")
//   → 1 heap object (new keyword forces creation)
//   → "dgh" added to SCP if not there

// Total new objects at runtime: 1 heap object (new String("dgh"))
// "sdfdgh" = compile-time constant folding, in SCP

// Answer: 2 objects if "dgh" not in SCP yet (1 SCP + 1 heap)
//         1 object if "dgh" already in SCP (just 1 heap object)</code></pre>`
    }
  ]
}

export default JAVA_EXTRA2
