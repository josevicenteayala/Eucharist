# User Stories Backlog - Eucharist Understanding Platform

**Document Version**: 1.0  
**Date**: October 19, 2025  
**Last Updated**: October 19, 2025  
**Owner**: Product Owner

---

## Story Point Scale

- **1 point**: Very simple, < 2 hours
- **2 points**: Simple, 2-4 hours
- **3 points**: Moderate, 4-8 hours
- **5 points**: Medium, 1-2 days
- **8 points**: Complex, 2-3 days
- **13 points**: Very complex, 3-5 days
- **21 points**: Needs breakdown, > 5 days

---

## Epic 1: Authentication & User Management

### US-001: User Registration

**Priority**: Must Have (MVP)  
**Story Points**: 8

**User Story**:
As a new user  
I want to create an account  
So that I can access personalized features

**Acceptance Criteria**:

- [ ] User can register with email and password
- [ ] Email validation (format check)
- [ ] Password strength requirements enforced (min 8 chars, uppercase, lowercase, number)
- [ ] User receives verification email
- [ ] Error messages displayed for invalid input
- [ ] User redirected to profile setup after successful registration
- [ ] Duplicate email detection with appropriate error message

**Technical Notes**:

- Use bcrypt for password hashing (cost factor 10)
- JWT token generation for authentication
- Email service integration (SendGrid or SES)
- Rate limiting on registration endpoint

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] API documentation updated
- [ ] Error handling implemented
- [ ] Security review completed
- [ ] Deployed to staging

---

### US-002: User Login

**Priority**: Must Have (MVP)  
**Story Points**: 5

**User Story**:
As a registered user  
I want to log in to my account  
So that I can access my personalized content

**Acceptance Criteria**:

- [ ] User can log in with email and password
- [ ] Successful login returns JWT access token and refresh token
- [ ] "Remember me" option available
- [ ] Failed login shows appropriate error message
- [ ] Account locked after 5 failed attempts (15-minute lockout)
- [ ] Password visible/hidden toggle
- [ ] Loading state during authentication

**Technical Notes**:

- JWT access token (15 min expiry)
- Refresh token (7 days expiry)
- Store refresh token in database
- Implement rate limiting (5 attempts per 15 min)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-003: Email Verification

**Priority**: Must Have (MVP)  
**Story Points**: 5

**User Story**:
As a new user  
I want to verify my email address  
So that I can activate my account

**Acceptance Criteria**:

- [ ] Verification email sent upon registration
- [ ] Email contains secure verification link
- [ ] Link expires after 24 hours
- [ ] Successful verification activates account
- [ ] User can request new verification email
- [ ] Clear success/error messages
- [ ] Verification status shown in user profile

**Technical Notes**:

- Generate secure verification token
- Token stored in database with expiry
- Email template with branding
- Redirect to login after verification

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Email template approved
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-004: Password Reset

**Priority**: Must Have (MVP)  
**Story Points**: 8

**User Story**:
As a user who forgot my password  
I want to reset it securely  
So that I can regain access to my account

**Acceptance Criteria**:

