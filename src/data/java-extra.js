// Extra questions merged into existing sections by section id
const JAVA_EXTRA = {
  oop: [
    {
      tags: ['ISP', 'Interface Segregation', 'Fat Interface', 'LSP vs ISP'],
      q: 'What is ISP (Interface Segregation Principle)? LSP vs ISP difference.',
      s: 'ISP: Don\'t force clients to implement methods they don\'t use — split fat interfaces. LSP is about subtype correctness; ISP is about interface design.',
      d: `<pre><code>// Bad — fat interface
interface Worker { void work(); void eat(); } // robots don't eat!

// Good — segregated
interface Workable { void work(); }
interface Eatable  { void eat();  }

class Human implements Workable, Eatable { ... }
class Robot implements Workable { ... } // doesn't need eat()</code></pre>
<table>
<tr><th>LSP</th><th>ISP</th></tr>
<tr><td>Subclass must honor base class contract</td><td>Don't force unneeded methods on implementing class</td></tr>
<tr><td>About inheritance correctness</td><td>About interface design</td></tr>
</table>`
    },
    {
      tags: ['OOP Disadvantages', 'Over-engineering', 'Inheritance', 'Performance'],
      q: 'What are the disadvantages of OOP?',
      s: 'Over-engineering, tight coupling via inheritance (fragile base class), performance overhead (object creation + vtable), not ideal for math/data-heavy tasks.',
      d: `<ol>
<li><strong>Over-engineering.</strong> Too many abstraction layers for simple problems.</li>
<li><strong>Tight coupling via inheritance.</strong> Changes to base class break subclasses — "fragile base class" problem.</li>
<li><strong>Performance overhead.</strong> Object creation and virtual dispatch cost more than procedural code.</li>
<li><strong>Not ideal for all domains.</strong> Functional/procedural style is more natural for math, data pipelines, ML.</li>
<li><strong>Steep learning curve.</strong> SOLID + design patterns require experience to apply correctly.</li>
</ol>`
    },
    {
      tags: ['Composition', 'Aggregation', 'Lifecycle', 'HAS-A', 'Difference'],
      q: 'What is the difference between Composition and Aggregation?',
      s: 'Composition: strong ownership — child cannot exist without parent (Room dies with House). Aggregation: weak ownership — child can exist independently (Employee exists without Department).',
      d: `<pre><code>// Composition — Room cannot exist without House
class House {
    private final List&lt;Room&gt; rooms;
    House() { this.rooms = new ArrayList&lt;&gt;(); rooms.add(new Room()); }
    // when House is GC'd, Rooms are too
}

// Aggregation — Employee exists independently of Department
class Department {
    private List&lt;Employee&gt; employees; // employees can exist without dept
    void addEmployee(Employee e) { employees.add(e); }
}</code></pre>`
    },
    {
      tags: ['Method Overriding', 'Rules', 'Access Modifier', 'Return Type', 'Exception'],
      q: 'What are the rules for method overriding?',
      s: 'Same name + same parameter list. Return type same or covariant. Cannot narrow access (public→protected forbidden). Cannot throw broader checked exceptions. Cannot override static/final/private.',
      d: `<ol>
<li><strong>Same method name and parameter list</strong> (signature must match exactly).</li>
<li><strong>Return type</strong> must be same or a covariant subtype (Java 5+).</li>
<li><strong>Access modifier</strong> can only be widened (protected → public), never narrowed.</li>
<li><strong>Cannot throw new or broader checked exceptions</strong> than declared in parent.</li>
<li><code>static</code>, <code>final</code>, <code>private</code> methods <strong>cannot</strong> be overridden.</li>
<li>Use <code>@Override</code> — causes compile error if you're not actually overriding.</li>
</ol>`
    },
    {
      tags: ['Overloading vs Overriding', 'Compile-time', 'Runtime', 'Polymorphism'],
      q: 'Difference between method overloading and overriding',
      s: 'Overloading: same name, different params, same class — compile-time polymorphism. Overriding: same name + params, parent-child — runtime polymorphism.',
      d: `<table>
<tr><th>Feature</th><th>Overloading</th><th>Overriding</th></tr>
<tr><td>Class</td><td>Same class</td><td>Parent-child classes</td></tr>
<tr><td>Parameters</td><td>Must differ</td><td>Must be same</td></tr>
<tr><td>Return type</td><td>Can differ</td><td>Same or covariant</td></tr>
<tr><td>Binding</td><td>Compile-time</td><td>Runtime</td></tr>
<tr><td>Inheritance</td><td>Not needed</td><td>Required</td></tr>
</table>`
    },
    {
      tags: ['Method Overloading', 'Use Case', 'Constructors', 'Utility'],
      q: 'Where is method overloading used?',
      s: 'Constructors (different param combos), utility methods (parseInt variants), println (all types), builder-style APIs, convenience methods in same class.',
      d: `<pre><code>// Constructor overloading
class User {
    User() { this("Anonymous", 0); }
    User(String name) { this(name, 18); }
    User(String name, int age) { this.name = name; this.age = age; }
}

// Utility method overloading
class MathUtil {
    static int add(int a, int b) { return a + b; }
    static double add(double a, double b) { return a + b; }
    static int add(int a, int b, int c) { return a + b + c; }
}

// System.out.println — overloaded for every type
println(int), println(double), println(String), println(Object)...</code></pre>`
    },
    {
      tags: ['Access Modifier', 'Overriding', 'Widening Only', 'LSP'],
      q: 'Can we reduce access modifier while overriding? (public → protected)',
      s: 'NO. Access modifier can only be widened (protected → public) or kept same. Reducing it violates LSP — a subclass must be at least as accessible as the parent.',
      d: `<pre><code>class Parent {
    public void show() { }
}
class Child extends Parent {
    // COMPILE ERROR — cannot reduce access
    // protected void show() { }

    // OK — widening is allowed
    public void show() { } // same or wider only
}</code></pre>`
    },
    {
      tags: ['Human Body', 'OOP Demo', 'Encapsulation', 'Polymorphism', 'Inheritance'],
      q: 'Implement a Human Body class demonstrating all OOP concepts.',
      s: 'Encapsulation (private organs), Abstraction (organ interface), Inheritance (BodyPart), Polymorphism (overriding pump/breathe), Composition (Heart IS-PART-OF Body).',
      d: `<pre><code>// Abstraction
interface Organ { void function(); }

// Encapsulation + Inheritance
abstract class BodyPart { protected String name; BodyPart(String n){name=n;} }

// Composition — Heart exists only inside Body
class Heart extends BodyPart implements Organ {
    private int bpm = 72; // private field
    Heart() { super("Heart"); }
    public void function() { System.out.println("Pumping at " + bpm + " bpm"); }
    public void setBpm(int bpm) { if(bpm>0) this.bpm=bpm; } // validation
}

class Lungs extends BodyPart implements Organ {
    Lungs() { super("Lungs"); }
    public void function() { System.out.println("Breathing oxygen"); }
}

class HumanBody {
    private final List&lt;Organ&gt; organs = new ArrayList&lt;&gt;(); // encapsulated
    void addOrgan(Organ o) { organs.add(o); }
    void operate() { organs.forEach(Organ::function); } // polymorphism
}

HumanBody body = new HumanBody();
body.addOrgan(new Heart()); body.addOrgan(new Lungs());
body.operate(); // polymorphic — calls each organ's function()</code></pre>`
    },
    {
      tags: ['Hybrid Inheritance', 'Interface', 'Java', 'Multiple Inheritance'],
      q: 'What is Hybrid inheritance?',
      s: 'Combination of multiple inheritance types (single + hierarchical + multiple). Java achieves this through interfaces only — prevents diamond problem with classes.',
      d: `<pre><code>interface Flyable { void fly(); }
interface Swimmable { void swim(); }
class Animal { void breathe() { System.out.println("Breathing"); } }

// Hybrid: single (Animal) + multiple interfaces
class Duck extends Animal implements Flyable, Swimmable {
    public void fly()  { System.out.println("Duck flies"); }
    public void swim() { System.out.println("Duck swims"); }
}</code></pre>`
    }
  ],

  string: [
    {
      tags: ['Metaspace', 'Dynamic Growth', 'Native Memory', 'ClassLoader'],
      q: 'Why was Metaspace invented? How does it dynamically grow?',
      s: 'PermGen had a fixed limit causing frequent OOM errors in framework-heavy apps. Metaspace uses native memory and grows on demand until MaxMetaspaceSize or physical RAM.',
      d: `<p>Spring, Hibernate, CGLIB generate many classes at runtime — PermGen filled up causing crashes. Metaspace solves this by:</p>
<ol>
<li><strong>Using native (OS) memory</strong> — not the JVM heap, so not limited by -Xmx.</li>
<li><strong>Auto-growing</strong> — when Metaspace fills, JVM triggers GC to unload unused class metadata (classes from dead ClassLoaders).</li>
<li><strong>Per-ClassLoader chunks</strong> — each ClassLoader has its own Metaspace block; entire block freed when ClassLoader is GC'd.</li>
</ol>
<p>Control via: <code>-XX:MaxMetaspaceSize=256m</code>. Without limit, it can grow until OOM (system memory).</p>`
    },
    {
      tags: ['String Objects', 'SCP', 'Heap', 'new String', 'How many'],
      q: 'How many String objects are created: String s = new String("ONE"); String s2 = "ONE";',
      s: 'Up to 2 objects: 1 in SCP ("ONE" literal) and 1 on heap (new String()). If "ONE" already in SCP, just 1 new heap object. s2 reuses existing SCP reference.',
      d: `<pre><code>String s  = new String("ONE"); // 1 new heap object + "ONE" in SCP (if not there)
String s2 = "ONE";             // reuses SCP reference — NO new object

System.out.println(s == s2);       // false — different objects
System.out.println(s.equals(s2));  // true — same content
System.out.println(s.intern() == s2); // true — intern() returns SCP ref</code></pre>
<p>Total: <strong>1 object</strong> if "ONE" was already in SCP (class compiled before), or <strong>2 objects</strong> if first time.</p>`
    },
    {
      tags: ['String.intern()', 'SCP', 'Canonicalization', 'Memory'],
      q: 'What is String.intern()?',
      s: 'Returns the canonical (SCP) representation. If string exists in SCP, returns that reference; otherwise adds it to SCP and returns that reference. Useful for deduplication.',
      d: `<pre><code>String s1 = new String("hello");  // heap object
String s2 = s1.intern();          // returns SCP reference
String s3 = "hello";              // same SCP reference

System.out.println(s2 == s3); // true
System.out.println(s1 == s3); // false</code></pre>
<p><strong>Use case:</strong> Reduce memory when processing millions of equal strings (e.g., parsing large CSVs with repeated values).</p>`
    },
    {
      tags: ['String Immutability', 'concat', 'Output Question', 'Reference'],
      q: 'String h = "unit"; h + "hi"; sout(h) — what is the output and why?',
      s: '"unit". Strings are immutable — h + "hi" creates a new String but the result is NOT assigned back to h. h still refers to "unit".',
      d: `<pre><code>String h = "unit";
h + "hi";               // creates new "unithi" — result discarded!
System.out.println(h);  // "unit" — h unchanged

// To change h:
h = h + "hi";           // now h = "unithi"
// or
h = h.concat("hi");     // same result</code></pre>`
    }
  ],

  immutability: [
    {
      tags: ['Immutable Classes', 'Java Built-in', 'String', 'LocalDate', 'BigInteger'],
      q: 'What classes in Java implement immutability?',
      s: 'String, Integer/Long/Double/Boolean (wrappers), BigInteger, BigDecimal, LocalDate, LocalTime, LocalDateTime, ZonedDateTime, UUID, Optional.',
      d: `<ul>
<li><strong>Wrapper classes:</strong> Integer, Long, Double, Boolean, Character, Byte, Short, Float</li>
<li><strong>String</strong></li>
<li><strong>BigInteger, BigDecimal</strong></li>
<li><strong>java.time:</strong> LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Duration, Period</li>
<li><strong>UUID, Optional</strong></li>
<li><strong>Record classes</strong> (Java 16+) — implicitly immutable</li>
</ul>`
    },
    {
      tags: ['Cloning', 'Shallow Clone', 'Deep Clone', 'Cloneable', 'Copy Constructor'],
      q: 'What is cloning in Java?',
      s: 'Creating a copy of an object. Shallow clone copies primitives + references (Object.clone()). Deep clone copies referenced objects too. Prefer copy constructors over Cloneable.',
      d: `<pre><code>class Student implements Cloneable {
    String name;
    List&lt;String&gt; courses;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Student s = (Student) super.clone(); // shallow
        s.courses = new ArrayList&lt;&gt;(this.courses); // deep copy of list
        return s;
    }
}

// Preferred: copy constructor (avoids Cloneable quirks)
class Student {
    Student(Student other) {
        this.name = other.name;
        this.courses = new ArrayList&lt;&gt;(other.courses);
    }
}</code></pre>`
    },
    {
      tags: ['final Reference', 'Object Mutation', 'final keyword', 'Setter'],
      q: 'final Student s1 = new Student("Sneha", 1); s1.setName("Shubham"); — can we?',
      s: 'YES. final on reference = cannot reassign the variable to point to a different object. The object itself (and its fields) can still be mutated via setters.',
      d: `<pre><code>final Student s1 = new Student("Sneha", 1);
s1.setName("Shubham");   // OK — mutating the object
System.out.println(s1.getName()); // "Shubham"

// s1 = new Student("Other", 2); // COMPILE ERROR — cannot reassign final ref</code></pre>
<p><code>final</code> prevents <strong>reassignment</strong> of the variable — not mutation of the object. For true immutability, the class itself must be immutable.</p>`
    }
  ],

  interfaces: [
    {
      tags: ['Private Methods', 'Interface', 'Java 9', 'Helper Methods'],
      q: 'Can interfaces have private methods? Purpose?',
      s: 'Yes, Java 9+. Private methods in interfaces are helper methods for default/static methods — not accessible by implementing classes or callers.',
      d: `<pre><code>interface Validator {
    default boolean validate(String s) {
        return isNotNull(s) && isNotEmpty(s); // uses private helpers
    }
    private boolean isNotNull(String s)  { return s != null; }
    private static boolean isNotEmpty(String s) { return !s.isEmpty(); }
}
// Purpose: code reuse within the interface without exposing to implementors</code></pre>`
    },
    {
      tags: ['Default Methods', 'Static Methods', 'Java 8', 'Backward Compatibility'],
      q: 'Why were default and static methods introduced in interfaces?',
      s: 'Backward compatibility — add new methods to existing interfaces without breaking all implementing classes. Example: Iterable.forEach() added in Java 8 without breaking existing code.',
      d: `<pre><code>// Before Java 8: adding method to interface = breaking change
// After Java 8: use default method
interface Collection {
    default void forEach(Consumer&lt;?&gt; action) { // won't break existing impls
        for (Object o : this) action.accept(o);
    }
    static &lt;E&gt; List&lt;E&gt; of(E... elements) { ... } // utility on interface
}</code></pre>
<p><strong>Access modifiers:</strong> default methods are implicitly <code>public</code>. Static methods are also <code>public</code> by default. Java 9 allows <code>private</code> static/instance.</p>`
    },
    {
      tags: ['Diamond Problem', 'Two Interfaces', 'Same Method', 'Conflict Resolution'],
      q: 'Two interfaces with same method signature — class implements both, what happens?',
      s: 'Compile error if both have default methods with same signature. Class MUST explicitly override and resolve using InterfaceName.super.method().',
      d: `<pre><code>interface A { default void show() { System.out.println("A"); } }
interface B { default void show() { System.out.println("B"); } }

class C implements A, B {
    @Override
    public void show() {
        A.super.show(); // must explicitly pick one
    }
}
// Without override → COMPILE ERROR</code></pre>`
    },
    {
      tags: ['Functional Interface', 'toString', 'Object Methods', 'SAM'],
      q: 'If a functional interface has a toString() method, is it still a functional interface?',
      s: 'YES. toString(), equals(), hashCode() are Object methods — they don\'t count toward the abstract method count. A @FunctionalInterface needs exactly ONE non-Object abstract method.',
      d: `<pre><code>@FunctionalInterface
interface MyFunc {
    void execute();           // ONE abstract method — qualifies as FI
    String toString();        // Object method — doesn't count
    boolean equals(Object o); // Object method — doesn't count
}
// Valid: MyFunc f = () -> doWork();</code></pre>`
    },
    {
      tags: ['final class', 'Cannot Extend', 'String', 'Immutability', 'Security'],
      q: 'What is a final class? Can it be extended?',
      s: 'A final class cannot be subclassed. Examples: String, Integer, System, Math. Used to prevent inheritance for security, immutability, or performance.',
      d: `<pre><code>final class ImmutableConfig { private final String dbUrl; ... }
// class ExtendedConfig extends ImmutableConfig { } // COMPILE ERROR

// Why final:
// Security — prevent subclass overriding sensitive methods
// Immutability — guarantee no subclass adds mutable state
// Performance — JIT can inline final class method calls</code></pre>`
    }
  ],

  streams: [
    {
      tags: ['Terminated Stream', 'IllegalStateException', 'Reuse', 'Consumed'],
      q: 'Is it possible to invoke a terminated stream in Java?',
      s: 'NO. Once a terminal operation is called, the stream is consumed. Reusing throws IllegalStateException: stream has already been operated upon or closed.',
      d: `<pre><code>Stream&lt;Integer&gt; s = Stream.of(1, 2, 3);
s.forEach(System.out::println); // terminal — stream closed

s.forEach(System.out::println); // THROWS IllegalStateException!
// Solution: recreate the stream each time from the source</code></pre>`
    },
    {
      tags: ['Lazy Evaluation', 'No Terminal Op', 'Intermediate', 'Not Executed'],
      q: 'If you don\'t use a terminal operation, will intermediate operations execute?',
      s: 'NO. Streams are lazy — intermediate operations (filter, map, etc.) are NOT executed until a terminal operation is called.',
      d: `<pre><code>Stream&lt;Integer&gt; s = Stream.of(1, 2, 3)
    .filter(x -&gt; { System.out.println("filter: " + x); return x &gt; 1; });
// Nothing printed yet — no terminal op

s.collect(Collectors.toList()); // NOW filter executes for each element</code></pre>`
    },
    {
      tags: ['Internal Working', 'collect', 'filter', 'map', 'Spliterator'],
      q: 'What is the internal working of collect, filter, map in streams?',
      s: 'Stream builds a pipeline of stages (Spliterator + ReferencePipeline). filter/map are stateless intermediate ops. collect is a terminal op that drives the pipeline via Sink chain.',
      d: `<p>Internally, a Stream consists of:</p>
<ol>
<li><strong>Source</strong> — Spliterator (from Collection, array, etc.)</li>
<li><strong>Intermediate stages</strong> — each creates a new ReferencePipeline (stateless: filter/map; stateful: sorted/distinct)</li>
<li><strong>Terminal op</strong> — calls <code>evaluate()</code> which builds a chain of <code>Sink</code> objects (one per stage) and iterates via Spliterator</li>
</ol>
<table>
<tr><th>Operation</th><th>Functional Interface</th><th>Type</th></tr>
<tr><td>filter</td><td>Predicate&lt;T&gt;</td><td>Intermediate (stateless)</td></tr>
<tr><td>map</td><td>Function&lt;T,R&gt;</td><td>Intermediate (stateless)</td></tr>
<tr><td>sorted</td><td>Comparator&lt;T&gt;</td><td>Intermediate (stateful)</td></tr>
<tr><td>forEach</td><td>Consumer&lt;T&gt;</td><td>Terminal</td></tr>
<tr><td>collect</td><td>Collector&lt;T,A,R&gt;</td><td>Terminal</td></tr>
<tr><td>reduce</td><td>BinaryOperator&lt;T&gt;</td><td>Terminal</td></tr>
</table>`
    },
    {
      tags: ['Streams Immutable', 'Non-mutating', 'Source', 'New Stream'],
      q: 'Are Streams mutable or immutable? Why?',
      s: 'Streams are non-mutating — they don\'t modify the source collection. Each operation returns a new Stream. The source (List, array) is unchanged.',
      d: `<pre><code>List&lt;Integer&gt; list = new ArrayList&lt;&gt;(List.of(1,2,3,4,5));
List&lt;Integer&gt; evens = list.stream()
    .filter(n -&gt; n % 2 == 0)
    .collect(Collectors.toList());

System.out.println(list);  // [1,2,3,4,5] — unchanged!
System.out.println(evens); // [2,4]</code></pre>`
    },
    {
      tags: ['Method Reference', '4 Types', 'Static', 'Instance', 'Constructor'],
      q: 'What is a method reference? What are the 4 types?',
      s: 'Shorthand for lambdas that just call a method. 4 types: Static (Class::staticMethod), Bound instance (obj::method), Unbound instance (Class::method), Constructor (Class::new).',
      d: `<pre><code>// 1. Static method reference
Function&lt;String, Integer&gt; f1 = Integer::parseInt;
// same as: s -> Integer.parseInt(s)

// 2. Bound instance (specific object)
String prefix = "Hello ";
Function&lt;String, String&gt; f2 = prefix::concat;

// 3. Unbound instance (class name)
Function&lt;String, String&gt; f3 = String::toUpperCase;
// same as: s -> s.toUpperCase()

// 4. Constructor reference
Supplier&lt;ArrayList&lt;?&gt;&gt; f4 = ArrayList::new;</code></pre>`
    },
    {
      tags: ['Functional Interface', 'SAM', '@FunctionalInterface', 'Lambda', 'Types'],
      q: 'What is a functional interface? Types? What methods can it have?',
      s: 'Interface with exactly ONE abstract method (SAM). Can have default, static, and Object methods. Annotated with @FunctionalInterface. Used as lambda targets.',
      d: `<pre><code>@FunctionalInterface
interface MyFI {
    void execute();              // ONE abstract method — required
    default void log() { }       // OK — default method
    static MyFI noOp() { return () -&gt; {}; } // OK — static method
    String toString();           // OK — Object method, doesn't count
}

// Types:
// Consumer&lt;T&gt;, Supplier&lt;T&gt;, Predicate&lt;T&gt;, Function&lt;T,R&gt;
// BiFunction, UnaryOperator, BinaryOperator, Comparator, Runnable, Callable</code></pre>`
    },
    {
      tags: ['Predicate', 'Supplier', 'Consumer', 'Difference', 'Functional Interface'],
      q: 'Difference between Predicate, Supplier, and Consumer',
      s: 'Predicate<T>: takes T, returns boolean (test/filter). Supplier<T>: takes nothing, returns T (factory/lazy). Consumer<T>: takes T, returns void (action/side-effect).',
      d: `<pre><code>// Predicate — condition check
Predicate&lt;String&gt; notEmpty = s -&gt; !s.isEmpty();
list.stream().filter(notEmpty);

// Supplier — produces value lazily
Supplier&lt;LocalDate&gt; today = LocalDate::now;
Optional.ofNullable(null).orElseGet(today);

// Consumer — side effect, no return
Consumer&lt;String&gt; print = System.out::println;
list.forEach(print);</code></pre>`
    },
    {
      tags: ['Lambda', 'Anonymous Inner Class', 'Nested Class', 'Synthetic'],
      q: 'What type of nested class does a Lambda use?',
      s: 'Lambda does NOT create an anonymous inner class. The JVM uses invokedynamic (Java 7+) with LambdaMetafactory to generate a synthetic functional interface implementation at runtime — more efficient than anonymous classes.',
      d: `<pre><code>// Anonymous inner class (old way) — creates a new .class file
Runnable r1 = new Runnable() {
    @Override public void run() { System.out.println("hi"); }
};
// Generates: ClassName$1.class on disk

// Lambda (Java 8+) — NO separate class file
Runnable r2 = () -&gt; System.out.println("hi");
// Uses invokedynamic → LambdaMetafactory generates impl at runtime

// Lambda captures effectively-final variables (not fields of new object)
// This makes lambdas lighter than anonymous inner classes</code></pre>`
    },
    {
      tags: ['Comparator', 'Functional Interface', 'Existing', 'compare'],
      q: 'Can an existing functional interface implement a Comparator?',
      s: 'Yes. Comparator<T> is itself a functional interface (has one abstract method compare()). It can be implemented via lambda. It also has many default methods (reversed, thenComparing, etc.).',
      d: `<pre><code>// Comparator IS a functional interface
@FunctionalInterface
public interface Comparator&lt;T&gt; {
    int compare(T o1, T o2); // single abstract method
    // + many default methods: reversed(), thenComparing(), etc.
}

// Use as lambda
Comparator&lt;String&gt; byLength = (a, b) -&gt; a.length() - b.length();
// or
Comparator&lt;String&gt; byLength = Comparator.comparingInt(String::length);</code></pre>`
    }
  ],

  collections: [
    {
      tags: ['TREEIFY_THRESHOLD', 'Red-Black Tree', 'HashMap', '8 nodes', 'Java 8'],
      q: 'When does HashMap convert linked list to Red-Black Tree?',
      s: 'When a single bucket\'s chain reaches TREEIFY_THRESHOLD=8 AND total capacity >= MIN_TREEIFY_CAPACITY=64. Below 64, it resizes instead.',
      d: `<p>This was added in Java 8 to prevent O(n) worst-case lookup when many keys collide (hash flooding attack). Red-Black Tree gives O(log n) within a bucket.</p>
<p>Reverse (UNTREEIFY_THRESHOLD=6): when entries drop below 6, converts back to linked list.</p>
<pre><code>static final int TREEIFY_THRESHOLD     = 8;
static final int UNTREEIFY_THRESHOLD   = 6;
static final int MIN_TREEIFY_CAPACITY  = 64;</code></pre>`
    },
    {
      tags: ['Same Hash Code', 'Collision', 'equals()', 'Chaining', 'Bucket'],
      q: 'If two keys have the same hash code, how does HashMap store them?',
      s: 'They go into the same bucket. HashMap then calls equals() to distinguish them. If equals() differs → both stored as nodes in the chain. If equals() same → value replaced.',
      d: `<pre><code>// Two different keys, same hashCode → stored in same bucket as chain
map.put("Aa", 1); // hashCode = 2112
map.put("BB", 2); // hashCode = 2112 (same!)
// Both stored: bucket 2112 → Node("Aa",1) → Node("BB",2)

// Same key object → value replaced
map.put("Aa", 99); // replaces value: bucket 2112 → Node("Aa",99) → Node("BB",2)</code></pre>`
    },
    {
      tags: ['Initial Capacity', 'Load Factor', 'HashMap', '16', '0.75'],
      q: 'What is the initial capacity and load factor of HashMap?',
      s: 'Default initial capacity = 16 (power of 2). Default load factor = 0.75. Threshold = 16 × 0.75 = 12. When size > 12, resize to 32.',
      d: `<pre><code>HashMap&lt;K,V&gt; map = new HashMap&lt;&gt;();         // capacity=16, LF=0.75
HashMap&lt;K,V&gt; map = new HashMap&lt;&gt;(32);       // capacity=32
HashMap&lt;K,V&gt; map = new HashMap&lt;&gt;(32, 0.5f); // capacity=32, LF=0.5

// Threshold = capacity × loadFactor = 16 × 0.75 = 12
// When 13th entry added → resize to 32, rehash all entries</code></pre>
<p>Lower load factor → fewer collisions, more memory. Higher → more collisions, less memory. 0.75 is the optimal time-space tradeoff.</p>`
    },
    {
      tags: ['HashSet', 'Time Complexity', 'O(1)', 'O(n)', 'Best vs Worst'],
      q: 'Time complexity of add and search in HashSet (best and worst case)',
      s: 'Best/average: O(1) for add and contains (backed by HashMap). Worst case: O(n) if all keys hash to same bucket (all collision chain). Java 8+: O(log n) worst case (tree).',
      d: `<table>
<tr><th>Operation</th><th>Best/Avg Case</th><th>Worst (Java 7)</th><th>Worst (Java 8+)</th></tr>
<tr><td>add</td><td>O(1)</td><td>O(n)</td><td>O(log n)</td></tr>
<tr><td>contains</td><td>O(1)</td><td>O(n)</td><td>O(log n)</td></tr>
<tr><td>remove</td><td>O(1)</td><td>O(n)</td><td>O(log n)</td></tr>
</table>`
    },
    {
      tags: ['List vs Set', 'Duplicates', 'Order', 'Use Case'],
      q: 'When to use List and when to use Set?',
      s: 'List: when order matters or duplicates are allowed (user orders, sequence). Set: when uniqueness required and order less important (unique tags, visited URLs).',
      d: `<table>
<tr><th>Feature</th><th>List</th><th>Set</th></tr>
<tr><td>Duplicates</td><td>Allowed</td><td>Not allowed</td></tr>
<tr><td>Order</td><td>Insertion order preserved</td><td>Depends (HashSet=none, LinkedHashSet=insertion, TreeSet=sorted)</td></tr>
<tr><td>Index access</td><td>Yes (get(i))</td><td>No</td></tr>
<tr><td>Use case</td><td>Shopping cart items, pagination results</td><td>Unique tags, online users, word dictionary</td></tr>
</table>`
    },
    {
      tags: ['ArrayList', 'Java 7 vs Java 8', 'Internal', 'Dynamic Array', 'Growth'],
      q: 'Internal implementation of ArrayList. Java 7 vs Java 8 difference.',
      s: 'Backed by Object[]. Java 7: starts with capacity 10. Java 8: starts with empty array {}, grows to 10 on first add. Growth = oldCapacity + (oldCapacity >> 1) = 1.5x.',
      d: `<pre><code>// Java 7: new ArrayList() → Object[10]
// Java 8: new ArrayList() → Object[0], lazy init on first add()

// Growth when full (Java 7 & 8):
int newCapacity = oldCapacity + (oldCapacity >> 1); // ~1.5x

// Example: [10] → [15] → [22] → [33]...

// Arrays.copyOf(elementData, newCapacity) used to expand</code></pre>
<p><strong>Java 8 optimization:</strong> Empty ArrayList instances share a static empty array → no memory wasted for ArrayList instances that are never populated.</p>`
    },
    {
      tags: ['LinkedHashMap', 'Insertion Order', 'Synchronized', 'Collections.synchronized'],
      q: 'Difference between HashMap and LinkedHashMap. Is LinkedHashMap synchronized?',
      s: 'LinkedHashMap maintains insertion order (or access order). Not synchronized. Make synchronized via Collections.synchronizedMap().',
      d: `<pre><code>// LinkedHashMap — maintains insertion order
LinkedHashMap&lt;String, Integer&gt; lhm = new LinkedHashMap&lt;&gt;();
lhm.put("c", 3); lhm.put("a", 1); lhm.put("b", 2);
System.out.println(lhm); // {c=3, a=1, b=2} — insertion order

// Access-order LinkedHashMap (for LRU cache)
LinkedHashMap&lt;Integer, String&gt; lru = new LinkedHashMap&lt;&gt;(16, 0.75f, true);

// Make synchronized:
Map&lt;K,V&gt; syncMap = Collections.synchronizedMap(new LinkedHashMap&lt;&gt;());</code></pre>`
    },
    {
      tags: ['TreeMap', 'null key', 'NullPointerException', 'Comparator', 'TreeSet'],
      q: 'Can we store null as a key in a TreeMap? Custom Comparator for null.',
      s: 'No — TreeMap throws NullPointerException when null key added (uses compareTo/compare which fails on null). Solution: custom Comparator that handles null.',
      d: `<pre><code>// Standard TreeMap — NPE on null key
TreeMap&lt;String,Integer&gt; map = new TreeMap&lt;&gt;();
map.put(null, 1); // NullPointerException!

// Custom Comparator that handles null (nulls first)
TreeMap&lt;String,Integer&gt; safeMap = new TreeMap&lt;&gt;(
    Comparator.nullsFirst(Comparator.naturalOrder())
);
safeMap.put(null, 1); // OK
safeMap.put("a", 2);
System.out.println(safeMap); // {null=1, a=2}</code></pre>`
    },
    {
      tags: ['Collection Hierarchy', 'Map', 'Iterable', 'Different Root'],
      q: 'Why doesn\'t the Collection interface extend the Map interface?',
      s: 'Collection represents single elements; Map represents key-value pairs — fundamentally different data models. Forcing Map to extend Collection would require inconsistent method implementations.',
      d: `<p>Collection operates on individual elements: <code>add(E)</code>, <code>remove(Object)</code>, <code>size()</code>. Map operates on key-value pairs: <code>put(K,V)</code>, <code>get(K)</code>. Mixing them would violate the interface segregation principle.</p>
<pre><code>Iterable&lt;T&gt;
  └── Collection&lt;E&gt;
        ├── List&lt;E&gt; → ArrayList, LinkedList, Vector
        ├── Set&lt;E&gt;  → HashSet, LinkedHashSet, TreeSet
        └── Queue&lt;E&gt;→ PriorityQueue, ArrayDeque

Map&lt;K,V&gt;  (separate hierarchy)
  ├── HashMap, LinkedHashMap, TreeMap
  └── ConcurrentHashMap</code></pre>`
    },
    {
      tags: ['PriorityQueue', 'Min-Heap', 'Internal', 'Natural Order'],
      q: 'How does Priority Queue work internally?',
      s: 'PriorityQueue is backed by a min-heap (binary heap array). poll() returns the smallest element. Heap property: parent ≤ children. Offer/poll: O(log n). peek: O(1).',
      d: `<pre><code>PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;&gt;(); // min-heap
pq.offer(5); pq.offer(1); pq.offer(3);
System.out.println(pq.poll()); // 1 (smallest)
System.out.println(pq.poll()); // 3

// Max-heap:
PriorityQueue&lt;Integer&gt; maxPQ = new PriorityQueue&lt;&gt;(Comparator.reverseOrder());

// Internally: Object[] queue array, size field
// offer: add at end, siftUp (bubble up)
// poll: remove root, move last to root, siftDown (bubble down)</code></pre>`
    },
    {
      tags: ['WeakHashMap', 'GC', 'Weak Reference', 'Memory Leak Prevention'],
      q: 'WeakHashMap vs HashMap — what happens to entries after GC?',
      s: 'WeakHashMap holds weak references to keys. When a key has no other strong references, GC can collect it and the entry is automatically removed. Used for caches.',
      d: `<pre><code>WeakHashMap&lt;Object, String&gt; cache = new WeakHashMap&lt;&gt;();
Object key = new Object();
cache.put(key, "value");
System.out.println(cache.size()); // 1

key = null; // remove strong reference
System.gc(); // hint GC to run
System.out.println(cache.size()); // 0 — entry auto-removed!</code></pre>
<p>Contrast with HashMap: <code>map.put(key, val)</code> keeps a strong reference → key is never GC'd → memory leak if key objects accumulate.</p>`
    },
    {
      tags: ['Mutable Key', 'HashMap', 'hashCode Changes', 'Lost Entry'],
      q: 'What happens if you use a mutable object as a HashMap key?',
      s: 'The entry becomes unreachable. If you mutate the key after put(), its hashCode changes, so the entry is now in the wrong bucket. get() returns null for the same object.',
      d: `<pre><code>List&lt;Integer&gt; key = new ArrayList&lt;&gt;(List.of(1, 2));
Map&lt;List&lt;Integer&gt;, String&gt; map = new HashMap&lt;&gt;();
map.put(key, "hello");

key.add(3); // MUTATE the key!
System.out.println(map.get(key)); // null — wrong bucket now!
// The entry is lost — map.containsKey(key) = false</code></pre>`
    },
    {
      tags: ['TreeSet', 'Employee', 'ClassCastException', 'Comparable', 'Natural Order'],
      q: 'Store Employee objects in TreeSet without Comparable/Comparator — what happens?',
      s: 'ClassCastException at runtime on first add. TreeSet requires Comparable or external Comparator to sort elements. Employee without compareTo = cannot be sorted.',
      d: `<pre><code>class Employee { String name; int id; }
TreeSet&lt;Employee&gt; set = new TreeSet&lt;&gt;();
set.add(new Employee()); // ClassCastException!
// java.lang.ClassCastException: Employee cannot be cast to java.lang.Comparable

// Fix 1: implement Comparable
class Employee implements Comparable&lt;Employee&gt; {
    @Override public int compareTo(Employee o) { return this.id - o.id; }
}

// Fix 2: provide Comparator
TreeSet&lt;Employee&gt; set = new TreeSet&lt;&gt;(Comparator.comparingInt(e -&gt; e.id));</code></pre>`
    },
    {
      tags: ['ArrayList', 'remove(int)', 'remove(Object)', 'Overloading', 'Autoboxing'],
      q: 'Difference between remove(int index) and remove(Object o) in ArrayList',
      s: 'remove(int index): removes element AT that index. remove(Object o): removes FIRST occurrence of the object. Autoboxing trap: remove(5) calls remove(int), not remove(Integer).',
      d: `<pre><code>List&lt;Integer&gt; list = new ArrayList&lt;&gt;(List.of(10, 20, 30, 40, 50));

list.remove(2);                  // removes index 2 → removes 30
                                  // list = [10, 20, 40, 50]

list.remove(Integer.valueOf(20)); // removes object 20
                                  // list = [10, 40, 50]

// Trap:
list.remove(40); // remove(int 40) → IndexOutOfBoundsException!
list.remove(Integer.valueOf(40)); // correct — removes value 40</code></pre>`
    },
    {
      tags: ['== vs equals', 'Reference', 'Value Equality', 'Override'],
      q: 'What is == vs equals() difference?',
      s: '==: compares references (memory addresses) for objects; compares values for primitives. equals(): compares logical content — should be overridden for custom equality.',
      d: `<pre><code>// Primitives: == compares values
int a = 5, b = 5;
System.out.println(a == b); // true

// Objects: == compares references
String s1 = new String("hi");
String s2 = new String("hi");
System.out.println(s1 == s2);     // false — different objects
System.out.println(s1.equals(s2)); // true — same content

// String literals use SCP — == can be true
String s3 = "hi", s4 = "hi";
System.out.println(s3 == s4); // true — same SCP reference</code></pre>`
    },
    {
      tags: ['Arrays class', 'sort', 'binarySearch', 'copyOf', 'fill', 'asList'],
      q: 'What is the Arrays class and its methods?',
      s: 'java.util.Arrays is a utility class for array operations: sort(), binarySearch(), copyOf(), fill(), equals(), asList(), stream(), parallelSort().',
      d: `<pre><code>int[] arr = {5, 3, 1, 4, 2};
Arrays.sort(arr);                         // [1, 2, 3, 4, 5]
Arrays.binarySearch(arr, 3);              // returns index of 3
int[] copy = Arrays.copyOf(arr, 3);       // [1, 2, 3]
int[] range = Arrays.copyOfRange(arr,1,4);// [2, 3, 4]
Arrays.fill(arr, 0);                      // [0, 0, 0, 0, 0]
System.out.println(Arrays.toString(arr)); // "[0, 0, 0, 0, 0]"
List&lt;String&gt; list = Arrays.asList("a","b","c"); // fixed-size list
Arrays.stream(arr).sum(); // 0</code></pre>`
    },
    {
      tags: ['ArrayDeque', 'Deque', 'Stack', 'Queue', 'Methods'],
      q: 'What is ArrayDeque and its methods?',
      s: 'ArrayDeque is a resizable array-backed double-ended queue. Faster than Stack for stack ops, faster than LinkedList for queue ops. No null elements.',
      d: `<pre><code>Deque&lt;Integer&gt; deque = new ArrayDeque&lt;&gt;();
// Stack operations:
deque.push(1); deque.push(2); deque.push(3);
deque.pop();   // 3 (LIFO)
deque.peek();  // 2 (look without remove)

// Queue operations:
deque.offer(10); deque.offer(20);
deque.poll();    // 10 (FIFO)

// Deque operations:
deque.offerFirst(0); // add to front
deque.offerLast(99); // add to back
deque.peekFirst();   // look front
deque.peekLast();    // look back</code></pre>`
    },
    {
      tags: ['Vector', 'ArrayList', 'Synchronized', 'Legacy', 'Performance'],
      q: 'Vector vs ArrayList',
      s: 'Vector: legacy, synchronized (every method), slower. ArrayList: not synchronized, faster, preferred. Use CopyOnWriteArrayList or Collections.synchronizedList for thread safety.',
      d: `<table>
<tr><th>Feature</th><th>Vector</th><th>ArrayList</th></tr>
<tr><td>Thread-safe</td><td>Yes (every method synchronized)</td><td>No</td></tr>
<tr><td>Performance</td><td>Slower (lock overhead)</td><td>Faster</td></tr>
<tr><td>Growth</td><td>Doubles (100%)</td><td>1.5x (50%)</td></tr>
<tr><td>Legacy</td><td>Yes (Java 1.0)</td><td>No (Java 1.2)</td></tr>
</table>`
    }
  ],

  multithreading: [
    {
      tags: ['Class Lock', 'Object Lock', 'synchronized', 'static', 'Instance'],
      q: 'Difference between class-level lock and object-level lock',
      s: 'Object-level: synchronized on instance — each object has its own lock. Class-level: synchronized on Class object — shared across ALL instances of the class.',
      d: `<pre><code>class Counter {
    // Object-level lock — one lock per Counter instance
    synchronized void increment() { count++; }
    // equivalent: synchronized(this) { count++; }

    // Class-level lock — one lock for ALL Counter instances
    static synchronized void reset() { count = 0; }
    // equivalent: synchronized(Counter.class) { count = 0; }
}

// Two Counter instances c1 and c2:
// c1.increment() and c2.increment() can run CONCURRENTLY (different locks)
// Counter.reset() blocks ALL instances (class lock)</code></pre>`
    },
    {
      tags: ['Thread Pool', 'ExecutorService', 'Executors', 'newFixedThreadPool', 'ThreadPoolExecutor'],
      q: 'How do you create a thread pool in Java?',
      s: 'Via Executors factory: newFixedThreadPool(n), newCachedThreadPool(), newSingleThreadExecutor(), newScheduledThreadPool(n). Or directly: new ThreadPoolExecutor(core, max, keepAlive, unit, queue).',
      d: `<pre><code>// Fixed pool — n threads always alive
ExecutorService pool = Executors.newFixedThreadPool(10);

// Cached pool — creates threads as needed, reuses idle ones
ExecutorService cache = Executors.newCachedThreadPool();

// Production — custom ThreadPoolExecutor
ThreadPoolExecutor exec = new ThreadPoolExecutor(
    5,               // corePoolSize
    20,              // maximumPoolSize
    60, TimeUnit.SECONDS,   // keepAlive for idle threads
    new LinkedBlockingQueue&lt;&gt;(100), // task queue
    new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy
);

pool.submit(() -&gt; doWork());
pool.shutdown(); // wait for completion
pool.shutdownNow(); // interrupt running tasks</code></pre>`
    },
    {
      tags: ['Create Thread', 'Thread class', 'Runnable', 'Callable', 'Lambda'],
      q: 'What are the ways to create a thread?',
      s: '1) Extend Thread class. 2) Implement Runnable. 3) Implement Callable (returns value). 4) Lambda (Java 8). 5) ExecutorService.submit(). Runnable/Lambda preferred.',
      d: `<pre><code>// 1. Extend Thread
class MyThread extends Thread { public void run() { ... } }
new MyThread().start();

// 2. Implement Runnable (preferred)
new Thread(() -&gt; doWork()).start();

// 3. Callable (with return value)
Future&lt;Integer&gt; f = executor.submit(() -&gt; compute());

// 4. ExecutorService (best practice)
ExecutorService es = Executors.newFixedThreadPool(4);
es.execute(() -&gt; task1()); // fire-and-forget
es.submit(() -&gt; task2());  // with Future</code></pre>`
    },
    {
      tags: ['Core Size', 'Max Pool Size', 'Thread Pool', 'Queue', 'When Created'],
      q: 'Difference between core size and maximum pool size in thread pool',
      s: 'Core size: threads kept alive even when idle. Max size: ceiling when queue is full. New threads created only when queue full AND current threads < max. Excess idle threads die after keepAlive.',
      d: `<pre><code>// ThreadPoolExecutor behavior:
// 1. Tasks arrive → use core threads (coreSize=5)
// 2. Core threads busy → queue tasks (queue capacity=100)
// 3. Queue full → create new threads up to maxSize=20
// 4. maxSize reached + queue full → reject (rejection policy)
// 5. Idle threads > coreSize → terminate after keepAlive

ThreadPoolExecutor exec = new ThreadPoolExecutor(5, 20,
    60L, TimeUnit.SECONDS, new ArrayBlockingQueue&lt;&gt;(100));</code></pre>`
    },
    {
      tags: ['Multithreading', 'Multitasking', 'Process', 'Thread', 'Concurrency'],
      q: 'Multithreading vs multitasking',
      s: 'Multitasking: OS runs multiple processes concurrently (process-level). Multithreading: single process runs multiple threads concurrently (thread-level). Threads share memory; processes don\'t.',
      d: `<table>
<tr><th>Feature</th><th>Multitasking</th><th>Multithreading</th></tr>
<tr><td>Level</td><td>Process (OS-level)</td><td>Thread (within one process)</td></tr>
<tr><td>Memory</td><td>Separate memory per process</td><td>Shared heap memory</td></tr>
<tr><td>Context switch</td><td>Expensive</td><td>Cheaper (same process)</td></tr>
<tr><td>Communication</td><td>IPC (sockets, pipes)</td><td>Shared variables (need sync)</td></tr>
</table>`
    },
    {
      tags: ['JMM', 'Java Memory Model', 'JVM Storage', '5 Components', 'Heap Stack'],
      q: 'Java Memory Model (JMM) — list all 5 components of JVM storage',
      s: 'Heap (objects), Stack (local vars per thread), Method Area/Metaspace (class metadata), PC Register (current instruction per thread), Native Method Stack (native calls).',
      d: `<table>
<tr><th>Component</th><th>Per Thread?</th><th>Contents</th></tr>
<tr><td>Heap</td><td>Shared</td><td>Objects, arrays, String pool</td></tr>
<tr><td>Stack</td><td>Per thread</td><td>Local variables, method frames, references</td></tr>
<tr><td>Method Area (Metaspace)</td><td>Shared</td><td>Class metadata, static fields, bytecode</td></tr>
<tr><td>PC Register</td><td>Per thread</td><td>Address of currently executing instruction</td></tr>
<tr><td>Native Method Stack</td><td>Per thread</td><td>Native (C/C++) method calls</td></tr>
</table>`
    },
    {
      tags: ['Hashtable', 'Synchronized', 'Multiple Threads', 'Legacy'],
      q: 'Does Hashtable allow multiple threads at the same time?',
      s: 'No. Every method in Hashtable is synchronized — only ONE thread can access it at a time. This makes it thread-safe but slow. Prefer ConcurrentHashMap for multi-threaded use.',
      d: `<table>
<tr><th>Feature</th><th>Hashtable</th><th>ConcurrentHashMap</th></tr>
<tr><td>Synchronization</td><td>Whole object lock</td><td>Per-bucket lock (Java 8: CAS)</td></tr>
<tr><td>Concurrency</td><td>1 thread at a time</td><td>Multiple threads simultaneously</td></tr>
<tr><td>Null key/value</td><td>Not allowed</td><td>Not allowed</td></tr>
<tr><td>Performance</td><td>Low</td><td>High</td></tr>
</table>`
    },
    {
      tags: ['Synchronization', 'Collections', 'synchronizedList', 'CopyOnWriteArrayList'],
      q: 'How do you achieve synchronization in Collections?',
      s: 'Collections.synchronizedList/Map/Set wraps any collection. CopyOnWriteArrayList for read-heavy. ConcurrentHashMap for maps. Vector/Hashtable (legacy, avoid).',
      d: `<pre><code>// 1. Collections.synchronized* wrappers
List&lt;String&gt; syncList = Collections.synchronizedList(new ArrayList&lt;&gt;());
Map&lt;K,V&gt; syncMap   = Collections.synchronizedMap(new HashMap&lt;&gt;());
Set&lt;E&gt; syncSet     = Collections.synchronizedSet(new HashSet&lt;&gt;());

// Must manually synchronize on iterator!
synchronized(syncList) {
    for (String s : syncList) { ... }
}

// 2. Concurrent collections (better)
List&lt;String&gt; cowList = new CopyOnWriteArrayList&lt;&gt;(); // read-heavy
Map&lt;K,V&gt; chm = new ConcurrentHashMap&lt;&gt;();             // balanced</code></pre>`
    }
  ],

  java8: [
    {
      tags: ['CompletableFuture', 'Async', 'thenApply', 'exceptionally', 'allOf'],
      q: 'Can you elaborate on CompletableFuture?',
      s: 'CompletableFuture is a Future that can be chained, combined, and completed manually. supplyAsync, thenApply (transform), thenAccept (consume), exceptionally (error), allOf/anyOf.',
      d: `<pre><code>// Basic async task
CompletableFuture&lt;String&gt; cf = CompletableFuture
    .supplyAsync(() -&gt; fetchData())        // runs in ForkJoinPool
    .thenApply(data -&gt; process(data))      // transform result
    .thenApply(String::toUpperCase)
    .exceptionally(ex -&gt; "fallback");      // error handling

// Combining two futures
CompletableFuture&lt;User&gt;  userFuture  = fetchUser(id);
CompletableFuture&lt;Order&gt; orderFuture = fetchOrders(id);

CompletableFuture.allOf(userFuture, orderFuture)
    .thenRun(() -&gt; System.out.println("Both done"))
    .join(); // block until complete</code></pre>`
    },
    {
      tags: ['Callable', 'Future', 'get()', 'isDone', 'Difference'],
      q: 'Difference between Callable and Future',
      s: 'Callable: defines a task that returns a value (call()). Future: represents the RESULT of an async computation — get(), isDone(), cancel(). ExecutorService.submit(Callable) returns Future.',
      d: `<pre><code>Callable&lt;Integer&gt; task = () -&gt; expensiveCompute();

ExecutorService es = Executors.newSingleThreadExecutor();
Future&lt;Integer&gt; future = es.submit(task);

// Check without blocking
if (future.isDone()) {
    Integer result = future.get(); // get result (blocks if not done)
}

// Cancel
future.cancel(true); // interrupt if running</code></pre>`
    },
    {
      tags: ['finalize()', 'Deprecated', 'GC', 'Resource Cleanup', 'Java 9'],
      q: 'What is finalize()? Why was it deprecated?',
      s: 'Object method called by GC before collecting. Deprecated Java 9 — unpredictable (no guarantee when or IF it runs), can delay GC, revive objects. Use try-with-resources or Cleaner API instead.',
      d: `<pre><code>// Before Java 9 (bad pattern):
@Override
protected void finalize() throws Throwable {
    try { closeResource(); }
    finally { super.finalize(); }
}

// Modern replacement: Cleaner API (Java 9+)
Cleaner cleaner = Cleaner.create();
Cleaner.Cleanable cleanable = cleaner.register(object, () -&gt; closeResource());

// Best: try-with-resources for AutoCloseable
try (Connection c = getConnection()) { ... } // auto-closed</code></pre>`
    },
    {
      tags: ['Inner Classes', 'Static Nested', 'Anonymous', 'Local', 'Types'],
      q: 'Types of nested classes in Java',
      s: 'Inner class (non-static member), Static nested class, Local class (inside method), Anonymous class (inline implementation). Each has different access rules and lifecycle.',
      d: `<pre><code>class Outer {
    // 1. Inner class — has access to Outer's instance members
    class Inner { void show() { System.out.println(Outer.this.x); } }

    // 2. Static nested class — no access to outer instance
    static class StaticNested { void show() { } }

    void method() {
        // 3. Local class — defined inside a method
        class Local { void greet() { } }

        // 4. Anonymous class — inline implementation
        Runnable r = new Runnable() {
            @Override public void run() { System.out.println("running"); }
        };
    }
}
// Outer class cannot be static (only nested classes can be static)</code></pre>`
    },
    {
      tags: ['Lambda', 'Anonymous Inner Class', 'Difference', 'Performance', 'this'],
      q: 'Difference between lambdas and anonymous inner classes',
      s: 'Lambda: no separate .class file, this refers to enclosing class, only for functional interfaces. Anonymous inner class: new .class file, this = the anonymous class, can extend classes.',
      d: `<table>
<tr><th>Feature</th><th>Lambda</th><th>Anonymous Inner Class</th></tr>
<tr><td>Class file</td><td>No (invokedynamic)</td><td>Yes (Outer$1.class)</td></tr>
<tr><td>"this"</td><td>Enclosing class</td><td>The anonymous class itself</td></tr>
<tr><td>State</td><td>Stateless (effectively final)</td><td>Can have fields</td></tr>
<tr><td>Target</td><td>Functional interfaces only</td><td>Any interface or class</td></tr>
<tr><td>Performance</td><td>Faster (JVM optimizes)</td><td>Slower (object creation)</td></tr>
</table>`
    },
    {
      tags: ['Stateful', 'Stateless', 'Bean', 'Thread Safety', 'REST'],
      q: 'What is stateful vs stateless?',
      s: 'Stateless: no per-client memory between calls (REST APIs, Spring @Service singleton). Stateful: remembers client state across calls (HTTP sessions, stateful beans, EJB). Stateless is more scalable.',
      d: `<ul>
<li><strong>Stateless:</strong> Every request is self-contained. No server-side session. REST APIs, Spring singletons. Easily scaled horizontally.</li>
<li><strong>Stateful:</strong> Server remembers client state between calls. HTTP sessions, shopping carts, conversational flows. Requires sticky sessions for horizontal scaling.</li>
</ul>
<p>Spring beans are <strong>singleton + stateless</strong> by default — don't store user-specific data in fields!</p>`
    },
    {
      tags: ['Lazy Initialization', '@Lazy', 'Spring', 'On-demand', 'Performance'],
      q: 'What is Lazy Initialization? How to create a lazily initialized bean using @Lazy?',
      s: 'Lazy initialization defers object/bean creation until first use. Reduces startup time. Spring singletons are eager by default; @Lazy defers until first @Autowired access.',
      d: `<pre><code>// Lazy singleton bean — created on first use, not at startup
@Component
@Lazy
class HeavyService {
    HeavyService() { System.out.println("Created!"); }
}

@Service
class UserService {
    @Lazy @Autowired HeavyService heavy; // injected as proxy

    void process() {
        heavy.doWork(); // HeavyService created HERE on first call
    }
}

// Enable globally for all beans:
spring.main.lazy-initialization=true</code></pre>`
    },
    {
      tags: ['Internationalization', 'i18n', 'Locale', 'ResourceBundle', 'MessageSource'],
      q: 'What is internationalization in Java?',
      s: 'i18n: designing apps for multiple languages/regions. Uses Locale, ResourceBundle (properties files per language). Spring: MessageSource + messages_en.properties, messages_fr.properties.',
      d: `<pre><code>// Resource bundles:
// messages_en.properties: greeting=Hello, {0}!
// messages_fr.properties: greeting=Bonjour, {0}!

// Java core:
ResourceBundle rb = ResourceBundle.getBundle("messages", Locale.FRENCH);
String msg = rb.getString("greeting"); // "Bonjour, {0}!"

// Spring Boot:
@Autowired MessageSource messageSource;
String msg = messageSource.getMessage("greeting",
    new Object[]{"Alice"}, Locale.FRENCH); // "Bonjour, Alice!"</code></pre>`
    }
  ],

  exceptions: [
    {
      tags: ['Checked', 'Unchecked', 'Separation', 'Compile-time', 'RuntimeException'],
      q: 'Why does Java separate checked and unchecked exceptions?',
      s: 'Checked: recoverable errors (IO, SQL) — compiler forces handling. Unchecked: programming mistakes (NPE, AIOBE) — handling everywhere would be noisy. Separation guides developers on what to handle.',
      d: `<ol>
<li><strong>Checked exceptions</strong> represent recoverable conditions (file not found, network timeout) — the compiler enforces you to handle or declare them.</li>
<li><strong>Unchecked (RuntimeException)</strong> represent programming bugs (null pointer, array index) — could occur anywhere, making mandatory handling impractical.</li>
</ol>
<pre><code>// Checked — you MUST handle
try { Files.readString(path); } catch (IOException e) { ... }

// Unchecked — optional handling (usually indicates a bug)
String s = null;
s.length(); // NullPointerException — fix the code, don't just catch</code></pre>`
    },
    {
      tags: ['Custom Checked Exception', 'extends Exception', 'User-defined'],
      q: 'Can we create our own custom checked exception?',
      s: 'Yes. Extend Exception (checked) or RuntimeException (unchecked). Checked custom exceptions force callers to handle them.',
      d: `<pre><code>// Custom checked exception
public class InsufficientFundsException extends Exception {
    private final double amount;
    public InsufficientFundsException(double amount) {
        super("Insufficient funds: need " + amount + " more");
        this.amount = amount;
    }
    public double getAmount() { return amount; }
}

// Usage — caller MUST handle or declare
public void withdraw(double amt) throws InsufficientFundsException {
    if (amt &gt; balance) throw new InsufficientFundsException(amt - balance);
    balance -= amt;
}</code></pre>`
    },
    {
      tags: ['finally', 'Exception Override', 'throw in finally', 'Suppressed'],
      q: 'Can a finally block override an exception? What if finally throws?',
      s: 'YES. If finally has a return or throws, it suppresses the original try exception. The original exception is lost unless using try-with-resources (suppressed exceptions preserved).',
      d: `<pre><code>// finally RETURN suppresses exception
try { throw new RuntimeException("original"); }
finally { return; } // exception silently swallowed!

// finally THROW replaces original exception
try { throw new RuntimeException("original"); }
finally { throw new RuntimeException("finally"); } // "original" is lost!

// try-with-resources preserves both:
try (AutoCloseable r = ...) { throw new Exception("primary"); }
// close() throws → becomes "suppressed exception"
// primary.getSuppressed()[0] → the close() exception</code></pre>`
    },
    {
      tags: ['Exception Propagation', 'Call Stack', 'Uncaught', 'Propagate Up'],
      q: 'How does exception propagation work in a call stack?',
      s: 'Uncaught exception propagates up the call stack until caught or reaches main() — then JVM prints stack trace and terminates. Checked exceptions must be declared with throws to propagate.',
      d: `<pre><code>void methodC() { throw new RuntimeException("error"); }
void methodB() { methodC(); } // propagates — not caught
void methodA() { methodB(); } // propagates — not caught

// main
public static void main(String[] args) {
    try { methodA(); }
    catch (RuntimeException e) {
        System.out.println("Caught at main: " + e.getMessage());
    }
}
// Stack trace: main → methodA → methodB → methodC → exception</code></pre>`
    },
    {
      tags: ['finally vs finalize', 'Keyword', 'Method', 'Block'],
      q: 'Difference between finally and finalize',
      s: 'finally: a try-catch block that always executes (resource cleanup). finalize(): a method in Object called by GC before collecting the object (deprecated Java 9).',
      d: `<table>
<tr><th>Feature</th><th>finally</th><th>finalize()</th></tr>
<tr><td>Type</td><td>Block (keyword)</td><td>Method in java.lang.Object</td></tr>
<tr><td>When called</td><td>After try/catch, always</td><td>Before GC (if at all)</td></tr>
<tr><td>Guarantee</td><td>Yes (always runs)</td><td>No (GC may skip it)</td></tr>
<tr><td>Status</td><td>Active</td><td>Deprecated (Java 9+)</td></tr>
</table>`
    },
    {
      tags: ['Exception', 'Chain of Responsibility', 'Design Pattern', 'Handler'],
      q: 'In exception handling, which design pattern is followed?',
      s: 'Chain of Responsibility — exception propagates up the call stack until a handler catches it. Each frame decides to handle or pass up. Spring\'s @ControllerAdvice also implements this pattern.',
      d: `<p>The <strong>Chain of Responsibility</strong> pattern: each handler either handles the request or passes it to the next handler in the chain.</p>
<pre><code>// Chain: method3 → method2 → method1 → GlobalExceptionHandler
void method3() { throw new ServiceException("DB timeout"); }
void method2() throws ServiceException { method3(); } // passes up
void method1() {
    try { method2(); }
    catch (ServiceException e) { throw new ApiException(e); } // wraps+rethrows
}

// Final handler: @ControllerAdvice
@ExceptionHandler(ApiException.class)
ResponseEntity&lt;?&gt; handle(ApiException e) { ... } // final handler</code></pre>`
    }
  ],

  jvm: [
    {
      tags: ['Two ClassLoaders', 'Same Class', 'Different Class', 'ClassCastException'],
      q: 'What happens if two class loaders load the same class?',
      s: 'They\'re treated as DIFFERENT classes. JVM identifies a class by (fully qualified name + ClassLoader). Casting objects between them causes ClassCastException.',
      d: `<p>JVM identity: <code>Class</code> = FQN + ClassLoader instance. Same class loaded by two loaders = two distinct <code>Class</code> objects.</p>
<p>Used in: hot-reloading (Tomcat, Spring Boot DevTools — new ClassLoader loads updated class), OSGi (each bundle has its own ClassLoader).</p>
<pre><code>ClassLoader loader1 = new URLClassLoader(urls);
ClassLoader loader2 = new URLClassLoader(urls);
Class&lt;?&gt; c1 = loader1.loadClass("com.app.Service");
Class&lt;?&gt; c2 = loader2.loadClass("com.app.Service");
System.out.println(c1 == c2); // false — different Class objects!</code></pre>`
    },
    {
      tags: ['JVM Changes', 'Java 8', 'Metaspace', 'G1 GC', 'Lambda'],
      q: 'What are the changes in JVM in Java 8?',
      s: 'PermGen removed → Metaspace. G1 GC became production-ready. invokedynamic for lambdas. Compressed OOPs improvements. Tiered compilation by default.',
      d: `<ol>
<li><strong>PermGen removed → Metaspace</strong> (native memory, auto-grows)</li>
<li><strong>String pool moved to Heap</strong> (actually Java 7 update 6, completed in Java 8)</li>
<li><strong>G1 GC</strong> — production-ready, reduced Full GC pauses</li>
<li><strong>invokedynamic</strong> — used by lambdas for efficient functional dispatch</li>
<li><strong>Tiered compilation</strong> — C1 (client) + C2 (server) compilers work together</li>
<li><strong>Nashorn JS engine</strong> — replaced Rhino (itself deprecated in Java 15)</li>
</ol>`
    },
    {
      tags: ['GC Generations', 'Minor GC', 'Major GC', 'Eden', 'Survivor', 'Old Gen'],
      q: 'Different generations in JVM memory (Minor GC vs Major GC)',
      s: 'Young Gen (Eden + S0 + S1): Minor GC, fast. Old Gen: Major GC, slower. Metaspace: class data. Objects start in Eden, survive to Survivor, promoted to Old Gen.',
      d: `<pre><code>Heap:
├── Young Generation (small, GC'd frequently)
│   ├── Eden Space    ← new objects allocated here
│   ├── Survivor 0 (S0)
│   └── Survivor 1 (S1)
└── Old Generation (Tenured)  ← long-lived objects promoted here

Minor GC: cleans Young Gen — fast (stop-the-world milliseconds)
Major GC: cleans Old Gen — slower (stop-the-world seconds)
Full GC:  both Young + Old + Metaspace — avoid in production!</code></pre>`
    }
  ],

  designpatterns: [
    {
      tags: ['Factory Pattern', 'Creational', 'Object Creation', 'Loose Coupling'],
      q: 'Explain the Factory design pattern. Advantages.',
      s: 'Factory creates objects without exposing creation logic. Client uses factory method instead of new. Advantage: loose coupling, easy to swap implementations, centralizes creation logic.',
      d: `<pre><code>// Factory method
interface Notification { void send(String msg); }
class EmailNotification implements Notification { ... }
class SmsNotification   implements Notification { ... }

class NotificationFactory {
    static Notification create(String type) {
        return switch (type) {
            case "EMAIL" -&gt; new EmailNotification();
            case "SMS"   -&gt; new SmsNotification();
            default -&gt; throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}

// Client — doesn't know concrete classes
Notification n = NotificationFactory.create("EMAIL");
n.send("Hello!");</code></pre>`
    },
    {
      tags: ['Abstract Factory', 'Factory of Factories', 'Family', 'UI Kit'],
      q: 'Abstract Factory pattern. Factory vs Abstract Factory.',
      s: 'Abstract Factory creates FAMILIES of related objects. Factory creates one product; Abstract Factory creates multiple related products together (Button + Checkbox + Dialog).',
      d: `<pre><code>// Abstract Factory
interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}
class WindowsFactory implements UIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}
class MacFactory implements UIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}
// Client uses UIFactory — consistent OS-specific UI family</code></pre>`
    },
    {
      tags: ['Decorator', 'Structural', 'IO Streams', 'Wrapper', 'Dynamic Behavior'],
      q: 'Decorator pattern. Adapter vs Decorator.',
      s: 'Decorator: adds behavior to objects dynamically by wrapping — same interface. Adapter: converts an incompatible interface to a compatible one. Java I/O uses Decorator heavily.',
      d: `<pre><code>// Decorator (Java I/O)
BufferedReader br = new BufferedReader(    // Decorator: adds buffering
    new InputStreamReader(                  // Decorator: bytes→chars
        new FileInputStream("file.txt")     // Component: raw bytes
    )
);

// Adapter — converts incompatible interface
class LegacyPrinter { void printLegacy(String s) { ... } }
interface ModernPrinter { void print(String s); }

class PrinterAdapter implements ModernPrinter {
    LegacyPrinter legacy = new LegacyPrinter();
    public void print(String s) { legacy.printLegacy(s); } // adapts
}</code></pre>
<table>
<tr><th>Pattern</th><th>Intent</th></tr>
<tr><td>Decorator</td><td>Add behavior to same interface</td></tr>
<tr><td>Adapter</td><td>Convert incompatible interfaces</td></tr>
</table>`
    },
    {
      tags: ['Strategy vs Decorator', 'Behavioral vs Structural', 'Difference'],
      q: 'Strategy vs Decorator — example and difference',
      s: 'Strategy: swap algorithms/behavior at runtime (HOW it works changes). Decorator: add features to an object while keeping same interface (WHAT it does adds).',
      d: `<table>
<tr><th>Feature</th><th>Strategy</th><th>Decorator</th></tr>
<tr><td>Category</td><td>Behavioral</td><td>Structural</td></tr>
<tr><td>Intent</td><td>Choose algorithm at runtime</td><td>Add features dynamically</td></tr>
<tr><td>Interface</td><td>Strategy interface (different)</td><td>Same interface as component</td></tr>
<tr><td>Example</td><td>SortStrategy: BubbleSort / QuickSort</td><td>BufferedWriter wraps FileWriter</td></tr>
</table>`
    },
    {
      tags: ['E-commerce', 'Design Patterns', 'Used Together', 'Real Project'],
      q: 'Which design patterns would you use in an e-commerce website?',
      s: 'Singleton (DB connection pool), Factory (payment gateways), Strategy (discount/pricing), Observer (order events), Builder (complex Order object), Facade (checkout), Decorator (add features to cart).',
      d: `<ol>
<li><strong>Singleton</strong> — DB connection pool, configuration manager</li>
<li><strong>Factory</strong> — create payment handler (UPI, Card, Wallet)</li>
<li><strong>Strategy</strong> — pricing strategy (seasonal, loyalty, bulk discount)</li>
<li><strong>Observer</strong> — on OrderPlaced: email, inventory update, invoice</li>
<li><strong>Builder</strong> — build complex Order object with optional fields</li>
<li><strong>Facade</strong> — CheckoutFacade hides payment, inventory, shipping</li>
<li><strong>Decorator</strong> — Cart with GiftWrap, Insurance, Express decorators</li>
</ol>`
    },
    {
      tags: ['KISS', 'DRY', 'YAGNI', 'Clean Code', 'Principles'],
      q: 'What is Clean Code?',
      s: 'Clean Code is readable, maintainable code that clearly expresses intent. Key rules: meaningful names, small functions, single responsibility, no duplication, minimal comments (only WHY, not WHAT).',
      d: `<ol>
<li><strong>Meaningful names</strong> — <code>getUserById</code> not <code>getData</code>.</li>
<li><strong>Small functions</strong> — do ONE thing. If you need to describe with "and", split it.</li>
<li><strong>No magic numbers</strong> — <code>MAX_RETRIES = 3</code> not literal <code>3</code>.</li>
<li><strong>DRY</strong> — don't repeat yourself; extract common logic.</li>
<li><strong>Comments explain WHY</strong> — not what (code should be self-documenting).</li>
<li><strong>Proper error handling</strong> — don't swallow exceptions, use meaningful custom exceptions.</li>
<li><strong>Tests</strong> — clean code has clean tests with meaningful assertions.</li>
</ol>`
    }
  ],

  serialization: [
    {
      tags: ['Custom Serialization', 'writeObject', 'readObject', 'Encryption'],
      q: 'What is custom serialization?',
      s: 'Override writeObject() and readObject() in a Serializable class to control how fields are serialized. Used for encryption, validation, or serializing non-serializable fields.',
      d: `<pre><code>class SecureUser implements Serializable {
    private String username;
    private transient String password; // excluded by default

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.defaultWriteObject(); // serialize non-transient fields
        out.writeObject(encrypt(password)); // custom: encrypt then write
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject(); // deserialize non-transient fields
        this.password = decrypt((String) in.readObject()); // custom: decrypt
    }
}</code></pre>`
    },
    {
      tags: ['serialVersionUID', 'Version Control', 'InvalidClassException', 'Compatibility'],
      q: 'What is serialVersionUID?',
      s: 'A unique version ID for Serializable classes. Used during deserialization to verify sender/receiver class compatibility. Without explicit UID, JVM auto-generates one — risky if class changes.',
      d: `<pre><code>class Employee implements Serializable {
    private static final long serialVersionUID = 123456789L; // explicit

    String name;
    int age;
    // Adding new field → OK if serialVersionUID unchanged
    // Removing/renaming field + different UID → InvalidClassException on deserialize
}
// Always define serialVersionUID explicitly for control over compatibility</code></pre>`
    }
  ],

  keywords: [
    {
      tags: ['this', 'super', 'Keyword', 'Current Instance', 'Parent'],
      q: 'What is the this and super keyword?',
      s: 'this: refers to current class instance — disambiguate fields from params, call other constructors. super: refers to parent class — call parent constructor/methods, access parent fields.',
      d: `<pre><code>class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void sound() { System.out.println("..."); }
}

class Dog extends Animal {
    String breed;
    Dog(String name, String breed) {
        super(name);      // call parent constructor — must be first line
        this.breed = breed; // this = current Dog instance
    }
    void sound() {
        super.sound();    // call parent's sound()
        System.out.println("Woof from " + this.breed);
    }
    Dog copy() { return this; } // this = current Dog reference
}</code></pre>`
    },
    {
      tags: ['final object', 'Setter', 'Mutation', 'Reference vs Value'],
      q: 'If you create an object with final keyword, can you still change its field values?',
      s: 'YES. final prevents reassigning the reference, not mutating the object. s1.setName() is valid. s1 = new Student() is a compile error.',
      d: `<pre><code>final Student s1 = new Student("Sneha", 1);
s1.setName("Shubham");   // ✅ OK — mutating object's field
s1.age = 25;             // ✅ OK — if field is public/accessible

// s1 = new Student("Other", 2); // ❌ COMPILE ERROR — reassigning final ref</code></pre>`
    },
    {
      tags: ['Pure Virtual Function', 'Abstract Method', 'C++ vs Java'],
      q: 'What is a pure virtual function?',
      s: 'C++ term for a virtual function that has no implementation and must be overridden. In Java, this is an abstract method. abstract void draw() is Java\'s equivalent of pure virtual.',
      d: `<pre><code>// C++ pure virtual: virtual void draw() = 0;

// Java equivalent — abstract method
abstract class Shape {
    abstract void draw(); // "pure virtual" — must be overridden
    void describe() { System.out.println("I am a shape"); } // concrete
}

class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing circle"); } // must implement
}</code></pre>`
    },
    {
      tags: ['Destructor', 'Java', 'GC', 'finalize', 'Cleaner'],
      q: 'What is a destructor in Java context?',
      s: 'Java has no explicit destructor (unlike C++). GC handles memory automatically. finalize() was the closest (deprecated). Modern approach: try-with-resources or Cleaner API.',
      d: `<p>C++ destructor <code>~MyClass()</code> = explicit memory cleanup called when object goes out of scope.</p>
<p>Java equivalent options:</p>
<ol>
<li><strong>try-with-resources</strong> — <code>AutoCloseable.close()</code> called automatically.</li>
<li><strong>Cleaner API</strong> (Java 9+) — register cleanup action called by GC.</li>
<li><strong>finalize()</strong> (deprecated) — called by GC, no guarantee of timing.</li>
</ol>`
    },
    {
      tags: ['==', 'hashCode', 'Contract', 'equals', 'Consistency'],
      q: 'What is == vs hashCode() contract?',
      s: 'If a == b (same reference) → a.equals(b) must be true → a.hashCode() == b.hashCode(). The reverse isn\'t required: equal hashCode doesn\'t mean same object.',
      d: `<pre><code>// Contract:
// 1. Reflexive: x.equals(x) == true
// 2. Symmetric: x.equals(y) == y.equals(x)
// 3. Transitive: x.equals(y) && y.equals(z) → x.equals(z)
// 4. Consistent: same result on repeated calls (no state change)
// 5. x.equals(null) == false

// hashCode contract:
// If x.equals(y) → x.hashCode() == y.hashCode()
// Same hashCode does NOT imply equals() (collision is allowed)</code></pre>`
    }
  ],

  tricky: [
    {
      tags: ['Post-increment', 'Pre-increment', 'Output', 'int a++'],
      q: 'int a=5; int b = a++ + ++a + a++; — output?',
      s: 'b=19. a++=5 (a→6), ++a=7 (a→7), a++=7 (a→8). b=5+7+7=19, final a=8.',
      d: `<pre><code>int a = 5;
// a++ → returns 5, THEN a becomes 6
// ++a → a becomes 7, returns 7
// a++ → returns 7, THEN a becomes 8
int b = 5 + 7 + 7; // b = 19
// a = 8</code></pre>`
    },
    {
      tags: ['Short-circuit', 'val++', 'if condition', 'Output'],
      q: 'if (val++ > 0 && val++ > 1) — if val=1 initially, output?',
      s: 'val++ > 0 → 1>0=true (val becomes 2). val++ > 1 → 2>1=true (val becomes 3). Condition is true. val ends up 3.',
      d: `<pre><code>int val = 1;
if (val++ > 0 && val++ > 1) {
    System.out.println("true, val=" + val); // true, val=3
}
// val++ > 0: uses val=1, then val becomes 2 → 1 > 0 → true → check next
// val++ > 1: uses val=2, then val becomes 3 → 2 > 1 → true
// Short-circuit: both evaluated since first was true</code></pre>`
    },
    {
      tags: ['byte casting', '(byte) 130', 'Overflow', 'Output'],
      q: 'byte b = (byte) 130; — output?',
      s: '-126. byte range is -128 to 127. 130 = 10000010 in binary. Cast to byte: 10000010 = -126 (two\'s complement).',
      d: `<pre><code>byte b = (byte) 130;
System.out.println(b); // -126

// 130 in binary: 00000000 10000010
// Cast to byte (8-bit): 10000010
// Two's complement: -(256 - 130) = -126</code></pre>`
    },
    {
      tags: ['byte overflow', 'x += 200', 'Implicit cast', 'Output'],
      q: 'byte x = 10; x += 200; — output?',
      s: '-46. x += 200 is equivalent to x = (byte)(x + 200). 10+200=210, cast to byte: 210-256=-46.',
      d: `<pre><code>byte x = 10;
x += 200; // equivalent to: x = (byte)(x + 200)
          // = (byte)(210) = 210 - 256 = -46
System.out.println(x); // -46

// Note: x = x + 200; // COMPILE ERROR — int cannot be assigned to byte
// += does implicit narrowing cast</code></pre>`
    },
    {
      tags: ['concat', 'String immutability', 'Output', 'Return value discarded'],
      q: 'String immutability: s.concat(" World"); — output?',
      s: 'Original string unchanged. s.concat() returns a NEW string "Hello World" but if not assigned back, the result is discarded.',
      d: `<pre><code>String s = "Hello";
s.concat(" World");         // result discarded!
System.out.println(s);       // "Hello"

s = s.concat(" World");     // assign result
System.out.println(s);       // "Hello World"</code></pre>`
    },
    {
      tags: ['char addition', 'int result', 'String concatenation', 'Output'],
      q: "'j'+'a'+'v'+'a' vs \"j\"+\"a\"+\"v\"+\"a\" — outputs?",
      s: '410 and "java". Char arithmetic: chars are ints, adds ASCII values (106+97+118+97=418). Wait — j=106,a=97,v=118,a=97 → 418. String concat gives "java".',
      d: `<pre><code>'j'+'a'+'v'+'a'     = 106+97+118+97 = 418 (int arithmetic)
System.out.println('j'+'a'+'v'+'a'); // 418

"j"+"a"+"v"+"a" = "java" (String concatenation)
System.out.println("j"+"a"+"v"+"a"); // "java"

// Mix:
System.out.println("j"+'a'+'v'+'a'); // "j" + 97 + 118 + 97 = "java97118" — NO
// Actually: "j" + 'a' = "ja", "ja"+'v' = "jav", "jav"+'a' = "java"
// String + char = String, so: "java"</code></pre>`
    },
    {
      tags: ['Field Hiding', 'A a2 = new B()', 'Reference Type', 'Variable'],
      q: 'Field hiding: A a2 = new B(); System.out.println(a2.x); — output?',
      s: 'Prints A\'s x value. Fields are NOT polymorphic — field access is resolved at compile time by REFERENCE TYPE, not runtime type.',
      d: `<pre><code>class A { int x = 10; }
class B extends A { int x = 20; } // hides A's x

A a1 = new A(); System.out.println(a1.x); // 10
B b1 = new B(); System.out.println(b1.x); // 20
A a2 = new B(); System.out.println(a2.x); // 10 — compile-time type = A!</code></pre>
<p>Only <strong>methods</strong> are polymorphic. <strong>Fields</strong> are resolved by reference type at compile time.</p>`
    },
    {
      tags: ['Constructor', 'Polymorphism', 'Overriding', 'Parent calls child method'],
      q: 'Parent constructor calls overridden method — what happens?',
      s: 'Child\'s overridden method is called (runtime polymorphism). But child instance isn\'t fully initialized yet — can cause NullPointerException or unexpected output.',
      d: `<pre><code>class Parent {
    Parent() { show(); } // calls overridden method during construction!
    void show() { System.out.println("Parent show"); }
}
class Child extends Parent {
    private String msg = "Hello";
    Child() { super(); } // parent constructor called first
    @Override
    void show() { System.out.println("Child: " + msg); } // msg is null here!
}
new Child();
// Output: "Child: null"
// msg not yet assigned when Parent() calls show() during construction</code></pre>`
    },
    {
      tags: ['Overloading', 'null', 'print(Object)', 'print(String)', 'Most Specific'],
      q: 'print(null) with print(Object) and print(String) — which is called?',
      s: 'print(String) is called. Java picks the MOST SPECIFIC matching method. String is more specific than Object (String extends Object).',
      d: `<pre><code>void print(Object o) { System.out.println("Object"); }
void print(String s) { System.out.println("String"); }

print(null); // "String" — most specific method wins

// If ambiguous:
void print(Integer i) { }
void print(String s)  { }
// print(null); // COMPILE ERROR — ambiguous (neither more specific)</code></pre>`
    },
    {
      tags: ['Widening', 'Autoboxing', 'Overloading', 'test(5)', 'Priority'],
      q: 'Widening beats autoboxing: test(5) with test(long) and test(Integer) — which?',
      s: 'test(long) is called. Java prefers widening (int→long) over autoboxing (int→Integer). Widening has higher priority in method resolution.',
      d: `<pre><code>void test(long l)    { System.out.println("long"); }
void test(Integer i) { System.out.println("Integer"); }

test(5); // "long" — widening (int → long) preferred over autoboxing

// Priority order: widening > autoboxing > varargs</code></pre>`
    },
    {
      tags: ['Switch', 'Fall-through', 'No break', 'Output'],
      q: 'Switch fall-through without break — output?',
      s: 'Without break, execution falls through to next case. All cases below the matched one execute until a break or end of switch.',
      d: `<pre><code>int x = 2;
switch(x) {
    case 1: System.out.print("one ");
    case 2: System.out.print("two ");   // matches here
    case 3: System.out.print("three "); // falls through!
    case 4: System.out.print("four ");  // falls through!
    default: System.out.print("done");
}
// Output: "two three four done"</code></pre>`
    },
    {
      tags: ['Unboxing null', 'Integer', 'NullPointerException', 'Auto-unboxing'],
      q: 'Unboxing null Integer to int — what exception?',
      s: 'NullPointerException. Auto-unboxing calls intValue() on the Integer object. If the object is null, intValue() throws NPE.',
      d: `<pre><code>Integer i = null;
int x = i;    // NullPointerException! (i.intValue() on null)

// Common trap in collections:
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
int val = map.get("missing"); // NPE! — map.get() returns null Integer</code></pre>`
    },
    {
      tags: ['Ternary operator', 'Type promotion', 'Integer', 'Double', 'Object'],
      q: 'Ternary operator type promotion: Object obj = true ? Integer.valueOf(1) : Double.valueOf(2.0)',
      s: 'obj = 1.0 (Double). Ternary operator promotes numeric types to a common type. Integer + Double → both promoted to Double. Integer.valueOf(1) → 1.0 (Double).',
      d: `<pre><code>Object obj = true ? Integer.valueOf(1) : Double.valueOf(2.0);
System.out.println(obj);               // 1.0
System.out.println(obj.getClass());    // class java.lang.Double

// Even though condition is true and Integer(1) selected,
// ternary promotes Integer to Double for type unification</code></pre>`
    },
    {
      tags: ['StringBuilder', 'equals', 'Reference', 'Object equals', 'Content'],
      q: 'StringBuilder.equals() — does it compare content?',
      s: 'NO. StringBuilder does not override equals() — it uses Object.equals() which compares REFERENCES. Use sb.toString().equals() to compare content.',
      d: `<pre><code>StringBuilder sb1 = new StringBuilder("hello");
StringBuilder sb2 = new StringBuilder("hello");

System.out.println(sb1.equals(sb2));          // false — reference comparison!
System.out.println(sb1 == sb2);               // false
System.out.println(sb1.toString().equals(sb2.toString())); // true</code></pre>`
    },
    {
      tags: ['Labeled break', 'Nested loops', 'Output', 'Break target'],
      q: 'Labeled break — output?',
      s: 'Labeled break exits the labeled loop (not just inner loop). Can break out of nested loops directly.',
      d: `<pre><code>outer:
for (int i = 0; i &lt; 3; i++) {
    for (int j = 0; j &lt; 3; j++) {
        if (i == 1 && j == 1) break outer; // exits OUTER loop
        System.out.print(i + "" + j + " ");
    }
}
// Output: 00 01 02 10
// When i=1,j=1 → break outer exits both loops</code></pre>`
    },
    {
      tags: ['ArrayStoreException', 'Covariance', 'String[]', 'Object[]', 'Runtime'],
      q: 'Object[] arr = new String[3]; arr[1] = 42; — what exception?',
      s: 'ArrayStoreException at runtime. Covariance allows Object[] = new String[]. But inserting an int (42) into what is actually a String[] fails at runtime.',
      d: `<pre><code>Object[] arr = new String[3]; // OK at compile time (covariance)
arr[0] = "hello";   // OK — String goes into String[]
arr[1] = 42;        // ArrayStoreException! — int cannot go into String[]
// Runtime check: arr is actually String[], Integer not assignable</code></pre>`
    },
    {
      tags: ['Bitwise XOR', 'Swap', 'Without temp', 'Output'],
      q: 'Bitwise XOR swap — output?',
      s: 'XOR swap exchanges two values without a temp variable: a=a^b, b=a^b, a=a^b.',
      d: `<pre><code>int a = 5, b = 10;
a = a ^ b; // a = 5^10 = 15
b = a ^ b; // b = 15^10 = 5
a = a ^ b; // a = 15^5 = 10
System.out.println("a=" + a + " b=" + b); // a=10 b=5</code></pre>`
    },
    {
      tags: ['Varargs', 'Ambiguity', 'Overloading', 'Compile Error'],
      q: 'Varargs ambiguity with two overloads — does it compile?',
      s: 'Depends. Two varargs methods with same element type → ambiguous call → COMPILE ERROR. If different types, compiler picks most specific.',
      d: `<pre><code>void test(int... nums) { }
void test(Object... objs) { }

test(1, 2, 3); // COMPILE ERROR — ambiguous: both match!

// Safe case:
void print(String... s) { }
void print(int... i) { }
print("a","b"); // OK — calls print(String...)
print(1, 2);    // OK — calls print(int...)</code></pre>`
    },
    {
      tags: ['Multiple catch', 'Exception order', 'Unreachable', 'Compile Error'],
      q: 'Multiple catch blocks: catch Exception before ArithmeticException — does it compile?',
      s: 'COMPILE ERROR. Exception is a superclass of ArithmeticException. Catching Exception first makes the ArithmeticException catch unreachable — compiler flags it.',
      d: `<pre><code>try { int x = 1/0; }
catch (Exception e) { } // too broad — catches everything
catch (ArithmeticException e) { } // COMPILE ERROR — unreachable!

// Correct order: specific first, general last
try { int x = 1/0; }
catch (ArithmeticException e) { System.out.println("Arithmetic"); }
catch (Exception e) { System.out.println("General"); }</code></pre>`
    },
    {
      tags: ['break', 'if', 'Without loop', 'Compile Error'],
      q: 'break inside if(true) without a loop — does it compile?',
      s: 'NO. break must be inside a switch, for, while, or do-while. Using break inside an if without an enclosing loop = COMPILE ERROR.',
      d: `<pre><code>if (true) {
    break; // COMPILE ERROR — break outside of switch/loop
}

// break is valid only inside:
for (...) { if (...) break; }     // OK
while (...) { if (...) break; }   // OK
switch (...) { case 1: break; }   // OK</code></pre>`
    },
    {
      tags: ['System.out.println', '1 < 2', 'boolean', 'Output'],
      q: 'System.out.println(1 < 2) — what does it return?',
      s: 'Prints "true". 1 < 2 is a boolean expression evaluated to true. println(boolean) prints the string representation "true".',
      d: `<pre><code>System.out.println(1 < 2);  // true
System.out.println(1 > 2);  // false
System.out.println(1 == 1); // true

// println is overloaded:
// println(boolean) → prints "true" or "false"</code></pre>`
    },
    {
      tags: ['$', 'underscore', 'Identifier', 'Valid', 'main method'],
      q: 'public static void main(String[] args) { int $_ = 5; } — is this valid?',
      s: 'YES. Java identifiers can contain letters, digits, $, _. They cannot start with a digit. $_ is a valid identifier.',
      d: `<pre><code>int $_ = 5;    // valid identifier
int _abc = 10; // valid
int $1 = 20;   // valid ($ at start OK)
int 1abc = 30; // INVALID — cannot start with digit

// _ (single underscore) was a warning in Java 8,
// becomes a KEYWORD in Java 21 (unnamed pattern variable)</code></pre>`
    },
    {
      tags: ['try-catch-finally', 'print order', 'Output', 'a c d'],
      q: 'System.out.print("a"); throw IllegalArgumentException; catch RuntimeException → print "c"; finally → print "d" — output?',
      s: '"acd". a prints before try body, exception caught by RuntimeException (parent), c prints in catch, d always prints in finally.',
      d: `<pre><code>System.out.print("a");
try {
    throw new IllegalArgumentException(); // extends RuntimeException
} catch (RuntimeException e) {
    System.out.print("c"); // caught here — IllegalArgument IS-A RuntimeException
} finally {
    System.out.print("d"); // always runs
}
// Output: acd</code></pre>`
    }
  ]
}

export default JAVA_EXTRA
