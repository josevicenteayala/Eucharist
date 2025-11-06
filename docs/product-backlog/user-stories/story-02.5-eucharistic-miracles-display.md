# User Story: Display Eucharistic Miracles Gallery

## Story Metadata
**Story ID**: US-02.5  
**Epic**: [Epic 2: Eucharist Education](../epics/epic-02-eucharist-education.md)  
**Created**: November 6, 2025  
**Updated**: November 6, 2025  
**Status**: Backlog  
**Sprint**: TBD  
**Owner**: Product Owner

---

## User Story

```
As a lifelong learner
I want to explore documented Eucharistic miracles with detailed information
So that I can deepen my faith in the Real Presence through tangible historical evidence
```

### Alternative User Voices

**As The Seeker (Maria)**:
> "I want to see real evidence of Eucharistic miracles so that I can overcome my skepticism and understand why Catholics believe in the Real Presence."

**As The Devoted Parent (John)**:
> "I want to share amazing miracle stories with my children so that I can make the concept of Real Presence tangible and exciting for them."

**As The RCIA Candidate (David)**:
> "I want to learn about scientifically documented miracles so that I can reconcile my faith with my rational mind as I prepare to enter the Church."

---

## Priority & Estimation

### Priority
- [x] Should Have (Phase 2 - Enhancement)

**Rationale**: While not essential for MVP, this feature provides powerful faith-building content that differentiates our platform and serves multiple personas. The stories are compelling, shareable, and have proven evangelization value.

### Story Points
**Estimate**: 13 points

**Breakdown**:
- Database schema design (MongoDB): 2 points
- Backend API development: 3 points
- Frontend gallery interface: 4 points
- Individual miracle detail pages: 2 points
- Content creation (10 miracles): 8 points (separate from development)
- Testing & refinement: 2 points

**Total Development**: 13 points (1-2 weeks)  
**Content Creation**: 8 points (parallel work by content team)

---

## Acceptance Criteria

### Core Functionality
- [ ] **AC1**: Gallery displays minimum 10 documented Eucharistic miracles
- [ ] **AC2**: Each miracle includes high-quality photo(s) or images of the phenomenon
- [ ] **AC3**: Miracle cards show: title, location, date, brief description (50-100 words), and thumbnail image
- [ ] **AC4**: Clicking a miracle card opens detailed view with full story (5-7 minute read, ~1,200-1,500 words)
- [ ] **AC5**: Gallery supports multiple view modes: grid view (default), list view, and map view
- [ ] **AC6**: Map view shows miracles plotted by location with clickable markers

### Content Quality Requirements
- [ ] **AC7**: Each miracle includes historical documentation and sources cited
- [ ] **AC8**: Scientific evidence and laboratory analysis documented where available
- [ ] **AC9**: Church investigation status clearly noted (approved/recognized by diocese or Vatican)
- [ ] **AC10**: Date ranges specified (e.g., "8th century" or "1996")
- [ ] **AC11**: Location information includes city, country, and current shrine/church name
- [ ] **AC12**: Content reviewed and approved by theological advisor before publication
- [ ] **AC13**: All images have proper copyright clearance and attribution

### User Experience Requirements
- [ ] **AC14**: Filter miracles by: date (century/era), location (continent/country), type (bleeding Host, incorrupt flesh, etc.)
- [ ] **AC15**: Search functionality works across miracle titles, locations, and descriptions
- [ ] **AC16**: Each miracle detail page has "Share" functionality (social media, email, copy link)
- [ ] **AC17**: Related miracles suggested at bottom of each detail page (based on location or type)
- [ ] **AC18**: Reading time estimate displayed for each miracle story
- [ ] **AC19**: Bookmark/save functionality allows users to mark miracles for later reading
- [ ] **AC20**: Print-friendly version available for each miracle story

