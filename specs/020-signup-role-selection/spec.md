# Signup Role Selection

## User Story
As a user, I want to select my account type (Investor or Admin) during signup so I can access the appropriate features and permissions.

## Requirements

### Functional Requirements
1. **Role Selection**: Add role dropdown/toggle in signup form
2. **Role Options**:
   - `INVESTOR` - Regular user who can invest in tokens
   - `ADMIN` - Administrator with platform management access
3. **Pass Role to API**: Send selected role in registration API request
4. **Update Registration API**: Accept and store role in database

### UI Design
```
Role Selection:
┌─────────────────────────────────────┐
│  ○ Investor                         │
│    Access investment features       │
├─────────────────────────────────────┤
│  ○ Admin                            │
│    Manage platform settings         │
└─────────────────────────────────────┘
```

### API Updates

#### POST /api/auth/register
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "phone": "+234...",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "INVESTOR" | "ADMIN"
}
```

### Database Updates (if needed)
- User model should have role field with default 'INVESTOR'

### Acceptance Criteria
- [ ] Role selection UI added to signup modal
- [ ] Two role options: INVESTOR (default), ADMIN
- [ ] Role sent to registration API
- [ ] API accepts and stores role
- [ ] Admin users can access admin routes
- [ ] Default role is INVESTOR for regular signup

### Out of Scope
- Admin approval workflow (admin creation restricted to existing admins)
- Role change after registration
- Social login role selection