- [ ] "Forgot Password" link on login page
- [ ] User enters email address
- [ ] Reset email sent if account exists (no indication if account doesn't exist for security)
- [ ] Reset link expires after 1 hour
- [ ] User can set new password meeting requirements
- [ ] Old password cannot be reused
- [ ] User notified of password change via email
- [ ] Automatic login after password reset

**Technical Notes**:

- Secure reset token generation
- Token stored with expiry
- Invalidate all existing sessions on password change
- Email notification for security

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Security testing completed
- [ ] Tests written and passing
- [ ] Email templates approved
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-005: User Profile

**Priority**: Must Have (MVP)  
**Story Points**: 5

**User Story**:
As a registered user  
I want to view and edit my profile  
So that I can manage my personal information

**Acceptance Criteria**:

- [ ] View profile page with current information
- [ ] Edit display name
- [ ] Edit profile picture (upload and crop)
- [ ] Edit bio/description
- [ ] Edit location (optional)
- [ ] View account creation date
- [ ] View prayer streak counter
- [ ] Changes saved successfully with confirmation
- [ ] Validation for all fields

**Technical Notes**:

- Image upload to S3/Cloud Storage
- Image optimization and resizing
- Max file size 5MB
- Supported formats: JPG, PNG

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Image handling tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 2: Daily Gospel & Reflection

### US-006: Display Today's Gospel

**Priority**: Must Have (MVP)  
**Story Points**: 5

**User Story**:
As a user  
I want to see today's Gospel reading  
So that I can pray with the daily Scripture

**Acceptance Criteria**:

- [ ] Gospel displays automatically on home page
- [ ] Correct date shown
- [ ] Liturgical season indicated (Advent, Lent, Ordinary Time, etc.)
- [ ] Liturgical year noted (A, B, or C)
- [ ] First reading, Responsorial Psalm, and Gospel included
- [ ] Second reading included if applicable (Sundays and solemnities)
- [ ] Citation references accurate and clickable
- [ ] Readable font size and formatting
- [ ] Responsive design for mobile and desktop
- [ ] Feast day noted if applicable

**Technical Notes**:

- API endpoint: GET /api/gospel/today
- Cache Gospel for 24 hours (Redis)
- Data source: USCCB or similar
- Handle special liturgical days

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Theological accuracy verified
- [ ] Citations verified
- [ ] Responsive design tested
- [ ] Caching implemented
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-007: Gospel Calendar View

**Priority**: Should Have  
**Story Points**: 8

**User Story**:
As a user  
I want to view past and future Gospel readings  
So that I can plan my prayer time

**Acceptance Criteria**:

- [ ] Calendar view showing current month
- [ ] Navigate to previous/next months
- [ ] Dates with Gospel readings highlighted
- [ ] Click date to view that day's Gospel
- [ ] Today's date clearly marked
- [ ] Feast days shown with special styling
- [ ] Liturgical seasons color-coded
- [ ] Mobile-friendly calendar interface

**Technical Notes**:

- API endpoint: GET /api/gospel/calendar/:year/:month
- Pre-populate database with liturgical calendar
- Cache calendar data
- Use existing calendar library (react-calendar or similar)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Responsive design tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-008: Daily Reflection

**Priority**: Must Have (MVP)  
**Story Points**: 3 (per reflection content)

**User Story**:
As a seeker  
I want to read a brief reflection on the Gospel  
So that I can understand how it applies to my life

**Acceptance Criteria**:

- [ ] Reflection appears with Gospel reading
- [ ] 300-500 word length
- [ ] Practical application included
- [ ] 2-3 reflection questions provided
- [ ] Theologically reviewed and approved
- [ ] Author attribution
- [ ] Clear, accessible language
- [ ] Compelling introduction
- [ ] Clear formatting and structure

**Technical Notes**:

- Store reflections in MongoDB
- Link to Gospel reading by date
- Markdown support for formatting
- Theological review workflow in CMS

**Definition of Done**:

- [ ] Content written and edited
- [ ] Theological review completed and approved
- [ ] Reflection published to database
- [ ] Display tested on web and mobile
- [ ] Formatting verified
- [ ] Spelling and grammar checked

---

### US-009: Audio Gospel Playback

**Priority**: Should Have  
**Story Points**: 8

**User Story**:
As a user with limited time  
I want to listen to the Gospel reading  
So that I can pray while commuting or exercising

**Acceptance Criteria**:

- [ ] Audio play button visible on Gospel page
- [ ] Audio plays without interruption
- [ ] Play/pause/restart controls work
- [ ] Audio quality is clear and professional
- [ ] Works with phone locked (background play)
- [ ] Loading indicator while audio loads
- [ ] Audio speed control (0.75x, 1x, 1.25x, 1.5x)
- [ ] Progress bar shows playback position
- [ ] Accessible controls (ARIA labels)

**Technical Notes**:

- Audio files stored in S3/Cloud Storage
- CDN for audio delivery
- Use HTML5 audio API
- Consider text-to-speech API (AWS Polly, Google TTS) for automated generation
- Audio format: MP3 (compatibility)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Audio quality verified
- [ ] Mobile testing (iOS and Android)
- [ ] Background playback tested
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-010: Share Gospel

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a user  
I want to share today's Gospel  
So that I can inspire others

**Acceptance Criteria**:

- [ ] Share button visible on Gospel page
- [ ] Share via social media (Facebook, Twitter, WhatsApp)
- [ ] Share via email
- [ ] Copy link to clipboard
- [ ] Share includes formatted text with citation
- [ ] Share preview looks good (Open Graph tags)
- [ ] Analytics track shares

**Technical Notes**:

- Social share APIs
- Open Graph meta tags
- Canonical URLs
- UTM parameters for tracking

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Social previews tested
- [ ] Analytics implemented
- [ ] Mobile sharing tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 3: Educational Content

### US-011: Article Display

**Priority**: Must Have (MVP)  
**Story Points**: 8

**User Story**:
As a user  
I want to read educational articles about the Eucharist  
So that I can deepen my understanding

**Acceptance Criteria**:

- [ ] Article page displays title, author, date
- [ ] Cover image shown
- [ ] Article content formatted properly (headings, paragraphs, lists)
- [ ] Estimated reading time shown
- [ ] Category and tags displayed
- [ ] Related articles suggested at bottom
- [ ] Progress indicator as user scrolls
- [ ] Responsive design
- [ ] Print-friendly format
- [ ] Accessible (WCAG 2.1 AA)

**Technical Notes**:

- Fetch from MongoDB
- Markdown to HTML conversion
- Syntax highlighting for quotes
- Image lazy loading
- SEO optimization (meta tags)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Responsive design tested
- [ ] SEO verified
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-012: Article Library

**Priority**: Must Have (MVP)  
**Story Points**: 8

**User Story**:
As a user  
I want to browse available articles  
So that I can find topics of interest

**Acceptance Criteria**:

- [ ] Grid/list view of all articles
- [ ] Filter by category
- [ ] Filter by difficulty level (beginner, intermediate, advanced)
- [ ] Filter by tags
- [ ] Sort options (newest, popular, title)
- [ ] Search functionality
- [ ] Pagination (20 articles per page)
- [ ] Article card shows: title, excerpt, cover image, reading time
- [ ] Responsive grid layout
- [ ] Clear empty state if no articles match filters

**Technical Notes**:

- API endpoint: GET /api/content with query params
- Implement search using MongoDB text search or Elasticsearch
- Cache popular queries
- Optimize database queries with indexes

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-013: "What is the Eucharist?" Article

**Priority**: Must Have (MVP)  
**Story Points**: 8 (content creation)

**User Story**:
As an RCIA candidate  
I want to learn about the Real Presence  
So that I can understand this central Catholic belief

**Acceptance Criteria**:

- [ ] Article explains transubstantiation clearly
- [ ] Biblical foundations included (John 6, Last Supper accounts)
- [ ] Church teaching cited (Catechism, Vatican II)
- [ ] Written at beginner level
- [ ] 5-7 minute read time (800-1200 words)
- [ ] Addresses common questions/objections
- [ ] Includes relevant images or illustrations
- [ ] Reflection questions at end
- [ ] Sources and further reading provided
- [ ] Theologically reviewed and approved

**Technical Notes**:

- Core foundational content
- High priority for theological review
- Consider creating video version later
- Link to related articles

**Definition of Done**:

- [ ] Content written and edited
- [ ] Theological review completed and approved
- [ ] Images sourced and credited
- [ ] Citations verified
- [ ] Published to database
- [ ] Display tested
- [ ] SEO optimized

---

### US-014: Parts of the Mass - Interactive Guide

**Priority**: Must Have (MVP)  
**Story Points**: 13

**User Story**:
As a new Catholic  
I want an interactive guide to the Mass  
So that I can understand what's happening and when

**Acceptance Criteria**:

- [ ] All Mass parts listed in chronological order
- [ ] Each part has explanation of meaning
- [ ] Common prayers included for each section
- [ ] "Why we do this" explained
- [ ] Visual/interactive elements (expandable sections)
- [ ] Audio option for prayers
- [ ] Illustrations or diagrams
- [ ] Mobile-friendly interface
- [ ] Progress tracking through Mass
- [ ] Beginner-friendly language
- [ ] Citations to liturgical documents

**Sections to Include**:

- Introductory Rites (Entrance, Greeting, Penitential Act, Gloria, Collect)
- Liturgy of the Word (Readings, Gospel, Homily, Creed, Prayers of Faithful)
- Liturgy of the Eucharist (Preparation, Eucharistic Prayer, Communion Rite)
- Concluding Rites (Blessing, Dismissal)

**Technical Notes**:

- Interactive component library
- Consider timeline/step-by-step interface
- Bookmark/favorite specific parts
- Share specific sections
- Multi-language support (future)

**Definition of Done**:

- [ ] All content written and reviewed
- [ ] Theological review completed
- [ ] Interactive UI developed and tested
- [ ] Audio recorded (if included)
- [ ] Responsive design tested
- [ ] Accessibility tested
- [ ] User testing completed
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-015: Search Content

**Priority**: Should Have  
**Story Points**: 8

**User Story**:
As a user  
I want to search for specific topics  
So that I can quickly find relevant information

**Acceptance Criteria**:

- [ ] Search bar visible on main navigation
- [ ] Real-time search suggestions as user types
- [ ] Search results show: title, excerpt, category, relevance score
- [ ] Search across articles, Gospel reflections, and miracles
- [ ] Highlight search terms in results
- [ ] Filter results by content type
- [ ] Sort by relevance or date
- [ ] Handle misspellings gracefully
- [ ] Empty state with suggestions if no results
- [ ] Search analytics tracked

**Technical Notes**:

- Full-text search using MongoDB or Elasticsearch
- Search indexing strategy
- Cache popular searches
- Implement search analytics
- Consider autocomplete API

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Search accuracy tested
- [ ] Performance optimized
- [ ] Analytics implemented
- [ ] Mobile tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 4: Eucharistic Miracles

### US-016: Miracles Gallery

**Priority**: Should Have  
**Story Points**: 8

**User Story**:
As a lifelong learner  
I want to explore documented Eucharistic miracles  
So that I can deepen my faith in the Real Presence

**Acceptance Criteria**:

- [ ] Grid view of miracle cards
- [ ] Each card shows: location, date, image thumbnail
- [ ] Filter by country/region
- [ ] Filter by time period (century)
- [ ] Sort by date or name
- [ ] Click card to view full story
- [ ] Map view showing miracle locations
- [ ] Responsive grid layout
- [ ] Loading states
- [ ] Pagination or infinite scroll

**Initial Miracles to Include** (minimum 5):

1. Lanciano, Italy (8th century)
2. Buenos Aires, Argentina (1996)
3. Sokółka, Poland (2008)
4. Legnica, Poland (2013)
5. Siena, Italy (1730)

**Technical Notes**:

- Store in MongoDB with geolocation data
- Integrate map library (Google Maps, Mapbox, or Leaflet)
- Image optimization
- SEO for individual miracle pages

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] At least 5 miracles documented
- [ ] All miracles theologically reviewed
- [ ] Map functionality tested
- [ ] Responsive design tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-017: Miracle Detail Page

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a user  
I want to read the full story of a Eucharistic miracle  
So that I can understand what happened and its significance

