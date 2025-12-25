# Mock Data Audit - SkillShare Frontend

**Generated:** December 25, 2025  
**Last Updated:** December 25, 2025  
**Auditor:** Technical Debt Review

---

## 1. Overview

### Why Mock Data Exists
This application was initially developed with mock/hardcoded data to enable rapid prototyping and frontend development without waiting for backend API completion. Mock data allowed the team to:
- Build and test UI components independently
- Demonstrate features to stakeholders
- Develop filtering, sorting, and display logic before real APIs were available

### Risks of Keeping Mock Data
1. **Data Inconsistency:** Mock data may not reflect actual backend schema, leading to integration bugs
2. **False Confidence:** Features appear functional but will break when connected to real APIs
3. **Security Risks:** Hardcoded user data, IDs, and auth tokens could leak into production
4. **Maintenance Burden:** Mock data must be updated manually and can drift from real data structures
5. **Performance Blindness:** `setTimeout()` delays don't reflect real network conditions
6. **Testing Gaps:** E2E tests may pass with mock data but fail with real APIs

### Goal
Systematically replace all mock/hardcoded data with real backend API calls while maintaining feature parity. Each item should transition from `MOCKED` → `PARTIALLY REAL` → `REAL`.

---

## 2. Mock Data Inventory

### 2.1 Mock Data Files

| Area | File Path | Type | Description | Replacement Needed | Status |
|------|-----------|------|-------------|-------------------|--------|
| Skills/Courses | `src/mock/skills.js` | Static Array | 8 hardcoded skills/courses with full details (title, mentor, pricing, content) | Skills API (`GET /skills`, `GET /skills/:id`) | MOCKED |
| Skills Categories | `src/mock/skills.js` | Static Array | `CATEGORIES` array with 6 categories and subcategories | Categories API (`GET /categories`) | MOCKED |
| Wallet Data | `src/mock/walletData.js` | Generator Function | `generateSampleWalletData()` creates fake payment methods and transactions | Wallet Service API | MOCKED |

### 2.2 Service Layer Mock Data

| Area | File Path | Type | Description | Replacement Needed | Status |
|------|-----------|------|-------------|-------------------|--------|
| Skills Service | `src/services/skillService.js` | Fake API | All methods return `MOCK_SKILLS` data with `setTimeout()` delays (200-600ms) | Real Skills API integration | MOCKED |
| Skills - Categories | `src/services/skillService.js:5-9` | Static Return | `getCategories()` returns hardcoded `CATEGORIES` | `GET /categories` API | MOCKED |
| Skills - All | `src/services/skillService.js:11-14` | Static Return | `getAllSkills()` returns `MOCK_SKILLS` array | `GET /skills` API | MOCKED |
| Skills - Filtered | `src/services/skillService.js:16-112` | In-Memory Filter | `getSkills(filters)` filters mock data locally | Server-side filtering via query params | MOCKED |
| Skills - By ID | `src/services/skillService.js:114-117` | Array Find | `getSkillById()` searches mock array | `GET /skills/:id` API | MOCKED |
| Enrolled Courses | `src/services/skillService.js:119-133` | Fake Data | `getEnrolledCourses()` returns sliced mock skills with random progress | `GET /users/:id/enrollments` API | MOCKED |
| Taught Courses | `src/services/skillService.js:135-144` | Fake Data | `getTaughtCourses()` returns sliced mock skills | `GET /mentors/:id/courses` API | MOCKED |
| Enrolled Students | `src/services/skillService.js:146-156` | Hardcoded Array | `getEnrolledStudents()` returns 3 static student objects | `GET /mentors/:id/students` API | MOCKED |
| Auth Service | `src/services/authService.js` | localStorage DB | Uses localStorage as fake database for users | User Service API | MOCKED |
| Auth - Register | `src/services/authService.js:26-52` | Local Storage | Saves users to localStorage with `setTimeout(1000ms)` delay | `POST /users` API | PARTIALLY REAL* |
| Auth - Login | `src/services/authService.js:54-76` | Local Storage | Validates against localStorage users, mock token (UUID) | `POST /auth/login` API | PARTIALLY REAL* |
| Auth - Verify Email | `src/services/authService.js:78-94` | Local Storage | Updates localStorage user `isVerified` flag | `POST /auth/verify` API | MOCKED |
| Auth - Update Profile | `src/services/authService.js:115-148` | Local Storage | Merges profile data into localStorage user | `PATCH /users/:id` API | MOCKED |
| Wallet Service | `src/services/walletService.js` | localStorage DB | All wallet operations use localStorage with fake delays | Wallet Service API | MOCKED |
| Wallet - Payment Methods | `src/services/walletService.js:29-103` | Local Storage | CRUD operations on localStorage payment methods | `GET/POST/PATCH/DELETE /payment-methods` | MOCKED |
| Wallet - Transactions | `src/services/walletService.js:105-156` | Local Storage | Transaction history from localStorage | `GET /transactions` API | MOCKED |
| Wallet - Balance | `src/services/walletService.js:158-176` | Calculated | Calculates balance from localStorage transactions | `GET /wallet/balance` API | MOCKED |
| Wallet - Stats | `src/services/walletService.js:178-202` | Calculated | Transaction statistics from localStorage | `GET /wallet/stats` API | MOCKED |
| Wallet - Demo Data | `src/services/walletService.js:204-229` | Initializer | `initializeDemoData()` seeds localStorage with fake data | Remove in production | MOCKED |

