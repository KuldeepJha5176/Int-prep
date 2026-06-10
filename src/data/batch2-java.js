// Additions to existing Java sections + new Generics & Inner Classes sections
const BATCH2_JAVA = {

  oop: [
    {
      tags: ['Project OOP', 'Real-world', 'STEP/PBE', 'Applied OOP'],
      q: 'Where in your project did you use OOP principles?',
      s: 'Encapsulation: private fields in entities + DTOs. Abstraction: service interfaces. Inheritance: BaseEntity with audit fields. Polymorphism: strategy pattern for payments/notifications.',
      d: `<ol>
<li><strong>Encapsulation.</strong> All JPA <code>@Entity</code> classes have private fields accessed via getters/setters. Validation logic is inside setters (not exposed to callers).</li>
<li><strong>Abstraction.</strong> <code>PaymentService</code> interface abstracts card/UPI/wallet. Controllers depend on the interface, not the impl — Spring injects the right one.</li>
<li><strong>Inheritance.</strong> <code>BaseEntity</code> holds <code>@CreatedDate</code>, <code>@LastModifiedDate</code>, <code>@CreatedBy</code> — all entities extend it, no duplication.</li>
<li><strong>Polymorphism.</strong> <code>NotificationService.send()</code> is overridden by <code>EmailNotificationService</code>, <code>SmsNotificationService</code> — Spring picks the right bean via @Qualifier.</li>
</ol>
<pre><code>@MappedSuperclass
abstract class BaseEntity {
    @Id @GeneratedValue Long id;
    @CreatedDate LocalDateTime createdAt;
    @LastModifiedDate LocalDateTime updatedAt;
}

@Entity class Order extends BaseEntity { ... }
@Entity class User  extends BaseEntity { ... }</code></pre>`
    },
    {
      tags: ['ClassRoom', 'OOP Design', 'Scenario', 'Encapsulation Polymorphism'],
      q: 'Implement OOP for a ClassRoom scenario',
      s: 'Person (abstract) → Student + Teacher. ClassRoom composes a list of Students and a Teacher. Subject is a dependency. Demonstrates all 4 OOP pillars.',
      d: `<pre><code>// Abstraction
abstract class Person {
    private String name; private int age;
    Person(String name, int age) { this.name=name; this.age=age; }
    public String getName() { return name; }
    abstract String getRole();
}

// Inheritance + Polymorphism
class Student extends Person {
    private int rollNo;
    Student(String name, int age, int roll) { super(name,age); this.rollNo=roll; }
    @Override String getRole() { return "Student #" + rollNo; }
}

class Teacher extends Person {
    private String subject;
    Teacher(String name, int age, String sub) { super(name,age); this.subject=sub; }
    @Override String getRole() { return "Teacher of " + subject; }
    void teach() { System.out.println(getName() + " teaching " + subject); }
}

// Composition — ClassRoom HAS-A Teacher and HAS-A list of Students
class ClassRoom {
    private Teacher teacher;
    private List&lt;Student&gt; students = new ArrayList&lt;&gt;();

    ClassRoom(Teacher t) { this.teacher = t; }
    void enroll(Student s) { students.add(s); }
    void startClass() {
        teacher.teach();
        students.forEach(s -&gt; System.out.println(s.getRole() + " attending"));
    }
}

ClassRoom room = new ClassRoom(new Teacher("Alice", 35, "Java"));
room.enroll(new Student("Bob", 20, 101));
room.startClass();</code></pre>`
    },
    {
      tags: ['Immutable Classes', 'Project Usage', 'DTO', 'Value Object'],
      q: 'Where did you use immutable classes in your project?',
      s: 'DTOs as records (Java 16+), configuration value objects, event objects for Kafka messages, Money/Price value objects, API response wrappers.',
      d: `<ol>
<li><strong>Request DTOs as Records.</strong> <code>record CreateOrderRequest(String productId, int qty, double price){}</code> — immutable by nature, no setters.</li>
<li><strong>Money value object.</strong> <code>final class Money</code> with <code>final BigDecimal amount, Currency currency</code> — arithmetic returns new Money objects.</li>
<li><strong>Kafka event objects.</strong> Events published to Kafka are immutable — <code>OrderPlacedEvent(Long orderId, Instant timestamp)</code>.</li>
<li><strong>Configuration.</strong> <code>@ConfigurationProperties</code> with <code>final</code> fields + <code>@ConstructorBinding</code> — immutable config loaded at startup.</li>
</ol>
<pre><code>// Record as immutable DTO
record OrderResponse(Long id, String status, BigDecimal total) {}

// Immutable value object
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;
    public Money add(Money other) {
        return new Money(this.amount.add(other.amount), this.currency);
    }
}</code></pre>`
    },
    {
      tags: ['Singleton', 'Problem it solves', 'Use case', 'DB connection'],
      q: 'What did the Singleton pattern resolve? What problem does it solve?',
      s: 'Ensures only ONE instance of a resource-heavy object exists — prevents multiple DB connections, config loaders, or thread pools. Solves: resource waste, inconsistency from multiple instances.',
      d: `<p><strong>Problem without Singleton:</strong></p>
<pre><code>// Without Singleton — each call creates new DB connection pool
class OrderService {
    DataSource ds = new HikariDataSource(); // expensive! creates new pool
}
class UserService {
    DataSource ds = new HikariDataSource(); // another pool — waste!
}</code></pre>
<p><strong>With Singleton:</strong></p>
<pre><code>// Spring beans are Singleton by default — one shared DataSource
@Bean DataSource dataSource() { return new HikariDataSource(config); }
// All services share this ONE connection pool

// Real problems it solves:
// 1. DB connection pool — creating per request is expensive
// 2. Configuration manager — consistent config across app
// 3. Logger — single logger instance, no file locking issues
// 4. Thread pool — one executor shared, not N executors per class</code></pre>`
    },
    {
      tags: ['Covariant', 'Contravariant', 'Return type', 'Generics', 'Wildcards'],
      q: 'What is covariant vs contravariant?',
      s: 'Covariant: subtype can be used where supertype expected (Dog where Animal expected). In Java: covariant return types in overriding, <? extends T>. Contravariant: supertype where subtype expected — <? super T>.',
      d: `<pre><code>// COVARIANT — subtype is acceptable where supertype is expected
// 1. Covariant return type in overriding:
class Animal { Animal create() { return new Animal(); } }
class Dog extends Animal {
    @Override Dog create() { return new Dog(); } // Dog is covariant of Animal
}

// 2. Array covariance (causes ArrayStoreException at runtime):
Animal[] animals = new Dog[3]; // covariant — allowed
animals[0] = new Cat(); // ArrayStoreException at runtime!

// 3. Generics: Producer Extends (read covariant)
List&lt;? extends Animal&gt; animals; // accepts List&lt;Dog&gt;, List&lt;Cat&gt; — covariant

// CONTRAVARIANT — supertype acceptable where subtype expected
// Generics: Consumer Super (write contravariant)
List&lt;? super Dog&gt; list; // accepts List&lt;Animal&gt;, List&lt;Object&gt; — contravariant
list.add(new Dog()); // can add Dog and subtypes</code></pre>`
    },
    {
      tags: ['LSP', 'Covariant Return', 'Relationship', 'Subtype', 'Override'],
      q: 'How is LSP related to covariant return types?',
      s: 'LSP says subtype must be substitutable for base. Covariant return types support LSP — Dog.create() returns Dog (more specific than Animal), which is still an Animal — substitution works correctly.',
      d: `<pre><code>class AnimalFactory {
    Animal create() { return new Animal(); } // base
}
class DogFactory extends AnimalFactory {
    @Override
    Dog create() { return new Dog(); } // covariant — Dog IS-A Animal, LSP satisfied!
}

// LSP test: code expecting Animal works with Dog
AnimalFactory f = new DogFactory();
Animal a = f.create(); // returns Dog — but usable as Animal ✓

// LSP VIOLATION would be: returning an incompatible type
// If Dog.create() returned something that COULDN'T be used as Animal → violation</code></pre>
<p>Covariant return types are a tool that helps maintain LSP — subclass returns a more specific type that is still substitutable for the base type.</p>`
    },
    {
      tags: ['Method vs Constructor', 'Difference', 'Why constructor', 'Object creation'],
      q: 'What is the difference between method and constructor? Why is constructor used?',
      s: 'Constructor: same name as class, no return type, called automatically on new, used for initialization. Method: any name, has return type, called explicitly, used for behavior.',
      d: `<table>
<tr><th>Feature</th><th>Constructor</th><th>Method</th></tr>
<tr><td>Name</td><td>Same as class name</td><td>Any valid identifier</td></tr>
<tr><td>Return type</td><td>None (not even void)</td><td>Must declare (void or type)</td></tr>
<tr><td>Called when</td><td>Automatically on new</td><td>Explicitly by calling</td></tr>
<tr><td>Inherited</td><td>No (not inherited)</td><td>Yes</td></tr>
<tr><td>Purpose</td><td>Initialize object state</td><td>Define object behavior</td></tr>
</table>
<pre><code>class User {
    private String name;
    private String email;

    // Constructor — initializes state on creation
    User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Method — defines behavior
    String getWelcomeMessage() {
        return "Hello, " + name;
    }
}
// Constructor ensures object is always in valid state on creation</code></pre>`
    },
    {
      tags: ['Private Constructor', 'Singleton', 'Factory', 'Utility class'],
      q: 'Can we have a private constructor? What is it used for?',
      s: 'Yes. Private constructor prevents external instantiation. Used in: Singleton (control one instance), utility classes (Math, Collections), Factory method pattern, Builder pattern.',
      d: `<pre><code>// 1. Singleton — prevent direct instantiation
class Database {
    private static Database instance;
    private Database() { } // private!
    static Database getInstance() {
        if (instance == null) instance = new Database();
        return instance;
    }
}
// Database db = new Database(); // COMPILE ERROR

// 2. Utility class — no instances needed
class MathUtils {
    private MathUtils() { throw new UnsupportedOperationException(); }
    static int square(int n) { return n * n; }
}

// 3. Builder pattern
class Pizza {
    private Pizza() { }
    static class Builder {
        Pizza build() { return new Pizza(); } // only Builder can create
    }
}</code></pre>`
    },
    {
      tags: ['Default Constructor', 'Parameterized Constructor', 'Compiler', 'super()'],
      q: 'Do you need to write a default constructor if you have a parameterized constructor?',
      s: 'No, but the compiler will NOT auto-generate one. If you define ANY constructor, the compiler stops generating the no-arg default. You must explicitly add it if needed.',
      d: `<pre><code>class User {
    String name; int age;

    // Parameterized constructor defined
    User(String name, int age) { this.name=name; this.age=age; }

    // NO default constructor generated by compiler now!
}

User u1 = new User("Alice", 25); // OK
User u2 = new User(); // COMPILE ERROR — no default constructor!

// Fix: explicitly add if needed
class User {
    User() { this("Unknown", 0); } // delegate to parameterized
    User(String name, int age) { ... }
}

// Why it matters:
// 1. JPA requires no-arg constructor for entity instantiation
// 2. Deserialization often needs no-arg constructor
// 3. Some frameworks use reflection with no-arg constructor</code></pre>`
    },
    {
      tags: ['Instance variable', 'Static method', 'Compile error', 'this context'],
      q: 'Can we use an instance variable inside a static method?',
      s: 'NO. Static method belongs to the class — no implicit "this" reference. Instance variables need an object. Using instance variable directly in static method = COMPILE ERROR.',
      d: `<pre><code>class Counter {
    int count = 0;          // instance variable
    static int total = 0;   // class variable

    static void increment() {
        total++;             // ✅ static can access static
        count++;             // ❌ COMPILE ERROR: non-static field 'count'
                             // cannot be referenced from static context
    }

    // Workaround: pass instance as parameter
    static void increment(Counter c) {
        c.count++; // ✅ accessing via instance reference
    }

    // or use in instance method
    void incrementMe() {
        count++; // ✅ instance method has 'this', can access instance vars
    }
}</code></pre>`
    },
    {
      tags: ['RMM', 'Richardson Maturity Model', 'REST Levels', 'Level 0 1 2 3'],
      q: 'What is RMM (Richardson Maturity Model)?',
      s: 'Richardson Maturity Model describes 4 levels of REST API maturity: Level 0 (HTTP tunnel), Level 1 (Resources), Level 2 (HTTP verbs), Level 3 (HATEOAS). Most APIs operate at Level 2.',
      d: `<table>
<tr><th>Level</th><th>Name</th><th>Example</th></tr>
<tr><td>Level 0</td><td>The Swamp of POX</td><td>POST /api with action in body (RPC-style, SOAP)</td></tr>
<tr><td>Level 1</td><td>Resources</td><td>POST /users, POST /orders (separate URIs per resource)</td></tr>
<tr><td>Level 2</td><td>HTTP Verbs</td><td>GET /users/1, POST /users, DELETE /users/1</td></tr>
<tr><td>Level 3</td><td>HATEOAS</td><td>Response includes links: {"id":1, "_links":{"self":"/users/1", "orders":"/users/1/orders"}}</td></tr>
</table>
<pre><code>// Level 2 (most common real-world):
GET  /users/1    → 200 {id:1, name:"Alice"}
POST /users      → 201 {id:2, name:"Bob"}
DELETE /users/1  → 204

// Level 3 (HATEOAS):
GET /users/1 → 200 {
  "id": 1,
  "name": "Alice",
  "_links": {
    "self": { "href": "/users/1" },
    "update": { "href": "/users/1", "method": "PUT" },
    "delete": { "href": "/users/1", "method": "DELETE" }
  }
}</code></pre>`
    }
  ],

  streams: [
    {
      tags: ['Stateful', 'Stateless', 'Stream Operations', 'sorted', 'distinct'],
      q: 'What are stateful and stateless operations in Streams?',
      s: 'Stateless: process each element independently (filter, map, peek, flatMap). Stateful: need to see multiple/all elements to produce result (sorted, distinct, limit, skip). Stateful operations hurt parallel performance.',
      d: `<table>
<tr><th>Type</th><th>Operations</th><th>Why</th></tr>
<tr><td>Stateless</td><td>filter, map, flatMap, peek, mapToInt</td><td>Each element processed independently</td></tr>
<tr><td>Stateful</td><td>sorted, distinct, limit, skip, count</td><td>Need to buffer/accumulate elements</td></tr>
</table>
<pre><code>// Stateless — each element processed independently, great for parallel
list.parallelStream().filter(n -&gt; n &gt; 0).map(n -&gt; n * 2);

// Stateful — sorted must see ALL elements before outputting first
list.parallelStream()
    .sorted()    // must buffer all elements — parallel benefit lost
    .limit(5);   // must track count — stateful

// Performance implication:
// Stateful operations in parallel streams may eliminate parallelism benefits
// sorted() forces a merge phase in parallel execution</code></pre>`
    },
    {
      tags: ['Stream API Demerits', 'Disadvantages', 'Debugging', 'Performance'],
      q: 'What are the demerits of Stream API?',
      s: 'Hard to debug (no breakpoints in lambda), stateful operations hurt parallel performance, consumed once (can\'t reuse), overhead for small datasets, complex code can be harder to read than loops.',
      d: `<ol>
<li><strong>Hard to debug.</strong> Lambda functions in streams don't allow traditional breakpoints. Need to use peek() for intermediate inspection.</li>
<li><strong>Single use.</strong> Once terminal op is called, stream is done. Must recreate from source.</li>
<li><strong>Overhead for small data.</strong> Creating a stream pipeline has JVM overhead — a simple for-loop is faster for 10 elements.</li>
<li><strong>Stateful operations hurt parallel.</strong> sorted(), distinct() in parallelStream() force synchronization, negating parallel benefit.</li>
<li><strong>Readability tradeoff.</strong> Complex nested flatMap + groupingBy chains can be harder to read than equivalent imperative code.</li>
<li><strong>Cannot modify source.</strong> Streams are non-mutating — can't remove from source during streaming (unlike Iterator.remove()).</li>
</ol>`
    },
    {
      tags: ['Parallel Stream', 'Sequential Stream', 'ForkJoin', 'Depth', 'Spliterator'],
      q: 'Difference between parallel stream vs sequential stream in depth',
      s: 'Sequential: one thread, ordered processing. Parallel: splits work using ForkJoinPool.commonPool() via Spliterator, processes in parallel, merges results. Uses Divide-and-Conquer.',
      d: `<h4>Sequential Stream internals</h4>
<pre><code>list.stream()   // single thread pipeline
    .filter(...)   // processed element by element in order
    .map(...)
    .collect(...);</code></pre>
<h4>Parallel Stream internals</h4>
<pre><code>list.parallelStream()
// 1. Spliterator splits data into chunks
// 2. ForkJoinPool.commonPool() assigns each chunk to a thread
// 3. Each thread runs filter/map on its chunk independently
// 4. Results merged (reduce/collect) — may use ConcurrentHashMap for grouping

// Thread count = Runtime.getRuntime().availableProcessors()
// Custom pool:
ForkJoinPool custom = new ForkJoinPool(4);
custom.submit(() -&gt; list.parallelStream().filter(...).collect(...)).get();</code></pre>
<h4>When parallel helps vs hurts</h4>
<table>
<tr><th>Use Parallel</th><th>Avoid Parallel</th></tr>
<tr><td>Large data (&gt;10k elements)</td><td>Small data (overhead dominates)</td></tr>
<tr><td>CPU-bound operations</td><td>IO-bound (threads blocked, not computing)</td></tr>
<tr><td>Stateless operations</td><td>Stateful (sorted, distinct)</td></tr>
<tr><td>No shared mutable state</td><td>Shared mutable state (race conditions)</td></tr>
</table>`
    }
  ],

  collections: [
    {
      tags: ['Linear', 'Non-linear', 'Data Structures', 'Array List Tree Graph'],
      q: 'What are linear and non-linear data structures in Java Collections?',
      s: 'Linear: elements in sequence (Array, ArrayList, LinkedList, Stack, Queue, Deque). Non-linear: hierarchical/networked (Tree=TreeSet/TreeMap, Graph — not directly in Java Collections).',
      d: `<table>
<tr><th>Type</th><th>Structures</th><th>Java Examples</th></tr>
<tr><td>Linear</td><td>Array, ArrayList, LinkedList, Stack, Queue, Deque</td><td>ArrayList, LinkedList, ArrayDeque, PriorityQueue</td></tr>
<tr><td>Non-linear (Tree)</td><td>Binary Tree, BST, Red-Black Tree, Heap</td><td>TreeSet, TreeMap (RB tree), PriorityQueue (heap)</td></tr>
<tr><td>Non-linear (Hash)</td><td>Hash Table</td><td>HashMap, HashSet, ConcurrentHashMap</td></tr>
<tr><td>Non-linear (Graph)</td><td>Graph, DAG</td><td>Not in stdlib — use adjacency list with Map</td></tr>
</table>`
    },
    {
      tags: ['Iterators', 'Java', 'Iterator', 'ListIterator', 'Spliterator', 'Types'],
      q: 'What are the iterators in Java and their types?',
      s: 'Iterator (forward, remove), ListIterator (bidirectional, add/set/remove), Spliterator (parallel), Enumeration (legacy). forEach is internal iteration.',
      d: `<pre><code>// 1. Iterator — forward-only, supports remove()
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.isEmpty()) it.remove(); // safe removal
}

// 2. ListIterator — bidirectional, add/set/remove
ListIterator&lt;String&gt; lit = list.listIterator();
while (lit.hasNext()) { String s = lit.next(); lit.set(s.toUpperCase()); }
// also: hasPrevious(), previous(), nextIndex(), previousIndex()

// 3. Spliterator — for parallel processing (used by Streams)
Spliterator&lt;String&gt; sp = list.spliterator();
sp.forEachRemaining(System.out::println);
// trySplit() splits into sub-spliterators for parallel execution

// 4. Enumeration (legacy — Vector, Hashtable)
Enumeration&lt;String&gt; en = vector.elements();
while (en.hasMoreElements()) System.out.println(en.nextElement());</code></pre>`
    },
    {
      tags: ['Concurrent Collection', 'Real-time use', 'ConcurrentHashMap', 'Thread-safe'],
      q: 'What is a concurrent collection? Real-time usage?',
      s: 'Collections designed for concurrent access without full synchronization. ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue, ConcurrentLinkedQueue. Used in caches, producer-consumer, event queues.',
      d: `<table>
<tr><th>Collection</th><th>Real-time Use Case</th></tr>
<tr><td>ConcurrentHashMap</td><td>Shared in-memory cache across threads, word frequency counter</td></tr>
<tr><td>CopyOnWriteArrayList</td><td>Event listener list (many readers, rare adds)</td></tr>
<tr><td>BlockingQueue</td><td>Producer-consumer (order processing, thread pool task queue)</td></tr>
<tr><td>ConcurrentLinkedQueue</td><td>Lock-free task queue, high-throughput logging</td></tr>
<tr><td>LinkedBlockingDeque</td><td>Work-stealing thread pools</td></tr>
</table>
<pre><code>// Real-time: thread-safe cache
ConcurrentHashMap&lt;String, User&gt; userCache = new ConcurrentHashMap&lt;&gt;();
// Multiple threads read/write simultaneously — no full lock

// Real-time: producer-consumer order system
BlockingQueue&lt;Order&gt; orderQueue = new ArrayBlockingQueue&lt;&gt;(1000);
// Producer: orderQueue.put(newOrder);  // blocks if full
// Consumer: Order o = orderQueue.take(); // blocks if empty</code></pre>`
    },
    {
      tags: ['String methods', 'charAt', 'substring', 'split', 'indexOf', 'replace'],
      q: 'What are all the String methods that you know?',
      s: 'length, charAt, substring, indexOf, lastIndexOf, contains, startsWith, endsWith, equals, equalsIgnoreCase, compareTo, trim, strip, toUpperCase, toLowerCase, replace, replaceAll, split, join, format, valueOf, isEmpty, isBlank, intern, concat, toCharArray.',
      d: `<pre><code>String s = "Hello, World!";
s.length()               // 13
s.charAt(0)              // 'H'
s.substring(7)           // "World!"
s.substring(7, 12)       // "World"
s.indexOf("World")       // 7
s.lastIndexOf("l")       // 10
s.contains("World")      // true
s.startsWith("Hello")    // true
s.endsWith("!")          // true
s.equals("Hello, World!") // true
s.equalsIgnoreCase("HELLO, WORLD!") // true
s.toUpperCase()          // "HELLO, WORLD!"
s.toLowerCase()          // "hello, world!"
s.trim()                 // removes leading/trailing whitespace
s.strip()                // like trim() but Unicode-aware (Java 11+)
s.replace("World", "Java") // "Hello, Java!"
s.replaceAll("[aeiou]", "*") // regex replace
s.split(", ")            // ["Hello", "World!"]
s.isEmpty()              // false
"  ".isBlank()           // true (Java 11+)
s.toCharArray()          // char[]
s.intern()               // SCP reference
String.format("%s is %d", "Age", 25) // "Age is 25"
String.join("-", "a","b","c")        // "a-b-c"
String.valueOf(42)       // "42"
s.chars()                // IntStream of char codes
s.repeat(2)              // Java 11+ "Hello, World!Hello, World!"</code></pre>`
    },
    {
      tags: ['Collection', 'Collections', 'Interface vs Utility', 'Difference'],
      q: 'What is Collection vs Collections?',
      s: 'Collection: root interface in Java Collections Framework (extends Iterable). Collections: utility class with static helper methods (sort, shuffle, unmodifiableList, synchronizedList, min, max, frequency).',
      d: `<pre><code>// Collection — the interface (root of hierarchy)
public interface Collection&lt;E&gt; extends Iterable&lt;E&gt; {
    boolean add(E e); boolean remove(Object o);
    int size(); boolean isEmpty(); Iterator&lt;E&gt; iterator();
    // ...
}
// Implemented by: List, Set, Queue and their subclasses

// Collections — utility class (static methods only)
import java.util.Collections;

Collections.sort(list);               // sort list
Collections.reverse(list);            // reverse
Collections.shuffle(list);            // randomize
Collections.min(list);                // minimum
Collections.max(list);                // maximum
Collections.frequency(list, "a");     // count occurrences
Collections.unmodifiableList(list);   // read-only wrapper
Collections.synchronizedList(list);   // thread-safe wrapper
Collections.nCopies(5, "x");          // [x,x,x,x,x]
Collections.disjoint(list1, list2);   // true if no common elements
Collections.emptyList();              // immutable empty list</code></pre>`
    }
  ],

  java8: [
    {
      tags: ['Java 21', 'Virtual Threads', 'Sequenced Collections', 'Project Loom', 'New Features'],
      q: 'What are Java 21 features? Sequenced collections and virtual threads?',
      s: 'Virtual threads (Project Loom): lightweight threads mapped to OS threads dynamically. Sequenced collections: new interfaces with defined encounter order (getFirst, getLast, reversed).',
      d: `<h4>Virtual Threads (Project Loom)</h4>
<pre><code>// Traditional thread — expensive (~1MB stack, OS-managed)
Thread t = new Thread(() -&gt; handleRequest()); // blocks OS thread on IO

// Virtual thread — cheap (~few KB, JVM-managed)
Thread vt = Thread.ofVirtual().start(() -&gt; handleRequest());

// Executor for virtual threads
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
executor.submit(() -&gt; handleRequest()); // each task gets own virtual thread
// Can run millions of virtual threads efficiently!</code></pre>
<h4>Sequenced Collections</h4>
<pre><code>// New interfaces: SequencedCollection, SequencedSet, SequencedMap
// All have defined first/last element

List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a","b","c"));
list.getFirst();  // "a" — new in Java 21
list.getLast();   // "c"
list.reversed();  // reversed view

LinkedHashMap&lt;String,Integer&gt; map = new LinkedHashMap&lt;&gt;();
map.firstEntry();  // first inserted entry
map.lastEntry();   // last inserted entry</code></pre>
<h4>Other Java 21 Features</h4>
<ul>
<li>Pattern matching switch (final)</li>
<li>Record patterns (final)</li>
<li>String templates (preview)</li>
<li>Unnamed patterns and variables (preview)</li>
</ul>`
    },
    {
      tags: ['G1 GC', 'ZGC', 'Difference', 'Pause time', 'Low latency'],
      q: 'What is the difference between G1 GC and ZGC?',
      s: 'G1: region-based, configurable pause target (~200ms), Java 9+ default. ZGC: concurrent, ultra-low pause (<10ms even on TB heaps), Java 15+ production. ZGC has higher throughput overhead.',
      d: `<table>
<tr><th>Feature</th><th>G1 GC</th><th>ZGC</th></tr>
<tr><td>Default since</td><td>Java 9</td><td>Java 15 (production)</td></tr>
<tr><td>Max pause</td><td>~200ms (configurable)</td><td>&lt;10ms (sub-millisecond goal)</td></tr>
<tr><td>Heap size</td><td>Up to ~few TB</td><td>Up to 16TB</td></tr>
<tr><td>Concurrent GC</td><td>Partial (marking is concurrent)</td><td>Almost fully concurrent</td></tr>
<tr><td>Throughput overhead</td><td>Low</td><td>Higher (more CPU for GC threads)</td></tr>
<tr><td>Use case</td><td>Balanced latency+throughput</td><td>Ultra-low latency (trading, gaming)</td></tr>
</table>
<pre><code>// Configure G1
-XX:+UseG1GC -XX:MaxGCPauseMillis=200

// Configure ZGC
-XX:+UseZGC -XX:SoftMaxHeapSize=4g

// G1: divides heap into ~2048 equal regions
// ZGC: uses colored pointers + load barriers for concurrent relocation</code></pre>`
    },
    {
      tags: ['JVM Memory Areas', 'All areas', 'Heap Stack Method', 'Runtime'],
      q: 'What are the various memory areas of JVM?',
      s: '5 runtime data areas: Heap (objects), Stack (frames per thread), Method Area/Metaspace (class metadata), PC Register (instruction pointer per thread), Native Method Stack.',
      d: `<pre><code>JVM Runtime Data Areas:
┌──────────────────────────────────────────┐
│              SHARED (all threads)         │
│  ┌─────────────────────────────────────┐ │
│  │  Heap                               │ │
│  │  - Young Gen (Eden + S0 + S1)       │ │
│  │  - Old Gen (Tenured)                │ │
│  │  - String Pool (Java 7+)            │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │  Method Area / Metaspace             │ │
│  │  - Class bytecode                   │ │
│  │  - Static fields                    │ │
│  │  - Method info, constant pool       │ │
│  └─────────────────────────────────────┘ │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│           PER THREAD (each thread)        │
│  Stack: method frames (local vars, refs)  │
│  PC Register: current instruction address │
│  Native Method Stack: JNI native calls    │
└──────────────────────────────────────────┘</code></pre>`
    },
    {
      tags: ['main method', 'static', 'Why', 'JVM', 'Without object'],
      q: 'Why is the main method static?',
      s: 'JVM calls main() without creating an object of the class first — it has no context to call an instance method. static allows JVM to invoke it directly using the class name.',
      d: `<pre><code>// JVM entry point:
// java MyApp → JVM loads MyApp class → calls MyApp.main(args)
// At this point, NO object of MyApp exists yet!

// If main were non-static:
public void main(String[] args) { } // JVM would need: new MyApp().main(args)
// But how would JVM know which constructor to use?
// And what if MyApp has no no-arg constructor?

// static solves this:
public static void main(String[] args) {
    // JVM calls MyApp.main(args) directly — no object needed
    // You can create objects inside main
    MyApp app = new MyApp(); // now create instance if needed
}

// Note: Java 21 allows instance main methods (preview feature)
// but traditionally: static is required</code></pre>`
    },
    {
      tags: ['Records', 'Use cases', 'Lombok', 'vs Records', 'Scenario'],
      q: 'Records actual use cases and scenario-based questions. Lombok vs Records.',
      s: 'Records: immutable data carriers — DTOs, API responses, value objects, event classes. Lombok @Data: mutable POJOs with getters/setters. Records are compile-level, Lombok is annotation processing.',
      d: `<h4>When to use Records</h4>
<pre><code>// DTO / API response (immutable, no setters)
record UserResponse(Long id, String name, String email) {}

// Value object (Money, Coordinate)
record Money(BigDecimal amount, String currency) {
    Money { // compact constructor with validation
        if (amount.compareTo(BigDecimal.ZERO) &lt; 0)
            throw new IllegalArgumentException("Negative amount");
    }
}

// Kafka event (immutable message)
record OrderPlacedEvent(Long orderId, Instant timestamp) {}</code></pre>
<h4>Records vs Lombok @Data</h4>
<table>
<tr><th>Feature</th><th>Records</th><th>Lombok @Data</th></tr>
<tr><td>Mutability</td><td>Immutable (final fields)</td><td>Mutable (has setters)</td></tr>
<tr><td>Inheritance</td><td>Cannot extend classes</td><td>Can extend</td></tr>
<tr><td>Getter style</td><td>field() — no "get" prefix</td><td>getField()</td></tr>
<tr><td>JPA entity</td><td>NOT suitable (needs no-arg + setters)</td><td>Suitable with caution</td></tr>
<tr><td>Compile-time</td><td>Native Java feature</td><td>Annotation processor</td></tr>
<tr><td>Best for</td><td>DTOs, value objects, events</td><td>Mutable entities, services</td></tr>
</table>`
    },
    {
      tags: ['Functional Interface', 'private default methods', 'Can we add more', 'Abstract count'],
      q: 'Can you provide more than private and default methods in a functional interface?',
      s: 'A @FunctionalInterface must have exactly ONE abstract method. You can have unlimited default methods, static methods, private methods (Java 9+), and Object methods — none count as abstract.',
      d: `<pre><code>@FunctionalInterface
interface RichFI {
    // ONLY ONE abstract method:
    void execute(String data);

    // Any number of defaults:
    default void log() { System.out.println("Executing..."); }
    default void validate(String s) { if (s == null) throw new NPE(); }

    // Static methods:
    static RichFI noOp() { return data -&gt; {}; }
    static RichFI logging(RichFI fi) { return d -&gt; { fi.log(); fi.execute(d); }; }

    // Private helpers (Java 9+):
    private boolean isValid(String s) { return s != null && !s.isEmpty(); }

    // Object methods (don't count):
    String toString();
    boolean equals(Object o);
}
// Still a valid @FunctionalInterface — only execute() is abstract!</code></pre>`
    },
    {
      tags: ['Overloading', 'Functional Interface', 'Code snippet', 'Abstract methods'],
      q: 'Overloading inside a functional interface — code snippet',
      s: 'You can have multiple abstract methods if they are overloads of Object methods (toString, equals). But two abstract methods with different signatures = NOT a functional interface.',
      d: `<pre><code>// VALID: overloading with Object methods doesn't count
@FunctionalInterface
interface Processor {
    void process(String s);       // ONE abstract method
    boolean equals(Object o);     // Object method — doesn't count
    String toString();            // Object method — doesn't count
}

// INVALID: two distinct abstract methods
// @FunctionalInterface // COMPILE ERROR!
interface NotFI {
    void methodA();
    void methodB(); // second abstract = not functional interface
}

// Tricky: method with same name but different params = overloaded
// @FunctionalInterface // COMPILE ERROR! both are abstract
interface TrickyFI {
    void process(String s);
    void process(int i); // overload — still counts as 2 abstract methods
}</code></pre>`
    },
    {
      tags: ['serialVersionUID', 'depth', 'version control', 'compatibility', 'explicit vs auto'],
      q: 'What is serialVersionUID in depth?',
      s: 'Long value identifying class version for serialization compatibility. Without it, JVM auto-generates from class structure — any field/method change breaks deserialization. Always define explicitly.',
      d: `<pre><code>class Employee implements Serializable {
    private static final long serialVersionUID = 1L; // explicit

    String name;
    int age;
    // If we add: String email; and keep serialVersionUID=1L
    // → deserialization of old data works (email=null for old objects)

    // If we change serialVersionUID=2L
    // → old serialized files throw InvalidClassException
}

// How JVM auto-generates (if not defined):
// Hash of: class name, interface names, fields, methods, modifiers
// Adding ANY field → different hash → InvalidClassException when deserializing old data!

// Common pitfall:
// Prod serialized data + new JAR without explicit UID = java.io.InvalidClassException
// local class incompatible: stream classdesc serialVersionUID = -5678, local = 1234

// Best practice:
// 1. Always define private static final long serialVersionUID
// 2. Keep at 1L for backward compatibility
// 3. Increment ONLY for truly incompatible changes</code></pre>`
    },
    {
      tags: ['static field', 'transient field', 'serialization', 'excluded', 'not serialized'],
      q: 'Are static and transient fields serialized or not?',
      s: 'Neither. transient: explicitly excluded by developer. static: belongs to class, not object — serialization saves OBJECT state, not class state. Both are not included in the byte stream.',
      d: `<pre><code>class User implements Serializable {
    static final long serialVersionUID = 1L;

    String name;            // ✅ serialized (instance field)
    int age;                // ✅ serialized
    transient String pwd;   // ❌ NOT serialized (explicitly excluded)
    static int count = 0;   // ❌ NOT serialized (class-level, not instance)
}

User u = new User("Alice", 25);
u.pwd = "secret123";
User.count = 5;

// After serialize → deserialize:
// u.name = "Alice" ✅
// u.age = 25       ✅
// u.pwd = null     ❌ (transient)
// User.count = 0   ❌ (static — whatever the JVM initializes it to)</code></pre>`
    },
    {
      tags: ['Serialization exception', 'NotSerializableException', 'InvalidClassException', 'Error'],
      q: 'What exception is thrown in serialization issues?',
      s: 'NotSerializableException: class doesn\'t implement Serializable. InvalidClassException: serialVersionUID mismatch. StreamCorruptedException: corrupted byte stream. ClassNotFoundException: class not found during deserialization.',
      d: `<table>
<tr><th>Exception</th><th>Cause</th></tr>
<tr><td>NotSerializableException</td><td>Object's class doesn't implement Serializable</td></tr>
<tr><td>InvalidClassException</td><td>serialVersionUID mismatch between serialized and current class</td></tr>
<tr><td>StreamCorruptedException</td><td>Corrupted byte stream (data modified/truncated)</td></tr>
<tr><td>ClassNotFoundException</td><td>Class not found on classpath during readObject()</td></tr>
<tr><td>OptionalDataException</td><td>Unexpected primitive data found in stream</td></tr>
</table>
<pre><code>// NotSerializableException
class Logger { } // doesn't implement Serializable
class User implements Serializable {
    Logger log = new Logger(); // NotSerializableException!
    transient Logger log2;     // fix: transient
}</code></pre>`
    }
  ],

  keywords: [
    {
      tags: ['static', 'depth', 'field', 'block', 'method', 'class', 'order'],
      q: 'Explain static keyword in very depth. Static field, block, method, class — order and tricky snippets.',
      s: 'static = class-level ownership. Order: static fields/blocks in textual order at class load. Static methods can\'t access instance. Static nested class needs no outer instance. Stored in Metaspace.',
      d: `<pre><code>class Demo {
    // Static field — initialized when class is loaded
    static int x = 10;

    // Static block — runs at class load, in textual order
    static {
        System.out.println("Block 1: x=" + x); // 10
        x = 20;
    }
    static int y = x * 2; // y = 40 (after block ran)
    static {
        System.out.println("Block 2: y=" + y); // 40
    }
}
// When Demo class is first loaded:
// 1. x = 10 (field init)
// 2. Block 1 runs → prints "Block 1: x=10", x becomes 20
// 3. y = 20*2 = 40
// 4. Block 2 runs → prints "Block 2: y=40"

// Tricky: class load is triggered by first use
class Tricky {
    static int val = init();
    static int init() { System.out.println("init called"); return 5; }
    static { System.out.println("static block"); }
}
// First access of Tricky → "init called" then "static block"</code></pre>`
    },
    {
      tags: ['static field declaration', 'initialization', 'tricky', 'class loading'],
      q: 'Static field declaration, initialization, static block — order and tricky snippets',
      s: 'Static fields and blocks execute in textual order during class loading. Forward references to uninitialized static fields compile but give default value (0/null).',
      d: `<pre><code>// Tricky: forward reference
class Forward {
    static int b = a + 1; // COMPILE ERROR — illegal forward reference
    static int a = 5;
}

// But this works:
class Forward2 {
    static int a;           // declaration without init
    static int b = a + 1;  // a=0 (default) → b=1
    static { a = 5; }      // a now 5 — too late for b!
}
System.out.println(Forward2.a); // 5
System.out.println(Forward2.b); // 1 (not 6!)

// Class loading order between parent and child:
class Parent { static { System.out.println("Parent static"); } }
class Child extends Parent { static { System.out.println("Child static"); } }
new Child(); // "Parent static" then "Child static"</code></pre>`
    }
  ],

  designpatterns: [
    {
      tags: ['Builder Pattern', 'Depth', 'Fluent API', 'StringBuilder', 'Lombok'],
      q: 'Explain Builder pattern in depth with examples',
      s: 'Constructs complex objects step-by-step with method chaining. Avoids telescoping constructors. Validates in build(). Used in: Lombok @Builder, StringBuilder, HttpRequest, AlertDialog.',
      d: `<pre><code>// Manual Builder — step by step
class Pizza {
    private final String size;    // required
    private final String crust;   // required
    private final boolean cheese; // optional
    private final List&lt;String&gt; toppings;

    private Pizza(Builder b) {
        this.size = b.size; this.crust = b.crust;
        this.cheese = b.cheese; this.toppings = b.toppings;
    }

    public static class Builder {
        private final String size, crust; // required
        private boolean cheese = false;
        private List&lt;String&gt; toppings = new ArrayList&lt;&gt;();

        Builder(String size, String crust) { this.size=size; this.crust=crust; }
        Builder cheese() { this.cheese=true; return this; }
        Builder topping(String t) { this.toppings.add(t); return this; }
        Pizza build() {
            if (size.isEmpty()) throw new IllegalStateException("Size required");
            return new Pizza(this);
        }
    }
}

Pizza pizza = new Pizza.Builder("Large", "Thin")
    .cheese().topping("Pepperoni").topping("Mushroom")
    .build();

// Lombok @Builder — generates all this automatically
@Builder @Getter class Order {
    String item; int qty; double price; String address;
}
Order o = Order.builder().item("Laptop").qty(1).price(45000.0).build();</code></pre>`
    },
    {
      tags: ['Adapter Pattern', 'Convert interface', 'Incompatible', 'Wrapper'],
      q: 'What is the Adapter design pattern? Where do we use Decorator and Adapter?',
      s: 'Adapter: converts an incompatible interface to a compatible one (plug adapter analogy). Decorator: adds behavior to same interface without changing it. Adapter=interface bridge; Decorator=behavior addition.',
      d: `<pre><code>// ADAPTER — convert LegacyPayment to modern PaymentGateway interface
interface PaymentGateway { void pay(double amount); }

class LegacyPaymentSystem {
    void makePayment(String amount, String currency) { /* legacy */ }
}

class LegacyPaymentAdapter implements PaymentGateway {
    private LegacyPaymentSystem legacy = new LegacyPaymentSystem();
    @Override
    public void pay(double amount) {
        legacy.makePayment(String.valueOf(amount), "USD"); // adapts
    }
}

// DECORATOR — add logging to any PaymentGateway
class LoggingPaymentDecorator implements PaymentGateway {
    private final PaymentGateway wrapped;
    LoggingPaymentDecorator(PaymentGateway pg) { this.wrapped = pg; }
    @Override
    public void pay(double amount) {
        System.out.println("Paying: " + amount);
        wrapped.pay(amount);  // delegates to wrapped
        System.out.println("Payment done");
    }
}
// Use: new LoggingPaymentDecorator(new LegacyPaymentAdapter()).pay(100);</code></pre>
<table>
<tr><th>Adapter</th><th>Decorator</th></tr>
<tr><td>Bridge incompatible interfaces</td><td>Add behavior to same interface</td></tr>
<tr><td>Change interface</td><td>Keep same interface</td></tr>
<tr><td>Structural pattern</td><td>Structural pattern</td></tr>
</table>`
    },
    {
      tags: ['Creational Structural Behavioral', 'In project', 'Use cases', 'All three'],
      q: 'Explain creational, structural, and behavioral design patterns — use in project',
      s: 'Creational: object creation (Singleton-Spring beans, Factory-payment handler, Builder-DTO). Structural: object composition (Adapter-legacy integration, Facade-service orchestration, Decorator-logging). Behavioral: communication (Strategy-discount, Observer-events, Template Method-report generation).',
      d: `<table>
<tr><th>Category</th><th>Pattern</th><th>Project Use</th></tr>
<tr><td rowspan="3">Creational</td><td>Singleton</td><td>Spring beans, DB connection pool</td></tr>
<tr><td>Factory</td><td>NotificationFactory (Email/SMS/Push)</td></tr>
<tr><td>Builder</td><td>Lombok @Builder for Order, User DTOs</td></tr>
<tr><td rowspan="3">Structural</td><td>Adapter</td><td>Wrap legacy payment API in modern interface</td></tr>
<tr><td>Facade</td><td>CheckoutService orchestrates payment+inventory+shipping</td></tr>
<tr><td>Decorator</td><td>LoggingFilter wraps service calls with metrics</td></tr>
<tr><td rowspan="3">Behavioral</td><td>Strategy</td><td>Discount strategies: seasonal, loyalty, bulk</td></tr>
<tr><td>Observer</td><td>Spring ApplicationEvents: OrderPlaced → email, inventory</td></tr>
<tr><td>Template Method</td><td>AbstractReportGenerator with overridable steps</td></tr>
</table>`
    }
  ],

  tricky: [
    {
      tags: ['Collectors.joining', 'String array', 'concatenate', 'Stream'],
      q: 'String arr[] = {"ad","it","ya"} — concatenate using Collectors.joining()',
      s: 'Arrays.stream(arr).collect(Collectors.joining()) gives "aditya". With delimiter: joining("-") gives "ad-it-ya".',
      d: `<pre><code>String[] arr = {"ad", "it", "ya"};

// Basic joining (no delimiter)
String result = Arrays.stream(arr)
    .collect(Collectors.joining());
System.out.println(result); // "aditya"

// With delimiter
String withDash = Arrays.stream(arr)
    .collect(Collectors.joining("-"));
System.out.println(withDash); // "ad-it-ya"

// With prefix and suffix
String full = Arrays.stream(arr)
    .collect(Collectors.joining(", ", "[", "]"));
System.out.println(full); // "[ad, it, ya]"

// Alternative:
String joined = String.join("", arr); // "aditya"</code></pre>`
    },
    {
      tags: ['Last duplicate', 'swiswiabc', 'Output i', 'LinkedHashMap', 'Stream'],
      q: 'String s = "swiswiabc" — find last duplicate character. Output: i',
      s: 'Count frequency of each char, filter count > 1, find the LAST one that appears (rightmost occurrence). Scan from right: i is the last duplicate.',
      d: `<pre><code>String s = "swiswiabc";

// Approach 1: frequency map, then scan string from right
Map&lt;Character, Long&gt; freq = s.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

char lastDup = ' ';
for (int i = s.length() - 1; i &gt;= 0; i--) {
    if (freq.get(s.charAt(i)) &gt; 1) { lastDup = s.charAt(i); break; }
}
System.out.println(lastDup); // 'i'

// Approach 2: Stream (collect duplicates, find last occurrence in string)
Set&lt;Character&gt; dups = s.chars().mapToObj(c -&gt; (char)c)
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream().filter(e -&gt; e.getValue() &gt; 1)
    .map(Map.Entry::getKey).collect(Collectors.toSet());

char last = s.chars().mapToObj(c -&gt; (char)c)
    .filter(dups::contains).reduce((a,b) -&gt; b) // last element
    .orElse(' ');
System.out.println(last); // 'i'</code></pre>`
    },
    {
      tags: ['OOP tricky', 'Output', 'Overriding', 'Polymorphism trap'],
      q: 'Tricky OOP code snippets — output questions',
      s: 'Key traps: static methods are not polymorphic (method hiding), field access uses reference type, constructor calling overridden method uses child\'s implementation.',
      d: `<pre><code>// Snippet 1: Static method hiding
class A { static void greet() { System.out.print("A "); } }
class B extends A { static void greet() { System.out.print("B "); } }
A obj = new B();
obj.greet();       // "A " — static = compile-time, reference type A
((B)obj).greet();  // "B "

// Snippet 2: Field hiding
class P { int x = 10; }
class C extends P { int x = 20; }
P p = new C();
System.out.println(p.x);     // 10 — field: reference type
System.out.println(((C)p).x); // 20

// Snippet 3: Constructor polymorphism trap
class Parent {
    Parent() { show(); } // calls child's overridden show()!
    void show() { System.out.println("Parent"); }
}
class Child extends Parent {
    int val = 5;
    @Override void show() { System.out.println("Child val=" + val); }
}
new Child(); // "Child val=0" — val not yet initialized when Parent() called!

// Snippet 4: Interface default method conflict
interface X { default void m() { System.out.print("X"); } }
interface Y extends X { default void m() { System.out.print("Y"); } }
class Z implements X, Y {} // Z gets Y.m() — most specific wins
new Z().m(); // "Y"</code></pre>`
    },
    {
      tags: ['Functional Interface tricky', 'Overloading ambiguity', 'Lambda', 'Compile'],
      q: 'Functional interface tricky question — overloading with lambdas',
      s: 'When two overloaded methods accept different functional interfaces, passing a lambda that matches both causes compile error (ambiguous). Explicit cast or method reference resolves it.',
      d: `<pre><code>// Two functional interfaces with same signature
@FunctionalInterface interface Runnable  { void run();  }
@FunctionalInterface interface Task      { void run();  }

void execute(Runnable r) { r.run(); }
void execute(Task t) { t.run(); }

// COMPILE ERROR — ambiguous, lambda matches both!
execute(() -&gt; System.out.println("hi")); // which execute() to call?

// Fix 1: explicit cast
execute((Runnable) () -&gt; System.out.println("hi"));
execute((Task) () -&gt; System.out.println("hi"));

// Fix 2: method reference that matches specific type
// (depends on context)

// Non-ambiguous: different parameter signatures
void process(Function&lt;String, Integer&gt; f) { }
void process(Predicate&lt;String&gt; p) { }
process(s -&gt; s.length());   // OK — matches Function
process(s -&gt; !s.isEmpty()); // OK — matches Predicate (returns boolean)</code></pre>`
    }
  ],
}

