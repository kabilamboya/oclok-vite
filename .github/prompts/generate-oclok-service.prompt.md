---
description: "Generate business logic service file for O!clok services (Delibois, Cyber, Design, Media, Telecom, IoT). Handles data operations, caching, and state management for a specific service."
name: "Generate O!clok Service"
argument-hint: "Service name (delibois|cyber|design|media|telecom|iot)"
agent: "agent"
---

# Generate O!clok Service Business Logic

You are creating a service file for the O!clok platform. Generate a complete, production-ready service module for **one specific O!clok service**.

## Input Requirements

Specify which service to generate:
- `delibois` → Delibois Delivery service
- `cyber` → Online Cyber Services (printing, scanning, browsing, cloud access)
- `design` → Graphic & Website Design service
- `media` → O!clok Media (podcasts, blogs, digital media)
- `telecom` → Telecommunications Networking service
- `iot` → IoT Connectivity & AI Solutions service

## Service Architecture Pattern

Each service file must follow this structure:

### 1. **Data Layer**
- Import relevant JSON data from [src/data/](../../src/data/)
- Implement data filtering, searching, and sorting utilities
- Cache frequently accessed data in memory

### 2. **Business Logic Methods**
- `getAll()` - Fetch all records
- `getById(id)` - Single record lookup
- `search(query)` - Search by title/description
- `filter(criteria)` - Advanced filtering
- `create(item)` - Add new item (if applicable)
- `update(id, item)` - Modify existing item (if applicable)
- `delete(id)` - Remove item (if applicable)

### 3. **State Management**
- Use localStorage for persistence where needed
- Implement session-based caching with TTL
- Provide clear data mutations

### 4. **Error Handling**
- Validation of input parameters
- Graceful error messages
- Logging for debugging (optional console.log helpers)

## Required Output

Generate a file named `src/services/{serviceName}.service.js` that:

1. Exports a default object with all methods documented
2. Includes JSDoc comments for each method
3. Handles edge cases (empty data, invalid IDs, null values)
4. Uses consistent naming: camelCase for methods
5. Includes example usage in comments

## Service-Specific Context

Refer to the service definitions in [src/data/services.json](../../src/data/services.json):

| Service | Category | Key Data | Typical Operations |
|---------|----------|----------|-------------------|
| **Delibois** | Delivery | packages, shipments, tracking | Track, list, create order |
| **Cyber** | Security | services, sessions, usage | Browse libraries, print queue, scan documents |
| **Design** | Creative | portfolios, projects, clients | Search portfolio, commission, showcase work |
| **Media** | Smart Tech | articles, podcasts, blogs | List, search, categorize content |
| **Telecom** | Infrastructure | connections, networks, clients | Service status, coverage, bandwidth |
| **IoT** | Innovation | devices, solutions, data streams | Connect, control, monitor devices |

## Code Style Guidelines

- Use ES6 module syntax: `export default { ... }`
- Avoid external dependencies (no axios, no lodash unless already installed)
- Use native JavaScript methods (`filter()`, `find()`, `map()`, etc.)
- Maintain consistent indentation (2 spaces)
- Comment complex logic; keep simple methods self-explanatory

## Example Invocation

> "Generate the cyber service that handles printing queue, document scanning, and cloud storage operations using data from places.json."

> "Create the media service with search, filtering, and categorization for blog posts and podcast episodes."

## Related Work

- View existing service patterns: [src/services/](../../src/services/)
- Check data structure: [src/data/](../../src/data/)
- Component usage examples: [src/components/](../../src/components/), [src/pages/](../../src/pages/)
