<template>
  <main class="kabila-page" :class="{ 'is-dark': isDarkMode }">

    <!-- HEADER -->
    <header class="site-header">
      <RouterLink to="/technicians" class="back-link">
        &larr; Technicians
      </RouterLink>

      <div class="header-actions">
        <a
          href="https://www.linkedin.com/in/kabila-mboya-b3375a178"
          target="_blank"
          rel="noopener noreferrer"
          class="header-link"
        >
          LinkedIn
        </a>

        <button
          class="theme-toggle"
          type="button"
          :aria-label="isDarkMode ? 'Use light mode' : 'Use dark mode'"
          @click="toggleTheme"
        >
          {{ isDarkMode ? 'Light' : 'Dark' }}
        </button>
      </div>
    </header>

    <!-- HERO -->
    <section id="about" class="hero section-shell">

      <div class="hero-copy">
        <p class="eyebrow">Software Quality • Automation • Engineering</p>

        <h1>
          Kabila<br />
          <span>Mboya</span>
        </h1>

        <p class="role">
          QA Automation Engineer
          <b>&bull;</b>
          QA Lead
          <b>&bull;</b>
          Software Quality
        </p>

        <p class="hero-intro">
          I help engineering teams build and release reliable software through
          structured testing, test automation, API validation, defect
          investigation, and practical quality engineering.
        </p>

        <div class="hero-actions">
          <button
            class="button button-primary"
            type="button"
            @click="downloadCv"
          >
            Download CV
            <span>&darr;</span>
          </button>

          <a
            class="button button-outline"
            href="mailto:kabilamboya@gmail.com"
          >
            Contact Me
            <span>&rarr;</span>
          </a>

          <a class="text-link" href="#projects">
            View QA Work &rarr;
          </a>
        </div>
      </div>

      <div class="hero-visual">
        <div class="image-frame">
          <img
            :src="profileImage"
            alt="Portrait of Kabila Mboya"
            class="profile-image"
          />
        </div>

        <div class="availability">
          <span></span>
          Open to QA & software engineering opportunities
        </div>
      </div>

    </section>

    <!-- PROFESSIONAL SNAPSHOT -->
    <section class="stats section-shell" aria-label="Professional highlights">

      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat"
      >
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </div>

    </section>

    <!-- NAVIGATION -->
    <nav class="quick-nav" aria-label="Page sections">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="`#${item.id}`"
      >
        {{ item.label }}
      </a>
    </nav>

    <!-- SUMMARY -->
    <section
      id="summary"
      class="content-section section-shell summary-grid"
    >

      <div>
        <p class="section-kicker">01 / Profile</p>

        <h2>
          Quality is an<br />
          <em>engineering discipline.</em>
        </h2>
      </div>

      <div class="summary-copy">

        <p>
          I am a QA Automation Engineer and QA Lead with hands-on experience
          testing web applications and business workflows.
        </p>

        <p>
          My work spans manual testing, UI automation, API validation,
          regression testing, defect investigation, test data preparation,
          and collaboration with developers and product teams.
        </p>

        <p>
          I currently work primarily with Playwright, TypeScript, JavaScript,
          Node.js, REST APIs, Swagger, Git, and Azure DevOps.
        </p>

        <p class="pull-quote">
          Good testing is not just about finding defects. It is about
          understanding how software can fail before users do.
        </p>

      </div>

    </section>

    <!-- EXPERIENCE -->
    <section
      id="experience"
      class="content-section section-shell"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">02 / Experience</p>
          <h2>Engineering through quality</h2>
        </div>

        <span class="section-number">02</span>

      </div>

      <div class="timeline">

        <article
          v-for="role in experience"
          :key="role.title"
          class="timeline-item"
        >

          <div class="timeline-marker"></div>

          <div>

            <p class="timeline-period">
              {{ role.period }}
            </p>

            <h3>
              {{ role.title }}
            </h3>

            <p
              v-if="role.description"
              class="timeline-description"
            >
              {{ role.description }}
            </p>

            <ul>

              <li
                v-for="item in role.points"
                :key="item"
              >
                {{ item }}
              </li>

            </ul>

          </div>

        </article>

      </div>

    </section>

    <!-- QA FOCUS -->
    <section
      id="qa-focus"
      class="content-section section-shell qa-focus"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">03 / QA Focus</p>
          <h2>How I approach testing</h2>
        </div>

        <span class="section-number">03</span>

      </div>

      <div class="qa-grid">

        <article
          v-for="area in qaAreas"
          :key="area.title"
          class="qa-card"
        >

          <span class="qa-number">
            {{ area.number }}
          </span>

          <h3>
            {{ area.title }}
          </h3>

          <p>
            {{ area.description }}
          </p>

        </article>

      </div>

    </section>

    <!-- TOOLKIT -->
    <section
      id="skills"
      class="content-section section-shell skills-section"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">04 / Toolkit</p>
          <h2>Tools I use to test and build</h2>
        </div>

        <span class="section-number">04</span>

      </div>

      <div class="skill-groups">

        <div
          v-for="group in skillGroups"
          :key="group.title"
          class="skill-group"
        >

          <h3>
            {{ group.title }}
          </h3>

          <div class="chip-list">

            <span
              v-for="skill in group.items"
              :key="skill"
              class="chip"
            >
              {{ skill }}
            </span>

          </div>

        </div>

      </div>

    </section>

    <!-- PROJECTS -->
    <section
      id="projects"
      class="content-section section-shell"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">05 / Selected Work</p>
          <h2>Evidence over adjectives</h2>
        </div>

        <span class="section-number">05</span>

      </div>

      <div class="project-grid">

        <article
          v-for="project in projects"
          :key="project.title"
          class="project-card"
        >

          <div class="project-topline">

            <span>
              {{ project.type }}
            </span>

            <span>
              {{ project.index }}
            </span>

          </div>

          <h3>
            {{ project.title }}
          </h3>

          <p>
            {{ project.description }}
          </p>

          <ul>

            <li
              v-for="highlight in project.highlights"
              :key="highlight"
            >
              {{ highlight }}
            </li>

          </ul>

          <a
            v-if="project.link"
            :href="project.link"
            :target="project.external ? '_blank' : undefined"
            :rel="project.external ? 'noopener noreferrer' : undefined"
            class="text-link"
          >
            {{ project.linkText }} &rarr;
          </a>

        </article>

      </div>

    </section>

    <!-- TECHNICAL EVIDENCE -->
    <section
      id="evidence"
      class="content-section section-shell evidence-section"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">06 / Technical Evidence</p>
          <h2>Problems I have worked through</h2>
        </div>

        <span class="section-number">06</span>

      </div>

      <div class="evidence-list">

        <article
          v-for="item in technicalEvidence"
          :key="item.title"
          class="evidence-item"
        >

          <div class="evidence-index">
            {{ item.number }}
          </div>

          <div>

            <h3>
              {{ item.title }}
            </h3>

            <p>
              {{ item.description }}
            </p>

          </div>

        </article>

      </div>

    </section>

    <!-- NETWORKING FOUNDATION -->
    <section
      id="networking"
      class="content-section section-shell networking-section"
    >

      <div class="networking-copy">

        <p class="section-kicker">
          07 / Technical Foundation
        </p>

        <h2>
          From telecommunications<br />
          to <em>software quality.</em>
        </h2>

      </div>

      <div class="summary-copy">

        <p>
          My technical background includes telecommunications systems and
          technical support, giving me a foundation in troubleshooting,
          systems thinking, and technology infrastructure.
        </p>

        <p>
          I am particularly interested in applying that foundation to modern
          software systems, APIs, infrastructure, networking, and security
          products.
        </p>

        <p class="pull-quote">
          Strong QA starts with understanding not only what the software does,
          but also the systems it depends on.
        </p>

      </div>

    </section>

    <!-- WRITING -->
    <section
      id="writing"
      class="content-section section-shell writing-section"
    >

      <div class="section-heading">

        <div>
          <p class="section-kicker">08 / Technical Writing</p>
          <h2>Ideas from the field</h2>
        </div>

        <a
          href="https://linkedin.com/in/kabilamboya"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
        >
          LinkedIn &rarr;
        </a>

      </div>

      <p class="section-lede">
        I write about software testing, test automation, AI in QA,
        engineering leadership, product thinking, and practical approaches
        to software quality.
      </p>

      <div class="article-grid">

        <a
          v-for="post in posts"
          :key="post.id"
          :href="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="article-card"
        >

          <img
            :src="post.image"
            :alt="post.title"
          />

          <div>

            <p>
              {{ formatDate(post.date) }}
            </p>

            <h3>
              {{ post.title }}
            </h3>

            <span>
              Read article &rarr;
            </span>

          </div>

        </a>

        <p
          v-if="posts.length === 0"
          class="empty-state"
        >
          Technical writing and LinkedIn posts will appear here.
        </p>

      </div>

    </section>

    <!-- CONTACT -->
    <section
      id="contact"
      class="contact-section section-shell"
    >

      <div>

        <p class="section-kicker">
          Let's connect
        </p>

        <h2>
          Build quality<br />
          <em>into the work.</em>
        </h2>

      </div>

      <div>

        <p>
          Interested in QA automation, software testing, product quality,
          or technical engineering opportunities? Let's talk.
        </p>

        <div class="contact-links">

          <a href="mailto:kabilamboya@gmail.com">
            Email
            <span>kabilamboya@gmail.com</span>
          </a>

          <a href="tel:+254732379292">
            Phone
            <span>+254 732 379 292</span>
          </a>

          <a
            href="https://linkedin.com/in/kabilamboya"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <span>Connect online</span>
          </a>

          <a
            href="https://wa.me/254732379292"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
            <span>Start a conversation</span>
          </a>

        </div>

        <button
          class="button button-light"
          type="button"
          @click="downloadCv"
        >
          Download CV
          <span>&darr;</span>
        </button>

      </div>

    </section>

    <!-- PRINT-ONLY CV -->
