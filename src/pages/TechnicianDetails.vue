<template>
  <main v-if="technician" class="technician-page">
    <!-- HEADER -->
    <header class="site-header">
      <RouterLink to="/technicians" class="back-link">
        &larr; Technicians
      </RouterLink>

      <div class="header-actions">
        <a
          v-if="technician.socials?.linkedin"
          :href="technician.socials.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="header-link"
        >
          LinkedIn
        </a>

        <span class="availability">
          <i></i>
          {{ technician.available ? 'Available for work' : 'Profile active' }}
        </span>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero section-shell">
      <div class="hero-copy">
        <p class="eyebrow">
          {{ isKabila ? 'Software quality & test automation' : 'Oclok technician profile' }}
        </p>

        <h1>{{ technician.name }}</h1>

        <p class="role">
          {{ technician.specialty }}

          <b>&bull;</b>

          {{ technician.experience || 0 }}+ years technical experience
        </p>

        <p class="hero-intro">
          {{ technician.bio || 'A trusted Oclok professional delivering reliable work and thoughtful service.' }}
        </p>

        <div class="hero-actions">
          <a
            class="button button-primary"
            :href="`mailto:${technician.contact.email}`"
          >
            Contact Me
            <span>&rarr;</span>
          </a>

          <a
            v-if="technician.contact.phone"
            class="button button-outline"
            :href="`tel:${technician.contact.phone}`"
          >
            Call
            <span>&rarr;</span>
          </a>

          <a class="text-link" href="#projects">
            View Projects &rarr;
          </a>
        </div>
      </div>

      <div class="hero-visual">
        <div class="image-frame">
          <img
            :src="technician.image"
            :alt="`${technician.name} profile photo`"
            class="profile-image"
            @error="useFallbackImage"
          />
        </div>

        <div class="location-card">
          &#9679; {{ technician.location || 'Kenya' }}
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats section-shell">
      <div class="stat">
        <strong>{{ technician.experience || 0 }}+</strong>
        <span>Years technical experience</span>
      </div>

      <div class="stat">
        <strong>{{ completedProjects.length }}</strong>
        <span>Completed projects</span>
      </div>

      <div class="stat">
        <strong>{{ ongoingProjects.length }}</strong>
        <span>Active projects</span>
      </div>

      <div class="stat">
        <strong>{{ technician.available ? 'Open' : 'Active' }}</strong>
        <span>Current status</span>
      </div>
    </section>

    <!-- NAVIGATION -->
    <nav class="quick-nav section-shell">
      <a href="#summary">Profile</a>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#skills">Capabilities</a>
      <a href="#contact">Contact</a>
    </nav>

    <!-- PROFILE -->
    <section
      id="summary"
      class="content-section section-shell summary-grid"
    >
      <div>
        <p class="section-kicker">01 / Profile</p>

        <h2>
          {{ isKabila ? 'Quality is an' : 'Work that earns' }}
          <br />
          <em>
            {{ isKabila ? 'engineering discipline.' : 'confidence.' }}
          </em>
        </h2>
      </div>

      <div class="summary-copy">
        <p>
          {{ technician.bio }}
        </p>

        <p>
          {{ technician.summary }}
        </p>

        <p class="pull-quote">
          {{ technician.quote }}
        </p>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section
      v-if="technician.experienceDetails?.length"
      id="experience"
      class="content-section section-shell"
    >
      <div class="section-heading">
        <div>
          <p class="section-kicker">
            02 / Experience
          </p>

          <h2>
            {{ isKabila ? 'How I create confidence' : 'Professional experience' }}
          </h2>
        </div>

        <span class="section-number">02</span>
      </div>

      <div class="timeline">
        <article
          v-for="item in technician.experienceDetails"
          :key="item.title"
          class="timeline-item"
        >
          <div class="timeline-marker"></div>

          <div class="timeline-content">
            <p class="timeline-period">
              {{ item.period }}
            </p>

            <h3>
              {{ item.title }}
            </h3>

            <p class="timeline-description">
              {{ item.description }}
            </p>

            <ul v-if="item.points?.length">
              <li
                v-for="point in item.points"
                :key="point"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <!-- PROJECTS -->
    <section
      id="projects"
      class="content-section section-shell"
    >
      <div class="section-heading">
        <div>
          <p class="section-kicker">
            {{ isKabila ? '03 / Selected work' : '03 / Selected work' }}
          </p>

          <h2>
            {{ isKabila ? 'Evidence over adjectives' : 'Projects and progress' }}
          </h2>
        </div>

        <span class="section-number">03</span>
      </div>

      <div class="project-grid">
        <article
          v-for="project in allProjects"
          :key="`${project.title}-${project.index}`"
          class="project-card"
        >
          <div class="project-topline">
            <span>{{ project.status }}</span>
            <span>{{ project.index }}</span>
          </div>

          <h3>
            {{ project.title }}
          </h3>

          <p>
            {{ project.description }}
          </p>

          <ul
            v-if="project.highlights?.length"
            class="project-highlights"
          >
            <li
              v-for="highlight in project.highlights"
              :key="highlight"
            >
              {{ highlight }}
            </li>
          </ul>

          <a
            class="text-link"
            href="#contact"
          >
            Discuss project &rarr;
          </a>
        </article>

        <p
          v-if="!allProjects.length"
          class="empty-state"
        >
          Projects will be added here as work is completed.
        </p>
      </div>
    </section>

    <!-- CAPABILITIES -->
    <section
      id="skills"
      class="content-section section-shell"
    >
      <div class="section-heading">
        <div>
          <p class="section-kicker">
            04 / Capabilities
          </p>

          <h2>
            {{ isKabila ? 'Tools I use to ship quality' : 'Where expertise meets action' }}
          </h2>
        </div>

        <span class="section-number">04</span>
      </div>

      <div
        v-for="group in capabilityGroups"
        :key="group.title"
        class="capability-group"
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
          {{ isKabila ? 'Build quality' : 'Start with a' }}
          <br />

          <em>
            {{ isKabila ? 'into the work.' : 'conversation.' }}
          </em>
        </h2>
      </div>

      <div>
        <p>
          Interested in working with {{ technician.name }}?
          Reach out directly to discuss a project, collaboration,
          technical challenge, or service request.
        </p>

        <div class="contact-links">
          <a :href="`mailto:${technician.contact.email}`">
            Email
            <span>
              {{ technician.contact.email }}
            </span>
          </a>

          <a
            v-if="technician.contact.phone"
            :href="`tel:${technician.contact.phone}`"
          >
            Phone
            <span>
              {{ technician.contact.phone }}
            </span>
          </a>

          <a
            v-if="technician.socials?.linkedin"
            :href="technician.socials.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <span>
              Connect online
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- CV -->
    <div class="cv-action">
      <button
        class="button button-primary"
        type="button"
        @click="downloadCv"
      >
        Download CV
        <span>&darr;</span>
      </button>
    </div>

    <!-- FOOTER -->
    <footer class="page-footer section-shell">
      <span>
        {{ technician.name }} / {{ technician.location || 'Kenya' }}
      </span>

      <a href="#summary">
        Back to top &uarr;
      </a>
    </footer>
  </main>

  <div
    v-else
    class="not-found"
  >
    Technician profile not found.
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import techniciansData from '../data/technicians.json';
import { applyProfileOverride } from '../services/userProfiles.service';