### Technical Requirements
- [ ] **AC21**: Gallery loads initial view in <2 seconds
- [ ] **AC22**: Images lazy-load as user scrolls
- [ ] **AC23**: Responsive design works on mobile (320px+), tablet (768px+), and desktop (1024px+)
- [ ] **AC24**: Images optimized for web (WebP format with JPEG fallback)
- [ ] **AC25**: Map integration uses performant mapping library (Mapbox or Leaflet)
- [ ] **AC26**: Gallery supports pagination (20 miracles per page) or infinite scroll
- [ ] **AC27**: All images have descriptive alt text for accessibility
- [ ] **AC28**: Keyboard navigation supported for gallery browsing

### Data & Analytics Requirements
- [ ] **AC29**: Track which miracles are most viewed
- [ ] **AC30**: Track average time spent on miracle detail pages
- [ ] **AC31**: Track share button usage and which miracles are shared most
- [ ] **AC32**: Track filter usage to understand user interests

---

## Detailed Requirements

### Required Miracles (Initial 10)

Each miracle must be Church-approved or well-documented:

1. **Lanciano, Italy** (8th century) - Original Eucharistic miracle, flesh and blood still preserved
2. **Buenos Aires, Argentina** (1996) - Archbishop Bergoglio's (future Pope Francis) miracle investigation
3. **Siena, Italy** (1730) - 223 consecrated Hosts remain incorrupt to this day
4. **Santarém, Portugal** (13th century) - Bleeding Host after theft attempt
5. **Amsterdam, Netherlands** (1345) - "Miracle of the Host" survived fire
6. **Sokółka, Poland** (2008) - Host fragment became heart tissue
7. **Legnica, Poland** (2013) - Recent miracle with scientific documentation
8. **Bolsena, Italy** (1263) - Inspired Feast of Corpus Christi
9. **Faverney, France** (1608) - Hosts levitated for 33 hours
10. **Bordeaux, France** (1822) - Host glowed with light during exposition

### Content Structure for Each Miracle

#### Brief Card View (Gallery)
- Title: "[Location], [Country]"
- Subtitle: "The Miracle of [descriptive name]"
- Year/Era: Displayed prominently
- Thumbnail: 400x300px optimized image
- Excerpt: 50-100 word teaser
- Tags: Type, century, status

#### Detailed View (Individual Page)
1. **Hero Section**
   - High-quality featured image (1200x800px)
   - Title, location, date
   - Quick facts sidebar (date, location, type, Church status)

2. **The Story** (~400-600 words)
   - Historical context
   - What happened (narrative)
   - Immediate aftermath
   - Key witnesses

3. **Scientific Evidence** (~200-300 words where applicable)
   - Laboratory analysis results
   - Expert testimony
   - Physical evidence that remains
   - Scientific explanations (or lack thereof)

4. **Church Investigation** (~200-300 words)
   - Who investigated
   - Timeline of investigation
   - Official Church recognition/approval
   - Statements from bishops or Vatican
   - Current status

5. **Legacy & Significance** (~200-300 words)
   - How the miracle impacted faith locally
   - Shrine or devotion that resulted
   - Annual commemorations
   - Theological reflection

6. **Visit Information** (if applicable)
   - Current church/shrine name and address
   - How to visit
   - What you can see today
   - Website links

7. **Sources & Further Reading**
   - Primary sources
   - Church documents
   - Scientific reports
   - Recommended books/articles
   - External links

### Filtering & Organization

**Filter Options**:
- **By Date**: 
  - Early Church (1st-5th century)
  - Medieval (6th-15th century)
  - Modern Era (16th-19th century)
  - Contemporary (20th-21st century)

- **By Location**:
  - Europe (breakdown by country)
  - Americas
  - Asia
  - Africa
  - Oceania

- **By Type**:
  - Bleeding Host
  - Incorrupt Host
  - Host becoming flesh/heart tissue
  - Luminous phenomena
  - Levitation
  - Survival of fire/destruction
  - Other phenomena

