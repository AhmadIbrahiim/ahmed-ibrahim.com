import React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import SEO from "../components/SEO";
import { PixelPose } from "../components/Voice";
import config from "../../data/SiteConfig";
import ahmed from "../../content/images/profile.jpg";

const TIMELINE = [
  {
    period: "Sep 2024 — now",
    role: "Senior Software Engineer",
    company: "Goodcall · Remote",
    note:
      "Building the 4th-gen LLM voice agent with the team. Real-time voice on LiveKit/WebRTC, ASR → LLM → TTS pipeline. GPT-4 + Gemini orchestration with routing and fallback. Thousands of calls per day, 99.9%+ uptime."
  },
  {
    period: "Mar 2021 — Sep 2024",
    role: "Full Stack Engineer",
    company: "Goodcall · Remote",
    note:
      "Evolved the AI agent across two generations: Dialogflow Gen 2 → hybrid NLU + early LLM Gen 3. Improved call resolution and expanded business categories."
  },
  {
    period: "Aug 2019 — Feb 2021",
    role: "Software Engineer",
    company: "Maxiom Technology · Remote",
    note:
      "Ruby on Rails, Node.js, React, Ember.js. REST APIs, Amazon integrations, Electron + PubSub apps. CI/CD with GitLab, CircleCI, Jenkins."
  },
  {
    period: "Mar 2018 — Aug 2019",
    role: "Co-Founder & Software Engineer",
    company: "04 Egypt · Cairo",
    note:
      "Built Plot.ai, a Slack-like AI platform for organizational insights. Led a team of 7 across DevOps, QA, and dev. Node, Python, AWS Sentiment Analysis, Elasticsearch."
  },
  {
    period: "Mar 2017 — Mar 2018",
    role: "Software Engineer",
    company: "Chatbotsa · Cairo",
    note:
      "Bots for Messenger, Slack, Telegram. Built Estasharah, a doctor/patient marketplace — 20k+ consultations, 350k+ users."
  },
  {
    period: "Sep 2016 — Mar 2017",
    role: "Software Engineer",
    company: "04 Technologies · UAE Remote",
    note:
      "Bot integrations across Messenger/Slack/Telegram. NLU with Wit.ai and Rasa."
  }
];

const STACK = [
  { label: "Daily", items: "TypeScript · Node.js · Python · React" },
  {
    label: "Voice",
    items: "WebRTC · LiveKit · ASR · TTS · barge-in detection"
  },
  { label: "Models", items: "GPT-4 · Gemini · Dialogflow · custom NLU" },
  { label: "Infra", items: "GCP · Terraform · PostgreSQL · Redis · Pub/Sub" }
];

const ACCOLADES = [
  "Core engineer on Goodcall’s LLM-first voice agent, serving hundreds of US businesses.",
  "3lagnb.com — Cairo transit guide, 500k+ users.",
  "Blood Bot — first Arabic Messenger bot for blood donation. Facebook MENA top-20 chatbot (2018).",
  "Webloader — open-source website asset downloader, 200+ GitHub stars.",
  "Speaker at ICT Conference for Women in Upper Egypt; Egypt.Future for college students.",
  "2nd place, Bedaya programming competition. 2nd in Egypt, Egypt IoT competition."
];

const INTERESTS = [
  {
    label: "Reading",
    title: "Designing Data-Intensive Apps",
    by: "Martin Kleppmann"
  },
  {
    label: "Watching",
    title: "Latency talks from QCon",
    by: "/talks"
  },
  {
    label: "Listening",
    title: "Acquired podcast — Anthropic ep.",
    by: "Ben Gilbert · David Rosenthal"
  }
];