*Note: `UserService.ts` and `UserApi.js` are connected to real backend APIs, but `authService.js` still uses localStorage as a fallback mock database.

### 2.3 Component-Level Mock Data

| Area | File Path | Type | Description | Replacement Needed | Status |
|------|-----------|------|-------------|-------------------|--------|
| Meetings - Upcoming | `src/pages/Meetings/Meetings.jsx:20-42` | Hardcoded Array | 2 static upcoming meetings with fake Zoom links | `GET /meetings?status=upcoming` API | MOCKED |
| Meetings - Past | `src/pages/Meetings/Meetings.jsx:44-56` | Hardcoded Array | 1 static past meeting with recording link | `GET /meetings?status=past` API | MOCKED |
| Meetings - Messages | `src/pages/Meetings/Meetings.jsx:9-18` | Hardcoded Object | Static chat messages per meeting ID | Messaging Service API | MOCKED |
| Mentor Dashboard - Analytics | `src/components/dashboard/MentorDashboard.jsx:6-11` | Hardcoded Array | 4 static analytics cards (students, earnings, rating, bookings) | `GET /mentors/:id/analytics` API | MOCKED |
| Mentor Dashboard - Bookings | `src/components/dashboard/MentorDashboard.jsx:14-18` | Hardcoded Array | 3 static student booking entries | `GET /mentors/:id/bookings` API | MOCKED |
| Learner Dashboard - Courses | `src/components/dashboard/LearnerDashboard.jsx:8-9` | Sliced Mock | Uses `MOCK_SKILLS.slice()` for active/completed courses | `GET /users/:id/enrollments` API | MOCKED |
| Learner Dashboard - Progress | `src/components/dashboard/LearnerDashboard.jsx:34` | Hardcoded Value | `60% Complete` hardcoded progress | Real progress from API | MOCKED |
| Skill Details | `src/pages/SkillDetails/SkillDetails.jsx:16` | Mock Array Find | Searches `MOCK_SKILLS` for skill by ID | `GET /skills/:id` API | MOCKED |
| Mentor Profile | `src/pages/MentorProfile/MentorProfile.jsx:17-31` | Derived from Mock | Constructs mentor data from `MOCK_SKILLS` array | `GET /mentors/:id` API | MOCKED |
| Mentor Profile - Role | `src/pages/MentorProfile/MentorProfile.jsx:27` | Hardcoded String | `role: 'Senior Instructor'` always hardcoded | Mentor API with role field | MOCKED |
| Profile Page - Rating | `src/pages/Profile/Profile.jsx:363` | Hardcoded Value | Mentor rating always shows `4.8` | Real rating from API | MOCKED |
| Profile Page - Stats | `src/pages/Profile/Profile.jsx:224-241` | Hardcoded Values | Hours Spent (24), Completed Sessions (12), Certificates (8) | User stats API | MOCKED |
| Enrollment Modal | `src/components/booking/EnrollmentModal/EnrollmentModal.jsx:9-25` | Dynamic from Props | Payment plans built from skill props | Consider payment config API | PARTIALLY REAL |
| Enrollment Modal - Processing | `src/components/booking/EnrollmentModal/EnrollmentModal.jsx:31-35` | setTimeout | Fake 1.5s payment processing delay | Real payment API | MOCKED |
| Profile Setup - Interests | `src/components/auth/ProfileSetup/ProfileSetup.jsx:11-15` | Hardcoded Array | 12 static interest options | `GET /interests` or config API | MOCKED |
| Profile Setup - Time Slots | `src/components/auth/ProfileSetup/ProfileSetup.jsx:17` | Hardcoded Array | `['Morning', 'Afternoon', 'Evening']` | Config from backend or keep as constants | MOCKED |
| Profile Setup - Days | `src/components/auth/ProfileSetup/ProfileSetup.jsx:18` | Hardcoded Array | Weekday abbreviations array | Keep as frontend constant (acceptable) | REAL |
| Add Payment Method | `src/components/payment/PaymentMethod/AddPaymentMethod.jsx:20-21` | Hardcoded Arrays | Card types and wallet types lists | Payment config API or keep as constants | MOCKED |
| Verify Email - Button | `src/pages/VerifyEmail/VerifyEmail.jsx:57` | Demo Label | Button text says "Verify Now (Demo)" | Remove demo label in production | MOCKED |
| Wallet - Demo Button | `src/pages/Wallet/Wallet.jsx:86-95` | Demo Feature | "Load Sample Data" button for testing | Remove in production | MOCKED |