const technician = ref(null);

const route =
  window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop() || '';

const fallbackImage = '/images/dokta.jpg';

/*
|--------------------------------------------------------------------------
| KABILA'S DEDICATED PROFILE
|--------------------------------------------------------------------------
|
| This is intentionally NOT stored in technicians.json.
|
| technicians.json remains the directory/index for technicians.
| Kabila's detailed professional profile lives here for now.
|
| Later this object can move to Supabase and the UI can remain
| largely unchanged.
|
*/

const kabilaProfile = {
  id: 1,
  slug: 'kabila-mboya',

  name: 'Laurent Mboya',

  specialty: 'QA Automation Engineer',

  image: '/images/Mboya.JPG',

  experience: 5,

  available: true,

  location: 'Kisumu, Kenya',

  bio:
    'QA Automation Engineer and Testing POD Lead with hands-on experience in web application testing, test automation, API validation, defect investigation, regression testing, and Agile software delivery.',

  summary:
    'I combine a structured QA mindset with practical software engineering skills to help teams identify risk early, automate repetitive validation, investigate failures, and ship reliable software. My experience includes Playwright, TypeScript, JavaScript, Node.js, API testing, Azure DevOps, Git, and modern web application development.',

  quote:
    'Quality is not a testing phase. It is embedded throughout the software development lifecycle.',

  contact: {
    phone: '+254 732 379 292',
    email: 'kabilamboya@gmail.com'
  },

  socials: {
    linkedin: 'https://linkedin.com/in/kabilamboya'
  },

  /*
  |--------------------------------------------------------------------------
  | PROFESSIONAL EXPERIENCE
  |--------------------------------------------------------------------------
  */

  experienceDetails: [
    {
      title: 'Testing POD Lead',
      period: 'Current role',
      description:
        'Lead testing activities for a software product while coordinating manual testing, automation, release readiness, and team delivery.',

      points: [
        'Coordinate testing activities across product modules and sprint releases.',
        'Plan regression, smoke, sanity, and exploratory testing activities.',
        'Collaborate with developers and product stakeholders to investigate defects and clarify requirements.',
        'Monitor testing progress, identify blockers, and communicate release risks.',
        'Mentor QA team members and promote structured testing practices.'
      ]
    },

    {
      title: 'QA Automation Engineer',
      period: 'Previous QA experience',
      description:
        'Develop and maintain automated tests for web applications and business workflows using modern JavaScript and TypeScript tooling.',

      points: [
        'Build UI automation using Playwright and TypeScript.',
        'Validate API workflows and backend behaviour.',
        'Create reusable test utilities and automation helpers.',
        'Investigate flaky tests and improve test reliability.',
        'Use stable selectors and structured test data to reduce automation maintenance.'
      ]
    },

    {
      title: 'Technical & Software Development',
      period: 'Earlier technical experience',
      description:
        'Developed a broad technical foundation through telecommunications, technical support, web development, and digital product work.',

      points: [
        'Troubleshoot technical systems and investigate complex problems.',
        'Build and maintain web applications using modern frontend technologies.',
        'Work with Git-based development workflows.',
        'Understand systems from both technical and user perspectives.'
      ]
    }
  ],

  /*
  |--------------------------------------------------------------------------
  | PROJECTS
  |--------------------------------------------------------------------------
  */

  projects: {
    continuing: [
      {
        title: 'CRM UI & API Test Automation',
        status: 'Ongoing',

        description:
          'Automation and validation of complex CRM workflows across user interfaces and APIs, with a focus on maintainability, reliability, and meaningful regression coverage.',

        highlights: [
          'Playwright',
          'TypeScript',
          'UI automation',
          'API validation',
          'Reusable test utilities',
          'Regression coverage'
        ]
      },

      {
        title: 'QA Automation Framework Improvement',
        status: 'Ongoing',

        description:
          'Improving an existing automation framework by consolidating helpers, strengthening selectors, improving test data handling, and investigating flaky test behaviour.',

        highlights: [
          'Reusable helpers',
          'Stable selectors',
          'Test reliability',
          'Flaky test investigation',
          'Test data management',
          'CI-ready automation'
        ]
      }
    ],

    completed: [
      {
        title: 'CRM Workflow & Integration Testing',
        status: 'Completed',

        description:
          'End-to-end testing of CRM workflows involving records, tasks, contacts, companies, pipelines, conversations, and related business processes.',

        highlights: [
          'Functional testing',
          'Integration testing',
          'Regression testing',
          'API testing',
          'Edge-case analysis',
          'Defect investigation'
        ]
      },

      {
        title: 'O!clok Digital Platform',
        status: 'Completed',

        description:
          'Designed and developed web-based business and service experiences while applying software quality practices throughout the product development process.',

        highlights: [
          'Vue 3',
          'Vite',
          'Supabase',
          'Responsive UI',
          'Business workflows',
          'Product quality'
        ]
      }
    ]
  },

  /*
  |--------------------------------------------------------------------------
  | CAPABILITIES
  |--------------------------------------------------------------------------
  */

  capabilityGroups: [
    {
      title: 'Test automation',
      items: [
        'Playwright',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'UI Automation',
        'End-to-End Testing',
        'Regression Automation'
      ]
    },

    {
      title: 'API & backend testing',
      items: [
        'REST APIs',
        'API Testing',
        'Swagger',
        'Postman',
        'Backend Validation',
        'Integration Testing',
        'Test Data'
      ]
    },

    {
      title: 'QA practice',
      items: [
        'Manual Testing',
        'Exploratory Testing',
        'Smoke Testing',
        'Sanity Testing',
        'Regression Testing',
        'Defect Investigation',
        'Edge-Case Analysis'
      ]
    },

    {
      title: 'Engineering & delivery',
      items: [
        'Git',
        'Azure DevOps',
        'Agile',
        'CI/CD Awareness',
        'Vue',
        'React',
        'HTML',
        'CSS',
        'SQL',
        'Supabase'
      ]
    }
  ]
};