**Acceptance Criteria**:

- [ ] Full story with rich formatting
- [ ] Multiple images/photos
- [ ] Location information with map
- [ ] Date and historical context
- [ ] Scientific evidence presented (if available)
- [ ] Church approval status
- [ ] Sources and references cited
- [ ] Related miracles suggested
- [ ] Share functionality
- [ ] Bookmark functionality
- [ ] Print-friendly format

**Technical Notes**:

- Rich text content from MongoDB
- Image gallery component
- Embedded map
- Social sharing
- SEO optimization

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Content accuracy verified
- [ ] Responsive design tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 5: Community Features

### US-018: Submit Prayer Intention

**Priority**: Should Have  
**Story Points**: 8

**User Story**:
As a user  
I want to share a prayer intention  
So that others can pray for me

**Acceptance Criteria**:

- [ ] Simple submission form
- [ ] Text field for intention (max 500 characters)
- [ ] Optional anonymity checkbox
- [ ] Category selection (health, family, work, spiritual, other)
- [ ] Optional name field
- [ ] Privacy options (public, community only)
- [ ] Confirmation message after submission
- [ ] Moderation queue before publication
- [ ] Email notification to moderators
- [ ] Character count shown

**Technical Notes**:

- Store in PostgreSQL
- Moderation workflow
- Content filtering for inappropriate content
- Rate limiting (max 3 per day per user)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Moderation process defined
- [ ] Privacy controls tested
- [ ] Rate limiting implemented
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-019: View Prayer Intentions

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a community member  
I want to see and pray for others' intentions  
So that I can support my brothers and sisters

