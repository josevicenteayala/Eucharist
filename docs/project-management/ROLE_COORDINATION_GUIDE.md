# Role Coordination Guide - PM, PO, SA

**Document Version**: 1.0  
**Date**: October 19, 2025  
**Purpose**: Guide coordination between Project Manager, Product Owner, and Software Architect

---

## Overview

This document provides guidance on how the three key leadership roles - Project Manager (PM), Product Owner (PO), and Software Architect (SA) - should work together effectively to deliver the Eucharist Understanding Platform.

---

## Role Synergy

### The Leadership Triad

```
        Product Owner
        (What & Why)
             |
             |
    Vision & Requirements
             |
             |
    Project Manager ←→ Software Architect
    (When & Who)      (How & Quality)
```

**Product Owner** defines WHAT to build and WHY  
**Software Architect** determines HOW to build it  
**Project Manager** orchestrates WHEN and WHO builds it

---

## Primary Responsibilities

### Product Owner (PO)
**Focus**: Product Vision & User Value

**Key Responsibilities**:
- Define and maintain product vision
- Prioritize product backlog
- Write user stories with acceptance criteria
- Conduct user research and validation
- Accept or reject completed work
- Represent user needs and business value

**Key Artifacts Owned**:
- User Stories Backlog
- Product roadmap
- User personas
- Feature priorities
- Acceptance criteria

**Success Measures**:
- User satisfaction
- Feature adoption
- Product-market fit
- Value delivered

---

### Software Architect (SA)
**Focus**: Technical Excellence & System Quality

**Key Responsibilities**:
- Define system architecture
- Make technology decisions
- Establish coding standards
- Review critical code and designs
- Ensure scalability and security
- Technical mentoring

**Key Artifacts Owned**:
- Architecture Decision Records (ADRs)
- Technical documentation
- System architecture diagrams
- Technology stack definitions
- Code quality standards

**Success Measures**:
- System performance
- Code quality
- Technical debt level
- Scalability achieved
- Security posture

---

### Project Manager (PM)
**Focus**: Delivery & Coordination

**Key Responsibilities**:
- Overall project coordination
- Sprint planning and facilitation
- Team management
- Stakeholder communication
- Risk and issue management
- Budget and timeline tracking

**Key Artifacts Owned**:
- Project Charter
- Sprint Plans
- Risk Register
- Status Reports
- Communication Plan
- Team Roster

**Success Measures**:
- On-time delivery
- Budget adherence
- Team productivity
- Stakeholder satisfaction
- Risk mitigation

---

## Decision-Making Framework

### Who Decides What?

| Decision Type | Primary | Consulted | Informed |
|---------------|---------|-----------|----------|
| **Product Features** | PO | PM, SA, Team | Stakeholders |
| **Feature Priority** | PO | PM | SA, Team |
| **User Stories** | PO | Team | PM, SA |
| **Acceptance Criteria** | PO | Team | PM, SA |
| **Technology Stack** | SA | PM, Team | PO |
| **Architecture** | SA | PM, Team | PO |
| **Code Standards** | SA | Team | PM, PO |
| **Sprint Scope** | PM, PO | SA, Team | Stakeholders |
| **Resource Allocation** | PM | PO, SA | Team |
| **Budget** | PM | PO, SA | Sponsor |
| **Timeline** | PM | PO, SA | Team, Sponsor |
| **Team Hiring** | PM | PO, SA | Sponsor |
| **Risk Response** | PM | PO, SA | Team |

---

## Collaboration Patterns

### Daily Coordination

**Daily Standup** (15 minutes)
- **When**: Every morning, 9:00 AM
- **Who**: Team + PM + PO + SA
- **PM Role**: Facilitate, track blockers
- **PO Role**: Clarify requirements, answer questions
- **SA Role**: Provide technical guidance, identify technical blockers

**Ad-Hoc Questions**
- **Slack**: Quick clarifications
- **Who answers**:
  - Product questions → PO
  - Technical questions → SA
  - Process/timeline questions → PM

---

### Weekly Coordination

**Backlog Grooming** (Wednesday, 1 hour)
- **Who**: PO + Team + PM + SA
- **PO Role**: Lead session, present stories, explain requirements
- **PM Role**: Facilitate, timebox discussions, track dependencies
- **SA Role**: Provide technical input, identify technical risks
- **Outcome**: Refined stories ready for sprint planning

**Weekly Sync** (15 minutes, as needed)
- **Who**: PM + PO + SA only
- **Purpose**: Align on priorities, address emerging issues, coordinate
- **Topics**: 
  - Sprint progress vs. goals
  - Upcoming priorities
  - Team concerns
  - Stakeholder feedback
  - Risk updates

---

### Bi-Weekly Coordination (Sprint Ceremonies)

