# FireBuild.ai Security Overview

## Our Security Commitment

At FireBuild.ai, we take the security of your data seriously. This document outlines the comprehensive security measures we've implemented to protect your business and customer information.

## 🔐 Security Architecture

### Multi-Layer Defense
- **Row-Level Security (RLS)**: Every database table enforces strict access controls
- **Token-Based Access**: Public portals use cryptographically secure tokens
- **Audit Logging**: All security-relevant events are tracked and monitored
- **Rate Limiting**: API endpoints are protected against abuse

### Data Protection

#### Encryption
- **At Rest**: All data stored in our database is encrypted using AES-256
- **In Transit**: TLS 1.3 for all communications
- **Tokens**: High-entropy (128-bit) tokens with optional expiry

#### Access Control
- **Authentication**: Secure session management with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **MFA Support**: Two-factor authentication available
- **Device Management**: Track and revoke device sessions

## 🛡️ Infrastructure Security

### Web Application Firewall (WAF)
- DDoS protection
- SQL injection prevention
- XSS attack blocking
- Rate limiting per endpoint

### Security Headers
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: [Strict CSP rules]
```

### Payment Security
- **PCI Compliance**: We never store credit card data
- **Stripe Integration**: All payments processed through Stripe's secure infrastructure
- **Webhook Verification**: Cryptographic signature verification for all payment webhooks

## 📊 Data Privacy

### Customer Data
- **Isolation**: Complete data isolation between accounts
- **Portals**: Customer portals use secure, non-enumerable tokens
- **No Public Access**: Estimates and invoices require authentication or valid tokens

### GDPR Compliance
- Right to access your data
- Right to deletion
- Data portability
- Privacy by design

## 🔍 Security Monitoring

### Real-Time Monitoring
- Failed login attempts
- Unusual access patterns
- API abuse detection
- Security event alerts

### Audit Trail
- User actions logged
- Data access tracked
- Configuration changes recorded
- Security events captured

## 🚨 Incident Response

### Response Time
- **Critical**: < 1 hour
- **High**: < 4 hours
- **Medium**: < 24 hours
- **Low**: < 72 hours

### Communication
- Immediate notification of affected users
- Transparent communication about impact
- Regular updates during resolution

## 🔧 Security Best Practices

### For Your Account
1. Use a strong, unique password
2. Enable two-factor authentication
3. Regularly review device sessions
4. Monitor your security audit log
5. Keep your contact information updated

### For Your Team
1. Use role-based permissions
2. Regular access reviews
3. Remove inactive users promptly
4. Train staff on security awareness

## 📋 Compliance & Certifications

- SOC 2 Type II (In Progress)
- GDPR Compliant
- CCPA Ready
- PIPEDA Compliant

## 🐛 Security Vulnerability Disclosure

Found a security issue? We appreciate responsible disclosure.

### How to Report
1. **Email**: security@firebuild.ai
2. **PGP Key**: Available on request
3. **Response**: Within 24 hours

### What We Need
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

### Recognition
We maintain a hall of fame for security researchers who help us improve.

## 📞 Contact

**Security Team**: security@firebuild.ai  
**Privacy Officer**: privacy@firebuild.ai  
**General Support**: support@firebuild.ai

## 🔄 Updates

This document is regularly updated. Last revision: January 2025

### Recent Security Enhancements
- **Jan 2025**: Enhanced token-based access with secure RPC functions
- **Jan 2025**: Implemented comprehensive audit logging
- **Jan 2025**: Added device session management
- **Jan 2025**: Strengthened CSP and security headers
- **Jan 2025**: Zero-trust architecture for public portals

---

*Your security is our priority. We continuously invest in security improvements and welcome feedback from our community.*