<section class="print-cv">

  <header class="cv-header">
    <div>
      <h1>{{ technician.name }}</h1>

      <p class="cv-role">
        {{ technician.specialty }}
      </p>

      <p class="cv-contact">
        {{ technician.location || 'Kenya' }}
        <span v-if="technician.contact?.phone"> • {{ technician.contact.phone }}</span>
        <span v-if="technician.contact?.email"> • {{ technician.contact.email }}</span>
      </p>

      <p v-if="technician.socials?.linkedin" class="cv-link">
        {{ technician.socials.linkedin }}
      </p>
    </div>

    <img
      v-if="technician.image"
      :src="technician.image"
      :alt="`${technician.name} CV photo`"
      class="cv-photo"
    />
  </header>


  <!-- SUMMARY -->
  <section class="cv-section">
    <h2>PROFESSIONAL SUMMARY</h2>

    <p>
      {{ technician.bio }}
    </p>
  </section>


  <!-- EXPERIENCE -->
  <section
    v-if="technician.experienceDetails?.length"
    class="cv-section"
  >
    <h2>PROFESSIONAL EXPERIENCE</h2>

    <article
      v-for="job in technician.experienceDetails"
      :key="`${job.title}-${job.company}`"
      class="cv-entry"
    >
      <div class="cv-entry-header">
        <div>
          <h3>{{ job.title }}</h3>
          <p class="cv-company">{{ job.company }}</p>
        </div>

        <span>{{ job.period }}</span>
      </div>

      <ul>
        <li
          v-for="responsibility in job.responsibilities"
          :key="responsibility"
        >
          {{ responsibility }}
        </li>
      </ul>
    </article>
  </section>


  <!-- SKILLS -->
  <section
    v-if="technician.skills?.length"
    class="cv-section"
  >
    <h2>TECHNICAL SKILLS</h2>

    <div class="cv-skills">
      <span
        v-for="skill in technician.skills"
        :key="skill"
      >
        {{ skill }}
      </span>
    </div>
  </section>


  <!-- PROJECTS -->
  <section
    v-if="allProjects.length"
    class="cv-section"
  >
    <h2>SELECTED PROJECTS</h2>

    <article
      v-for="project in allProjects"
      :key="`cv-${project.index}-${project.title}`"
      class="cv-project"
    >
      <div>
        <h3>{{ project.title }}</h3>
        <span>{{ project.status }}</span>
      </div>
    </article>
  </section>


  <!-- EDUCATION -->
  <section
    v-if="technician.education?.length"
    class="cv-section"
  >
    <h2>EDUCATION</h2>

    <article
      v-for="education in technician.education"
      :key="`${education.qualification}-${education.institution}`"
      class="cv-entry"
    >
      <h3>{{ education.qualification }}</h3>
      <p>
        {{ education.institution }}
        <span v-if="education.year"> • {{ education.year }}</span>
      </p>
    </article>
  </section>


  <!-- CERTIFICATIONS -->
  <section
    v-if="technician.certifications?.length"
    class="cv-section"
  >
    <h2>CERTIFICATIONS</h2>

    <ul>
      <li
        v-for="certification in technician.certifications"
        :key="certification"
      >
        {{ certification }}
      </li>
    </ul>
  </section>

