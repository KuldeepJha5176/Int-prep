const SPRING_EXTRA = {
  'spring-core': [
    {
      tags: ['Dispatcher Servlet', 'MVC', 'Front Controller', 'Request Flow'],
      q: 'What is the Dispatcher Servlet and Spring MVC architecture?',
      s: 'DispatcherServlet is the front controller — all HTTP requests route through it. It delegates to @Controller, invokes ViewResolver/MessageConverter, returns response.',
      d: `<pre><code>// Request flow:
// HTTP Request
//   → DispatcherServlet
//     → HandlerMapping (finds @Controller by URL)
//     → HandlerAdapter (calls controller method)
//     → Controller returns ResponseBody / ModelAndView
//     → MessageConverter (JSON) or ViewResolver (HTML)
//   ← HTTP Response</code></pre>
<p>Spring Boot auto-configures DispatcherServlet via <code>DispatcherServletAutoConfiguration</code>. All requests to <code>/</code> are routed through it by default.</p>`
    },
    {
      tags: ['@ConditionalOnProperty', 'Conditional Autowiring', 'AutoConfiguration', 'Exclude'],
      q: 'How to implement conditional autowiring? @ConditionalOnProperty?',
      s: '@ConditionalOnProperty: activate bean only if a property is set. @Conditional for custom conditions. Use to enable/disable features via config.',
      d: `<pre><code>// Bean created ONLY if feature.email.enabled=true
@Component
@ConditionalOnProperty(name = "feature.email.enabled", havingValue = "true")
class EmailNotificationService implements NotificationService { ... }

// Exclude from auto-configuration:
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class App { }

// Or in properties:
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration</code></pre>`
    },
    {
      tags: ['BeanFactory', 'ApplicationContext', 'Lazy', 'Eager', 'Events'],
      q: 'BeanFactory vs ApplicationContext',
      s: 'BeanFactory: basic IoC, lazy bean init. ApplicationContext extends it with eager singleton init, i18n, events, AOP, ResourceLoader. Always prefer ApplicationContext.',
      d: `<table>
<tr><th>Feature</th><th>BeanFactory</th><th>ApplicationContext</th></tr>
<tr><td>Bean initialization</td><td>Lazy (on first request)</td><td>Eager (all singletons at startup)</td></tr>
<tr><td>Events</td><td>No</td><td>Yes (ApplicationEvent)</td></tr>
<tr><td>i18n</td><td>No</td><td>Yes (MessageSource)</td></tr>
<tr><td>AOP integration</td><td>Limited</td><td>Full</td></tr>
</table>`
    },
    {
      tags: ['@Bean', 'Ways to create Bean', 'XML', '@Component', 'Configuration'],
      q: 'Where do we use @Bean? How many ways to create a Spring bean?',
      s: '@Bean on methods inside @Configuration class. 4 ways: @Component/@Service/@Repository, @Bean in @Configuration, XML <bean/>, programmatic (registerBean()).',
      d: `<pre><code>// 1. Stereotype annotations
@Service class UserService { }

// 2. @Bean in @Configuration (for 3rd-party classes)
@Configuration
class AppConfig {
    @Bean
    DataSource dataSource() { return new HikariDataSource(...); }
}

// 3. XML (legacy)
// &lt;bean id="userService" class="com.app.UserService"/&gt;

// 4. Programmatic
context.getBeanFactory().registerSingleton("myBean", new MyClass());</code></pre>`
    },
    {
      tags: ['@Slf4j', 'Lombok', 'Logger', 'Log field'],
      q: 'What is @Slf4j?',
      s: 'Lombok annotation that auto-generates a static logger field: private static final Logger log = LoggerFactory.getLogger(ClassName.class). Eliminates boilerplate logging setup.',
      d: `<pre><code>// Without Lombok:
private static final Logger log = LoggerFactory.getLogger(UserService.class);

// With @Slf4j (Lombok):
@Service
@Slf4j
class UserService {
    void process(User u) {
        log.info("Processing user: {}", u.getName());
        log.debug("User details: {}", u);
        log.error("Error occurred", exception);
    }
}</code></pre>`
    },
    {
      tags: ['Stereotype Annotations', '@Component', '@Service', '@Repository', '@Controller'],
      q: 'What are Stereotype annotations?',
      s: '@Component (generic), @Service (service layer), @Repository (DAO — adds exception translation), @Controller (MVC), @Configuration (bean definitions). All trigger component scan.',
      d: `<table>
<tr><th>Annotation</th><th>Layer</th><th>Extra Behavior</th></tr>
<tr><td>@Component</td><td>Any</td><td>Generic — marks for component scan</td></tr>
<tr><td>@Service</td><td>Business logic</td><td>Semantic only (no extra behavior)</td></tr>
<tr><td>@Repository</td><td>Data access</td><td>Exception translation (SQL→Spring)</td></tr>
<tr><td>@Controller</td><td>Web/MVC</td><td>Works with DispatcherServlet</td></tr>
<tr><td>@Configuration</td><td>Config</td><td>Contains @Bean methods</td></tr>
</table>`
    },
    {
      tags: ['Proxy', 'Spring AOP', 'CGLIB', 'JDK Proxy', 'Transactional'],
      q: 'What is Proxy in Spring?',
      s: 'Spring creates proxy objects around beans to intercept method calls for AOP, @Transactional, @Cacheable. JDK proxy for interfaces; CGLIB proxy for classes.',
      d: `<pre><code>// When you annotate a bean method:
@Service
class OrderService {
    @Transactional // Spring wraps OrderService in a proxy
    void placeOrder() { ... }
}

// What you get when @Autowired:
// OrderService$$CGLIB$xxx extends OrderService {
//     void placeOrder() {
//         beginTransaction();
//         super.placeOrder(); // actual method
//         commit();
//     }
// }
// Self-invocation: calling @Transactional from within same class BYPASSES proxy!</code></pre>`
    },
    {
      tags: ['Spring Boot Starter', 'Auto-configuration', 'Dependency', 'Convenience'],
      q: 'What is a Spring Boot Starter?',
      s: 'A pre-packaged set of dependencies for a specific feature. spring-boot-starter-web = Tomcat + Spring MVC + Jackson. Eliminates manual dependency management.',
      d: `<pre><code>// spring-boot-starter-web pulls in:
// spring-webmvc, tomcat-embed-core, jackson-databind
// + auto-configures DispatcherServlet, Jackson ObjectMapper

// spring-boot-starter-data-jpa pulls in:
// spring-data-jpa, hibernate-core, spring-jdbc
// + auto-configures EntityManagerFactory, JpaRepositories

// spring-boot-starter-security:
// spring-security-web, spring-security-config
// + auto-configures basic auth, CSRF, etc.</code></pre>`
    },
    {
      tags: ['Traditional Spring vs Spring Boot', 'JPA Evolution', 'Configuration'],
      q: 'Difference between traditional Spring vs Spring Boot vs JPA evolution',
      s: 'Traditional Spring: XML config, manual setup. Spring Boot: auto-configuration, embedded server, opinionated defaults. JPA → Spring Data JPA: eliminates boilerplate DAO code.',
      d: `<ol>
<li><strong>Traditional Spring (2003)</strong> — XML configuration, manual bean wiring, external Tomcat, verbose DAO code.</li>
<li><strong>Spring Boot (2014)</strong> — auto-configuration, embedded server, @SpringBootApplication, starter POMs, opinionated defaults. No XML needed.</li>
<li><strong>JPA → Spring Data JPA</strong> — JPA defines the spec (EntityManager, JPQL). Hibernate is the implementation. Spring Data JPA adds repositories (JpaRepository) eliminating DAO boilerplate.</li>
</ol>`
    }
  ],

  rest: [
    {
      tags: ['REST Stateless', 'Session', 'JWT', 'Stateful REST'],
      q: 'Is REST always stateless? Can a REST API maintain a session?',
      s: 'REST is designed to be stateless — each request is self-contained. But you can use JWT tokens (client-side session) or cookies. True REST shouldn\'t store per-client state on server.',
      d: `<p>Pure REST is stateless: auth info (JWT) in every request header, no server-side session. However, many APIs use sessions via cookies for simplicity.</p>
<pre><code>// Stateless REST (proper): JWT in every request
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

// "Stateful REST" (anti-pattern): server-side session
Set-Cookie: JSESSIONID=abc123; Path=/</code></pre>`
    },
    {
      tags: ['@Controller', '@RestController', 'ResponseBody', 'View vs JSON'],
      q: 'Difference between @Controller and @RestController',
      s: '@Controller returns view names (MVC/HTML). @RestController = @Controller + @ResponseBody — auto-serializes return value to JSON/XML. No need to add @ResponseBody.',
      d: `<pre><code>// @Controller — returns view name
@Controller
class WebController {
    @GetMapping("/home")
    String home(Model m) { m.addAttribute("user", u); return "home"; } // home.html
}

// @RestController — returns JSON
@RestController
class ApiController {
    @GetMapping("/api/users/{id}")
    User getUser(@PathVariable Long id) { return userService.find(id); } // auto-JSON
}</code></pre>`
    },
    {
      tags: ['API Versioning', 'URL', 'Header', 'Content-type', 'Strategies'],
      q: 'What is API versioning?',
      s: 'Managing multiple API versions simultaneously. Strategies: URL versioning (/api/v1/users), Header versioning (Accept: application/vnd.api.v1+json), Request param (?version=1).',
      d: `<pre><code>// 1. URL versioning (most common)
@GetMapping("/api/v1/users") // v1
@GetMapping("/api/v2/users") // v2 with breaking changes

// 2. Header versioning
@GetMapping(value="/api/users", headers="X-API-Version=1")

// 3. Content-type (Accept header)
@GetMapping(value="/api/users", produces="application/vnd.app.v2+json")

// 4. Request param
@GetMapping(value="/api/users", params="version=2")</code></pre>`
    }
  ],

  jpa: [
    {
      tags: ['Transaction Management', '@Transactional', 'From scratch', 'Spring Boot'],
      q: 'How to implement transaction management in Spring Boot from scratch?',
      s: 'Add @EnableTransactionManagement (auto in Spring Boot). Annotate service methods with @Transactional. Configure TransactionManager bean (auto-configured for JPA).',
      d: `<pre><code>// Spring Boot auto-configures JpaTransactionManager
// Just use @Transactional on service methods

@Service
class AccountService {
    @Transactional // starts transaction, commits on success, rolls back on exception
    public void transfer(Long from, Long to, double amount) {
        Account src = accountRepo.findById(from).orElseThrow();
        Account dst = accountRepo.findById(to).orElseThrow();
        src.debit(amount);
        dst.credit(amount);
        accountRepo.save(src); accountRepo.save(dst);
        // if RuntimeException thrown → auto rollback
    }
}</code></pre>`
    },
    {
      tags: ['Different Databases', 'Environments', 'application-dev.yml', 'Profile'],
      q: 'How to configure different databases for different environments?',
      s: 'Spring Profiles: application-dev.yml, application-prod.yml. Activate with SPRING_PROFILES_ACTIVE=prod. Each profile has its own datasource config.',
      d: `<pre><code># application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver

# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/myapp
    username: \${DB_USER}
    password: \${DB_PASS}

# Activate:
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
# or: @ActiveProfiles("dev") in tests</code></pre>`
    },
    {
      tags: ['@Id', '@Table', '@Entity', 'JPA Annotations', 'Mapping'],
      q: '@Id, @Table vs @Entity annotation',
      s: '@Entity marks a class as JPA entity (maps to DB table). @Table specifies table name. @Id marks the primary key field. @GeneratedValue defines ID generation strategy.',
      d: `<pre><code>@Entity                          // marks as JPA entity
@Table(name = "users",           // specifies table name
    uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private Long id;

    @Column(name = "user_name", nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;
}</code></pre>`
    },
    {
      tags: ['Fetch Type', 'EAGER', 'LAZY', 'Default', '@ManyToOne', '@OneToMany'],
      q: 'Which fetch type is eager by default in JPA?',
      s: '@ManyToOne and @OneToOne → EAGER by default. @OneToMany and @ManyToMany → LAZY by default. Always override to LAZY in production to prevent N+1 problems.',
      d: `<table>
<tr><th>Relationship</th><th>Default Fetch</th><th>Recommended</th></tr>
<tr><td>@ManyToOne</td><td>EAGER</td><td>LAZY</td></tr>
<tr><td>@OneToOne</td><td>EAGER</td><td>LAZY</td></tr>
<tr><td>@OneToMany</td><td>LAZY</td><td>LAZY (keep default)</td></tr>
<tr><td>@ManyToMany</td><td>LAZY</td><td>LAZY (keep default)</td></tr>
</table>
<pre><code>@ManyToOne(fetch = FetchType.LAZY) // override to LAZY
@JoinColumn(name = "dept_id")
private Department department;</code></pre>`
    },
    {
      tags: ['ORM', 'Hibernate', 'JPA', 'Object Relational Mapping'],
      q: 'What is ORM framework?',
      s: 'Object-Relational Mapping maps Java objects to DB tables. JPA is the spec; Hibernate is the most popular ORM implementation. Eliminates boilerplate SQL for CRUD operations.',
      d: `<p>ORM bridges the <strong>object-relational impedance mismatch</strong> — objects have inheritance/polymorphism, databases have rows/tables/joins.</p>
<pre><code>// Without ORM:
PreparedStatement ps = conn.prepareStatement("INSERT INTO users(name,email) VALUES(?,?)");
ps.setString(1, user.getName()); ps.setString(2, user.getEmail()); ps.execute();

// With ORM (JPA/Hibernate):
entityManager.persist(user); // one line!</code></pre>
<p><strong>JPA</strong> = spec (javax.persistence). <strong>Hibernate</strong> = implementation. <strong>Spring Data JPA</strong> = abstraction on top of JPA.</p>`
    }
  ],

  testing: [
    {
      tags: ['TDD', 'BDD', 'Red-Green-Refactor', 'Cucumber', 'Given-When-Then'],
      q: 'What is TDD and BDD?',
      s: 'TDD: write failing test first, then code to pass (Red→Green→Refactor). BDD: write scenarios in Given-When-Then language (Cucumber/Gherkin). BDD bridges devs and business.',
      d: `<pre><code>// TDD cycle:
// 1. Red — write failing test
@Test void shouldReturnUserById() {
    when(repo.findById(1L)).thenReturn(Optional.of(new User("Alice")));
    assertNotNull(service.getUser(1L));
}
// 2. Green — write minimum code to pass
// 3. Refactor — clean up

// BDD (Cucumber):
Feature: User Registration
  Scenario: Successful registration
    Given a user provides email "alice@mail.com"
    When they submit the registration form
    Then they should receive a welcome email</code></pre>`
    },
    {
      tags: ['Testing Pyramid', 'Unit', 'Integration', 'E2E', 'When not to test'],
      q: 'Testing pyramid. When should we NOT do unit testing?',
      s: 'Pyramid: Unit tests (many, fast) → Integration tests → E2E tests (few, slow). Skip unit tests for: trivial getters/setters, framework code, configuration classes.',
      d: `<pre><code>// Testing pyramid:
//         /E2E\         ← few, slow, expensive
//        /Integ.\       ← moderate
//       /Unit tests\    ← many, fast, cheap

// When NOT to unit test:
// - Trivial getters/setters (no logic to test)
// - Spring @Configuration classes (test with integration test)
// - Generated code (Lombok @Data, jOOQ)
// - Simple CRUD with no business logic</code></pre>`
    },
    {
      tags: ['@Before', '@BeforeEach', 'JUnit 4 vs 5', 'Setup', 'Difference'],
      q: 'Difference between @Before vs @BeforeEach',
      s: '@Before is JUnit 4. @BeforeEach is JUnit 5. Both run before each test method. JUnit 5 also has @BeforeAll (once per class, static) vs @BeforeClass (JUnit 4).',
      d: `<table>
<tr><th>JUnit 4</th><th>JUnit 5</th><th>Purpose</th></tr>
<tr><td>@Before</td><td>@BeforeEach</td><td>Before each test method</td></tr>
<tr><td>@After</td><td>@AfterEach</td><td>After each test method</td></tr>
<tr><td>@BeforeClass</td><td>@BeforeAll</td><td>Once before all tests (static)</td></tr>
<tr><td>@AfterClass</td><td>@AfterAll</td><td>Once after all tests (static)</td></tr>
<tr><td>@Ignore</td><td>@Disabled</td><td>Skip test</td></tr>
</table>`
    },
    {
      tags: ['Logging', 'Tracing', 'Metrics', 'Microservices', 'Observability'],
      q: 'What is logging, tracing, and metrics in microservices?',
      s: 'Logging: structured event records. Tracing: follow a request across services (correlation ID, Sleuth/Zipkin). Metrics: numeric measurements over time (Prometheus/Grafana).',
      d: `<ol>
<li><strong>Logging</strong> — structured logs (JSON) with correlation ID for request tracing. Tools: ELK (Elasticsearch + Logstash + Kibana).</li>
<li><strong>Distributed Tracing</strong> — trace a single request across multiple microservices. Tools: Zipkin, Jaeger, Spring Cloud Sleuth.</li>
<li><strong>Metrics</strong> — JVM metrics, request count, latency, error rate. Tools: Micrometer → Prometheus → Grafana.</li>
</ol>
<pre><code>// Spring Boot Actuator + Micrometer → Prometheus
management.endpoints.web.exposure.include=prometheus,health
# Prometheus scrapes /actuator/prometheus every 15s</code></pre>`
    },
    {
      tags: ['Swagger', 'OpenAPI', 'springdoc', '@Operation', '@Tag'],
      q: 'How to integrate Swagger in Spring Boot? What annotations?',
      s: 'Add springdoc-openapi-starter-webmvc-ui. Access /swagger-ui.html. Annotate with @Tag, @Operation, @Parameter, @ApiResponse, @Schema.',
      d: `<pre><code>&lt;!-- pom.xml --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springdoc&lt;/groupId&gt;
    &lt;artifactId&gt;springdoc-openapi-starter-webmvc-ui&lt;/artifactId&gt;
    &lt;version&gt;2.2.0&lt;/version&gt;
&lt;/dependency&gt;

// Controller annotations:
@RestController
@Tag(name = "Users", description = "User management")
class UserController {
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "Not found")
    @GetMapping("/users/{id}")
    User getUser(@Parameter(description="User ID") @PathVariable Long id) { ... }
}
// Access: http://localhost:8080/swagger-ui.html</code></pre>`
    }
  ],

  microservices: [
    {
      tags: ['Load Balancing', 'Ribbon', 'Spring Cloud LoadBalancer', 'Round Robin'],
      q: 'What is Load Balancing in microservices?',
      s: 'Distributes incoming requests across multiple instances of a service. Spring Cloud LoadBalancer (replaced Ribbon) does client-side load balancing with Eureka.',
      d: `<pre><code>// Client-side load balancing with Spring Cloud LoadBalancer
// When calling lb://USER-SERVICE, LoadBalancer picks instance from Eureka

// Default strategy: Round Robin
// Other strategies: Random, Weighted

@Configuration
class LoadBalancerConfig {
    @Bean
    ReactorLoadBalancer&lt;ServiceInstance&gt; randomLoadBalancer(
        Environment env, LoadBalancerClientFactory factory) {
        return new RandomLoadBalancer(
            factory.getLazyProvider(env.getProperty("loadbalancer.client.name"),
            ServiceInstanceListSupplier.class), env.getProperty("..."));
    }
}</code></pre>`
    },
    {
      tags: ['CI/CD', 'Jenkins', 'Pipeline', 'Build Deploy', 'DevOps'],
      q: 'What is CI/CD pipeline?',
      s: 'CI: automate build + test on every commit. CD: automate deployment to staging/prod. Pipeline: stages (build, test, scan, deploy) executed sequentially.',
      d: `<pre><code>// Jenkinsfile (declarative pipeline)
pipeline {
    agent any
    stages {
        stage('Build') {
            steps { sh 'mvn clean package -DskipTests' }
        }
        stage('Test') {
            steps { sh 'mvn test' }
        }
        stage('SonarQube') {
            steps { sh 'mvn sonar:sonar' }
        }
        stage('Docker Build') {
            steps { sh 'docker build -t myapp:\${BUILD_NUMBER} .' }
        }
        stage('Deploy') {
            steps { sh 'kubectl set image deployment/app app=myapp:\${BUILD_NUMBER}' }
        }
    }
}</code></pre>`
    },
    {
      tags: ['Service Availability', 'Circuit Breaker', 'Retry', 'Health Check', 'Resilience'],
      q: 'How do you ensure service availability in microservices?',
      s: 'Circuit Breaker (Resilience4j), Retry with backoff, Health checks (Actuator), Multiple instances, Load balancing, Bulkhead pattern, Timeout configuration.',
      d: `<pre><code>// Resilience4j Circuit Breaker
@CircuitBreaker(name = "userService", fallbackMethod = "fallback")
@Retry(name = "userService", fallbackMethod = "fallback")
@TimeLimiter(name = "userService")
public UserDto getUser(Long id) { return userClient.findById(id); }

public UserDto fallback(Long id, Exception ex) {
    return new UserDto(id, "Unknown"); // graceful degradation
}

// application.yml
resilience4j.circuitbreaker.instances.userService:
  slidingWindowSize: 10
  failureRateThreshold: 50
  waitDurationInOpenState: 10s</code></pre>`
    }
  ],

  'stream-coding': [
    {
      tags: ['Employee', 'Product', 'price filter', 'category sum', 'discount'],
      q: 'Employee/Product Stream processing — price filter, sum, sort, discount, salary',
      s: 'Common stream operations on business objects: filter, sum by category, sort, map with transformation, find max.',
      d: `<pre><code>record Product(String name, String category, double price) {}

List&lt;Product&gt; products = List.of(
    new Product("Laptop","Electronics",45000),
    new Product("Phone","Electronics",28000),
    new Product("Chair","Furniture",12000)
);

// Find products with price > 30,000
products.stream().filter(p -&gt; p.price() &gt; 30000).toList();

// Sum of prices for "Electronics"
double sum = products.stream()
    .filter(p -&gt; p.category().equals("Electronics"))
    .mapToDouble(Product::price).sum(); // 73000

// Sort by name ascending
products.stream().sorted(Comparator.comparing(Product::name)).toList();

// 5% discount
products.stream()
    .map(p -&gt; new Product(p.name(), p.category(), p.price() * 0.95))
    .toList();

// Highest salary above threshold, after 10% increment
employees.stream()
    .filter(e -&gt; e.salary() &gt; 50000)
    .map(e -&gt; new Employee(e.name(), e.salary() * 1.1))
    .sorted(Comparator.comparing(Employee::name))
    .mapToDouble(Employee::salary).max();</code></pre>`
    },
    {
      tags: ['frequency', 'groupingBy', 'counting', '{1:3, 2:2, 3:2}'],
      q: 'Given {1,2,1,1,3,2,3,4} produce {1:3, 2:2, 3:2} — frequency map excluding unique',
      s: 'groupingBy + counting, then filter count > 1 to exclude unique elements.',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(1,2,1,1,3,2,3,4);

Map&lt;Integer, Long&gt; freq = nums.stream()
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -&gt; e.getValue() &gt; 1)
    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

System.out.println(freq); // {1=3, 2=2, 3=2}</code></pre>`
    },
    {
      tags: ['Vowel index', 'Stream', 'IntStream', 'filter', 'collect'],
      q: 'Given a String, find the index of vowels and return as a String',
      s: 'IntStream.range over indices, filter vowels, map to String positions, collect joining.',
      d: `<pre><code>String str = "hello world";
String vowelIndices = IntStream.range(0, str.length())
    .filter(i -&gt; "aeiouAEIOU".indexOf(str.charAt(i)) &gt;= 0)
    .mapToObj(Integer::toString)
    .collect(Collectors.joining(","));
System.out.println(vowelIndices); // "1,4,7"</code></pre>`
    },
    {
      tags: ['Reverse alphabets', 'Special chars', 'Two-pointer', 'Stream'],
      q: 'Reverse only alphabets in a string; special characters stay in place',
      s: 'Collect only alphabets in reverse, then fill back into original positions skipping non-alpha chars.',
      d: `<pre><code>String str = "a!b@c#d";
List&lt;Character&gt; alphas = str.chars()
    .filter(Character::isLetter)
    .mapToObj(c -&gt; (char)c)
    .collect(Collectors.toList());
Collections.reverse(alphas);

StringBuilder sb = new StringBuilder();
int ai = 0;
for (char c : str.toCharArray())
    sb.append(Character.isLetter(c) ? alphas.get(ai++) : c);
System.out.println(sb.toString()); // "d!c@b#a"</code></pre>`
    },
    {
      tags: ['Sort by length', 'Comparator', 'Stream', 'String list'],
      q: 'Sort strings by length using Streams',
      s: 'sorted(Comparator.comparingInt(String::length))',
      d: `<pre><code>List&lt;String&gt; words = List.of("banana","fig","apple","kiwi");

List&lt;String&gt; byLength = words.stream()
    .sorted(Comparator.comparingInt(String::length))
    .toList();
System.out.println(byLength); // [fig, kiwi, apple, banana]

// Tie-break by alphabet:
.sorted(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()))</code></pre>`
    },
    {
      tags: ['Missing values', 'IntStream', 'filter', 'not contains', 'range'],
      q: 'Given [1,2,1,2,4,8], find missing values [3,5,6,7] using Streams',
      s: 'IntStream.rangeClosed(1, max).filter(n -> !list.contains(n))',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(1,2,1,2,4,8);
Set&lt;Integer&gt; numSet = new HashSet&lt;&gt;(nums); // O(1) lookup

List&lt;Integer&gt; missing = IntStream.rangeClosed(1, 8)
    .filter(n -&gt; !numSet.contains(n))
    .boxed()
    .toList();
System.out.println(missing); // [3, 5, 6, 7]</code></pre>`
    },
    {
      tags: ['Most repeated', 'Stream', 'groupingBy', 'max', 'frequency'],
      q: 'Return the most repeated integer in a list using Streams',
      s: 'groupingBy + counting, then max by value.',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(1,2,2,3,2,1,3,3,3);

Optional&lt;Integer&gt; mostRepeated = nums.stream()
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey);

System.out.println(mostRepeated.orElse(-1)); // 3</code></pre>`
    },
    {
      tags: ['Group by multiple of 10', 'floor', 'groupingBy', 'nearest lower'],
      q: 'Group a list of integers by their nearest lower multiple of 10',
      s: 'groupingBy(n -> (n/10)*10) — integer division drops remainder, multiply by 10 gives floor multiple.',
      d: `<pre><code>List&lt;Integer&gt; nums = List.of(5,12,23,31,45,67,88,91);

Map&lt;Integer, List&lt;Integer&gt;&gt; grouped = nums.stream()
    .collect(Collectors.groupingBy(n -&gt; (n / 10) * 10));
System.out.println(grouped);
// {0=[5], 10=[12], 20=[23], 30=[31], 40=[45], 60=[67], 80=[88], 90=[91]}</code></pre>`
    },
    {
      tags: ['12345', 'digit sum', 'IntStream', 'Stream of digits'],
      q: 'Convert Integer 12345 to stream then find sum of digits',
      s: 'Convert to String, chars() IntStream, subtract \'0\', sum.',
      d: `<pre><code>int num = 12345;
int sum = String.valueOf(num).chars()
    .map(c -&gt; c - '0')  // char digit to int
    .sum();
System.out.println(sum); // 15</code></pre>`
    },
    {
      tags: ['Email domain', 'Employee', 'groupingBy', 'split', 'frequency'],
      q: 'Find email domain occurrences from Employee objects using Streams',
      s: 'map(Employee::getEmail), map to domain (split @[1]), groupingBy counting.',
      d: `<pre><code>record Employee(String name, String email) {}
List&lt;Employee&gt; employees = List.of(
    new Employee("Alice","alice@gmail.com"),
    new Employee("Bob","bob@yahoo.com"),
    new Employee("Carol","carol@gmail.com"));

Map&lt;String, Long&gt; domainCount = employees.stream()
    .map(e -&gt; e.email().split("@")[1])
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

System.out.println(domainCount); // {gmail.com=2, yahoo.com=1}</code></pre>`
    },
    {
      tags: ['First K words', 'limit', 'split', 'Stream', 'sentence'],
      q: 'Return first K words from a sentence using Streams',
      s: 'Split by space, stream, limit(k), collect joining.',
      d: `<pre><code>String sentence = "the quick brown fox jumped over the fence";
int k = 4;

String result = Arrays.stream(sentence.split("\\s+"))
    .limit(k)
    .collect(Collectors.joining(" "));
System.out.println(result); // "the quick brown fox"</code></pre>`
    },
    {
      tags: ['CSV split', 'numeric', 'filter', 'sorted', 'output list'],
      q: 'List<String> strArr = ["1,2,3","3,4,5","6,abc,7"] → output [10,9,8,7,6,5,4,3,2,1]',
      s: 'flatMap to split by comma, filter numeric, map to int, sort descending.',
      d: `<pre><code>List&lt;String&gt; strArr = Arrays.asList("1,2,3","3,4,5","6,abc,7");

List&lt;Integer&gt; result = strArr.stream()
    .flatMap(s -&gt; Arrays.stream(s.split(",")))
    .filter(s -&gt; s.matches("\\d+")) // only numeric
    .map(Integer::parseInt)
    .distinct()
    .sorted(Comparator.reverseOrder())
    .toList();
System.out.println(result); // [7, 6, 5, 4, 3, 2, 1]</code></pre>`
    },
    {
      tags: ['Second longest', 'sorted', 'skip', 'findFirst', 'distinct'],
      q: 'Find second longest word in "Hello and welcome, Hello world"',
      s: 'Split, remove punctuation, distinct by word, sort by length desc, skip(1), findFirst.',
      d: `<pre><code>String sentence = "Hello and welcome, Hello world";

Optional&lt;String&gt; secondLongest = Arrays.stream(sentence.split("\\s+"))
    .map(w -&gt; w.replaceAll("[^a-zA-Z]","")) // remove punctuation
    .filter(w -&gt; !w.isEmpty())
    .distinct()
    .sorted((a,b) -&gt; b.length() - a.length()) // longest first
    .skip(1)                                   // skip longest
    .findFirst();

System.out.println(secondLongest.orElse("")); // "world"</code></pre>`
    }
  ],

  dsa: [
    {
      tags: ['Equilibrium Point', 'Prefix Sum', 'Left Sum', 'Right Sum'],
      q: 'Find the equilibrium point of an array',
      s: 'Equilibrium: sum of elements to the left == sum to the right. Compute total sum, iterate updating leftSum, check if totalSum - leftSum - arr[i] == leftSum.',
      d: `<pre><code>int equilibriumIndex(int[] arr) {
    int total = 0;
    for (int n : arr) total += n;

    int leftSum = 0;
    for (int i = 0; i &lt; arr.length; i++) {
        int rightSum = total - leftSum - arr[i];
        if (leftSum == rightSum) return i;
        leftSum += arr[i];
    }
    return -1; // no equilibrium
}
// [1,3,5,2,2] → index 2 (1+3=5=2+2)
// Time: O(n) | Space: O(1)</code></pre>`
    },
    {
      tags: ['100 Doors', 'Toggle', 'Perfect Squares', 'Pseudocode'],
      q: '100 Doors Toggle problem',
      s: '100 doors, toggle door i on pass i. After 100 passes, only perfect square numbered doors are open. Because perfect squares have odd number of factors.',
      d: `<pre><code>// Pseudocode:
// 100 passes, on pass i toggle every ith door
// Result: doors 1,4,9,16,25,36,49,64,81,100 are open (perfect squares)

// Why? Door n is toggled once per factor of n.
// Doors with ODD number of factors end up open.
// Only perfect squares have odd factors (e.g., 9: factors 1,3,9 → 3 factors).

// Java verification:
boolean[] doors = new boolean[101];
for (int i = 1; i &lt;= 100; i++)
    for (int j = i; j &lt;= 100; j += i)
        doors[j] = !doors[j];
// Print open doors: 1 4 9 16 25 36 49 64 81 100</code></pre>`
    },
    {
      tags: ['Subarray sum K', 'HashMap', 'Prefix Sum', 'Count'],
      q: 'Sum of subarrays with sum equals to K',
      s: 'Prefix sum + HashMap. For each index, check if (currentSum - K) exists in map. O(n) time.',
      d: `<pre><code>int subarraySum(int[] nums, int k) {
    Map&lt;Integer, Integer&gt; prefixCount = new HashMap&lt;&gt;();
    prefixCount.put(0, 1); // empty prefix
    int count = 0, sum = 0;
    for (int n : nums) {
        sum += n;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}
// [1,1,1], k=2 → 2 subarrays
// Time: O(n) | Space: O(n)</code></pre>`
    },
    {
      tags: ['Rotate Array', 'Reverse', 'k steps', 'In-place'],
      q: 'Rotate array by k steps',
      s: 'Reverse entire array, reverse first k, reverse remaining. O(n) time, O(1) space.',
      d: `<pre><code>void rotate(int[] nums, int k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1); // reverse all
    reverse(nums, 0, k - 1);           // reverse first k
    reverse(nums, k, nums.length - 1); // reverse rest
}
void reverse(int[] a, int l, int r) {
    while (l &lt; r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
}
// [1,2,3,4,5], k=2 → [4,5,1,2,3]
// Time: O(n) | Space: O(1)</code></pre>`
    },
    {
      tags: ['Bubble Sort', 'Without .sort()', 'Sorting', 'O(n²)'],
      q: 'Write sorting code without using .sort()',
      s: 'Implement Bubble Sort (simple) or QuickSort (efficient). Bubble Sort: O(n²) time, O(1) space.',
      d: `<pre><code>// Bubble Sort
void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i &lt; n-1; i++) {
        boolean swapped = false;
        for (int j = 0; j &lt; n-i-1; j++) {
            if (arr[j] &gt; arr[j+1]) {
                int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}
// Time: O(n²) avg, O(n) best | Space: O(1)</code></pre>`
    },
    {
      tags: ['Product except self', 'Left Right Product', 'No division', 'O(n)'],
      q: 'Product of array except self (without division)',
      s: 'Two passes: left product prefix, then right product suffix. Multiply results. O(n) time, O(1) extra space.',
      d: `<pre><code>int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    result[0] = 1;
    // Left pass: result[i] = product of all nums[0..i-1]
    for (int i = 1; i &lt; n; i++)
        result[i] = result[i-1] * nums[i-1];
    // Right pass: multiply by product of nums[i+1..n-1]
    int right = 1;
    for (int i = n-1; i &gt;= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    return result;
}
// [1,2,3,4] → [24,12,8,6]
// Time: O(n) | Space: O(1) extra</code></pre>`
    }
  ],

  database: [
    {
      tags: ['Index', 'Composite Index', 'Leftmost Prefix', 'B-Tree'],
      q: 'Difference between an index and a composite index',
      s: 'Index: on single column. Composite index: multiple columns — follows leftmost prefix rule (WHERE (a,b) uses index on (a,b,c); WHERE (b) alone does NOT).',
      d: `<pre><code>-- Single column index
CREATE INDEX idx_email ON users(email);

-- Composite index (a, b, c)
CREATE INDEX idx_name_age ON employees(dept, salary, name);

-- Uses composite index:
WHERE dept=? AND salary=?         ✓ (leftmost prefix)
WHERE dept=?                       ✓ (leftmost prefix)

-- Does NOT use composite index:
WHERE salary=?                     ✗ (no leftmost prefix)
WHERE salary=? AND name=?          ✗ (skips dept)</code></pre>`
    },
    {
      tags: ['EXPLAIN', 'Execution Plan', 'Query Analyzer', 'Optimizer'],
      q: 'What is an execution plan in a database?',
      s: 'The database\'s plan for executing a query — shows which indexes used, join order, estimated rows. Use EXPLAIN/EXPLAIN ANALYZE to view it.',
      d: `<pre><code>-- View execution plan in MySQL/PostgreSQL
EXPLAIN SELECT * FROM orders WHERE user_id = 5 AND status = 'ACTIVE';

-- EXPLAIN ANALYZE (PostgreSQL) — actually runs and shows real stats
EXPLAIN ANALYZE SELECT * FROM orders JOIN users ON orders.user_id = users.id;

-- Key things to look for:
-- type: ALL (full scan ← bad) vs ref/range/const (index ← good)
-- rows: estimated rows scanned
-- Extra: "Using index" (covering index), "Using filesort" (slow sort)</code></pre>`
    },
    {
      tags: ['CASE expression', 'SQL', 'Conditional', 'WHEN THEN'],
      q: 'What is a CASE expression in SQL?',
      s: 'SQL\'s if-else equivalent. Returns different values based on conditions. Can be used in SELECT, ORDER BY, WHERE, GROUP BY.',
      d: `<pre><code>-- Simple CASE
SELECT name,
    CASE status
        WHEN 'ACTIVE'   THEN 'Active User'
        WHEN 'INACTIVE' THEN 'Inactive'
        ELSE 'Unknown'
    END AS status_label
FROM users;

-- Searched CASE
SELECT name, salary,
    CASE
        WHEN salary &gt; 100000 THEN 'Senior'
        WHEN salary &gt; 60000  THEN 'Mid-level'
        ELSE 'Junior'
    END AS grade
FROM employees;</code></pre>`
    },
    {
      tags: ['Function', 'Stored Procedure', 'Return value', 'Side effects', 'SQL'],
      q: 'Difference between a function and a stored procedure in SQL',
      s: 'Function: returns a single value, can be used in SELECT, no side effects. Stored Procedure: can return multiple result sets, has side effects (INSERT/UPDATE/DELETE), called with EXEC/CALL.',
      d: `<table>
<tr><th>Feature</th><th>Function</th><th>Stored Procedure</th></tr>
<tr><td>Returns</td><td>Single value</td><td>Multiple result sets</td></tr>
<tr><td>Used in SELECT</td><td>Yes</td><td>No</td></tr>
<tr><td>DML (INSERT/UPDATE)</td><td>Usually not</td><td>Yes</td></tr>
<tr><td>Transactions</td><td>No own transactions</td><td>Can manage transactions</td></tr>
<tr><td>Call</td><td>SELECT fn()</td><td>EXEC/CALL sp()</td></tr>
</table>`
    },
    {
      tags: ['Relational vs NoSQL', 'MongoDB', 'Redis', 'Cassandra', 'Use case'],
      q: 'Relational vs NoSQL. What NoSQL databases have you used?',
      s: 'RDBMS: structured schema, ACID, SQL. NoSQL: flexible schema, BASE, horizontal scale. Common: MongoDB (document), Redis (cache), Cassandra (wide column).',
      d: `<table>
<tr><th>Aspect</th><th>Relational (MySQL)</th><th>NoSQL (MongoDB)</th></tr>
<tr><td>Schema</td><td>Fixed, strict</td><td>Flexible, dynamic</td></tr>
<tr><td>Transactions</td><td>ACID</td><td>BASE (eventually consistent)</td></tr>
<tr><td>Scale</td><td>Vertical</td><td>Horizontal (sharding)</td></tr>
<tr><td>Query</td><td>SQL + JOINs</td><td>API / Document query</td></tr>
</table>
<p><strong>Common NoSQL usage:</strong> MongoDB (flexible documents, user profiles), Redis (caching, sessions, pub/sub), Cassandra (high-write time-series data), Elasticsearch (full-text search).</p>`
    }
  ],

  git: [
    {
      tags: ['Pull Request', 'Code Review', 'Collaboration', 'Branch Merge'],
      q: 'What is a Pull Request (PR)? Role in collaborative workflow?',
      s: 'PR proposes merging changes from a feature branch into main. Enables code review, discussion, CI checks before merge. Central to GitHub/GitLab workflow.',
      d: `<pre><code># Typical workflow:
git checkout -b feature/user-auth     # 1. Create feature branch
# make changes...
git push origin feature/user-auth     # 2. Push branch
# Create PR on GitHub UI              # 3. PR for review
# Reviewers comment, CI runs tests    # 4. Review process
# Merge (squash/merge/rebase)         # 5. Approved → merge to main
git pull origin main                  # 6. Others pull updated main</code></pre>`
    },
    {
      tags: ['Remote Branches', 'git fetch', 'git branch -r', 'tracking'],
      q: '8 remote branches but only 4 locally — how to get the others?',
      s: 'git fetch --all downloads all remote branch refs. git checkout -b localname origin/remotename to create local tracking branch.',
      d: `<pre><code>git fetch --all       # download all remote branch refs
git branch -r         # list all remote branches
# origin/feature-A, origin/feature-B, origin/feature-C, origin/feature-D...

git checkout -b feature-E origin/feature-E  # create local + track remote
# or simply:
git checkout feature-E  # Git auto-creates local tracking branch (Git 2.23+)</code></pre>`
    },
    {
      tags: ['git pull', 'fetch + merge', 'Internal', 'FETCH_HEAD'],
      q: 'How does git pull work internally?',
      s: 'git pull = git fetch + git merge. Fetch downloads remote commits to FETCH_HEAD. Merge integrates them into current branch. git pull --rebase replaces merge with rebase.',
      d: `<pre><code># git pull origin main is equivalent to:
git fetch origin main          # download remote commits
git merge origin/main          # merge into current branch

# With rebase (cleaner history):
git pull --rebase origin main  # = git fetch + git rebase origin/main

# Configure globally:
git config --global pull.rebase true</code></pre>`
    },
    {
      tags: ['Basic git commands', 'init', 'clone', 'commit', 'push', 'pull'],
      q: 'What are basic Git commands?',
      s: 'git init, clone, add, commit, push, pull, status, log, diff, branch, checkout/switch, merge, rebase, stash, reset.',
      d: `<pre><code>git init                    # initialize new repo
git clone &lt;url&gt;             # clone remote repo
git status                   # show working tree status
git add .                    # stage all changes
git commit -m "message"      # commit staged changes
git push origin main         # push to remote
git pull                     # fetch + merge
git log --oneline            # compact commit history
git diff                     # show unstaged changes
git branch feature-x         # create branch
git checkout feature-x       # switch branch (legacy)
git switch feature-x         # switch branch (modern)
git merge feature-x          # merge branch
git reset --hard HEAD~1      # undo last commit (destructive!)
git revert HEAD              # undo last commit (safe)</code></pre>`
    }
  ],

  maven: [
    {
      tags: ['groupId', 'artifactId', 'pom.xml', 'Coordinates', 'Maven'],
      q: 'What is groupId, artifactId in pom.xml?',
      s: 'groupId: organization/domain (com.company). artifactId: project/module name (my-app). version: release version. Together they uniquely identify a Maven artifact.',
      d: `<pre><code>&lt;groupId&gt;com.company&lt;/groupId&gt;   &lt;!-- organization --&gt;
&lt;artifactId&gt;user-service&lt;/artifactId&gt; &lt;!-- module name --&gt;
&lt;version&gt;1.0.0-SNAPSHOT&lt;/version&gt;

&lt;!-- Dependency coordinate --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;version&gt;3.2.0&lt;/version&gt;
&lt;/dependency&gt;</code></pre>`
    },
    {
      tags: ['.m2', 'Local Repository', 'Cache', 'Maven Home'],
      q: 'What is .m2 repository?',
      s: 'Local Maven repository cache at ~/.m2/repository. Downloaded dependencies stored here. Maven checks .m2 before downloading from remote (Maven Central).',
      d: `<pre><code>~/.m2/
├── repository/
│   └── org/springframework/boot/
│       └── spring-boot-starter-web/
│           └── 3.2.0/
│               ├── spring-boot-starter-web-3.2.0.jar
│               └── spring-boot-starter-web-3.2.0.pom
└── settings.xml   ← mirrors, proxies, credentials

# Force re-download:
mvn clean install -U  # -U = update snapshots
mvn dependency:purge-local-repository</code></pre>`
    },
    {
      tags: ['Maven Plugin', 'Build Lifecycle', 'surefire', 'compiler', 'Goal'],
      q: 'What is a plugin in Maven?',
      s: 'Plugins provide goals that do the actual work in Maven lifecycle phases. compiler plugin compiles source, surefire runs tests, jar plugin packages JAR.',
      d: `<pre><code>&lt;build&gt;
    &lt;plugins&gt;
        &lt;!-- compiler plugin --&gt;
        &lt;plugin&gt;
            &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
            &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;
            &lt;configuration&gt;
                &lt;source&gt;21&lt;/source&gt;
                &lt;target&gt;21&lt;/target&gt;
            &lt;/configuration&gt;
        &lt;/plugin&gt;
        &lt;!-- Spring Boot plugin --&gt;
        &lt;plugin&gt;
            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
            &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;
        &lt;/plugin&gt;
    &lt;/plugins&gt;
&lt;/build&gt;</code></pre>`
    }
  ],

  docker: [
    {
      tags: ['Docker Compose', 'Multi-container', 'Services', 'yaml'],
      q: 'What is Docker Compose?',
      s: 'Tool for defining and running multi-container applications. docker-compose.yml defines all services, networks, volumes. docker compose up starts everything.',
      d: `<pre><code># docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/myapp
    depends_on: [db]

  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=myapp
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:

# Commands:
# docker compose up -d      ← start all in background
# docker compose down       ← stop and remove
# docker compose logs app   ← view logs</code></pre>`
    },
    {
      tags: ['Ingress', 'Kubernetes', 'HTTP routing', 'Load Balancer', 'Path-based'],
      q: 'What is an Ingress in Kubernetes?',
      s: 'Ingress manages external HTTP/S traffic to services in a cluster. Acts as a reverse proxy/load balancer with path-based and host-based routing rules.',
      d: `<pre><code>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port: { number: 80 }
      - path: /api/orders
        pathType: Prefix
        backend:
          service:
            name: order-service
            port: { number: 80 }</code></pre>`
    }
  ],

  agile: [
    {
      tags: ['Non-functional Requirements', 'NFR', 'Performance', 'Security', 'Scalability'],
      q: 'What are non-functional requirements in software development?',
      s: 'Requirements about HOW the system works, not WHAT it does. Performance, scalability, security, reliability, maintainability, availability (SLA).',
      d: `<ol>
<li><strong>Performance</strong> — API response time &lt;200ms, 1000 TPS throughput.</li>
<li><strong>Scalability</strong> — handle 10x traffic without architecture change.</li>
<li><strong>Security</strong> — data encrypted at rest/transit, OWASP compliance.</li>
<li><strong>Availability</strong> — 99.9% uptime SLA (8.7 hours downtime/year).</li>
<li><strong>Maintainability</strong> — code coverage &gt;80%, documented APIs.</li>
<li><strong>Reliability</strong> — MTTR (mean time to recovery) &lt;1 hour.</li>
</ol>`
    },
    {
      tags: ['KISS', 'DRY', 'YAGNI', 'Principles', 'Clean Code'],
      q: 'What are KISS, DRY, and YAGNI principles?',
      s: 'KISS: Keep It Simple, Stupid. DRY: Don\'t Repeat Yourself. YAGNI: You Aren\'t Gonna Need It. Core principles for clean, maintainable, pragmatic code.',
      d: `<ol>
<li><strong>KISS</strong> — Write the simplest code that solves the problem. Avoid premature optimization, unnecessary patterns, or clever tricks.</li>
<li><strong>DRY</strong> — Every piece of knowledge has a single, unambiguous representation. Extract repeated logic into methods, services, or utilities.</li>
<li><strong>YAGNI</strong> — Don't implement until needed. Resist over-engineering for hypothetical future requirements — it adds complexity and technical debt.</li>
</ol>
<pre><code>// YAGNI violation:
class UserService {
    // "might need these someday..."
    void exportToPDF() { }
    void generateReport() { }
    void sendTelegram() { }
    // These aren't in requirements — delete them!
}</code></pre>`
    }
  ]
}

export default SPRING_EXTRA