/*
|--------------------------------------------------------------------------
| LOAD PROFILE
|--------------------------------------------------------------------------
|
| Kabila gets his dedicated profile.
| Everyone else continues using technicians.json.
|
*/

const found = techniciansData.find(
  (item) =>
    item.slug === route ||
    String(item.id) === route
);

const isKabila = route === 'kabila-mboya';

if (isKabila) {
  technician.value = kabilaProfile;
} else if (found) {
  technician.value = applyProfileOverride(found);
}

/*
|--------------------------------------------------------------------------
| PROJECT DATA
|--------------------------------------------------------------------------
*/

const completedProjects = computed(() => {
  return technician.value?.projects?.completed || [];
});

const ongoingProjects = computed(() => {
  return technician.value?.projects?.continuing || [];
});

const allProjects = computed(() => {
  const ongoing = ongoingProjects.value.map((project) => {
    if (typeof project === 'string') {
      return {
        title: project,
        status: 'Ongoing',
        description:
          'Current work being managed and delivered through the Oclok network.',
        highlights: []
      };
    }

    return {
      ...project,
      status: project.status || 'Ongoing'
    };
  });

  const completed = completedProjects.value.map((project) => {
    if (typeof project === 'string') {
      return {
        title: project,
        status: 'Completed',
        description:
          'Successfully delivered project work for an Oclok customer or partner.',
        highlights: []
      };
    }

    return {
      ...project,
      status: project.status || 'Completed'
    };
  });

  return [...ongoing, ...completed].map((project, index) => ({
    ...project,
    index: String(index + 1).padStart(2, '0')
  }));
});

