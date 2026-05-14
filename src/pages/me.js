import React from 'react'
import Layout from '../layout'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import ahmed from '../../content/images/profile.jpg'

const LAST_UPDATED = 'May 14, 2026'

const TLDR = [
  { k: 'Where', v: 'Seattle, WA' },
  { k: 'Role', v: 'Senior SWE · Voice AI @ Goodcall' },
  { k: 'Open to', v: 'Senior IC roles' },
]

const TIMELINE = [
  {
    period: 'Sep 2024 — now',
    role: 'Senior Software Engineer',
    company: 'Goodcall · Remote',
    note:
      'Building the 4th-gen LLM voice agent with the team. Real-time voice on LiveKit/WebRTC, ASR → LLM → TTS pipeline. GPT-4 + Gemini orchestration with routing and fallback. Thousands of calls per day, 99.9%+ uptime.',
  },
  {
    period: 'Mar 2021 — Sep 2024',
    role: 'Full Stack Engineer',
    company: 'Goodcall · Remote',
    note:
      'Evolved the AI agent across two generations: Dialogflow Gen 2 → hybrid NLU + early LLM Gen 3. Improved call resolution and expanded business categories.',
  },
  {
    period: 'Aug 2019 — Feb 2021',
    role: 'Software Engineer',
    company: 'Maxiom Technology · Remote',
    note:
      'Ruby on Rails, Node.js, React, Ember.js. REST APIs, Amazon integrations, Electron + PubSub apps. CI/CD with GitLab, CircleCI, Jenkins.',
  },
  {
    period: 'Mar 2018 — Aug 2019',
    role: 'Co-Founder & Software Engineer',
    company: '04 Egypt · Cairo',
    note:
      'Built Plot.ai, a Slack-like AI platform for organizational insights. Led a team of 7 across DevOps, QA, and dev. Node, Python, AWS Sentiment Analysis, Elasticsearch.',
  },
  {
    period: 'Mar 2017 — Mar 2018',
    role: 'Software Engineer',
    company: 'Chatbotsa · Cairo',
    note:
      'Bots for Messenger, Slack, Telegram. Built Estasharah, a doctor/patient marketplace — 20k+ consultations, 350k+ users.',
  },
  {
    period: 'Sep 2016 — Mar 2017',
    role: 'Software Engineer',
    company: '04 Technologies · UAE Remote',
    note:
      'Bot integrations across Messenger/Slack/Telegram. NLU with Wit.ai and Rasa.',
  },
]

const STACK = [
  { label: 'Daily', items: 'TypeScript · Node.js · Python · React' },
  { label: 'Voice', items: 'WebRTC · LiveKit · ASR · TTS · barge-in detection' },
  { label: 'Models', items: 'GPT-4 · Gemini · Dialogflow · custom NLU' },
  { label: 'Infra', items: 'GCP · Terraform · PostgreSQL · Redis · Pub/Sub' },
]

const ACCOLADES = [
  'Core engineer on Goodcall’s LLM-first voice agent, serving hundreds of US businesses.',
  '3lagnb.com — Cairo transit guide, 500k+ users.',
  'Blood Bot — first Arabic Messenger bot for blood donation. Facebook MENA top-20 chatbot (2018).',
  'Webloader — open-source website asset downloader, 200+ GitHub stars.',
  'Speaker at ICT Conference for Women in Upper Egypt; Egypt.Future for college students.',
  '2nd place, Bedaya programming competition. 2nd in Egypt, Egypt IoT competition.',
]

const INTERESTS = [
  {
    label: 'Reading',
    title: 'Designing Data-Intensive Apps',
    by: 'Martin Kleppmann',
  },
  {
    label: 'Watching',
    title: 'Latency talks from QCon',
    by: '/talks',
  },
  {
    label: 'Listening',
    title: 'Acquired podcast — Anthropic ep.',
    by: 'Ben Gilbert · David Rosenthal',
  },
]