### 2.4 Fake Async Patterns

| Area | File Path | Line(s) | Delay | Description |
|------|-----------|---------|-------|-------------|
| skillService | `src/services/skillService.js` | 7 | 300ms | getCategories fake delay |
| skillService | `src/services/skillService.js` | 12 | 500ms | getAllSkills fake delay |
| skillService | `src/services/skillService.js` | 17 | 600ms | getSkills (filtered) fake delay |
| skillService | `src/services/skillService.js` | 115 | 200ms | getSkillById fake delay |
| skillService | `src/services/skillService.js` | 121 | 400ms | getEnrolledCourses fake delay |
| skillService | `src/services/skillService.js` | 136 | 400ms | getTaughtCourses fake delay |
| skillService | `src/services/skillService.js` | 148 | 300ms | getEnrolledStudents fake delay |
| walletService | `src/services/walletService.js` | 32 | 300ms | getPaymentMethods fake delay |
| walletService | `src/services/walletService.js` | 39 | 500ms | addPaymentMethod fake delay |
| walletService | `src/services/walletService.js` | 56 | 500ms | updatePaymentMethod fake delay |
| walletService | `src/services/walletService.js` | 77 | 500ms | deletePaymentMethod fake delay |
| walletService | `src/services/walletService.js` | 87 | 300ms | setDefaultPaymentMethod fake delay |
| walletService | `src/services/walletService.js` | 106 | 300ms | getTransactions fake delay |
| walletService | `src/services/walletService.js` | 142 | 500ms | createTransaction fake delay |
| walletService | `src/services/walletService.js` | 159 | 300ms | getBalance fake delay |
| walletService | `src/services/walletService.js` | 179 | 300ms | getTransactionStats fake delay |
| walletService | `src/services/walletService.js` | 204 | 300ms | initializeDemoData fake delay |
| authService | `src/services/authService.js` | 29 | 1000ms | register fake delay |
| authService | `src/services/authService.js` | 57 | 800ms | login fake delay |
| authService | `src/services/authService.js` | 81 | 500ms | verifyEmail fake delay |
| authService | `src/services/authService.js` | 118 | 1000ms | updateProfile fake delay |
| MentorProfile | `src/pages/MentorProfile/MentorProfile.jsx` | 15-36 | 500ms | setTimeout for fake API fetch |
| SkillDetails | `src/pages/SkillDetails/SkillDetails.jsx` | 14-20 | 500ms | setTimeout for fake API fetch |
| EnrollmentModal | `src/components/booking/EnrollmentModal/EnrollmentModal.jsx` | 31-35 | 1500ms | Fake payment processing |

---

## 3. Hardcoded Services & Functionalities

### 3.1 Authentication & User Management

#### authService.js - Local Storage Database
- **Current Behavior:** 
  - Users stored in `localStorage.skillshare_users` as JSON array
  - Login validates against this local array
  - Token is a random UUID stored in sessionStorage
  - Email verification just flips a boolean in localStorage
- **Expected Real Behavior:**
  - `POST /auth/register` → Backend creates user
  - `POST /auth/login` → Backend validates, returns JWT
  - `POST /auth/verify-email` → Backend verifies via token/code
  - All user data from `GET /users/:id` API

#### UserService.ts - Partially Real
- **Current Behavior:**
  - `loginUser()` and `registerUser()` call real `UserApi`
  - User stored in sessionStorage after API response
- **Expected Real Behavior:**
  - Continue using real API (already implemented)
  - Remove dependency on authService.js localStorage fallback

### 3.2 Skills & Courses

#### skillService.js - Fully Mocked
- **Current Behavior:**
  - All data comes from `MOCK_SKILLS` array (8 courses)
  - Filtering, sorting, search done client-side on mock array
  - Categories are static constants
- **Expected Real Behavior:**
  - `GET /skills` → Paginated list from backend
  - `GET /skills/:id` → Single skill details
  - `GET /categories` → Dynamic categories
  - Query params for server-side filtering/sorting/search

#### Enrolled Courses & Taught Courses
- **Current Behavior:**
  - Returns sliced portions of `MOCK_SKILLS`
  - Progress is `Math.random() * 100`
  - Students list is 3 hardcoded names