</section>

    <!-- CHAT -->
    <div class="chatbot-container">

      <div
        v-if="isChatOpen"
        class="chat-window"
      >

        <h4>
          QA Portfolio
        </h4>

        <p>
          Ask about Kabila's QA experience, automation work, technical
          projects, or testing approach.
        </p>

        <button
          class="chat-close"
          type="button"
          @click="isChatOpen = false"
        >
          Close
        </button>

      </div>

      <button
        class="chat-toggle"
        type="button"
        aria-label="Open portfolio chat"
        @click="isChatOpen = !isChatOpen"
      >
        Chat
      </button>

    </div>

    <!-- FOOTER -->
    <footer class="page-footer section-shell">

      <span>
        Kabila Mboya / Kisumu, Kenya
      </span>

      <a href="#about">
        Back to top &uarr;
      </a>

    </footer>

  </main>
</template>


<script setup>

import { onMounted, ref } from 'vue'
import profileImage from '../assets/images/Mboya.JPG'


/* =========================
   NAVIGATION
========================= */

const navItems = [
  { id: 'summary', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'qa-focus', label: 'QA Focus' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'projects', label: 'Projects' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'networking', label: 'Technical Foundation' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' }
]


/* =========================
   PROFESSIONAL STATS
========================= */

const stats = [
  {
    value: 'QA',
    label: 'Automation & Software Testing'
  },
  {
    value: 'UI + API',
    label: 'Testing Coverage'
  },
  {
    value: 'POD Lead',
    label: 'Testing Team Leadership'
  },
  {
    value: 'Kenya',
    label: 'Based in Kisumu'
  }
]


/* =========================
   EXPERIENCE
========================= */

const experience = [

  {
    title: 'QA / Testing POD Lead',
    period: 'Current',
    description:
      'Leading testing activities within an Agile product engineering environment.',
    points: [
      'Coordinate testing activities, task allocation, progress tracking, and release readiness.',
      'Work with developers, product managers, and other QA team members to understand requirements and testing risks.',
      'Plan and prioritize regression, smoke, sanity, and feature-level testing.',
      'Investigate failed tests and help distinguish application defects from automation or environment issues.',
      'Mentor team members and improve testing practices, communication, and delivery discipline.',
      'Communicate testing progress, blockers, defects, and release risks to stakeholders.'
    ]
  },

  {
    title: 'QA Automation Engineer',
    period: 'Software Quality Engineering',
    description:
      'Hands-on testing of a CRM web application using automation, API validation, and structured manual testing.',
    points: [
      'Develop and maintain Playwright automation using TypeScript and Node.js.',
      'Test CRM workflows across Tasks, Contacts, Companies, Pipelines, Events, Call Logs, Email Templates, and related modules.',
      'Validate UI workflows and backend/API behavior using REST APIs and Swagger.',
      'Build reusable automation helpers and test data utilities to reduce duplication and maintenance.',
      'Use stable DOM-based selectors and component-aware strategies for complex UI controls.',
      'Execute smoke, sanity, regression, integration, and exploratory testing.',
      'Investigate flaky automation and improve test reliability through better synchronization, assertions, and test setup.'
    ]
  },

  {
    title: 'Technical Support / Telecommunications',
    period: 'Earlier Technical Experience',
    description:
      'Technical support and telecommunications experience that built a foundation in troubleshooting and systems thinking.',
    points: [
      'Diagnose technical problems systematically and identify practical solutions.',
      'Work with users and technical teams to understand issues and communicate solutions clearly.',
      'Develop practical experience with telecommunications systems and technical infrastructure.',
      'Build a troubleshooting mindset that now informs software testing and defect investigation.'
    ]
  }

]


/* =========================
   QA FOCUS
========================= */

const qaAreas = [

  {
    number: '01',
    title: 'UI Automation',
    description:
      'Automating important user workflows with Playwright while prioritizing stable selectors, reliable synchronization, and maintainable test structure.'
  },

  {
    number: '02',
    title: 'API Testing',
    description:
      'Validating REST API behavior, preparing test data through APIs, and using backend operations to support reliable end-to-end test scenarios.'
  },

  {
    number: '03',
    title: 'Manual Testing',
    description:
      'Using exploratory, functional, regression, smoke, sanity, integration, and risk-based testing to identify defects before release.'
  },

  {
    number: '04',
    title: 'Failure Investigation',
    description:
      'Analyzing failed and flaky tests to determine whether the root cause is an application defect, test issue, synchronization problem, data problem, or environment condition.'
  },

  {
    number: '05',
    title: 'Quality Leadership',
    description:
      'Helping teams prioritize quality risks, coordinate testing activities, communicate blockers, and improve release confidence.'
  },

  {
    number: '06',
    title: 'Engineering Mindset',
    description:
      'Treating testing as part of software engineering rather than a final inspection step, with attention to maintainability, automation, and system behavior.'
  }

]


/* =========================
   TECHNICAL TOOLKIT
========================= */

const skillGroups = [

  {
    title: 'Automation & Programming',
    items: [
      'Playwright',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Test Automation',
      'Page Objects',
      'Reusable Test Helpers'
    ]
  },

  {
    title: 'API & QA',
    items: [
      'REST APIs',
      'API Testing',
      'Swagger',
      'Postman',
      'Manual Testing',
      'Regression',
      'Smoke Testing',
      'Sanity Testing',
      'Integration Testing',
      'Exploratory Testing',
      'Defect Investigation'
    ]
  },

  {
    title: 'Engineering & Delivery',
    items: [
      'Git',
      'GitHub',
      'Gitea',
      'Azure DevOps',
      'Agile',
      'Sprint Planning',
      'CI/CD Awareness',
      'Vue 3',
      'Vite',
      'Supabase',
      'HTML',
      'CSS'
    ]
  }

]


/* =========================
   REAL PROJECTS
========================= */

const projects = [

  {
    index: '01',
    type: 'QA Automation',
    title: 'CRM Test Automation',
    description:
      'A Playwright and TypeScript automation suite covering important CRM workflows across UI and API layers.',
    highlights: [
      'Playwright + TypeScript',
      'UI and API workflows',
      'Task automation',
      'Contact and Company workflows',
      'Pipeline scenarios',
      'Smoke / sanity / regression coverage',
      'Reusable test helpers',
      'API-supported test data'
    ],
    link: '#evidence',
    linkText: 'View technical evidence',
    external: false
  },

  {
    index: '02',
    type: 'Quality Engineering',
    title: 'Automation Reliability & Test Stability',
    description:
      'Improving unreliable automated tests by investigating synchronization, selectors, component behavior, test data, and environment-related failures.',
    highlights: [
      'Flaky test investigation',
      'Stable DOM selectors',
      'Synchronization strategy',
      'Visibility assertions',
      'Reusable utilities',
      'Test data preparation',
      'Failure triage'
    ],
    link: '#evidence',
    linkText: 'See problems solved',
    external: false
  },

  {
    index: '03',
    type: 'QA Leadership',
    title: 'Testing POD Leadership',
    description:
      'Coordinating testing activities across an Agile team while balancing manual testing, automation, release priorities, and engineering collaboration.',
    highlights: [
      'Sprint test planning',
      'Task allocation',
      'Regression strategy',
      'Release readiness',
      'Defect triage',
      'Mentoring',
      'Stakeholder communication'
    ],
    link: '#experience',
    linkText: 'View experience',
    external: false
  },

  {
    index: '04',
    type: 'Product Engineering',
    title: 'O!clok Digital Platform',
    description:
      'An independent digital platform involving frontend development, product workflows, deployment, business functionality, and technical problem solving.',
    highlights: [
      'Vue 3',
      'Vite',
      'JavaScript',
      'Supabase',
      'Git',
      'Netlify',
      'Responsive web development',
      'Product-oriented engineering'
    ],
    link: '/',
    linkText: 'Explore O!clok',
    external: false
  },

  {
    index: '05',
    type: 'Web Engineering',
    title: 'Business & Client Web Solutions',
    description:
      'Designing and developing practical web solutions for business use cases while considering functionality, usability, reliability, and maintainability.',
    highlights: [
      'Frontend development',
      'Responsive interfaces',
      'Business workflows',
      'API integration',
      'Debugging',
      'Deployment'
    ],
    link: '#contact',
    linkText: 'Discuss the work',
    external: false
  },

  {
    index: '06',
    type: 'Technical Foundation',
    title: 'Telecommunications & Technical Support',
    description:
      'Technical experience that developed a practical understanding of systems, troubleshooting, infrastructure, and user-facing technical problems.',
    highlights: [
      'Telecommunications systems',
      'Technical troubleshooting',
      'Systems thinking',
      'Customer support',
      'Problem diagnosis'
    ],
    link: '#networking',
    linkText: 'Technical background',
    external: false
  }

]


/* =========================
   TECHNICAL EVIDENCE
========================= */

const technicalEvidence = [

  {
    number: '01',
    title: 'Testing complex CRM workflows',
    description:
      'Worked across multiple CRM modules and relationships, including Tasks, Contacts, Companies, Pipelines, Events, Call Logs, Email Templates, and associated workflows.'
  },

  {
    number: '02',
    title: 'API-supported test automation',
    description:
      'Used API operations and structured test data to prepare reliable test scenarios instead of depending entirely on slow UI-based setup.'
  },

  {
    number: '03',
    title: 'Stable automation selectors',
    description:
      'Moved away from fragile UI selectors where appropriate and used stable DOM identifiers and component-aware strategies to improve automation reliability.'
  },

  {
    number: '04',
    title: 'Investigating flaky tests',
    description:
      'Analyzed failures caused by synchronization, filtering, visibility, data, and application timing instead of simply increasing timeouts without understanding the underlying problem.'
  },

  {
    number: '05',
    title: 'Reusable automation architecture',
    description:
      'Consolidated repeated automation logic into reusable helpers and structured test utilities to improve maintainability and reduce duplication.'
  },

  {
    number: '06',
    title: 'Release-focused QA',
    description:
      'Balanced feature testing, regression coverage, defect risk, automation status, and team capacity when supporting releases in an Agile environment.'
  }

]


/* =========================
   STATE
========================= */

const posts = ref([])
const isDarkMode = ref(false)
const isChatOpen = ref(false)


/* =========================
   PAGE INITIALIZATION
========================= */

onMounted(async () => {

  document.title =
    'Kabila Mboya | QA Automation Engineer'

  const description =
    'Kabila Mboya is a QA Automation Engineer and QA Lead specializing in Playwright, TypeScript, API testing, web application testing, and software quality engineering.'

  let metaDescription =
    document.querySelector('meta[name="description"]')

  if (!metaDescription) {

    metaDescription =
      document.createElement('meta')

    metaDescription.name = 'description'

    document.head.appendChild(metaDescription)
  }

  metaDescription.content = description

  isDarkMode.value =
    localStorage.getItem('kabila-theme') === 'dark'

  try {

    const response =
      await fetch('/linkedin-posts.json')

    if (response.ok) {
      posts.value = await response.json()
    }

  } catch (error) {

    posts.value = []

  }

})


/* =========================
   THEME
========================= */

const toggleTheme = () => {

  isDarkMode.value =
    !isDarkMode.value

  localStorage.setItem(
    'kabila-theme',
    isDarkMode.value
      ? 'dark'
      : 'light'
  )

}


/* =========================
   CV
========================= */

const downloadCv = () => {

  window.print()

}


/* =========================
   DATE FORMAT
========================= */

const formatDate = (date) => {

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      month: 'short',
      year: 'numeric'
    }
  ).format(new Date(date))

}

