const SPRING_EXTRA2 = {
  'spring-core': [
    {
      tags: ['Without @SpringBootApplication', 'Manual Config', 'Possible', 'Yes'],
      q: 'Can a Spring Boot application run without @SpringBootApplication annotation?',
      s: 'Yes — use @Configuration + @EnableAutoConfiguration + @ComponentScan separately, or just @Configuration with manual bean setup. @SpringBootApplication is just a convenience shortcut.',
      d: `<pre><code>// Without @SpringBootApplication — manually compose it:
@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.app")
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

// Or minimal — just @Configuration, no auto-config:
@Configuration
public class ManualApp {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx =
            new AnnotationConfigApplicationContext(ManualApp.class);
        ctx.getBean(MyService.class).run();
    }
    @Bean MyService myService() { return new MyService(); }
}</code></pre>`
    },
    {
      tags: ['Spring Boot Disadvantages', 'Overhead', 'Opinionated', 'Startup Time'],
      q: 'What are the disadvantages of Spring Boot?',
      s: 'Heavy JAR size, slow startup (improving with Spring Native), magic auto-configuration is hard to debug, opinionated defaults may not fit all use cases, version conflicts.',
      d: `<ol>
<li><strong>Large JAR size.</strong> Fat JAR includes all dependencies — can be 50MB+ even for small apps.</li>
<li><strong>Slower startup.</strong> Auto-configuration scanning and bean initialization is slow for large apps. (Mitigated by Spring Native/GraalVM.)</li>
<li><strong>Auto-configuration magic.</strong> Hard to debug "why is this bean configured?" when dozens of auto-configs are applied.</li>
<li><strong>Opinionated defaults.</strong> May not suit every use case — overriding defaults requires deeper Spring knowledge.</li>
<li><strong>Memory overhead.</strong> Embedded Tomcat + full Spring context consumes more memory than lightweight frameworks (Micronaut, Quarkus).</li>
</ol>`
    },
    {
      tags: ['@AutoConfiguration', '@Configuration', 'Difference', 'Spring Boot 2.7'],
      q: 'Difference between @AutoConfiguration and @Configuration',
      s: '@Configuration: general bean definition class. @AutoConfiguration (Spring Boot 2.7+): marks a class as an auto-configuration entry — loaded via spring.factories or spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports.',
      d: `<pre><code>// @Configuration — general purpose, always loaded if scanned
@Configuration
class MyConfig {
    @Bean DataSource dataSource() { ... }
}

// @AutoConfiguration — auto-config, conditional, loaded by Spring Boot's mechanism
@AutoConfiguration
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(DataSource.class)
class DataSourceAutoConfiguration {
    @Bean DataSource dataSource() { return new HikariDataSource(); }
}
// Registered in: META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports

// @EnableAutoConfiguration — triggers loading of all AutoConfiguration classes
// @AutoConfiguration — marks a class AS one of those auto-configurations</code></pre>`
    },
    {
      tags: ['Prototype Default', 'All Beans', '@Scope', 'BeanFactoryPostProcessor'],
      q: 'How to make Prototype the default scope for all beans in Spring?',
      s: 'Not directly supported. Workaround: custom BeanFactoryPostProcessor that iterates all BeanDefinitions and sets scope to prototype. Or use @Scope("prototype") on each bean.',
      d: `<pre><code>// Custom BeanFactoryPostProcessor to make all beans prototype
@Component
public class PrototypeScopePostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory bf) {
        for (String name : bf.getBeanDefinitionNames()) {
            BeanDefinition bd = bf.getBeanDefinition(name);
            bd.setScope(BeanDefinition.SCOPE_PROTOTYPE);
        }
    }
}

// Practical note: Usually you just annotate individual beans:
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
class MyPrototypeBean { }</code></pre>`
    },
    {
      tags: ['@Service', 'Stereotype', 'Business Layer', 'Spring'],
      q: 'What is @Service annotation?',
      s: '@Service is a specialization of @Component for the service/business layer. No extra behavior beyond component scanning — purely semantic, indicating this class holds business logic.',
      d: `<pre><code>@Service  // signals: business logic layer
public class OrderService {
    @Autowired private OrderRepository repo;
    @Autowired private PaymentService payment;

    @Transactional
    public Order placeOrder(OrderRequest req) {
        // business logic here
        return repo.save(new Order(req));
    }
}
// @Service = @Component + semantic meaning
// Spring's @Repository adds exception translation
// @Service adds no extra Spring behavior — just clarity</code></pre>`
    }
  ],

  rest: [
    {
      tags: ['RESTful Best Practices', 'Resource naming', 'Versioning', 'Status codes'],
      q: 'How does a RESTful API look? What are best practices?',
      s: 'Noun-based URIs (/users/1), HTTP verbs for actions, proper status codes (200/201/404/400), versioning, JSON responses, HATEOAS optional, stateless, pagination.',
      d: `<ol>
<li><strong>Use nouns, not verbs.</strong> <code>/users/1</code> not <code>/getUser?id=1</code></li>
<li><strong>HTTP verbs for actions.</strong> GET=read, POST=create, PUT=replace, PATCH=partial update, DELETE=remove.</li>
<li><strong>Correct status codes.</strong> 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.</li>
<li><strong>Version your API.</strong> <code>/api/v1/users</code> or Accept header.</li>
<li><strong>Use plural nouns.</strong> <code>/users</code> not <code>/user</code></li>
<li><strong>Pagination and filtering.</strong> <code>GET /users?page=0&size=20&sort=name</code></li>
<li><strong>Consistent error format.</strong> <code>{"status":404,"message":"User not found","timestamp":"..."}</code></li>
</ol>
<pre><code>GET    /api/v1/users         → list all
POST   /api/v1/users         → create
GET    /api/v1/users/1       → get by id
PUT    /api/v1/users/1       → replace
PATCH  /api/v1/users/1       → partial update
DELETE /api/v1/users/1       → delete</code></pre>`
    },
    {
      tags: ['@PreAuthorize', 'hasRole', 'Authorization', 'Method Security', 'SpEL'],
      q: 'What is @PreAuthorize? Is hasRole authentication or authorization?',
      s: '@PreAuthorize is METHOD-level authorization — checks expression before method executes. hasRole() checks AUTHORIZATION (what you\'re allowed to do, after authentication).',
      d: `<pre><code>// Enable method security
@EnableMethodSecurity // Spring Security 6 (or @EnableGlobalMethodSecurity)

// @PreAuthorize — runs BEFORE method, blocks if false
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { ... }

@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public List&lt;User&gt; getAllUsers() { ... }

@PreAuthorize("hasRole('USER') and #id == authentication.principal.id")
public User getMyProfile(Long id) { ... } // user can only access own profile

// @PostAuthorize — runs AFTER method, useful for returning data
@PostAuthorize("returnObject.owner == authentication.name")
public Document getDocument(Long id) { ... }

// hasRole → AUTHORIZATION (what you can do)
// Authentication = WHO you are (login phase)
// Authorization  = WHAT you can do (access control phase)</code></pre>`
    }
  ],

  jpa: [
    {
      tags: ['Spring JPA Annotations', 'Common', '@Entity', '@Query', '@Transactional'],
      q: 'What annotations do you often use for Spring JPA?',
      s: '@Entity, @Table, @Id, @GeneratedValue, @Column, @ManyToOne, @OneToMany, @JoinColumn, @Query, @Transactional, @Repository, @Modifying, @Param, @Embedded.',
      d: `<table>
<tr><th>Annotation</th><th>Purpose</th></tr>
<tr><td>@Entity</td><td>Marks class as JPA managed entity</td></tr>
<tr><td>@Table(name="...")</td><td>Specifies DB table name</td></tr>
<tr><td>@Id + @GeneratedValue</td><td>Primary key + auto-increment strategy</td></tr>
<tr><td>@Column(nullable=false)</td><td>Column constraints</td></tr>
<tr><td>@ManyToOne / @OneToMany</td><td>Relationship mapping</td></tr>
<tr><td>@JoinColumn(name="fk_id")</td><td>Foreign key column</td></tr>
<tr><td>@Query("JPQL...")</td><td>Custom JPQL or native query</td></tr>
<tr><td>@Modifying + @Transactional</td><td>For UPDATE/DELETE @Query methods</td></tr>
<tr><td>@Param("name")</td><td>Named parameter binding</td></tr>
<tr><td>@Transient</td><td>Field not persisted to DB</td></tr>
<tr><td>@Embedded / @Embeddable</td><td>Embed value objects (Address in User)</td></tr>
</table>`
    },
    {
      tags: ['CrudRepository', 'PagingAndSortingRepository', 'extends', 'Hierarchy'],
      q: 'Does CrudRepository extend PaginationAndSortingRepository?',
      s: 'No — it\'s the opposite. PagingAndSortingRepository extends CrudRepository. JpaRepository extends PagingAndSortingRepository. So: CrudRepo ← PagingRepo ← JpaRepo.',
      d: `<pre><code>// Spring Data JPA hierarchy:
Repository (marker)
  └── CrudRepository&lt;T,ID&gt;   ← save, findById, findAll, delete, count
        └── PagingAndSortingRepository&lt;T,ID&gt; ← findAll(Sort), findAll(Pageable)
              └── JpaRepository&lt;T,ID&gt;  ← flush, saveAndFlush, deleteAllInBatch

// PagingAndSortingRepository EXTENDS CrudRepository — NOT the other way!
// So JpaRepository has all CRUD + Paging + JPA-specific methods</code></pre>`
    },
    {
      tags: ['Native SQL', 'JOIN', '@Query', 'nativeQuery', 'Spring JPA'],
      q: 'How to write native SQL queries with JOIN in Spring JPA?',
      s: 'Use @Query(value="SELECT...", nativeQuery=true). For JOINs returning partial data, use interface projections or Class-based DTO projections.',
      d: `<pre><code>// Native SQL with JOIN
@Query(value = """
    SELECT u.id, u.name, d.dept_name
    FROM users u
    INNER JOIN departments d ON u.dept_id = d.id
    WHERE d.dept_name = :deptName
    """, nativeQuery = true)
List&lt;Object[]&gt; findUsersByDept(@Param("deptName") String deptName);

// Better: interface projection
interface UserDeptView {
    Long getId();
    String getName();
    String getDeptName();
}
@Query(value = "SELECT u.id, u.name, d.dept_name AS deptName FROM users u JOIN departments d ON u.dept_id=d.id WHERE d.dept_name=:dept", nativeQuery=true)
List&lt;UserDeptView&gt; findByDept(@Param("dept") String dept);

// JPQL (non-native, object-oriented)
@Query("SELECT u FROM User u JOIN u.department d WHERE d.name = :name")
List&lt;User&gt; findByDeptNameJPQL(@Param("name") String name);</code></pre>`
    },
    {
      tags: ['@Primary', 'Spring', 'Multiple Beans', 'Default', 'Use case'],
      q: 'What is the use of @Primary annotation in Spring?',
      s: '@Primary marks the default bean when multiple implementations of the same type exist. Spring injects the @Primary bean automatically when no @Qualifier is specified.',
      d: `<pre><code>interface MessageService { void send(String msg); }

@Service @Primary  // default when no @Qualifier specified
class EmailService implements MessageService { ... }

@Service
class SmsService implements MessageService { ... }

// Injection — gets EmailService (Primary)
@Autowired MessageService service; // EmailService injected

// Override with @Qualifier
@Autowired @Qualifier("smsService")
MessageService service; // SmsService injected</code></pre>`
    },
    {
      tags: ['findByName', 'findById', 'Derived Query', 'JPA Repository', 'Method Name'],
      q: 'What is findByName / findById in Spring JPA?',
      s: 'Derived query methods — Spring Data JPA generates SQL from method name. findById is provided by CrudRepository. findByName generates "WHERE name = :name" automatically.',
      d: `<pre><code>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // Built-in from CrudRepository:
    Optional&lt;User&gt; findById(Long id); // WHERE id = ?

    // Derived queries — Spring generates SQL:
    Optional&lt;User&gt; findByName(String name);         // WHERE name = ?
    List&lt;User&gt; findByEmail(String email);            // WHERE email = ?
    List&lt;User&gt; findByAgeGreaterThan(int age);        // WHERE age > ?
    List&lt;User&gt; findByNameAndEmail(String n, String e); // WHERE name=? AND email=?
    boolean existsByEmail(String email);              // SELECT COUNT(*) > 0
    long countByDepartment(String dept);              // SELECT COUNT(*)

    // Keywords: By, And, Or, Is, Not, Like, Between, GreaterThan, LessThan, OrderBy
}</code></pre>`
    },
    {
      tags: ['Spring Data JPA', 'What is', 'Repository', 'Abstraction', 'JPA'],
      q: 'What is Spring Data JPA?',
      s: 'Spring Data JPA is a Spring module that abstracts the JPA data access layer. Provides Repository interfaces (CrudRepository, JpaRepository) that auto-generate CRUD operations — no boilerplate DAO code needed.',
      d: `<p>Before Spring Data JPA — you wrote EntityManager, TypedQuery, transaction management manually for every DAO. Spring Data JPA eliminates this:</p>
<pre><code>// Without Spring Data JPA (verbose)
@Repository
class UserDao {
    @PersistenceContext EntityManager em;
    User findById(Long id) {
        return em.find(User.class, id);
    }
}

// With Spring Data JPA — just declare an interface!
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // Spring generates ALL implementations automatically
}
// Instantly get: save, findById, findAll, delete, count, pagination, sorting...
</code></pre>
<p><strong>Spring Data JPA</strong> = abstraction on top of JPA. JPA = spec. Hibernate = JPA implementation. Spring Data JPA = repository layer on top of JPA.</p>`
    },
    {
      tags: ['@JoinTable', '@JoinColumn', 'ManyToMany', 'FK', 'Association Table'],
      q: 'What are @JoinTable and @JoinColumn?',
      s: '@JoinColumn: defines the FK column in owning entity table. @JoinTable: defines junction/association table for @ManyToMany relationships.',
      d: `<pre><code>// @JoinColumn — FK column in employee table (owning side)
@Entity class Employee {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id",  // FK column name
                referencedColumnName = "id",
                nullable = false)
    private Department department;
}

// @JoinTable — for ManyToMany (creates student_course junction table)
@Entity class Student {
    @ManyToMany
    @JoinTable(
        name = "student_course",           // junction table name
        joinColumns = @JoinColumn(name = "student_id"),  // FK to Student
        inverseJoinColumns = @JoinColumn(name = "course_id") // FK to Course
    )
    private List&lt;Course&gt; courses;
}
// Creates: student_course(student_id FK, course_id FK)</code></pre>`
    },
    {
      tags: ['@Data', '@Entity', 'Lombok', 'JPA', 'Caution'],
      q: 'What are @Data and @Entity (Lombok/JPA) annotations?',
      s: '@Entity (JPA): marks class as DB entity. @Data (Lombok): generates getters, setters, equals, hashCode, toString. Warning: @Data + @Entity can cause issues — Lombok\'s equals/hashCode conflicts with JPA proxy.',
      d: `<pre><code>// @Entity (JPA) — marks class as a managed entity
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue Long id;
    String name;
    double price;
}

// @Data (Lombok) — generates boilerplate
@Data  // = @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
public class ProductDto {
    private String name;
    private double price;
}

// WARNING: Don't use @Data on @Entity classes!
// Lombok's hashCode() uses all fields → JPA lazy proxies cause issues
// Use @Getter @Setter on entities, manually define equals/hashCode on @Id

@Entity
@Getter @Setter // safe for entities
@NoArgsConstructor @AllArgsConstructor
public class Product { ... }</code></pre>`
    }
  ],

  testing: [
    {
      tags: ['Cucumber', 'BDD', 'Gherkin', 'Feature file', 'Step Definition'],
      q: 'Are you familiar with Cucumber?',
      s: 'Cucumber is a BDD framework using Gherkin syntax (Given-When-Then). Feature files describe behavior in plain English. Step definitions in Java connect Gherkin to code.',
      d: `<pre><code># login.feature
Feature: User Login
  Scenario: Successful login with valid credentials
    Given the user has registered with "alice@mail.com" and password "secret"
    When they submit login form with "alice@mail.com" and "secret"
    Then they should be redirected to the dashboard
    And they should see "Welcome, Alice"

// Step definitions (Java)
@Given("the user has registered with {string} and password {string}")
public void userRegistered(String email, String password) {
    userService.register(email, password);
}

@When("they submit login form with {string} and {string}")
public void submitLogin(String email, String password) {
    response = authService.login(email, password);
}

@Then("they should be redirected to the dashboard")
public void verifyDashboard() {
    assertEquals(200, response.getStatus());
}</code></pre>`
    },
    {
      tags: ['JUnit', 'Purpose', 'Unit Testing', 'Framework', 'Annotations'],
      q: 'What is JUnit? What is the use of JUnit?',
      s: 'JUnit is a Java unit testing framework. Used to write, run, and report tests. Ensures individual methods work correctly in isolation. Foundation of TDD in Java.',
      d: `<pre><code>// JUnit 5 basic test
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository repo;
    @InjectMocks UserService service;

    @Test
    @DisplayName("Should find user by valid ID")
    void findUserById_success() {
        // Arrange
        when(repo.findById(1L)).thenReturn(Optional.of(new User("Alice")));

        // Act
        User result = service.getUser(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Alice", result.getName());
    }
}
// Use: verify individual units (methods/classes) work correctly
// Fast feedback, regression detection, documentation as tests</code></pre>`
    },
    {
      tags: ['JUnit Assertions', 'assertEquals', 'assertNull', 'assertThrows', 'assertTrue'],
      q: 'What are the types of assertions in JUnit? Explain assertEquals and others.',
      s: 'assertEquals, assertNotEquals, assertTrue, assertFalse, assertNull, assertNotNull, assertThrows, assertAll, assertArrayEquals, assertIterableEquals, assertTimeout.',
      d: `<pre><code>// Equality
assertEquals(expected, actual);            // expected == actual
assertNotEquals("x", result);

// Boolean
assertTrue(result.isPresent());
assertFalse(list.isEmpty());

// Null checks
assertNull(service.find(999L));
assertNotNull(user);

// Exceptions
assertThrows(IllegalArgumentException.class, () -> service.create(null));

// Collections
assertArrayEquals(new int[]{1,2,3}, arr);
assertIterableEquals(List.of("a","b"), result);

// Multiple assertions (all run even if one fails)
assertAll("user checks",
    () -> assertEquals("Alice", user.getName()),
    () -> assertEquals(25, user.getAge()),
    () -> assertNotNull(user.getEmail())
);

// Timeout
assertTimeout(Duration.ofSeconds(1), () -> service.process());</code></pre>`
    },
    {
      tags: ['assertEquals vs assertTrue', 'Better Failure Message', 'Preferred'],
      q: 'Why prefer assertEquals(expected, actual) over assertTrue?',
      s: 'assertEquals gives a better failure message showing both expected and actual values. assertTrue just says "expected true but was false" — no context about what the value was.',
      d: `<pre><code>// assertTrue — unhelpful on failure:
assertTrue(user.getName().equals("Alice"));
// Failure: "expected: &lt;true&gt; but was: &lt;false&gt;" — what WAS the name?

// assertEquals — clear failure message:
assertEquals("Alice", user.getName());
// Failure: "expected: &lt;Alice&gt; but was: &lt;Bob&gt;" — immediately clear!

// Same issue:
assertTrue(list.size() == 3);      // "expected true, was false"
assertEquals(3, list.size());      // "expected 3, but was 5"

// Rule: use the most specific assertion available
assertNull vs assertTrue(x == null)
assertThrows vs try-catch
assertIterableEquals vs assertEquals(list1, list2)</code></pre>`
    },
    {
      tags: ['@Disabled', 'Disable Test', 'Skip', 'JUnit 5'],
      q: 'How to disable a method in JUnit?',
      s: '@Disabled (JUnit 5) or @Ignore (JUnit 4). Can be applied to test class or individual method. Provide a reason string to explain why it\'s disabled.',
      d: `<pre><code>// JUnit 5 — disable single test
@Test
@Disabled("Flaky test — fixed in JIRA-123, re-enable after deploy")
void testPaymentGateway() { ... }

// JUnit 5 — disable entire class
@Disabled("Integration tests — skip in unit test phase")
class IntegrationTests { ... }

// JUnit 4
@Test @Ignore("Not implemented yet")
void testFeature() { ... }

// Conditional disabling (JUnit 5)
@Test
@EnabledOnOs(OS.LINUX)
void linuxOnlyTest() { ... }

@Test
@EnabledIfSystemProperty(named = "env", matches = "staging")
void stagingTest() { ... }</code></pre>`
    },
    {
      tags: ['Shared Object', '@BeforeAll', 'static', 'Test Setup', 'Shared State'],
      q: 'If you want a shared object in tests, where should it be created?',
      s: '@BeforeAll (static) for expensive shared setup (DB connection, test container). @BeforeEach for per-test fresh instances. Never share mutable state across tests.',
      d: `<pre><code>@ExtendWith(SpringExtension.class)
class UserServiceTest {
    // Shared, expensive — created once for ALL tests
    @BeforeAll
    static void setupOnce() {
        // e.g., start test container, load config file
    }

    // Per-test fresh instance — reset state between tests
    @BeforeEach
    void setUp() {
        userService = new UserService(mock(UserRepository.class));
    }

    // Shared immutable state — safe to share
    static final String VALID_EMAIL = "test@mail.com";
    static final User SAMPLE_USER = new User("Alice", VALID_EMAIL);
}
// Rule: share IMMUTABLE or EXPENSIVE-TO-CREATE objects
// Isolate MUTABLE state — create fresh per test</code></pre>`
    },
    {
      tags: ['Unit Testing', 'Core Principle', 'FIRST', 'Isolation', 'Fast'],
      q: 'What is the main core principle of unit testing?',
      s: 'FIRST: Fast, Isolated/Independent, Repeatable, Self-validating, Timely. Test ONE unit in isolation. No side effects. Same result every run. Tests should be the specification.',
      d: `<ol>
<li><strong>Fast.</strong> Run in milliseconds — mock all I/O. Thousands of tests in seconds.</li>
<li><strong>Isolated.</strong> Each test is independent — no shared mutable state, no test ordering dependencies.</li>
<li><strong>Repeatable.</strong> Same result every run — no random data, no real time dependencies.</li>
<li><strong>Self-validating.</strong> Pass or fail automatically — no manual inspection.</li>
<li><strong>Timely.</strong> Write tests alongside or before the code (TDD).</li>
</ol>
<p><strong>Core:</strong> Test ONE unit of behavior. One test should have ONE reason to fail. Arrange-Act-Assert structure.</p>`
    },
    {
      tags: ['Debug API Performance', 'Profiling', 'Slow endpoint', 'N+1', 'Logging'],
      q: 'How do you debug API performance issues?',
      s: 'Enable slow query logging, use Actuator /metrics, APM tools (Datadog/New Relic), check N+1 queries, add @Timed, analyze thread dumps, use distributed tracing (Zipkin).',
      d: `<ol>
<li><strong>Spring Boot Actuator</strong> — <code>/actuator/metrics/http.server.requests</code> shows per-endpoint latency.</li>
<li><strong>Slow query log</strong> — MySQL/PostgreSQL slow query log to find DB bottlenecks.</li>
<li><strong>N+1 query detection</strong> — Hibernate's <code>hibernate.show_sql=true</code>, or Hypersistence Optimizer.</li>
<li><strong>APM tools</strong> — Datadog, New Relic, Dynatrace for production profiling with flamegraphs.</li>
<li><strong>Distributed tracing</strong> — Spring Cloud Sleuth + Zipkin to trace request across microservices.</li>
<li><strong>Thread dump analysis</strong> — <code>/actuator/threaddump</code> to find blocked/waiting threads.</li>
<li><strong>Profilers</strong> — VisualVM, JProfiler, Async-profiler for CPU/memory hotspots.</li>
</ol>`
    }
  ],

  microservices: [
    {
      tags: ['Other Concepts', 'Microservices', 'Config Server', 'Distributed Tracing', 'Resilience'],
      q: 'What are the other concepts/features needed in a microservice environment?',
      s: 'Config Server (centralized config), Distributed Tracing (Sleuth+Zipkin), Circuit Breaker (Resilience4j), Centralized Logging (ELK), Service Mesh (Istio), Distributed Transactions (Saga).',
      d: `<ol>
<li><strong>Config Server</strong> — Spring Cloud Config Server: centralize all microservice configs in one Git repo.</li>
<li><strong>Distributed Tracing</strong> — Spring Cloud Sleuth + Zipkin: trace requests across services with correlation ID.</li>
<li><strong>Circuit Breaker</strong> — Resilience4j: prevent cascade failures when a service is down.</li>
<li><strong>Centralized Logging</strong> — ELK Stack (Elasticsearch + Logstash + Kibana) or EFK.</li>
<li><strong>Service Mesh</strong> — Istio/Linkerd: handle traffic management, mTLS, observability at infrastructure level.</li>
<li><strong>Distributed Transactions</strong> — Saga pattern (choreography or orchestration) for cross-service consistency.</li>
<li><strong>Message Broker</strong> — Kafka/RabbitMQ for async inter-service communication.</li>
</ol>`
    },
    {
      tags: ['Inter-service Communication', 'REST', 'gRPC', 'Kafka', 'Feign', 'Async'],
      q: 'What is inter-service communication in microservices?',
      s: 'Synchronous: REST (Feign Client), gRPC (protobuf, faster). Asynchronous: Message brokers (Kafka, RabbitMQ). Choice depends on latency requirements and coupling preference.',
      d: `<table>
<tr><th>Type</th><th>Technology</th><th>When to use</th></tr>
<tr><td>Sync REST</td><td>Feign Client, RestTemplate, WebClient</td><td>Real-time query, immediate response needed</td></tr>
<tr><td>Sync gRPC</td><td>Protocol Buffers</td><td>High-performance internal calls, binary protocol</td></tr>
<tr><td>Async Events</td><td>Kafka, RabbitMQ, AWS SQS</td><td>Notifications, eventual consistency, fire-and-forget</td></tr>
<tr><td>GraphQL</td><td>Spring GraphQL</td><td>Flexible queries from frontend</td></tr>
</table>
<pre><code>// Feign Client (sync)
@FeignClient("order-service") interface OrderClient {
    @GetMapping("/orders/{id}") OrderDto getOrder(@PathVariable Long id);
}

// Kafka (async)
@KafkaListener(topics = "order-placed")
void handleOrder(OrderEvent event) { updateInventory(event); }</code></pre>`
    }
  ],

  'stream-coding': [
    {
      tags: ['Transaction', 'Item IDs', 'Count occurrences', 'groupingBy', 'Stream'],
      q: 'Count occurrences of specific item IDs from a list of transactions using Streams',
      s: 'flatMap transaction items, groupingBy itemId counting, filter target IDs.',
      d: `<pre><code>record Item(String id, double price) {}
record Transaction(String txId, List&lt;Item&gt; items) {}

List&lt;Transaction&gt; txns = List.of(
    new Transaction("T1", List.of(new Item("A",10), new Item("B",20))),
    new Transaction("T2", List.of(new Item("A",10), new Item("C",30)))
);

Map&lt;String, Long&gt; itemCount = txns.stream()
    .flatMap(t -&gt; t.items().stream())
    .collect(Collectors.groupingBy(Item::id, Collectors.counting()));

System.out.println(itemCount); // {A=2, B=1, C=1}</code></pre>`
    },
    {
      tags: ['First unique', 'distinct element', 'Stream', 'findFirst'],
      q: 'Find the first unique/distinct element using Streams',
      s: 'Filter elements that appear exactly once, then findFirst(). Use groupingBy counting to identify unique elements.',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(1, 2, 3, 2, 4, 1, 5);

// First element that appears only ONCE
Optional&lt;Integer&gt; firstUnique = nums.stream()
    .collect(Collectors.groupingBy(Function.identity(), LinkedHashMap::new, Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() == 1)
    .map(Map.Entry::getKey)
    .findFirst();

System.out.println(firstUnique.orElse(-1)); // 3

// Or: filter duplicate-free elements
Set&lt;Integer&gt; seen = new HashSet&lt;&gt;(), dups = new HashSet&lt;&gt;();
nums.forEach(n -&gt; (seen.add(n) ? seen : dups).add(n)); // trick
nums.stream().filter(n -&gt; !dups.contains(n)).findFirst(); // first non-dup</code></pre>`
    },
    {
      tags: ['Group by length', 'List<Set<String>>', 'flatMap', 'Nested'],
      q: 'Group strings by their length from List<Set<String>> using Streams',
      s: 'flatMap to flatten Set<String> into single stream, then groupingBy String::length.',
      d: `<pre><code>List&lt;Set&lt;String&gt;&gt; nested = List.of(
    Set.of("hi", "hello", "hey"),
    Set.of("world", "word", "ok")
);

Map&lt;Integer, List&lt;String&gt;&gt; byLength = nested.stream()
    .flatMap(Set::stream)            // flatten List&lt;Set&gt; → Stream&lt;String&gt;
    .collect(Collectors.groupingBy(String::length));

System.out.println(byLength);
// {2=[hi, ok], 3=[hey], 4=[word], 5=[hello, world]}</code></pre>`
    },
    {
      tags: ['Integer first char', 'filter', 'digit', 'charAt', 'Stream'],
      q: 'Collect only strings that have an integer character at their first index',
      s: 'filter(s -> Character.isDigit(s.charAt(0)))',
      d: `<pre><code>List&lt;String&gt; words = List.of("1hello", "world", "2sky", "abc", "3rd", "ten");

List&lt;String&gt; startsWithDigit = words.stream()
    .filter(s -&gt; !s.isEmpty() && Character.isDigit(s.charAt(0)))
    .collect(Collectors.toList());

System.out.println(startsWithDigit); // [1hello, 2sky, 3rd]</code></pre>`
    },
    {
      tags: ['Distinct characters', 'String', 'Stream', 'chars', 'LinkedHashSet'],
      q: 'Find distinct characters in a string using Streams',
      s: 'str.chars() → mapToObj → distinct() → collect',
      d: `<pre><code>String str = "programming";

// Distinct chars maintaining order
List&lt;Character&gt; distinct = str.chars()
    .distinct()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.toList());

System.out.println(distinct); // [p, r, o, g, a, m, i, n]

// As String
String distinctStr = str.chars()
    .distinct()
    .collect(StringBuilder::new,
             StringBuilder::appendCodePoint,
             StringBuilder::append).toString();
System.out.println(distinctStr); // "proganmi"</code></pre>`
    },
    {
      tags: ['Duplicate words', 'Sentence', 'groupingBy', 'filter count > 1'],
      q: 'Identify duplicate words in a sentence using Streams',
      s: 'Split by space, groupingBy counting, filter count > 1 to get duplicates.',
      d: `<pre><code>String sentence = "hello world hello java world java";

Set&lt;String&gt; duplicates = Arrays.stream(sentence.split("\\s+"))
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() &gt; 1)
    .map(Map.Entry::getKey)
    .collect(Collectors.toSet());

System.out.println(duplicates); // [hello, world, java]</code></pre>`
    },
    {
      tags: ['Word frequency', 'List of strings', 'groupingBy', 'count'],
      q: 'Find frequency of words from List<String> = ["Rahul","smrit","Rahul"]',
      s: 'Collectors.groupingBy(Function.identity(), Collectors.counting())',
      d: `<pre><code>List&lt;String&gt; names = List.of("Rahul", "smrit", "Rahul");

Map&lt;String, Long&gt; frequency = names.stream()
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

System.out.println(frequency); // {Rahul=2, smrit=1}

// Case-insensitive:
names.stream()
    .collect(Collectors.groupingBy(
        String::toLowerCase, Collectors.counting()));</code></pre>`
    },
    {
      tags: ['First repeating', 'java', 'groupingBy', 'LinkedHashMap', 'findFirst'],
      q: 'Given String s = "java" — find first repeating character',
      s: 'Group by char with LinkedHashMap (preserves order), filter count > 1, findFirst.',
      d: `<pre><code>String s = "java";

Optional&lt;Character&gt; firstRepeating = s.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(
        Function.identity(),
        LinkedHashMap::new,  // insertion order preserved
        Collectors.counting()
    ))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() &gt; 1)
    .map(Map.Entry::getKey)
    .findFirst();

System.out.println(firstRepeating.orElse('?')); // 'a' (j=1,a=2,v=1 → a repeats)</code></pre>`
    },
    {
      tags: ['Reverse sorted', 'integers', 'Stream', 'sorted reverseOrder'],
      q: 'Reverse sorted order of a list of integers using Streams',
      s: 'sorted(Comparator.reverseOrder()) or sorted(Collections.reverseOrder())',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(3, 1, 4, 1, 5, 9, 2, 6);

List&lt;Integer&gt; descSorted = nums.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());

System.out.println(descSorted); // [9, 6, 5, 4, 3, 2, 1, 1]

// Distinct then reverse sorted:
nums.stream().distinct().sorted(Comparator.reverseOrder()).toList();
// [9, 6, 5, 4, 3, 2, 1]</code></pre>`
    },
    {
      tags: ['Sort Comparable', 'Comparator', 'Employee', 'Objects', 'DSA'],
      q: 'Sort objects using Comparable/Comparator (DSA question)',
      s: 'Implement Comparable in class for natural order. Use Comparator for external/custom ordering. Collections.sort() uses Comparable; .sort(comparator) uses Comparator.',
      d: `<pre><code>// Comparable — natural ordering (inside the class)
class Employee implements Comparable&lt;Employee&gt; {
    String name; int age; double salary;

    @Override
    public int compareTo(Employee o) {
        return this.name.compareTo(o.name); // sort by name
    }
}
List&lt;Employee&gt; list = new ArrayList&lt;&gt;(employees);
Collections.sort(list); // uses compareTo

// Comparator — external, multiple sort strategies
list.sort(Comparator.comparingDouble(Employee::getSalary));
list.sort(Comparator.comparing(Employee::getName).thenComparingInt(Employee::getAge));
list.sort(Comparator.comparingInt(Employee::getAge).reversed());

// Streams
employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .forEach(System.out::println);</code></pre>`
    }
  ],

  dsa: [
    {
      tags: ['4th Longest Word', 'Stream', 'sorted', 'skip', 'distinct'],
      q: 'Find the 4th longest word in a list of strings using Streams',
      s: 'Sort by length descending, skip(3), findFirst(). Use distinct on length or word to handle ties.',
      d: `<pre><code>List&lt;String&gt; words = List.of("banana","fig","apple","cherry","kiwi","mango","blueberry");

Optional&lt;String&gt; fourth = words.stream()
    .distinct()
    .sorted((a, b) -&gt; b.length() - a.length())  // longest first
    .skip(3)                                      // skip top 3
    .findFirst();

System.out.println(fourth.orElse("none")); // "apple" (8,6,6,5,5,4,3 → 4th=5 chars)</code></pre>`
    },
    {
      tags: ['Binary Search', 'Iterative', 'O(log n)', 'Sorted Array'],
      q: 'Binary Search — iterative implementation',
      s: 'Compare mid element with target. If equal return mid. If target < mid, search left half. If target > mid, search right half. O(log n) time, O(1) space.',
      d: `<pre><code>int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left &lt;= right) {
        int mid = left + (right - left) / 2; // avoid overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] &lt; target) left = mid + 1;  // search right
        else right = mid - 1;                    // search left
    }
    return -1; // not found
}
// arr=[1,3,5,7,9,11], target=7 → returns index 3
// Time: O(log n) | Space: O(1)</code></pre>`
    },
    {
      tags: ['Merge Sorted Arrays', 'Two Pointers from End', 'In-place', 'O(m+n)'],
      q: 'Merge two sorted arrays (LeetCode 88)',
      s: 'Two pointers from end of each array, place largest at end of array1. Works in-place. O(m+n) time, O(1) space.',
      d: `<pre><code>void merge(int[] nums1, int m, int[] nums2, int n) {
    int p1 = m - 1;     // pointer in nums1
    int p2 = n - 1;     // pointer in nums2
    int p  = m + n - 1; // write pointer (end of nums1)

    while (p2 &gt;= 0) {
        if (p1 &gt;= 0 && nums1[p1] &gt; nums2[p2]) {
            nums1[p--] = nums1[p1--];
        } else {
            nums1[p--] = nums2[p2--];
        }
    }
}
// nums1=[1,3,5,0,0,0] m=3, nums2=[2,4,6] n=3
// Result: [1,2,3,4,5,6]
// Time: O(m+n) | Space: O(1)</code></pre>`
    },
    {
      tags: ['Find All Duplicates', 'Index Negation', 'O(n)', 'O(1) space'],
      q: 'Find all duplicates in an array (values 1 to n) — index negation approach',
      s: 'For each value, negate element at index (value-1). If already negative when visited → it\'s a duplicate. O(n) time, O(1) extra space.',
      d: `<pre><code>List&lt;Integer&gt; findDuplicates(int[] nums) {
    List&lt;Integer&gt; result = new ArrayList&lt;&gt;();
    for (int n : nums) {
        int idx = Math.abs(n) - 1;     // map value to index
        if (nums[idx] &lt; 0) {           // already negated → duplicate!
            result.add(Math.abs(n));
        } else {
            nums[idx] = -nums[idx];     // mark as visited (negate)
        }
    }
    return result;
}
// [4,3,2,7,8,2,3,1] → [2,3]
// Time: O(n) | Space: O(1) extra (output not counted)</code></pre>`
    },
    {
      tags: ['Level Order Traversal', 'BFS', 'Queue', 'Binary Tree'],
      q: 'Level Order Traversal of a Binary Tree (BFS)',
      s: 'Use a Queue. Poll node, add to result, enqueue left and right children. Repeat until queue empty. O(n) time and space.',
      d: `<pre><code>class TreeNode { int val; TreeNode left, right; }

List&lt;List&lt;Integer&gt;&gt; levelOrder(TreeNode root) {
    List&lt;List&lt;Integer&gt;&gt; result = new ArrayList&lt;&gt;();
    if (root == null) return result;

    Queue&lt;TreeNode&gt; queue = new LinkedList&lt;&gt;();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int size = queue.size();          // nodes at current level
        List&lt;Integer&gt; level = new ArrayList&lt;&gt;();
        for (int i = 0; i &lt; size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left  != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
// Tree: 3 → [9,20] → [null,null,15,7]
// Output: [[3],[9,20],[15,7]]
// Time: O(n) | Space: O(n)</code></pre>`
    },
    {
      tags: ['Kth Largest', 'Min-Heap', 'QuickSelect', 'Priority Queue'],
      q: 'Kth Largest Element — Min-Heap approach',
      s: 'Maintain a min-heap of size k. For each element: if heap < k, add it; else if element > heap.peek(), replace. Top of heap = kth largest. O(n log k).',
      d: `<pre><code>// Min-Heap approach — O(n log k) time, O(k) space
int findKthLargest(int[] nums, int k) {
    PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;(); // min at top
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() &gt; k) minHeap.poll(); // remove smallest
    }
    return minHeap.peek(); // kth largest is top of min-heap
}
// nums=[3,2,1,5,6,4], k=2 → 5
// Time: O(n log k) | Space: O(k)

// QuickSelect — O(n) average, O(n²) worst, O(1) space
int findKthLargest_QS(int[] nums, int k) {
    return quickSelect(nums, 0, nums.length-1, nums.length-k);
}
// (quickSelect implementation finds kth smallest from right)</code></pre>`
    },
    {
      tags: ['Singleton Pattern', 'Code', 'Thread-safe', 'Double-checked', 'Enum'],
      q: 'Singleton pattern implementation (code)',
      s: 'Thread-safe: double-checked locking with volatile. Simplest: enum Singleton. Bill Pugh: static inner holder class. All prevent multiple instantiation.',
      d: `<pre><code>// 1. Enum (simplest, thread-safe, handles serialization)
public enum Singleton {
    INSTANCE;
    public void doWork() { }
}
Singleton.INSTANCE.doWork();

// 2. Bill Pugh Holder (lazy + thread-safe without sync overhead)
public class Singleton {
    private Singleton() { }
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }
    public static Singleton getInstance() { return Holder.INSTANCE; }
}

// 3. Double-checked locking (classic)
public class Singleton {
    private static volatile Singleton instance;
    private Singleton() { }
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) instance = new Singleton();
            }
        }
        return instance;
    }
}</code></pre>`
    }
  ],

  git: [
    {
      tags: ['Merge vs Rebase', 'Why merge preferred', 'History', 'Collaboration'],
      q: 'Why is merge preferred over rebase?',
      s: 'Merge preserves full history and is safe on shared/public branches. Rebase rewrites history (changes commit SHAs) — dangerous on shared branches as it confuses other developers.',
      d: `<ol>
<li><strong>Merge preserves history.</strong> True record of when branches were created and merged. Easier to understand the full timeline of a project.</li>
<li><strong>Rebase rewrites commits.</strong> Changes commit SHAs — other developers who have pulled the branch now have diverged history. Causes conflicts and confusion.</li>
<li><strong>Golden rule:</strong> Never rebase public/shared branches. Rebase only your local private branches before creating a PR.</li>
</ol>
<pre><code># Safe use of rebase (private branch)
git checkout feature/login
git rebase main            # clean up local commits before PR

# NEVER do this on shared branch:
git checkout main
git rebase feature         # rewrites main's history — breaks everyone!</code></pre>`
    },
    {
      tags: ['git commit', 'Save changes', 'Snapshot', 'SHA', 'Message'],
      q: 'What is git commit?',
      s: 'git commit saves staged changes as a permanent snapshot in the local repo. Each commit has a unique SHA-1 hash, author, timestamp, and message. Does NOT push to remote.',
      d: `<pre><code>git add -p                          # stage specific changes
git commit -m "feat: add user login" # commit with message

# Conventional commit format:
# feat: new feature
# fix: bug fix
# refactor: code change without feature/fix
# docs: documentation
# test: add/update tests
# chore: build/config changes

# Commit anatomy:
# SHA: d3f4e5a...  (unique identifier)
# Author: Alice &lt;alice@mail.com&gt;
# Date: Mon Jan 1 10:00:00 2024
# Message: feat: add user login

git log --oneline         # compact history
git show d3f4e5a          # view specific commit
git commit --amend        # fix last commit message (before push only)</code></pre>`
    },
    {
      tags: ['Feature branch', 'Remote', 'git push', 'Upstream', '-u flag'],
      q: 'If you have a feature branch, how can you update the remote branch with it?',
      s: 'git push origin feature-branch or git push -u origin feature-branch. The -u flag sets upstream tracking so future git push/pull work without specifying branch name.',
      d: `<pre><code># First push — set upstream tracking
git push -u origin feature/user-auth
# -u = --set-upstream → links local branch to remote

# Subsequent pushes (after -u set):
git push    # just this — Git knows where to push

# Force push (after rebase — only on your own branch, never main!):
git push --force-with-lease origin feature/user-auth
# --force-with-lease is safer than --force (checks no one else pushed)

# Update remote with latest local changes:
git fetch origin            # sync remote info
git push origin feature/x   # push your changes</code></pre>`
    }
  ],

  maven: [
    {
      tags: ['Dependencies download', 'Maven Central', 'POM', 'Repository', 'How'],
      q: 'How are dependencies downloaded in Maven? From where?',
      s: 'Maven checks local ~/.m2 cache first, then downloads from Maven Central (repo1.maven.org) or configured mirrors. Transitive dependencies pulled automatically.',
      d: `<pre><code>// Resolution order:
// 1. Local repository (~/.m2/repository)
// 2. Remote repositories (Maven Central by default)
// 3. Corporate Nexus/Artifactory mirror if configured

// settings.xml — configure mirrors
&lt;mirrors&gt;
  &lt;mirror&gt;
    &lt;id&gt;nexus&lt;/id&gt;
    &lt;url&gt;http://nexus.company.com/repository/maven-public/&lt;/url&gt;
    &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;
  &lt;/mirror&gt;
&lt;/mirrors&gt;

// Download triggers:
mvn clean install      // downloads missing deps
mvn dependency:resolve // explicitly resolve all deps
mvn dependency:tree    // view full dependency tree</code></pre>`
    },
    {
      tags: ['Add Dependency', 'pom.xml', 'maven-dependency', 'groupId artifactId version'],
      q: 'How do you add a dependency in Maven?',
      s: 'Add <dependency> block in pom.xml <dependencies> section with groupId, artifactId, version, scope. Maven auto-downloads it.',
      d: `<pre><code>&lt;dependencies&gt;
  &lt;!-- Spring Boot Web --&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;!-- version managed by parent BOM --&gt;
  &lt;/dependency&gt;

  &lt;!-- Test-only dependency --&gt;
  &lt;dependency&gt;
    &lt;groupId&gt;org.mockito&lt;/groupId&gt;
    &lt;artifactId&gt;mockito-core&lt;/artifactId&gt;
    &lt;version&gt;5.0.0&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;   &lt;!-- only in test classpath --&gt;
  &lt;/dependency&gt;
&lt;/dependencies&gt;

&lt;!-- Scopes: compile(default), test, provided, runtime, system --&gt;</code></pre>`
    },
    {
      tags: ['Transitive Dependencies', 'Missing', 'ClassNotFoundException', 'Conflict'],
      q: 'What happens if Maven doesn\'t download transitive dependencies?',
      s: 'ClassNotFoundException / NoClassDefFoundError at runtime. Also class version conflicts (diamond dependency problem). Fix: mvn dependency:tree to analyze, then explicitly declare missing dep.',
      d: `<pre><code># Diagnose:
mvn dependency:tree           # show full tree with transitive deps
mvn dependency:analyze        # find unused/missing declared deps

# If a transitive dep is excluded but needed, re-declare it:
&lt;dependency&gt;
  &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;
  &lt;artifactId&gt;jackson-databind&lt;/artifactId&gt;
  &lt;version&gt;2.15.0&lt;/version&gt;
&lt;/dependency&gt;

# Conflict resolution — force specific version:
&lt;dependencyManagement&gt;
  &lt;dependencies&gt;
    &lt;dependency&gt;
      &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;
      &lt;artifactId&gt;jackson-databind&lt;/artifactId&gt;
      &lt;version&gt;2.15.0&lt;/version&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/dependencyManagement&gt;</code></pre>`
    },
    {
      tags: ['pom.xml', 'Project Object Model', 'Build config', 'Maven'],
      q: 'What is pom.xml?',
      s: 'Project Object Model — the core Maven config file. Defines project coordinates (groupId, artifactId, version), dependencies, plugins, build configuration, profiles, and parent POM.',
      d: `<pre><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;project&gt;
  &lt;!-- Project coordinates --&gt;
  &lt;groupId&gt;com.mycompany&lt;/groupId&gt;
  &lt;artifactId&gt;my-app&lt;/artifactId&gt;
  &lt;version&gt;1.0.0-SNAPSHOT&lt;/version&gt;
  &lt;packaging&gt;jar&lt;/packaging&gt;

  &lt;!-- Inherit from Spring Boot parent --&gt;
  &lt;parent&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
    &lt;version&gt;3.2.0&lt;/version&gt;
  &lt;/parent&gt;

  &lt;dependencies&gt;...&lt;/dependencies&gt;  &lt;!-- project dependencies --&gt;
  &lt;build&gt;...&lt;/build&gt;               &lt;!-- plugins, resources --&gt;
  &lt;properties&gt;...&lt;/properties&gt;     &lt;!-- shared config values --&gt;
  &lt;profiles&gt;...&lt;/profiles&gt;         &lt;!-- env-specific config --&gt;
&lt;/project&gt;</code></pre>`
    }
  ],

  docker: [
    {
      tags: ['Jenkins', 'CI CD', 'Pipeline', 'Declarative', 'Stages'],
      q: 'Do you know Jenkins? Have you written pipeline scripts?',
      s: 'Jenkins is a CI/CD automation server. Pipelines defined in Jenkinsfile (declarative or scripted). Stages: checkout, build, test, sonar, docker build, deploy.',
      d: `<pre><code>// Jenkinsfile (declarative pipeline)
pipeline {
    agent any
    environment {
        IMAGE = "myapp:\${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/org/repo' }
        }
        stage('Build') {
            steps { sh 'mvn clean package -DskipTests' }
        }
        stage('Test') {
            steps { sh 'mvn test' }
            post { always { junit 'target/surefire-reports/*.xml' } }
        }
        stage('Docker Build & Push') {
            steps {
                sh "docker build -t \${IMAGE} ."
                sh "docker push \${IMAGE}"
            }
        }
        stage('Deploy to K8s') {
            steps { sh "kubectl set image deployment/app app=\${IMAGE}" }
        }
    }
    post {
        failure { slackSend message: "Build FAILED: \${env.JOB_NAME}" }
        success { slackSend message: "Build PASSED: \${env.JOB_NAME}" }
    }
}</code></pre>`
    },
    {
      tags: ['SDLC', 'Software Development Lifecycle', 'Phases', 'Agile'],
      q: 'What is SDLC?',
      s: 'Software Development Life Cycle — structured process for planning, creating, testing, and deploying software. Phases: Planning → Requirements → Design → Development → Testing → Deployment → Maintenance.',
      d: `<table>
<tr><th>Phase</th><th>Activities</th><th>Output</th></tr>
<tr><td>Planning</td><td>Feasibility, resource estimation</td><td>Project plan</td></tr>
<tr><td>Requirements</td><td>Gather functional + non-functional requirements</td><td>SRS document</td></tr>
<tr><td>Design</td><td>Architecture, DB design, UI mockups</td><td>Design specs</td></tr>
<tr><td>Development</td><td>Coding, code reviews</td><td>Working software</td></tr>
<tr><td>Testing</td><td>Unit, integration, UAT, performance</td><td>Test reports</td></tr>
<tr><td>Deployment</td><td>Release to production (CI/CD)</td><td>Live software</td></tr>
<tr><td>Maintenance</td><td>Bug fixes, enhancements, monitoring</td><td>Updated releases</td></tr>
</table>
<p><strong>Models:</strong> Waterfall (sequential), Agile (iterative sprints), DevOps (continuous delivery).</p>`
    }
  ],

  agile: [
    {
      tags: ['Challenge', 'Project', 'Problem', 'Solution', 'STAR'],
      q: 'What challenge did you face in your project and how did you overcome it?',
      s: 'Use STAR method: Situation → Task → Action → Result. Common challenges: N+1 queries, memory leaks, deadline pressure, legacy code migration, inter-team dependencies.',
      d: `<p>Use the <strong>STAR framework</strong> for structure:</p>
<ol>
<li><strong>Situation:</strong> Describe the context and the problem.</li>
<li><strong>Task:</strong> What was your responsibility?</li>
<li><strong>Action:</strong> What specific steps did you take?</li>
<li><strong>Result:</strong> What was the measurable outcome?</li>
</ol>
<h4>Example answer:</h4>
<p><em>S:</em> Our payment API response time degraded from 200ms to 4 seconds in production after a data migration. <em>T:</em> I was responsible for finding and fixing the bottleneck. <em>A:</em> Used Spring Boot Actuator and Hibernate SQL logging — found N+1 queries loading 500 order items per request. Added <code>@BatchSize(50)</code> and fetch joins, added Redis caching for product catalog. <em>R:</em> Response time dropped back to 150ms, 25% better than original.</p>`
    }
  ]
}

export default SPRING_EXTRA2