/*
|--------------------------------------------------------------------------
| CAPABILITIES
|--------------------------------------------------------------------------
*/

const capabilityGroups = computed(() => {
  if (isKabila) {
    return technician.value?.capabilityGroups || [];
  }

  return [
    {
      title: 'Professional capabilities',
      items: [
        technician.value?.specialty,
        'Customer communication',
        'Project delivery',
        'Quality service',
        'Oclok professional network'
      ].filter(Boolean)
    }
  ];
});

/*
|--------------------------------------------------------------------------
| IMAGE FALLBACK
|--------------------------------------------------------------------------
*/

const useFallbackImage = (event) => {
  event.target.src = fallbackImage;
};

/*
|--------------------------------------------------------------------------
| PAGE TITLE
|--------------------------------------------------------------------------
*/

onMounted(() => {
  if (technician.value) {
    document.title = `${technician.value.name} | Oclok`;
  }
});

/*
|--------------------------------------------------------------------------
| CV PRINT
|--------------------------------------------------------------------------
*/

const downloadCv = () => {
  const name = (technician.value?.name || 'Technician')
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  const filename = `${name || 'technician'}-cv`;

  const previousTitle = document.title;
  // add a body class to hide floating UI during print
  document.body.classList.add('oclok-printing');

  document.title = filename;

  window.print();

  document.title = previousTitle;

  // remove the printing class shortly after to restore UI
  setTimeout(() => {
    document.body.classList.remove('oclok-printing');
  }, 200);
};
</script>