</script>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');


/* =========================
   BASE
========================= */

.kabila-page {

  --ink: var(--text);
  --muted: var(--text-muted);
  --paper: var(--surface-alt);
  --card: var(--surface);
  --line: var(--border);
  --lime: #d1fae5;
  --teal: var(--color-secondary);

  max-width: 1000px;
  min-height: 100vh;
  margin: 0 auto;

  background: var(--paper);
  color: var(--ink);

  font-family:
    'Manrope',
    Arial,
    sans-serif;

  padding:
    2rem
    clamp(1rem, 4vw, 2rem);

  transition:
    background .3s,
    color .3s;

}


.kabila-page.is-dark {

  --ink: var(--text-dark);
  --muted: var(--text-muted-dark);
  --paper: var(--bg-dark);
  --card: var(--surface-dark);
  --line: var(--border-dark);
  --lime: #164e3d;
  --teal: #6ee7b7;

}


/* =========================
   GLOBAL
========================= */

.site-header,
.section-shell,
.quick-nav {

  max-width: 1180px;
  margin-inline: auto;

}


h1,
h2,
h3,
p {

  margin-top: 0;

}


h1 {

  font-size:
    clamp(3rem, 8vw, 6rem);

  line-height: .9;

  letter-spacing: -.05em;

  margin:
    1rem 0
    1.5rem;

}