// New sections (generics + inner classes)
const BATCH2_NEW_SECTIONS = [
  {
    id: 'generics',
    title: 'Generics',
    category: 'Core Java',
    color: 'java',
    questions: [
      {
        tags: ['Generics', 'Why use', 'Type safety', 'Without Generics', 'ClassCastException'],
        q: 'Why do we use Generics? What problems without Generics?',
        s: 'Generics provide compile-time type safety. Without them: Object type everywhere, runtime ClassCastException, no IDE autocompletion, explicit casting everywhere.',
        d: `<h4>Without Generics (pre-Java 5)</h4>
<pre><code>// Everything stored as Object — no type safety
List list = new ArrayList();
list.add("Hello"); list.add(42); list.add(new User());

String s = (String) list.get(0); // explicit cast — risky
String s2 = (String) list.get(1); // ClassCastException at RUNTIME!</code></pre>
<h4>With Generics</h4>
<pre><code>List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("Hello");
list.add(42); // COMPILE ERROR — caught at compile time!
String s = list.get(0); // no cast needed
</code></pre>
<h4>Benefits</h4>
<ol>
<li><strong>Type safety at compile time</strong> — ClassCastException eliminated.</li>
<li><strong>No explicit casting</strong> — cleaner code.</li>
<li><strong>Code reuse</strong> — write once, use with any type.</li>
<li><strong>IDE support</strong> — autocompletion and type inference.</li>
</ol>`
      },
      {
        tags: ['Generics tricky', 'Wildcard', 'Bounded', 'PECS', 'Type inference'],
        q: 'Tricky question on Generics — wildcard and PECS',
        s: 'PECS: Producer Extends Consumer Super. ? extends T = read-only (covariant). ? super T = write-only (contravariant). List<?> can\'t add anything (except null). Raw types bypass type safety.',
        d: `<pre><code>// Tricky 1: cannot add to ? extends
List&lt;? extends Number&gt; nums = new ArrayList&lt;Integer&gt;();
nums.add(1);     // COMPILE ERROR — can't add (unknown exact type)
Number n = nums.get(0); // OK — can read as Number

// Tricky 2: cannot read specifically from ? super
List&lt;? super Integer&gt; ints = new ArrayList&lt;Number&gt;();
ints.add(1);     // OK — can add Integer and subtypes
Object o = ints.get(0); // can only read as Object

// Tricky 3: raw type bypasses generics (runtime risk)
List rawList = new ArrayList&lt;String&gt;();
rawList.add(42); // compiles! raw type = no generics check
String s = (String) rawList.get(0); // ClassCastException!

// Tricky 4: generic method type inference
&lt;T extends Comparable&lt;T&gt;&gt; T max(T a, T b) {
    return a.compareTo(b) &gt;= 0 ? a : b;
}
max(3, 5);       // T inferred as Integer
max("ab","bc");  // T inferred as String</code></pre>`
      },
      {
        tags: ['Type erasure', 'Runtime', 'Bytecode', 'Bridge method', 'instanceof'],
        q: 'What is type erasure in Generics?',
        s: 'Generic type information is erased at compile time and replaced with Object (or bounds). At runtime, List<String> == List<Integer> == List. Enables backward compatibility with pre-Java 5 code.',
        d: `<pre><code>// Compile time — type info present
List&lt;String&gt; strings = new ArrayList&lt;&gt;();
strings.add("hello");
String s = strings.get(0); // compiler inserts cast

// After erasure (bytecode equivalent):
List strings = new ArrayList();
strings.add("hello");
String s = (String) strings.get(0); // cast auto-inserted by compiler

// Consequences of type erasure:
// 1. Cannot use instanceof with generic type
if (list instanceof List&lt;String&gt;) { } // COMPILE ERROR
if (list instanceof List&lt;?&gt;) { }      // OK

// 2. Cannot create generic arrays
T[] arr = new T[10]; // COMPILE ERROR

// 3. Cannot overload with same erasure
void process(List&lt;String&gt; l) { }
void process(List&lt;Integer&gt; l) { } // COMPILE ERROR — same erasure: process(List)

// 4. Bridge methods generated by compiler for covariant return in generics</code></pre>`
      },
      {
        tags: ['Generic list', 'Exception', 'ClassCastException', 'Heap pollution'],
        q: 'Exception thrown in a generic list — what happens?',
        s: 'ClassCastException at runtime via "heap pollution" — when raw types or unchecked casts mix with generic code. The exception appears at the cast point, not where the wrong element was added.',
        d: `<pre><code>// Heap pollution — mixing raw and generic types
List rawList = new ArrayList&lt;String&gt;();
rawList.add(42); // no warning if raw — adds Integer to "String" list

List&lt;String&gt; strings = rawList; // unchecked assignment — compiler warns
String s = strings.get(0);      // ClassCastException HERE — not at add!

// Misleading: exception thrown far from actual bug

// Safe alternative:
List&lt;?&gt; safe = rawList; // wildcard — can't add, can only read as Object

// Varargs heap pollution:
static &lt;T&gt; void addToList(List&lt;T&gt; list, T... elements) { // @SafeVarargs
    for (T e : elements) list.add(e);
}
// Without @SafeVarargs — generates "unchecked generic array creation" warning</code></pre>`
      }
    ]
  },
  {
    id: 'inner-classes',
    title: 'Inner Classes',
    category: 'Core Java',
    color: 'java',
    questions: [
      {
        tags: ['Inner Classes', 'Types', 'Why use', 'Rules', 'All types'],
        q: 'Types of inner classes, why we use them, rules for all inner classes',
        s: '4 types: Inner class (non-static member), Static nested class, Local class (inside method), Anonymous class. Each has different access rules and use cases.',
        d: `<pre><code>// 1. INNER CLASS (non-static member class)
class Outer {
    private int x = 10;
    class Inner {
        void show() { System.out.println(x); } // can access outer's private
    }
}
Outer.Inner inner = new Outer().new Inner(); // needs outer instance

// 2. STATIC NESTED CLASS
class Outer {
    static int y = 20;
    static class StaticNested {
        void show() { System.out.println(y); } // only static members of outer
    }
}
Outer.StaticNested n = new Outer.StaticNested(); // no outer instance needed

// 3. LOCAL CLASS (inside a method)
void process() {
    final int z = 30;
    class Local {
        void show() { System.out.println(z); } // effectively final vars only
    }
    new Local().show();
}

// 4. ANONYMOUS CLASS (one-time use)
Runnable r = new Runnable() {
    @Override public void run() { System.out.println("anonymous"); }
};
</code></pre>
<table>
<tr><th>Type</th><th>Access outer</th><th>Can be static</th><th>Instantiation</th></tr>
<tr><td>Inner class</td><td>All members</td><td>No</td><td>Needs outer instance</td></tr>
<tr><td>Static nested</td><td>Static members only</td><td>Yes</td><td>No outer needed</td></tr>
<tr><td>Local class</td><td>Effectively final vars</td><td>No</td><td>Within method only</td></tr>
<tr><td>Anonymous</td><td>Effectively final vars</td><td>No</td><td>At declaration point</td></tr>
</table>
<h4>Why use inner classes?</h4>
<ul>
<li><strong>Logical grouping</strong> — Node inside LinkedList, Entry inside HashMap</li>
<li><strong>Encapsulation</strong> — hide implementation detail from outside</li>
<li><strong>Cleaner code</strong> — anonymous class for one-time Comparator or Listener</li>
<li><strong>Access to outer</strong> — inner class can directly access outer's private state</li>
</ul>`
      }
    ]
  }
]

export { BATCH2_JAVA, BATCH2_NEW_SECTIONS }