<style scoped>
.technician-page {
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
  padding: 2rem clamp(1rem, 4vw, 2rem);

  background: var(--paper);
  color: var(--ink);

  font-family: Manrope, Arial, sans-serif;
}

.site-header,
.section-shell,
.quick-nav {
  max-width: 1180px;
  margin-inline: auto;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0 3rem;
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
  align-items: center;
  gap: 1rem;
}

.availability {
  color: var(--muted);
  font-size: 0.75rem;
}

.availability i {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.4rem;
  border-radius: 50%;
  background: #10b981;
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 2rem;
  align-items: center;

  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);

  padding: 2rem;
}

.eyebrow,
.section-kicker,
.project-topline,
.timeline-period {
  font: 500 0.72rem 'DM Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--teal);
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.05em;
  margin: 1rem 0 1.5rem;
}

h2 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 1rem 0;
}

h1 em,
h2 em {
  color: var(--teal);
  font-style: normal;
}

.role {
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
}

.role b {
  color: var(--teal);
  margin: 0 0.25rem;
}

.hero-intro,
.summary-copy,
.timeline-description {
  color: var(--muted);
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
}

.button {
  display: inline-flex;
  gap: 0.85rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid transparent;
  text-decoration: none;
  font: 700 0.85rem Manrope;
  cursor: pointer;
}

.button-primary {
  background: var(--ink);
  color: var(--paper);
}

.button-outline {
  border-color: var(--ink);
  color: var(--ink);
}

.text-link {
  font-size: 0.85rem;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.18rem;
}

.hero-visual {
  position: relative;
}

.image-frame {
  max-width: 18rem;
  margin-left: auto;
  padding: 1rem 1rem 0;
  background: var(--lime);
  border-radius: var(--radius-md);
}

.profile-image {
  display: block;
  width: 100%;
  aspect-ratio: 0.82;
  object-fit: cover;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.location-card {
  position: absolute;
  left: 0;
  bottom: 1rem;

  padding: 0.75rem 1rem;

  background: var(--card);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);

  font-size: 0.75rem;
  font-weight: 700;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1.25rem;
}

