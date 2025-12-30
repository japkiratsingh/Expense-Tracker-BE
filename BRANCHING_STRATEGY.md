# Git Branching Strategy

## Overview
This document outlines the branching strategy for the Expense Tracker project with Splitwise integration.

## Branch Structure

```
main (production-ready code)
│
├── feature/categories
├── feature/tags
├── feature/expenses
├── feature/recurring-expenses
├── feature/attachments
├── feature/rate-limiting
├── feature/analytics
│
└── Splitwise Features
    ├── feature/groups-management
    ├── feature/group-expenses
    ├── feature/balance-tracking
    ├── feature/settlements
    ├── feature/activity-feed
    └── feature/splitwise-integration
```

## Branch Inventory

### Core Features (Phase 1-3)

| Branch | Purpose | Status | Dependencies |
|--------|---------|--------|--------------|
| `feature/categories` | Category management system | ⏳ Pending | None |
| `feature/tags` | Tag management system | ⏳ Pending | None |
| `feature/expenses` | Personal expense tracking | ⏳ Pending | Categories, Tags |
| `feature/recurring-expenses` | Recurring expense automation | ⏳ Pending | Expenses |
| `feature/attachments` | File upload & receipt management | ⏳ Pending | Expenses |
| `feature/rate-limiting` | API rate limiting & security | ⏳ Pending | None |
| `feature/analytics` | Statistics & reporting | ⏳ Pending | Expenses |

### Splitwise Features (Phase 4)

| Branch | Purpose | Status | Dependencies |
|--------|---------|--------|--------------|
| `feature/groups-management` | Group creation & member management | ⏳ Pending | None |
| `feature/group-expenses` | Group expense splitting | ⏳ Pending | Groups Management |
| `feature/balance-tracking` | Balance calculation & debt tracking | ⏳ Pending | Group Expenses |
| `feature/settlements` | Payment recording & confirmation | ⏳ Pending | Balance Tracking |
| `feature/activity-feed` | Group activity timeline | ⏳ Pending | All above |
| `feature/splitwise-integration` | Final integration & testing | ⏳ Pending | All above |

## Development Workflow

### 1. Starting Work on a Feature

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Switch to feature branch
git checkout feature/<feature-name>

# Start development
```

### 2. During Development

```bash
# Commit frequently with meaningful messages
git add .
git commit -m "feat: <description>"

# Push to remote regularly
git push origin feature/<feature-name>
```

### 3. Completing a Feature

```bash
# Ensure all tests pass
npm test

# Update from main
git checkout main
git pull origin main
git checkout feature/<feature-name>
git merge main

# Resolve any conflicts
# Test again after merge

# Push final changes
git push origin feature/<feature-name>
```

### 4. Merging to Main

```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature/<feature-name> --no-ff

# Push to remote
git push origin main

# Optionally delete feature branch
git branch -d feature/<feature-name>
git push origin --delete feature/<feature-name>
```

## Commit Message Convention

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:

```bash
feat(categories): implement category CRUD operations
fix(expenses): resolve date filtering issue
docs(api): update expense endpoints documentation
refactor(services): extract balance calculation logic
test(groups): add unit tests for group service
```

## Implementation Order

### Phase 1: Core Features Foundation (Week 1-2)
**Priority: HIGH**

1. ✅ `main` - Current state (Auth system complete)
2. 🔄 `feature/categories` - Start here
3. 🔄 `feature/tags` - Parallel with categories
4. ⏭️ `feature/expenses` - After categories & tags

### Phase 2: Advanced Personal Features (Week 2-3)
**Priority: MEDIUM**

5. ⏭️ `feature/recurring-expenses`
6. ⏭️ `feature/attachments`
7. ⏭️ `feature/rate-limiting`
8. ⏭️ `feature/analytics`

### Phase 3: Splitwise Foundation (Week 3-4)
**Priority: HIGH**

9. ⏭️ `feature/groups-management`
10. ⏭️ `feature/group-expenses`

### Phase 4: Splitwise Advanced (Week 4-5)
**Priority: MEDIUM**

11. ⏭️ `feature/balance-tracking`
12. ⏭️ `feature/settlements`

### Phase 5: Splitwise Completion (Week 5-6)
**Priority: LOW**

13. ⏭️ `feature/activity-feed`
14. ⏭️ `feature/splitwise-integration`

## Branch Protection Rules

### Main Branch
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ No force pushes
- ✅ No deletions

### Feature Branches
- ⚠️ Can be force pushed (with caution)
- ⚠️ Can be deleted after merge
- ✅ Should be kept up to date with main

## Code Review Process

1. **Developer** completes feature
2. **Developer** creates pull request
3. **Reviewer** reviews code
4. **Reviewer** suggests changes or approves
5. **Developer** addresses feedback
6. **Reviewer** approves
7. **Developer** or **Admin** merges to main

## Testing Requirements

Before merging any feature branch:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing completed
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Constants properly used (no magic numbers/strings)
- [ ] SOLID principles followed

## Branch Naming Rules

```
feature/<feature-name>      - New features
bugfix/<bug-name>          - Bug fixes
hotfix/<issue-name>        - Production hotfixes
experimental/<exp-name>    - Experimental features
refactor/<refactor-name>   - Code refactoring
```

## Current Status

### ✅ Completed
- Initial project setup
- Authentication system
- Constants refactoring
- SOLID principles implementation
- Branch creation

### 🔄 In Progress
- None (ready to start feature/categories)

### ⏳ Pending
- All 13 feature branches

### 📋 Backlog
- MongoDB integration
- Real-time notifications
- Mobile app API enhancements

## Quick Reference Commands

```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feature/<name>

# Switch to existing branch
git checkout feature/<name>

# Update branch from main
git checkout feature/<name>
git merge main

# Delete local branch
git branch -d feature/<name>

# Delete remote branch
git push origin --delete feature/<name>

# View branch history
git log --graph --oneline --all

# Check branch status
git status
```

## Notes

- Always pull from `main` before creating a new feature branch
- Keep feature branches focused on single features
- Merge `main` into feature branches regularly to avoid conflicts
- Delete feature branches after successful merge to keep repo clean
- Use meaningful commit messages
- Document all changes in respective feature branches

## Next Steps

1. ✅ Create all feature branches
2. ✅ Document branching strategy
3. 🔄 Start with `feature/categories`
4. ⏭️ Complete Phase 1 features
5. ⏭️ Move to Phase 2
6. ⏭️ Implement Splitwise features

---

**Last Updated:** 2025-12-30
**Total Branches:** 14 (1 main + 13 features)
**Status:** Ready for development