**Acceptance Criteria**:

- [ ] List of recent intentions (paginated)
- [ ] Each intention shows: text, category, date, prayer count
- [ ] "I Prayed" button for each intention
- [ ] Prayer count increments when button clicked
- [ ] Filter by category
- [ ] Sort by newest, most prayed for
- [ ] Anonymous intentions show "Anonymous" instead of name
- [ ] Refresh functionality
- [ ] Empty state if no intentions
- [ ] Responsive layout

**Technical Notes**:

- API endpoint: GET /api/intentions
- Track prayers in prayer_logs table
- Real-time or near-real-time updates
- Cache intention list (short TTL)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-020: My Prayer Intentions

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a user  
I want to view my submitted prayer intentions  
So that I can see how many people prayed for them

**Acceptance Criteria**:

- [ ] List of user's own intentions
- [ ] Show: text, date submitted, prayer count, status (active/answered/archived)
- [ ] Edit intention (before moderation approval)
- [ ] Mark as "answered" with optional testimony
- [ ] Delete intention
- [ ] Archive old intentions
- [ ] Filter by status
- [ ] Empty state if no intentions
- [ ] Responsive layout

**Technical Notes**:

- API endpoint: GET /api/intentions/mine
- Edit and delete permissions
- Status workflow: pending → active → answered/archived
- Testimony feature for answered prayers

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Permissions tested
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 6: User Progress & Bookmarks