h1 span,
h2 em {

  color: var(--teal);
  font-style: normal;

}


h2 {

  font-size:
    clamp(1.8rem, 4vw, 3rem);

  line-height: 1.05;

  letter-spacing: -.04em;

  margin:
    1rem 0;

}


/* =========================
   HEADER
========================= */

.site-header {

  display: flex;

  justify-content:
    space-between;

  align-items: center;

  padding:
    .35rem 0
    3rem;

}


.back-link,
.header-link,
.text-link {

  color: inherit;

  text-decoration: none;

  font-weight: 700;

}


.header-actions {

  display: flex;

  gap: 1.25rem;

  align-items: center;

}


.theme-toggle {

  background: none;

  border: 0;

  color: inherit;

  font: inherit;

  cursor: pointer;

  font-weight: 700;

  border-bottom:
    1px solid currentColor;

  padding:
    .2rem 0;

}


/* =========================
   HERO
========================= */

.hero {

  display: grid;

  grid-template-columns:
    1.15fr .85fr;

  gap: 2rem;

  align-items: center;

  background: var(--card);

  border:
    1px solid var(--line);

  border-radius:
    var(--radius-md);

  box-shadow:
    var(--shadow-sm);

  padding: 2rem;

}


.eyebrow,
.section-kicker,
.timeline-period,
.project-topline,
.article-card p {

  font:
    500 .72rem
    'DM Mono',
    monospace;

  text-transform: uppercase;

  letter-spacing: .08em;

  color: var(--teal);

}


