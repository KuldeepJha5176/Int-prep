const FINAL_EXTRA = {
  collections: [
    {
      tags: ['Comparable', 'Comparator', 'Replace', 'Real-world', 'Preferred'],
      q: 'How can you replace a Comparator with Comparable? Which is preferred?',
      s: 'Implement Comparable in the class itself for natural ordering. Comparator is preferred in real projects — it doesn\'t modify the class and allows multiple sort strategies.',
      d: `<pre><code>// With Comparator (flexible — no class modification)
employees.sort(Comparator.comparing(Employee::getName));
employees.sort(Comparator.comparingDouble(Employee::getSalary).reversed());

// Replacing with Comparable (modifies the class)
class Employee implements Comparable&lt;Employee&gt; {
    @Override
    public int compareTo(Employee o) { return this.name.compareTo(o.name); }
}
Collections.sort(employees); // uses compareTo</code></pre>
<p><strong>Real-world preference: Comparator.</strong></p>
<ul>
<li>Doesn't violate Single Responsibility (class vs sorting logic separated).</li>
<li>Allows multiple sort orders without changing the class.</li>
<li>Works for 3rd-party classes you can't modify.</li>
<li>Comparable: use only when there's one obvious "natural" order (e.g., numbers, dates).</li>
</ul>`
    },
    {
      tags: ['Collection Framework Hierarchy', 'Diagram', 'List Set Map Queue'],
      q: 'Explain the Collection Framework hierarchy (flow diagram)',
      s: 'Iterable→Collection→{List,Set,Queue}. Map is separate. List: ArrayList,LinkedList. Set: HashSet,TreeSet. Queue: PriorityQueue,ArrayDeque. Map: HashMap,TreeMap,LinkedHashMap.',
      d: `<pre><code>java.lang.Iterable&lt;T&gt;
    └── java.util.Collection&lt;E&gt;
            ├── List&lt;E&gt;   → ArrayList, LinkedList, Vector, Stack
            ├── Set&lt;E&gt;    → HashSet, LinkedHashSet
            │       └── SortedSet → NavigableSet → TreeSet
            └── Queue&lt;E&gt; → PriorityQueue, ArrayDeque
                    └── Deque&lt;E&gt; → ArrayDeque, LinkedList

java.util.Map&lt;K,V&gt;  (separate — not under Collection)
    ├── HashMap, LinkedHashMap, Hashtable
    ├── SortedMap → NavigableMap → TreeMap
    └── ConcurrentHashMap</code></pre>`
    }
  ],

  oop: [
    {
      tags: ['OCP', 'Open-Closed', 'Beneficial', 'YAGNI', 'Violation'],
      q: 'Can violating the Open-Closed Principle still be beneficial in certain situations?',
      s: 'Yes — when the code is simple, unlikely to change, or the abstraction cost exceeds benefit. YAGNI applies: don\'t add extension points for hypothetical future changes.',
      d: `<p>OCP violation is acceptable when:</p>
<ol>
<li><strong>Simple code with stable logic.</strong> A 2-case switch on an enum that never changes — adding an interface is over-engineering.</li>
<li><strong>Prototype or MVP stage.</strong> Adding extension points prematurely slows development without proven need.</li>
<li><strong>Rare one-off change.</strong> The "modification" is so infrequent that maintaining abstractions costs more than the occasional edit.</li>
</ol>
<p>Balance OCP with <strong>YAGNI</strong>: don't build the strategy pattern for code that has changed exactly once in 2 years.</p>`
    }
  ],

  java8: [
    {
      tags: ['Phantom Reference', 'Weak Reference', 'Strong Reference', 'Soft', 'GC'],
      q: 'What are phantom, weak, and strong references? Real-time use case of weak references.',
      s: 'Strong: default, never GC\'d. Soft: GC under memory pressure (image cache). Weak: GC when no strong refs (WeakHashMap, canonicalization). Phantom: post-GC notification for cleanup.',
      d: `<table>
<tr><th>Reference</th><th>GC collects when</th><th>Use case</th></tr>
<tr><td>Strong</td><td>Never (while reachable)</td><td>All normal object refs</td></tr>
<tr><td>SoftReference</td><td>Low memory only</td><td>In-memory image/object cache</td></tr>
<tr><td>WeakReference</td><td>No strong refs exist</td><td>WeakHashMap, canonicalization maps</td></tr>
<tr><td>PhantomReference</td><td>After finalization</td><td>Resource cleanup (off-heap, files)</td></tr>
</table>
<pre><code>// WeakReference — real-world: WeakHashMap for metadata cache
WeakHashMap&lt;Widget, Metadata&gt; cache = new WeakHashMap&lt;&gt;();
Widget w = new Widget();
cache.put(w, new Metadata("info"));
w = null; // no more strong refs to Widget
System.gc();
// Entry auto-removed from cache — avoids memory leak!</code></pre>`
    }
  ],

  exceptions: [
    {
      tags: ['Checked Unchecked', 'Why separate', 'Compiler force', 'API contract'],
      q: 'Why does Java separate checked and unchecked exceptions?',
      s: 'Checked = recoverable external failures (IO, SQL) — compiler forces handling. Unchecked = programming bugs (NPE, ArrayIndex) — handling everywhere is impractical and noisy.',
      d: `<ol>
<li><strong>Checked exceptions</strong> represent <em>recoverable</em> conditions beyond programmer control — file not found, network timeout, DB down. The compiler forces you to acknowledge these.</li>
<li><strong>Unchecked exceptions</strong> represent <em>programming errors</em> — null pointer, array out of bounds. These can occur in any method, so requiring mandatory handling everywhere would produce unreadable code.</li>
</ol>
<pre><code>// Checked — must handle or declare
try { new FileInputStream("data.txt"); }
catch (FileNotFoundException e) { /* handle gracefully */ }

// Unchecked — usually fix the code, not catch it
String s = null;
s.length(); // NullPointerException — fix the code!
</code></pre>`
    }
  ],

  jvm: [
    {
      tags: ['JVM', 'JRE', 'JDK', 'Threads', 'Stack Heap Components'],
      q: 'What are the threads/components in JVM — Stack, Heap etc.?',
      s: 'Each JVM thread has its own Stack + PC Register + Native Stack. Heap and Metaspace are shared. Main thread + GC threads + JIT compiler threads + other daemon threads all run inside the JVM process.',
      d: `<pre><code>// Threads inside a running JVM process:
Main Thread        — executes your main() method
GC Threads         — G1 GC concurrent threads, finalizer thread
JIT Compiler Thread — C1/C2 compiler threads (background optimization)
Reference Handler  — processes weak/phantom refs
Signal Dispatcher  — handles OS signals (SIGTERM etc.)

// Memory visible to all threads (shared):
Heap     → objects, arrays, String pool
Metaspace → class bytecode, static variables

// Per-thread (NOT shared):
Stack    → method call frames (local vars, operand stack)
PC Reg   → current instruction address
Native Stack → for JNI/native method calls</code></pre>`
    }
  ],

  'spring-core': [
    {
      tags: ['@Value', 'Lifecycle', 'When resolved', 'BeanPostProcessor', 'Stage'],
      q: 'What is @Value and at what stage of the Bean lifecycle is it resolved?',
      s: '@Value injects property values from environment/properties. Resolved during BeanPostProcessor phase — AFTER instantiation, BEFORE @PostConstruct. Cannot be used in static fields.',
      d: `<pre><code>@Component
class Config {
    @Value("\${app.name}")           // from application.properties
    private String appName;

    @Value("\${server.port:8080}")   // with default value
    private int port;

    @Value("#{T(java.lang.Math).PI}") // SpEL expression
    private double pi;

    @PostConstruct
    void init() {
        // appName is already injected here ✓
    }
}
// Lifecycle order: new Config() → inject @Value → @PostConstruct
// Stage: AutowiredAnnotationBeanPostProcessor processes @Value
// Cannot use on static fields (no instance context)</code></pre>`
    },
    {
      tags: ['ComponentScan', 'Internal', 'BeanDefinition', 'ClassPath', 'Scan'],
      q: 'What is Component Scan? How does it work internally and how is a bean created?',
      s: '@ComponentScan scans packages for stereotyped classes. ClassPathBeanDefinitionScanner finds @Component+derivatives, registers BeanDefinitions. ApplicationContext creates instances from definitions.',
      d: `<pre><code>// What happens when Spring starts:
// 1. @ComponentScan triggers ClassPathBeanDefinitionScanner
// 2. Scanner walks classpath of specified packages
// 3. Finds classes annotated with @Component, @Service, @Repository, @Controller
// 4. Creates a BeanDefinition for each (metadata, not the object yet)
// 5. Registers BeanDefinition in the BeanDefinitionRegistry

// Bean creation (after scanning):
// 6. BeanFactory.getBean() → create instance (constructor)
// 7. Inject @Autowired dependencies
// 8. Apply BeanPostProcessors (resolve @Value, @Autowired)
// 9. Call @PostConstruct
// 10. Bean is ready

@SpringBootApplication
// ↳ @ComponentScan scans com.app and sub-packages by default

// Custom:
@ComponentScan(basePackages = {"com.app.services", "com.app.repositories"},
    excludeFilters = @Filter(type = FilterType.ANNOTATION,
                             classes = ExcludeFromScan.class))</code></pre>`
    },
    {
      tags: ['@EnableAutoConfiguration', '@AutoConfiguration', 'Difference', 'Spring Boot'],
      q: 'What is the difference between @EnableAutoConfiguration vs @AutoConfiguration?',
      s: '@EnableAutoConfiguration triggers Spring Boot\'s auto-config mechanism (part of @SpringBootApplication). @AutoConfiguration marks a class as one of the auto-configuration classes to be loaded.',
      d: `<pre><code>// @EnableAutoConfiguration — the TRIGGER (used on your App class)
// Tells Spring Boot: "Please load all auto-configuration classes"
@SpringBootApplication // contains @EnableAutoConfiguration
public class App { }

// @AutoConfiguration — marks a class AS an auto-config (Spring Boot 2.7+)
@AutoConfiguration
@ConditionalOnClass(DataSource.class)
public class DataSourceAutoConfiguration {
    @Bean @ConditionalOnMissingBean
    DataSource dataSource() { return new HikariDataSource(); }
}
// This class is registered in:
// META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports

// Analogy:
// @EnableAutoConfiguration = "load all plugins"
// @AutoConfiguration = marks a class as "I am a plugin"</code></pre>`
    }
  ],

  rest: [
    {
      tags: ['Idempotent', 'GET POST PUT PATCH DELETE', 'HTTP Methods', 'Safe'],
      q: 'Which HTTP methods are idempotent? GET, POST, PUT, PATCH, DELETE',
      s: 'Idempotent: GET, PUT, DELETE, HEAD, OPTIONS. Not idempotent: POST, PATCH (may not be). Safe (read-only): GET, HEAD, OPTIONS.',
      d: `<table>
<tr><th>Method</th><th>Idempotent</th><th>Safe</th><th>Body</th></tr>
<tr><td>GET</td><td>✅ Yes</td><td>✅ Yes</td><td>No</td></tr>
<tr><td>POST</td><td>❌ No</td><td>❌ No</td><td>Yes</td></tr>
<tr><td>PUT</td><td>✅ Yes</td><td>❌ No</td><td>Yes</td></tr>
<tr><td>PATCH</td><td>Maybe</td><td>❌ No</td><td>Yes</td></tr>
<tr><td>DELETE</td><td>✅ Yes</td><td>❌ No</td><td>Optional</td></tr>
<tr><td>HEAD</td><td>✅ Yes</td><td>✅ Yes</td><td>No</td></tr>
</table>
<p><strong>Idempotent</strong> = calling N times has same effect as calling once. DELETE /users/1 twice = same result (deleted). POST /users twice = creates two users.</p>`
    }
  ],

  microservices: [
    {
      tags: ['Full Architecture', 'Eureka', 'Gateway', 'Load Balancer', 'End-to-end'],
      q: 'Full microservices architecture explanation (Eureka, load balancer, gateway)',
      s: 'Client → API Gateway → Service Discovery (Eureka) → Load Balanced microservice instances. Config Server for centralized config. Kafka for async. Zipkin for tracing.',
      d: `<pre><code>// Full flow:
// 1. Client sends request to API Gateway (:8080)
// 2. Gateway authenticates (JWT), routes to lb://user-service
// 3. Spring Cloud LoadBalancer queries Eureka for user-service instances
// 4. Eureka returns [instance1:8081, instance2:8082, instance3:8083]
// 5. LoadBalancer picks instance (round-robin) → routes request
// 6. user-service processes, calls order-service via Feign Client
// 7. Feign → Eureka → LoadBalancer → order-service instance
// 8. Async events via Kafka (order-placed → inventory, billing)
// 9. Zipkin traces the full request across all services
// 10. Spring Cloud Config Server provides config to all services

Services architecture:
┌─────────┐    ┌─────────────┐    ┌────────────┐
│ Client  │───▶│ API Gateway │───▶│ Eureka     │
└─────────┘    └─────────────┘    │ Registry   │
                    │              └────────────┘
                    ▼                     ↑ register
           ┌──────────────────────────────────────┐
           │  user-service  │  order-service  │...│
           └──────────────────────────────────────┘
                    │ async events
                    ▼
               ┌─────────┐
               │  Kafka  │ → inventory, billing, notification
               └─────────┘</code></pre>`
    },
    {
      tags: ['Synchronous Async', 'REST', 'Kafka', 'Coupling', 'Communication'],
      q: 'What is synchronous vs asynchronous communication in microservices?',
      s: 'Synchronous: REST/gRPC — caller blocks waiting for response. Asynchronous: Kafka/RabbitMQ — fire-and-forget, no waiting. Async gives better resilience and decoupling.',
      d: `<table>
<tr><th>Aspect</th><th>Synchronous (REST/gRPC)</th><th>Asynchronous (Kafka)</th></tr>
<tr><td>Caller blocks</td><td>Yes — waits for response</td><td>No — continue immediately</td></tr>
<tr><td>Coupling</td><td>Tight — both services must be up</td><td>Loose — consumer can be down</td></tr>
<tr><td>Latency</td><td>Real-time</td><td>Eventual (milliseconds to seconds)</td></tr>
<tr><td>Failure impact</td><td>Cascades to caller</td><td>Isolated — message retained in queue</td></tr>
<tr><td>Use case</td><td>Get user profile, payment auth</td><td>Send email, update inventory</td></tr>
</table>
<pre><code>// Sync: Feign Client
UserDto user = userClient.getUser(id); // blocks until response

// Async: Kafka producer
kafkaTemplate.send("order-placed", new OrderEvent(orderId));
// returns immediately — consumer handles it independently</code></pre>`
    }
  ],

  'stream-coding': [
    {
      tags: ['Filter duplicates', 'distinct', 'Stream', 'remove duplicates'],
      q: 'Filter duplicate elements from a list using Streams',
      s: 'stream().distinct().collect() removes duplicates. For custom objects, ensure equals()/hashCode() are overridden.',
      d: `<pre><code>List&lt;Integer&gt; withDups = List.of(1, 2, 2, 3, 3, 3, 4, 5, 5);

// Remove duplicates
List&lt;Integer&gt; unique = withDups.stream()
    .distinct()
    .collect(Collectors.toList());
System.out.println(unique); // [1, 2, 3, 4, 5]

// Custom objects — need equals/hashCode
List&lt;Employee&gt; uniqueByEmail = employees.stream()
    .collect(Collectors.collectingAndThen(
        Collectors.toCollection(() -&gt;
            new TreeSet&lt;&gt;(Comparator.comparing(Employee::getEmail))),
        ArrayList::new));</code></pre>`
    },
    {
      tags: ['parallelStream', 'stream', 'ForkJoinPool', 'Parallel', 'Performance'],
      q: 'What is the difference between stream() and parallelStream()?',
      s: 'stream(): sequential, single thread. parallelStream(): splits work across ForkJoinPool threads. Use parallel for large CPU-bound stateless operations. Avoid for small, ordered, or IO-bound tasks.',
      d: `<pre><code>List&lt;Integer&gt; numbers = IntStream.rangeClosed(1, 1_000_000)
    .boxed().collect(Collectors.toList());

// Sequential
long sum1 = numbers.stream().reduce(0, Integer::sum);

// Parallel — uses ForkJoinPool.commonPool() threads
long sum2 = numbers.parallelStream().reduce(0, Integer::sum);

// When NOT to use parallelStream:
// ❌ Small datasets (overhead &gt; benefit)
// ❌ Operations with shared mutable state (race conditions)
// ❌ IO-bound tasks (threads blocked, not computing)
// ❌ Order-dependent operations
// ✅ Large data + CPU-intensive + stateless + no order dependency</code></pre>`
    },
    {
      tags: ['Map sort by value', 'entrySet', 'Stream', 'LinkedHashMap', 'sorted'],
      q: 'Sort a Map based on its values using Streams',
      s: 'entrySet().stream().sorted(Map.Entry.comparingByValue()).collect(toMap(...)). Use LinkedHashMap to preserve sorted order.',
      d: `<pre><code>Map&lt;String, Integer&gt; scores = new HashMap&lt;&gt;(Map.of("Alice",85,"Bob",92,"Charlie",78));

// Sort by value ascending
Map&lt;String, Integer&gt; sortedAsc = scores.entrySet().stream()
    .sorted(Map.Entry.comparingByValue())
    .collect(Collectors.toMap(
        Map.Entry::getKey,
        Map.Entry::getValue,
        (e1, e2) -&gt; e1,
        LinkedHashMap::new  // preserve insertion order
    ));
System.out.println(sortedAsc); // {Charlie=78, Alice=85, Bob=92}

// Sort by value descending
Map&lt;String, Integer&gt; sortedDesc = scores.entrySet().stream()
    .sorted(Map.Entry.&lt;String, Integer&gt;comparingByValue().reversed())
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
        (e1,e2) -&gt; e1, LinkedHashMap::new));
System.out.println(sortedDesc); // {Bob=92, Alice=85, Charlie=78}</code></pre>`
    }
  ],

  dsa: [
    {
      tags: ['Smallest Positive Missing', 'Cyclic Sort', 'Index', 'O(n)', 'O(1)'],
      q: 'Find the smallest positive missing integer in an array',
      s: 'Cyclic sort approach: place each number at index num-1 (if in range). Scan array — first index where arr[i]!=i+1 gives the answer. O(n) time, O(1) space.',
      d: `<pre><code>int firstMissingPositive(int[] nums) {
    int n = nums.length;
    // Step 1: Place each number at its correct index
    for (int i = 0; i &lt; n; i++) {
        while (nums[i] &gt; 0 && nums[i] &lt;= n && nums[nums[i]-1] != nums[i]) {
            // swap nums[i] to its correct position
            int correct = nums[i] - 1;
            int temp = nums[correct];
            nums[correct] = nums[i];
            nums[i] = temp;
        }
    }
    // Step 2: Find first mismatch
    for (int i = 0; i &lt; n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1; // all 1..n present
}
// [3,4,-1,1] → 2   |   [1,2,0] → 3   |   [7,8,9] → 1
// Time: O(n) | Space: O(1)</code></pre>`
    },
    {
      tags: ['100 Doors', 'Toggle', 'Perfect Squares', 'Optimization'],
      q: '100 Doors Toggle problem — optimized approach',
      s: 'After 100 passes, only doors at perfect square positions (1,4,9,16,...,100) are open. Doors with odd factor count = perfect squares. Direct O(√n) solution.',
      d: `<pre><code>// Direct solution — O(√100) = O(10)
List&lt;Integer&gt; openDoors = IntStream.rangeClosed(1, 10)
    .map(i -&gt; i * i)
    .boxed()
    .collect(Collectors.toList());
// [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

// Verification via simulation:
boolean[] doors = new boolean[101]; // false = closed
for (int i = 1; i &lt;= 100; i++)
    for (int j = i; j &lt;= 100; j += i)
        doors[j] = !doors[j];
// Only perfect squares end up open (odd number of factors)</code></pre>`
    }
  ],

  git: [
    {
      tags: ['Fork', 'Clone', 'GitHub', 'Open Source', 'Difference'],
      q: 'Git fork vs Git clone',
      s: 'Fork: server-side copy of repo under your GitHub account (for contributing to OSS). Clone: local copy of any repo. Fork then clone YOUR fork for open source contribution.',
      d: `<pre><code>// Fork: GitHub UI → "Fork" button → creates YOUR copy on GitHub
// Then clone YOUR fork locally:
git clone https://github.com/YOUR_USER/original-repo.git
cd original-repo
git remote add upstream https://github.com/ORIGINAL_USER/original-repo.git

// Keep your fork in sync with original:
git fetch upstream
git merge upstream/main

// Clone (direct — no fork):
git clone https://github.com/anyuser/repo.git
// Use when: you have write access OR just reading</code></pre>
<table>
<tr><th>Action</th><th>Fork</th><th>Clone</th></tr>
<tr><td>Where</td><td>Server (GitHub/GitLab)</td><td>Local machine</td></tr>
<tr><td>Use case</td><td>Contribute to OSS you don't own</td><td>Work on any repo locally</td></tr>
<tr><td>Creates</td><td>New remote repo under your account</td><td>Local copy of remote repo</td></tr>
</table>`
    }
  ],

  database: [
    {
      tags: ['ACID', 'Atomicity', 'Consistency', 'Isolation', 'Durability', 'Transaction'],
      q: 'What are ACID properties? Real-world example for each.',
      s: 'Atomicity: bank transfer deducts and credits atomically. Consistency: balance never goes negative. Isolation: two concurrent transfers don\'t see each other\'s partial state. Durability: committed transfer survives crash.',
      d: `<ol>
<li><strong>Atomicity.</strong> Transfer $100: debit sender + credit receiver must BOTH succeed or BOTH rollback. No half-transfers.</li>
<li><strong>Consistency.</strong> DB constraints (balance ≥ 0, unique email) are always satisfied. A transaction that would violate them is rolled back.</li>
<li><strong>Isolation.</strong> If Alice and Bob both withdraw $50 from $100 account concurrently, isolation ensures they don't both see $100 and both succeed — one is serialized.</li>
<li><strong>Durability.</strong> After "Transfer confirmed" — even if the server crashes immediately after, the committed transaction is in WAL/redo logs and will be recovered.</li>
</ol>`
    },
    {
      tags: ['NoSQL', 'Types', 'MongoDB', 'Redis', 'Cassandra', 'Use cases'],
      q: 'What particular NoSQL database have you used?',
      s: 'MongoDB (document store — flexible JSON docs), Redis (key-value cache/pub-sub), Cassandra (wide-column, high write throughput), Elasticsearch (full-text search), DynamoDB (managed AWS).',
      d: `<table>
<tr><th>Database</th><th>Type</th><th>Best For</th></tr>
<tr><td>MongoDB</td><td>Document</td><td>Flexible schema, user profiles, catalogs</td></tr>
<tr><td>Redis</td><td>Key-Value / Pub-Sub</td><td>Caching, sessions, real-time leaderboards</td></tr>
<tr><td>Cassandra</td><td>Wide-column</td><td>High write volume, time-series, IoT</td></tr>
<tr><td>Elasticsearch</td><td>Search engine</td><td>Full-text search, log analytics (ELK)</td></tr>
<tr><td>DynamoDB</td><td>Key-Value / Document</td><td>Serverless, auto-scaling, AWS native</td></tr>
</table>
<pre><code>// Redis in Spring Boot (caching)
@Cacheable("users")
User findById(Long id) { return repo.findById(id).orElseThrow(); }

// MongoDB with Spring Data
@Document(collection = "products")
record Product(String id, String name, double price) {}
interface ProductRepo extends MongoRepository&lt;Product, String&gt; { }</code></pre>`
    }
  ],

  agile: [
    {
      tags: ['Agile Roles', 'Product Owner', 'Scrum Master', 'Dev Team', 'Responsibilities'],
      q: 'What are the roles in Agile/Scrum?',
      s: 'Product Owner: prioritizes backlog, defines features. Scrum Master: facilitates process, removes blockers. Development Team: cross-functional, self-organizing, delivers sprint increment.',
      d: `<ol>
<li><strong>Product Owner</strong>
<ul><li>Owns and prioritizes the product backlog</li><li>Defines user stories and acceptance criteria</li><li>Represents business/customer voice</li><li>Decides what to build and in what order</li></ul></li>
<li><strong>Scrum Master</strong>
<ul><li>Facilitates all Scrum ceremonies</li><li>Removes impediments blocking the team</li><li>Coaches team on Scrum practices</li><li>Servant leader — not a manager</li></ul></li>
<li><strong>Development Team (3–9 people)</strong>
<ul><li>Cross-functional: devs, QA, designers, DevOps</li><li>Self-organizing: decides HOW to do the work</li><li>Collectively owns the sprint commitment</li></ul></li>
</ol>`
    }
  ],

  serialization: [
    {
      tags: ['Serialization Internal', 'ObjectOutputStream', 'Marker Interface', 'How it works'],
      q: 'What is serialization and deserialization? How does it work internally?',
      s: 'Serialization converts object state to bytes via ObjectOutputStream. Internally: writes class descriptor + field values recursively. Deserialization reads bytes back and reconstructs via ObjectInputStream without calling constructor.',
      d: `<pre><code>// Serialization
class User implements Serializable {
    private static final long serialVersionUID = 1L;
    String name; int age;
    transient String password; // excluded
}

// Serialize to file
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"))) {
    oos.writeObject(user);
}
// Internal: writes magic number(ACED 0005) + class descriptor (name, serialVersionUID, fields) + field values

// Deserialize
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"))) {
    User u = (User) ois.readObject();
}
// Internal: reads class descriptor, validates serialVersionUID matches,
// creates object WITHOUT calling constructor, fills fields from stream</code></pre>
<p><strong>Key:</strong> Constructor is NOT called during deserialization — object state restored directly from bytes.</p>`
    }
  ],

  interfaces: [
    {
      tags: ['Java 8 Interfaces', 'Default', 'Static', 'Access Modifiers', 'Enhancements'],
      q: 'What enhancements were made to interfaces from Java 8 onwards?',
      s: 'Java 8: default methods, static methods, @FunctionalInterface. Java 9: private methods, private static methods. Java 16: sealed interface preview. Java 17: sealed interfaces final.',
      d: `<table>
<tr><th>Version</th><th>Enhancement</th><th>Purpose</th></tr>
<tr><td>Java 8</td><td>default methods</td><td>Add behavior without breaking existing impls</td></tr>
<tr><td>Java 8</td><td>static methods</td><td>Utility methods on interface</td></tr>
<tr><td>Java 8</td><td>@FunctionalInterface</td><td>Mark SAM interfaces for lambdas</td></tr>
<tr><td>Java 9</td><td>private methods</td><td>Helper code reuse within interface</td></tr>
<tr><td>Java 9</td><td>private static methods</td><td>Static helper methods</td></tr>
<tr><td>Java 17</td><td>Sealed interfaces</td><td>Restrict permitted implementations</td></tr>
</table>
<pre><code>interface MyInterface {
    void abstractMethod();                  // Java 1+ abstract
    default void defaultMethod() { }        // Java 8+
    static void staticMethod() { }          // Java 8+
    private void privateHelper() { }        // Java 9+
    private static void privateStatic() { } // Java 9+
}</code></pre>`
    },
    {
      tags: ['Access Modifiers', 'default static', 'Interface', 'public', 'private'],
      q: 'What access modifiers can be used on static or default methods in an interface?',
      s: 'default methods are implicitly public. static methods in interface are public by default. Java 9+ allows private and private static. protected is NOT allowed on interface methods.',
      d: `<pre><code>interface Example {
    // default: implicitly public — cannot be private/protected
    default void show() { }              // public
    public default void show2() { }      // same (redundant)
    // protected default void show3() { } // COMPILE ERROR

    // static: implicitly public — cannot be protected/private in Java 8
    static void helper() { }             // public (Java 8)

    // Java 9+: private allowed for helpers
    private void internalHelper() { }
    private static void staticHelper() { }
}</code></pre>`
    }
  ],

  multithreading: [
    {
      tags: ['Ways to create thread', 'Runnable', 'Thread class', 'Callable', 'Lambda', 'Executor'],
      q: 'What are all the ways to create a thread in Java?',
      s: '1) Extend Thread. 2) Implement Runnable. 3) Implement Callable (with Future). 4) Lambda (Runnable). 5) ExecutorService.submit(). 6) CompletableFuture. 7) @Async (Spring).',
      d: `<pre><code>// 1. Extend Thread (avoid — tight coupling)
new Thread() { public void run() { doWork(); } }.start();

// 2. Implement Runnable (preferred for simple tasks)
Thread t = new Thread(() -&gt; doWork()); t.start();

// 3. Callable — when you need a result
Future&lt;String&gt; future = executor.submit(() -&gt; computeResult());

// 4. ExecutorService — recommended for production
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.execute(() -&gt; doWork());  // fire-and-forget
pool.submit(() -&gt; compute());  // with Future

// 5. CompletableFuture — async chains
CompletableFuture.supplyAsync(() -&gt; fetchData())
    .thenApply(data -&gt; process(data));

// 6. @Async (Spring) — simplest for Spring apps
@Async
public void asyncMethod() { doWork(); }
// Call it: asyncMethod(); // runs in thread pool</code></pre>`
    }
  ],

  'spring-exception': [
    {
      tags: ['@ControllerAdvice vs @RestControllerAdvice', 'Difference', 'JSON', 'View'],
      q: 'What is the difference between @ControllerAdvice and @RestControllerAdvice?',
      s: '@RestControllerAdvice = @ControllerAdvice + @ResponseBody. For REST APIs use @RestControllerAdvice — auto-serializes exception response to JSON. @ControllerAdvice for MVC apps that might return view names.',
      d: `<pre><code>// @ControllerAdvice — handler methods can return view names OR @ResponseBody
@ControllerAdvice
class GlobalHandler {
    @ExceptionHandler(NotFoundException.class)
    @ResponseBody  // must add @ResponseBody for JSON response
    ResponseEntity&lt;Error&gt; handle(NotFoundException e) {
        return ResponseEntity.notFound().build();
    }
}

// @RestControllerAdvice — @ResponseBody applied to ALL handler methods automatically
@RestControllerAdvice // = @ControllerAdvice + @ResponseBody on class level
class RestGlobalHandler {
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity&lt;Error&gt; handle(NotFoundException e) {
        return ResponseEntity.notFound().build(); // auto-JSON
    }
}
// For pure REST APIs, always use @RestControllerAdvice</code></pre>`
    },
    {
      tags: ['Global vs try-catch', 'Why global handler', 'DRY', 'Centralized'],
      q: 'Why do we need a global exception handler if we can use try-catch?',
      s: 'try-catch everywhere = code duplication, inconsistent error formats, harder to maintain. Global @ControllerAdvice = single place, consistent format, separation of concerns, centralized logging.',
      d: `<ol>
<li><strong>DRY (Don't Repeat Yourself).</strong> Without global handler, every controller repeats the same error response building code.</li>
<li><strong>Consistent API responses.</strong> All errors follow the same structure <code>{"status":404, "message":"...", "timestamp":"..."}</code>.</li>
<li><strong>Separation of concerns.</strong> Controllers handle business logic; exception handler handles error responses.</li>
<li><strong>Centralized logging.</strong> Log all exceptions in one place with proper severity levels.</li>
<li><strong>Easy maintenance.</strong> Change error format across entire API by editing one class.</li>
</ol>
<pre><code>// Bad — repeated in every controller:
try { ... } catch (Exception e) { return ResponseEntity.status(500).body(e.getMessage()); }

// Good — global handler once:
@RestControllerAdvice class GlobalHandler {
    @ExceptionHandler(Exception.class)
    ResponseEntity&lt;ErrorResponse&gt; handle(Exception e) { ... }
}</code></pre>`
    }
  ]
}

export default FINAL_EXTRA
