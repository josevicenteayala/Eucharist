# ADR-004: JWT for Authentication

**Status**: Accepted  
**Date**: 2025-10-18  
**Deciders**: Software Architect, Security Lead, Technical Lead

## Context

The Eucharist Understanding Platform requires a secure authentication mechanism that:
- Works seamlessly across web and mobile platforms
- Scales efficiently as user base grows
- Provides stateless authentication for better performance
- Supports both email/password and social login
- Enables secure API access
- Maintains user sessions reliably
- Protects against common security vulnerabilities
- Allows for token refresh without re-authentication

### Key Requirements

**Security**:
- Secure token generation and validation
- Protection against token theft
- Automatic token expiration
- Secure token storage
- HTTPS/TLS for all communications

**Scalability**:
- Stateless authentication (no server-side session storage)
- Horizontal scaling without session stickiness
- Low latency validation
- Efficient token validation

**User Experience**:
- Single sign-on capability
- "Remember me" functionality
- Seamless token refresh
- Minimal re-authentication
- Cross-device support

**Multi-Platform**:
- Web application support
- Mobile app support (iOS/Android)
- API access for future integrations
- Consistent behavior across platforms

## Decision

We will use **JSON Web Tokens (JWT)** with a **dual-token approach**:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                  Authentication Flow                      │
└──────────────────────────────────────────────────────────┘

1. Login Request
   User → API: POST /auth/login { email, password }
   
2. Credential Verification
   API → Database: Verify credentials
   API → bcrypt: Validate password hash
   
3. Token Generation
   API: Generate Access Token (15 min expiry)
   API: Generate Refresh Token (7 days expiry)
   API: Store refresh token in database
   
4. Token Response
   API → User: { 
     accessToken: "eyJhbG...",
     refreshToken: "eyJhbG...",
     user: { id, email, name }
   }
   
5. API Request
   User → API: GET /api/resource
   Header: Authorization: Bearer <accessToken>
   
6. Token Validation
   API: Verify token signature
   API: Check expiration
   API: Extract user info from payload
   
7. Token Refresh (when access token expires)
   User → API: POST /auth/refresh { refreshToken }
   API: Validate refresh token
   API: Check if not revoked
   API: Generate new access token
   API → User: { accessToken: "eyJhbG..." }
```

### Token Structure

#### Access Token Payload
```javascript
{
  "sub": "user-uuid-here",        // Subject (user ID)
  "email": "user@example.com",
  "role": "user",                 // User role
  "type": "access",
  "iat": 1698000000,             // Issued at
  "exp": 1698000900              // Expires at (15 min)
}
```

#### Refresh Token Payload
```javascript
{
  "sub": "user-uuid-here",
  "type": "refresh",
  "jti": "unique-token-id",      // JWT ID for revocation
  "iat": 1698000000,
  "exp": 1698604800              // Expires at (7 days)
}
```

### Implementation Components

```typescript
// JWT Service
class JwtService {
  generateAccessToken(userId: string, email: string, role: string): string
  generateRefreshToken(userId: string): string
  verifyAccessToken(token: string): JwtPayload
  verifyRefreshToken(token: string): JwtPayload
}