- **By Status**:
  - Vatican approved
  - Diocesan approved
  - Under investigation
  - Well-documented (not officially approved)

**Sort Options**:
- Date (oldest first / newest first)
- Alphabetical by location
- Most viewed
- Recently added

---

## Related Personas

### Primary Persona
- [x] **The Lifelong Learner (Patricia)** - Primary beneficiary, seeks depth and evidence

### Secondary Personas
- [x] **The Seeker (Maria)** - Evidence helps overcome skepticism and doubt
- [x] **The Devoted Parent (John)** - Stories are powerful teaching tools for children
- [x] **The RCIA Candidate (David)** - Scientific evidence bridges faith and reason

**Persona-Specific Value**:
- **Patricia**: Satisfies desire for deep, documented evidence and historical knowledge
- **Maria**: Provides tangible proof that makes Real Presence belief more credible
- **John**: Offers amazing stories that capture children's imagination while teaching doctrine
- **David**: Bridges intellectual inquiry with faith through scientific documentation

---

## Dependencies

### Depends On
- [x] **Content Management System**: Must be operational to store and manage miracle content
- [x] **Image CDN Infrastructure**: Required for hosting and serving optimized images
- [x] **MongoDB Setup**: Database schema for flexible miracle documents
- [x] **API Foundation**: RESTful endpoints for content delivery
- [x] **Authentication System**: For bookmark/save functionality (optional, can be phase 2)

### Blocks
- [ ] **User Engagement Features**: Miracle stories will be shared, commented on (future)
- [ ] **Prayer Intention Context**: Users may reference miracles when submitting intentions
- [ ] **Educational Content Cross-links**: Articles on Real Presence can reference specific miracles

### Parallel Work
- **Content Team**: Can begin research and writing miracles while development proceeds
- **Theological Advisor**: Reviews content as it's created
- **Design Team**: Creates visual style guide for gallery and detail pages

---

## Technical Considerations

### Database Schema (MongoDB)

```javascript
// Collection: miracles
{
  _id: ObjectId,
  slug: String,              // URL-friendly identifier: "lanciano-italy-8th-century"
  title: String,             // Display title
  subtitle: String,          // Descriptive subtitle
  
  location: {
    city: String,
    region: String,           // State/Province
    country: String,
    continent: String,
    coordinates: {            // For map view
      lat: Number,
      lng: Number
    },
    currentShrine: {
      name: String,
      address: String,
      website: String
    }
  },
  
  date: {
    year: Number,            // If known
    century: Number,         // If exact year unknown
    era: String,             // "medieval", "modern", etc.
    displayDate: String      // Human-readable: "8th century" or "1996"
  },
  
  type: [String],            // ["bleeding-host", "incorrupt", etc.]
  status: String,            // "vatican-approved", "diocesan-approved", etc.
  
  content: {
    excerpt: String,         // 50-100 words for card view
    story: String,           // Full narrative (Markdown)
    scientificEvidence: String,  // Laboratory findings (Markdown)
    churchInvestigation: String, // Official investigation details
    legacy: String,          // Impact and significance
    visitInfo: String        // How to visit today
  },
  
  media: {
    featuredImage: {
      url: String,
      alt: String,
      caption: String,
      credit: String
    },
    gallery: [{
      url: String,
      alt: String,
      caption: String,
      credit: String
    }]
  },
  
  sources: [{
    type: String,            // "church-document", "scientific-report", "book", etc.
    title: String,
    author: String,
    url: String,
    citation: String
  }],
  
  theologicalReview: {
    reviewed: Boolean,
    reviewedBy: String,      // Theological advisor name
    reviewDate: Date,
    magisteriumRefs: [String],  // CCC references, encyclicals, etc.
    notes: String
  },
  
  metadata: {
    readingTime: Number,     // Estimated minutes
    wordCount: Number,
    language: String,        // "en" (future multilingual)
    author: String,          // Content creator
    lastUpdated: Date,
    published: Boolean
  },
  
  engagement: {
    views: Number,
    shares: Number,
    bookmarks: Number,
    avgTimeOnPage: Number    // Seconds
  },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
  },
  
  relatedMiracles: [ObjectId],  // Suggested related miracles
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes for performance
db.miracles.createIndex({ slug: 1 }, { unique: true });
db.miracles.createIndex({ "location.country": 1 });
db.miracles.createIndex({ "location.continent": 1 });
db.miracles.createIndex({ "date.century": 1 });
db.miracles.createIndex({ "date.year": 1 });
db.miracles.createIndex({ type: 1 });
db.miracles.createIndex({ status: 1 });
db.miracles.createIndex({ "metadata.published": 1 });
db.miracles.createIndex({ "engagement.views": -1 });  // For "most viewed"
db.miracles.createIndex({ "location.coordinates": "2dsphere" });  // Geospatial
```

