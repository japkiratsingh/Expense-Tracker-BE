# Splitwise Integration - Plan of Action

## Overview
Integrate Splitwise-like functionality into the Expense Tracker to enable group expense management, bill splitting, and settlement tracking among multiple users.

## Core Features to Implement

### 1. Groups Management
- Create, update, delete groups
- Add/remove members from groups
- Group categories and settings
- Group-specific currencies

### 2. Group Expenses
- Add expenses to groups
- Split expenses among group members
- Multiple split methods:
  - Equal split
  - Exact amounts
  - Percentages
  - Shares/ratios
  - By item (itemized bills)
- Expense categories within groups
- Attach receipts to group expenses

### 3. Balance & Settlement
- Calculate balances between users
- Simplify debts (optimize settlements)
- Record settlements/payments
- Settlement history
- Balance summaries per group
- Overall balance across all groups

### 4. Activity Feed
- Group activity timeline
- Expense notifications
- Settlement notifications
- Member join/leave events

### 5. Notifications (Future)
- Email notifications for new expenses
- Payment reminders
- Settlement confirmations

## Data Models

### Group Model
```javascript
{
  _id: String,
  name: String,
  description: String,
  category: String, // trip, home, couple, other
  currency: String,
  createdBy: String (userId),
  members: [
    {
      userId: String,
      role: String, // admin, member
      joinedAt: Date,
      isActive: Boolean
    }
  ],
  settings: {
    simplifyDebts: Boolean,
    defaultSplitMethod: String
  },
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### GroupExpense Model
```javascript
{
  _id: String,
  groupId: String,
  description: String,
  amount: Number,
  currency: String,
  paidBy: String (userId),
  date: Date,
  category: String,
  notes: String,
  attachments: [String],

  splits: [
    {
      userId: String,
      shareAmount: Number,
      percentage: Number, // if percentage split
      shares: Number, // if share-based split
      isPaid: Boolean
    }
  ],

  splitMethod: String, // equal, exact, percentage, shares, itemized

  // For itemized splits
  items: [
    {
      name: String,
      amount: Number,
      quantity: Number,
      sharedBy: [String] // userIds
    }
  ],

  createdBy: String (userId),
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean
}
```

### Settlement Model
```javascript
{
  _id: String,
  groupId: String,
  from: String (userId),
  to: String (userId),
  amount: Number,
  currency: String,
  date: Date,
  notes: String,
  paymentMethod: String,
  confirmedBy: [String], // userIds who confirmed
  createdAt: Date,
  updatedAt: Date
}
```

### Balance Model (Computed/Cached)
```javascript
{
  _id: String,
  groupId: String,
  userId: String,
  balances: {
    [otherUserId]: Number // positive = owed to you, negative = you owe
  },
  totalOwed: Number, // total others owe you
  totalOwing: Number, // total you owe others
  netBalance: Number, // totalOwed - totalOwing
  lastUpdated: Date
}
```

### GroupActivity Model
```javascript
{
  _id: String,
  groupId: String,
  type: String, // expense_added, expense_updated, settlement, member_joined, etc.
  actorId: String (userId),
  metadata: Object, // varies by type
  timestamp: Date
}
```

## API Endpoints

### Groups
```
POST   /api/groups                    - Create group
GET    /api/groups                    - List user's groups
GET    /api/groups/:id                - Get group details
PUT    /api/groups/:id                - Update group
DELETE /api/groups/:id                - Delete/leave group
POST   /api/groups/:id/members        - Add member
DELETE /api/groups/:id/members/:userId - Remove member
GET    /api/groups/:id/balances       - Get group balances
GET    /api/groups/:id/activity       - Get group activity feed
```

### Group Expenses
```
POST   /api/groups/:groupId/expenses           - Add group expense
GET    /api/groups/:groupId/expenses           - List group expenses
GET    /api/groups/:groupId/expenses/:id       - Get expense details
PUT    /api/groups/:groupId/expenses/:id       - Update expense
DELETE /api/groups/:groupId/expenses/:id       - Delete expense
POST   /api/groups/:groupId/expenses/:id/split - Update split details
```

### Settlements
```
POST   /api/groups/:groupId/settlements        - Record settlement
GET    /api/groups/:groupId/settlements        - List settlements
GET    /api/groups/:groupId/settlements/:id    - Get settlement details
PUT    /api/groups/:groupId/settlements/:id    - Update settlement
POST   /api/groups/:groupId/settlements/:id/confirm - Confirm settlement
```

### Balances & Analytics
```
GET    /api/balances                           - User's overall balances
GET    /api/balances/simplified                - Simplified settlement suggestions
GET    /api/groups/:groupId/stats              - Group statistics
```

## Business Logic

### Split Calculation Algorithms

#### 1. Equal Split
```javascript
shareAmount = totalAmount / numberOfParticipants
```

#### 2. Exact Amount Split
```javascript
// User specifies exact amount for each person
// Validation: sum of all shares must equal total amount
```

#### 3. Percentage Split
```javascript
shareAmount = (totalAmount * percentage) / 100
// Validation: sum of percentages must equal 100%
```

#### 4. Share-based Split
```javascript
totalShares = sum of all shares
shareAmount = (totalAmount * userShares) / totalShares
```

#### 5. Itemized Split
```javascript
// Each item can be shared by multiple people
itemSharePerPerson = itemAmount / numberOfShareholders
userTotal = sum of all itemSharePerPerson for user
```

### Balance Calculation

For each pair of users in a group:
```javascript
userAOwesUserB = sum of (expenses where B paid and A is in split) -
                 sum of (expenses where A paid and B is in split)