// Auth Controller
class AuthController {
  login(email, password): { accessToken, refreshToken, user }
  register(userData): { accessToken, refreshToken, user }
  refresh(refreshToken): { accessToken }
  logout(refreshToken): void
  verifyEmail(token): { success: boolean }
  resetPassword(email): { success: boolean }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  // Extract and verify access token
  // Attach user info to request
  // Continue to route handler
}
```

### Security Measures

#### Token Storage
- **Web**: 
  - Access token: Memory (React state)
  - Refresh token: httpOnly cookie (secure, SameSite)
- **Mobile**: 
  - Both tokens: Secure storage (Keychain/Keystore)

#### Token Rotation
- New refresh token issued on each refresh
- Old refresh token invalidated
- Prevents token reuse attacks

#### Token Revocation
- Refresh tokens stored in database
- Can be revoked immediately (logout, password change)
- Regular cleanup of expired tokens

#### Additional Security
- HTTPS required for all authentication endpoints
- Rate limiting on login attempts
- Account lockout after failed attempts
- Email verification required
- Password reset with time-limited tokens
- Suspicious activity monitoring

## Consequences

### Positive

✅ **Stateless Authentication**: No server-side session storage required, enabling easy horizontal scaling

✅ **Cross-Platform Compatibility**: Same authentication mechanism works for web, mobile, and future API consumers

✅ **Scalability**: Token validation is fast and doesn't require database lookup for each request

✅ **Performance**: Eliminates need for session database queries on every API call

✅ **Microservices Ready**: Easy to validate tokens across multiple services

✅ **Standard Approach**: JWT is an industry standard (RFC 7519) with wide library support

✅ **Flexible Claims**: Can include custom data in token payload for authorization

✅ **No Server-Side State**: Simplifies deployment and reduces complexity

✅ **Mobile-Friendly**: Works well with native mobile apps

✅ **Refresh Token Pattern**: Balances security (short access tokens) with UX (refresh without re-login)

✅ **Self-Contained**: Token contains all needed information for validation

### Negative

⚠️ **Token Theft Risk**: If stolen, access token valid until expiration (mitigated by short expiry and HTTPS)

⚠️ **Token Size**: JWTs larger than session IDs, increasing bandwidth (typically 200-500 bytes)

⚠️ **Cannot Invalidate Immediately**: Access tokens valid until expiration (mitigated by short 15-min expiry)

⚠️ **Storage Complexity**: Must handle token refresh logic on client side

⚠️ **Secret Management**: JWT signing secret must be kept secure and rotated periodically

⚠️ **Token Management**: Clients must handle token storage, renewal, and cleanup

⚠️ **Revocation Complexity**: Need separate mechanism to revoke refresh tokens

### Neutral

➖ **Logout Handling**: Requires refresh token revocation in database

➖ **Token Refresh Logic**: Adds complexity to client applications

➖ **Clock Synchronization**: Servers need synchronized clocks for expiration

## Alternatives Considered

### 1. Session-Based Authentication
**Pros**: 
- Simple implementation
- Immediate invalidation on logout
- Familiar pattern
- No token management on client
- Easy to revoke

**Cons**: 
- Requires server-side session storage
- Sticky sessions or shared session store needed for scaling
- Database lookup on every request
- Not ideal for mobile apps
- Harder to implement across multiple services

**Why Not**: Session-based auth requires stateful servers and doesn't scale as well. For a platform with web and mobile clients, JWT's stateless approach is more suitable and performant.

### 2. OAuth 2.0 Only (Third-Party)
**Pros**: 
- Delegated authentication
- No password management
- Social login built-in
- Established security
- User convenience

**Cons**: 
- Dependency on third-party services
- Doesn't solve our own user authentication
- More complex flow
- Limited offline capability
- Privacy concerns for some users

**Why Not**: We need our own user authentication system. OAuth will be used for social login options, but we need a primary authentication mechanism. JWT complements OAuth well.

### 3. API Keys
**Pros**: 
- Simple to implement
- Easy to revoke
- Long-lived tokens
- No expiration logic needed

**Cons**: 
- Security risk if leaked (no expiration)
- Not suitable for user authentication
- Poor user experience
- Hard to implement permissions
- No automatic expiration

**Why Not**: API keys are better suited for service-to-service authentication, not user authentication. They lack the security features needed for a user-facing application.

### 4. SAML
**Pros**: 
- Enterprise standard
- Single sign-on
- Robust security
- XML-based

**Cons**: 
- Overly complex for our needs
- Heavy XML payload
- Enterprise-focused
- Poor mobile support
- Steep learning curve

**Why Not**: SAML is designed for enterprise SSO scenarios and is overkill for our platform. JWT provides similar benefits with much less complexity.

### 5. Basic Authentication
**Pros**: 
- Simple to implement
- No token management
- Works everywhere
- Standard HTTP

**Cons**: 
- Sends credentials with every request
- Major security risk
- No logout mechanism
- Not suitable for web/mobile apps
- Requires HTTPS always

**Why Not**: Basic authentication is insecure for modern applications and provides a poor user experience. It's only suitable for simple scenarios with additional security layers.

### 6. Custom Token System
**Pros**: 
- Complete control
- Tailored to exact needs
- No external dependencies

**Cons**: 
- Reinventing the wheel
- Higher security risk
- More development time
- Maintenance burden
- No community support

**Why Not**: JWT is a proven, standardized solution with extensive tooling and community support. Building a custom system would introduce unnecessary risk and development overhead.

## Implementation Plan

### Phase 1: Backend Setup (Week 1-2)
- [x] Install JWT libraries (jsonwebtoken)
- [ ] Create JWT service class
- [ ] Implement token generation
- [ ] Implement token verification
- [ ] Create authentication middleware
- [ ] Set up refresh token storage in database

### Phase 2: Auth Endpoints (Week 2-3)
- [ ] POST /auth/register endpoint
- [ ] POST /auth/login endpoint
- [ ] POST /auth/refresh endpoint
- [ ] POST /auth/logout endpoint
- [ ] POST /auth/forgot-password endpoint
- [ ] POST /auth/reset-password endpoint
- [ ] GET /auth/verify-email endpoint

### Phase 3: Security Hardening (Week 3-4)
- [ ] Implement rate limiting
- [ ] Add account lockout logic
- [ ] Set up HTTPS enforcement
- [ ] Configure CORS properly
- [ ] Add request validation
- [ ] Implement token rotation
- [ ] Set up security headers

### Phase 4: Web Integration (Week 4-5)
- [ ] Create auth context in React
- [ ] Implement login/register forms
- [ ] Add token storage logic
- [ ] Implement automatic refresh
- [ ] Handle token expiration
- [ ] Add logout functionality

### Phase 5: Mobile Integration (Month 4)
- [ ] Implement auth in Flutter
- [ ] Set up secure storage
- [ ] Create auth state management
- [ ] Implement token refresh
- [ ] Handle network errors
- [ ] Add biometric authentication (optional)

### Phase 6: Testing & Monitoring (Ongoing)
- [ ] Unit tests for JWT service
- [ ] Integration tests for auth flow
- [ ] Security testing (penetration tests)
- [ ] Monitor failed login attempts
- [ ] Track token usage patterns
- [ ] Set up alerts for anomalies

## Technical Specifications

### JWT Configuration
```javascript
// config/jwt.config.js
module.exports = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
    algorithm: 'HS256'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
  }
};
```

### Token Generation
```typescript
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

