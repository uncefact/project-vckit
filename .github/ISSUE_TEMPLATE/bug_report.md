---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**Environment Information**
- Branch/commit hash used: 
- Container details:
  - Using container? [Yes/No]
  - Container hash: 

**Docker Configuration**
If using Docker, please include your environment file with sensitive data removed but keeping the property names:
```env
# Example - replace sensitive values with <REMOVED>
DATABASE_HOST=<REMOVED>
DATABASE_TYPE=postgres
DATABASE_USERNAME=<REMOVED>
DATABASE_PASSWORD=<REMOVED>
DATABASE_NAME=<REMOVED>
DATABASE_PORT=5432
DATABASE_ENCRYPTION_KEY=<REMOVED>
PORT=3332
PROTOCOL=http
API_DOMAIN=localhost:3332
API_KEY=<REMOVED>
```

**Agent Configuration**
Please include your agent config file with sensitive data removed but keeping the property names:
```yaml
version: 3.0

constants:
  baseUrl: http://localhost:3332
  port: 3332
  dbEncryptionKey: <REMOVED>
  databaseFile: ./database.sqlite
  
dbConnection:
  $require: typeorm#DataSource
  $args:
    - type: sqlite
      database: <REMOVED>
      synchronize: false
      migrationsRun: true
      logging: false

server:
  baseUrl: <REMOVED>
  port: 3332
  use:
    - - /v1
      - $require: '@uncefact/vckit-vc-api?t=function#V1VcRouter'
        $args:
          - basePath: :3332
            apiKey: <REMOVED>
```

**Dependency Versions**
- pnpm: 
- yarn: 
- node: 
- npm: 

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop Environment**
 - OS: [e.g. iOS]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]

**Mobile Environment**
 - Device: [e.g. iPhone6]
 - OS: [e.g. iOS8.1]
 - Browser: [e.g. stock browser, safari]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