.role {

  font-size:
    clamp(1rem, 2vw, 1.2rem);

  font-weight: 700;

  max-width: 38rem;

}


.role b {

  color: var(--teal);

  margin:
    0 .25rem;

}


.hero-intro {

  color: var(--muted);

  font-size: 1rem;

  line-height: 1.7;

  max-width: 38rem;

}


/* =========================
   BUTTONS
========================= */

.hero-actions {

  display: flex;

  flex-wrap: wrap;

  gap: 1rem;

  align-items: center;

  margin-top: 2rem;

}


.button {

  display: inline-flex;

  align-items: center;

  gap: .85rem;

  border:
    1px solid transparent;

  padding:
    .85rem 1.1rem;

  font:
    700 .85rem
    'Manrope';

  text-decoration: none;

  cursor: pointer;

}


.button span {

  font-size: 1.1rem;

}


.button-primary {

  background: var(--ink);

  color: var(--paper);

}


.button-outline {

  border-color: var(--ink);

  color: var(--ink);

}


.button-light {

  background: var(--lime);

  color: #17211e;

  margin-top: 1.5rem;

}


.text-link {

  font-size: .85rem;

  border-bottom:
    1px solid currentColor;

  padding-bottom: .18rem;

}


/* =========================
   HERO IMAGE
========================= */

.hero-visual {

  position: relative;

}


.image-frame {

  background: var(--lime);

  padding:
    1rem 1rem 0;

  border-radius:
    var(--radius-md);

  max-width: 18rem;

  margin-left: auto;

}


.profile-image {

  display: block;

  width: 100%;

  aspect-ratio: .82;

  object-fit: cover;

  object-position: center top;

  filter: grayscale(100%);

  border-radius:
    var(--radius-sm)
    var(--radius-sm)
    0 0;

}


.availability {

  display: flex;

  gap: .55rem;

  align-items: center;

  background: var(--card);

  border:
    1px solid var(--line);

  box-shadow:
    var(--shadow-sm);

  padding:
    .75rem 1rem;

  font-size: .75rem;

  font-weight: 700;

  position: absolute;

  left: 0;

  bottom: 1rem;

}


.availability span {

  width: .5rem;

  height: .5rem;

  background: #10b981;

  border-radius: 50%;

}


/* =========================
   STATS
========================= */

.stats {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 1rem;

  margin-top: 1.25rem;

}


.stat {

  background: var(--card);

  border:
    1px solid var(--line);

  border-radius:
    var(--radius-sm);

  box-shadow:
    var(--shadow-sm);

  padding: 1rem;

}


.stat strong {

  display: block;

  font-size: 1.35rem;

  margin-bottom: .35rem;

}


.stat span {

  color: var(--muted);

  font-size: .75rem;

}


/* =========================
   NAV
========================= */

.quick-nav {

  display: flex;

  gap: 1.5rem;

  padding:
    1.25rem 0
    2rem;

  overflow: auto;

}


.quick-nav a {

  color: var(--muted);

  text-decoration: none;

  white-space: nowrap;

  font-size: .75rem;

  font-weight: 700;

}


.quick-nav a:hover {

  color: var(--teal);

}


/* =========================
   SECTIONS
========================= */

.content-section {

  padding: 1.5rem;

  margin-top: 1.25rem;

  background: var(--card);

  border:
    1px solid var(--line);

  border-radius:
    var(--radius-md);

  box-shadow:
    var(--shadow-sm);

}


.summary-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 2rem;

}


.summary-copy {

  color: var(--muted);

  font-size: 1rem;

  line-height: 1.75;

  max-width: 38rem;

}


.summary-copy > p:first-child {

  color: var(--ink);

  font-size: 1.2rem;

  line-height: 1.4;

  font-weight: 700;

}


.pull-quote {

  border-left:
    3px solid var(--teal);

  padding-left: 1rem;

  color: var(--ink);

  font-weight: 700;

}


/* =========================
   SECTION HEADINGS
========================= */

.section-heading {

  display: flex;

  justify-content:
    space-between;

  align-items: end;

  margin-bottom: 2.5rem;

}


.section-number {

  color: var(--muted);

  font:
    500 .8rem
    'DM Mono';

}


/* =========================
   TIMELINE
========================= */

.timeline {

  max-width: 58rem;

  margin-left: 10%;

}


.timeline-item {

  display: grid;

  grid-template-columns:
    1.3rem 1fr;

  gap: 1.4rem;

  border-top:
    1px solid var(--line);

  padding: 2rem 0;

}


.timeline-marker {

  width: .65rem;

  height: .65rem;

  background: var(--lime);

  margin-top: .35rem;

}