class JwtService {
  generateAccessToken(userId: string, email: string, role: string): string {
    const payload = {
      sub: userId,
      email,
      role,
      type: 'access'
    };
    
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
      algorithm: 'HS256'
    });
  }
  
  generateRefreshToken(userId: string): string {
    const payload = {
      sub: userId,
      type: 'refresh',
      jti: uuidv4() // Unique token ID for revocation
    };
    
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256'
    });
  }
  
  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
  }
  
  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as JwtPayload;
  }
}
```

### Authentication Middleware
```typescript
import { Request, Response, NextFunction } from 'express';

async function authenticateToken(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: { code: 'NO_TOKEN', message: 'Access token required' }
      });
    }
    
    const payload = jwtService.verifyAccessToken(token);
    
    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' }
      });
    }
    
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid access token' }
    });
  }
}
```

### Refresh Token Storage
```sql
-- Refresh tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_id VARCHAR(255) UNIQUE NOT NULL,  -- JWT ID (jti)
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    replaced_by UUID REFERENCES refresh_tokens(id),
    device_info JSONB  -- Optional: track device
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_id ON refresh_tokens(token_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

## Security Best Practices

### Token Secrets
- Use strong, random secrets (256-bit minimum)
- Rotate secrets periodically (quarterly)
- Store secrets in environment variables
- Never commit secrets to version control
- Use different secrets for access and refresh tokens

### Transport Security
- HTTPS required for all authentication endpoints
- Set secure flag on cookies
- Use SameSite=Strict for cookies
- Implement HSTS headers

### Rate Limiting
```javascript
// Login endpoint rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/auth/login', loginLimiter, authController.login);
```

### Password Security
- bcrypt with 12+ salt rounds
- Minimum password requirements
- Password strength checking
- Password history (prevent reuse)
- Require re-authentication for sensitive operations

## Monitoring & Alerting

### Metrics to Track
- Failed login attempts (by user, by IP)
- Token refresh rate
- Token expiration patterns
- Concurrent sessions per user
- Geographic anomalies
- Unusual access patterns

### Alerts
- Multiple failed logins from same IP
- Multiple failed logins for same account
- Token usage from unusual locations
- High rate of token refreshes
- Suspicious activity patterns

### Audit Logging
```javascript
// Log authentication events
const authLog = {
  userId: user.id,
  event: 'LOGIN_SUCCESS',
  timestamp: new Date(),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  location: geoip.lookup(req.ip)
};
```

## Success Criteria

- [x] JWT implementation complete
- [ ] All authentication endpoints working
- [ ] Token refresh working smoothly
- [ ] Security measures implemented
- [ ] Web client integrated
- [ ] Mobile client integrated
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Documentation complete
- [ ] Performance targets met (<50ms token validation)

## Performance Targets

- **Token Generation**: <10ms
- **Token Validation**: <5ms
- **Login Request**: <500ms (including DB lookup)
- **Token Refresh**: <100ms
- **Logout**: <200ms

## Cost Considerations

- **Minimal Infrastructure Cost**: JWT validation is CPU-based, no additional services needed
- **No Session Storage**: Eliminates need for Redis/Memcached for sessions (though we use Redis for caching)
- **Bandwidth**: Slightly higher due to token size (negligible impact)

## References

- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js jsonwebtoken Library](https://github.com/auth0/node-jsonwebtoken)
- [OAuth 2.0 and JWT](https://oauth.net/2/jwt/)

## Revision History

- **2025-10-18**: Initial version - Accepted
- **Status**: Active

---

**Next Review**: 2026-04-18 (6 months)  
**Owner**: Software Architect  
**Stakeholders**: Security Lead, Backend Team, Technical Lead
