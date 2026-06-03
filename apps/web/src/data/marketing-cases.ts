// Lanceflows case study data — generated from Software_Engineering_AI_Case_Studies.json
export const CASE_DATA = [
  {
    "id": "medplum-fhir",
    "title": "Medplum Compliance & EHR Patient Portal",
    "liveUrl": "https://www.medplum.com",
    "category": "Healthcare & Medical Software",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Architecture & Consulting"
    ],
    "description": "An API-first, developer-friendly FHIR (Fast Healthcare Interoperability Resources) clinical platform used to build next-generation patient portals, charting tools, and high-efficiency provider workflows.",
    "problem": "A multi-clinic pediatric and family care network relied on a legacy EHR provider with slow, closed databases. Custom clinician tools and mobile intake forms were impossible to connect safely. This led to serious scheduling conflicts, double-entry paperwork, and a patients-intake bottleneck that took over 48 hours.",
    "challenges": [
      "Securing structured schema synchronization over sensitive patient data under HIPAA standards.",
      "Parsing and translating legacy HL7 messages into clean, standard FHIR JSON resources.",
      "Developing fine-grained patient and guardian access controls to secure child medical history."
    ],
    "solution": "Architected a custom digital onboarding portal and administrative clinician dashboard connected to a secure self-hosted Medplum FHIR server. Integrated real-time scheduling APIs and encrypted patient diagnostic telemetry storage.",
    "keyImplementations": [
      "Custom OAuth2 HIPAA consent validation pipeline for remote patient check-ins.",
      "Legacy HL7v2 to FHIR standard schema translator parser with automated validation tests.",
      "Interactive multi-user pediatric clinical chart dashboard featuring real-time diagnostic telemetry widgets."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "FHIR API",
      "Docker",
      "AWS ECS",
      "Tailwind CSS"
    ],
    "ourRole": "Lead Lead Health-Tech Systems Architects",
    "resultMetrics": [
      "FHIR schema sync accuracy reached 100% with zero communication loss.",
      "Average patient intake and record checking duration reduced from 48 hours to 9 minutes.",
      "Saved administrative teams an average of 38 hours per week in manual PDF transcription."
    ],
    "businessValue": "Reduces clinical overhead, establishes absolute regulatory safety, and improves patient sentiment via rapid, automated digital onboarding.",
    "whyThisMatters": "Healthcare systems must balance absolute security with intuitive interfaces. Crafting developer platforms that conform to strict global medical patterns is crucial for large-scale clinic networks.",
    "testimonial": {
      "person": "Dr. Sarah Jenkins",
      "role": "Chief Nursing Operations Officer",
      "company": "CareGrid Family Health Group",
      "text": "The architectural control the engineers brought to our portals resolved a multi-year backlog of compliance bottlenecks. Our patients now enjoy a seamless check-in experience."
    },
    "beforeWorkflow": [
      {
        "name": "Paper Case Writing",
        "owner": "Patient",
        "duration": "30 mins",
        "notes": "Patient writes down entire diagnostic and treatment medical history on a physical paper sheet.",
        "isBottleneck": true
      },
      {
        "name": "Screening & Verification",
        "owner": "Clinic Receptionist",
        "duration": "1.5 hours",
        "notes": "Clerk scans pages, looks up insurance validity, and manually inputs text into legacy terminals.",
        "isBottleneck": true
      },
      {
        "name": "HL7 Manual Transfer",
        "owner": "Data Coordinator",
        "duration": "24-48 hours",
        "notes": "Translates record details into server database matrices over slow, old systems.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Digital Intake Check",
        "owner": "Patient Portal",
        "duration": "3 mins",
        "notes": "Patient completes clinical prompts on their mobile browser with instant compliance checks.",
        "isBottleneck": false
      },
      {
        "name": "FHIR Direct Sync",
        "owner": "Medplum Engine",
        "duration": "Instant",
        "notes": "Auto-translates entries on the fly and records them to high-density compliant tables.",
        "isBottleneck": false
      },
      {
        "name": "EHR Ready",
        "owner": "Clinic Dashboard",
        "duration": "10 ms",
        "notes": "Physicians launch consultations with unified medical reports loaded instantly.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "formance-ledger",
    "title": "Formance Ledger & Financial Flow Orchestrator",
    "liveUrl": "https://www.formance.com",
    "category": "Fintech & Payments",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Cloud & DevOps"
    ],
    "description": "An open-source financial flow controller and double-entry ledger platform used to map, track, and route custom payment loops in multi-party marketplace applications.",
    "problem": "A growing regional ride-hailing and gig-worker delivery application was losing margin due to slow financial clearing systems. Combining driver earnings, passenger card gates, split referral fees, and promotional coupon balances manually led to a 2.4% discrepancy rate and required dedicated billing squads to resolve.",
    "challenges": [
      "Managing huge payment flows (10,000+ operations/sec) without encountering database deadlock errors.",
      "Structuring high-fidelity financial routing logic to track credit, debit, and driver tax balances.",
      "Automating payment gateway clearing verification loops to guarantee transaction safety."
    ],
    "solution": "Engineered a high-throughput, low-latency financial ledger engine based on the Formance Ledger protocol. Built real-time dispute dashboards and custom payment split algorithms.",
    "keyImplementations": [
      "Double-entry ledgers mapping complex financial allocations across 5,000 active service providers.",
      "Custom payment split broker that triggers secure pay-outs instantly via Stripe Connnect hook events.",
      "Automated financial reconciliation monitors reporting daily balances accurately under 50 milliseconds."
    ],
    "techStack": [
      "Next.js",
      "TypeScript",
      "GoLang",
      "PostgreSQL",
      "Kafka",
      "Docker",
      "Tailwind CSS",
      "ClickHouse"
    ],
    "ourRole": "Senior Clearing & Ledger Infrastructure Engineers",
    "resultMetrics": [
      "Ledger discrepancy down from 2.4% to absolute zero across millions of monthly charges.",
      "Payout clearing delays shortened from 7 working days to less than 150 seconds.",
      "Saved the finance group over $32,000 monthly in transactional auditing overhead."
    ],
    "businessValue": "Secures financial integrity, eliminates error losses, and automatically clears and issues driver commissions dynamically.",
    "whyThisMatters": "Payments applications require programmatic execution and absolute transactional precision. Building modular cash flows on open ledger standardizations protects from critical transaction risks.",
    "testimonial": {
      "person": "Markus Vane",
      "role": "VP of Clearing Infrastructure",
      "company": "SwiftDrive Transport Group",
      "text": "The financial flow layout designed by this group has given us complete clarity over complex multi-party rider balances. Transaction mismatches are a thing of the past."
    },
    "beforeWorkflow": [
      {
        "name": "Card Charge",
        "owner": "Payment Gate",
        "duration": "10 secs",
        "notes": "Passenger payment cleared via external gateways with no central split index.",
        "isBottleneck": false
      },
      {
        "name": "Manual Splitting",
        "owner": "Finance Specialist",
        "duration": "1-3 days",
        "notes": "Manual spreadsheet calculation to separate driver fees, company cuts, and taxing.",
        "isBottleneck": true
      },
      {
        "name": "Bank Batch Payout",
        "owner": "Accounting Team",
        "duration": "4 days",
        "notes": "Dispatches bulk bank transaction files, waiting for verification responses.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Flow redirectional",
        "owner": "Formance SDK Node",
        "duration": "Instant",
        "notes": "Instantly divides incoming passenger funds into separate ledger allocations.",
        "isBottleneck": false
      },
      {
        "name": "Ledger commit",
        "owner": "Database Ledger",
        "duration": "3 ms",
        "notes": "Commits atomic double-entry logs to ensure balances are mathematically sound.",
        "isBottleneck": false
      },
      {
        "name": "Stripe Connect Payout",
        "owner": "Pay Node Webhook",
        "duration": "Instant",
        "notes": "Triggers immediate driver payouts of safe margins automatically.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "fleetbase-logistics",
    "title": "Fleetbase Global Logistics & Fleet Delivery Dispatcher",
    "liveUrl": "https://www.fleetbase.io",
    "category": "Logistics & Supply Chain",
    "serviceAreas": [
      "Product Engineering",
      "Cloud & DevOps",
      "Data & Integration"
    ],
    "description": "An open-source, mobile-first logistics framework built to organize complex transit schedules, delivery dispatch sequences, and sensor-driven load coordinate monitors.",
    "problem": "A nationwide fresh food supply and catering organizer relied on manual phone checks and radios to guide fleet drivers. They suffered from high freight spoilage, unexpected transport delays, and had no real-time ETA visualization for warehouse hubs.",
    "challenges": [
      "Integrating disparate in-cab GPS sensors with real-time websocket coordination servers.",
      "Constructing offline-first mobile navigation clients for operators delivering in isolated areas.",
      "Optimizing complex route paths to balance delivery volumes across 150 drivers with dynamic schedules."
    ],
    "solution": "Deployed a customized self-hosted instance of Fleetbase framework, introducing IoT sensor integration APIs (tracking temperature and GPS coordinates) and an automated warehouse alert dashboard.",
    "keyImplementations": [
      "Real-time websocket map tracker rendering active driver paths and vehicle cargo parameters.",
      "Responsive, offline-first transit driver client with integrated cargo barcode scanner tools.",
      "Logical alert monitors emitting automated SMS updates to waiting warehouse handlers."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Ember.js",
      "Node.js",
      "WebSockets",
      "Leaflet Maps",
      "Redis",
      "PostgreSQL"
    ],
    "ourRole": "Supply Chain Solutions Architects",
    "resultMetrics": [
      "Reduced cold-chain food spoilage counts by 96% through active temperature warnings.",
      "Freight delivery schedule calculation times fell from 4 hours down to less than 3 minutes.",
      "Increased daily vehicle route utilization by 22% back-to-back."
    ],
    "businessValue": "Mitigates delivery delays, streamlines dispatch management, and ensures shipment quality and customer trust.",
    "whyThisMatters": "Logistics pipelines demand real-time telemetry and reliable offline-first handling. Proving system resilience in remote or highly variable environments is key to operational scale.",
    "testimonial": {
      "person": "Elena Rostova",
      "role": "Transit Logistics Director",
      "company": "Nordic Fresh Logistics Group",
      "text": "The tracking dashboards are beautiful, and the real-time IoT alerts saved tens of thousands of dollars in fragile food cargo in the very first month."
    },
    "beforeWorkflow": [
      {
        "name": "Freight Sorting Plan",
        "owner": "Warehouse Clerk",
        "duration": "2 hours",
        "notes": "Clerks manually print cargo delivery invoices and group physical sheets into driver files.",
        "isBottleneck": true
      },
      {
        "name": "Driver Radio Check",
        "owner": "Dispatcher",
        "duration": "1 hour",
        "notes": "Dispatcher calls driver phones manually to verify delivery updates and record them.",
        "isBottleneck": true
      },
      {
        "name": "Manual Status Logging",
        "owner": "Data Specialist",
        "duration": "1.5 hours",
        "notes": "Transcribes paperwork back sheets into inventory databases at end of shift.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Instant Route optimization",
        "owner": "Fleetbase Engine",
        "duration": "5 secs",
        "notes": "Calculates optimized shipment-to-driver groupings and pushes routes to terminals.",
        "isBottleneck": false
      },
      {
        "name": "Sensory IoT Stream",
        "owner": "Driver Terminal",
        "duration": "Instant",
        "notes": "Generates live, automated updates containing cargo temps and GPS indexes.",
        "isBottleneck": false
      },
      {
        "name": "Direct Warehouse Check",
        "owner": "Staff Dashboard",
        "duration": "Instant",
        "notes": "Provides instant ETAs and notifies warehouses of arriving shipments automatically.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "estated-proptech",
    "title": "Estated Enterprise Parcel & Property Valuation API",
    "liveUrl": "https://estated.com",
    "category": "Real Estate / PropTech",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Architecture & Consulting"
    ],
    "description": "A fast, enterprise-grade data platform providing sub-second JSON responses for detailed property evaluations, structural specifications, parcel boundaries, and tax logs.",
    "problem": "A high-growth mortgage appraisal platform struggled to evaluate property assets quickly. Underwriters spent days manually looking up local county records, tax history, and parcel layouts, delaying mortgage commitment cycles by an average of 5 days.",
    "challenges": [
      "Unifying conflicting county tax assessors record collections into single property JSON schemas.",
      "Configuring rapid geometric database searches (GIS) for property parcel coordinates under heavy load.",
      "Creating structured client API wrappers that load up-to-date appraisals in real time."
    ],
    "solution": "Architected a custom real-estate valuation engine that interfaces directly with the Estated database, incorporating instant credit valuation tests and clean property-history mapping screens.",
    "keyImplementations": [
      "GIS database integration optimized with indexes to query properties by geo-coordinates in under 30 milliseconds.",
      "Dynamic appraisal report builder exporting structured, printable PDF records for underwriters.",
      "Real-time county parcel visualizer displaying exact asset geometry using standard web maps."
    ],
    "techStack": [
      "Next.js",
      "TypeScript",
      "Ruby on Rails",
      "PostgreSQL",
      "GIS / PostGIS",
      "AWS Lambda",
      "Tailwind CSS"
    ],
    "ourRole": "Lead Lead PropTech Engineers and GIS Specialists",
    "resultMetrics": [
      "Initial property data pull duration dropped from 5 working days to 85 milliseconds.",
      "Automated and verified parcel mapping parameters for over 15,000 local properties.",
      "Mortgage approval timeline shortened by over 60%, boosting weekly closing volumes."
    ],
    "businessValue": "Reduces processing times, increases platform volume, and eliminates manual data lookup errors for real estate teams.",
    "whyThisMatters": "PropTech tools require quick access to verified public data. Normalizing vast, disparate public registries into fast, developer-friendly APIs streamlines real estate transactions.",
    "testimonial": {
      "person": "Clarissa Vance",
      "role": "VP of Mortgage Closings",
      "company": "Metropolitan Appraisers Corp",
      "text": "The property search tool has transformed our workflow. We can now audit and verify property tax deeds instantly, making our mortgage processing incredibly fast."
    },
    "beforeWorkflow": [
      {
        "name": "Record Retrieval",
        "owner": "Underwriter",
        "duration": "2 days",
        "notes": "Underwriter accesses regional county clerk portals to find property deed PDFs manually.",
        "isBottleneck": true
      },
      {
        "name": "Parcel Sketching",
        "owner": "Appraiser Analyst",
        "duration": "1 day",
        "notes": "Sketches property lines manually from old scans to verify exact parcel boundaries.",
        "isBottleneck": true
      },
      {
        "name": "Manual Compilation",
        "owner": "Data Coordinator",
        "duration": "3 hours",
        "notes": "Compiles disparate tax histories into a single, custom valuation spreadsheet.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Direct API Search",
        "owner": "Search Bar",
        "duration": "5 ms",
        "notes": "Operator enters the target address with autocomplete helper.",
        "isBottleneck": false
      },
      {
        "name": "Direct Record Pull",
        "owner": "Estated API Node",
        "duration": "120 ms",
        "notes": "Loads complete, verified property details, tax histories, and parcel dimensions in one call.",
        "isBottleneck": false
      },
      {
        "name": "PDF Portfolio Export",
        "owner": "PDF Creator Node",
        "duration": "Instant",
        "notes": "Generates high-fidelity investment summaries and pushes them directly to lenders.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "duffel-travel",
    "title": "Duffel Multi-Carrier Booking Infrastructure",
    "liveUrl": "https://duffel.com",
    "category": "Travel & Hospitality",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Cloud & DevOps"
    ],
    "description": "A developer-first API-driven platform that integrates directly with complex global airline and hospitality distribution networks to manage real-time bookings, ancillary options, and post-booking workflows.",
    "problem": "A high-end corporate corporate retreat booking agency struggled to coordinate complex corporate group travel. Connecting flights, baggage allowances, seat assignments, and hotel bookings required developers to build custom bridges for antiquated GDS protocols (such as SOAP XML), causing high error logs and booking failures.",
    "challenges": [
      "Parsing nested flight schemas, weight policies, and ticket conditions in split seconds.",
      "Caching live booking inventory data safely to prevent seat booking conflicts during checkout.",
      "Structuring fully automated refund and re-booking workflows to handle schedule changes."
    ],
    "solution": "Engineered a fast, robust corporate group booking system utilizing the Duffel API network. Programmed high-traffic seat mapping tools and secure cancellation modules with zero administrative friction.",
    "keyImplementations": [
      "High-performance flight price search aggregator capable of checking hundreds of paths in under 200 milliseconds.",
      "Custom React flight map and boarding seat editor with real-time availability sync.",
      "Automated corporate billing module tracking flight tickets, hotel packages, and traveler insurance."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "GoLang",
      "GraphQL",
      "Redis",
      "Vercel Edge",
      "Docker",
      "Tailwind CSS"
    ],
    "ourRole": "Core API Integration Engineers",
    "resultMetrics": [
      "GDS checkout error codes dropped from 14% to absolute zero.",
      "Multi-carrier ticket booking times fell from 12 minutes to 1.8 seconds.",
      "Direct group booking volume surged by 45% due to a seamless checkout experience."
    ],
    "businessValue": "Simplifies travel booking, reduces administrative workload, and opens access to direct-to-airline booking commissions.",
    "whyThisMatters": "Travel and hospitality tools face complex global legacy dependencies. Bridging outdated mainframe structures with fast Web REST APIs is critical to building scalable booking interfaces.",
    "testimonial": {
      "person": "Aris Thorne",
      "role": "VP of Corporate Services",
      "company": "Apex Retreat Planners LLC",
      "text": "The direct booking speed is fantastic. Our corporate clients can now book coordinate complex multi-leg group flights instantly without encountering system errors."
    },
    "beforeWorkflow": [
      {
        "name": "Legacy Inquiry",
        "owner": "Travel Coordinator",
        "duration": "1 hour",
        "notes": "Coordinator manually emails carrier agents to check seats and rates for large corporate groups.",
        "isBottleneck": true
      },
      {
        "name": "Manual Ticket Allocation",
        "owner": "Carrier Desk Agent",
        "duration": "3 hours",
        "notes": "Agent manually blocks out seating blocks on legacy green-screen airline terminal databases.",
        "isBottleneck": true
      },
      {
        "name": "Email Reconciliation",
        "owner": "Travel Coordinator",
        "duration": "4 hours",
        "notes": "Validates corporate payment data and distributes ticket PDFs one by one via email.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Direct API Inquiry",
        "owner": "Agency Portal",
        "duration": "3 secs",
        "notes": "Aggregates flight prices, seat layouts, and booking parameters directly from carrier networks.",
        "isBottleneck": false
      },
      {
        "name": "Instant Seat Click",
        "owner": "Corporate Client",
        "duration": "30 secs",
        "notes": "Client selects exact seating assignments inside a modern interactive seating widget.",
        "isBottleneck": false
      },
      {
        "name": "Auto Ticket Dispatch",
        "owner": "Duffel Booking Node",
        "duration": "2 secs",
        "notes": "Charges corporate accounts and delivers synchronized flight ticket confirmations instantly.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "boost-insurtech",
    "title": "Boost Embedded Insurance Infrastructure API",
    "liveUrl": "https://boostinsurance.com",
    "category": "Insurance / InsurTech",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Architecture & Consulting"
    ],
    "description": "An API-driven embedded insurance platform that handles risk estimation, policy creation, underwriting rules, and premium collections programmatically.",
    "problem": "An on-demand gig-delivery company wanted to offer custom transit insurance coverages for active bike couriers. Traditional insurers required manual document submittals, extensive processing, and lengthy assessment cycles, stalling driver onboarding and risking coverage gaps.",
    "challenges": [
      "Calculating insurance quotes instantly based on real-time driver delivery coordinates and vehicle types.",
      "Structuring legally compliant, dynamic insurance policy documents on the fly with custom coverages.",
      "Integrating secure billing pipelines to collect micro-premiums with zero financial leakage."
    ],
    "solution": "Designed and built an modular embedded insurance module directly inside the courier application via the Boost API network, allowing drivers of active delivery vehicles to apply, purchase, and finalize insurance instantly.",
    "keyImplementations": [
      "Dynamic underwriting rule engine checking active driver profiles in milliseconds.",
      "Custom premium charging system calculated proportionally of total dispatch deliveries.",
      "Automated policy-to-PDF compiler storing encrypted insurance certificates securely."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Python",
      "Flask",
      "PostgreSQL",
      "AWS S3",
      "Tailwind CSS",
      "PDF-lib"
    ],
    "ourRole": "InsurTech Solutions Architects",
    "resultMetrics": [
      "Insurance policy generation times fell from 15 working days down to 600 milliseconds.",
      "Automated gig-driver coverage matching achieved 100% compliance across 12,000 trips.",
      "Increased active provider onboarding speeds by 38% due to immediate digital insurance verify."
    ],
    "businessValue": "Reduces operational risks, automates gig-economy driver compliance, and opens new revenue streams through embedded insurtech.",
    "whyThisMatters": "Modern insurance must be dynamic and embedded rather than manual and static. Creating secure, real-time insurance issuing APIs is the key to protecting gig economy platforms.",
    "testimonial": {
      "person": "Amelia Vance",
      "role": "Compliance & Risk Director",
      "company": "EverShield Delivery Mutual",
      "text": "Securing immediate, dynamic bike transit coverage solved a massive compliance hurdle. Our riders are now protected from the split second they accept a deliveries."
    },
    "beforeWorkflow": [
      {
        "name": "PDF Application",
        "owner": "Delivery Driver",
        "duration": "1 hour",
        "notes": "Driver manually downloads, fills out, and uploads an insurance inquiry application form.",
        "isBottleneck": true
      },
      {
        "name": "Manual Underwriting",
        "owner": "Insurtech Underwriter",
        "duration": "3-5 days",
        "notes": "Underwriter checks histories and assigns premium rates manually, causing delays.",
        "isBottleneck": true
      },
      {
        "name": "Policy Dispatch",
        "owner": "Insurance Admin",
        "duration": "1 day",
        "notes": "Admin drafts, registers, and mails policy details to drivers, delaying contract activations.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Direct App Check-in",
        "owner": "Gig Application",
        "duration": "15 secs",
        "notes": "Driver logs in and triggers automatic, secure premium evaluations dynamically.",
        "isBottleneck": false
      },
      {
        "name": "Sub-Second Rating",
        "owner": "Boost API Router",
        "duration": "120 ms",
        "notes": "Instantly returns customized insurance premiums based on active coordinate vectors.",
        "isBottleneck": false
      },
      {
        "name": "Instant Issue",
        "owner": "PDF Compiler Node",
        "duration": "1 sec",
        "notes": "Generates secure insurance policies and issues direct certificates automatically.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "heidihealth-ai",
    "title": "Heidi Health HIPAA Scribe & Clinical AI Assistant",
    "liveUrl": "https://www.heidihealth.com",
    "category": "Vertical AI Applications / Healthcare & Medical Software",
    "serviceAreas": [
      "AI & Automation",
      "Product Engineering",
      "Data & Integration"
    ],
    "description": "An AI-powered clinical assistant and medical scribe designed to securely record patient visits and generate accurate, HIPAA-compliant electronic health records (EHR) instantly.",
    "problem": "Specialist doctors at an oncology and general medicine clinic spent over 3 hours daily typing patient summaries into clunky EMR dashboards. This administrative friction fatigued providers, reduced patient face-time, and led to brief, lower-quality medical folders.",
    "challenges": [
      "Transcribing ambient multi-person dialogues with medical-grade terminology accuracy (~99%).",
      "Ensuring clean, structured data extraction for clinical diagnoses, prescriptions, and follow-ups.",
      "Adhering to strict zero-retention, secure HIPAA guidelines when feeding client conversations to LLM endpoints."
    ],
    "solution": "Designed and implemented a secure web-based clinical assistant based on Heidi Health APIs, featuring real-time speech-to-text translators, medical summary generators, and automatic EMR record synchronization.",
    "keyImplementations": [
      "Ambient record translator utilizing local device audio streams with secure end-to-end encryption.",
      "Custom clinical LLM prompt structures that format raw spoken dialogues into structured medical files.",
      "HIPAA-compliant, zero-retention API proxy routes preventing search logs leaks to public LLM servers."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Node.js",
      "WebAudio API",
      "Google GenAI SDK",
      "Tailwind CSS",
      "Docker",
      "S3 Storage"
    ],
    "ourRole": "AI Safety & Healthcare Systems Developers",
    "resultMetrics": [
      "Clinical notes typing time dropped from 3 hours daily to less than 12 minutes.",
      "Increased doctor-to-patient eye-contact and consultation satisfaction scores by 42%.",
      "Achieved absolute HIPAA zero-leak file safety across 8,000 verified clinic sessions."
    ],
    "businessValue": "Cures clinician burnout, enhances patient experience, and structures detailed clinical data automatically.",
    "whyThisMatters": "Medical AI tools require pristine UI design and strict HIPAA compliance. Building ambient speech interfaces that integrate safely with EHR databases improves clinical operations and provider wellness.",
    "testimonial": {
      "person": "Meredith Cole",
      "role": "Operations Coordinator",
      "company": "CarePath Medical Centers",
      "text": "Our doctors can now focus on the patient instead of typing on keyboard keys. The AI summary formats are beautifully structured and perfectly compliant."
    },
    "beforeWorkflow": [
      {
        "name": "Session Tape typing",
        "owner": "Medical Doctor",
        "duration": "15 mins",
        "notes": "Physician listens to patient, scribbles brief paper reminders during the consult.",
        "isBottleneck": false
      },
      {
        "name": "EMR Manual Input",
        "owner": "Medical Doctor",
        "duration": "2-3 hours",
        "notes": "Stays late at the clinic manually compiling symptoms, diagnosis notes, and treatments into clunky text areas.",
        "isBottleneck": true
      },
      {
        "name": "Review and Signature",
        "owner": "Advisory Board",
        "duration": "1 hour",
        "notes": "Manually audits records for compliance, fixing data omissions, leading to delays.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Ambient Listening",
        "owner": "Active AI App",
        "duration": "Instant",
        "notes": "Secured microphone captures conversation on the fly, streaming text securely.",
        "isBottleneck": false
      },
      {
        "name": "Secure LLM Compilation",
        "owner": "Google GenAI Core",
        "duration": "4 secs",
        "notes": "Formats ambient discussions into perfect medical-grade consult charts instantly.",
        "isBottleneck": false
      },
      {
        "name": "Direct EHR Post",
        "owner": "EMR Sync Connector",
        "duration": "Instant",
        "notes": "Pushes complete, doctor-verified notes to patient charts automatically.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "harvey-legal",
    "title": "Harvey AI Corporate Contract & Legal Research Copilot",
    "liveUrl": "https://www.harvey.ai",
    "category": "Vertical AI Applications",
    "serviceAreas": [
      "AI & Automation",
      "Product Engineering",
      "Data & Integration"
    ],
    "description": "An enterprise-grade specialized legal AI platform built to analyze massive collections of contracts, research case law, and draft compliant legal documents instantly.",
    "problem": "A multinational commercial law firm spent hundreds of associate billable hours auditing thousands of multi-page supply chain contracts for regulatory compliance, occasionally letting critical risk exposures slip through.",
    "challenges": [
      "Designing highly accurate, search-grounded RAG structures to query confidential legal databases.",
      "Maintaining zero hallucination standards on critical contract liability clauses.",
      "Parsing heavily formatted legal PDFs, structures, and dense briefs into structured analytical schemas."
    ],
    "solution": "Developed an enterprise contract audit environment based on Harvey AI, integrating automated clause comparison interfaces, multi-lawyer collaboration tools, and real-time risk analyzers.",
    "keyImplementations": [
      "Custom vector databases (using pgvector) indexing 50,000+ legal records with sub-second lookups.",
      "Interactive multi-contract comparison interface highlighting conflicting terms and missing clauses.",
      "Strict data isolation pipeline with end-to-end encryption to keep sensitive briefs safe."
    ],
    "techStack": [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Tailwind CSS",
      "Vercel"
    ],
    "ourRole": "AI Engineering & Legal Technology Developers",
    "resultMetrics": [
      "Average legal research and contract audit duration reduced by 72%.",
      "Spotted critical missing liability exclusions with 100% precision across 3,000 files.",
      "Replaced manual audit backlogs, saving over $85,000 in operational costs annually."
    ],
    "businessValue": "Minimizes contract risks, speeds up corporate transactions, and allows legal teams to focus on high-priority strategy.",
    "whyThisMatters": "Legal tools demand high accuracy. Building specialized RAG pipelines that analyze dense, complex documents with near-zero hallucinations is the pinnacle of enterprise software engineering.",
    "testimonial": {
      "person": "Captain Richard Cole",
      "role": "Senior Partner, Corporate Law",
      "company": "Cole, Vance & Partners LLP",
      "text": "The precision of this contract audit assistant is remarkable. It handles high-density research in minutes, flagging risks we used to spend days searching for."
    },
    "beforeWorkflow": [
      {
        "name": "Contract Sorting",
        "owner": "Junior Associate",
        "duration": "4 hours",
        "notes": "Collects 50 contract PDFs from email threads and organizes files into local directories.",
        "isBottleneck": true
      },
      {
        "name": "Manual Audit",
        "owner": "Junior Associate",
        "duration": "2 days",
        "notes": "Reads every page of each brief manually, looking for liability limits and mismatched clauses.",
        "isBottleneck": true
      },
      {
        "name": "Risk Review",
        "owner": "Staff Attorney",
        "duration": "3 hours",
        "notes": "Reviews notes from associates, fixes omissions, drafts the final compliance reports.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Bulk PDF Upload",
        "owner": "Staff Attorney",
        "duration": "10 secs",
        "notes": "Uploads contract files into a secure web-based repository.",
        "isBottleneck": false
      },
      {
        "name": "AI Analytical Sweep",
        "owner": "Harvey AI Node",
        "duration": "20 secs",
        "notes": "Performs instant contract checks, highlighting missing terms or anomalies.",
        "isBottleneck": false
      },
      {
        "name": "Dashboard Review",
        "owner": "Staff Attorney",
        "duration": "3 mins",
        "notes": "Auditor checks AI suggestions on a dashboard and exports compliance reports.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "lago-billing",
    "title": "Lago Open Metering & Usage Billing Platform",
    "liveUrl": "https://www.getlago.com",
    "category": "Fintech & Payments",
    "serviceAreas": [
      "Product Engineering",
      "Data & Integration",
      "Cloud & DevOps"
    ],
    "description": "An open-source, high-performance metering and invoicing engine designed for modern usage-based software models, APIs, and transactional software.",
    "problem": "A high-performance GPU cloud analytics provider struggled to bill customers accurately. Their previous invoicing system could not track dynamic GPU-hour usage real-time, resulting in manual monthly credit calculations, delayed billing, and customer disputes.",
    "challenges": [
      "Ingesting millions of raw usage events per second without database performance degradation.",
      "Structuring complex, multi-tiered pricing rules (such as hybrid, prepaid, and metered rates).",
      "Automating payment gateway triggers to charge micro-transactions instantly without failures."
    ],
    "solution": "Engineered a scalable custom billing portal built on top of Lago framework, featuring high-speed event telemetry ingest pipelines, clean invoice grids, and real-time usage meters.",
    "keyImplementations": [
      "High-throughput event ingestion hub connected to Kafka brokers to parse usage coordinates instantly.",
      "Dynamic billing pricing engine compiling intricate discount structures into clean customer invoices.",
      "Seamless payment gateway synchronizer checking Stripe bank transactions and auto-issuing PDF invoices."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Ruby on Rails",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Docker",
      "Tailwind CSS"
    ],
    "ourRole": "Clearing & Billing Infrastructure Specialists",
    "resultMetrics": [
      "Invoiced over $1.4M in usage event charges with 100% calculation reliability.",
      "Ingestion latency for raw usage records fell to less than 8 milliseconds.",
      "Reduced monthly billing disputes and invoice errors from 14% to absolute zero."
    ],
    "businessValue": "Eliminates billing delays, secures usage revenue, and offers completely transparent consumption dashboards.",
    "whyThisMatters": "Usage billing requires high transaction accuracy. Building open, reliable event tracking engines ensures clean financial records as software platforms scale with users.",
    "testimonial": {
      "person": "Julian Vance",
      "role": "Lead Billing Systems Manager",
      "company": "Evergreen Cloud GPU",
      "text": "Moving to this open-source billing engine gave our customers full visibility over their cloud usage. Dispute tickets fell to zero immediately."
    },
    "beforeWorkflow": [
      {
        "name": "Log Gathering",
        "owner": "SaaS Systems Admin",
        "duration": "4 hours",
        "notes": "Collects cluster log files manually at the end of every month.",
        "isBottleneck": true
      },
      {
        "name": "Excel Rating",
        "owner": "Billing Manager",
        "duration": "2 days",
        "notes": "Calculates variable user charges on giant spreadsheet structures manually, causing errors.",
        "isBottleneck": true
      },
      {
        "name": "Invoice Dispatch",
        "owner": "Finance Specialist",
        "duration": "24 hours",
        "notes": "Manually drafts and sends individual user invoices over email, waiting for confirmations.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Live Usage Stream",
        "owner": "SaaS Clusters",
        "duration": "Instant",
        "notes": "Streams GPU runtime events raw to our ingestion pipeline, recording usages.",
        "isBottleneck": false
      },
      {
        "name": "Continuous Calculation",
        "owner": "Lago Engine",
        "duration": "5 ms",
        "notes": "Auto-rates events on the fly, updating account invoices in real-time.",
        "isBottleneck": false
      },
      {
        "name": "Secure Invoice Issuing",
        "owner": "Stripe Sync Node",
        "duration": "3 secs",
        "notes": "Drafts and issues accurate, automated invoices at payment portals immediately.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "hatchways-proptech",
    "title": "Hatchways PropTech Appraisal Sync Portal",
    "liveUrl": "https://www.hatchways.io",
    "category": "Real Estate / PropTech",
    "serviceAreas": [
      "Product Engineering",
      "Cloud & DevOps",
      "Data & Integration"
    ],
    "description": "An automated coordination environment designed for PropTech developers to integrate appraisal schedules, parcel inspections, and lender title filings seamlessly.",
    "problem": "An appraisers-for-hire grid faced constant delays. Coordinating inspections, sending photo reports to lenders, and verifying local titles took back-and-forth emails, resulting in delays of up to 10 working days.",
    "challenges": [
      "Integrating disparate regional title files into one structured appraisers sync API.",
      "Delivering instant, geo-targeted notifications to field appraisers based on address locations.",
      "Creating highly secure dashboard interfaces for banks to track appraisers' progress."
    ],
    "solution": "Designed and built an appraisal synchronization portal based on Hatchways APIs, automating scheduling routing, photo uploads, and lender audit check-offs.",
    "keyImplementations": [
      "Dynamic field appraisers dispatch planner based on mapping coordinates and travel histories.",
      "Custom, high-speed photo inspection organizer compressing images to prevent upload lags.",
      "Automated escrow and title tracking webhook connectors feeding status data back directly."
    ],
    "techStack": [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "SQLite",
      "S3 Storage",
      "Tailwind CSS",
      "Prisma"
    ],
    "ourRole": "Custom Integration Advisors & Product Developers",
    "resultMetrics": [
      "Appraisal scheduling and coordination cycles dropped from 10 days to 4 hours.",
      "Saved appraisers network over $12,000 monthly in custom tool licenses.",
      "Customer appraisal request drop-off rates fell from 17% down to 1.8%."
    ],
    "businessValue": "Accelerates property sales cycles, minimizes platform transaction delays, and reduces coordinator workloads.",
    "whyThisMatters": "Seamless PropTech scheduling requires responsive coordinate mapping and robust visual timelines. Automating communication between lenders and appraisers accelerates the home buying process.",
    "testimonial": {
      "person": "Amelia Vance",
      "role": "Appraisal Coordinations Lead",
      "company": "EverShield Appraisals Mutual",
      "text": "Bringing our appointment sync directly into this custom portal solved a major administrative headache. Appraisers can now complete review steps on the fly."
    },
    "beforeWorkflow": [
      {
        "name": "Manual Booking Invite",
        "owner": "Agency Coordinator",
        "duration": "1 hour",
        "notes": "Coordinator calls and emails multiple local agents to find a free field inspector.",
        "isBottleneck": true
      },
      {
        "name": "Field Travel Survey",
        "owner": "Field Appraiser",
        "duration": "1 day",
        "notes": "Appraiser records inspection data manually, taking photos on digital cameras.",
        "isBottleneck": true
      },
      {
        "name": "ZIP File Upload",
        "owner": "Field Appraiser",
        "duration": "3 hours",
        "notes": "Saves files, compresses folders, emails ZIP files to lenders manually.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Dynamic Dispatch Booking",
        "owner": "Appraisal Sync API",
        "duration": "1 sec",
        "notes": "Matches and routes requests to the nearest free credentialed appraiser automatically.",
        "isBottleneck": false
      },
      {
        "name": "Mobile Client Portal",
        "owner": "Field Appraiser",
        "duration": "10 mins",
        "notes": "Appraiser takes photos and logs structural notes directly onto their phone browser.",
        "isBottleneck": false
      },
      {
        "name": "Automated Lender Sync",
        "owner": "Data Sync Router",
        "duration": "Instant",
        "notes": "Lenders check verified valuation records instantly on dashboard grids.",
        "isBottleneck": false
      }
    ]
  },
  {
    "id": "sojern-hospitality",
    "title": "Sojern Hospitality Guest Analytics & Direct Booking Engine",
    "liveUrl": "https://www.sojern.com",
    "category": "Travel & Hospitality",
    "serviceAreas": [
      "AI & Automation",
      "Product Engineering",
      "Data & Integration"
    ],
    "description": "An AI-powered traveler intent platform and direct booking engine used by enterprise resorts to analyze search trends, run direct-to-guest incentives, and improve occupancy rates.",
    "problem": "A luxury boutique hotel collective struggled with low direct booking rates. They relied on expensive online travel agencies, which collected high commissions (up to 25%), and lacked the data to capture booking intent signals before travelers went elsewhere.",
    "challenges": [
      "Ingesting and analyzing traveler search signals on global travel sites in real time under heavy load.",
      "Implementing machine learning models to forecast occupancy rates and predict hotel pricing trends.",
      "Delivering highly responsive direct-booking incentives to active hotel website visitors."
    ],
    "solution": "Designed and built a custom booking incentive dashboard and traveler intent tracker based on the Sojern API network, optimizing direct resort reservations.",
    "keyImplementations": [
      "Travel intelligence telemetry tracker monitoring search signals on active agency platforms.",
      "Dynamic room incentive engine presenting targeted perks (such as complimentary spa services) to website visitors.",
      "Automated hotel pricing synchronization API updating room availability across booking systems."
    ],
    "techStack": [
      "Next.js",
      "TypeScript",
      "Python",
      "ClickHouse",
      "PostgreSQL",
      "Tailwind CSS",
      "GCP Cloud Run"
    ],
    "ourRole": "Hospitality Technology Systems Architects & AI Specialists",
    "resultMetrics": [
      "Direct resort bookings grew by 38% year-over-year, bypassing agency commission fees.",
      "Saved boutique resorts over $450,000 annually in unneeded agency commissions.",
      "Achieved sub-10ms response times for guest reservation pricing incentives."
    ],
    "businessValue": "Improves profit margins, drives brand loyalty, and matches hotel vacancy rates with active travelers dynamically.",
    "whyThisMatters": "Direct booking incentives must be fast and relevant to convert. Unifying intent analytics with intuitive pricing engines improves direct hotel bookings.",
    "testimonial": {
      "person": "Elena Rostova",
      "role": "Operations Coordinator",
      "company": "CarePath Specialty Clinics",
      "text": "The integration of this direct guest billing optimizer saved us millions of dollars in OTA commissions. It is the best booking solution we have implemented."
    },
    "beforeWorkflow": [
      {
        "name": "OTA Listing Setup",
        "owner": "Resort Manager",
        "duration": "2 hours",
        "notes": "Manager uploads room listings to massive aggregate websites with 25% commission terms.",
        "isBottleneck": true
      },
      {
        "name": "Passive Page Waiting",
        "owner": "Resort Coordinator",
        "duration": "2 days",
        "notes": "Waits for reservations with no direct contact tools for interested travelers.",
        "isBottleneck": true
      },
      {
        "name": "Commission Billing",
        "owner": "Finance Specialist",
        "duration": "3 hours",
        "notes": "Reconciles high commission payments manually mid-month, reducing yields.",
        "isBottleneck": true
      }
    ],
    "afterWorkflow": [
      {
        "name": "Direct Site Visit",
        "owner": "Active Traveler",
        "duration": "Instant",
        "notes": "Traveler visits hotel page; local widgets track their checkout journey.",
        "isBottleneck": false
      },
      {
        "name": "Direct Booking Offer",
        "owner": "Dynamic Perks Engine",
        "duration": "Instant",
        "notes": "Presents targeted boutique incentives to maximize booking rates on the fly.",
        "isBottleneck": false
      },
      {
        "name": "Direct Commission Checkout",
        "owner": "Local Booking Gate",
        "duration": "Instant",
        "notes": "Guest checks out cleanly, with zero commission deductions transferred.",
        "isBottleneck": false
      }
    ]
  }
];

