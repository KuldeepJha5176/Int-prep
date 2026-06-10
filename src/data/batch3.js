const BATCH3 = {

  // ── Annotations → add to keywords section ─────────────────────────
  keywords: [
    {
      tags: ['Annotations', 'Java', 'What are', 'Metadata', '@Override', '@Retention'],
      q: 'What are annotations in Java?',
      s: 'Annotations are metadata attached to classes, methods, fields, or parameters. They don\'t change program logic directly but are read by compiler, build tools, or frameworks at compile/runtime via reflection.',
      d: `<pre><code>// Built-in annotations
@Override           // compiler: verify this overrides a parent method
@Deprecated         // compiler: warn callers this is old
@SuppressWarnings   // compiler: suppress specific warnings
@FunctionalInterface // compiler: enforce single abstract method

// Meta-annotations (annotate other annotations)
@Retention(RetentionPolicy.RUNTIME) // available at runtime via reflection
@Target(ElementType.METHOD)         // only on methods
@Documented                         // include in Javadoc
@Inherited                          // subclasses inherit it

// Framework annotations (read by Spring, JPA, Mockito at runtime)
@Component, @Service, @Entity, @Test, @Mock

// How they work internally:
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation { String value() default ""; }

class Demo {
    @MyAnnotation("hello")
    void greet() { }
}
// At runtime:
Method m = Demo.class.getMethod("greet");
MyAnnotation ann = m.getAnnotation(MyAnnotation.class);
System.out.println(ann.value()); // "hello"</code></pre>`
    },
    {
      tags: ['Custom Annotation', 'Create', '@interface', '@Retention', '@Target'],
      q: 'How do you create a custom annotation?',
      s: 'Use @interface keyword. Define @Retention (SOURCE/CLASS/RUNTIME) and @Target (METHOD/FIELD/TYPE etc.). Add elements with defaults. Process with reflection or annotation processor.',
      d: `<pre><code>// Step 1: Define the annotation
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME) // keep at runtime for reflection
@Target({ElementType.METHOD, ElementType.TYPE}) // where it can be applied
@Documented
public @interface Auditable {
    String action() default "UNKNOWN";
    boolean logArgs() default false;
}

// Step 2: Use it
@Service
class UserService {
    @Auditable(action = "DELETE_USER", logArgs = true)
    public void deleteUser(Long id) { ... }
}

// Step 3: Process it with AOP
@Aspect @Component
class AuditAspect {
    @Around("@annotation(auditable)")
    Object audit(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {
        System.out.println("Action: " + auditable.action());
        if (auditable.logArgs()) System.out.println("Args: " + Arrays.toString(pjp.getArgs()));
        return pjp.proceed();
    }
}

// Real-world custom annotations in Spring projects:
// @RateLimit, @Cacheable, @RequiresPermission, @Validated, @LogExecutionTime</code></pre>`
    }
  ],

  // ── Tricky Code Output → add to tricky section ────────────────────
  tricky: [
    {
      tags: ['Type Erasure', 'Generics overloading', 'Same erasure', 'Compile error'],
      q: 'Will this compile? — Type erasure with generics overloading',
      s: 'NO — COMPILE ERROR. After type erasure, both methods become process(List list). They have the same erasure — compiler cannot distinguish them.',
      d: `<pre><code>class Demo {
    public void process(List&lt;ArrayList&gt; list) {}  // erases to: process(List)
    public void process(List&lt;String&gt; list) {}     // erases to: process(List)
}
// COMPILE ERROR: name clash — both methods have the same erasure

// Why: generic type info is erased at bytecode level.
// Both methods become process(List) in bytecode — indistinguishable.

// Fix: use different method names or different non-generic parameter types
class Demo {
    public void processArrayLists(List&lt;ArrayList&gt; list) {}
    public void processStrings(List&lt;String&gt; list) {}
}

// Another valid fix: use different non-generic parameters
class Demo {
    public void process(List&lt;String&gt; list, String type) {}
    public void process(List&lt;ArrayList&gt; list, ArrayList type) {}
}</code></pre>`
    },
    {
      tags: ['Singleton Prototype', 'Spring', 'Injected once', 'Scoping trap', 'ServerA ServerB'],
      q: 'Singleton bean injecting Prototype bean — is the injected object singleton or prototype?',
      s: 'SINGLETON. Spring injects the prototype bean ONCE into the singleton at startup. The singleton holds that one instance forever — effectively making it singleton. Use @Lookup or ObjectProvider to get a new instance each time.',
      d: `<pre><code>@Component // Singleton (default)
class ServerA {
    @Autowired
    ServerB serverB; // injected ONCE at startup — stays the same instance!

    void doWork() {
        serverB.process(); // always same serverB object — NOT a new one!
    }
}

@Component
@Scope("prototype")
class ServerB { void process() { } }

// serverB in ServerA IS SINGLETON in behavior — only one instance created!

// Fix 1: @Lookup (Spring overrides the method to return new prototype each call)
@Component
class ServerA {
    @Lookup
    public ServerB getServerB() { return null; } // Spring overrides this

    void doWork() {
        getServerB().process(); // NOW gets new ServerB each call ✓
    }
}

// Fix 2: ObjectProvider (cleaner, Java-friendly)
@Component
class ServerA {
    @Autowired ObjectProvider&lt;ServerB&gt; serverBProvider;

    void doWork() {
        serverBProvider.getObject().process(); // new instance each time ✓
    }
}</code></pre>`
    },
    {
      tags: ['HashMap size', 'hashCode equals not overridden', 'Employee', 'Two objects', 'map.size()'],
      q: 'map.size() when two Employee objects with same fields are added WITHOUT overriding hashCode/equals?',
      s: 'map.size() = 2. Without overriding hashCode/equals, Object\'s default implementation uses reference identity — e1 and e2 are different objects, so they hash to different buckets.',
      d: `<pre><code>class Employee {
    int id; String name;
    Employee(int id, String name) { this.id=id; this.name=name; }
    // NO hashCode() or equals() override
}

Employee e1 = new Employee(1, "java");
Employee e2 = new Employee(1, "java");

Map&lt;Employee, String&gt; map = new HashMap&lt;&gt;();
map.put(e1, "java");
map.put(e2, "java");

System.out.println(map.size()); // 2 ← NOT 1!
// e1 and e2 are DIFFERENT objects in memory
// Object.hashCode() returns based on memory address → different hashes
// Object.equals() checks reference → e1 != e2

// Fix: override hashCode() and equals()
@Override public boolean equals(Object o) {
    if (!(o instanceof Employee)) return false;
    Employee e = (Employee) o;
    return this.id == e.id && this.name.equals(e.name);
}
@Override public int hashCode() { return Objects.hash(id, name); }

// After fix: map.size() = 1 (e2 overwrites e1's entry)</code></pre>`
    },
    {
      tags: ['TreeSet Employee', 'Comparing', 'compareTo', 'ClassCastException', 'Natural order'],
      q: 'What does TreeSet use for comparing Employee objects without Comparable/Comparator?',
      s: 'TreeSet calls compareTo() via Comparable. Employee doesn\'t implement it — ClassCastException at runtime on first add(). TreeSet REQUIRES elements to be Comparable or a Comparator must be provided.',
      d: `<pre><code>class Employee {
    int id; String name;
    // Does NOT implement Comparable
}

Set&lt;Employee&gt; se = new TreeSet&lt;&gt;();
se.add(e1); // throws ClassCastException!
// java.lang.ClassCastException: Employee cannot be cast to java.lang.Comparable

// Internally, TreeSet calls:
// ((Comparable&lt;Employee&gt;) e1).compareTo(e2)
// Employee doesn't implement Comparable → ClassCastException

// Fix 1: Implement Comparable in Employee
class Employee implements Comparable&lt;Employee&gt; {
    @Override public int compareTo(Employee o) { return Integer.compare(this.id, o.id); }
}

// Fix 2: Provide Comparator at TreeSet creation
Set&lt;Employee&gt; se = new TreeSet&lt;&gt;(Comparator.comparingInt(e -&gt; e.id));
se.add(e1); // OK — uses Comparator to compare
se.add(e2); // compared by id — if same id → treated as equal, not added</code></pre>`
    },
    {
      tags: ['hashCode always 1', 'HashMap size', 'Bucket collision', 'All same bucket'],
      q: 'If hashCode() always returns 1, what will map.size() be?',
      s: 'map.size() = number of DISTINCT keys by equals(). hashCode()=1 puts all entries in same bucket — but equals() still distinguishes keys. Performance degrades to O(n) — all in one bucket (linked list / tree).',
      d: `<pre><code>class Employee {
    int id; String name;
    @Override public int hashCode() { return 1; } // always same bucket!
    @Override public boolean equals(Object o) {
        if (!(o instanceof Employee)) return false;
        Employee e = (Employee) o;
        return id == e.id && name.equals(e.name);
    }
}

Employee e1 = new Employee(1, "Alice");
Employee e2 = new Employee(2, "Bob");
Employee e3 = new Employee(1, "Alice"); // same as e1

Map&lt;Employee, String&gt; map = new HashMap&lt;&gt;();
map.put(e1, "v1");
map.put(e2, "v2");
map.put(e3, "v3"); // same as e1 by equals() → overwrites e1

System.out.println(map.size()); // 2 (e1/e3 + e2)

// Performance impact:
// All keys hash to bucket 0 → HUGE linked list (or tree after 8 entries)
// put/get becomes O(n) instead of O(1) — HashMap degenerates to LinkedList!
// This is a hash collision attack vulnerability</code></pre>`
    }
  ],

  // ── Testing → add to testing section ──────────────────────────────
  testing: [
    {
      tags: ['JUnit 4 vs JUnit 5', 'Difference', 'Jupiter', 'Annotations', 'Architecture'],
      q: 'What is the difference between JUnit 4 vs JUnit 5?',
      s: 'JUnit 5 = Jupiter + Platform + Vintage. New annotations (@BeforeEach, @ExtendWith vs @RunWith). Better extension model, parameterized tests, @Nested, @DisplayName. Requires Java 8+.',
      d: `<table>
<tr><th>Feature</th><th>JUnit 4</th><th>JUnit 5</th></tr>
<tr><td>Annotation</td><td>@Before/@After</td><td>@BeforeEach/@AfterEach</td></tr>
<tr><td>Class setup</td><td>@BeforeClass/@AfterClass</td><td>@BeforeAll/@AfterAll</td></tr>
<tr><td>Skip</td><td>@Ignore</td><td>@Disabled</td></tr>
<tr><td>Extension</td><td>@RunWith(MockitoJUnitRunner)</td><td>@ExtendWith(MockitoExtension.class)</td></tr>
<tr><td>Expected exception</td><td>@Test(expected=Ex.class)</td><td>assertThrows()</td></tr>
<tr><td>Grouped tests</td><td>Not supported</td><td>@Nested</td></tr>
<tr><td>Parameterized</td><td>@RunWith(Parameterized)</td><td>@ParameterizedTest + @ValueSource</td></tr>
<tr><td>Display name</td><td>Not supported</td><td>@DisplayName("human readable")</td></tr>
<tr><td>Java requirement</td><td>Java 5+</td><td>Java 8+</td></tr>
</table>
<pre><code>// JUnit 4
@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Before public void setUp() { }
    @Test(expected = IllegalArgumentException.class)
    public void testThrows() { service.create(null); }
}

// JUnit 5
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @BeforeEach void setUp() { }
    @Test @DisplayName("Create with null throws IAE")
    void testThrows() {
        assertThrows(IllegalArgumentException.class, () -&gt; service.create(null));
    }
}</code></pre>`
    },
    {
      tags: ['Void method', 'Test', 'Mockito', 'verify', 'doNothing', 'side effects'],
      q: 'How do you test a method with a void return type?',
      s: 'Use verify() to check the method was called with expected args. Use doNothing()/doThrow() to stub void methods. Test side effects (state changes, interactions).',
      d: `<pre><code>// Method under test
@Service class EmailService {
    void sendWelcomeEmail(String email) {
        // sends email — no return value
        emailClient.send(new Email(email, "Welcome!"));
    }
}

// Test void method
@Test
void sendWelcomeEmail_validEmail_callsEmailClient() {
    // No return to assert — verify the interaction
    emailService.sendWelcomeEmail("alice@mail.com");

    verify(emailClient, times(1))       // called exactly once?
        .send(any(Email.class));         // with any Email object?

    // Capture the argument for detailed assertion
    ArgumentCaptor&lt;Email&gt; captor = ArgumentCaptor.forClass(Email.class);
    verify(emailClient).send(captor.capture());
    assertEquals("alice@mail.com", captor.getValue().getTo());
    assertEquals("Welcome!", captor.getValue().getSubject());
}

// Stubbing void method to throw:
doThrow(new MailException("SMTP down")).when(emailClient).send(any());
assertThrows(MailException.class, () -&gt; emailService.sendWelcomeEmail("a@b.com"));

// Stubbing void method to do nothing:
doNothing().when(emailClient).send(any()); // default behavior for mocks</code></pre>`
    },
    {
      tags: ['Static method', 'JUnit', 'Mockito', 'MockedStatic', 'PowerMock'],
      q: 'How do you test a static method in JUnit/Mockito?',
      s: 'Mockito 3.4+: MockedStatic<T>. Use try-with-resources. For older Mockito use PowerMockito. Best practice: wrap static calls in non-static methods to keep testable.',
      d: `<pre><code>// Static method to test
class DateUtils {
    static LocalDate today() { return LocalDate.now(); }
}

// Mockito 3.4+ — MockedStatic
@Test
void testWithMockedStatic() {
    LocalDate fakeDate = LocalDate.of(2024, 1, 15);

    try (MockedStatic&lt;DateUtils&gt; mocked = Mockito.mockStatic(DateUtils.class)) {
        mocked.when(DateUtils::today).thenReturn(fakeDate);

        // Act
        String result = myService.getGreeting(); // internally calls DateUtils.today()

        // Assert
        assertEquals("Hello! Today is 2024-01-15", result);
        mocked.verify(DateUtils::today, times(1));
    } // MockedStatic auto-closes — static method restored to real impl
}

// MockedStatic for Java.time:
try (MockedStatic&lt;LocalDate&gt; mocked = Mockito.mockStatic(LocalDate.class)) {
    mocked.when(LocalDate::now).thenReturn(LocalDate.of(2024,1,1));
    // test code that calls LocalDate.now()
}

// Best practice: avoid static method dependencies — wrap them
@Component class DateProvider { LocalDate today() { return LocalDate.now(); } }
// Now you can @Mock DateProvider in tests — no MockedStatic needed</code></pre>`
    }
  ],

  // ── JPA → add to jpa section ──────────────────────────────────────
  jpa: [
    {
      tags: ['Derived Query Methods', 'Repository', 'Method name', 'Keywords', 'Spring Data JPA'],
      q: 'What are JPA Repository derived query methods?',
      s: 'Spring Data JPA generates SQL from method names. Keywords: findBy, countBy, existsBy, deleteBy + field names + And/Or/Between/LessThan/GreaterThan/Like/OrderBy/IgnoreCase/In.',
      d: `<pre><code>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // findBy + field
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByAge(int age);

    // Multiple conditions
    List&lt;User&gt; findByAgeAndActive(int age, boolean active);
    List&lt;User&gt; findByAgeOrEmail(int age, String email);

    // Comparison keywords
    List&lt;User&gt; findByAgeGreaterThan(int age);      // WHERE age > ?
    List&lt;User&gt; findByAgeLessThanEqual(int age);    // WHERE age <= ?
    List&lt;User&gt; findByAgeBetween(int min, int max); // WHERE age BETWEEN ? AND ?

    // String operations
    List&lt;User&gt; findByNameContaining(String part);        // WHERE name LIKE %?%
    List&lt;User&gt; findByNameStartingWith(String prefix);    // WHERE name LIKE ?%
    List&lt;User&gt; findByNameIgnoreCase(String name);        // WHERE LOWER(name) = LOWER(?)

    // Collection
    List&lt;User&gt; findByRoleIn(List&lt;String&gt; roles);         // WHERE role IN (?,?,?)

    // Existence and count
    boolean existsByEmail(String email);
    long countByActive(boolean active);

    // Sort
    List&lt;User&gt; findByActiveOrderByNameAsc(boolean active);

    // Limit
    List&lt;User&gt; findTop5ByActiveOrderBySalaryDesc(boolean active);
    Optional&lt;User&gt; findFirstByOrderByCreatedAtDesc(); // most recent

    // Delete
    void deleteByActive(boolean active);
}</code></pre>`
    }
  ],

  // ── REST → add to rest section ─────────────────────────────────────
  rest: [
    {
      tags: ['PUT vs PATCH', 'Depth', 'Real use case', 'Idempotent', 'Partial update'],
      q: 'What is the difference between PUT and PATCH in depth with real use case?',
      s: 'PUT replaces the ENTIRE resource — all fields required. PATCH partially updates — only send changed fields. PUT is always idempotent. PATCH should be but spec doesn\'t require it.',
      d: `<h4>PUT — Replace entire resource</h4>
<pre><code>// Entity in DB: {id:1, name:"Alice", email:"alice@old.com", age:25, role:"USER"}

// PUT request — MUST send ALL fields
PUT /api/users/1
{
  "name": "Alice Updated",
  "email": "alice@new.com",
  "age": 26,
  "role": "USER"   // if you forget this, role becomes null!
}

// Spring implementation
@PutMapping("/users/{id}")
ResponseEntity&lt;UserDto&gt; update(@PathVariable Long id, @RequestBody @Valid UserDto dto) {
    User user = repo.findById(id).orElseThrow();
    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setAge(dto.getAge());
    user.setRole(dto.getRole());
    return ResponseEntity.ok(mapper.toDto(repo.save(user)));
}</code></pre>

<h4>PATCH — Partial update</h4>
<pre><code>// PATCH request — only send what changed
PATCH /api/users/1
{ "email": "alice@new.com" }
// name, age, role remain unchanged!

// Spring implementation with Map or Optional fields
@PatchMapping("/users/{id}")
ResponseEntity&lt;UserDto&gt; patch(@PathVariable Long id, @RequestBody Map&lt;String,Object&gt; updates) {
    User user = repo.findById(id).orElseThrow();
    if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
    if (updates.containsKey("name"))  user.setName((String) updates.get("name"));
    if (updates.containsKey("age"))   user.setAge((Integer) updates.get("age"));
    return ResponseEntity.ok(mapper.toDto(repo.save(user)));
}

// Better: use JsonMergePatch or Jackson ObjectMapper.readerForUpdating()</code></pre>

<h4>Real-world example</h4>
<table>
<tr><th>Scenario</th><th>Method</th><th>Why</th></tr>
<tr><td>Update user profile form (all fields visible)</td><td>PUT</td><td>All fields submitted</td></tr>
<tr><td>Toggle dark mode setting</td><td>PATCH</td><td>Only one field changes</td></tr>
<tr><td>Change order status</td><td>PATCH</td><td>Only status field</td></tr>
<tr><td>Replace entire product data</td><td>PUT</td><td>Full replacement</td></tr>
</table>
<table>
<tr><th>Feature</th><th>PUT</th><th>PATCH</th></tr>
<tr><td>Fields required</td><td>All (full representation)</td><td>Only changed fields</td></tr>
<tr><td>Idempotent</td><td>Yes (same result every time)</td><td>Usually (not spec required)</td></tr>
<tr><td>Missing fields</td><td>Set to null/default</td><td>Unchanged</td></tr>
<tr><td>Bandwidth</td><td>Higher (full object)</td><td>Lower (partial)</td></tr>
</table>`
    }
  ]
}

export default BATCH3