**Sprint Planning** (Monday, 2 hours)
- **PO Role**: 
  - Present sprint goal
  - Prioritize stories
  - Clarify acceptance criteria
  - Answer functional questions
- **SA Role**:
  - Provide technical input
  - Identify technical dependencies
  - Suggest approach for complex items
  - Estimate technical effort
- **PM Role**:
  - Facilitate meeting
  - Ensure time management
  - Document commitments
  - Identify risks and dependencies
  - Confirm team capacity

**Sprint Review** (Friday, 1 hour)
- **PO Role**:
  - Evaluate completed work against acceptance criteria
  - Accept or reject stories
  - Provide feedback
  - Demo features to stakeholders
- **SA Role**:
  - Present technical achievements
  - Discuss architecture decisions
  - Highlight technical debt addressed
- **PM Role**:
  - Facilitate demo
  - Present metrics (velocity, completion)
  - Gather stakeholder feedback
  - Preview next sprint

**Sprint Retrospective** (Friday, 1 hour)
- **All Roles**: Equal participants
- **PM Role**: Facilitate
- **Topics**: What went well, what to improve, action items
- **Outcome**: Concrete improvements for next sprint

---

### Monthly Coordination

**Architecture Review** (As needed, 1-2 hours)
- **Who**: SA + Team + PM + PO (optional)
- **Purpose**: Review major architecture decisions
- **SA Role**: Lead discussion
- **PM Role**: Document decisions, track action items
- **PO Role**: Provide product context
- **Outcome**: ADR created, consensus reached

**Roadmap Review** (First week of month, 1 hour)
- **Who**: PO + PM + SA
- **Purpose**: Review and adjust 3-month roadmap
- **PO Role**: Lead discussion, propose changes
- **SA Role**: Assess technical feasibility
- **PM Role**: Assess timeline and resources
- **Outcome**: Updated roadmap

**Risk & Metrics Review** (Last week of month, 30 minutes)
- **Who**: PM + PO + SA
- **Purpose**: Review project health
- **PM Role**: Present risks and metrics
- **PO Role**: Discuss user/product concerns
- **SA Role**: Discuss technical concerns
- **Outcome**: Risk mitigation plans updated

---

## Communication Protocols

### When to Involve Each Role

#### Involve Product Owner When:
- Defining new features
- Clarifying user requirements
- Prioritizing work
- Making trade-offs between features
- User research findings
- Scope change discussions
- Accepting completed work

#### Involve Software Architect When:
- Making technology decisions
- Designing system architecture
- Addressing performance issues
- Security concerns
- Scalability planning
- Complex technical implementations
- Code quality issues
- Technical debt decisions

#### Involve Project Manager When:
- Timeline concerns
- Resource allocation issues
- Team conflicts or concerns
- Budget questions
- Stakeholder communication needed
- Risk escalation
- Process improvement suggestions
- Cross-team dependencies

---

## Conflict Resolution

### Disagreement Types & Resolution

#### 1. Feature vs. Technical Debt
**Conflict**: PO wants features, SA wants to address technical debt

**Resolution Process**:
1. SA presents technical debt impact (quantify risk and future cost)
2. PO presents feature value (user impact and business value)
3. PM facilitates trade-off discussion
4. **Decision Rule**: Balance 70% features, 30% technical work
5. **Escalation**: If can't agree, escalate to Project Sponsor

#### 2. Timeline vs. Quality
**Conflict**: PM has timeline pressure, SA wants to maintain quality

**Resolution Process**:
1. SA defines "done" criteria and quality non-negotiables
2. PM presents timeline constraints and impacts
3. Identify what can be de-scoped (with PO)
4. **Decision Rule**: Never compromise security or data integrity
5. **Escalation**: If deadline immovable, escalate to Sponsor for scope reduction

#### 3. Scope vs. Resources
**Conflict**: PO wants more features, PM has limited resources

**Resolution Process**:
1. PO prioritizes features using MoSCoW method
2. PM presents team capacity reality
3. SA provides technical effort estimates
4. **Decision Rule**: Commit only to what team can sustainably deliver
5. **Escalation**: If more resources needed, business case to Sponsor

#### 4. User Need vs. Technical Complexity
**Conflict**: PO identifies user need, SA says it's too complex

**Resolution Process**:
1. PO clarifies the user problem (not the solution)
2. SA proposes alternative technical approaches
3. Team brainstorms simpler solutions
4. **Decision Rule**: Find the simplest solution that solves the problem
5. **Escalation**: Consider external expert consultation if truly novel

---

## Escalation Matrix