export default function MePage() {
  return (
    <Layout>
      <article className="profile">
        <header className="profile-hero">
          <div className="profile-intro">
            <span className="eyebrow">A little more about me</span>
            <h1>
              Engineer.
              <br />
              Builder.
              <br />
              <span>Still curious.</span>
            </h1>
            <p className="profile-lede">
              I’m Ahmed. I build software that helps people get things
              done—these days, through a conversation.
            </p>
            <p>
              My work has taken me from chatbots and a startup in Cairo to
              real-time Voice AI at Goodcall. I like understanding how the whole
              thing works, then making it useful.
            </p>
            <div className="profile-links">
              <a className="text-link" href={`mailto:${config.userEmail}`}>
                Let’s talk <span aria-hidden="true">↗</span>
              </a>
              <a
                className="quiet-link"
                href="https://www.linkedin.com/in/ahmedibrahhim/"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
          <figure className="profile-portrait">
            <img
              src={ahmed}
              width="768"
              height="1024"
              alt="Ahmed Ibrahim smiling outdoors"
            />
            <figcaption>
              <span>Ahmed, away from the terminal.</span>
              <PixelPose pose="waving" />
            </figcaption>
          </figure>
        </header>

        <nav className="profile-index" aria-label="On this page">
          <a href="#story">
            <span>01</span> The story
          </a>
          <a href="#experience">
            <span>02</span> The work
          </a>
          <a href="#toolkit">
            <span>03</span> The tools
          </a>
          <a href="#beyond">
            <span>04</span> Beyond work
          </a>
        </nav>

        <section
          className="profile-section"
          id="story"
          aria-labelledby="story-heading"
        >
          <div className="profile-section-label">
            <span className="eyebrow">01 / The story</span>
            <PixelPose pose="listening" />
          </div>
          <div className="profile-body">
            <h2 id="story-heading">
              From chat windows
              <br />
              to real conversations.
            </h2>
            <p className="profile-lede">
              I’ve been building software since 2016. Conversation has been a
              thread through most of it.
            </p>
            <div className="profile-story-columns">
              <p>
                I started building bots for Messenger, Slack, and Telegram. At
                Chatbotsa, I worked on a doctor–patient marketplace. Later, I
                co-founded 04 Egypt and led a team building Plot.ai, a platform
                for organizational insights.
              </p>
              <p>
                Full-stack work at Maxiom took me across APIs, integrations, and
                desktop apps. In 2021, I joined Goodcall. Since then, I’ve
                helped its voice agent evolve from Dialogflow through hybrid
                systems to an LLM-first generation.
              </p>
            </div>
            <div className="profile-now">
              <span className="eyebrow">Where that brings me today</span>
              <h3>Voice AI, out in the real world.</h3>
              <p>
                At Goodcall, I work on the fourth-generation voice agent:
                real-time audio with LiveKit and WebRTC, model orchestration,
                and the infrastructure behind business phone calls.
              </p>
              <Link className="quiet-link" to="/#work">
                Explore what I’m building ↗
              </Link>
            </div>
          </div>
        </section>

        <section
          className="profile-section"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <div className="profile-section-label">
            <span className="eyebrow">02 / The work</span>
            <span className="mono">2016 — today</span>
          </div>
          <div className="profile-body">
            <h2 id="experience-heading">A few chapters in.</h2>
            <p className="profile-section-intro">
              Startups, full-stack products, and the last several years in
              voice. Open a chapter for the details.
            </p>
            <div className="profile-career">
              {TIMELINE.map((entry, index) => (
                <details key={entry.role + entry.period} open={index === 0}>
                  <summary>
                    <span className="profile-period mono">{entry.period}</span>
                    <span className="profile-position">
                      <strong>{entry.company.split(" · ")[0]}</strong>
                      <span>{entry.role}</span>
                    </span>
                    <span className="profile-expand" aria-hidden="true" />
                  </summary>
                  <p>{entry.note}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="profile-section"
          id="toolkit"
          aria-labelledby="toolkit-heading"
        >
          <div className="profile-section-label">
            <span className="eyebrow">03 / The tools</span>
            <PixelPose pose="building" />
          </div>
          <div className="profile-body">
            <h2 id="toolkit-heading">Across the whole stack.</h2>
            <p className="profile-section-intro">
              The conversation is what you hear. These are some of the pieces
              underneath it.
            </p>
            <dl className="profile-toolkit">
              {STACK.map(group => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          className="profile-section"
          id="beyond"
          aria-labelledby="beyond-heading"
        >
          <div className="profile-section-label">
            <span className="eyebrow">04 / Beyond work</span>
            <PixelPose pose="writing" />
          </div>
          <div className="profile-body">
            <h2 id="beyond-heading">A few other sides of me.</h2>
            <p className="profile-section-intro">
              Side projects, community, and things that keep me thinking.
            </p>
            <ul className="profile-highlights">
              {ACCOLADES.slice(1).map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="profile-shelf">
              <h3>On my shelf &amp; in my headphones.</h3>
              <div className="profile-interests">
                {INTERESTS.map(item => (
                  <div key={item.label}>
                    <span className="eyebrow">{item.label}</span>
                    <h4>{item.title}</h4>
                    <p>{item.by === "/talks" ? "QCon" : item.by}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link className="quiet-link" to="/blog/">
              Notes from what I’m learning ↗
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}

export function Head() {
  return <SEO postPath="/me/" title={`About – ${config.siteTitle}`} />;
}
