const SPRING_DATA = [
  {
    id: 'spring-core', title: 'Core Spring & Spring Boot', category: 'Spring / Spring Boot', color: 'spring',
    questions: [
      {
        tags: ['IoC', 'Dependency Injection', 'ApplicationContext', 'Loose Coupling'],
        q: 'What is Spring IoC (Inversion of Control)?',
        s: 'IoC inverts control of object creation — instead of classes creating dependencies, the IoC container creates and injects them. You declare WHAT you need; Spring provides HOW.',
        d: `<pre><code>// Without IoC — tight coupling
class OrderService {
    PaymentService payment = new PaymentService(); // you create it
}

// With IoC — Spring injects
@Service
class OrderService {
    @Autowired PaymentService payment; // Spring creates and injects
}</code></pre>
<p>The <strong>ApplicationContext</strong> is the IoC container — manages bean lifecycle, configuration, and dependency injection.</p>`
      },
      {
        tags: ['AOP', 'Cross-cutting Concern', 'Aspect', 'Advice', 'Pointcut'],
        q: 'What is Spring AOP?',
        s: 'Aspect-Oriented Programming separates cross-cutting concerns (logging, security, transactions) from business logic via @Aspect, @Before, @After, @Around, @Pointcut.',
        d: `<pre><code>@Aspect @Component
public class LoggingAspect {
    @Around("execution(* com.app.service.*.*(..))")
    public Object logTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();           // actual method call
        long time = System.currentTimeMillis() - start;
        System.out.println(pjp.getSignature() + " took " + time + "ms");
        return result;
    }
}</code></pre>
<ol>
<li><strong>Aspect</strong> — the cross-cutting concern class (logging, security).</li>
<li><strong>Advice</strong> — what to do: @Before, @After, @Around, @AfterThrowing.</li>
<li><strong>Pointcut</strong> — where to apply: expression matching method signatures.</li>
<li><strong>JoinPoint</strong> — actual method execution point at runtime.</li>
</ol>`
      },
      {
        tags: ['@SpringBootApplication', '@Configuration', '@EnableAutoConfiguration', '@ComponentScan'],
        q: 'What is @SpringBootApplication?',
        s: 'Meta-annotation combining @Configuration + @EnableAutoConfiguration + @ComponentScan. Enables auto-config, component scanning, and bean definitions in one annotation.',
        d: `<pre><code>@SpringBootApplication
// is exactly equivalent to:
@Configuration          // marks class as bean definition source
@EnableAutoConfiguration // auto-configure based on classpath
@ComponentScan          // scan current package + sub-packages
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}</code></pre>`
      },
      {
        tags: ['Bean Scope', 'Singleton', 'Prototype', 'Request', 'Session'],
        q: 'Bean scopes in Spring Boot',
        s: 'Singleton (default — one per container), Prototype (new per injection), Request (per HTTP request), Session (per HTTP session). Singleton is most common.',
        d: `<pre><code>@Component @Scope("singleton")   // default — one shared instance
@Component @Scope("prototype")   // new instance every time it's injected
@Component @Scope("request")     // new per HTTP request
@Component @Scope("session")     // new per HTTP session</code></pre>
<h4>Prototype in Singleton problem</h4>
<p>If a prototype bean is injected into a singleton, the singleton holds ONE prototype instance — effectively making it singleton. Fix with <code>@Lookup</code> or <code>ObjectProvider</code>.</p>
<pre><code>@Service
class SingletonService {
    @Lookup
    public PrototypeService getPrototype() { return null; } // Spring overrides
}</code></pre>`
      },
      {
        tags: ['@Qualifier', '@Primary', 'Disambiguation', 'Multiple Beans'],
        q: '@Qualifier vs @Primary',
        s: '@Primary: default bean when multiple implementations exist. @Qualifier("name"): picks exact bean by name. @Qualifier takes precedence over @Primary.',
        d: `<pre><code>@Service @Primary
class GmailSender implements EmailSender { } // default when ambiguous

@Service
@Qualifier("sendgrid")
class SendgridSender implements EmailSender { }

// Injection
@Autowired EmailSender sender; // gets GmailSender (@Primary)

@Autowired @Qualifier("sendgrid")
EmailSender sender; // gets SendgridSender (explicit)</code></pre>`
      },
      {
        tags: ['Bean Lifecycle', '@PostConstruct', '@PreDestroy', 'Initialization', 'Destroy'],
        q: 'What is the lifecycle of a Spring Bean?',
        s: 'Instantiation → Property injection → @PostConstruct/afterPropertiesSet() → Ready → @PreDestroy/destroy() → Destroyed.',
        d: `<pre><code>@Component
class MyBean implements InitializingBean, DisposableBean {

    @PostConstruct
    void init() { System.out.println("1. @PostConstruct"); }

    @Override
    public void afterPropertiesSet() { System.out.println("2. afterPropertiesSet"); }

    @PreDestroy
    void cleanup() { System.out.println("3. @PreDestroy"); }

    @Override
    public void destroy() { System.out.println("4. destroy()"); }
}</code></pre>
<p>Prefer <code>@PostConstruct</code> / <code>@PreDestroy</code> (JSR-250) — they're portable and not Spring-specific.</p>`
      },
      {
        tags: ['Circular Dependency', '@Lazy', 'Setter Injection', 'Redesign'],
        q: 'What is Circular Dependency and how to resolve?',
        s: 'Bean A depends on B, B depends on A. Constructor injection fails at startup. Fix: @Lazy on one dep, setter injection, or restructure (introduce Service C).',
        d: `<pre><code>// PROBLEM:
@Service class A { @Autowired B b; }
@Service class B { @Autowired A a; }

// Fix 1: @Lazy — B injected as proxy, resolved at first use
@Service class A { @Lazy @Autowired B b; }

// Fix 2: Setter injection — Spring resolves after creation
@Service class A {
    private B b;
    @Autowired public void setB(B b) { this.b = b; }
}

// Fix 3 (best): Redesign — introduce Service C with shared logic
// A → C ← B  (no cycle)</code></pre>`
      },
      {
        tags: ['Constructor Injection', 'Setter Injection', 'Field Injection', 'Best Practice'],
        q: 'Types of dependency injection — which is preferred?',
        s: 'Constructor injection (recommended — immutable, testable), Setter injection (optional deps), Field injection (@Autowired on field — avoid, hard to test, hides deps).',
        d: `<pre><code>// ✅ Constructor injection (BEST)
@Service
class OrderService {
    private final PaymentService payment; // immutable — great!
    // Spring 4.3+: @Autowired optional for single constructor
    public OrderService(PaymentService payment) {
        this.payment = payment;
    }
}

// ❌ Field injection (AVOID in production)
@Service
class OrderService {
    @Autowired PaymentService payment; // hidden dep, hard to unit-test
}</code></pre>
<p><strong>Why constructor injection?</strong> Mandatory deps are explicit, fields can be <code>final</code>, easy to test (just pass mock in constructor).</p>`
      }
    ]
  },

  {
    id: 'rest', title: 'REST & Web', category: 'Spring / Spring Boot', color: 'spring',
    questions: [
      {
        tags: ['@RequestParam', '@PathVariable', 'Query String', 'URL Path'],
        q: '@RequestParam vs @PathVariable',
        s: '@PathVariable: extracts from URL path (/users/{id}). @RequestParam: extracts from query string (/users?id=1&name=X). Both can be used together.',
        d: `<pre><code>// @PathVariable — from URL path segment
@GetMapping("/users/{id}")
User getUser(@PathVariable Long id) { ... }
// GET /users/42 → id=42

// @RequestParam — from query string
@GetMapping("/users")
List&lt;User&gt; search(
    @RequestParam String name,
    @RequestParam(required=false, defaultValue="0") int page) { ... }
// GET /users?name=Alice&page=1

// Both together
@GetMapping("/depts/{deptId}/users")
List&lt;User&gt; get(@PathVariable Long deptId, @RequestParam String role) { ... }
// GET /depts/5/users?role=ADMIN</code></pre>`
      },
      {
        tags: ['REST Constraints', 'Stateless', 'Uniform Interface', 'Cacheable', 'Client-Server'],
        q: 'Explain REST principles (RESTful constraints)',
        s: '6 constraints: Client-Server, Stateless (no server session), Cacheable, Uniform Interface (standard HTTP methods + URIs), Layered System, Code on Demand (optional).',
        d: `<ol>
<li><strong>Client-Server.</strong> UI and data storage are separated — each can evolve independently.</li>
<li><strong>Stateless.</strong> Each request is self-contained — server stores NO session state. Auth token must be in every request.</li>
<li><strong>Cacheable.</strong> Responses declare cacheability via <code>Cache-Control</code> headers.</li>
<li><strong>Uniform Interface.</strong> Resources via URI, standard methods (GET/POST/PUT/DELETE), HATEOAS links.</li>
<li><strong>Layered System.</strong> Client doesn't know if talking to origin server or proxy/load balancer.</li>
<li><strong>Code on Demand (optional).</strong> Server can send executable code (JavaScript).</li>
</ol>`
      },
      {
        tags: ['PUT', 'PATCH', 'Idempotent', 'HTTP Methods', 'Partial Update'],
        q: 'PUT vs PATCH — difference',
        s: 'PUT replaces entire resource (all fields required). PATCH partially updates (only changed fields). GET/PUT/DELETE are idempotent. POST/PATCH may not be.',
        d: `<pre><code>// PUT — replace entire user (all fields required)
PUT /users/1
{ "name": "Alice", "email": "new@mail.com", "age": 25 }
// Missing fields become null/default

// PATCH — update only specific fields
PATCH /users/1
{ "email": "new@mail.com" }
// Only email changes; name and age unchanged</code></pre>
<table>
<tr><th>Method</th><th>Idempotent</th><th>Safe (read-only)</th></tr>
<tr><td>GET</td><td>Yes</td><td>Yes</td></tr>
<tr><td>POST</td><td>No</td><td>No</td></tr>
<tr><td>PUT</td><td>Yes</td><td>No</td></tr>
<tr><td>PATCH</td><td>Maybe</td><td>No</td></tr>
<tr><td>DELETE</td><td>Yes</td><td>No</td></tr>
</table>`
      },
      {
        tags: ['Authentication', 'Authorization', 'Spring Security', '@PreAuthorize', 'hasRole'],
        q: 'Authentication vs Authorization in Spring Security',
        s: 'Authentication: WHO are you? (login, verify identity). Authorization: WHAT can you do? (permissions/roles). Authentication first, then authorization.',
        d: `<pre><code>@Configuration
class SecurityConfig {
    @Bean
    SecurityFilterChain filter(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN") // AUTHORIZATION
                .anyRequest().authenticated()
            )
            .oauth2Login(withDefaults()) // AUTHENTICATION mechanism
            .build();
    }
}

// Method-level authorization
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
public void deleteUser(Long id) { ... } // authorization check</code></pre>`
      }
    ]
  },

  {
    id: 'jpa', title: 'Data & Transactions (JPA)', category: 'Spring / Spring Boot', color: 'spring',
    questions: [
      {
        tags: ['@Transactional', 'Isolation', 'Propagation', 'Rollback', 'ACID'],
        q: '@Transactional — what is it and what are isolation levels?',
        s: '@Transactional wraps a method in a DB transaction. Commit on success, rollback on exception. Isolation levels control how concurrent transactions see each other.',
        d: `<pre><code>@Service
class OrderService {
    @Transactional(
        propagation = Propagation.REQUIRED,    // join existing or create new
        isolation   = Isolation.READ_COMMITTED,
        rollbackFor = Exception.class,
        timeout     = 30
    )
    public void placeOrder(Order order) {
        orderRepo.save(order);
        inventoryService.updateStock(order); // if fails → order rolled back too
    }
}</code></pre>
<table>
<tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom Read</th></tr>
<tr><td>READ_UNCOMMITTED</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>READ_COMMITTED</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>REPEATABLE_READ</td><td>No</td><td>No</td><td>Yes</td></tr>
<tr><td>SERIALIZABLE</td><td>No</td><td>No</td><td>No</td></tr>
</table>`
      },
      {
        tags: ['JpaRepository', 'CrudRepository', 'Custom Query', '@Query', 'Derived Query'],
        q: 'CrudRepository vs JpaRepository — custom queries',
        s: 'CrudRepository: basic CRUD. JpaRepository extends it + adds flush, saveAndFlush, Pageable, Sort. Custom queries via method names or @Query annotation.',
        d: `<pre><code>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // Derived query — Spring generates SQL from method name
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByAgeGreaterThanAndActiveTrue(int age);

    // JPQL query
    @Query("SELECT u FROM User u WHERE u.age &gt; :age ORDER BY u.name")
    List&lt;User&gt; findAdults(@Param("age") int age);

    // Native SQL
    @Query(value = "SELECT * FROM users WHERE dept = ?1", nativeQuery = true)
    List&lt;User&gt; findByDeptNative(String dept);
}</code></pre>`
      },
      {
        tags: ['@ManyToOne', '@OneToMany', 'LAZY', 'EAGER', '@JoinColumn'],
        q: '@ManyToOne — One-to-Many vs Many-to-One with code',
        s: 'One Department has many Employees (OneToMany). Many Employees belong to one Department (ManyToOne). @JoinColumn on owning side (Employee). Always use LAZY fetch.',
        d: `<pre><code>@Entity
class Department {
    @Id @GeneratedValue Long id;
    String name;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL,
               fetch = FetchType.LAZY)  // LAZY = don't load employees automatically
    List&lt;Employee&gt; employees;
}

@Entity
class Employee {
    @Id @GeneratedValue Long id;
    String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id") // FK column in employee table
    Department department;
}</code></pre>
<p><strong>Fetch type defaults:</strong> @ManyToOne/@OneToOne → EAGER. @OneToMany/@ManyToMany → LAZY. <em>Always override to LAZY in production</em> — prevents N+1 problems.</p>`
      },
      {
        tags: ['@ConfigurationProperties', '@Value', 'YAML', 'Type-safe', 'Properties'],
        q: '@ConfigurationProperties vs @Value',
        s: '@Value: inject single property. @ConfigurationProperties: bind entire property group to a POJO. @ConfigurationProperties preferred — type-safe, IDE autocomplete, validation.',
        d: `<pre><code># application.yml
app:
  mail:
    host: smtp.gmail.com
    port: 587
    username: user@gmail.com

// ✅ @ConfigurationProperties (preferred for groups)
@ConfigurationProperties(prefix = "app.mail")
@Component
class MailProperties {
    private String host;
    private int port;
    private String username;
    // getters/setters auto-bound by Spring
}

// @Value (single properties only)
@Value("\${app.mail.host}")
private String mailHost;

@Value("\${server.port:8080}") // with default
private int port;</code></pre>`
      }
    ]
  },

  {
    id: 'spring-exception', title: 'Exception Handling in Spring', category: 'Spring / Spring Boot', color: 'spring',
    questions: [
      {
        tags: ['@ControllerAdvice', '@ExceptionHandler', 'Global Handler', 'REST Error Response'],
        q: 'Global exception handling in Spring Boot',
        s: '@RestControllerAdvice + @ExceptionHandler methods. Handles exceptions from all @Controller classes. Returns standardized error response across the entire API.',
        d: `<pre><code>@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity&lt;ErrorResponse&gt; handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity&lt;ErrorResponse&gt; handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -&gt; e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(400, msg));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity&lt;ErrorResponse&gt; handleAll(Exception ex) {
        return ResponseEntity.internalServerError()
            .body(new ErrorResponse(500, "Internal error"));
    }
}</code></pre>`
      }
    ]
  },

  {
    id: 'testing', title: 'Testing & Monitoring', category: 'Spring / Spring Boot', color: 'spring',
    questions: [
      {
        tags: ['Mock', 'Spy', 'Mockito', 'Stub', 'Partial Mock'],
        q: 'Mock vs Spy in Mockito — what is stubbing?',
        s: 'Mock: complete fake — all methods return defaults unless stubbed. Spy: wraps real object — real methods called unless stubbed. Stubbing = defining what a method returns.',
        d: `<pre><code>@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock UserRepository userRepo;       // complete fake
    @InjectMocks UserService service;

    @Spy List&lt;String&gt; list = new ArrayList&lt;&gt;(); // real object, partially mocked

    @Test void test() {
        // Stubbing
        when(userRepo.findById(1L)).thenReturn(Optional.of(new User("Alice")));
        doReturn(5).when(list).size(); // override only this method

        User result = service.getUser(1L);
        assertEquals("Alice", result.getName());
        verify(userRepo, times(1)).findById(1L); // verify interaction
    }
}</code></pre>`
      },
      {
        tags: ['Spring Boot Actuator', 'Health', 'Metrics', 'Prometheus', 'Monitoring'],
        q: 'What is Spring Boot Actuator?',
        s: 'Actuator provides production-ready endpoints: /health, /metrics, /info, /beans, /env, /threaddump. Integrates with Prometheus/Grafana for monitoring.',
        d: `<pre><code># application.properties
management.endpoints.web.exposure.include=health,metrics,info,beans
management.endpoint.health.show-details=always

# Endpoints:
# GET /actuator/health  → {"status":"UP","components":...}
# GET /actuator/metrics → available metrics
# GET /actuator/metrics/jvm.memory.used → specific metric value

# Custom health indicator:
@Component
class DbHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        if (dbAvailable())
            return Health.up().withDetail("db", "MySQL 8.0").build();
        return Health.down().withDetail("error", "Cannot connect").build();
    }
}</code></pre>`
      },
      {
        tags: ['JUnit 5', '@BeforeEach', '@ParameterizedTest', '@ValueSource', '@CsvSource'],
        q: 'JUnit annotations and parameterized testing',
        s: '@Test, @BeforeEach, @AfterEach, @BeforeAll, @AfterAll, @Disabled, @ParameterizedTest, @ValueSource, @CsvSource, @ExtendWith. @ParameterizedTest runs test with multiple inputs.',
        d: `<pre><code>@ExtendWith(MockitoExtension.class)
class UserTest {
    @BeforeEach void setUp() { /* runs before each @Test */ }
    @AfterEach  void tearDown() { }

    @Test @DisplayName("Find user by ID")
    void getUserById() { ... }

    @Disabled("Not implemented yet")
    @Test void skippedTest() { }

    @ParameterizedTest
    @ValueSource(strings = {"alice@mail.com", "bob@mail.com"})
    void testValidEmails(String email) { assertTrue(isValid(email)); }

    @ParameterizedTest
    @CsvSource({"Alice, 25", "Bob, 30"})
    void testUsers(String name, int age) {
        assertEquals(name, createUser(name, age).getName());
    }
}</code></pre>`
      }
    ]
  },

  {
    id: 'microservices', title: 'Microservices', category: 'Microservices', color: 'micro',
    questions: [
      {
        tags: ['Microservices', 'Monolith', 'Scalability', 'Deployment', 'Trade-offs'],
        q: 'Microservices vs Monolithic architecture',
        s: 'Monolith: single deployable unit — simple dev, hard to scale parts. Microservices: small independent services — scalable, independent deployment, but operationally complex.',
        d: `<table>
<tr><th>Aspect</th><th>Monolith</th><th>Microservices</th></tr>
<tr><td>Deployment</td><td>Single unit</td><td>Independent per service</td></tr>
<tr><td>Scaling</td><td>Scale whole app</td><td>Scale only bottleneck</td></tr>
<tr><td>Tech stack</td><td>Single</td><td>Polyglot per service</td></tr>
<tr><td>Failure isolation</td><td>Entire app affected</td><td>Isolated (circuit breaker)</td></tr>
<tr><td>Complexity</td><td>Low initially</td><td>High from start</td></tr>
</table>
<h4>Disadvantages of Microservices</h4>
<ol>
<li><strong>Distributed system complexity</strong> — network failures, latency, partial failures.</li>
<li><strong>Data consistency</strong> — no single DB transaction across services, need Saga pattern.</li>
<li><strong>Operational overhead</strong> — containers, orchestration (K8s), service mesh, monitoring.</li>
</ol>`
      },
      {
        tags: ['Eureka', 'Service Registry', 'Service Discovery', 'Load Balancing'],
        q: 'Service Registry and Service Discovery (Eureka)',
        s: 'Service Registry: central directory of all services and their instances/ports. Service Discovery: dynamically find service locations without hardcoding URLs.',
        d: `<pre><code>// Eureka Server
@SpringBootApplication @EnableEurekaServer
class EurekaServerApp { }
# application.yml
server.port: 8761
eureka.client.register-with-eureka: false
eureka.client.fetch-registry: false

// Eureka Client (any microservice)
@SpringBootApplication @EnableDiscoveryClient
class OrderServiceApp { }
# application.yml
spring.application.name: order-service
eureka.client.service-url.defaultZone: http://localhost:8761/eureka

// Call user-service by name (load-balanced)
// http://USER-SERVICE/api/users ← Eureka resolves to actual instance</code></pre>`
      },
      {
        tags: ['Feign Client', 'Declarative HTTP', 'Circuit Breaker', 'Load Balancer', 'Fallback'],
        q: 'Feign Client — why better than alternatives?',
        s: 'Declarative HTTP client — define interface + @FeignClient. Spring generates implementation. Integrates natively with Eureka (lb://), Resilience4j circuit breaker, and load balancer.',
        d: `<pre><code>@FeignClient(name = "user-service", fallback = UserFallback.class)
interface UserServiceClient {
    @GetMapping("/api/users/{id}")
    UserDto getUserById(@PathVariable Long id);
}

@Component // Circuit breaker fallback
class UserFallback implements UserServiceClient {
    public UserDto getUserById(Long id) {
        return new UserDto(id, "Unknown", "fallback@mail.com");
    }
}

@Service
class OrderService {
    @Autowired UserServiceClient userClient; // just use it — Spring handles HTTP
    Order create(Long userId) {
        UserDto user = userClient.getUserById(userId);
    }
}</code></pre>`
      },
      {
        tags: ['API Gateway', 'Spring Cloud Gateway', 'Routing', 'Filter', 'Load Balanced'],
        q: 'API Gateway — what it is and how to implement',
        s: 'Single entry point for all clients. Routes to microservices, handles auth, rate limiting, SSL. Spring Cloud Gateway is the modern implementation.',
        d: `<pre><code>spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE    # load-balanced via Eureka
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Source, gateway
        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/orders/**
            - Method=GET,POST</code></pre>`
      },
      {
        tags: ['Design Patterns', 'Saga', 'CQRS', 'Circuit Breaker', 'BFF', 'Event Sourcing'],
        q: 'Microservices design patterns',
        s: 'API Gateway, Service Registry, Circuit Breaker (Resilience4j), Saga (distributed transactions), CQRS, Event Sourcing, BFF, Sidecar, Strangler Fig.',
        d: `<ol>
<li><strong>API Gateway</strong> — single entry point, routing, cross-cutting concerns.</li>
<li><strong>Service Registry (Eureka)</strong> — dynamic service discovery.</li>
<li><strong>Circuit Breaker (Resilience4j)</strong> — fail fast, prevent cascade failures.</li>
<li><strong>Saga Pattern</strong> — distributed transactions via choreography (events) or orchestration (central coordinator).</li>
<li><strong>CQRS</strong> — separate read (query) and write (command) models for scale.</li>
<li><strong>Event Sourcing</strong> — store events not state; rebuild state by replaying.</li>
<li><strong>BFF (Backend for Frontend)</strong> — different API facades for mobile vs web vs external clients.</li>
</ol>`
      }
    ]
  },

  {
    id: 'stream-coding', title: 'Stream API Coding', category: 'Coding Questions', color: 'coding',
    questions: [
      {
        tags: ['filter', 'sum', 'mapToInt', 'IntStream', 'even numbers'],
        q: 'Filter even numbers and find their sum using Streams',
        s: 'IntStream.rangeClosed(1,100).filter(n->n%2==0).sum() or list.stream().filter(n->n%2==0).mapToInt(Integer::intValue).sum()',
        d: `<pre><code>// Sum of even numbers 1-100
int sum = IntStream.rangeClosed(1, 100)
    .filter(n -&gt; n % 2 == 0)
    .sum(); // 2550

// From a List:
List&lt;Integer&gt; numbers = List.of(1,2,3,4,5,6,7,8,9,10);
int sum = numbers.stream()
    .filter(n -&gt; n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum(); // 30</code></pre>`
      },
      {
        tags: ['2nd largest', 'distinct', 'sorted', 'skip', 'findFirst'],
        q: 'Find the 2nd largest element in a list using Streams',
        s: 'distinct() to handle duplicates → sorted(reverseOrder()) → skip(1) → findFirst()',
        d: `<pre><code>List&lt;Integer&gt; nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);

Optional&lt;Integer&gt; second = nums.stream()
    .distinct()                      // remove duplicates
    .sorted(Comparator.reverseOrder()) // desc order
    .skip(1)                         // skip the largest
    .findFirst();

System.out.println(second.orElse(-1)); // 6</code></pre>`
      },
      {
        tags: ['groupingBy', 'counting', 'LinkedHashMap', 'first non-repeating'],
        q: 'Find first non-repeating character using Streams',
        s: 'Group chars by count (LinkedHashMap preserves insertion order), filter count==1, findFirst().',
        d: `<pre><code>String str = "aabbcde";

Optional&lt;Character&gt; result = str.chars()
    .mapToObj(c -&gt; (char) c)
    .collect(Collectors.groupingBy(
        Function.identity(),
        LinkedHashMap::new,   // IMPORTANT: preserves insertion order
        Collectors.counting()
    ))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() == 1)
    .map(Map.Entry::getKey)
    .findFirst();

System.out.println(result.orElse('?')); // 'c'</code></pre>`
      },
      {
        tags: ['flatMap', 'word frequency', 'groupingBy', 'top 5', 'sentences'],
        q: 'Find top 5 most frequent words from list of sentences using flatMap',
        s: 'flatMap to split sentences → groupingBy + counting → sort by value desc → limit(5)',
        d: `<pre><code>List&lt;String&gt; sentences = List.of(
    "the quick brown fox", "the fox jumped", "the quick cat");

List&lt;String&gt; top5 = sentences.stream()
    .flatMap(s -&gt; Arrays.stream(s.split("\\s+")))
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .sorted(Map.Entry.&lt;String, Long&gt;comparingByValue().reversed())
    .limit(5)
    .map(Map.Entry::getKey)
    .collect(Collectors.toList());

System.out.println(top5); // [the, fox, quick, ...]</code></pre>`
      },
      {
        tags: ['groupingBy', 'summingDouble', 'Employee', 'Department', 'Salary'],
        q: 'Find total salary per department using Streams',
        s: 'Collectors.groupingBy(Employee::getDept, Collectors.summingDouble(Employee::getSalary))',
        d: `<pre><code>record Employee(String name, String dept, double salary) {}

List&lt;Employee&gt; employees = List.of(
    new Employee("Alice", "IT", 80000),
    new Employee("Bob",   "IT", 90000),
    new Employee("Carol", "HR", 60000));

Map&lt;String, Double&gt; salaryByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::dept,
        Collectors.summingDouble(Employee::salary)
    ));

System.out.println(salaryByDept); // {IT=170000.0, HR=60000.0}</code></pre>`
      },
      {
        tags: ['anagram', 'groupingBy', 'sorted chars', 'grouping'],
        q: 'Anagram grouping: ["bat","eat","tea","tan","nat"]',
        s: 'Group by sorted characters — anagrams share the same sorted key.',
        d: `<pre><code>List&lt;String&gt; words = List.of("bat", "eat", "tea", "tan", "nat");

Map&lt;String, List&lt;String&gt;&gt; groups = words.stream()
    .collect(Collectors.groupingBy(w -&gt; {
        char[] chars = w.toCharArray();
        Arrays.sort(chars);
        return new String(chars); // sorted chars = key
    }));

System.out.println(groups.values());
// [[bat], [eat, tea], [tan, nat]]</code></pre>`
      }
    ]
  },

  {
    id: 'dsa', title: 'DSA Interview Questions', category: 'Coding Questions', color: 'coding',
    questions: [
      {
        tags: ['Two Sum', 'HashMap', 'O(n)', 'Complement'],
        q: 'Two Sum — find indices of two numbers that sum to target',
        s: 'HashMap one-pass: store value→index. For each element, check if complement (target-num) exists in map. O(n) time, O(n) space.',
        d: `<pre><code>int[] twoSum(int[] nums, int target) {
    Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();
    for (int i = 0; i &lt; nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement))
            return new int[]{map.get(complement), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}
// Time: O(n) | Space: O(n)</code></pre>`
      },
      {
        tags: ['Valid Parentheses', 'Stack', 'Matching Brackets', 'ArrayDeque'],
        q: 'Valid Parentheses',
        s: 'Push open brackets onto stack. For close brackets, check if stack top matches. Empty stack at end = valid.',
        d: `<pre><code>boolean isValid(String s) {
    Deque&lt;Character&gt; stack = new ArrayDeque&lt;&gt;();
    for (char c : s.toCharArray()) {
        if (c=='(' || c=='{' || c=='[') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if ((c==')' &amp;&amp; top!='(') ||
                (c=='}' &amp;&amp; top!='{') ||
                (c==']' &amp;&amp; top!='[')) return false;
        }
    }
    return stack.isEmpty();
}
// Time: O(n) | Space: O(n)</code></pre>`
      },
      {
        tags: ['Reverse Linked List', 'Three-pointer', 'Iterative', 'O(n)', 'O(1)'],
        q: 'Reverse Linked List',
        s: 'Iterative three-pointer: prev=null, curr=head. At each step: save next, reverse pointer, advance both. O(n) time, O(1) space.',
        d: `<pre><code>ListNode reverse(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next; // save next
        curr.next = prev;          // reverse pointer
        prev = curr;               // advance prev
        curr = next;               // advance curr
    }
    return prev; // new head
}
// Time: O(n) | Space: O(1)</code></pre>`
      },
      {
        tags: ['Sliding Window', 'Longest Substring', 'HashMap', 'Two Pointer'],
        q: 'Longest Substring Without Repeating Characters',
        s: 'Sliding window + HashMap. Expand right; when duplicate found, shrink left to exclude it. Track max window size.',
        d: `<pre><code>int lengthOfLongestSubstring(String s) {
    Map&lt;Character, Integer&gt; map = new HashMap&lt;&gt;();
    int max = 0, left = 0;
    for (int right = 0; right &lt; s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c) &amp;&amp; map.get(c) &gt;= left) {
            left = map.get(c) + 1; // shrink window past duplicate
        }
        map.put(c, right);
        max = Math.max(max, right - left + 1);
    }
    return max;
}
// Time: O(n) | Space: O(m) where m=charset size</code></pre>`
      },
      {
        tags: ['Shift Zeros', 'Two Pointer', 'Write Pointer', 'Maintain Order'],
        q: 'Shift all zeros to end maintaining order: {12,0,0,0,2,34,4,5}',
        s: 'Write pointer tracks next non-zero slot. Pass 1: write all non-zeros. Pass 2: fill remaining with zeros. O(n), O(1).',
        d: `<pre><code>void moveZeroes(int[] arr) {
    int write = 0;
    for (int num : arr)            // write all non-zeros
        if (num != 0) arr[write++] = num;
    while (write &lt; arr.length)    // fill rest with zeros
        arr[write++] = 0;
}
// Input:  {12,0,0,0,2,34,4,5}
// Output: {12,2,34,4,5,0,0,0}
// Time: O(n) | Space: O(1)</code></pre>`
      },
      {
        tags: ['Buy Sell Stock', 'Min Price', 'Max Profit', 'Single Pass'],
        q: 'Buy and sell stock (max profit)',
        s: 'Track minimum price seen so far. At each price, check if selling now gives max profit. Single pass O(n).',
        d: `<pre><code>int maxProfit(int[] prices) {
    int minPrice  = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int price : prices) {
        if (price &lt; minPrice)
            minPrice = price;          // update buy point
        else
            maxProfit = Math.max(maxProfit, price - minPrice); // sell?
    }
    return maxProfit;
}
// Time: O(n) | Space: O(1)</code></pre>`
      },
      {
        tags: ['Floyd\'s Algorithm', 'Cycle Detection', 'Slow-Fast Pointer', 'Linked List'],
        q: 'Detect cycle in linked list (Floyd\'s algorithm)',
        s: 'Slow pointer moves 1 step, fast moves 2 steps. If they meet, cycle exists. O(n) time, O(1) space.',
        d: `<pre><code>boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null &amp;&amp; fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true; // cycle detected!
    }
    return false;
}
// Time: O(n) | Space: O(1)</code></pre>`
      }
    ]
  },

  {
    id: 'database', title: 'Database (SQL)', category: 'Database', color: 'db',
    questions: [
      {
        tags: ['Query Optimization', 'EXPLAIN', 'Index', 'SELECT *', 'Performance'],
        q: 'How do you optimize a slow query?',
        s: 'Check EXPLAIN plan, add indexes on WHERE/JOIN columns, avoid SELECT *, avoid functions on indexed columns, use JOIN instead of subquery, pagination.',
        d: `<ol>
<li><strong>EXPLAIN / EXPLAIN ANALYZE</strong> — identify full table scans and missing indexes.</li>
<li><strong>Add indexes</strong> — on WHERE, JOIN, ORDER BY columns.</li>
<li><strong>Avoid SELECT *</strong> — fetch only the columns you actually need.</li>
<li><strong>Avoid functions on indexed columns</strong> — <code>WHERE DATE(created_at) = '2024'</code> prevents index use; use <code>WHERE created_at &gt;= '2024-01-01'</code>.</li>
<li><strong>Use JOIN instead of subquery</strong> — JOINs are usually better optimized by the query planner.</li>
<li><strong>Pagination</strong> — <code>LIMIT/OFFSET</code> or cursor-based pagination to avoid large result sets.</li>
</ol>`
      },
      {
        tags: ['ACID', 'Atomicity', 'Consistency', 'Isolation', 'Durability'],
        q: 'What are ACID properties?',
        s: 'Atomicity (all or nothing), Consistency (data stays valid), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes).',
        d: `<ol>
<li><strong>Atomicity.</strong> Transaction is all-or-nothing. If any step fails, everything rolls back. Money deducted but not credited? → entire transaction rolls back.</li>
<li><strong>Consistency.</strong> DB moves from one valid state to another. FK constraints, unique constraints always maintained.</li>
<li><strong>Isolation.</strong> Concurrent transactions see each other as if running sequentially. Isolation levels control the trade-off between isolation and performance.</li>
<li><strong>Durability.</strong> Once committed, data survives even system crashes — ensured via WAL (Write-Ahead Logging) and redo logs.</li>
</ol>`
      },
      {
        tags: ['WHERE', 'HAVING', 'GROUP BY', 'Aggregation', 'Filtering'],
        q: 'WHERE clause vs HAVING clause',
        s: 'WHERE filters rows BEFORE grouping. HAVING filters groups AFTER GROUP BY. Cannot use aggregate functions (COUNT, SUM) in WHERE.',
        d: `<pre><code>-- WHERE: filters rows BEFORE aggregation
SELECT dept, COUNT(*) FROM employees
WHERE active = 1       -- filter individual rows first
GROUP BY dept;

-- HAVING: filters AFTER aggregation
SELECT dept, COUNT(*) AS cnt FROM employees
GROUP BY dept
HAVING COUNT(*) &gt; 5;  -- filter groups with fewer than 5 people

-- Both combined:
SELECT dept, AVG(salary) FROM employees
WHERE age &gt; 25              -- filter rows first
GROUP BY dept
HAVING AVG(salary) &gt; 50000; -- then filter groups</code></pre>`
      },
      {
        tags: ['Normalization', '1NF', '2NF', '3NF', 'BCNF', 'Denormalization'],
        q: 'What is normalization?',
        s: '1NF: atomic values. 2NF: no partial dependency on composite PK. 3NF: no transitive dependency. BCNF: every determinant is a candidate key.',
        d: `<ol>
<li><strong>1NF (First Normal Form)</strong> — Atomic values only; no repeating groups or arrays in cells.</li>
<li><strong>2NF</strong> — Every non-key column depends on the WHOLE primary key (removes partial dependencies).</li>
<li><strong>3NF</strong> — No transitive dependencies (non-key columns depend only on PK, not on other non-key columns).</li>
<li><strong>BCNF</strong> — Every determinant is a candidate key (stricter than 3NF).</li>
</ol>
<p><strong>Denormalization:</strong> Intentionally break normalization for read performance (e.g., store <code>department_name</code> in employee table to avoid JOIN).</p>`
      }
    ]
  },

  {
    id: 'git', title: 'Git', category: 'DevOps & Tools', color: 'devops',
    questions: [
      {
        tags: ['merge', 'rebase', 'squash', 'History', 'Linear'],
        q: 'Git merge vs rebase vs squash merge',
        s: 'Merge: preserves full history with merge commit. Rebase: replays commits linearly (no merge commit). Squash: combines all branch commits into one.',
        d: `<pre><code># Merge — creates merge commit, preserves branch history
git checkout main && git merge feature-branch

# Rebase — replay feature commits on top of main (linear history)
git checkout feature-branch
git rebase main
git checkout main && git merge feature-branch  # fast-forward

# Squash — one clean commit for the whole feature
git merge --squash feature-branch
git commit -m "Feature: user authentication"</code></pre>
<ol>
<li><strong>Merge</strong> — public/shared branches; preserves full context and history.</li>
<li><strong>Rebase</strong> — private feature branches before PR; creates clean linear history.</li>
<li><strong>Squash</strong> — many WIP commits → single clean commit for PR review.</li>
</ol>`
      },
      {
        tags: ['git stash', 'Temporary Storage', 'WIP', 'Branch Switch'],
        q: 'What is Git Stash?',
        s: 'git stash saves uncommitted changes to a temporary stack without committing. Allows switching branches without losing work.',
        d: `<pre><code>git stash                   # save current changes
git stash save "WIP: login" # with descriptive name
git stash list              # list all stashes

git stash pop               # restore top stash (removes from stack)
git stash apply stash@{1}   # apply specific stash (keeps in stack)
git stash drop stash@{0}    # remove specific stash
git stash clear             # remove all stashes</code></pre>`
      }
    ]
  },

  {
    id: 'maven', title: 'Maven', category: 'DevOps & Tools', color: 'devops',
    questions: [
      {
        tags: ['Maven Lifecycle', 'compile', 'package', 'install', 'deploy'],
        q: 'Maven lifecycle phases',
        s: 'validate → compile → test → package → verify → install → deploy. Each phase triggers all previous phases. mvn package = compile + test + create JAR.',
        d: `<pre><code>mvn validate   # check project structure
mvn compile    # compile sources → target/classes
mvn test       # run unit tests
mvn package    # create JAR/WAR → target/
mvn verify     # run integration tests
mvn install    # copy to local ~/.m2 repository
mvn deploy     # push to remote repository

# Common shortcuts:
mvn clean package            # fresh build (clean first)
mvn clean install            # build + add to local repo
mvn clean package -DskipTests # skip tests for speed</code></pre>`
      },
      {
        tags: ['Exclude Dependency', 'Transitive', 'pom.xml', 'exclusions'],
        q: 'How to exclude a transitive dependency in Maven',
        s: 'Use <exclusions> inside the dependency that brings in the unwanted transitive dependency.',
        d: `<pre><code>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
            &lt;artifactId&gt;spring-boot-starter-tomcat&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
&lt;!-- Use Jetty instead: --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-jetty&lt;/artifactId&gt;
&lt;/dependency&gt;</code></pre>`
      }
    ]
  },

  {
    id: 'docker', title: 'Docker & Kubernetes', category: 'DevOps & Tools', color: 'devops',
    questions: [
      {
        tags: ['Docker', 'Dockerfile', 'Container', 'Image', 'Spring Boot'],
        q: 'What is Docker? What is a Dockerfile?',
        s: 'Docker: containerization platform — packages app + dependencies into isolated containers. Dockerfile: instruction set to build a Docker image.',
        d: `<pre><code># Dockerfile for Spring Boot
FROM eclipse-temurin:21-jre-alpine  # base JRE image
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build and run:
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0
docker ps                    # list running containers
docker exec -it &lt;id&gt; sh     # shell into container</code></pre>`
      },
      {
        tags: ['Service', 'Deployment', 'Kubernetes', 'K8s', 'ConfigMap'],
        q: 'Service vs Deployment in Kubernetes',
        s: 'Deployment manages pod lifecycle (replicas, rolling updates). Service provides stable network endpoint + load balancing to pods (ClusterIP, NodePort, LoadBalancer).',
        d: `<pre><code># Deployment — manages pod replicas
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: myapp:1.0

# Service — stable endpoint + load balancer
apiVersion: v1
kind: Service
spec:
  type: LoadBalancer
  selector:
    app: myapp         # targets pods with this label
  ports:
  - port: 80
    targetPort: 8080   # pod container port</code></pre>`
      }
    ]
  },

  {
    id: 'agile', title: 'Agile / Scrum', category: 'Agile', color: 'agile',
    questions: [
      {
        tags: ['Scrum Ceremonies', 'Sprint Planning', 'Daily Standup', 'Retrospective', 'Sprint Review'],
        q: 'Describe the SCRUM ceremonies',
        s: 'Sprint Planning, Daily Standup (15min), Sprint Review (demo), Sprint Retrospective (process improvement), Backlog Refinement. Sprint = 1-4 weeks.',
        d: `<table>
<tr><th>Ceremony</th><th>When</th><th>Purpose</th></tr>
<tr><td>Sprint Planning</td><td>Start of sprint</td><td>Commit to sprint backlog from product backlog</td></tr>
<tr><td>Daily Standup</td><td>Every day (15 min)</td><td>Yesterday? Today? Blockers?</td></tr>
<tr><td>Sprint Review</td><td>End of sprint</td><td>Demo increment to stakeholders</td></tr>
<tr><td>Sprint Retrospective</td><td>After Review</td><td>What went well? What to improve?</td></tr>
<tr><td>Backlog Refinement</td><td>Mid-sprint</td><td>Clarify, estimate, prioritize backlog items</td></tr>
</table>`
      },
      {
        tags: ['Scrum Roles', 'Product Owner', 'Scrum Master', 'Development Team'],
        q: 'Roles in Agile/Scrum',
        s: 'Product Owner: defines WHAT (backlog, priorities). Scrum Master: facilitates HOW (removes blockers). Development Team: builds — cross-functional, self-organizing.',
        d: `<ol>
<li><strong>Product Owner</strong> — owns the product backlog, defines features and priorities, represents business stakeholders. Single person accountable for ROI.</li>
<li><strong>Scrum Master</strong> — servant leader, removes impediments, facilitates ceremonies, coaches team on Scrum, shields team from external distractions. NOT a manager.</li>
<li><strong>Development Team</strong> — 3–9 people, cross-functional (dev, QA, design, ops), self-organizing, collectively accountable for sprint delivery.</li>
</ol>`
      },
      {
        tags: ['Agile vs Waterfall', 'Iterative', 'Feedback', 'Change Tolerance'],
        q: 'Why Agile over Waterfall?',
        s: 'Agile: iterative sprints, frequent feedback, adapts to change. Waterfall: sequential, long cycles, change is expensive. Agile delivers value faster with lower risk.',
        d: `<table>
<tr><th>Aspect</th><th>Waterfall</th><th>Agile</th></tr>
<tr><td>Process</td><td>Sequential phases</td><td>Iterative sprints</td></tr>
<tr><td>Customer involvement</td><td>Start and end only</td><td>Continuous feedback</td></tr>
<tr><td>Change handling</td><td>Expensive, disruptive</td><td>Expected, embraced</td></tr>
<tr><td>Delivery</td><td>End of project</td><td>End of each sprint</td></tr>
<tr><td>Risk discovery</td><td>Late (during testing)</td><td>Early (each sprint)</td></tr>
</table>`
      }
    ]
  }
]

export default SPRING_DATA