### API Endpoints

```
GET    /api/v1/miracles
       Query params: page, limit, continent, country, type, status, century, sort
       Returns: Paginated list of miracles (card view data)

GET    /api/v1/miracles/:slug
       Returns: Full miracle details

GET    /api/v1/miracles/map
       Returns: All miracles with coordinates for map view

GET    /api/v1/miracles/search?q={query}
       Full-text search across titles, locations, descriptions

POST   /api/v1/miracles/:slug/bookmark
       Auth required: Bookmark miracle for user

DELETE /api/v1/miracles/:slug/bookmark
       Auth required: Remove bookmark

POST   /api/v1/miracles/:slug/share
       Track share event (analytics)

GET    /api/v1/miracles/:slug/related
       Returns: Related miracles based on location/type
```

### Frontend Components Architecture

```
/components/miracles/
  ├── MiraclesGallery.tsx          # Main gallery container
  ├── MiracleCard.tsx              # Individual card in gallery
  ├── MiracleDetailPage.tsx        # Full miracle view
  ├── MiracleMap.tsx               # Map view with markers
  ├── MiracleFilters.tsx           # Filter sidebar/panel
  ├── MiracleSearch.tsx            # Search interface
  ├── MiracleTimeline.tsx          # Optional timeline view
  └── ShareButtons.tsx             # Social sharing component

/pages/miracles/
  ├── index.tsx                    # Gallery page
  └── [slug].tsx                   # Dynamic miracle detail page
```

### Performance Optimization

**Image Handling**:
- Use Next.js Image component with optimization
- Serve WebP with JPEG fallback
- Implement lazy loading
- Responsive images (multiple sizes)
- CDN delivery

**Caching Strategy**:
- Cache miracle list: 1 hour (frequently accessed)
- Cache individual miracles: 24 hours (content changes rarely)
- Use Redis for API response caching
- Browser caching for static assets

**Database Optimization**:
- Indexes on commonly filtered fields
- Projection to return only needed fields for gallery
- Geospatial index for map queries
- Aggregation pipeline for complex filters

---

## Definition of Done

### Development Checklist
- [ ] Database schema implemented and tested
- [ ] API endpoints created with proper error handling
- [ ] Gallery view displays miracles in grid/list/map modes
- [ ] Filter and search functionality working
- [ ] Individual miracle detail pages render correctly
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Images optimized and loading efficiently
- [ ] Share functionality operational
- [ ] Bookmark/save feature working (if auth ready)
- [ ] Analytics events firing correctly

### Testing Checklist
- [ ] Unit tests written for API endpoints (≥80% coverage)
- [ ] Unit tests for React components
- [ ] Integration tests for filter/search functionality
- [ ] E2E test for browsing gallery and viewing miracle
- [ ] Mobile responsiveness tested on real devices
- [ ] Accessibility tested (screen reader, keyboard navigation)
- [ ] Performance tested (page load time <2s)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Content Checklist
- [ ] Minimum 10 miracles researched and written
- [ ] All sources cited and verified
- [ ] Theological review completed for each miracle
- [ ] Images sourced with proper copyright clearance
- [ ] Alt text written for all images
- [ ] Content proofread and edited
- [ ] SEO metadata added for each miracle

