const BATCH2_SPRING = {
  'spring-core': [
    {
      tags: ['Why Spring', 'Problems solved', 'Spring Boot', 'Boilerplate', 'History'],
      q: 'Why was Spring introduced? What problems of Spring does Spring Boot solve?',
      s: 'Spring solved J2EE complexity (EJB boilerplate, heavy containers). Spring Boot solved Spring\'s own complexity: no XML, auto-configuration, embedded server, production-ready.',
      d: `<h4>Why Spring was introduced (2003)</h4>
<p>J2EE/EJB was bloated — required JNDI lookups, deployment descriptors, heavy app servers. Spring introduced:</p>
<ul>
<li>Lightweight IoC container (POJO-based)</li>
<li>Dependency injection (no JNDI)</li>
<li>AOP for cross-cutting concerns</li>
<li>Simplified JDBC templates</li>
</ul>
<h4>What Spring Boot solved (2014)</h4>
<p>Spring itself became verbose: XML configs, manual datasource setup, WAR deployment to external Tomcat, manual integration of 20+ Spring modules.</p>
<table>
<tr><th>Spring Problem</th><th>Spring Boot Solution</th></tr>
<tr><td>XML configuration</td><td>Auto-configuration + annotations</td></tr>
<tr><td>External Tomcat required</td><td>Embedded Tomcat/Jetty</td></tr>
<tr><td>Manual bean wiring</td><td>@SpringBootApplication + component scan</td></tr>
<tr><td>Version conflicts</td><td>Spring Boot BOM manages compatible versions</td></tr>
<tr><td>No production monitoring</td><td>Actuator built-in</td></tr>
</table>`
    },
    {
      tags: ['AutoConfiguration', 'Conditional', 'spring.factories', 'How it works'],
      q: 'What is autoconfiguration in Spring Boot?',
      s: 'Auto-configuration automatically configures beans based on classpath, properties, and existing beans. Uses @Conditional annotations. Registered in spring/AutoConfiguration.imports. Triggered by @EnableAutoConfiguration.',
      d: `<pre><code>// How autoconfiguration works:
// 1. @EnableAutoConfiguration (inside @SpringBootApplication) activates it
// 2. Spring reads: META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
// 3. Each listed @AutoConfiguration class is conditionally applied

@AutoConfiguration
@ConditionalOnClass(DataSource.class)    // only if DataSource jar is on classpath
@ConditionalOnMissingBean(DataSource.class) // only if no DataSource bean defined
class DataSourceAutoConfiguration {
    @Bean DataSource dataSource() { return new HikariDataSource(); }
}

// Common @Conditional annotations:
// @ConditionalOnClass — class exists on classpath
// @ConditionalOnMissingBean — no bean of type exists
// @ConditionalOnProperty — property has specific value
// @ConditionalOnBean — specific bean exists
// @ConditionalOnWebApplication — running as web app

// Debug autoconfiguration:
// --debug flag shows: "Positive matches" and "Negative matches" in logs</code></pre>`
    },
    {
      tags: ['application.properties', 'Config', 'YAML', 'Properties file', 'Spring Boot'],
      q: 'What is application.properties?',
      s: 'Main configuration file for Spring Boot apps. Located in src/main/resources. Can be YAML (application.yml). Profile-specific: application-dev.properties, application-prod.properties.',
      d: `<pre><code># application.properties — key=value format
server.port=8080
spring.application.name=my-app
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=root
spring.datasource.password=secret
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
logging.level.com.app=DEBUG

# application.yml — hierarchical format (preferred for complex config)
server:
  port: 8080
spring:
  application:
    name: my-app
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: root
  jpa:
    show-sql: true

# Profile-specific:
# application-dev.properties → active when SPRING_PROFILES_ACTIVE=dev
# application-prod.properties → active when SPRING_PROFILES_ACTIVE=prod</code></pre>`
    },
    {
      tags: ['Bean Profiles', 'Switch profiles', 'Maven', 'Java command', '@Profile'],
      q: 'What are Bean profiles? How to switch profiles using Maven and Java commands?',
      s: '@Profile("dev") beans only created when dev profile active. Switch: Maven -P flag, Java -Dspring.profiles.active, environment variable SPRING_PROFILES_ACTIVE.',
      d: `<pre><code>// Profile-specific beans
@Configuration
@Profile("dev")
class DevConfig {
    @Bean DataSource devDataSource() { return new EmbeddedH2DataSource(); }
}

@Configuration
@Profile("prod")
class ProdConfig {
    @Bean DataSource prodDataSource() { return new HikariDataSource(prodConfig); }
}

@Service
@Profile("!prod") // active when NOT prod
class MockEmailService implements EmailService { }

// Switching profiles:
// 1. Java command
java -jar app.jar -Dspring.profiles.active=prod

// 2. Environment variable
SPRING_PROFILES_ACTIVE=prod java -jar app.jar

// 3. application.properties
spring.profiles.active=dev

// 4. Maven (using maven-resources-plugin filtering)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

// 5. Programmatic
SpringApplication app = new SpringApplication(App.class);
app.setAdditionalProfiles("dev");
app.run(args);</code></pre>`
    },
    {
      tags: ['Custom Starter', 'Dependency', 'spring.factories', 'AutoConfiguration', 'How to create'],
      q: 'How to create a custom starter dependency? What do we get from a starter?',
      s: 'Create a library with @AutoConfiguration classes registered in AutoConfiguration.imports. A starter is a pom that pulls in the library + required deps. Consumers get zero-config integration.',
      d: `<pre><code>// 1. Create autoconfigure module (my-feature-spring-boot-autoconfigure)
@AutoConfiguration
@ConditionalOnClass(MyFeature.class)
@EnableConfigurationProperties(MyFeatureProperties.class)
class MyFeatureAutoConfiguration {
    @Bean @ConditionalOnMissingBean
    MyFeature myFeature(MyFeatureProperties props) {
        return new MyFeature(props.getApiKey());
    }
}

// Register in:
// src/main/resources/META-INF/spring/
// org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.example.MyFeatureAutoConfiguration

// 2. Create starter module (my-feature-spring-boot-starter)
// Just a POM that depends on autoconfigure + required libs

// 3. Consumer just adds dependency:
// &lt;dependency&gt;
//   &lt;groupId&gt;com.example&lt;/groupId&gt;
//   &lt;artifactId&gt;my-feature-spring-boot-starter&lt;/artifactId&gt;
// &lt;/dependency&gt;
// Auto-configured! No @Bean needed in consumer app.</code></pre>`
    },
    {
      tags: ['@InjectMocks', 'Mockito', 'Unit testing framework', '@Mock', 'JUnit'],
      q: 'What is @InjectMocks? What framework is used in unit testing?',
      s: '@InjectMocks creates the class under test and injects @Mock/@Spy fields into it automatically. Mockito is the mocking framework. JUnit 5 is the test runner. Used together via @ExtendWith(MockitoExtension.class).',
      d: `<pre><code>// Mockito + JUnit 5 combination (most common in Spring Boot projects)
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    OrderRepository orderRepo;   // Mockito creates a fake repo

    @Mock
    PaymentService paymentService; // Mockito creates fake payment service

    @InjectMocks
    OrderService orderService;    // Real object, mocks injected into it
    // Mockito tries: constructor injection, property injection, field injection

    @Test
    void placeOrder_success() {
        // Arrange
        Order order = new Order("item1", 2, 100.0);
        when(orderRepo.save(any())).thenReturn(order);
        when(paymentService.charge(anyDouble())).thenReturn(true);

        // Act
        Order result = orderService.placeOrder(order);

        // Assert
        assertNotNull(result);
        verify(orderRepo).save(order);
        verify(paymentService).charge(200.0);
    }
}
// Frameworks: JUnit 5 (test runner) + Mockito (mocking) + AssertJ (fluent assertions)</code></pre>`
    },
    {
      tags: ['@RequestHeader', 'HTTP Header', 'Spring', 'Authorization', 'Custom Header'],
      q: 'What is @RequestHeader?',
      s: '@RequestHeader extracts HTTP request headers into method parameters. Used for: Authorization tokens, correlation IDs, content-type negotiation, custom headers.',
      d: `<pre><code>@RestController
class ApiController {
    // Extract single header
    @GetMapping("/api/users")
    List&lt;User&gt; getUsers(
        @RequestHeader("Authorization") String authToken,
        @RequestHeader("X-Correlation-ID") String correlationId) {
        log.info("Request ID: {}", correlationId);
        return userService.findAll();
    }

    // Optional header with default
    @GetMapping("/api/data")
    String getData(
        @RequestHeader(value = "Accept-Language", defaultValue = "en") String lang) {
        return getMessage(lang);
    }

    // All headers as Map
    @GetMapping("/api/headers")
    Map&lt;String,String&gt; getAllHeaders(@RequestHeader Map&lt;String, String&gt; headers) {
        return headers;
    }
}
// HTTP Request: GET /api/users
// Headers: Authorization: Bearer eyJ..., X-Correlation-ID: abc123</code></pre>`
    }
  ],

  jpa: [
    {
      tags: ['JPA vs Hibernate', 'Specification vs Implementation', 'Difference'],
      q: 'What is the difference between JPA and Hibernate?',
      s: 'JPA (Jakarta Persistence API) is the specification — defines interfaces and annotations. Hibernate is the most popular JPA implementation. Spring Data JPA is an abstraction on top of JPA.',
      d: `<table>
<tr><th>Feature</th><th>JPA</th><th>Hibernate</th></tr>
<tr><td>What it is</td><td>Specification (interface)</td><td>Implementation of JPA</td></tr>
<tr><td>Package</td><td>jakarta.persistence.*</td><td>org.hibernate.*</td></tr>
<tr><td>Standalone</td><td>No (needs implementation)</td><td>Yes (can use without JPA)</td></tr>
<tr><td>Extra features</td><td>Standard only</td><td>Caching (L1/L2), HQL, @BatchSize, etc.</td></tr>
</table>
<pre><code>// JPA annotation (works with any provider)
@Entity @Table(name="users")
class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
}

// Hibernate-specific (don't use if you want provider portability)
@Entity
@org.hibernate.annotations.BatchSize(size = 25)
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
class Product { ... }

// Hierarchy:
// JPA Spec → Hibernate implements → Spring Data JPA wraps</code></pre>`
    },
    {
      tags: ['Entity Mapping', 'OneToOne', 'OneToMany', 'ManyToMany', 'Types'],
      q: 'Explain all types of entity mapping in JPA',
      s: '@OneToOne, @OneToMany, @ManyToOne, @ManyToMany. Each has owning side, inverse side, fetch type defaults, and cascade options.',
      d: `<pre><code>// @OneToOne — User has one Profile
@Entity class User {
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    Profile profile;
}

// @OneToMany / @ManyToOne — Department has many Employees
@Entity class Department {
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    List&lt;Employee&gt; employees;
}
@Entity class Employee {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id")
    Department department; // owning side (has FK)
}

// @ManyToMany — Student has many Courses, Course has many Students
@Entity class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    List&lt;Course&gt; courses;
}
@Entity class Course {
    @ManyToMany(mappedBy = "courses")
    List&lt;Student&gt; students;
}</code></pre>`
    },
    {
      tags: ['Fetch Strategy', 'Cascade', 'EAGER LAZY', 'CascadeType', 'JPA'],
      q: 'What are fetching strategies and cascading types in JPA?',
      s: 'Fetch: LAZY (load on access) vs EAGER (load immediately). Cascade: propagate operations — PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL. Use LAZY + explicit joins to prevent N+1.',
      d: `<pre><code>// Fetch strategies
@ManyToOne(fetch = FetchType.LAZY)   // load when accessed (recommended)
@ManyToOne(fetch = FetchType.EAGER)  // load immediately with parent query

// Cascade types
@OneToMany(cascade = CascadeType.PERSIST)  // persist children when parent persisted
@OneToMany(cascade = CascadeType.MERGE)    // merge children when parent merged
@OneToMany(cascade = CascadeType.REMOVE)   // delete children when parent deleted
@OneToMany(cascade = CascadeType.REFRESH)  // refresh children with parent
@OneToMany(cascade = CascadeType.DETACH)   // detach children with parent
@OneToMany(cascade = CascadeType.ALL)      // all of the above

// N+1 Problem (LAZY fetch with loop):
List&lt;Department&gt; depts = deptRepo.findAll();
depts.forEach(d -&gt; d.getEmployees().size()); // N extra queries!

// Fix: JOIN FETCH in JPQL
@Query("SELECT d FROM Department d JOIN FETCH d.employees")
List&lt;Department&gt; findAllWithEmployees();</code></pre>`
    },
    {
      tags: ['Entity rules', 'JPA', '@Entity requirements', 'no-arg constructor', 'serializable'],
      q: 'What are the rules for defining an entity for Spring Data JPA?',
      s: '1) @Entity annotation. 2) No-arg constructor (public or protected). 3) @Id field. 4) Class must not be final. 5) Fields should not be final. 6) Recommended: Serializable.',
      d: `<pre><code>@Entity
@Table(name = "products")
public class Product implements Serializable { // Serializable recommended
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;              // Rule 3: must have @Id

    private String name;          // Rule 5: not final
    private double price;

    public Product() { }          // Rule 2: no-arg constructor (REQUIRED for JPA)
    public Product(String n, double p) { this.name=n; this.price=p; }

    // Getters and setters
    // ...

    // Avoid: @Override equals/hashCode using all fields — use only @Id
    @Override public boolean equals(Object o) {
        if (!(o instanceof Product)) return false;
        return id != null && id.equals(((Product)o).id);
    }
    @Override public int hashCode() { return getClass().hashCode(); }
}
// Rule 4: class must NOT be final (Hibernate uses CGLIB proxies)</code></pre>`
    },
    {
      tags: ['mappedBy', 'Bidirectional', 'Owning side', 'Inverse side', 'JPA'],
      q: 'What is mappedBy? Technically what happens by keeping mappedBy?',
      s: 'mappedBy marks the INVERSE (non-owning) side of a bidirectional relationship. The owning side (with @JoinColumn) controls the FK. mappedBy=field tells JPA "the other side manages this relationship".',
      d: `<pre><code>@Entity class Department {
    @OneToMany(mappedBy = "department") // inverse side — NO FK here
    List&lt;Employee&gt; employees;
}
@Entity class Employee {
    @ManyToOne
    @JoinColumn(name = "dept_id") // OWNING side — FK dept_id in employee table
    Department department;
}

// What mappedBy technically does:
// 1. Tells JPA: Department.employees is not the FK owner
// 2. JPA won't create a separate join table or extra FK column for this side
// 3. Only Employee.department (owning side) controls the DB relationship
// 4. Changes to Department.employees list are IGNORED by JPA for persistence!

// COMMON MISTAKE: only setting the inverse side
Department dept = new Department();
Employee emp = new Employee();
dept.getEmployees().add(emp); // setting inverse side only
// emp.setDepartment(dept); // MUST also set this for FK to be saved!
entityManager.persist(emp); // FK not saved without this line!</code></pre>`
    },
    {
      tags: ['Pagination', 'Spring Boot', 'Pageable', 'PageRequest', 'Page'],
      q: 'How to do pagination in Spring Boot?',
      s: 'Use Pageable parameter in repository methods. PageRequest.of(page, size, sort). Returns Page<T> with content, totalElements, totalPages. Expose via @PageableDefault in controller.',
      d: `<pre><code>// Repository
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    Page&lt;User&gt; findByRole(String role, Pageable pageable);
    // Spring generates: SELECT * FROM users WHERE role=? LIMIT ? OFFSET ?
}

// Service
Page&lt;User&gt; users = userRepo.findByRole("ADMIN",
    PageRequest.of(0, 10, Sort.by("name").ascending()));

System.out.println(users.getContent());      // List&lt;User&gt; for this page
System.out.println(users.getTotalElements()); // total records
System.out.println(users.getTotalPages());    // total pages
System.out.println(users.hasNext());          // more pages?

// Controller — Spring auto-resolves Pageable from query params
@GetMapping("/users")
Page&lt;UserDto&gt; getUsers(
    @PageableDefault(size=20, sort="name") Pageable pageable) {
    return userService.findAll(pageable).map(UserMapper::toDto);
}
// GET /users?page=0&size=10&sort=name,asc</code></pre>`
    },
    {
      tags: ['Composite Key', 'JPA', '@EmbeddedId', '@IdClass', 'Compound PK'],
      q: 'How to create a composite key in JPA?',
      s: '2 approaches: @EmbeddedId with @Embeddable key class, or @IdClass with multiple @Id fields. @EmbeddedId is preferred — cleaner and type-safe.',
      d: `<pre><code>// Approach 1: @EmbeddedId (preferred)
@Embeddable
class OrderItemId implements Serializable {
    Long orderId;
    Long productId;
    // equals() and hashCode() required!
}

@Entity
class OrderItem {
    @EmbeddedId
    OrderItemId id;
    int quantity;
    double price;
}

// Usage:
OrderItemId key = new OrderItemId(orderId, productId);
repo.findById(key);

// Approach 2: @IdClass
class EnrollmentId implements Serializable {
    Long studentId; Long courseId;
}

@Entity @IdClass(EnrollmentId.class)
class Enrollment {
    @Id Long studentId;
    @Id Long courseId;
    LocalDate enrolledAt;
}</code></pre>`
    },
    {
      tags: ['Primary key strategies', 'GenerationType', 'IDENTITY SEQUENCE TABLE AUTO'],
      q: 'What are primary key strategies in JPA?',
      s: 'GenerationType: AUTO (JPA picks), IDENTITY (DB auto-increment), SEQUENCE (DB sequence), TABLE (sequence table). IDENTITY and SEQUENCE are most common.',
      d: `<table>
<tr><th>Strategy</th><th>Behavior</th><th>Best For</th></tr>
<tr><td>AUTO</td><td>JPA picks based on DB</td><td>Prototyping</td></tr>
<tr><td>IDENTITY</td><td>DB auto-increment (MySQL, PostgreSQL)</td><td>MySQL, simple apps</td></tr>
<tr><td>SEQUENCE</td><td>DB sequence object (PostgreSQL, Oracle)</td><td>Batch inserts, PostgreSQL</td></tr>
<tr><td>TABLE</td><td>Special table stores next ID</td><td>DB-agnostic</td></tr>
</table>
<pre><code>// IDENTITY — MySQL auto_increment
@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
Long id;

// SEQUENCE — PostgreSQL (better for batch inserts)
@Id @GeneratedValue(strategy = GenerationType.SEQUENCE,
                    generator = "user_seq")
@SequenceGenerator(name="user_seq", sequenceName="user_sequence",
                   allocationSize=50) // pre-fetches 50 IDs
Long id;</code></pre>`
    },
    {
      tags: ['Single DB', 'Two microservices', 'Shared database', 'Anti-pattern', 'Saga'],
      q: 'Can a single database be shared by two microservices?',
      s: 'Technically yes, but it\'s an anti-pattern — creates coupling, shared schema changes affect both services. Preferred: database per service. If shared, use schema separation or read-only access.',
      d: `<p><strong>Anti-pattern: Shared Database</strong></p>
<ul>
<li>Tight coupling — schema change in one service can break another</li>
<li>Can't scale/deploy services independently</li>
<li>Violates "loose coupling" microservices principle</li>
</ul>
<p><strong>Acceptable exceptions:</strong></p>
<ul>
<li>Read-only access (reporting service reads main DB)</li>
<li>Different schemas within the same DB server</li>
<li>During migration from monolith to microservices</li>
</ul>
<p><strong>Preferred alternatives:</strong></p>
<ul>
<li>Database per service — each microservice owns its data</li>
<li>API composition — services expose APIs, no direct DB access</li>
<li>Saga pattern — distributed transactions across separate DBs</li>
<li>Event sourcing — services publish events, others project their own view</li>
</ul>`
    },
    {
      tags: ['@Transactional', 'Two transactions', 'Internal', 'EntityTransaction', 'JTA'],
      q: '@Transactional creates two transactions internally — explain them',
      s: 'Spring @Transactional manages two layers: the JPA/Hibernate transaction (EntityManager.getTransaction()) and the JDBC connection-level transaction. Spring coordinates both via PlatformTransactionManager.',
      d: `<pre><code>// When @Transactional method is called:

// Layer 1: Spring Transaction Abstraction (PlatformTransactionManager)
// - Opens a transaction at the Spring level
// - Manages propagation (REQUIRED, REQUIRES_NEW, etc.)
// - Handles rollback rules

// Layer 2: JPA/JDBC Transaction
// - EntityManager starts a persistence context
// - JDBC connection from pool is set to autoCommit=false
// - All SQL within the method uses the same connection

// Flow:
@Transactional
void transfer(Long from, Long to, double amt) {
    // Spring proxy intercepts → begins transaction
    // JPA: EntityManager.getTransaction().begin()
    // JDBC: conn.setAutoCommit(false)
    accountRepo.debit(from, amt);   // executes in same connection
    accountRepo.credit(to, amt);   // same connection = atomic
    // Success: commit() on both JPA and JDBC
    // Failure: rollback() on both JPA and JDBC
}
// Spring proxy calls: transactionManager.commit(transactionStatus)
// Which calls: entityManager.getTransaction().commit()
// Which calls: jdbcConnection.commit()</code></pre>`
    },
    {
      tags: ['Transaction Propagation', 'REQUIRED', 'REQUIRES_NEW', 'NESTED', 'JPA'],
      q: 'What is transaction propagation in JPA?',
      s: 'Propagation defines how a method behaves when called within an existing transaction. REQUIRED (default): join existing or create new. REQUIRES_NEW: always new. NESTED: savepoint within existing.',
      d: `<table>
<tr><th>Propagation</th><th>Existing TX?</th><th>Behavior</th></tr>
<tr><td>REQUIRED (default)</td><td>Yes</td><td>Join existing</td></tr>
<tr><td>REQUIRED</td><td>No</td><td>Create new</td></tr>
<tr><td>REQUIRES_NEW</td><td>Yes/No</td><td>Always create new, suspend existing</td></tr>
<tr><td>NESTED</td><td>Yes</td><td>Savepoint within existing TX</td></tr>
<tr><td>SUPPORTS</td><td>Yes</td><td>Join existing</td></tr>
<tr><td>SUPPORTS</td><td>No</td><td>Run without TX</td></tr>
<tr><td>NEVER</td><td>Yes</td><td>Throw exception</td></tr>
<tr><td>NOT_SUPPORTED</td><td>Yes</td><td>Suspend TX, run without</td></tr>
</table>
<pre><code>@Service class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void logAudit(String action) {
        auditRepo.save(new AuditLog(action));
        // Commits INDEPENDENTLY — even if outer TX rolls back
    }
}
// Use REQUIRES_NEW for: audit logging, notification sending
// (should persist even if main business TX fails)</code></pre>`
    },
    {
      tags: ['Request flow', 'HTTP request', 'Controller Service Repository', 'End to end'],
      q: 'Explain the whole flow of a request when an endpoint is called',
      s: 'HTTP → Tomcat → DispatcherServlet → Interceptors → Controller → Service → Repository → DB → Response (reversed with DTO mapping).',
      d: `<pre><code>// Full request flow:
// GET /api/users/1

// 1. HTTP Request arrives at embedded Tomcat
// 2. DispatcherServlet receives all requests (front controller)
// 3. HandlerMapping finds @GetMapping("/api/users/{id}") on UserController
// 4. Interceptors run (auth check, logging, rate limiting)
// 5. Argument resolvers: @PathVariable id=1 extracted
// 6. UserController.getUserById(1L) called
// 7. UserService.findUser(1L) called (business logic, @Transactional)
// 8. UserRepository.findById(1L) called
// 9. Hibernate generates: SELECT * FROM users WHERE id=1
// 10. JDBC executes on DB, ResultSet returned
// 11. Hibernate maps ResultSet → User entity
// 12. Service maps User → UserDto (avoids exposing entity)
// 13. Controller returns ResponseEntity&lt;UserDto&gt;
// 14. @RestController: HttpMessageConverter (Jackson) converts DTO → JSON
// 15. HTTP Response: 200 {"id":1,"name":"Alice"}

// Spring Security adds: between step 2 and 3
// JWT filter validates token, sets SecurityContext</code></pre>`
    },
    {
      tags: ['Spring Data JPA vs JPA', 'Abstraction', 'Repository', 'Difference'],
      q: 'What is the difference between Spring Data JPA and JPA?',
      s: 'JPA: specification for ORM (EntityManager, JPQL, annotations). Spring Data JPA: Spring abstraction on top of JPA that auto-generates CRUD repository implementations at runtime.',
      d: `<pre><code>// JPA only (without Spring Data):
@PersistenceContext EntityManager em;

User findById(Long id) { return em.find(User.class, id); }
void save(User u) { em.persist(u); }
List&lt;User&gt; findAll() {
    return em.createQuery("SELECT u FROM User u", User.class).getResultList();
}
// 50+ lines of boilerplate for basic CRUD!

// Spring Data JPA — just declare the interface:
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    List&lt;User&gt; findByEmail(String email); // auto-generated!
    // Spring creates implementation at runtime using reflection + JPA
}

// Under the hood: Spring Data JPA uses JPA's EntityManager internally
// JPA → Hibernate → JDBC → Database
// Spring Data JPA → JPA (EntityManager) → Hibernate → JDBC → Database</code></pre>`
    }
  ],

  microservices: [
    {
      tags: ['Circuit Breaker', 'Resilience4j', 'States', 'Closed Open HalfOpen'],
      q: 'What is a circuit breaker pattern?',
      s: 'Prevents cascade failures by stopping calls to a failing service. 3 states: Closed (normal), Open (failing — reject all), Half-Open (test if recovered). Implemented by Resilience4j in Spring Boot.',
      d: `<pre><code>// States:
// CLOSED → normal, calls pass through, monitor failure rate
// OPEN   → failure rate exceeded threshold, ALL calls rejected (fast fail)
// HALF-OPEN → after waitDuration, allow limited calls to test recovery

// Spring Boot + Resilience4j
@CircuitBreaker(name = "userService", fallbackMethod = "fallback")
public UserDto getUser(Long id) {
    return userServiceClient.findById(id);
}

public UserDto fallback(Long id, Exception ex) {
    log.warn("Circuit breaker activated for userId {}: {}", id, ex.getMessage());
    return new UserDto(id, "Unknown User"); // graceful degradation
}

# application.yml
resilience4j:
  circuitbreaker:
    instances:
      userService:
        slidingWindowSize: 10          # last 10 calls
        failureRateThreshold: 50       # open if 50% fail
        waitDurationInOpenState: 10s   # wait before half-open
        permittedCallsInHalfOpenState: 3</code></pre>`
    },
    {
      tags: ['WebClient', 'FeignClient', 'Reactive', 'When to use', 'Difference'],
      q: 'What is WebClient? When to use WebClient over FeignClient?',
      s: 'WebClient: reactive, non-blocking HTTP client (Spring WebFlux). FeignClient: declarative, blocking. Use WebClient for reactive/async apps. FeignClient for simple synchronous microservice calls.',
      d: `<table>
<tr><th>Feature</th><th>WebClient</th><th>FeignClient</th></tr>
<tr><td>Model</td><td>Reactive (non-blocking)</td><td>Imperative (blocking)</td></tr>
<tr><td>Declaration</td><td>Builder API</td><td>Interface + annotations</td></tr>
<tr><td>Streaming</td><td>Yes (Flux/Mono)</td><td>No</td></tr>
<tr><td>Load balancing</td><td>Yes (@LoadBalanced)</td><td>Yes (native)</td></tr>
<tr><td>Use case</td><td>Reactive apps, streaming, parallel calls</td><td>Simple synchronous REST calls</td></tr>
</table>
<pre><code>// WebClient — non-blocking
WebClient client = WebClient.builder().baseUrl("http://user-service").build();
Mono&lt;UserDto&gt; user = client.get().uri("/users/{id}", id)
    .retrieve().bodyToMono(UserDto.class);
// Multiple parallel calls:
Mono.zip(fetchUser(1L), fetchOrders(1L)).subscribe(...);

// FeignClient — blocking, declarative
@FeignClient("user-service")
interface UserClient { @GetMapping("/users/{id}") UserDto getUser(@PathVariable Long id); }
UserDto user = userClient.getUser(1L); // blocks until response</code></pre>`
    },
    {
      tags: ['Eureka mandatory', 'Service Discovery', 'Consul', 'Kubernetes', 'DNS'],
      q: 'Is Eureka Server mandatory? Alternatives?',
      s: 'No. Eureka is one option. Alternatives: Consul, Apache Zookeeper, Kubernetes Service Discovery (DNS-based), Nacos. In K8s, service discovery is built-in via kube-dns.',
      d: `<ul>
<li><strong>Netflix Eureka</strong> — most common with Spring Cloud, AP in CAP theorem.</li>
<li><strong>HashiCorp Consul</strong> — CP, supports health checks, KV store, multi-datacenter.</li>
<li><strong>Apache Zookeeper</strong> — CP, used by Kafka for coordination.</li>
<li><strong>Kubernetes Service Discovery</strong> — built-in DNS, no extra infrastructure needed. Services accessible by DNS name <code>service-name.namespace.svc.cluster.local</code>.</li>
<li><strong>Alibaba Nacos</strong> — AP or CP configurable, popular in China.</li>
</ul>
<pre><code>// In Kubernetes — no Eureka needed
// user-service deployed as K8s Service
// order-service calls: http://user-service/users/1
// K8s DNS resolves "user-service" to ClusterIP automatically</code></pre>`
    },
    {
      tags: ['API Gateway', 'Spring Cloud Gateway', 'Cloud Gateway', 'Routing'],
      q: 'What is Cloud Gateway (Spring Cloud Gateway)?',
      s: 'Spring Cloud Gateway is the Spring recommended API gateway — reactive (built on Spring WebFlux + Netty). Routes requests, applies filters (auth, rate limit, retry), integrates with Eureka for lb:// URIs.',
      d: `<pre><code>spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: lb://USER-SERVICE      # load-balanced via Eureka
          predicates:
            - Path=/api/users/**      # route when path matches
            - Method=GET,POST
          filters:
            - StripPrefix=1           # remove /api prefix before forwarding
            - AddRequestHeader=X-Gateway, "true"
            - CircuitBreaker=name:userCB,fallbackUri:forward:/fallback
            - RequestRateLimiter=redis  # rate limiting

# Gateway also supports:
# - JWT validation filter
# - CORS configuration
# - Request/Response modification
# - Retry on failure</code></pre>`
    },
    {
      tags: ['Ribbon', 'Client-side Load Balancing', 'Deprecated', 'Spring Cloud LoadBalancer'],
      q: 'What is Ribbon? Is it still used?',
      s: 'Ribbon was Netflix\'s client-side load balancer, deprecated and removed from Spring Cloud 2020. Replaced by Spring Cloud LoadBalancer — lighter, reactive-compatible, built into Spring Cloud.',
      d: `<p>Ribbon was part of Netflix OSS stack alongside Eureka, Hystrix, Zuul. It provided round-robin, random, and weighted load balancing on the client side.</p>
<p><strong>Why deprecated:</strong> tied to RxJava 1.x, not reactive-compatible, Netflix entered maintenance mode.</p>
<pre><code>// OLD way with Ribbon (deprecated):
@LoadBalanced // used Ribbon internally
@Bean RestTemplate restTemplate() { return new RestTemplate(); }

// NEW way with Spring Cloud LoadBalancer:
@LoadBalanced // now uses Spring Cloud LoadBalancer
@Bean WebClient.Builder webClientBuilder() { return WebClient.builder(); }

// Or with Feign (uses Spring Cloud LoadBalancer automatically)
@FeignClient("user-service") // lb:// resolved by Spring Cloud LoadBalancer</code></pre>`
    },
    {
      tags: ['Service Mesh', 'Istio', 'Sidecar', 'mTLS', 'Observability'],
      q: 'What is service mesh?',
      s: 'Infrastructure layer for microservice-to-microservice communication. Handles: mTLS, load balancing, circuit breaking, observability, retries — at infrastructure level, NOT application code. Istio/Linkerd are popular.',
      d: `<pre><code>// Without service mesh: each service implements its own
// - Security (TLS)
// - Retry logic
// - Circuit breaker
// - Observability (tracing)

// With service mesh (Istio):
// A sidecar proxy (Envoy) is injected alongside each pod
// All traffic goes through sidecar — it handles:
// - mTLS (automatic mutual TLS between services)
// - Load balancing
// - Circuit breaking
// - Distributed tracing (integrates with Jaeger/Zipkin)
// - Traffic management (canary, A/B testing)

// Application code has ZERO networking code:
// Service A → Envoy sidecar → Envoy sidecar → Service B

# Istio VirtualService (traffic routing)
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
spec:
  http:
  - route:
    - destination: { host: user-service, subset: v1 }
      weight: 90
    - destination: { host: user-service, subset: v2 }
      weight: 10  # 10% canary to v2</code></pre>`
    },
    {
      tags: ['API Gateway load balance', 'Can it load balance itself', 'Cluster', 'Multiple instances'],
      q: 'Can the API Gateway load-balance itself?',
      s: 'No — the API Gateway is a single entry point. To avoid it being a SPOF, run multiple instances behind a hardware/cloud load balancer (AWS ELB, NGINX, K8s Service). The LB distributes to multiple gateway instances.',
      d: `<pre><code>// API Gateway can load-balance DOWNSTREAM services:
// Gateway → lb://USER-SERVICE → [user-service:8081, user-service:8082]
// This is its primary function

// But Gateway itself needs external LB to avoid being SPOF:
// Internet → AWS ALB/ELB → [Gateway:8080 pod1, Gateway:8080 pod2, pod3]
//                                        ↓
//                              lb://USER-SERVICE → user-service instances

// In Kubernetes:
# gateway-deployment.yaml
spec:
  replicas: 3  # 3 gateway instances
  # K8s Service load-balances across these 3 pods

# aws: ELB → K8s ingress → gateway service → 3 gateway pods</code></pre>`
    }
  ],

  testing: [
    {
      tags: ['Why unit testing', 'Benefits', 'Confidence', 'Regression', 'Documentation'],
      q: 'Why is unit testing needed?',
      s: 'Catch bugs early (cheaper to fix), prevent regression, confidence during refactoring, tests as living documentation, enables CI/CD. Unit tests run in milliseconds, give instant feedback.',
      d: `<ol>
<li><strong>Early bug detection.</strong> Bugs found during development are 10x cheaper to fix than in production.</li>
<li><strong>Regression prevention.</strong> Tests catch when a new change breaks existing functionality.</li>
<li><strong>Safe refactoring.</strong> Confidence to change code knowing tests will catch breaks.</li>
<li><strong>Living documentation.</strong> Tests describe expected behavior better than comments.</li>
<li><strong>CI/CD enablement.</strong> Automated tests gate deployments — failing tests block bad releases.</li>
<li><strong>Design feedback.</strong> Hard-to-test code often signals bad design (too many dependencies, tight coupling).</li>
</ol>`
    },
    {
      tags: ['Mockito exceptions', 'thenThrow', 'doThrow', 'Handle exceptions', 'Testing'],
      q: 'How to handle exceptions in Mockito?',
      s: 'Use thenThrow() for methods that return a value. Use doThrow() for void methods. Verify exception propagation with assertThrows in JUnit 5.',
      d: `<pre><code>// Non-void method — thenThrow
when(userRepo.findById(999L)).thenThrow(new EntityNotFoundException("User not found"));

// Void method — doThrow
doThrow(new RuntimeException("DB error")).when(userRepo).delete(any());

// Test the exception is thrown:
@Test
void getUser_notFound_throwsException() {
    when(userRepo.findById(999L)).thenThrow(new EntityNotFoundException("Not found"));

    EntityNotFoundException ex = assertThrows(
        EntityNotFoundException.class,
        () -&gt; userService.getUser(999L)
    );
    assertEquals("Not found", ex.getMessage());
}

// Multiple calls — throw first, return second
when(cache.get("key"))
    .thenThrow(new CacheException())  // first call
    .thenReturn("cached-value");      // second call</code></pre>`
    },
    {
      tags: ['Mockito annotations', 'All', '@Mock', '@Spy', '@Captor', '@InjectMocks'],
      q: 'All Mockito annotations',
      s: '@Mock (fake object), @Spy (real+override), @InjectMocks (inject mocks into class under test), @Captor (capture arguments), @MockBean/@SpyBean (Spring context mocks).',
      d: `<table>
<tr><th>Annotation</th><th>Purpose</th></tr>
<tr><td>@Mock</td><td>Create a complete fake — all methods return defaults</td></tr>
<tr><td>@Spy</td><td>Wrap real object — real methods unless stubbed</td></tr>
<tr><td>@InjectMocks</td><td>Create class under test + inject @Mock/@Spy fields</td></tr>
<tr><td>@Captor</td><td>Capture method arguments for assertions</td></tr>
<tr><td>@MockBean</td><td>Spring: replace bean in ApplicationContext with mock</td></tr>
<tr><td>@SpyBean</td><td>Spring: replace bean with spy (real + override)</td></tr>
</table>
<pre><code>// @Captor example
@Captor ArgumentCaptor&lt;Order&gt; orderCaptor;

verify(orderRepo).save(orderCaptor.capture());
Order saved = orderCaptor.getValue();
assertEquals("PLACED", saved.getStatus()); // verify what was passed to save()

// @MockBean (Spring integration test)
@SpringBootTest
class OrderControllerTest {
    @MockBean UserService userService; // replaces real UserService in context
    @Autowired MockMvc mockMvc;
}</code></pre>`
    },
    {
      tags: ['Unit testing REST API', 'MockMvc', '@WebMvcTest', 'Controller test'],
      q: 'How to do unit testing for REST APIs in Spring Boot?',
      s: '@WebMvcTest loads only web layer (controller). MockMvc performs HTTP requests without real server. @MockBean mocks service layer. Test request mapping, response body, status codes.',
      d: `<pre><code>@WebMvcTest(UserController.class)  // only loads UserController and MVC infrastructure
class UserControllerTest {

    @Autowired MockMvc mockMvc;

    @MockBean UserService userService; // mock the service

    @Test
    void getUser_success() throws Exception {
        when(userService.getUser(1L)).thenReturn(new UserDto(1L, "Alice", "a@mail.com"));

        mockMvc.perform(get("/api/users/1")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Alice"))
            .andExpect(jsonPath("$.email").value("a@mail.com"));
    }

    @Test
    void createUser_validInput_returns201() throws Exception {
        String body = """{"name":"Bob","email":"b@mail.com"}""";
        when(userService.create(any())).thenReturn(new UserDto(2L,"Bob","b@mail.com"));

        mockMvc.perform(post("/api/users")
                .content(body).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(2));
    }
}</code></pre>`
    }
  ],

  rest: [
    {
      tags: ['HTTP Status Codes', '429', '4xx 5xx 2xx', 'All major codes'],
      q: 'All HTTP status codes — explain 429 and others',
      s: '1xx=informational, 2xx=success, 3xx=redirect, 4xx=client error, 5xx=server error. 429=Too Many Requests (rate limit). Know: 200,201,204,400,401,403,404,409,422,429,500,502,503.',
      d: `<table>
<tr><th>Code</th><th>Name</th><th>When</th></tr>
<tr><td>200</td><td>OK</td><td>Successful GET/PUT/PATCH</td></tr>
<tr><td>201</td><td>Created</td><td>Successful POST (resource created)</td></tr>
<tr><td>204</td><td>No Content</td><td>Successful DELETE, no body</td></tr>
<tr><td>301</td><td>Moved Permanently</td><td>Permanent redirect</td></tr>
<tr><td>304</td><td>Not Modified</td><td>Cache is valid, use cached response</td></tr>
<tr><td>400</td><td>Bad Request</td><td>Invalid request body/params</td></tr>
<tr><td>401</td><td>Unauthorized</td><td>Not authenticated (no/invalid token)</td></tr>
<tr><td>403</td><td>Forbidden</td><td>Authenticated but not authorized</td></tr>
<tr><td>404</td><td>Not Found</td><td>Resource doesn't exist</td></tr>
<tr><td>405</td><td>Method Not Allowed</td><td>Wrong HTTP verb</td></tr>
<tr><td>409</td><td>Conflict</td><td>Duplicate resource, version conflict</td></tr>
<tr><td>422</td><td>Unprocessable Entity</td><td>Validation error (semantic)</td></tr>
<tr><td>429</td><td>Too Many Requests</td><td>Rate limit exceeded</td></tr>
<tr><td>500</td><td>Internal Server Error</td><td>Unhandled server exception</td></tr>
<tr><td>502</td><td>Bad Gateway</td><td>Gateway received invalid response</td></tr>
<tr><td>503</td><td>Service Unavailable</td><td>Server overloaded or down</td></tr>
<tr><td>504</td><td>Gateway Timeout</td><td>Upstream timeout</td></tr>
</table>
<pre><code>// 429 Too Many Requests — rate limiting
// Response should include:
// Retry-After: 60 (seconds until retry allowed)
// X-RateLimit-Limit: 100 (requests per window)
// X-RateLimit-Remaining: 0 (remaining requests)
// X-RateLimit-Reset: 1623456789 (epoch when limit resets)</code></pre>`
    }
  ]
}

export default BATCH2_SPRING