export default function MePage() {
  return (
    <Layout>
      <article className="about">
        <header className="about-hero">
          <div className="about-photo">
            <img src={ahmed} alt="Ahmed Ibrahim" />
          </div>
          <div className="about-intro">
            <div className="about-kicker">
              <span>About · Living document</span>
              <span className="last-updated">Updated {LAST_UPDATED}</span>
            </div>
            <h1>
              AHMED
              <br />
              IBRAHIM<span className="punkt">.</span>
            </h1>
            <p className="about-tagline">
              I build human-quality Voice AI systems for real business phone
              calls. Ten years of software, the last five in voice.
            </p>
          </div>
        </header>

        <div className="about-tldr">
          {TLDR.map(({ k, v }) => (
            <div key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>

        <section className="about-section about-now">
          <div className="cell-head">
            <div className="cell-label">Now</div>
            <span className="status-pill">
              <span className="dot" aria-hidden="true" />
              Available
            </span>
          </div>
          <p className="section-lede">
            What I&apos;m actively building, right now. Updates as work changes.
          </p>
          <div className="now-card">
            <div className="body">
              <h3>Building Goodcall&apos;s 4th-gen voice agent.</h3>
              <p>
                An LLM-first rebuild. Real-time voice on LiveKit/WebRTC, ASR →
                LLM → TTS pipeline. GPT-4 + Gemini orchestration with model
                routing and automatic fallback. Hundreds of US businesses,
                thousands of calls per day at 99.9%+ uptime.
              </p>
            </div>
            <span className="badge">Since Sep 2024</span>
          </div>
        </section>

        <section className="about-section">
          <div className="cell-head">
            <div className="cell-label">Previously</div>
            <span
              className="view-all"
              style={{ borderBottom: '1.5px solid #000' }}
            >
              {TIMELINE.length} roles
            </span>
          </div>
          <p className="section-lede">
            A condensed timeline. Reverse-chronological. Full CV on request.
          </p>
          <div className="timeline">
            {TIMELINE.map(entry => (
              <div className="t-entry" key={entry.role + entry.period}>
                <div className="t-period">{entry.period}</div>
                <div>
                  <div className="t-role">{entry.role}</div>
                  <span className="t-company">{entry.company}</span>
                  <p className="t-note">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="cell-head">
            <div className="cell-label">Stack</div>
          </div>
          <p className="section-lede">
            What I reach for. Not exhaustive — these are the tools I actively
            ship with.
          </p>
          <div className="stack-row">
            {STACK.map(group => (
              <div className="stack-group" key={group.label}>
                <span className="sg-label">{group.label}</span>
                <span className="sg-list">{group.items}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="cell-head">
            <div className="cell-label">In my queue</div>
          </div>
          <p className="section-lede">
            What I&apos;m reading, watching, and listening to this month.
          </p>
          <div className="interests-grid">
            {INTERESTS.map(item => (
              <div key={item.label}>
                <span className="i-label">{item.label}</span>
                <h4 className="i-title">{item.title}</h4>
                <p className="i-by">{item.by}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="cell-head">
            <div className="cell-label">Highlights</div>
          </div>
          <p className="section-lede">
            Things I&apos;ve shipped, talks I&apos;ve given, and a couple of
            wins worth keeping on the page.
          </p>
          <ol className="accolades-list">
            {ACCOLADES.map((line, i) => (
              <li key={line}>
                <span className="a-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-cta">
          <div>
            <h2>
              SAY HI<span className="punkt">.</span>
            </h2>
            <p>
              Best way to reach me: email. I read every message and reply within
              a day or two.
            </p>
          </div>
          <a className="cta-btn" href="mailto:me@ahmed-ibrahim.com">
            me@ahmed-ibrahim.com
          </a>
        </section>
      </article>
    </Layout>
  )
}

export function Head() {
  return <SEO title={`About – ${config.siteTitle}`} />
}