### Documentation Checklist
- [ ] API documentation updated with miracle endpoints
- [ ] Component documentation added
- [ ] Content creation guide written for future miracles
- [ ] Theological review process documented
- [ ] User help article: "Exploring Eucharistic Miracles"

### Deployment Checklist
- [ ] Deployed to staging environment
- [ ] Smoke tests passed on staging
- [ ] Product Owner reviewed and approved on staging
- [ ] Performance metrics reviewed on staging
- [ ] Content loaded and rendering correctly
- [ ] Ready for production deployment

---

## Coordination Requirements

### With Software Architect

**Required Discussions**:
1. **Database Schema Review** (Week 1)
   - Finalize MongoDB schema design
   - Discuss indexing strategy for performance
   - Plan for future multilingual content
   - Geospatial query approach for map view

2. **API Design Review** (Week 1-2)
   - RESTful endpoint structure
   - Pagination strategy (cursor vs offset)
   - Caching approach
   - Error handling patterns

3. **Frontend Architecture** (Week 2)
   - Component structure and reusability
   - State management approach (Zustand for filters?)
   - Image optimization strategy
   - Map library selection (Mapbox vs Leaflet)

4. **Performance & Scalability** (Week 2-3)
   - Lazy loading implementation
   - CDN configuration for images
   - Caching layers (Redis, browser)
   - Future-proofing for 50+ miracles

**Deliverables from Architect**:
- [ ] Technical design document
- [ ] Database schema finalization
- [ ] API contract specifications
- [ ] Component architecture diagram
- [ ] Performance benchmarks and targets

**Questions for Architect**:
- What's our image hosting/CDN solution? (AWS S3? Cloudinary?)
- Should we use server-side rendering (SSR) or static generation (SSG) for miracle pages?
- How should we handle map integration? Self-hosted vs third-party?
- What's our approach to content versioning (if miracles need updates)?

---

### With Project Manager

**Required Discussions**:
1. **Sprint Planning** (Before Sprint Start)
   - Story fits in 2-week sprint with parallel content work
   - Development team capacity verification
   - Content team availability for writing miracles
   - Design resources for gallery UI/UX

2. **Content Timeline Coordination** (Week 1)
   - Align development sprint with content creation schedule
   - Stagger content delivery (5 miracles Week 2, 5 miracles Week 3?)
   - Theological review timeline (allow 3-5 days per review)
   - Image sourcing lead time

3. **Risk Management** (Ongoing)
   - **Risk**: Content creation delays → Mitigation: Start with 5 miracles for MVP
   - **Risk**: Image copyright issues → Mitigation: Prioritize public domain/Creative Commons
   - **Risk**: Theological review bottleneck → Mitigation: Engage advisor early
   - **Risk**: Technical complexity of map view → Mitigation: Map view can be Phase 2.5

4. **Release Planning** (Week 3-4)
   - Feature flag strategy (soft launch to test with subset of users?)
   - Rollout plan (release with 5 miracles, add 5 more the following week?)
   - Marketing/announcement timing
   - User feedback collection plan

**Deliverables for Project Manager**:
- [ ] Updated sprint task breakdown
- [ ] Resource requirements (dev, content, design, theological advisor)
- [ ] Risk register with mitigation strategies
- [ ] Success metrics and monitoring plan

**Questions for Project Manager**:
- Can we secure theological advisor time for 10 miracle reviews over 2-3 weeks?
- Is content team available to write 10 miracles in parallel with development?
- Should we do a phased release (5 miracles first, then 5 more)?
- What's our budget for image licensing if needed?

---

### With Theological Advisor