- **Expected Real Behavior:**
  - `GET /users/:id/enrollments` → Real enrolled courses with progress
  - `GET /mentors/:id/courses` → Real taught courses
  - `GET /mentors/:id/students` → Real student list

### 3.3 Wallet & Payments

#### walletService.js - Fully Mocked
- **Current Behavior:**
  - Payment methods in `localStorage.skillshare_payment_methods`
  - Transactions in `localStorage.skillshare_transactions`
  - Balance calculated client-side from localStorage
  - Demo data generator available
- **Expected Real Behavior:**
  - `GET /payment-methods` → From payment service
  - `GET /transactions` → From wallet service
  - `GET /wallet/balance` → Server-calculated balance
  - `POST /payments` → Real payment processing

### 3.4 Meetings & Messaging

#### Meetings.jsx - Fully Mocked
- **Current Behavior:**
  - 2 upcoming meetings hardcoded with fake dates/Zoom links
  - 1 past meeting with fake recording link
  - Chat messages stored in component state
  - New messages only persist until refresh
- **Expected Real Behavior:**
  - `GET /meetings` → From scheduling service
  - Real Zoom/meeting links from booking system
  - `GET /messages/:conversationId` → From messaging service
  - WebSocket for real-time chat

### 3.5 Dashboard Analytics

#### MentorDashboard.jsx - Fully Mocked
- **Current Behavior:**
  - Static analytics: "1,234 students", "PKR 150k earnings", "4.8 rating"
  - Hardcoded percentage changes ("+12%", "+8%")
  - 3 static student bookings
- **Expected Real Behavior:**
  - `GET /mentors/:id/analytics` → Real statistics
  - `GET /mentors/:id/bookings` → Real booking list
  - Time-based comparisons from backend

#### LearnerDashboard.jsx - Fully Mocked
- **Current Behavior:**
  - Active courses = `MOCK_SKILLS.slice(0, 2)`
  - Completed courses = `MOCK_SKILLS.slice(2, 3)`
  - Progress hardcoded at 60%
- **Expected Real Behavior:**
  - `GET /users/:id/enrollments?status=active` → Real active courses
  - `GET /users/:id/enrollments?status=completed` → Real completed
  - Real progress percentages from learning service

---

## 4. Progress Tracking

### Overall Status
- **Total Items Audited:** 50+
- **MOCKED:** ~45
- **PARTIALLY REAL:** ~3
- **REAL:** ~2

### Mock Removal Progress

#### Core Services
- [ ] **User Service** - Mostly real, cleanup localStorage fallbacks
- [ ] **Auth Service** - Replace localStorage with real auth API
- [ ] **Skills Service** - Connect to backend Skills API
- [ ] **Wallet Service** - Connect to backend Wallet API
- [ ] **Profile Service** - Already connected to real API ✓

#### Features
- [ ] **Login/Register Flow** - Use only real UserApi
- [ ] **Email Verification** - Connect to real verification endpoint
- [ ] **Skills Browse/Filter** - Server-side filtering
- [ ] **Skill Details Page** - Real skill fetch
- [ ] **Enrollment/Booking** - Real payment processing
- [ ] **Learner Dashboard** - Real enrollments API
- [ ] **Mentor Dashboard** - Real analytics API
- [ ] **Profile Page** - Real stats and courses
- [ ] **Wallet Page** - Real payment methods and transactions
- [ ] **Meetings Page** - Real scheduling API
- [ ] **Messaging** - Real messaging service

#### Cleanup Tasks
- [ ] Remove `src/mock/` directory
- [ ] Remove all `setTimeout(resolve)` patterns
- [ ] Remove "Demo" labels from UI
- [ ] Remove "Load Sample Data" buttons
- [ ] Remove localStorage database patterns
- [ ] Add proper error handling for API failures
- [ ] Add loading states for real API calls

---

## 5. Priority Recommendations

### High Priority (Security/Functionality)
1. **Auth Service** - Remove localStorage user database, use real auth
2. **Wallet Service** - Payment data should never be in localStorage
3. **Remove Demo Buttons** - "Verify Now (Demo)", "Load Sample Data"

### Medium Priority (User Experience)
4. **Skills Service** - Core feature, needs real data
5. **Dashboard Components** - Users expect real stats
6. **Meetings/Messaging** - Core communication features

### Low Priority (Polish)
7. **Static dropdowns** (interests, time slots) - Can remain as config
8. **Constants** (days of week, card types) - Acceptable as frontend constants

---

## Notes

- Files marked `PARTIALLY REAL` have some real API integration but still contain mock fallbacks
- `UserService.ts` and `ProfileService.ts` are the only services currently connected to real APIs
- `UserApi.js` and `ProfileApi.js` are the only API clients making real HTTP requests
- All other "API" calls are simulated with localStorage and setTimeout

---

*This document should be updated as mock data is replaced with real implementations.*