.stat {
  padding: 1rem;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.stat strong {
  display: block;
  font-size: 1.35rem;
  margin-bottom: 0.35rem;
}

.stat span {
  color: var(--muted);
  font-size: 0.75rem;
}

.quick-nav {
  display: flex;
  gap: 1.5rem;
  padding-block: 1.25rem 2rem;
  overflow: auto;
}

.quick-nav a {
  color: var(--muted);
  text-decoration: none;
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: 700;
}

.quick-nav a:hover {
  color: var(--teal);
}

.content-section {
  padding: 1.5rem;
  margin-top: 1.25rem;

  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.summary-copy > p:first-child {
  color: var(--ink);
  font-size: 1.2rem;
  font-weight: 700;
}

.pull-quote {
  border-left: 3px solid var(--teal);
  padding-left: 1rem;
  color: var(--ink);
  font-weight: 700;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 2.5rem;
}

.section-number {
  color: var(--muted);
  font: 500 0.8rem 'DM Mono';
}

/* EXPERIENCE */

.timeline {
  max-width: 58rem;
  margin-left: 8%;
}

.timeline-item {
  display: grid;
  grid-template-columns: 1.3rem 1fr;
  gap: 1.4rem;

  border-top: 1px solid var(--line);
  padding: 2rem 0;
}

.timeline-marker {
  width: 0.65rem;
  height: 0.65rem;
  background: var(--lime);
  margin-top: 0.35rem;
}

.timeline-item h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.timeline-period {
  margin-bottom: 0.65rem;
}

.timeline-content ul {
  padding-left: 1.1rem;
  color: var(--muted);
  line-height: 1.8;
}

/* PROJECTS */

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  min-height: 20rem;

  padding: 1.5rem;

  background: var(--card);
  border: 1px solid var(--line);

  transition:
    transform 0.25s,
    box-shadow 0.25s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.project-topline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.project-card h3 {
  font-size: 1.35rem;
}

.project-card p {
  color: var(--muted);
  line-height: 1.65;
}

.project-highlights {
  padding-left: 1.1rem;
  margin-top: 0;
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.7;
}

.project-card .text-link {
  margin-top: auto;
  align-self: flex-start;
}

/* CAPABILITIES */

.capability-group {
  border-top: 1px solid var(--line);
  padding: 1.5rem 0;
}

.capability-group:first-child {
  border-top: 0;
  padding-top: 0;
}

.capability-group h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 0.75rem;
}

/* CONTACT */

.contact-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;

  margin-top: 4rem;
  padding-block: 5rem;

  background: var(--teal);
  color: #f2f5eb;
}

.contact-section .section-kicker {
  color: var(--lime);
}

.contact-section h2 em {
  color: var(--lime);
}

.contact-section p {
  line-height: 1.7;
}

.contact-links {
  display: grid;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-links a {
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  padding: 0.8rem 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.3);

  color: inherit;
  text-decoration: none;

  font-size: 0.85rem;
  font-weight: 700;
}

.contact-links span {
  font-weight: 400;
  opacity: 0.75;
}

/* FOOTER */

.page-footer {
  display: flex;
  justify-content: space-between;

  padding-block: 1.5rem;

  color: var(--muted);
  font: 500 0.7rem 'DM Mono';
}

.page-footer a {
  color: inherit;
  text-decoration: none;
}

/* CV */

.cv-action {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

.cv-action .button {
  border: 0;
}

.cv-action .button:hover {
  opacity: 0.9;
}

/* NOT FOUND */

.not-found {
  padding: 4rem;
  text-align: center;
}

/* RESPONSIVE */

@media (max-width: 800px) {
  .hero,
  .summary-grid,
  .contact-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-visual {
    max-width: 24rem;
    margin: auto;
    width: 100%;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .timeline {
    margin-left: 0;
  }

  .contact-section {
    padding-inline: 1rem;
  }
}

@media (max-width: 500px) {
  .technician-page {
    padding-inline: 1rem;
  }

  .header-link {
    display: none;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .page-footer {
    flex-direction: column;
    gap: 1rem;
  }
}

/* PRINT / CV */

@media print {
  .technician-page {
    max-width: none;
    padding: 0;
    background: #fff;
  }

  .site-header,
  .hero-visual,
  .quick-nav,
  .contact-section,
  .page-footer,
  .cv-action,
  .hero-actions,
  .text-link {
    display: none !important;
  }

  .hero,
  .content-section,
  .stat {
    box-shadow: none;
    border: 0;
    background: #fff;
  }

  .hero {
    display: block;
    padding: 0;
  }

  .hero-copy {
    max-width: none;
  }

  .stats {
    margin-top: 1rem;
  }

  .content-section {
    break-inside: avoid;
    margin-top: 1rem;
    padding: 1rem 0;
  }

  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chip {
    background: #fff;
  }
}
</style>