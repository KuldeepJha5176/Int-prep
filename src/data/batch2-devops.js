const BATCH2_DEVOPS = {
  git: [
    {
      tags: ['Merge conflicts', 'Before PR', 'Check conflicts', 'git merge --no-commit', 'git diff'],
      q: 'How to check merge conflicts before raising a PR?',
      s: 'git fetch + git merge --no-commit --no-ff locally to preview conflicts. git diff to see them. Or use GitHub\'s conflict checker in PR preview. Resolve locally, then push.',
      d: `<pre><code># Method 1: Fetch and try merge locally
git fetch origin main
git merge origin/main --no-commit --no-ff
# Git shows: "CONFLICT (content): Merge conflict in src/UserService.java"

# View conflicts:
git status                    # shows conflicted files
git diff                      # shows all conflicts with &lt;&lt;&lt;&lt; ==== &gt;&gt;&gt;&gt;

# If conflicts exist — resolve files, then:
git merge --abort             # abandon the test merge (don't pollute branch)

# Method 2: Rebase preview
git fetch origin
git rebase origin/main --no-commit
# See conflicts without committing

# Method 3: GitHub UI
# On GitHub → Pull Request → click "Resolve conflicts" button
# Shows which files conflict before you merge

# Best practice:
# 1. Frequently rebase/merge main into your feature branch
# 2. git pull --rebase origin main (keeps branch up-to-date)
# 3. Smaller PRs = fewer conflicts</code></pre>`
    },
    {
      tags: ['git fetch', 'git pull', 'difference', 'FETCH_HEAD', 'safe'],
      q: 'What is git fetch vs git pull?',
      s: 'git fetch: downloads remote changes to local tracking branches (origin/main) WITHOUT merging. Safe — doesn\'t modify working tree. git pull = fetch + merge (or rebase).',
      d: `<pre><code># git fetch — safe, downloads only
git fetch origin              # update all remote tracking branches
git fetch origin main         # update only origin/main

# After fetch, local branch unchanged — you can inspect:
git log origin/main           # see remote commits
git diff HEAD origin/main     # see what changed

# Then merge manually when ready:
git merge origin/main         # merge downloaded changes

# git pull = fetch + merge (can surprise you with merge commits)
git pull origin main          # fetch + merge in one step
git pull --rebase origin main # fetch + rebase (cleaner history)

# When to use which:
# git fetch → safe inspection, then decide to merge/rebase
# git pull  → quick sync when you're confident in remote state
# git pull --rebase → preferred for keeping linear history</code></pre>`
    }
  ],

  maven: [
    {
      tags: ['mvn deploy', 'Remote repository', 'Nexus', 'Artifactory', 'Publish'],
      q: 'What is mvn deploy?',
      s: 'mvn deploy: final phase of Maven default lifecycle. Copies built artifact (JAR/WAR) to remote repository (Nexus/Artifactory) for team sharing. Includes all phases before it.',
      d: `<pre><code># mvn deploy = validate + compile + test + package + verify + install + deploy

# Runs everything then uploads to remote repo configured in pom.xml:
&lt;distributionManagement&gt;
    &lt;repository&gt;
        &lt;id&gt;nexus-releases&lt;/id&gt;
        &lt;url&gt;http://nexus.company.com/repository/maven-releases/&lt;/url&gt;
    &lt;/repository&gt;
    &lt;snapshotRepository&gt;
        &lt;id&gt;nexus-snapshots&lt;/id&gt;
        &lt;url&gt;http://nexus.company.com/repository/maven-snapshots/&lt;/url&gt;
    &lt;/snapshotRepository&gt;
&lt;/distributionManagement&gt;

# Credentials in ~/.m2/settings.xml (server section):
# mvn deploy uploads to remote so all team members can use as dependency

# CI/CD pipeline:
# mvn clean deploy  # build, test, publish to Nexus on every main push</code></pre>`
    },
    {
      tags: ['JAR files location', 'Maven repository', '.m2', 'Classpath', 'Where stored'],
      q: 'Where are all the dependency JAR files stored?',
      s: 'Local: ~/.m2/repository/groupId/artifactId/version/. Remote: Maven Central (repo1.maven.org) or corporate Nexus/Artifactory. Build classpath: target/classes + ~/.m2 jars.',
      d: `<pre><code># Local Maven Repository
~/.m2/repository/
  org/springframework/boot/spring-boot/3.2.0/
    spring-boot-3.2.0.jar       ← the actual JAR
    spring-boot-3.2.0.pom       ← POM file
    spring-boot-3.2.0.jar.sha1  ← checksum

# Remote repositories:
# 1. Maven Central: https://repo1.maven.org/maven2/
# 2. Corporate: http://nexus.company.com/repository/maven-public/

# At runtime (Spring Boot fat JAR):
# target/my-app.jar/BOOT-INF/lib/  ← all dependency JARs embedded

# List all jars in your project:
mvn dependency:list               # shows all resolved deps
mvn dependency:copy-dependencies  # copies all jars to target/dependency/

# See where a specific jar comes from:
mvn dependency:tree -Dincludes=jackson-databind</code></pre>`
    }
  ],

  rest: [
    {
      tags: ['How to secure REST', 'Spring Security', 'JWT', 'Endpoint', 'Authentication'],
      q: 'How to secure a REST API endpoint?',
      s: 'Spring Security: add dependency, configure SecurityFilterChain, validate JWT in OncePerRequestFilter, use @PreAuthorize for method-level. Also: HTTPS, rate limiting, CORS.',
      d: `<pre><code>// 1. Add dependency: spring-boot-starter-security + jjwt

// 2. Security config
@Configuration @EnableWebSecurity @EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain chain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -&gt; csrf.disable())           // disable for REST
            .sessionManagement(sm -&gt; sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers("/auth/**").permitAll()   // public
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}

// 3. JWT Filter
@Component
class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, ...) {
        String token = req.getHeader("Authorization").substring(7);
        if (jwtUtil.validateToken(token)) {
            // Set SecurityContext
            UsernamePasswordAuthenticationToken auth = new UPAT(username, null, roles);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(req, res);
    }
}

// 4. Method-level security
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/users/{id}")
void deleteUser(@PathVariable Long id) { ... }</code></pre>`
    }
  ]
}

export default BATCH2_DEVOPS