### US-021: Bookmark Content

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a user  
I want to bookmark articles and content  
So that I can easily return to them later

**Acceptance Criteria**:

- [ ] Bookmark button on all content types (articles, gospels, miracles)
- [ ] Visual indication when bookmarked (filled vs outline icon)
- [ ] Click to toggle bookmark on/off
- [ ] Optional notes field for bookmark
- [ ] Bookmark saved immediately
- [ ] Confirmation message
- [ ] Works on mobile and desktop

**Technical Notes**:

- Store in bookmarks table
- API endpoints: POST/DELETE /api/bookmarks
- Handle different content types
- Index for efficient queries

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] All content types supported
- [ ] Mobile tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-022: View Bookmarks

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a user  
I want to view all my bookmarked content  
So that I can quickly access saved items

**Acceptance Criteria**:

- [ ] Bookmarks page lists all saved content
- [ ] Group by content type (articles, gospels, miracles)
- [ ] Show: title, excerpt/preview, date bookmarked, notes
- [ ] Click to open content
- [ ] Edit notes inline
- [ ] Remove bookmark button
- [ ] Filter by content type
- [ ] Sort by date added or title
- [ ] Empty state if no bookmarks
- [ ] Pagination or infinite scroll

**Technical Notes**:

- API endpoint: GET /api/bookmarks
- Join with content tables
- Cache bookmarks list
- Efficient query with indexes

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-023: Track Reading Progress

**Priority**: Could Have  
**Story Points**: 8

**User Story**:
As a user  
I want my reading progress tracked  
So that I can pick up where I left off

**Acceptance Criteria**:

- [ ] Progress automatically saved as user reads
- [ ] Progress bar shown on article cards
- [ ] Resume reading from last position
- [ ] "Continue reading" section on home page
- [ ] Mark as completed when article fully read
- [ ] Time spent tracked
- [ ] Progress synced across devices
- [ ] Privacy option to disable tracking

**Technical Notes**:

- Store in user_progress table
- Update progress via scroll position
- Debounce progress updates
- Sync mechanism for multi-device
- Consider localStorage + server sync

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Multi-device tested
- [ ] Privacy controls implemented
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-024: Prayer Streak Tracker

**Priority**: Could Have  
**Story Points**: 5

**User Story**:
As a user  
I want to see my prayer streak  
So that I can stay motivated to pray daily

**Acceptance Criteria**:

- [ ] Streak counter on user profile
- [ ] Increments when user views Gospel for the day
- [ ] Resets if user misses a day
- [ ] Calendar view showing prayer days
- [ ] Longest streak recorded
- [ ] Encouraging messages for milestones (7, 30, 100 days)
- [ ] Share streak feature (optional)
- [ ] Privacy option to hide streak

**Technical Notes**:

- Track in user_profiles table
- Daily check for streak continuation
- Consider timezone handling
- Grace period option (extend until midnight)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Timezone handling tested
- [ ] Motivational messages defined
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Epic 7: Admin & Content Management

### US-025: Admin Dashboard

**Priority**: Must Have (MVP)  
**Story Points**: 8

**User Story**:
As an admin  
I want to view platform statistics  
So that I can monitor health and usage

**Acceptance Criteria**:

- [ ] Dashboard shows key metrics:
  - [ ] Total users
  - [ ] Daily/Monthly active users
  - [ ] New registrations (today, this week, this month)
  - [ ] Content views
  - [ ] Prayer intentions submitted
  - [ ] Most popular articles