```

### Debt Simplification Algorithm

Use graph-based approach to minimize number of transactions:
1. Calculate net balance for each user
2. Separate users into creditors (positive balance) and debtors (negative balance)
3. Match largest debtor with largest creditor
4. Create settlement for minimum of the two absolute values
5. Update balances and repeat until all balanced

## Implementation Phases

### Phase 1: Core Group Management (Week 1)
**Branch:** `feature/groups-management`
- Group model, repository, service
- Group CRUD operations
- Member management
- Group validators and constants
- API endpoints for groups

### Phase 2: Group Expenses (Week 2)
**Branch:** `feature/group-expenses`
- GroupExpense model, repository, service
- Split calculation service
- Support for all split methods
- Expense CRUD in groups
- API endpoints for group expenses

### Phase 3: Balance Calculation (Week 2)
**Branch:** `feature/balance-tracking`
- Balance calculation service
- Debt simplification algorithm
- Balance queries and summaries
- API endpoints for balances

### Phase 4: Settlements (Week 3)
**Branch:** `feature/settlements`
- Settlement model, repository, service
- Settlement recording and confirmation
- Settlement history
- API endpoints for settlements

### Phase 5: Activity Feed (Week 3)
**Branch:** `feature/activity-feed`
- GroupActivity model and service
- Activity tracking for all events
- Activity feed API endpoints
- Pagination and filtering

### Phase 6: Integration & Testing (Week 4)
**Branch:** `feature/splitwise-integration`
- Integration testing
- End-to-end workflows
- Performance optimization
- Documentation

## Technical Considerations

### Database Design
- Use transactions for settlement operations
- Index on groupId, userId for fast queries
- Cache balance calculations
- Archive old activities

### Performance
- Lazy load group members
- Paginate expense lists
- Cache balance summaries
- Use background jobs for complex calculations

### Security
- Verify user is group member before operations
- Only group admins can delete groups
- Members can only edit their own expenses (unless admin)
- Validate split totals match expense amount

### Validation Rules
- Split amounts must sum to total expense
- Percentages must sum to 100%
- Users in splits must be group members
- Settlement amount must not exceed owed amount
- Cannot delete group with unsettled balances (or require confirmation)

## Migration Path from Current System

1. Personal expenses remain in existing `expenses` table
2. Group expenses go to new `groupExpenses` table
3. User can view both in unified dashboard
4. Option to convert personal expense to group expense
5. Export/import functionality for Splitwise users

## Future Enhancements

### Phase 7: Advanced Features
- Recurring group expenses
- Budget limits per group
- Category-based analytics
- Export to Splitwise format
- Mobile app support
- Real-time updates (WebSocket)
- Multi-currency support with exchange rates
- Receipt OCR and auto-split
- Integration with payment apps

### Phase 8: Social Features
- Friend system
- Expense comments and reactions
- @mentions in notes
- Group chat
- Expense approval workflow

## Testing Strategy

### Unit Tests
- Split calculation algorithms
- Balance calculation
- Debt simplification
- Validation logic

### Integration Tests
- Group creation and member management
- Expense lifecycle
- Settlement workflows
- Balance updates

### E2E Tests
- Complete user journey
- Multi-user scenarios
- Edge cases (partial settlements, deleted users)

## Success Metrics

1. Accurate balance calculations (0% error tolerance)
2. Debt simplification reduces transactions by >50%
3. API response time <200ms for balance queries
4. Support for groups up to 100 members
5. Handle 1000+ expenses per group efficiently

## Dependencies

### New npm packages needed:
- None (use existing stack)

### Optional enhancements:
- `bull` - for background job processing
- `socket.io` - for real-time updates
- `currency-converter` - for multi-currency support

## Deliverables

1. Fully functional Splitwise-like features
2. Comprehensive API documentation
3. Unit and integration tests
4. Migration guide
5. User guide for group expense management

---

## Branch Strategy

Each feature will be developed in its own branch:
- `feature/groups-management`
- `feature/group-expenses`
- `feature/balance-tracking`
- `feature/settlements`
- `feature/activity-feed`
- `feature/splitwise-integration`

All branches will be created from `main` and merged back via PR after completion and testing.