**Required Consultation**:
1. **Content Guidelines** (Before Writing Begins)
   - Approval of miracle selection list
   - Standards for presenting scientific evidence
   - How to handle Church investigation status (approved vs under review)
   - Balancing wonder with doctrinal accuracy
   - Avoiding sensationalism

2. **Individual Miracle Reviews** (As Content is Written)
   - Theological accuracy check
   - Magisterium references verification
   - Pastoral sensitivity assessment
   - Doctrinal soundness confirmation

3. **Ongoing Guidance**
   - Monthly check-ins on new miracle additions
   - Feedback on user questions/comments about miracles
   - Guidance on disputed or controversial miracles

**Deliverables from Theological Advisor**:
- [ ] Approved list of 10 miracles for initial release
- [ ] Content guidelines document for miracle writing
- [ ] Individual review sign-off for each miracle (10 total)
- [ ] Recommended Magisterium references for each

**Questions for Theological Advisor**:
- Are there any miracles we should avoid due to controversy?
- How should we present miracles still under investigation?
- What Catechism references should we include?
- Should we include miracles from non-Catholic Christian traditions? (e.g., Eastern Orthodox)

---

### With Content Team

**Required Collaboration**:
1. **Content Creation Plan** (Week 1)
   - Assign 10 miracles among content creators
   - Establish research and writing timeline
   - Define content structure and style guide
   - Source images and obtain permissions

2. **Quality Assurance** (Weeks 2-3)
   - Peer review among content team
   - Editorial review for clarity and readability
   - SEO optimization (meta descriptions, keywords)
   - Theological advisor review coordination

**Content Team Deliverables**:
- [ ] 10 miracle stories (1,200-1,500 words each)
- [ ] High-quality images with proper attribution (minimum 2 per miracle)
- [ ] Sources and citations documented
- [ ] SEO metadata for each miracle
- [ ] Content ready for theological review by Week 2

---

### With Design Team

**Required Design Work**:
1. **Gallery Interface Design** (Week 1)
   - Card design (grid and list views)
   - Filter panel design (mobile and desktop)
   - Map view interface
   - Empty states, loading states

2. **Detail Page Design** (Week 1-2)
   - Hero section layout
   - Typography and content hierarchy
   - Image gallery/carousel
   - Share buttons placement
   - Related miracles section
   - Print stylesheet

3. **Mobile Optimization** (Week 2)
   - Responsive breakpoints
   - Touch-friendly interactions
   - Filter panel as drawer/modal
   - Image optimization for mobile

**Design Team Deliverables**:
- [ ] Figma designs for gallery and detail pages
- [ ] Mobile responsive designs
- [ ] Design system components (cards, filters, buttons)
- [ ] Icon set for miracle types
- [ ] Map pin/marker designs
- [ ] Style guide for miracle content

---

## Success Metrics

### User Engagement Metrics
- **Target**: 40% of users who view gallery visit at least 1 miracle detail page
- **Target**: Average 5-7 minutes on miracle detail pages (matches reading time)
- **Target**: 20% of viewers share at least one miracle via social media or email
- **Target**: 15% of viewers bookmark miracles for later reading

### Content Performance Metrics
- **Target**: 4.5+ star rating on content quality (user survey)
- **Target**: 60%+ of users complete reading miracle stories they start
- **Target**: Top 3 most-viewed miracles get 50%+ of total miracle traffic
- **Target**: Miracles appear in top 5 most-viewed content on platform

### Technical Performance Metrics
- **Target**: Gallery loads in <2 seconds (90th percentile)
- **Target**: Miracle detail page loads in <2 seconds
- **Target**: Images fully load within 3 seconds
- **Target**: Zero critical accessibility violations (aXe or Lighthouse)