- [ ] Date range selector
- [ ] Charts and visualizations
- [ ] Refresh data button
- [ ] Export metrics to CSV
- [ ] Mobile-responsive

**Technical Notes**:

- Admin role required
- Analytics data from database
- Consider caching aggregated data
- Use charting library (Chart.js, Recharts)

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Role permissions tested
- [ ] Mobile responsive
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-026: Content Editor

**Priority**: Must Have (MVP)  
**Story Points**: 13

**User Story**:
As a content creator  
I want to create and edit articles  
So that I can publish educational content

**Acceptance Criteria**:

- [ ] Rich text editor (WYSIWYG)
- [ ] Markdown support
- [ ] Add/edit title, slug, excerpt
- [ ] Upload and manage images
- [ ] Add/edit categories and tags
- [ ] Set difficulty level
- [ ] SEO fields (meta title, description, keywords)
- [ ] Preview before publishing
- [ ] Save as draft
- [ ] Submit for theological review
- [ ] Publish article
- [ ] Revision history
- [ ] Autosave functionality

**Technical Notes**:

- Rich text editor component (TinyMCE, Quill, or Draft.js)
- Image upload to cloud storage
- Workflow: draft → review → published
- Version control for content

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Workflow tested
- [ ] Image handling tested
- [ ] Autosave tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

### US-027: Moderate Prayer Intentions

**Priority**: Should Have  
**Story Points**: 5

**User Story**:
As a moderator  
I want to review submitted prayer intentions  
So that I can approve appropriate content

**Acceptance Criteria**:

- [ ] Moderation queue showing pending intentions
- [ ] View intention details
- [ ] Approve button
- [ ] Reject button with reason
- [ ] Edit option for minor corrections
- [ ] Flag for admin review
- [ ] Bulk actions (approve/reject multiple)
- [ ] Filter by date, category
- [ ] Notification to submitter on decision
- [ ] Moderation log/history

**Technical Notes**:

- Moderator role required
- Status workflow in database
- Email notifications
- Audit trail of moderation actions

**Definition of Done**:

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] UI/UX approved
- [ ] Workflow tested
- [ ] Permissions tested
- [ ] Email notifications tested
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Backlog Priority Summary

### Must Have (MVP) - Phase 1

- US-001: User Registration
- US-002: User Login
- US-003: Email Verification
- US-004: Password Reset
- US-005: User Profile
- US-006: Display Today's Gospel
- US-008: Daily Reflection
- US-011: Article Display
- US-012: Article Library
- US-013: "What is the Eucharist?" Article
- US-014: Parts of the Mass Guide
- US-025: Admin Dashboard
- US-026: Content Editor

### Should Have - Phase 1 or Phase 2

- US-007: Gospel Calendar View
- US-009: Audio Gospel Playback
- US-010: Share Gospel
- US-015: Search Content
- US-016: Miracles Gallery
- US-017: Miracle Detail Page
- US-018: Submit Prayer Intention
- US-019: View Prayer Intentions
- US-020: My Prayer Intentions
- US-021: Bookmark Content
- US-022: View Bookmarks
- US-027: Moderate Prayer Intentions

### Could Have - Phase 2 or Phase 3

- US-023: Track Reading Progress
- US-024: Prayer Streak Tracker

---

## Definition of Ready (Story)

A story is ready for sprint planning when:

- [ ] User story format complete (As a... I want... So that...)
- [ ] Acceptance criteria defined and clear
- [ ] Story points estimated by team
- [ ] Dependencies identified
- [ ] Technical notes provided
- [ ] Design mockups available (if UI work)
- [ ] No blockers

## Definition of Done (Story)

A story is done when:

- [ ] Code complete and peer reviewed
- [ ] Unit tests written and passing (≥80% coverage)
- [ ] Integration tests passing
- [ ] Acceptance criteria met and verified
- [ ] Documentation updated (code, API, user docs)
- [ ] No critical or high-priority bugs
- [ ] Deployed to staging environment
- [ ] Product Owner acceptance
- [ ] Demo-ready

---

## Document History

| Version | Date       | Author        | Changes                       |
| ------- | ---------- | ------------- | ----------------------------- |
| 1.0     | 2025-10-19 | Product Owner | Initial user stories creation |

---

**Ad Majorem Dei Gloriam** ✝️
