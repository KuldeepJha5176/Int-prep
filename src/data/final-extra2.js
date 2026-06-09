const FINAL_EXTRA2 = {
  tricky: [
    {
      tags: ['finally', 'local variable', 'try return', 'captured value'],
      q: 'finally modifies local variable but try has return — what is returned?',
      s: 'The try\'s return value. When try executes return x, the current value of x is captured. finally can modify x but the captured value is already saved — the original is returned.',
      d: `<pre><code>int test() {
    int x = 10;
    try {
        return x;     // x=10 captured for return here
    } finally {
        x = 20;       // too late — x=10 already captured
        // if finally had "return 99;" then 99 would win
    }
}
System.out.println(test()); // 10

// Contrast: if finally has its own return:
int test2() {
    try { return 1; }
    finally { return 2; } // 2 overrides 1
}
System.out.println(test2()); // 2</code></pre>`
    }
  ],

  collections: [
    {
      tags: ['HashSet', 'TreeSet', 'internal', 'How different', 'Null', 'Order'],
      q: 'HashSet internal working. How is it different from TreeSet?',
      s: 'HashSet: backed by HashMap — O(1), no order. TreeSet: backed by TreeMap (Red-Black Tree) — O(log n), sorted order. HashSet allows 1 null; TreeSet throws NPE on null.',
      d: `<pre><code>// HashSet add internally:
// map.put(element, PRESENT) — element is key, PRESENT is dummy value
// Uniqueness guaranteed by HashMap's key uniqueness

// TreeSet add internally:
// treeMap.put(element, PRESENT)
// TreeMap uses Red-Black Tree — keys always sorted

HashSet&lt;Integer&gt; hs = new HashSet&lt;&gt;(Set.of(5,1,3,2,4));
System.out.println(hs); // [1, 2, 3, 4, 5] or any order

TreeSet&lt;Integer&gt; ts = new TreeSet&lt;&gt;(Set.of(5,1,3,2,4));
System.out.println(ts); // [1, 2, 3, 4, 5] always sorted

hs.add(null);  // OK — HashSet allows 1 null
ts.add(null);  // NullPointerException!
</code></pre>`
    }
  ],

  streams: [
    {
      tags: ['Stream Collections difference', 'Lazy vs Eager', 'Storage', 'Pipeline'],
      q: 'What is the difference between Stream and Collections?',
      s: 'Collections store data, support multiple iterations, eager. Streams are pipelines for processing, consumed once, lazy — nothing executes until terminal op. Streams don\'t store data.',
      d: `<table>
<tr><th>Feature</th><th>Collection</th><th>Stream</th></tr>
<tr><td>Storage</td><td>Stores elements</td><td>No storage — pipeline over source</td></tr>
<tr><td>Iteration</td><td>Multiple times</td><td>Consumed once</td></tr>
<tr><td>Modification</td><td>add/remove/update</td><td>Non-mutating</td></tr>
<tr><td>Evaluation</td><td>Eager (data is there)</td><td>Lazy (until terminal op)</td></tr>
<tr><td>Data source</td><td>Is the data source</td><td>Needs a data source</td></tr>
</table>
<pre><code>// Collection — data stored, re-iterable
List&lt;Integer&gt; list = new ArrayList&lt;&gt;(List.of(1,2,3));
list.forEach(System.out::println); // iterate
list.forEach(System.out::println); // iterate again — OK

// Stream — single-use pipeline
Stream&lt;Integer&gt; stream = list.stream();
stream.forEach(System.out::println); // terminal
stream.forEach(System.out::println); // IllegalStateException!</code></pre>`
    }
  ],

  oop: [
    {
      tags: ['method overloading', 'overriding', 'differences', 'polymorphism', 'binding'],
      q: 'What is the difference between method overloading and overriding?',
      s: 'Overloading: same class, different params, compile-time. Overriding: parent-child, same params, runtime. Both are forms of polymorphism.',
      d: `<table>
<tr><th>Feature</th><th>Overloading</th><th>Overriding</th></tr>
<tr><td>Class</td><td>Same class (or subclass)</td><td>Parent + child class</td></tr>
<tr><td>Signature</td><td>Different parameters</td><td>Same name and params</td></tr>
<tr><td>Return type</td><td>Can differ</td><td>Same or covariant</td></tr>
<tr><td>Binding</td><td>Compile-time (static)</td><td>Runtime (dynamic)</td></tr>
<tr><td>Polymorphism</td><td>Compile-time polymorphism</td><td>Runtime polymorphism</td></tr>
<tr><td>Inheritance</td><td>Not needed</td><td>Required</td></tr>
</table>
<pre><code>// Overloading — same class, different params
class Calc {
    int add(int a, int b) { return a+b; }
    double add(double a, double b) { return a+b; } // overloaded
}

// Overriding — parent-child, same params
class Animal { void sound() { System.out.println("..."); } }
class Dog extends Animal {
    @Override void sound() { System.out.println("Woof"); } // overrides
}</code></pre>`
    }
  ],

  jvm: [
    {
      tags: ['Custom ClassLoader', 'Java 7', 'Java 8', 'findClass', 'Module'],
      q: 'How do you load a custom class loader in Java 7 vs Java 8?',
      s: 'Same approach: extend ClassLoader, override findClass(). Java 9+ introduces modules and Platform ClassLoader replaces Extension ClassLoader.',
      d: `<pre><code>// Works in Java 7, 8, 11, 17, 21
class MyLoader extends ClassLoader {
    @Override
    protected Class&lt;?&gt; findClass(String name) throws ClassNotFoundException {
        byte[] bytes = readClassFile(name.replace('.', '/') + ".class");
        return defineClass(name, bytes, 0, bytes.length);
    }
    private byte[] readClassFile(String path) throws ClassNotFoundException {
        try {
            return Files.readAllBytes(Path.of("/custom-classes/" + path));
        } catch (IOException e) {
            throw new ClassNotFoundException(name);
        }
    }
}

// Java 9+ difference: Extension ClassLoader replaced by Platform ClassLoader
// Java 9+: use module-info.java for modular class loading
// ClassLoader.getSystemClassLoader() now uses AppClassLoader (same)</code></pre>`
    }
  ],

  'spring-core': [
    {
      tags: ['Lazy Initialization Spring', '@Lazy', 'Startup time', 'Deferred'],
      q: 'What is Lazy Initialization in Spring?',
      s: 'Lazy initialization defers bean creation until first use instead of at startup. Reduces startup time. Spring singletons are eager by default. Enable globally or per-bean with @Lazy.',
      d: `<pre><code>// Per-bean: @Lazy on component
@Component
@Lazy
class HeavyAnalyticsService {
    // Not created at startup — created when first @Autowired accessed
}

// At injection point — creates proxy, resolves on first method call
@Service class ReportService {
    @Lazy @Autowired HeavyAnalyticsService analytics;
}

// Globally in application.properties:
spring.main.lazy-initialization=true

// Downside: startup errors for misconfigured beans appear at runtime
// not at startup — harder to catch early</code></pre>`
    },
    {
      tags: ['Proxy Spring', 'JDK Proxy', 'CGLIB', 'AOP', '@Transactional'],
      q: 'What is Proxy in Spring?',
      s: 'Spring creates proxy objects (wrappers) around beans to intercept method calls for AOP, @Transactional, @Cacheable. JDK proxy for interface-based; CGLIB for class-based.',
      d: `<pre><code>// Spring wraps @Transactional bean in a proxy
@Service class OrderService {
    @Transactional
    void placeOrder() { /* business */ }
}

// What Spring actually injects:
// class OrderService$$EnhancerByCGLIB extends OrderService {
//     void placeOrder() {
//         beginTransaction();
//         super.placeOrder();
//         commitOrRollback();
//     }
// }

// JDK proxy: when bean implements interface
// CGLIB proxy: when bean is a concrete class (Spring Boot default)

// SELF-INVOCATION TRAP: calling @Transactional method from same class bypasses proxy!
@Service class OrderService {
    @Transactional void method1() { }
    void method2() { method1(); } // proxy NOT invoked — no transaction!
    // Fix: inject self or use ApplicationContext.getBean()
}</code></pre>`
    }
  ],

  jpa: [
    {
      tags: ['Transaction management', 'Spring Boot', 'from scratch', '@Transactional', 'DataSource'],
      q: 'How do you implement transaction management in Spring Boot from scratch?',
      s: 'Spring Boot auto-configures JpaTransactionManager. Annotate service methods with @Transactional. Use propagation, isolation, rollbackFor as needed.',
      d: `<pre><code>// 1. Dependencies (pom.xml)
// spring-boot-starter-data-jpa (includes hibernate + transaction management)

// 2. DataSource auto-configured from application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=root
spring.datasource.password=secret

// 3. Use @Transactional on service methods
@Service
public class TransferService {
    @Autowired AccountRepository repo;

    @Transactional(
        isolation = Isolation.READ_COMMITTED,
        rollbackFor = Exception.class,
        timeout = 30
    )
    public void transfer(Long from, Long to, double amount) {
        Account src = repo.findById(from).orElseThrow();
        Account dst = repo.findById(to).orElseThrow();
        src.debit(amount);
        dst.credit(amount);
        // auto-commit on success, auto-rollback on RuntimeException
    }
}</code></pre>`
    }
  ],

  testing: [
    {
      tags: ['Testing Pyramid', 'Unit Integration E2E', 'When not to', 'Pyramid'],
      q: 'What is the testing pyramid? When should we NOT do unit testing?',
      s: 'Pyramid: many unit tests at base, fewer integration tests, fewest E2E tests. Don\'t unit test: trivial getters/setters, Spring configs, ORM mapping, auto-generated code.',
      d: `<pre><code>//          E2E (few, slow, expensive)
//        /     \
//       / Integ \   (moderate)
//      /         \
//     / Unit tests \  (many, fast, cheap)
//    _______________

// When NOT to write unit tests:
// ❌ Trivial getters/setters with no logic (testing getters is waste)
// ❌ @Configuration classes (test with integration/context test)
// ❌ Lombok @Data generated code
// ❌ ORM mappings (test with actual DB, not mocked)
// ❌ Simple CRUD with no business rules

// Instead use:
// ✅ Integration test for Spring context and JPA mappings
// ✅ @DataJpaTest for repository layer with embedded DB
// ✅ @WebMvcTest for controller layer</code></pre>`
    },
    {
      tags: ['Unit testing principle', 'FIRST', 'isolation', 'single responsibility'],
      q: 'What is the main core principle of unit testing?',
      s: 'FIRST: Fast, Isolated, Repeatable, Self-validating, Timely. Test ONE behavior. Each test has ONE reason to fail. Mock all external dependencies. AAA: Arrange-Act-Assert.',
      d: `<ol>
<li><strong>Fast</strong> — runs in milliseconds. Mock all I/O (DB, HTTP, files).</li>
<li><strong>Isolated</strong> — no shared state between tests. No order dependency.</li>
<li><strong>Repeatable</strong> — same result every run. No random, no clock dependency.</li>
<li><strong>Self-validating</strong> — auto pass/fail, no manual inspection.</li>
<li><strong>Timely</strong> — write with or before the code (TDD).</li>
</ol>
<pre><code>// AAA pattern:
@Test void shouldCalculateOrderTotal() {
    // Arrange
    Order order = new Order(List.of(new Item("A",10.0), new Item("B",20.0)));
    // Act
    double total = order.calculateTotal();
    // Assert
    assertEquals(30.0, total, 0.001);
}</code></pre>`
    }
  ],

  microservices: [
    {
      tags: ['Eureka Server', 'Eureka Client', 'Service Registry', 'Discovery'],
      q: 'What is Eureka Server and Eureka Client?',
      s: 'Eureka Server: Netflix OSS service registry — maintains list of all service instances and health. Eureka Client: each microservice registers itself and queries registry to discover other services.',
      d: `<pre><code>// Eureka Server setup
@SpringBootApplication
@EnableEurekaServer
public class EurekaServer { }
# application.yml
server.port: 8761
eureka.client.register-with-eureka: false  # server doesn't register itself
eureka.client.fetch-registry: false

// Eureka Client (every microservice)
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }
# application.yml
spring.application.name: user-service
eureka.client.service-url.defaultZone: http://localhost:8761/eureka
eureka.instance.lease-renewal-interval-in-seconds: 30 # heartbeat

// Dashboard: http://localhost:8761 — see all registered services
// Client queries: "where is user-service?" → Eureka returns [host:port]</code></pre>`
    },
    {
      tags: ['Load Balancing', 'Client-side', 'Round Robin', 'Spring Cloud'],
      q: 'What is Load Balancing in microservices?',
      s: 'Client-side load balancing: Spring Cloud LoadBalancer picks a service instance from Eureka registry. Default strategy: round-robin. Prevents any one instance from being overwhelmed.',
      d: `<pre><code>// Feign + LoadBalancer
@FeignClient("user-service") // lb://user-service = load balanced
interface UserClient {
    @GetMapping("/users/{id}") UserDto getUser(@PathVariable Long id);
}

// WebClient with load balancer
@LoadBalanced // enables client-side load balancing
@Bean WebClient.Builder webClientBuilder() { return WebClient.builder(); }

WebClient.Builder builder;
builder.build().get().uri("http://user-service/users/1") // resolved by LoadBalancer
       .retrieve().bodyToMono(UserDto.class);

// LoadBalancer picks from: [instance1:8081, instance2:8082, instance3:8083]
// Default: round-robin → 8081, 8082, 8083, 8081, ...</code></pre>`
    }
  ],

  dsa: [
    {
      tags: ['Singleton Pattern', 'implementation', 'Thread-safe', 'Enum', 'Bill Pugh'],
      q: 'Singleton pattern implementation (code) — all approaches',
      s: 'Enum: simplest and safest. Bill Pugh holder: lazy + thread-safe. Double-checked locking: manual but explicit. Eager loading: simple but not lazy.',
      d: `<pre><code>// 1. ENUM — Best approach (serialization-safe, reflection-safe)
enum Singleton { INSTANCE;
    public void doWork() { }
}

// 2. Bill Pugh Holder — lazy + thread-safe, no sync overhead
class Singleton {
    private Singleton() { }
    private static class Holder { static final Singleton I = new Singleton(); }
    public static Singleton get() { return Holder.I; }
}

// 3. Double-checked locking — classic
class Singleton {
    private static volatile Singleton instance;
    private Singleton() { }
    public static Singleton get() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) instance = new Singleton();
            }
        }
        return instance;
    }
}

// 4. Eager — simplest, not lazy
class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() { }
    public static Singleton get() { return INSTANCE; }
}</code></pre>`
    }
  ],

  git: [
    {
      tags: ['git stash', 'where stored', 'retrieve', 'why use', 'temp save'],
      q: 'What is Git Stash? Why use it? Where is it stored? How to retrieve?',
      s: 'git stash saves uncommitted changes to a temporary stack (in .git/refs/stash). Allows switching branches without committing. Retrieve with git stash pop or git stash apply.',
      d: `<pre><code># Why use: need to switch branches but have uncommitted changes
git stash                        # save all tracked modifications
git stash save "WIP: add login"  # with name
git checkout hotfix-branch       # switch freely

# Where stored: .git/refs/stash (linked list of stash entries)
git stash list
# stash@{0}: WIP on main: add login
# stash@{1}: On feature: fix bug

# Retrieve
git stash pop                    # apply latest + remove from stack
git stash apply stash@{1}        # apply specific + keep in stack
git stash drop stash@{0}         # delete without applying
git stash clear                  # delete all stashes
git stash show -p stash@{0}      # view what's in a stash</code></pre>`
    }
  ],

  agile: [
    {
      tags: ['Why Agile', 'Waterfall', 'Iterative', 'Feedback', 'Adaptable'],
      q: 'Why is Agile preferred over the Waterfall model?',
      s: 'Agile delivers value each sprint, embraces change, gets continuous feedback. Waterfall is sequential — change is costly, value delivered only at end, risk discovered late.',
      d: `<table>
<tr><th>Aspect</th><th>Waterfall</th><th>Agile</th></tr>
<tr><td>Process</td><td>Sequential phases</td><td>Iterative sprints</td></tr>
<tr><td>Customer feedback</td><td>Start and end only</td><td>Every sprint</td></tr>
<tr><td>Change handling</td><td>Expensive, disruptive</td><td>Expected, embraced in backlog</td></tr>
<tr><td>Value delivery</td><td>End of project</td><td>Every sprint (working software)</td></tr>
<tr><td>Risk discovery</td><td>Late — during testing</td><td>Early — each sprint retrospective</td></tr>
<tr><td>Documentation</td><td>Heavy upfront</td><td>Just enough, evolving</td></tr>
</table>
<p>Agile's core: respond to change over following a plan. Early and continuous delivery of working software.</p>`
    }
  ],

  database: [
    {
      tags: ['Normalization', '1NF', '2NF', '3NF', 'BCNF', 'Purpose'],
      q: 'What is normalization?',
      s: 'Normalization organizes DB to reduce redundancy and improve integrity. 1NF=atomic values, 2NF=no partial dependency, 3NF=no transitive dependency, BCNF=every determinant is candidate key.',
      d: `<ol>
<li><strong>1NF (First Normal Form)</strong> — Each cell has atomic (single) value. No repeating groups or arrays.</li>
<li><strong>2NF</strong> — Must be 1NF + no partial dependencies. Every non-key column depends on the WHOLE primary key.</li>
<li><strong>3NF</strong> — Must be 2NF + no transitive dependencies. Non-key column A doesn't determine non-key column B.</li>
<li><strong>BCNF</strong> — Every determinant is a candidate key. Stricter than 3NF.</li>
</ol>
<pre><code>-- 3NF violation: (StudentID, CourseID) → Grade, but also CourseID → Instructor
-- Fix: separate Course table (CourseID, Instructor)

-- Denormalization: deliberately break normalization for performance
-- Store dept_name in employee table to avoid JOIN in frequent queries</code></pre>`
    },
    {
      tags: ['Execution plan', 'EXPLAIN', 'Query optimizer', 'Performance', 'Index usage'],
      q: 'What is an execution plan in a database?',
      s: 'The query optimizer\'s plan for executing SQL. Shows: table scan vs index scan, join order, estimated rows. Use EXPLAIN to view it and identify bottlenecks.',
      d: `<pre><code>-- MySQL EXPLAIN
EXPLAIN SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.email = 'alice@mail.com';

-- Key columns in EXPLAIN output:
-- type: ALL (full scan ← BAD) | ref/range/index (good)
-- key: which index used (NULL = no index)
-- rows: estimated rows examined
-- Extra: "Using filesort" (slow) | "Using index" (covering index, fast)

-- PostgreSQL EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT ...;
-- Shows actual vs estimated rows, actual execution time

-- Common fixes after seeing EXPLAIN:
-- type=ALL → add index on WHERE/JOIN column
-- Using filesort → add index on ORDER BY column</code></pre>`
    }
  ],

  maven: [
    {
      tags: ['Maven lifecycle', 'phases', 'validate compile test package install deploy'],
      q: 'What is the Maven lifecycle? Explain phases.',
      s: 'Default lifecycle: validate → compile → test → package → verify → install → deploy. Each phase triggers all previous. mvn package runs validate+compile+test+package.',
      d: `<pre><code># Default lifecycle phases:
validate  → check project structure is correct
compile   → compile src/main/java → target/classes
test      → run unit tests (src/test/java) using Surefire
package   → create JAR/WAR in target/
verify    → run integration tests, check quality
install   → copy JAR to ~/.m2/repository (local cache)
deploy    → upload JAR to remote repository (Nexus/Artifactory)

# Clean lifecycle:
clean → delete target/ directory

# Commands:
mvn compile                   # only compile
mvn test                      # compile + test
mvn package                   # compile + test + package
mvn clean package             # clean + compile + test + package
mvn clean install -DskipTests # skip tests for speed
mvn clean install             # full build + local cache</code></pre>`
    }
  ],

  serialization: [
    {
      tags: ['transient', 'keyword', 'exclude field', 'password', 'serialization'],
      q: 'What is the transient keyword?',
      s: 'transient marks a field to be EXCLUDED from serialization. After deserialization, transient fields are null/default. Used for passwords, Logger, DB connections, computed fields.',
      d: `<pre><code>class User implements Serializable {
    String username;
    transient String password;   // excluded — security sensitive
    transient Logger log;        // excluded — Logger not Serializable
    transient Connection conn;   // excluded — not needed after deserialize
    transient int cachedHash;    // excluded — can be recomputed
}

// After serialize → deserialize:
// username = "alice" (preserved)
// password = null  (transient — excluded)
// log      = null  (transient — excluded)

// Re-initialize transients in readObject():
private void readObject(ObjectInputStream ois)
    throws IOException, ClassNotFoundException {
    ois.defaultReadObject();
    this.log = LoggerFactory.getLogger(User.class); // re-init
}</code></pre>`
    }
  ],

  keywords: [
    {
      tags: ['this keyword', 'super keyword', 'current instance', 'parent class'],
      q: 'What is the this and super keyword?',
      s: 'this: refers to current class instance — disambiguates fields vs params, chaining constructors. super: refers to parent — calls parent constructor, accesses parent methods/fields.',
      d: `<pre><code>class Animal {
    String name;
    Animal(String name) { this.name = name; }
    void sound() { System.out.println("Animal sound"); }
}
class Dog extends Animal {
    String breed;
    Dog(String name, String breed) {
        super(name);          // MUST be first — calls Animal(String)
        this.breed = breed;   // this = current Dog instance
    }
    @Override void sound() {
        super.sound();        // calls Animal.sound()
        System.out.println("Woof! Breed: " + this.breed);
    }
    void chainConstructor() {
        this("Unknown","Mixed"); // calls another Dog constructor
    }
}</code></pre>`
    }
  ],

  interfaces: [
    {
      tags: ['functional interface toString', 'Object methods', 'SAM', 'still FI'],
      q: 'If a functional interface has a toString() method, is it still a functional interface?',
      s: 'YES. java.lang.Object methods (toString, equals, hashCode) are NOT counted as abstract methods. A @FunctionalInterface needs exactly ONE non-Object abstract method.',
      d: `<pre><code>@FunctionalInterface
interface Processor {
    void process(String data);   // SAM — counts as the one abstract method

    // Object methods — don't count toward abstract method count:
    String toString();           // OK — Object method
    boolean equals(Object o);    // OK — Object method
    int hashCode();              // OK — Object method

    // default methods — don't count
    default void validate() { }
}
// Valid! Can be used as lambda:
Processor p = data -&gt; System.out.println("Processing: " + data);</code></pre>`
    }
  ],

  exceptions: [
    {
      tags: ['finally scope', 'variable access', 'try catch blocks', 'scope rules'],
      q: 'What is the finally scope?',
      s: 'finally block has access to all variables in the enclosing method scope. Variables declared INSIDE try{} are NOT accessible in finally. finally always executes regardless of exception.',
      d: `<pre><code>public void demonstrate() {
    String outerVar = "accessible everywhere"; // in scope for try, catch, finally

    try {
        int innerVar = 10; // only in try block scope
        // innerVar accessible here only
    } catch (Exception e) {
        // outerVar ✅ accessible
        // innerVar ❌ not accessible
    } finally {
        System.out.println(outerVar); // ✅ accessible
        // innerVar ❌ not accessible
        // always runs: even if return/exception in try/catch
    }
}
// finally runs: on normal completion, exception, return
// finally does NOT run: System.exit() or JVM crash</code></pre>`
    }
  ],

  'stream-coding': [
    {
      tags: ['filter', 'even numbers', 'sum', '100 numbers', 'IntStream'],
      q: 'Given a stream of 100 numbers, filter even numbers and find their sum',
      s: 'IntStream.rangeClosed(1,100).filter(n->n%2==0).sum() = 2550. Or list.stream().filter(even).mapToInt().sum().',
      d: `<pre><code>// Direct with IntStream
int sum = IntStream.rangeClosed(1, 100)
    .filter(n -&gt; n % 2 == 0)
    .sum();
System.out.println(sum); // 2550

// From a List&lt;Integer&gt;
List&lt;Integer&gt; numbers = IntStream.rangeClosed(1, 100)
    .boxed().collect(Collectors.toList());

int sum2 = numbers.stream()
    .filter(n -&gt; n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum(); // 2550

// With reduce
int sum3 = numbers.stream()
    .filter(n -&gt; n % 2 == 0)
    .reduce(0, Integer::sum); // 2550</code></pre>`
    }
  ]
}

export default FINAL_EXTRA2