| Issue Type | First Contact | If Unresolved | Final Escalation |
|------------|---------------|---------------|------------------|
| Feature Priority | PO | PM + PO + SA | Project Sponsor |
| Technical Approach | SA | PM + PO + SA | External Advisor |
| Timeline Slip | PM | PM + PO + SA | Project Sponsor |
| Team Performance | PM | PM + PO + SA | HR/Leadership |
| Budget Overrun | PM | PM + Sponsor | Funding Committee |
| Theological Content | PO | Theological Advisor | Diocese Authority |
| Security Issue | SA | PM + SA | External Security Expert |

---

## Meeting Cadence Summary

### Daily
- **9:00 AM**: Team Standup (15 min) - All roles

### Weekly
- **Wednesday 2:00 PM**: Backlog Grooming (1 hour) - All roles + Team
- **As needed**: PM-PO-SA Sync (15 min) - Leadership only

### Bi-Weekly (Sprint Boundaries)
- **Monday 10:00 AM**: Sprint Planning (2 hours) - All roles + Team
- **Friday 2:00 PM**: Sprint Review (1 hour) - All roles + Team + Stakeholders
- **Friday 3:30 PM**: Sprint Retrospective (1 hour) - All roles + Team

### Monthly
- **First Week**: Roadmap Review (1 hour) - PO + PM + SA
- **Last Week**: Risk & Metrics Review (30 min) - PM + PO + SA
- **As needed**: Architecture Review - SA + Team + PM

---

## Shared Responsibilities

### All Three Roles Share:

1. **Team Health**: All monitor and support team morale and productivity
2. **Quality**: All advocate for sustainable quality standards
3. **User Focus**: All champion user needs in decisions
4. **Mission**: All ensure work serves the higher mission
5. **Transparency**: All communicate openly and honestly
6. **Continuous Improvement**: All seek to improve processes and outcomes

---

## Success Patterns

### What Works Well

1. **Regular Communication**: Daily touchpoints prevent misalignment
2. **Mutual Respect**: Each role trusts the others' expertise
3. **Clear Boundaries**: Knowing who owns what decision
4. **Collaborative Spirit**: Working together, not in silos
5. **User-Centric**: All decisions filtered through user value
6. **Data-Driven**: Using metrics to guide decisions
7. **Transparency**: Open about challenges and trade-offs
8. **Flexibility**: Adapting as we learn

### Anti-Patterns to Avoid

1. **Solo Decision-Making**: Making decisions without consultation
2. **Blame Culture**: Pointing fingers instead of solving problems
3. **Scope Creep**: PO adding work without PM/SA input
4. **Technical Ivory Tower**: SA making decisions without user context
5. **Micromanagement**: PM dictating how team works
6. **Rigid Process**: Process for process sake, not value
7. **Poor Communication**: Assuming others know what you know
8. **Hero Culture**: One person doing everything, team not empowered

---

## Onboarding New Leaders

### When a New PM/PO/SA Joins

**First Week**:
- [ ] Read all role documentation
- [ ] 1-on-1 with each of the other two leadership roles
- [ ] Review Project Charter
- [ ] Review current Sprint Plan
- [ ] Attend all ceremonies as observer
- [ ] Review recent sprint reports and retrospective notes

**Second Week**:
- [ ] Shadow predecessor (if handoff) or peer
- [ ] Begin participating in ceremonies
- [ ] Meet with team members 1-on-1
- [ ] Review backlog/architecture/risks (depending on role)
- [ ] Ask lots of questions

**Third Week**:
- [ ] Take increasing ownership of role
- [ ] Lead first ceremony or meeting
- [ ] Make first decisions
- [ ] Provide first artifacts

**30 Day Check-in**:
- Meeting with other leadership roles
- Feedback on onboarding
- Clarify any confusion
- Adjust working agreements if needed

---

## Tools for Collaboration

### Shared Tools
- **Slack**: Daily communication
- **GitHub**: Code, issues, project board, documentation
- **Zoom**: Video meetings
- **Shared Calendar**: All meetings visible to all

### Role-Specific Views
- **PM**: Project board (timeline view), risk register, budget tracker
- **PO**: Backlog (priority view), user research data, analytics
- **SA**: Architecture diagrams, ADRs, code quality metrics

---

## Key Success Factors

1. **Trust**: Each role trusts the others' expertise
2. **Communication**: Over-communicate rather than under
3. **Alignment**: Regularly check that we're aligned on goals
4. **Respect**: Value each person's time and perspective
5. **Flexibility**: Adapt processes as we learn what works
6. **Mission Focus**: Keep the ultimate mission in sight
7. **Servant Leadership**: Serve the team and users, not ourselves
8. **Continuous Learning**: Always improving our collaboration

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-19 | Project Manager | Initial coordination guide |

---

*"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken."* - Ecclesiastes 4:12

**Ad Majorem Dei Gloriam** ✝️