### Business Impact Metrics
- **Target**: 10% increase in daily active users (compelling content drives retention)
- **Target**: 25% increase in social shares (miracles are inherently shareable)
- **Target**: 5% increase in user session duration (engaging content keeps users longer)
- **Target**: Positive sentiment in user feedback and reviews

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Content creation delays** | High | Medium | Start with 5 miracles for MVP; add 5 more post-launch; prioritize well-documented miracles |
| **Image copyright issues** | Medium | High | Use Creative Commons, public domain, or create original photography; budget for licensing |
| **Theological review bottleneck** | Medium | Medium | Engage advisor early; stagger content for review; have backup reviewers |
| **Map view complexity** | Medium | Low | Make map view Phase 2.5 feature; launch with grid/list views first |
| **Scientific evidence disputes** | Low | High | Only include peer-reviewed evidence; note when Church hasn't officially validated scientific claims |
| **User skepticism** | Medium | Medium | Present evidence objectively; include both scientific and faith perspectives; allow comments/questions |
| **Performance issues with images** | Medium | Medium | Implement aggressive image optimization; use CDN; lazy load everything |
| **Accessibility compliance** | Low | High | Audit with aXe; manual keyboard testing; screen reader testing; include ARIA labels |

---

## Future Enhancements (Out of Scope for This Story)

These features are deliberately excluded but noted for future consideration:

- **User-submitted miracles**: Allow community to suggest miracles for research
- **Video documentaries**: Embed video content about miracles
- **3D virtual tours**: Visit shrines virtually
- **Multilingual support**: Miracles in Spanish, Italian, Polish, etc.
- **Print book generation**: Export miracles as PDF book
- **Educational materials**: Teacher guides and lesson plans based on miracles
- **Miracle of the month**: Featured rotation on homepage
- **Comments and discussions**: Allow users to share reflections on miracles
- **Prayer intentions**: Link miracle to prayer requests (e.g., "St. Tarcisius miracle")

---

## Notes

### Why This Story Matters

Eucharistic miracles are among the most powerful tools for evangelization and faith formation:

1. **Bridge Faith and Reason**: Scientific evidence helps skeptics and seekers overcome intellectual barriers
2. **Deepen Belief**: Even lifelong Catholics are moved by tangible evidence of Real Presence
3. **Educational Value**: Stories are memorable teaching tools for all ages
4. **Shareable Content**: Miracle stories are inherently viral and generate word-of-mouth
5. **Differentiation**: Not many Catholic apps offer comprehensive, well-researched miracle databases

### Content Creation Priority

**Start with these 5 for MVP** (best documented, most impactful):
1. Lanciano (most famous, thoroughly studied)
2. Buenos Aires (modern, Pope Francis connection)
3. Sokółka (recent, clear scientific evidence)
4. Siena (ongoing miracle, visitable today)
5. Bolsena (historical significance, inspired feast)

**Add these 5 in Phase 2** (expand coverage):
6. Santarém (medieval, dramatic story)
7. Amsterdam (survival narrative)
8. Legnica (recent, well-documented)
9. Faverney (unique phenomenon)
10. Bordeaux (luminous miracle)

### Technical Considerations

- **SEO Opportunity**: Miracles generate significant search traffic ("Lanciano miracle," "Eucharistic miracles list")
- **Social Sharing**: Invest in quality Open Graph images for each miracle
- **Mobile-First**: Many users will discover via social media on mobile
- **Accessibility**: Critical for reaching all age groups, especially older adults
- **Performance**: Image-heavy feature requires excellent optimization

### Pastoral Sensitivity

- Present miracles as signs that strengthen faith, not replacements for faith
- Emphasize that Jesus is truly present in EVERY valid Eucharist, not just miracles
- Avoid sensationalism or treating miracles as entertainment
- Balance wonder with reverence
- Note that Church approval is measured and cautious (as it should be)

---

**Created by**: Product Owner  
**For Epic**: [Epic 2: Eucharist Education](../epics/epic-02-eucharist-education.md)  
**Story Points**: 13  
**Priority**: Should Have (Phase 2)  
**Related Personas**: Lifelong Learner (primary), The Seeker, Devoted Parent, RCIA Candidate  
**Version**: 1.0
