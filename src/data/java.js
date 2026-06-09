const JAVA_DATA = [
  {
    id: 'oop', title: 'OOP Concepts', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Abstraction', 'Encapsulation', 'Design Principle', 'OOP'],
        q: 'What is the difference between abstraction and encapsulation?',
        s: 'Abstraction hides WHAT (implementation complexity); Encapsulation hides HOW (data via access modifiers). Abstraction is design-level; Encapsulation is implementation-level.',
        d: `<h4>Abstraction</h4>
<p>Hides <strong>implementation complexity</strong>, exposes only essential behavior. Achieved via abstract classes and interfaces.</p>
<h4>Encapsulation</h4>
<p>Bundles data (fields) + methods, hides internal state using <code>private</code> + getters/setters.</p>
<table>
<tr><th>Feature</th><th>Abstraction</th><th>Encapsulation</th></tr>
<tr><td>What it hides</td><td>Implementation details</td><td>Internal data/state</td></tr>
<tr><td>How achieved</td><td>Abstract class / Interface</td><td>private fields + getters/setters</td></tr>
<tr><td>Level</td><td>Design level</td><td>Implementation level</td></tr>
<tr><td>Focus</td><td>WHAT to do</td><td>HOW to protect data</td></tr>
</table>
<pre><code>// Abstraction
abstract class Shape { abstract double area(); }

// Encapsulation
class Circle extends Shape {
    private double radius;
    public void setRadius(double r) { if (r > 0) this.radius = r; }
    public double area() { return Math.PI * radius * radius; }
}</code></pre>`
      },
      {
        tags: ['Encapsulation', 'Private Fields', 'Concrete Class'],
        q: 'Can we achieve encapsulation without abstraction? If yes, how?',
        s: 'Yes. Encapsulation only needs private fields + public getters/setters. A concrete class with private fields is fully encapsulated but not abstract.',
        d: `<pre><code>// Fully encapsulated, zero abstraction
class BankAccount {
    private double balance;
    public void deposit(double amt) { if (amt > 0) balance += amt; }
    public double getBalance() { return balance; }
}</code></pre>
<p>No abstract class or interface needed — <code>private</code> field with a public accessor IS encapsulation.</p>`
      },
      {
        tags: ['Private Fields', 'Getters/Setters', 'Validation', 'Immutability', 'Package-private'],
        q: 'How do you achieve encapsulation in day-to-day development?',
        s: 'private fields, public getters/setters with validation, @Data (Lombok), DTOs to hide entity fields, service-layer methods encapsulating business rules.',
        d: `<p>Practical steps every developer should follow:</p>
<ol>
<li><strong>Always declare fields private.</strong> Never expose raw fields publicly unless they're constants (<code>public static final</code>).</li>
<li><strong>Validate inside setters.</strong> A setter is a gatekeeper — enforce business rules there, not in the caller.</li>
<li><strong>Prefer immutability.</strong> Use <code>final</code> fields + constructor injection. No setters = strongest encapsulation (e.g., Java records, <code>@Value</code> in Lombok).</li>
<li><strong>Return copies, not references.</strong> When returning collections or mutable objects, return <code>Collections.unmodifiableList()</code> or a copy.</li>
<li><strong>Use package-private where possible.</strong> Default (no modifier) visibility restricts access to the same package — useful for internal helpers.</li>
</ol>
<pre><code>@Data  // Lombok — generates private fields + getters/setters
class UserDto {
    private final String name;   // immutable
    private final String email;
}</code></pre>`
      },
      {
        tags: ['Abstract Class', 'Interface', 'Lambda', 'Abstraction'],
        q: 'How do you achieve abstraction in Java?',
        s: 'Via abstract classes (partial abstraction) and interfaces (100% abstraction). Java 8 added default/static methods to interfaces.',
        d: `<pre><code>// Interface — 100% abstract (pre-Java 8)
interface Drawable { void draw(); }

// Abstract class — partial (has both abstract + concrete)
abstract class Vehicle {
    abstract void start();            // must override
    void stop() { /* concrete */ }    // shared implementation
}

// Lambda — functional abstraction (Java 8+)
Drawable d = () -> System.out.println("Drawing circle");</code></pre>`
      },
      {
        tags: ['Static Binding', 'Dynamic Binding', 'Compile-time', 'Runtime'],
        q: 'What is compile-time binding and runtime binding?',
        s: 'Compile-time (static) binding: resolved at compile time — overloading, static/final methods. Runtime (dynamic) binding: resolved at runtime — method overriding via vtable dispatch.',
        d: `<table>
<tr><th>Feature</th><th>Compile-time Binding</th><th>Runtime Binding</th></tr>
<tr><td>When</td><td>Compilation</td><td>Execution</td></tr>
<tr><td>Also called</td><td>Static / Early binding</td><td>Dynamic / Late binding</td></tr>
<tr><td>Applies to</td><td>Overloading, static, final methods</td><td>Overriding (virtual methods)</td></tr>
<tr><td>Performance</td><td>Faster</td><td>Slightly slower (vtable lookup)</td></tr>
</table>
<pre><code>class Animal { void sound() { System.out.println("Animal"); } }
class Dog extends Animal { void sound() { System.out.println("Woof"); } }

Animal a = new Dog();
a.sound(); // Runtime binding → "Woof"</code></pre>`
      },
      {
        tags: ['Runtime Polymorphism', 'vtable', 'Dynamic Dispatch', 'Overriding'],
        q: 'Why is it called runtime polymorphism?',
        s: 'The JVM decides WHICH method implementation to call at runtime based on the actual object type (not the reference type). This is done via the vtable mechanism.',
        d: `<p>When you write <code>Animal a = new Dog(); a.sound();</code>, the compiler only sees <code>Animal</code> reference. At runtime, the JVM checks the actual object (<code>Dog</code>) and dispatches to <code>Dog.sound()</code>.</p>
<p>This <strong>dynamic dispatch</strong> is implemented via a <em>vtable</em> (virtual method table) in the JVM — each class has its own vtable mapping method calls to their implementations.</p>`
      },
      {
        tags: ['Abstract Class', 'Interface', 'State', 'Constructor', 'Multiple Inheritance'],
        q: 'Advantages of abstract class over interface? When to use which?',
        s: 'Abstract class: can have state (fields), constructors, non-public methods. Use for IS-A + shared state. Interface: pure contract, multiple inheritance. Use for capabilities.',
        d: `<table>
<tr><th>Feature</th><th>Abstract Class</th><th>Interface</th></tr>
<tr><td>State (fields)</td><td>Yes (instance fields)</td><td>Only public static final</td></tr>
<tr><td>Constructors</td><td>Yes</td><td>No</td></tr>
<tr><td>Multiple inheritance</td><td>No (single)</td><td>Yes</td></tr>
<tr><td>Access modifiers</td><td>Any</td><td>public by default</td></tr>
</table>
<ol>
<li><strong>Use Abstract Class when</strong> classes share common code/state (e.g., <code>BaseEntity</code> with <code>createdAt</code>), or you need Template Method pattern.</li>
<li><strong>Use Interface when</strong> defining a contract/capability (Serializable, Runnable, Comparable), or you need multiple inheritance.</li>
</ol>`
      },
      {
        tags: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP', 'SOLID'],
        q: 'Describe the SOLID principles with real-world examples.',
        s: 'S=Single Responsibility, O=Open-Closed, L=Liskov, I=Interface Segregation, D=Dependency Inversion. Leads to maintainable, extensible, testable code.',
        d: `<ol>
<li><strong>Single Responsibility (SRP).</strong> A class should have ONE reason to change. Split UserService into UserService + EmailService + UserRepository.</li>
<li><strong>Open-Closed (OCP).</strong> Open for extension, closed for modification. Add new discount types via new classes implementing <code>DiscountStrategy</code>, without editing existing classes.</li>
<li><strong>Liskov Substitution (LSP).</strong> Subclass must be substitutable for base class. Square extending Rectangle violates this.</li>
<li><strong>Interface Segregation (ISP).</strong> Don't force clients to implement methods they don't use. Split <code>Worker</code> into <code>Workable</code> + <code>Eatable</code>.</li>
<li><strong>Dependency Inversion (DIP).</strong> Depend on abstractions, not concretions. <code>@Autowired EmailSender sender</code> — inject interface, not concrete class.</li>
</ol>`
      },
      {
        tags: ['LSP', 'Rectangle-Square', 'Inheritance', 'Violation'],
        q: 'What is the Liskov Substitution Principle? Explain with example and violation.',
        s: 'If S is a subtype of T, objects of T can be replaced with S without altering correctness. Classic violation: Square extends Rectangle — Square breaks Rectangle\'s width/height independence.',
        d: `<pre><code>class Rectangle {
    protected int width, height;
    void setWidth(int w) { this.width = w; }
    void setHeight(int h) { this.height = h; }
    int area() { return width * height; }
}

class Square extends Rectangle {
    // VIOLATION: both must stay equal
    @Override void setWidth(int w)  { this.width = this.height = w; }
    @Override void setHeight(int h) { this.width = this.height = h; }
}

// Breaks client code:
Rectangle r = new Square();
r.setWidth(5); r.setHeight(10);
// Expected area=50, actual area=100 ← LSP violated!</code></pre>
<p><strong>Fix:</strong> Don't extend — use a separate hierarchy or composition.</p>`
      },
      {
        tags: ['Facade', 'Structural Pattern', 'Simplification', 'Subsystem'],
        q: 'What is the Facade design pattern?',
        s: 'Provides a simplified interface to a complex subsystem. OrderFacade.placeOrder() internally calls inventory, payment, shipping — caller doesn\'t need to know.',
        d: `<pre><code>class InventoryService { void checkStock(String item) { ... } }
class PaymentService  { void charge(double amount) { ... } }
class ShippingService { void ship(String address) { ... } }

// Facade — one simple method hides 3 subsystems
class OrderFacade {
    private final InventoryService inv = new InventoryService();
    private final PaymentService   pay = new PaymentService();
    private final ShippingService  ship = new ShippingService();

    public void placeOrder(String item, double amount, String addr) {
        inv.checkStock(item);
        pay.charge(amount);
        ship.ship(addr);
    }
}
// Client calls only OrderFacade — hides all complexity</code></pre>`
      },
      {
        tags: ['Diamond Problem', 'Multiple Inheritance', 'Interface', 'Ambiguity'],
        q: 'What is the diamond problem in inheritance?',
        s: 'When a class inherits from two classes that share a common ancestor — ambiguity arises. Java prevents this for classes; interfaces resolve it with explicit override.',
        d: `<pre><code>interface A { default void greet() { System.out.println("A"); } }
interface B extends A { default void greet() { System.out.println("B"); } }
interface C extends A { default void greet() { System.out.println("C"); } }

class D implements B, C {
    @Override
    public void greet() {
        B.super.greet(); // Must explicitly resolve — picks B
    }
}</code></pre>
<p>Java does not allow <code>class D extends B, C</code>. For interfaces, the implementing class must override and resolve the conflict.</p>`
      },
      {
        tags: ['IS-A', 'HAS-A', 'Composition', 'Aggregation', 'Association'],
        q: 'IS-A vs HAS-A relationship (Association, Aggregation, Composition)',
        s: 'IS-A = inheritance (Dog IS-A Animal). HAS-A = contains another object. Aggregation = weak HAS-A (independent lifecycle). Composition = strong HAS-A (child dies with parent).',
        d: `<table>
<tr><th>Relationship</th><th>Description</th><th>Example</th><th>Lifecycle</th></tr>
<tr><td>IS-A</td><td>Inheritance</td><td>Dog extends Animal</td><td>—</td></tr>
<tr><td>Association</td><td>General relationship</td><td>Teacher uses Classroom</td><td>Independent</td></tr>
<tr><td>Aggregation</td><td>Weak ownership</td><td>Department HAS Employees</td><td>Employee exists without Dept</td></tr>
<tr><td>Composition</td><td>Strong ownership</td><td>House HAS Rooms</td><td>Room destroyed with House</td></tr>
</table>`
      },
      {
        tags: ['Method Overriding', 'Covariant Return', 'Java 5', 'Subtype'],
        q: 'What is covariant return type?',
        s: 'Overriding method can return a subtype of the return type declared in the parent method. Introduced in Java 5.',
        d: `<pre><code>class Animal {
    Animal create() { return new Animal(); }
}
class Dog extends Animal {
    @Override
    Dog create() { return new Dog(); } // Dog is subtype of Animal — OK
}</code></pre>
<p>Widely used in <strong>builder patterns</strong> and <code>clone()</code> overrides to avoid casting.</p>`
      },
      {
        tags: ['Static Method', 'Method Hiding', 'Reference Type', 'Compile-time'],
        q: 'What is method hiding?',
        s: 'When a child class defines a static method with the same signature as a parent static method, it hides (not overrides) it. The reference type determines which is called.',
        d: `<pre><code>class Parent {
    static void greet() { System.out.println("Parent greet"); }
}
class Child extends Parent {
    static void greet() { System.out.println("Child greet"); } // hiding
}

Parent p = new Child();
p.greet();   // "Parent greet" — compile-time binding, NOT polymorphism

Child c = new Child();
c.greet();   // "Child greet"</code></pre>`
      }
    ]
  },

  {
    id: 'string', title: 'String & Memory', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['String Pool', 'SCP', 'Heap', 'PermGen', 'Literals'],
        q: 'What is the String Constant Pool and where are objects/literals stored?',
        s: 'SCP is a special heap area where string literals are cached. "hello" → SCP. new String("hello") → separate heap object. Moved from PermGen to Heap in Java 7.',
        d: `<pre><code>String s1 = "hello";           // SCP reference
String s2 = "hello";           // Same SCP reference
String s3 = new String("hello"); // New heap object
System.out.println(s1 == s2);  // true — same SCP object
System.out.println(s1 == s3);  // false — different heap objects
System.out.println(s1.equals(s3)); // true — same content</code></pre>
<ol>
<li><strong>String literals</strong> → Heap (String Pool area) — moved from PermGen in Java 7.</li>
<li><strong>new String()</strong> → Heap (Eden space), bypasses the pool.</li>
<li><strong>String references</strong> → Stack frame of the method.</li>
</ol>`
      },
      {
        tags: ['PermGen', 'Metaspace', 'Java 7', 'Java 8', 'Memory'],
        q: 'Difference between Java 7 and Java 8 memory (PermGen vs Metaspace)',
        s: 'Java 7: PermGen (fixed max size, stores class metadata). Java 8: PermGen removed → Metaspace (native memory, auto-grows, no OutOfMemoryError: PermGen).',
        d: `<table>
<tr><th>Feature</th><th>PermGen (≤Java 7)</th><th>Metaspace (Java 8+)</th></tr>
<tr><td>Location</td><td>JVM heap (contiguous)</td><td>Native OS memory</td></tr>
<tr><td>Size</td><td>Fixed: -XX:MaxPermSize</td><td>Auto-grows (-XX:MaxMetaspaceSize)</td></tr>
<tr><td>GC</td><td>GC'd but prone to OOM</td><td>GC'd by JVM when needed</td></tr>
<tr><td>String Pool</td><td>In PermGen (Java ≤6)</td><td>In Heap (Java 7+)</td></tr>
</table>`
      },
      {
        tags: ['String', 'StringBuilder', 'StringBuffer', 'Thread-safety', 'Immutability'],
        q: 'Difference between String, StringBuilder, and StringBuffer',
        s: 'String: immutable, thread-safe. StringBuilder: mutable, NOT thread-safe, fastest. StringBuffer: mutable, thread-safe (synchronized). Use StringBuilder in single-thread loops.',
        d: `<table>
<tr><th>Feature</th><th>String</th><th>StringBuilder</th><th>StringBuffer</th></tr>
<tr><td>Mutable</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Thread-safe</td><td>Yes (immutable)</td><td>No</td><td>Yes (synchronized)</td></tr>
<tr><td>Performance</td><td>Slow for concat</td><td>Fastest</td><td>Slower</td></tr>
<tr><td>Use case</td><td>Fixed strings</td><td>Single-thread build</td><td>Multi-thread build</td></tr>
</table>
<pre><code>// Prefer in loops:
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append(i);
String result = sb.toString();</code></pre>`
      },
      {
        tags: ['Immutability', 'Security', 'String Pool', 'Thread-safety', 'Hashcode'],
        q: 'Why is String immutable?',
        s: 'Security (class names can\'t change mid-load), String Pool caching, thread-safety (safe to share), hashCode caching (HashMap key reliability). Enforced by private final char[] value.',
        d: `<ol>
<li><strong>Security.</strong> ClassLoader uses String for class names — mutable strings could allow class substitution attacks.</li>
<li><strong>String Pool.</strong> Immutability ensures multiple references to the same SCP object are safe.</li>
<li><strong>Thread safety.</strong> Immutable objects can be shared across threads without synchronization.</li>
<li><strong>HashCode caching.</strong> <code>hashCode()</code> is computed once and cached — safe because value never changes.</li>
</ol>
<pre><code>// Internally: private final char[] value; — final + private</code></pre>`
      }
    ]
  },

  {
    id: 'immutability', title: 'Immutability', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Custom Immutable Class', 'final', 'Defensive Copy', 'Rules'],
        q: 'Can you write a custom immutable class? What are the rules?',
        s: 'final class, all fields private final, no setters, defensive copy of mutable fields (List, Date, arrays) in constructor AND getter.',
        d: `<pre><code>public final class ImmutableStudent {
    private final String name;
    private final List&lt;String&gt; courses; // mutable!

    public ImmutableStudent(String name, List&lt;String&gt; courses) {
        this.name = name;
        this.courses = List.copyOf(courses); // defensive copy — immutable view
    }

    public String getName() { return name; }
    public List&lt;String&gt; getCourses() { return courses; } // already immutable
}</code></pre>
<ol>
<li><strong>Declare class <code>final</code></strong> — prevents subclassing that could add mutability.</li>
<li><strong>All fields <code>private final</code></strong> — no reassignment possible.</li>
<li><strong>No setter methods</strong> — no way to change state after construction.</li>
<li><strong>Defensive copy mutable fields</strong> — in constructor AND getter.</li>
</ol>`
      },
      {
        tags: ['Defensive Copy', 'List', 'Date', 'Arrays', 'Safety'],
        q: 'What is a defensive copy in immutable classes?',
        s: 'Creating a NEW copy of a mutable object (List, Date, array) rather than storing the caller\'s reference, so external code cannot mutate the object\'s internal state.',
        d: `<pre><code>// BROKEN — no defensive copy
public final class Bad {
    private final List&lt;String&gt; items;
    public Bad(List&lt;String&gt; items) { this.items = items; } // stores ref!
    public List&lt;String&gt; getItems() { return items; }        // exposes ref!
}
List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a"));
Bad b = new Bad(list);
list.add("b"); // mutates b.items! — immutability broken

// CORRECT — defensive copy
public final class Good {
    private final List&lt;String&gt; items;
    public Good(List&lt;String&gt; items) { this.items = new ArrayList&lt;&gt;(items); }
    public List&lt;String&gt; getItems() { return Collections.unmodifiableList(items); }
}</code></pre>`
      }
    ]
  },

  {
    id: 'streams', title: 'Streams & Functional Programming', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Intermediate', 'Terminal', 'Lazy Evaluation', 'Pipeline'],
        q: 'Intermediate vs terminal operations in Stream API',
        s: 'Intermediate: return Stream, lazy — filter, map, sorted, flatMap, distinct, limit. Terminal: trigger execution, return non-Stream — forEach, collect, reduce, count, findFirst.',
        d: `<table>
<tr><th>Intermediate</th><th>Terminal</th></tr>
<tr><td>Returns Stream</td><td>Returns value or void</td></tr>
<tr><td>Lazy — not executed until terminal</td><td>Triggers pipeline execution</td></tr>
<tr><td>filter, map, sorted, limit, distinct, flatMap, peek, skip</td><td>forEach, collect, reduce, count, findFirst/Any, anyMatch, toList, min, max</td></tr>
</table>`
      },
      {
        tags: ['flatMap', 'Stream', 'Flatten', 'Nested Collections'],
        q: 'Explain the use of flatMap in Stream API',
        s: 'flatMap flattens Stream<Stream<T>> into Stream<T>. Use when each element maps to multiple elements (e.g., splitting sentences into words, nested lists).',
        d: `<pre><code>// Flatten nested lists
List&lt;List&lt;Integer&gt;&gt; nested = List.of(List.of(1,2), List.of(3,4));
List&lt;Integer&gt; flat = nested.stream()
    .flatMap(Collection::stream)
    .toList(); // [1, 2, 3, 4]

// Real use: words from sentences
List&lt;String&gt; words = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split(" ")))
    .distinct()
    .toList();</code></pre>`
      },
      {
        tags: ['reduce', 'BinaryOperator', 'Accumulator', 'Identity'],
        q: 'Explain the reduce method of Stream API with an example',
        s: 'reduce combines stream elements into one result. reduce(identity, BinaryOperator) — identity is the initial value. Without identity → returns Optional.',
        d: `<pre><code>List&lt;Integer&gt; nums = List.of(1, 2, 3, 4, 5);

int sum     = nums.stream().reduce(0, Integer::sum);        // 15
int product = nums.stream().reduce(1, (a, b) -> a * b);    // 120

Optional&lt;Integer&gt; max = nums.stream().reduce(Integer::max); // Optional[5]</code></pre>`
      },
      {
        tags: ['Predicate', 'Consumer', 'Supplier', 'Function', 'BiFunction'],
        q: 'Predefined functional interfaces: Predicate, Consumer, Supplier, Function, BiFunction',
        s: 'Predicate<T>: T→boolean. Consumer<T>: T→void. Supplier<T>: ()→T. Function<T,R>: T→R. BiFunction<T,U,R>: T,U→R.',
        d: `<table>
<tr><th>Interface</th><th>Method</th><th>Signature</th><th>Used in</th></tr>
<tr><td>Predicate&lt;T&gt;</td><td>test(T)</td><td>T → boolean</td><td>filter()</td></tr>
<tr><td>Consumer&lt;T&gt;</td><td>accept(T)</td><td>T → void</td><td>forEach()</td></tr>
<tr><td>Supplier&lt;T&gt;</td><td>get()</td><td>() → T</td><td>lazy init, orElseGet()</td></tr>
<tr><td>Function&lt;T,R&gt;</td><td>apply(T)</td><td>T → R</td><td>map()</td></tr>
<tr><td>BiFunction&lt;T,U,R&gt;</td><td>apply(T,U)</td><td>T,U → R</td><td>reduce-like ops</td></tr>
<tr><td>UnaryOperator&lt;T&gt;</td><td>apply(T)</td><td>T → T</td><td>replaceAll()</td></tr>
</table>`
      },
      {
        tags: ['Generics', 'Upper Bound', 'Lower Bound', 'Type Erasure', 'PECS'],
        q: 'What is the PECS rule in Generics? What is type erasure?',
        s: 'PECS = Producer Extends, Consumer Super. Use <? extends T> when reading. Use <? super T> when writing. Type erasure: generic info removed at bytecode — replaced with Object.',
        d: `<pre><code>// Producer Extends — READ from it
void print(List&lt;? extends Number&gt; list) {
    for (Number n : list) System.out.println(n); // reading OK
    // list.add(1); // COMPILE ERROR
}

// Consumer Super — WRITE to it
void addNumbers(List&lt;? super Integer&gt; list) {
    list.add(1); list.add(2); // writing OK
}</code></pre>
<h4>Type Erasure</h4>
<p>At runtime, <code>List&lt;String&gt;</code> and <code>List&lt;Integer&gt;</code> are both just <code>List</code>. Generic type info is erased — replaced with <code>Object</code> (or the bound type). No <code>instanceof List&lt;String&gt;</code> check possible at runtime.</p>`
      }
    ]
  },

  {
    id: 'collections', title: 'Collections & Data Structures', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['HashMap', 'Internal Working', 'Red-Black Tree', 'Java 8', 'Hash Collision'],
        q: 'Internal working of HashMap in Java 8',
        s: 'Array of Node<K,V>[] buckets. hashCode() → index. Collision → LinkedList. If bucket ≥ 8 AND capacity ≥ 64 → Red-Black Tree. Load factor 0.75, capacity 16.',
        d: `<ol>
<li><strong>Compute hash.</strong> <code>hash = (key == null) ? 0 : h ^ (h &gt;&gt;&gt; 16)</code> — XOR with upper bits to spread hashes.</li>
<li><strong>Find bucket.</strong> <code>index = hash &amp; (capacity - 1)</code></li>
<li><strong>Handle collision.</strong> Bucket has nodes → check <code>equals()</code>, update if match, else add to chain.</li>
<li><strong>Treeify.</strong> If chain length ≥ 8 AND capacity ≥ 64 → convert to Red-Black Tree.</li>
<li><strong>Resize.</strong> If size > threshold (capacity × 0.75) → double capacity, rehash.</li>
</ol>
<pre><code>// Key constants in Java 8 HashMap
int INITIAL_CAPACITY      = 16;
float LOAD_FACTOR         = 0.75f;
int TREEIFY_THRESHOLD     = 8;
int MIN_TREEIFY_CAPACITY  = 64;</code></pre>`
      },
      {
        tags: ['ConcurrentHashMap', 'Thread-safe', 'CAS', 'Segment Lock', 'Java 8'],
        q: 'HashMap vs ConcurrentHashMap',
        s: 'HashMap: not thread-safe, fast. ConcurrentHashMap: thread-safe, uses CAS + synchronized per bucket (Java 8+). No null keys/values in CHM.',
        d: `<table>
<tr><th>Feature</th><th>HashMap</th><th>ConcurrentHashMap</th></tr>
<tr><td>Thread-safe</td><td>No</td><td>Yes</td></tr>
<tr><td>Null key/value</td><td>1 null key, multiple null values</td><td>No null keys or values</td></tr>
<tr><td>Locking (Java 8)</td><td>None</td><td>CAS + synchronized per bucket</td></tr>
<tr><td>Iterator</td><td>Fail-fast</td><td>Weakly consistent (fail-safe)</td></tr>
</table>`
      },
      {
        tags: ['Comparable', 'Comparator', 'Natural Order', 'External Order'],
        q: 'Comparable vs Comparator',
        s: 'Comparable: natural ordering, class implements compareTo() — modifies the class. Comparator: external, flexible, separate lambda — doesn\'t modify class. Comparator preferred in real projects.',
        d: `<pre><code>// Comparable — natural order (baked into the class)
class Employee implements Comparable&lt;Employee&gt; {
    int salary;
    @Override public int compareTo(Employee o) {
        return Integer.compare(this.salary, o.salary);
    }
}
Collections.sort(employees); // uses compareTo

// Comparator — external, flexible (multiple sort orders)
employees.sort(Comparator.comparing(Employee::getName));
employees.sort(Comparator.comparingInt(Employee::getSalary).reversed());</code></pre>
<p>In real projects: <strong>Comparator is preferred</strong> — doesn't force modification of the class and allows multiple sort strategies.</p>`
      },
      {
        tags: ['Fail-fast', 'Fail-safe', 'ConcurrentModificationException', 'Iterator'],
        q: 'Fail-safe vs fail-fast iterator',
        s: 'Fail-fast: throws ConcurrentModificationException if collection modified during iteration (ArrayList, HashMap). Fail-safe: works on a copy, no exception (CopyOnWriteArrayList, ConcurrentHashMap).',
        d: `<pre><code>// Fail-fast: modification during iteration → exception
List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a","b","c"));
for (String s : list) {
    if (s.equals("b")) list.remove(s); // ConcurrentModificationException!
}

// Safe: use Iterator.remove()
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    if (it.next().equals("b")) it.remove(); // OK</code></pre>`
      },
      {
        tags: ['hashCode', 'equals', 'Contract', 'HashMap Key', 'Override'],
        q: 'What is hashCode() and equals() contract?',
        s: 'If a.equals(b) → a.hashCode() == b.hashCode(). If you override equals(), you MUST override hashCode() — else HashMap/HashSet will break.',
        d: `<pre><code>class Point {
    int x, y;
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point p)) return false;
        return x == p.x && y == p.y;
    }
    @Override
    public int hashCode() {
        return Objects.hash(x, y); // MUST implement alongside equals()
    }
}
// Without hashCode override: two equal Points end up in different buckets
// → map.get() returns null for a key you just put()!</code></pre>`
      }
    ]
  },

  {
    id: 'multithreading', title: 'Multithreading & Concurrency', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Runnable', 'Callable', 'Return Value', 'Future', 'Thread'],
        q: 'Runnable vs Callable',
        s: 'Runnable: run() returns void, cannot throw checked exceptions. Callable: call() returns T, can throw checked exceptions. Use Callable when you need a result from a thread.',
        d: `<pre><code>// Runnable — fire and forget
Runnable r = () -> System.out.println("Running");
new Thread(r).start();

// Callable — returns result
Callable&lt;Integer&gt; c = () -> heavyComputation();
ExecutorService es = Executors.newSingleThreadExecutor();
Future&lt;Integer&gt; future = es.submit(c);
Integer result = future.get(); // blocks until done
es.shutdown();</code></pre>`
      },
      {
        tags: ['synchronized', 'ReentrantLock', 'tryLock', 'Fairness', 'Condition'],
        q: 'synchronized vs ReentrantLock',
        s: 'synchronized: simple, JVM manages lock/unlock. ReentrantLock: explicit lock()/unlock(), tryLock(), timed lock, fairness policy, interruptible.',
        d: `<table>
<tr><th>Feature</th><th>synchronized</th><th>ReentrantLock</th></tr>
<tr><td>Lock release</td><td>Automatic</td><td>Manual (must be in finally)</td></tr>
<tr><td>tryLock()</td><td>No</td><td>Yes — non-blocking attempt</td></tr>
<tr><td>Fairness</td><td>No</td><td>Yes: new ReentrantLock(true)</td></tr>
<tr><td>Interruptible</td><td>No</td><td>Yes: lockInterruptibly()</td></tr>
</table>
<pre><code>ReentrantLock lock = new ReentrantLock();
try {
    lock.lock(); // critical section
} finally {
    lock.unlock(); // ALWAYS in finally
}</code></pre>`
      },
      {
        tags: ['volatile', 'AtomicInteger', 'CAS', 'Visibility', 'Atomicity'],
        q: 'volatile vs AtomicInteger',
        s: 'volatile: guarantees visibility (no CPU caching) but NOT atomicity. AtomicInteger: guarantees both visibility AND atomicity via CAS (Compare-And-Swap) — no locking needed.',
        d: `<pre><code>volatile boolean flag = true; // visible across threads, but:

// BROKEN with volatile:
volatile int count = 0;
count++; // read-modify-write — NOT atomic!

// CORRECT:
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet(); // atomic CAS — thread-safe</code></pre>
<p>Use <code>volatile</code> for simple boolean flags / single reads. Use <code>AtomicInteger</code> for compound operations (increment, compare-and-set).</p>`
      },
      {
        tags: ['ThreadLocal', 'Thread Safety', 'Request Context', 'Memory Leak'],
        q: 'ThreadLocal use case',
        s: 'ThreadLocal gives each thread its own independent variable copy — no synchronization needed. Used for user session/request context, database connections per thread.',
        d: `<pre><code>ThreadLocal&lt;String&gt; currentUser = new ThreadLocal&lt;&gt;();

// In filter/interceptor:
currentUser.set("alice");

// In service (same thread):
String user = currentUser.get(); // "alice"

// IMPORTANT: always clean up (prevent memory leaks in thread pools)
currentUser.remove();</code></pre>
<p>In Spring Boot: <code>RequestContextHolder</code> internally uses ThreadLocal for HTTP request data.</p>`
      }
    ]
  },

  {
    id: 'java8', title: 'Java 8+ Features', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Lambda', 'Stream API', 'Optional', 'DateTime API', 'Default Methods'],
        q: 'New features in Java 8',
        s: 'Lambda expressions, Stream API, default/static interface methods, @FunctionalInterface, Optional, DateTime API (java.time), CompletableFuture, method references, new collectors.',
        d: `<ol>
<li><strong>Lambda expressions</strong> — <code>(a, b) -&gt; a + b</code> — concise functional code.</li>
<li><strong>Stream API</strong> — declarative data processing with lazy evaluation.</li>
<li><strong>Default/static interface methods</strong> — backward-compatible API evolution.</li>
<li><strong>Optional&lt;T&gt;</strong> — null-safe wrapper, eliminates NPEs.</li>
<li><strong>java.time API</strong> — LocalDate, LocalDateTime, ZonedDateTime, Duration.</li>
<li><strong>CompletableFuture</strong> — async non-blocking computation with chaining.</li>
<li><strong>Method references</strong> — <code>String::toUpperCase</code>.</li>
<li><strong>Collectors</strong> — <code>groupingBy</code>, <code>partitioningBy</code>, <code>joining</code>.</li>
</ol>`
      },
      {
        tags: ['Java 11', 'Java 17', 'Java 21', 'LTS', 'Virtual Threads'],
        q: 'Major features in Java 11, 17, 21',
        s: 'Java 11: HttpClient, String methods, var in lambdas. Java 17: Sealed classes, Records, Pattern matching. Java 21: Virtual threads, Pattern matching switch, Record patterns.',
        d: `<table>
<tr><th>Version (LTS)</th><th>Key Features</th></tr>
<tr><td>Java 11</td><td>HttpClient API, String isBlank/strip/lines, Files.readString, var in lambdas</td></tr>
<tr><td>Java 17</td><td>Sealed classes, Records (final), Pattern matching instanceof (final), Text blocks</td></tr>
<tr><td>Java 21</td><td>Virtual threads (Project Loom), Pattern matching switch, Record patterns, Sequenced collections</td></tr>
</table>`
      },
      {
        tags: ['Record', 'Immutable', 'POJO', 'Java 16', 'Data Class'],
        q: 'What are Record Classes?',
        s: 'Records (Java 16) are immutable data classes. Auto-generate constructor, getters (fieldName() not getFieldName()), equals(), hashCode(), toString().',
        d: `<pre><code>// Record definition
record Point(int x, int y) { }

// Auto-generated:
Point p = new Point(3, 4);
System.out.println(p.x());  // 3 — getter is field name
System.out.println(p);       // Point[x=3, y=4]

// Compact constructor with validation
record User(String name, int age) {
    User {
        if (age &lt; 0) throw new IllegalArgumentException("Age negative");
        name = name.strip();
    }
}

// Local record inside a method (Java 16+)
public void process() {
    record Pair(String key, int value) { }
    Pair p = new Pair("count", 5);
}</code></pre>
<p>Records are implicitly <code>final</code> and extend <code>java.lang.Record</code>.</p>`
      },
      {
        tags: ['Optional', 'of', 'ofNullable', 'NPE Prevention', 'Null Safety'],
        q: 'Optional — of vs ofNullable',
        s: 'Optional.of(value): throws NPE if null. Optional.ofNullable(value): wraps null safely (returns empty()). Use ofNullable when value might be null.',
        d: `<pre><code>Optional&lt;String&gt; o1 = Optional.of("hello");         // OK
Optional&lt;String&gt; o2 = Optional.of(null);            // NullPointerException!
Optional&lt;String&gt; o3 = Optional.ofNullable(null);    // Optional.empty()

// Real use
Optional&lt;User&gt; user = userRepo.findById(id);
user.ifPresent(u -&gt; send(u.getEmail()));
String email = user.map(User::getEmail).orElse("default@mail.com");
User u = user.orElseThrow(() -&gt; new UserNotFoundException(id));</code></pre>`
      },
      {
        tags: ['Sealed Class', 'Permitted Subclasses', 'Pattern Matching', 'Java 17'],
        q: 'What are Sealed Classes?',
        s: 'Sealed classes restrict which classes can extend/implement them. Declared with sealed + permits. Enables exhaustive pattern matching in switch expressions.',
        d: `<pre><code>sealed interface Shape permits Circle, Rectangle, Triangle { }

final class Circle    implements Shape { double radius; }
final class Rectangle implements Shape { double w, h; }
non-sealed class Triangle implements Shape { } // can be extended freely

// Exhaustive switch (Java 21) — compiler checks all cases
double area = switch (shape) {
    case Circle c    -&gt; Math.PI * c.radius * c.radius;
    case Rectangle r -&gt; r.w * r.h;
    case Triangle t  -&gt; 0;
};</code></pre>`
      }
    ]
  },

  {
    id: 'exceptions', title: 'Exception Handling', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Throwable', 'Error', 'RuntimeException', 'Checked', 'Unchecked'],
        q: 'Exception hierarchy',
        s: 'Throwable → Error (unchecked, don\'t catch) and Exception. Exception → RuntimeException (unchecked) and Checked exceptions (IOException, SQLException).',
        d: `<pre><code>Throwable
├── Error (unchecked — don't catch)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── VirtualMachineError
└── Exception
    ├── RuntimeException (unchecked)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── ClassCastException
    │   └── IllegalArgumentException
    └── Checked (must handle/declare)
        ├── IOException
        ├── SQLException
        └── ClassNotFoundException</code></pre>`
      },
      {
        tags: ['try-with-resources', 'AutoCloseable', 'finally', 'Java 7'],
        q: 'try-with-resources vs finally',
        s: 'try-with-resources (Java 7): auto-closes AutoCloseable resources. Cleaner and safer than finally. Suppressed exceptions stored and retrievable.',
        d: `<pre><code>// Old style
Connection conn = null;
try {
    conn = getConnection();
} finally {
    if (conn != null) conn.close(); // verbose
}

// try-with-resources (Java 7+) — auto-close in declaration order
try (Connection conn = getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    // both auto-closed in reverse order (ps first, then conn)
} catch (SQLException e) {
    // handle
}</code></pre>`
      },
      {
        tags: ['throw', 'throws', 'Declaration', 'Propagation'],
        q: 'throw vs throws',
        s: 'throw: explicitly throw an exception object (action). throws: declares that a method MAY throw checked exceptions — callers must handle or propagate.',
        d: `<pre><code>// throws — declaration (promise to caller)
public void readFile(String path) throws IOException {
    if (path == null) throw new IOException("Path is null"); // throw — action
}

// Custom checked exception
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount &gt; balance)
        throw new InsufficientFundsException("Need " + (amount - balance) + " more");
}</code></pre>`
      }
    ]
  },

  {
    id: 'jvm', title: 'Class Loaders & JVM', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Bootstrap', 'Extension', 'Application', 'Parent Delegation', 'ClassLoader'],
        q: 'Types of class loaders in Java',
        s: 'Bootstrap (rt.jar/JRE core), Extension/Platform ClassLoader (lib/ext), Application ClassLoader (classpath). Parent delegation: child asks parent first.',
        d: `<pre><code>// Hierarchy (parent delegation)
Bootstrap ClassLoader         // native — loads java.lang, java.util
    └── Platform ClassLoader  // Java 9+ (was Extension) — Java SE APIs
            └── Application ClassLoader  // classpath classes (your code)
                    └── Custom ClassLoader  // dynamic loading</code></pre>
<p><strong>Parent delegation:</strong> A ClassLoader always asks its parent first before loading. This prevents malicious code from replacing core Java classes (e.g., no custom <code>java.lang.String</code> possible).</p>`
      },
      {
        tags: ['GC', 'Young Generation', 'Old Generation', 'Eden', 'G1 GC'],
        q: 'How does the garbage collector work in heap memory?',
        s: 'GC finds unreachable objects and reclaims memory. Eden → Survivor (Minor GC) → Old Gen (Major GC). Java 9+ default: G1 GC (region-based, low-latency).',
        d: `<ol>
<li><strong>Young Generation</strong> (Eden + S0 + S1) — most objects are short-lived. Minor GC is fast and frequent.</li>
<li><strong>Old Generation</strong> — long-lived objects promoted here. Major GC is slower.</li>
<li><strong>Metaspace</strong> — class metadata (native memory, GC'd when ClassLoader unloaded).</li>
</ol>
<table>
<tr><th>GC Type</th><th>Description</th><th>Default</th></tr>
<tr><td>Serial GC</td><td>Single thread, stop-the-world</td><td>Small JVMs</td></tr>
<tr><td>Parallel GC</td><td>Multiple threads</td><td>Java 8 server</td></tr>
<tr><td>G1 GC</td><td>Region-based, predictable pause</td><td>Java 9+</td></tr>
<tr><td>ZGC</td><td>Ultra-low pause (&lt;10ms)</td><td>Java 15+</td></tr>
</table>`
      },
      {
        tags: ['JDK', 'JRE', 'JVM', 'Compiler', 'Bytecode'],
        q: 'JDK vs JRE vs JVM differences',
        s: 'JDK = JRE + compiler (javac) + tools. JRE = JVM + class libraries. JVM = executes bytecode. JDK for development, JRE for running, JVM for execution.',
        d: `<pre><code>JDK (for developers)
├── javac (compiler)
├── javadoc, jdb, jps, jstack, jconsole...
└── JRE (for running Java)
    ├── Java class libraries (java.lang, java.util, java.io...)
    └── JVM (Execution engine)
        ├── Class Loader Subsystem
        ├── Bytecode Verifier
        ├── Interpreter + JIT Compiler
        └── Garbage Collector</code></pre>`
      }
    ]
  },

  {
    id: 'designpatterns', title: 'Design Patterns', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Creational', 'Structural', 'Behavioral', 'GoF', 'Pattern Types'],
        q: 'Types of design patterns',
        s: 'Creational (object creation): Singleton, Factory, Builder. Structural (composition): Adapter, Decorator, Facade. Behavioral (communication): Strategy, Observer, Command, Template Method.',
        d: `<table>
<tr><th>Category</th><th>Patterns</th></tr>
<tr><td>Creational</td><td>Singleton, Factory Method, Abstract Factory, Builder, Prototype</td></tr>
<tr><td>Structural</td><td>Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight</td></tr>
<tr><td>Behavioral</td><td>Strategy, Observer, Command, Template Method, Iterator, State, Chain of Responsibility</td></tr>
</table>`
      },
      {
        tags: ['Singleton', 'Double-checked Locking', 'volatile', 'Thread-safe', 'Bill Pugh'],
        q: 'Singleton design pattern — double-checked locking',
        s: 'Ensures only one instance. volatile + double-checked synchronized prevents multiple threads from creating instances. Prefer Bill Pugh holder idiom.',
        d: `<pre><code>// Double-checked locking
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() { }

    public static Singleton getInstance() {
        if (instance == null) {                 // first check (no lock)
            synchronized (Singleton.class) {
                if (instance == null) {         // second check (with lock)
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

// Simpler — Bill Pugh Holder (preferred)
public class BillPugh {
    private BillPugh() { }
    private static class Holder {
        static final BillPugh INSTANCE = new BillPugh(); // lazy + thread-safe
    }
    public static BillPugh getInstance() { return Holder.INSTANCE; }
}</code></pre>`
      },
      {
        tags: ['Strategy Pattern', 'Behavioral', 'Payment', 'Interchangeable Algorithm'],
        q: 'Strategy pattern with real-world example',
        s: 'Defines family of algorithms, encapsulates each, makes them interchangeable. Used for: payment methods, sorting, discount strategies.',
        d: `<pre><code>interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("Credit Card: " + amount); }
}
class UpiPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("UPI: " + amount); }
}

class OrderContext {
    private PaymentStrategy strategy;
    public void setStrategy(PaymentStrategy s) { this.strategy = s; }
    public void checkout(double amount) { strategy.pay(amount); }
}

// Swap algorithm at runtime
OrderContext ctx = new OrderContext();
ctx.setStrategy(new UpiPayment());
ctx.checkout(999.0); // "UPI: 999.0"</code></pre>`
      },
      {
        tags: ['Builder Pattern', 'Method Chaining', 'Lombok', 'Telescoping Constructor'],
        q: 'Builder pattern',
        s: 'Constructs complex objects step-by-step. Avoids telescoping constructors. Method chaining returns builder. Used in Lombok @Builder, StringBuilder, HTTP clients.',
        d: `<pre><code>// Lombok @Builder (most common in Spring Boot)
@Builder @Data
class User {
    String name, email;
    int age;
    List&lt;String&gt; roles;
}
User user = User.builder()
    .name("Alice").email("alice@mail.com")
    .age(30).roles(List.of("ADMIN"))
    .build();</code></pre>`
      },
      {
        tags: ['Observer Pattern', 'Event', 'Spring Events', 'Publish-Subscribe'],
        q: 'Observer pattern with real use case',
        s: 'One-to-many dependency — when subject changes, all observers notified. Used in Spring ApplicationEvents, MVC, Kafka consumers.',
        d: `<pre><code>// Spring ApplicationEvent (Observer pattern built-in)
@Component
class OrderService {
    @Autowired ApplicationEventPublisher publisher;
    public void placeOrder(Order order) {
        publisher.publishEvent(new OrderPlacedEvent(order));
    }
}

@Component class EmailListener {
    @EventListener
    void onOrder(OrderPlacedEvent e) { sendEmail(e.getOrder()); }
}

@Component class InventoryListener {
    @EventListener
    void onOrder(OrderPlacedEvent e) { updateStock(e.getOrder()); }
}</code></pre>`
      }
    ]
  },

  {
    id: 'tricky', title: 'Tricky Output Questions', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Integer Cache', 'Autoboxing', 'Object Pool', '127 vs 128'],
        q: 'Integer caching: why Integer 127==127 true but 128==128 false?',
        s: 'Java caches Integer values from -128 to 127 in a pool. Autoboxed values in this range return the same cached object. Outside this range, new objects are created.',
        d: `<pre><code>Integer x1 = 127; Integer x2 = 127;
System.out.println(x1 == x2); // true — same cached object

Integer x3 = 128; Integer x4 = 128;
System.out.println(x3 == x4); // false — different objects

// ALWAYS use .equals() for Integer comparison
System.out.println(x3.equals(x4)); // true</code></pre>
<p>Double, Float — <strong>NO caching</strong>. Always use <code>.equals()</code>.</p>`
      },
      {
        tags: ['String Concatenation', 'Operator Precedence', 'null + string'],
        q: '1 + 2 + "3" vs "1" + 2 + 3 — outputs?',
        s: '"33" and "123". Java evaluates left-to-right. 1+2=3(int), then 3+"3"="33". "1"+2="12", then "12"+3="123".',
        d: `<pre><code>System.out.println(1 + 2 + "3");  // "33"  — 1+2=3(int), 3+"3"="33"
System.out.println("1" + 2 + 3);  // "123" — "1"+2="12", "12"+3="123"
System.out.println(1 + (2 + "3")); // "123" — 2+"3"="23", 1+"23"="123"
String s = null;
System.out.println(s + "world");   // "nullworld" — null → "null" in concat</code></pre>`
      },
      {
        tags: ['finally', 'return', 'Exception Override', 'Execution Order'],
        q: 'finally block with return — which return value wins?',
        s: 'finally return wins and overrides try return. If finally modifies a local var but try already had return, the original value is returned (captured at return point).',
        d: `<pre><code>int test() {
    try { return 1; }     // would return 1...
    finally { return 2; } // ...finally overrides → returns 2!
}
System.out.println(test()); // 2

int tricky() {
    int x = 10;
    try { return x; }    // captures x=10 at this point
    finally { x = 20; }  // too late — x=10 already captured
}
System.out.println(tricky()); // 10</code></pre>`
      },
      {
        tags: ['Static Initializer', 'Instance Block', 'Constructor', 'Initialization Order'],
        q: 'Class initialization order: static block, instance block, constructor',
        s: 'Parent static block → Child static block → Parent instance block → Parent constructor → Child instance block → Child constructor.',
        d: `<pre><code>class Parent {
    static { System.out.println("1. Parent static"); }
    { System.out.println("3. Parent instance"); }
    Parent() { System.out.println("4. Parent constructor"); }
}
class Child extends Parent {
    static { System.out.println("2. Child static"); }
    { System.out.println("5. Child instance"); }
    Child() { System.out.println("6. Child constructor"); }
}
new Child();
// Output:
// 1. Parent static   (static blocks run once at class load)
// 2. Child static
// 3. Parent instance
// 4. Parent constructor
// 5. Child instance
// 6. Child constructor</code></pre>`
      },
      {
        tags: ['Infinite Loop', 'i++', 'Post-increment', 'Assignment'],
        q: 'for (int i = 0; i < 10; i = i++) — what happens?',
        s: 'Infinite loop. i=i++ evaluates: i++ returns current i (0), then increments. But that pre-increment value (0) is assigned BACK to i. So i stays 0 forever.',
        d: `<pre><code>// i = i++ breakdown:
// 1. Evaluate i++ → returns CURRENT i (0), THEN i becomes 1
// 2. Assign result (0) back to i → i = 0 again
// i never increases! → infinite loop

// Fix:
for (int i = 0; i &lt; 10; i++) { }    // correct
for (int i = 0; i &lt; 10; i = i + 1) { } // also correct</code></pre>`
      }
    ]
  },

  {
    id: 'serialization', title: 'Serialization', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['Serializable', 'ObjectOutputStream', 'Deserialization', 'Byte Stream'],
        q: 'What is serialization and deserialization?',
        s: 'Serialization: converting object state into byte stream (storage/transport). Deserialization: reconstructing from bytes. Class must implement Serializable.',
        d: `<pre><code>class User implements Serializable {
    private static final long serialVersionUID = 1L;
    String name;
    transient String password; // NOT serialized
}

// Serialize
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"))) {
    oos.writeObject(user);
}
// Deserialize
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"))) {
    User u = (User) ois.readObject();
}</code></pre>`
      },
      {
        tags: ['transient', 'Keyword', 'Sensitive Data', 'Skip Field'],
        q: 'What is the transient keyword?',
        s: 'transient marks a field to be excluded from serialization. Used for sensitive data (passwords), non-serializable objects (Logger, Connection), or computed fields.',
        d: `<pre><code>class User implements Serializable {
    String username;
    transient String password;     // NOT saved in byte stream
    transient Logger logger;       // Logger is not Serializable
    transient Connection dbConn;   // Non-Serializable + not needed
}
// After deserialization: password == null, logger == null</code></pre>`
      }
    ]
  },

  {
    id: 'keywords', title: 'Static, Final & Keywords', category: 'Core Java', color: 'java',
    questions: [
      {
        tags: ['static', 'Class-level', 'Shared', 'Metaspace', 'Initialization'],
        q: 'What is the static keyword?',
        s: 'static belongs to class, not instance. Static fields/methods shared across all instances. Static blocks run once at class loading. Stored in Metaspace.',
        d: `<pre><code>class Counter {
    private static int count = 0;  // shared across ALL instances
    private int id;

    static { System.out.println("Class loaded once"); } // static initializer

    Counter() { this.id = ++count; }
    static int getCount() { return count; } // call without instance

    static class Helper { } // static nested — no outer instance needed
}
Counter.getCount(); // call without creating Counter object</code></pre>`
      },
      {
        tags: ['final', 'finally', 'finalize', 'Keyword Differences', 'Deprecated'],
        q: 'final vs finally vs finalize',
        s: 'final: keyword (variable=no reassign, method=no override, class=no extend). finally: always-runs try block. finalize(): deprecated Object method called before GC.',
        d: `<table>
<tr><th>Keyword</th><th>Applied to</th><th>Effect</th></tr>
<tr><td>final</td><td>variable, method, class</td><td>No reassign / No override / No extend</td></tr>
<tr><td>finally</td><td>try-catch block</td><td>Always executes (even with exception/return)</td></tr>
<tr><td>finalize()</td><td>Object method</td><td>Called by GC before collecting — deprecated Java 9</td></tr>
</table>`
      },
      {
        tags: ['Enum', 'Type-safe', 'Constants', 'Switch', 'ordinal'],
        q: 'What are Enums?',
        s: 'Type-safe constant groups. Can have fields, constructors, methods, implement interfaces. Safe in switch. name() returns string; ordinal() returns index.',
        d: `<pre><code>enum Status {
    ACTIVE("Active User"), INACTIVE("Inactive"), PENDING("Pending");

    private final String label;
    Status(String label) { this.label = label; }
    public String getLabel() { return label; }
}

Status s = Status.ACTIVE;
System.out.println(s.name());     // "ACTIVE"
System.out.println(s.ordinal());  // 0
System.out.println(s.getLabel()); // "Active User"

switch (s) {
    case ACTIVE  -> handleActive();
    case PENDING -> handlePending();
}</code></pre>`
      }
    ]
  }
]

export default JAVA_DATA
