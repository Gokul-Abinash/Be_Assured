# Be Assured: AI-Powered Parametric Insurance for Gig Workers
Team: BYZANTINE
> **Guidewire DEVTrails 2026 | Phase 1 Submission**  
> Protecting quick-commerce delivery partners from income loss caused by uncontrollable external disruptions

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Scope and Assumptions](#2-scope-and-assumptions)
3. [Coverage Triggers](#3-coverage-triggers)
4. [Stakeholders](#4-stakeholders)
5. [Identity and KYC](#5-identity-and-kyc)
6. [Enrollment Eligibility](#6-enrollment-eligibility)
7. [Geographic Model](#7-geographic-model)
8. [Temporal Model](#8-temporal-model)
9. [Policy Plan Structure](#9-policy-plan-structure)
10. [Mathematical and Financial Model](#10-mathematical-and-financial-model)
11. [Claim Model](#11-claim-model)
12. [Termination Policy](#12-termination-policy)
13. [Adversarial Defense and Anti-Spoofing Strategy](#13-adversarial-defense-and-anti-spoofing-strategy)
14. [Analytics Dashboard](#14-analytics-dashboard)
15. [Technology Stack and APIs](#15-technology-stack-and-apis)
16. [Feasibility and Scalability](#16-feasibility-and-scalability)
17. [Future Integrations and Enhancements](#17-future-integrations-and-enhancements)
18. [System Architecture](#18-system-architecture)

 
## 1. Problem Statement

&emsp;India ranks as the second largest gig economy globally. As of 2026, approximately 5.2 million gig workers are active in the e-commerce and quick-commerce industry. Nearly 40% earn less than ₹15,000 monthly. Classified as platform partners rather than employees, despite recent labour laws aimed at providing benefits, they have no access to health insurance, provident funds, or paid leave. 

&emsp;External disruptions such as extreme weather, pollution, platform outages, and civil restrictions can essentially reduce their working hours, daily earnings and have no income protection against these uncontrollable events with **no existing compensation mechanism.** 

&emsp;“Be Assured” addresses this gap by introducing an **AI-enabled parametric insurance platform** that automatically detects such disruptions, estimates income loss, and processes payouts with minimal manual intervention, ensuring a **sustainable, profit-oriented model for the insurance provider through dynamic pricing, controlled payouts, and risk-adjusted premium calculations.**


---

## 2. Scope and Assumptions

### Persona

Quick-commerce delivery partners across platforms including Zepto, Blinkit, Swiggy Instamart, BigBasket Now, Flipkart Minutes, and Amazon Fresh. A single worker may be registered on multiple platforms simultaneously and is unified under one Be Assured identity.
  

### Coverage

Strictly income loss due to external uncontrollable disruptions.

**Explicitly excluded:** health events, accidents, vehicle damage, and personal voluntary absence.

### Platform Choice — Why PWA

Be Assured is built as a **Progressive Web Application** accessible via any mobile browser. This choice was deliberate:

- No app store approval delays or separate iOS/Android codebases required within the six-week timeline
- Cross-platform compatibility — works on any smartphone browser without installation
- Platform-agnostic — functions independently of any delivery platform integration
- Target users are already mobile-browser-literate from using UPI apps and platform partner portals

Workers add the PWA to their home screen for a native app-like full-screen experience.

### Communication Channels

- **SMS** is the primary channel — network-independent, works on any phone, critical because connectivity disruption often accompanies the same events that trigger claims
- **Push Notifications** via Web Push API serve as a secondary channel for Android Chrome and iOS Safari 16.4+ users
- **WhatsApp Business API** is a planned Phase 3 enhancement for richer messaging

### Policy Cycle

Monday 12:00 AM to Sunday 11:59 PM IST — all premiums, coverage resets, and score recalculations operate on this weekly boundary.

---
## 3. Coverage Triggers

### Environmental

| Trigger | Threshold | Data Source |
|---|---|---|
| Heavy Rainfall | > 50 mm / 3 hrs | OpenWeatherMap, IMD |
| Extreme Heat | > 42°C sustained 4+ hrs | OpenWeatherMap |
| Air Pollution | AQI > 300 | AQICN, IMD |
| Floods / Cyclones | Active disaster alert | GDACS RSS Feed |

### Social

| Trigger | Validation | Data Source |
|---|---|---|
| Government Curfew / Section 144 | Admin confirmed | News API |
| Local Strikes | Admin confirmed | News API |
| Sudden Zone Closures | Admin confirmed | Admin portal |

> Social triggers require admin confirmation before claims generate, due to high false-positive risk in automated news parsing.

### Technical

| Trigger | Threshold | Data Source |
|---|---|---|
| Platform Downtime | > 30 min/day (unscheduled) | Platform API / Mock |
| Order Volume Drop | > 50% of zone rolling average | Order trend data |

> Scheduled maintenance windows are excluded. Phase 1 uses simulated signals where live platform APIs are unavailable.


---

## 4. Stakeholders

**Admin — Insurance Provider**
Monitors platform financial health, validates social disruption events, reviews flagged claims, and manages zone configurations and threshold settings.

**User — Gig Worker**
Enrolls on the platform, pays a weekly premium, and receives payouts when disruption triggers fire. Standard claims require the worker to raise a ticket upon receiving a disruption alert; automated processing handles everything thereafter.

---

## 5. Identity and KYC

- **Mandatory:** Aadhaar number, PAN number, and mobile number verified via OTP
- Mobile number is the **unique account identifier** — one number maps to exactly one Be Assured account regardless of how many delivery platforms the worker operates on
- Face recognition via UIDAI eKYC API is planned for Phase 3

---

## 6. Enrollment Eligibility

Workers must satisfy all three conditions before enrolling:

1. **Working history:** Minimum one month of active delivery history on any supported platform, equivalent to 22 working days, verified through the declared Platform Partner ID

2. **Minimum weekly income thresholds:**
   - Basic Plan — ₹3,500/week
   - Standard Plan — ₹6,000/week
   - Pro Plan — ₹8,000/week

3. **Cooling period:** Two paid premiums must complete before the first payout becomes eligible, preventing enrollment immediately before a known weather event purely to claim a payout

---

## 7. Geographic Model

Cities are divided into predefined delivery zones, each with a unique zone ID, human-readable name, latitude-longitude bounding box, geographic risk classification (Low / Medium / High), and metadata on proximity to water bodies and drainage quality.

- Workers register **one primary zone** and up to **two secondary zones**
- Zone changes take effect after a **mandatory 7-day processing period** to prevent pre-event gaming
- Zone definitions are set at system setup and reviewed quarterly

---

## 8. Temporal Model

- **Premium deduction** occurs on the worker's selected day at 11:00 AM via autopay
- **First retry** on failed deduction after 2 hours; **second failure halts the policy** and the worker is notified via SMS
- Repeated payment failures reduce a platform trust score analogous to CIBIL scoring; workers below a defined threshold may be suspended from enrollment
- **All weekly coverage limits, risk score recalculations, and expected payout derivations reset and rerun every Sunday night** for the following week

---

## 9. Policy Plan Structure

Be Assured does **not** automatically assign a plan. Workers choose freely. The platform displays a data-driven recommendation based on declared working hours and income range, but the final selection belongs entirely to the worker. Plan changes take effect from the next Monday cycle.

| Parameter | Basic Plan | Standard Plan | Pro Plan |
|---|---|---|---|
| Worker type | Part-time | Full-time | Full-time peak |
| Daily working hours | 4 hrs | 8 hrs | 12 hrs |
| Weekly income (W) | ₹3,500 | ₹6,000 | ₹8,000 |
| Base premium per week | ₹235 | ₹220 | ₹245 |
| Coverage multiplier (k) | 5 | 6 | 7 |
| Max weekly payout cap | ₹800 | ₹1,400 | ₹2,200 |
| Max KPI discount | 30% | 30% | 30% |
| Target profit margin | 15% | 15% | 15% |

> The Standard Plan base premium is intentionally slightly lower than the Basic Plan because full-time workers have more predictable behavioral patterns, reducing actuarial uncertainty.

---

## 10. Mathematical and Financial Model

The weights are considered as the parameters and are statically defined through **Acturial observations** currently, but will be tuned to optimal hyper parameters using the **neural network architecture** in the upcoming refinements.


### KPI Score (K) — Worker Performance Indicator

```
A  = Acceptance Rate / 100
C  = 1 − (Cancellation Rate / 100)
R  = Customer Rating / 5          [default 0.60 if unrated]
I  = 1 − Operational Wait Time Rate

K  = (0.30 × A) + (0.25 × C) + (0.25 × R) + (0.20 × I)
```

K ranges from 0 to 1. Higher K → better worker → larger premium discount → higher claim coverage ratio.

### Payment Consistency Score (PCS)

```
PCS = Weeks Paid On Time ÷ Total Enrolled Weeks
```

Starts at 1.0 for new workers. Decreases only on missed premium deductions. Recovers as consistent payment history builds.

### Fraud Penalty

```
F_p  = Confirmed Fraudulent Claims in Last 12 Weeks ÷ 12       [range: 0 to 1]
FDM  = max(1 − 2.0 × F_p,  0)                                  [Fraud Discount Multiplier]
```

Only confirmed fraud counts — genuine workers caught by false flags during bad weather are unaffected.

### Dynamic Risk Score (RS)

```
RS = (0.40 × Zone Risk) + (0.20 × Platform Risk) + (0.25 × Activity Risk) + (0.15 × Income Risk)
```

**Sub-component formulas:**

```
Zone Risk     = (0.30 × Rain) + (0.20 × Flood) + (0.15 × Temp) + (0.15 × AQI) + (0.20 × Disruptions)
Platform Risk = (0.50 × Downtime) + (0.50 × Order Drop)
Activity Risk = (0.35 × Active Time) + (0.35 × Acceptance Rate) + (0.30 × (1 − Idle Time))
Income Risk   = (0.50 × Weekly Income normalised) + (0.30 × Earnings Per Hour normalised) + (0.20 × Stability)
```

**Component weights and rationale:**

| Component | Weight | Rationale |
|---|---|---|
| Zone Risk | 40% | Directly and objectively prevents work — highest real-world impact |
| Activity Risk | 25% | Captures individual exposure based on when and how much the worker works |
| Platform Risk | 20% | Important but less frequent than environmental disruptions |
| Income Risk | 15% | Measures financial magnitude of potential loss, not probability |

### Expected Weekly Payout (EWP)

After the mandatory 1-month observation period, all terms are dynamically retrieved from the database. Static platform-wide assumptions are used as initial values during the first month.

```
EWP = H × HDe × APF × WEF × AWO
```

| Term | Formula | Floor / Fallback |
|---|---|---|
| H (Hourly Rate) | W ÷ (Daily Hours × 6) | Minimum declared income midpoint |
| HDe (Hours Disrupted Per Event) | Sum(overlap hours) ÷ Observed events | Floor: 1.0 hour |
| APF (Average Payout Fraction) | Sum(Payout% × Trigger Freq) ÷ Total Events | Fallback: 0.60 if no zone events |
| WEF (Weekly Event Frequency) | (0.60 × Recent obs ÷ 4) + (0.40 × Historical ÷ 52) | Floor: 0.10 events/week |
| AWO (Active Window Overlap) | Worker active hours ÷ Total disruption hours | Fallback: Daily Hours ÷ 16 if no data |

### Base Premium — Actuarial Derivation (Static)

```
Base Premium = (EWP + Operating Cost) ÷ ((1 − Profit Margin) × (1 − Average KPI Discount))
```

- Operating cost = ₹18 per worker per week
- Profit margin = 15%
- Average KPI discount = 0.216

**Derived static base premiums: ₹235 (Basic) | ₹220 (Standard) | ₹245 (Pro)**

These values do not change week to week. All dynamic computation builds on top of them.

### Discount Calculation

```
D_perf  = K × 0.25
D_pay   = PCS × 0.10
D_raw   = min(D_perf + D_pay,  0.30)
D       = D_raw × FDM
```

Maximum 30% discount — achieved only by workers with near-perfect KPI and consistent payment history. The FDM reduces or eliminates this discount for workers with confirmed fraud attempts.

### Final Weekly Premium

```
P = Base Premium × (1 + RS) × (1 − D)
```

Recalculated every Sunday night. Dynamic by design — the same worker may pay a different amount each week based on evolving risk environment and behavior.

### Coverage Pool

```
C_max  = k × P                                    [k is plan-specific: 5, 6, or 7]
T_s    = (0.70 × K) + (0.30 × PCS)               [Trust Score]
C_eff  = min(C_max × T_s,  Plan Payout Cap)
```

### Payout Percentages Per Trigger Type

| Trigger | Payout % | Justification |
|---|---|---|
| Heavy Rainfall | 60% | Partial-day disruption typical; high frequency |
| Extreme Heat | 40% | Workers can adapt timing; partial impact |
| Air Pollution AQI > 300 | 50% | Full outdoor work restriction applies |
| Platform Outage | 70% | Complete income stoppage for affected workers |
| Local Restriction | 80% | Highest certainty — forced full zone shutdown |

### Claim Calculation

```
L      = (W ÷ 7) × d                 [d = disrupted days as decimal for partial days]
CR     = 0.50 + (0.30 × K)           [Coverage Ratio: floor 50%, ceiling 80%]
RA     = 1 − (0.50 × RS)             [Risk Adjustment: max-risk worker receives 50%]
C_raw  = L × CR × RA
C      = min(C_raw,  C_eff − previous claims this week)
```

### Stakeholder Benefit Summary

**Worker:** Pays a small weekly premium and receives effective coverage worth 5–7× that amount. KPI discount rewards reliable behavior. Coverage Ratio guarantees a minimum 50% compensation floor for any enrolled worker experiencing a genuine disruption.

**Insurer:** 15% profit margin is structurally embedded in every base premium. High-risk workers pay proportionally more through the RS multiplier. Trust Score and Fraud Penalty automatically reduce payout exposure for unreliable workers. Reserve Fund of six weeks' expected payouts provides a liquidity buffer with the retained portion earning passive investment returns.

---

## 11. Claim Model

### Primary Flow — Worker-Initiated with Fully Automated Processing

When a DisruptionEvent threshold is crossed in a worker's registered zone, Be Assured sends an immediate SMS and push notification alerting the worker. The worker opens the PWA and submits a claim ticket in under 30 seconds. The ticket auto-captures GPS location and links to the active DisruptionEvent. A brief description and optional delivery app screenshot may be added.

Upon submission, the system immediately and automatically:

1. Runs the full fraud detection pipeline
2. Calculates the payout amount using the claim formula
3. Routes the claim based on the resulting fraud score

**Routing outcomes:**

| Fraud Score | Action |
|---|---|
| < 0.15 | Auto-approved and paid within 15 minutes — no human involvement |
| 0.15 – 0.49 | 24-hour admin review queue — worker notified via SMS |
| 0.50 – 0.74 | Auto-rejected — plain-language SMS reason + 72-hour appeal window |
| > 0.75 | Rejected + account suspended pending investigation |

Workers who did not raise a ticket for a given event receive no payout for that event.

### Manual Worker Interaction — Required Only In Three Cases

1. **Appeal** against a rejected claim within the 72-hour window
2. **Premium payment clearance** after a policy halt
3. **Fraud flag clarification** when the system requests verification

### AI/ML Integration in Claim Processing

**Context Extraction Model:** Converts unstructured claim descriptions into structured reason classes (environmental, social, technical) for standardised downstream processing.

**Similarity Clustering Model:** Groups semantically similar claims into clusters using contextual similarity, identifying collective disruption patterns across the worker pool.

**Response Generation Model:** Generates clear, user-friendly explanations for claim outcomes, particularly rejections, improving transparency.

### Duplicate Claim Prevention

Each claim is linked to a unique DisruptionEvent ID — one claim per worker per event, enforced at the database constraint level. Near-duplicate re-submissions are caught using **cosine similarity on claim feature vectors** with a threshold of 0.85, routing matches to review. Weekly effective coverage ceiling provides an absolute financial cap regardless of claim count.

---

## 12. Termination Policy

- Halted policies have a **30-day window** to resume or formally terminate
- **On termination:** Premiums paid are non-refundable. A fixed goodwill payout capped at the plan's maximum weekly payout is issued from the liquidity reserve as exit compensation
- **On resumption:** Risk scores and premiums are recalculated from the following Monday
- **Platform shutdown case:** Workers registered solely on a platform that ceases operations receive a one-time compensation equivalent to two weeks of average payout before the policy is closed

---

## 13. Adversarial Defense and Anti-Spoofing Strategy

### The Threat

A coordinated syndicate of 500 delivery workers used GPS-spoofing applications to fake their locations inside active disruption zones while remaining at home, triggering mass false payouts and draining the platform's liquidity pool. **Simple GPS coordinate verification is officially obsolete.**

### The Differentiation — Genuine Worker vs Bad Actor

A genuinely stranded delivery partner shows a specific behavioral signature: active order acceptance before the disruption, an abrupt drop to zero when the event hits, GPS placing them within the zone, and an IP address resolving to the same city. A GPS spoofer shows the opposite: no prior delivery activity, no movement, a GPS-IP city mismatch, and in coordinated attacks, identical patterns across multiple accounts firing simultaneously.

### Defense Architecture — Six Layered Signals

No single signal can be independently spoofed without creating detectable contradictions in the others.

**1. GPS–IP Cross-Validation**
Compares GPS-reported zone against IP geolocation from the device's API calls. A spoofer using a VPN shows a GPS-IP city mismatch, immediately flagged. Known VPN and proxy IP ranges are maintained in a continuously updated blocklist.

**2. Blink Detection**
Analyzes consecutive GPS pings for physically impossible transitions.

```
Implied Speed = Distance(ping N, ping N+1) ÷ Time elapsed
Flag if Implied Speed > 150 km/h
```

**3. Travel Feasibility Check**
Verifies movement between locations is physically achievable using straight-line distance at a maximum realistic urban speed of 40 km/h.

**4. Historical Baseline Deviation**
Builds a behavioral profile during the 1-month observation period. Claims outside established zone history, active hours, or movement patterns are flagged. Activates from the second enrollment month onward.

**5. Activity Consistency Check**
Verifies genuine delivery activity in the 2 hours before the disruption. Zero prior order activity and zero movement is the spoofer signature. An abrupt drop from active delivery to stationary is the genuine disruption signature.

**6. Syndicate Cluster Detection**
- More than 15 claims for the same event within 30 minutes → all held for review
- Matching device fingerprints across accounts → SHARED_DEVICE flag
- Zone enrollment spike > 3× 30-day average in 72 hours before a predicted event → 21-day extended review for all new zone enrollees

### Data Points Analyzed Beyond GPS

| Signal | What It Detects |
|---|---|
| IP geolocation | City-level location independent of GPS |
| Device fingerprint hash | Shared devices across multiple accounts |
| Pre-disruption order logs | Whether worker was genuinely active |
| KPI velocity | Sudden KPI spike before claim — gaming the discount |
| Claim batch timing | Coordinated simultaneous submissions |
| Zone enrollment rate | Pre-event mass enrollment by a syndicate |

### UX Balance — Protecting Honest Workers

Flagged claims are **never auto-rejected as a first response** for ambiguous cases. Genuine workers experiencing network drops in bad weather are protected through:

- GPS signal gaps ≤ 15 minutes are tolerated and do not trigger blink detection
- Under Review status (not rejection) for fraud scores 0.15–0.49, with a 24-hour human review SLA
- 72-hour appeal window for all rejections with a simple in-app ticket process
- Workers with a long clean enrollment history receive more lenient fraud score weighting

### Phase Scope

Phase 1 implements GPS-IP cross-validation, blink detection, travel feasibility, activity consistency, and syndicate cluster detection on the web PWA. Cell tower triangulation, Wi-Fi SSID fingerprinting, and road network route validation are Phase 3 native app capabilities.

---

## 14. Analytics Dashboard

### Admin View

- **Worker Overview:** Total active workers, KPI distribution, plan segmentation
- **Risk Monitoring:** Zone-wise risk heatmap, risk score trends, external risk breakdown
- **Financial Metrics:** Premiums collected, claims paid, loss ratio, profit trends
- **Claim Analytics:** Claim frequency by trigger type, coverage cap utilisation
- **Fraud Monitoring:** Suspicious activity flags, abnormal claim patterns, payment defaults
- **Real-Time Panel:** Live disruptions, active claims, affected zones, next-week predictive outlook

### Worker View

- **Policy Status:** Current plan, premium due, active/halted indicator
- **Performance Metrics:** Acceptance rate, cancellation rate, customer rating, KPI score
- **Premium Breakdown:** Base premium, risk adjustment, KPI discount, final payable amount
- **Coverage Summary:** Risk score, trust score, weekly coverage remaining
- **Claims Section:** Claim history, current claim status, payouts received
- **Alerts:** Disruption alerts for registered zones, payment reminders

---

## 15. Technology Stack and APIs

### Core Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React JS (PWA) | Component-driven, single codebase for worker and admin, service worker for offline capability |
| Backend | FastAPI (Python) | Native Python ML ecosystem, auto-generated OpenAPI docs, high throughput |
| Scheduler | APScheduler (within FastAPI) | Hourly monitoring loop, Sunday night recalculation, Monday premium deduction jobs |
| Database | SQLite → PostgreSQL | Zero-config for Phase 1; PostgreSQL-compatible schema for seamless production migration |
| Payments | Razorpay (test mode) | Payout API for UPI disbursements, Subscription API for weekly autopay |
| Payments (backup) | PayPal Sandbox | Secondary fallback for demo purposes |

### External APIs

| API | Purpose | Reference |
|---|---|---|
| OpenWeatherMap | Hourly rainfall, temperature, weather conditions | `api.openweathermap.org/data/2.5/weather` |
| Tomorrow.io | 7-day hyperlocal forecast for admin predictive panel | `api.tomorrow.io/v4/weather/forecast` |
| IMD (India Meteorological Department) | Authoritative Indian weather and severe weather alerts | `mausam.imd.gov.in` |
| GDACS RSS Feed | Cyclones, floods, earthquake disaster alerts | `gdacs.org/xml/rss.xml` |
| AQICN / IMD | Real-time AQI per city | AQICN API |
| UIDAI eKYC | Aadhaar-based identity verification | `uidai.gov.in` developer section |
| OpenStreetMap Nominatim | Address to coordinate conversion for zone assignment | `nominatim.openstreetmap.org/search` |

---

## 16. Feasibility and Scalability

The FastAPI backend is stateless and horizontally scalable. The hourly monitoring loop queries zone-level data rather than individual worker records, meaning computational cost scales with monitored zones — not enrolled workers. Adding 10,000 workers to an already-monitored city adds zero monitoring overhead.

The Sunday night risk recalculation processes each worker in under 100 milliseconds. At 10,000 workers, the full batch completes in under 17 minutes. At one million workers, distributed processing is the planned upgrade point.

The actuarial model is self-correcting at scale. The 15% embedded profit margin means financial stability improves as volume increases because operational costs grow sub-linearly while premium income grows linearly. The Reserve Fund of six weeks' expected payouts provides a seasonal buffer, backed by a reinsurance layer for catastrophic event exposure.

---

## 17. Future Integrations and Enhancements

**App Plugin Integration:** Future versions will integrate directly within existing quick-commerce partner apps (Zepto, Blinkit) as an embedded module, enabling verified income data, real-time order logs, and elimination of self-declared inputs. Requires formal platform partnership agreements and IRDAI sandbox approval.

**Native App (Phase 3):** A Flutter or React Native app enables cell tower ID collection, Wi-Fi SSID fingerprinting, and background GPS tracking — closing the remaining fraud detection gaps present in the web PWA's location signal layer.

**IRDAI Regulatory Engagement:** Operating a live insurance product in India requires an IRDAI licence or licensed insurer partnership. The IRDAI Regulatory Sandbox for insurtechs allows limited pilot operation before full licensing.

**WhatsApp Business API:** Real-time disruption alerts, claim notifications, and policy updates for workers more comfortable with messaging than browser notifications.

**UIDAI Face Recognition:** eKYC face verification for stronger identity assurance at onboarding, planned for Phase 3.

**OCR-Based Income Verification:** Workers upload earnings screenshots from their delivery app. An OCR pipeline extracts weekly payout figures and validates them against declared income ranges — document-backed verification without requiring platform API cooperation.

**Seasonal Worker Tier:** A fourth plan for peak-season workers (Diwali, IPL, summer months) with a two-week minimum enrollment period and higher base premium to compensate for compressed risk assessment.

**Advanced Intelligence:** Fraud graph detection using network analysis across linked accounts, personalized risk scoring from accumulated behavioral history, and predictive disruption modeling trained on zone-level event data.

---

## 18. System Architecture

![Onboarding Flow](docs/onboarding.svg)

![Claim Ticket Processing](docs/ticket-processing.svg)

![Payment Flow](docs/payments.svg)

---

> **Be Assured** — *Because every delivery partner deserves a safety net.*  
> Team: BYZANTINE
> Guidewire DEVTrails 2026 | Phase 1 — Ideation and Foundation