.timeline-period {

  margin-bottom: .7rem;

}


.timeline-item h3 {

  font-size: 1.6rem;

  margin-bottom: .75rem;

}


.timeline-description {

  color: var(--muted);

  line-height: 1.65;

}


.timeline-item ul {

  padding-left: 1.1rem;

  color: var(--muted);

  line-height: 1.8;

}


/* =========================
   QA FOCUS
========================= */

.qa-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 1rem;

}


.qa-card {

  border:
    1px solid var(--line);

  padding: 1.5rem;

  min-height: 13rem;

}


.qa-number {

  font:
    500 .7rem
    'DM Mono';

  color: var(--teal);

}


.qa-card h3 {

  font-size: 1.2rem;

  margin:
    2rem 0 .75rem;

}


.qa-card p {

  color: var(--muted);

  font-size: .9rem;

  line-height: 1.65;

}


/* =========================
   SKILLS
========================= */

.skill-groups {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 2rem;

}


.skill-group {

  border-top:
    2px solid var(--ink);

  padding-top: 1rem;

}


.skill-group h3 {

  font-size: 1rem;

}


.chip-list {

  display: flex;

  flex-wrap: wrap;

  gap: .5rem;

}


.chip {

  border:
    1px solid var(--line);

  padding:
    .5rem .7rem;

  color: var(--muted);

  font-size: .75rem;

  background: var(--card);

}


/* =========================
   PROJECTS
========================= */

.project-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 1rem;

}


.project-card {

  background: var(--card);

  border:
    1px solid var(--line);

  padding: 1.5rem;

  min-height: 25rem;

  display: flex;

  flex-direction: column;

  transition:
    transform .25s,
    box-shadow .25s;

}


.project-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 12px 28px
    rgba(23, 33, 30, .1);

}


.project-topline {

  display: flex;

  justify-content:
    space-between;

  margin-bottom: 2.5rem;

}


.project-card h3 {

  font-size: 1.35rem;

}


.project-card p {

  color: var(--muted);

  line-height: 1.65;

}


.project-card ul {

  padding-left: 1.1rem;

  color: var(--muted);

  line-height: 1.8;

  margin-bottom: 1.5rem;

}


.project-card .text-link {

  margin-top: auto;

  align-self: flex-start;

}


/* =========================
   TECHNICAL EVIDENCE
========================= */

.evidence-list {

  border-top:
    1px solid var(--line);

}


.evidence-item {

  display: grid;

  grid-template-columns:
    4rem 1fr;

  gap: 1.5rem;

  padding:
    1.5rem 0;

  border-bottom:
    1px solid var(--line);

}


.evidence-index {

  color: var(--teal);

  font:
    500 .75rem
    'DM Mono';

}


.evidence-item h3 {

  font-size: 1.15rem;

  margin-bottom: .5rem;

}


.evidence-item p {

  color: var(--muted);

  line-height: 1.7;

  max-width: 45rem;

}


/* =========================
   NETWORKING
========================= */

.networking-section {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 2rem;

}


.networking-copy h2 {

  max-width: 30rem;

}


/* =========================
   WRITING
========================= */

.section-lede {

  color: var(--muted);

  max-width: 42rem;

  line-height: 1.7;

}


.article-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 1rem;

  margin-top: 2rem;

}


.article-card {

  color: inherit;

  text-decoration: none;

  border:
    1px solid var(--line);

  background: var(--card);

  transition:
    transform .25s,
    box-shadow .25s;

}


.article-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 12px 28px
    rgba(23, 33, 30, .1);

}


.article-card img {

  width: 100%;

  height: 10rem;

  object-fit: cover;

  filter: grayscale(100%);

}


.article-card div {

  padding: 1.1rem;

}


.article-card p {

  margin-bottom: 1rem;

}


.article-card h3 {

  font-size: 1rem;

  line-height: 1.35;

}


.article-card span {

  color: var(--teal);

  font-size: .75rem;

  font-weight: 700;

}


.empty-state {

  color: var(--muted);

  padding: 1rem 0;

}


/* =========================
   CONTACT
========================= */

.contact-section {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 5rem;

  background: var(--teal);

  color: #f2f5eb;

  padding-block: 5rem;

  margin-top: 4rem;

}


.contact-section .section-kicker {

  color: var(--lime);

}


.contact-section h2 em {

  color: var(--lime);

}


.contact-section p {

  line-height: 1.7;

  max-width: 34rem;

}


.contact-links {

  display: grid;

  border-top:
    1px solid
    rgba(255, 255, 255, .3);

}


.contact-links a {

  display: flex;

  justify-content:
    space-between;

  gap: 1rem;

  border-bottom:
    1px solid
    rgba(255, 255, 255, .3);

  padding: .8rem 0;

  color: inherit;

  text-decoration: none;

  font-weight: 700;

  font-size: .85rem;

}


.contact-links span {

  font-weight: 400;

  opacity: .75;

  text-align: right;

}


/* =========================
   CHAT
========================= */

.chatbot-container {

  position: fixed;

  right: 1.25rem;

  bottom: 1.25rem;

  z-index: 10;

}


.chat-window {

  width:
    min(20rem, calc(100vw - 2.5rem));

  background: var(--card);

  border:
    1px solid var(--line);

  padding: 1rem;

  margin-bottom: .6rem;

  box-shadow:
    0 10px 25px
    rgba(0, 0, 0, .15);

}


.chat-window h4 {

  margin-bottom: .5rem;

}


.chat-window p {

  color: var(--muted);

  font-size: .8rem;

  line-height: 1.6;

}


.chat-toggle,
.chat-close {

  border: 0;

  background: var(--lime);

  color: #17211e;

  padding:
    .7rem 1rem;

  font:
    700 .75rem
    'Manrope';

  cursor: pointer;

}


.chat-close {

  background: var(--ink);

  color: var(--paper);

}


/* =========================
   FOOTER
========================= */

.page-footer {

  display: flex;

  justify-content:
    space-between;

  padding-block: 1.5rem;

  color: var(--muted);

  font:
    500 .7rem
    'DM Mono';

}


.page-footer a {

  color: inherit;

  text-decoration: none;

}


/* =========================
   TABLET / MOBILE
========================= */

@media (max-width: 900px) {

  .hero,
  .summary-grid,
  .networking-section,
  .contact-section {

    grid-template-columns: 1fr;

    gap: 2.5rem;

  }


  .hero {

    padding-bottom: 3rem;

  }


  .hero-visual {

    max-width: 24rem;

    margin: auto;

    width: 100%;

  }


  .stats {

    grid-template-columns:
      repeat(2, 1fr);

    gap: 1rem;

  }


  .timeline {

    margin-left: 0;

  }


  .skill-groups,
  .project-grid,
  .article-grid {

    grid-template-columns: 1fr;

  }


  .qa-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .project-card {

    min-height: auto;

  }


  .content-section {

    padding-block: 3.5rem;

  }

}


@media (max-width: 600px) {

  .kabila-page {

    padding-inline: 1rem;

  }


  .site-header {

    padding-bottom: 2rem;

  }


  .header-link {

    display: none;

  }


  h1 {

    font-size: 4.5rem;

  }


  .hero-actions {

    align-items: flex-start;

    flex-direction: column;

  }


  .stats {

    grid-template-columns: 1fr;

  }


  .qa-grid {

    grid-template-columns: 1fr;

  }


  .evidence-item {

    grid-template-columns:
      2.5rem 1fr;

    gap: 1rem;

  }


  .contact-section {

    margin-inline: -1rem;

    padding-inline: 1rem;

  }


  .page-footer {

    gap: 1rem;

    flex-direction: column;

  }

}


/* =========================
   PRINT / CV
========================= */

/* =========================================
   PRINT CV
   ========================================= */

.print-cv {
  display: none;
}


/* =========================================
   PRINT MODE
   ========================================= */

@media print {

  /* Hide the actual website */
  .technician-page > *:not(.print-cv) {
    display: none !important;
  }

  /* Show only CV */
  .print-cv {
    display: block !important;

    width: 100%;
    max-width: 800px;

    margin: 0 auto;

    padding: 0;

    background: #fff;
    color: #111;

    font-family: Arial, Helvetica, sans-serif;
  }


  /* CV HEADER */

  .cv-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    padding-bottom: 18px;
    margin-bottom: 20px;

    border-bottom: 2px solid #111;
  }

  .cv-header h1 {
    margin: 0 0 6px;

    font-size: 30px;
    line-height: 1.1;

    letter-spacing: -0.5px;
  }

  .cv-role {
    margin: 0 0 8px;

    font-size: 15px;
    font-weight: 700;
  }

  .cv-contact {
    margin: 0;

    font-size: 11px;
    line-height: 1.6;
    color: #444;
  }

  .cv-link {
    margin: 3px 0 0;

    font-size: 10px;
    color: #444;
  }


  /* PHOTO */

  .cv-photo {
    width: 85px;
    height: 105px;

    object-fit: cover;

    border-radius: 4px;
  }


  /* SECTIONS */

  .cv-section {
    margin-bottom: 20px;
  }

  .cv-section h2 {
    margin: 0 0 8px;

    padding-bottom: 4px;

    border-bottom: 1px solid #bbb;

    font-size: 12px;
    font-weight: 800;

    letter-spacing: .08em;
  }

  .cv-section p {
    margin: 0;

    font-size: 11px;
    line-height: 1.6;
  }


  /* EXPERIENCE */

  .cv-entry {
    margin-bottom: 14px;
  }

  .cv-entry-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .cv-entry h3,
  .cv-project h3 {
    margin: 0 0 2px;

    font-size: 12px;
    font-weight: 700;
  }

  .cv-entry-header > span {
    font-size: 10px;
    color: #555;
    white-space: nowrap;
  }

  .cv-company {
    font-size: 10px !important;
    font-weight: 600;
    color: #555;
  }

  .cv-entry ul {
    margin: 5px 0 0;
    padding-left: 16px;
  }

  .cv-entry li {
    margin-bottom: 3px;

    font-size: 10.5px;
    line-height: 1.45;
  }


  /* SKILLS */

  .cv-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .cv-skills span {
    padding: 4px 7px;

    border: 1px solid #bbb;
    border-radius: 3px;

    font-size: 9.5px;
  }


  /* PROJECTS */

  .cv-project {
    margin-bottom: 8px;
  }

  .cv-project > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cv-project span {
    font-size: 9px;
    color: #666;
    text-transform: uppercase;
  }


  /* PAGE SETTINGS */

  @page {
    size: A4;
    margin: 16mm 15mm;
  }

  .cv-section,
  .cv-entry,
  .cv-project {
    break-inside: avoid;
  }
}

</style>