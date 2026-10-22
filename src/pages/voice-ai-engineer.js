import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../layout";
import SEO from "../components/SEO";
import { PixelPose, VoicePipeline } from "../components/Voice";
import config from "../../data/SiteConfig";

const description =
  "Hire Ahmed Ibrahim, a hands-on voice AI engineer and consultant. Voice agents, LiveKit, speech pipelines, LLM tools, and production troubleshooting.";
const inquirySubject = encodeURIComponent("Voice agent project");
const inquiryBody = encodeURIComponent(`Hi Ahmed,

I'd like to discuss a voice agent project.

What the agent should do:

What we have built so far / current stack:

Where we need help:

Timeline:

Budget (if known):

My name and company:
`);
const inquiry = `mailto:${config.userEmail}?subject=${inquirySubject}&body=${inquiryBody}`;
const gmailInquiry = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  config.userEmail
)}&su=${inquirySubject}&body=${inquiryBody}`;
const questions = [
  {
    question: "Can I hire you to build a voice agent?",
    answer:
      "Yes. Get in touch about implementation, an architecture review, or a specific problem in an existing agent. I work directly with your team as an individual contributor. Tell me what you need and your timeline so we can discuss scope and availability."
  },
  {
    question: "What does a voice AI engineer do?",
    answer:
      "I connect the parts of a spoken conversation: audio transport, speech recognition, the language model, business tools, and speech generation. I also work on the behavior around them, such as when to respond, how to handle an interruption, and what happens when a service fails."
  },
  {
    question: "Can you help with LiveKit and LLM voice agents?",
    answer:
      "Yes. My work includes LiveKit and WebRTC, Python and TypeScript, speech-to-text and text-to-speech pipelines, and LLM orchestration. That includes context, tool calling, model routing, and fallback behavior. The starting point is your use case and the stack you already have."
  },
  {
    question: "Can you improve an agent we already built?",
    answer:
      "Yes. Send a description of the failure and, if you can share one safely, a redacted call trace. Long pauses, repeated answers, missed interruptions, and unreliable tool calls each need a different investigation. I would start by reproducing the problem and identifying where it occurs."
  },
  {
    question: "Should we use a voice platform or build a custom agent?",
    answer:
      "That depends on the workflow. A managed platform may cover a straightforward phone flow. Custom code becomes useful when you need more control over conversation state, integrations, or how failures are handled. An architecture review can help make that decision before you commit to a build."
  },
  {
    question: "How much does a project cost, and when can you start?",
    answer:
      "We need to agree on the scope first. A review of one call flow is a different job from building and deploying an agent. Email the use case, what already exists, your target date, and any budget constraints. I will confirm availability and discuss an appropriate scope with you."
  }
];

export default function VoiceAIEngineerPage() {
  return (
    <Layout>
      <article className="voice-services">
        <header className="voice-service-hero">
          <div className="voice-service-intro">
            <p className="voice-role">
              Ahmed Ibrahim · Voice AI engineer & consultant
            </p>
            <h1>Build a voice agent people can talk to.</h1>
            <p className="voice-lede">
              I help teams build voice agents and get them working in
              production. Bring me in to write the code or work through a call
              flow that keeps going wrong.
            </p>
            <div className="voice-actions">
              <a className="voice-cta" href="#project-inquiry">
                Discuss your project <span aria-hidden="true">↗</span>
              </a>
              <a className="quiet-link" href="#experience">
                See my experience
              </a>
            </div>
            <p className="voice-availability">
              Hands-on individual contributor. Scope and availability by email.
            </p>
          </div>
          <figure className="voice-blueprint">
            <div className="blueprint-title">
              <span>A conversation, under the hood</span>
              <PixelPose pose="listening" />
            </div>
            <div className="blueprint-caller">
              <span className="mono">Caller audio</span>
              <svg viewBox="0 0 280 48" aria-hidden="true">
                <path d="M0 24h20l4-8 4 16 4-8h12l4-16 4 32 4-16h12l4-9 4 18 4-9h12l4-22 4 44 4-22h12l4-14 4 28 4-14h12l4-19 4 38 4-19h12l4-10 4 20 4-10h12l4-17 4 34 4-17h12l4-6 4 12 4-6h24" />
              </svg>
            </div>
            <ol className="blueprint-flow">
              <li>
                <span className="mono">Speech to text</span>
                <strong>Hear the words</strong>
              </li>
              <li className="blueprint-model">
                <span className="mono">LLM + conversation state</span>
                <strong>Decide what happens next</strong>
                <span className="blueprint-tools">
                  Your data & business tools ↔
                </span>
              </li>
              <li>
                <span className="mono">Text to speech</span>
                <strong>Say something useful</strong>
              </li>
            </ol>
            <figcaption>
              One common architecture. Turn detection, interruptions, and
              recovery run across the whole conversation.
            </figcaption>
          </figure>
        </header>

        <nav className="voice-page-index" aria-label="On this page">
          <a href="#help">Where I can help</a>
          <a href="#conversation">Inside the call</a>
          <a href="#experience">Experience</a>
          <a href="#working-together">Working together</a>
          <a href="#questions">Questions</a>
        </nav>

        <section className="voice-help" id="help" aria-labelledby="help-title">
          <div className="voice-section-intro">
            <h2 id="help-title">Where does your agent need work?</h2>
            <p>
              You might have a workflow on paper, a prototype that needs to
              handle real callers, or a live agent with one stubborn problem.
              Each is a reasonable place to start.
            </p>
          </div>
          <dl className="voice-help-list">
            <div>
              <dt>Build the first version</dt>
              <dd>
                Define the call flow, connect speech and language models, and
                wire the agent to the systems it needs to use. Start with a
                specific task the agent can complete and a clear way to hand off
                when it cannot.
              </dd>
            </div>
            <div>
              <dt>Fix the awkward conversations</dt>
              <dd>
                Investigate slow replies, interruptions that get missed, and
                agents that keep talking after the caller changes direction.
                Trace the turn through the pipeline before changing the model or
                prompt.
              </dd>
            </div>
            <div>
              <dt>Make tools and context reliable</dt>
              <dd>
                Connect the LLM to business APIs and the right information.
                Handle timeouts, validate actions, and make sure the agent only
                confirms an outcome after the system has confirmed it.
              </dd>
            </div>
            <div>
              <dt>Get ready for production</dt>
              <dd>
                Work through deployment, call traces, failure recovery, and
                evaluation. Include the difficult calls: silence, background
                noise, unavailable services, and callers who go off script.
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="voice-conversation"
          id="conversation"
          aria-labelledby="conversation-title"
        >
          <div className="voice-section-intro">
            <h2 id="conversation-title">
              A good answer can still be a bad call.
            </h2>
            <p>
              If the agent takes too long, talks over someone, or loses track of
              a correction, the conversation breaks. These are engineering
              problems I work on alongside the language model.
            </p>
          </div>
          <figure className="voice-turn-chart">
            <div className="turn-chart-heading">
              <h3>What an interruption changes</h3>
              <span className="small-note">
                Illustrative sequence · not measured timing
              </span>
            </div>
            <div
              className="turn-chart"
              role="img"
              aria-label="Illustrative call sequence: the caller asks a question, the agent begins a reply, and the caller interrupts with a correction. The agent stops playback, updates the conversation context, and gives a revised reply."
            >
              <div className="turn-lane">
                <span className="turn-label">Caller</span>
                <div className="turn-track">
                  <span className="turn-bar turn-question">Question</span>
                  <span className="turn-bar turn-correction">Correction</span>
                </div>
              </div>
              <div className="turn-lane">
                <span className="turn-label">Agent</span>
                <div className="turn-track">
                  <span className="turn-bar turn-reply">Reply</span>
                  <span className="turn-bar turn-revised">New reply</span>
                </div>
              </div>
              <div className="turn-lane">
                <span className="turn-label">State</span>
                <div className="turn-track">
                  <span className="turn-stop">Stop audio. Update context.</span>
                </div>
              </div>
              <div className="turn-axis" aria-hidden="true">
                Call begins <span>Conversation continues →</span>
              </div>
            </div>
            <figcaption>
              Stopping the audio is one part of the job. The next response also
              needs to account for what the caller heard and what they just
              changed.
            </figcaption>
          </figure>
          <div className="voice-pipeline-explainer">
            <div>
              <h3>The model sits inside a larger system.</h3>
              <p>
                A common voice agent uses speech recognition, an LLM, and speech
                synthesis. Speech-to-speech models combine some of those steps,
                but you still need to manage tools, interruptions, and failures.
              </p>
              <p>
                I work with LiveKit and WebRTC for real-time audio, Python and
                TypeScript for agent behavior, and the services around them. The
                architecture should fit the call you need to handle.
              </p>
            </div>
            <VoicePipeline />
          </div>
        </section>

        <section
          className="voice-experience"
          id="experience"
          aria-labelledby="experience-title"
        >
          <figure className="voice-portrait">
            <StaticImage
              src="../../content/images/profile.jpg"
              alt="Ahmed Ibrahim smiling outdoors"
              width={520}
              aspectRatio={0.8}
              quality={85}
              placeholder="blurred"
            />
            <figcaption>Ahmed Ibrahim · Senior software engineer</figcaption>
          </figure>
          <div className="voice-experience-copy">
            <h2 id="experience-title">
              Voice AI has been my day job since 2021.
            </h2>
            <p className="voice-lede">
              I work on voice agents at Goodcall. My experience spans three
              generations of the agent, from Dialogflow to the LLM systems we
              build today.
            </p>
            <p>
              My current work includes real-time speech pipelines, model routing
              and fallback, and the infrastructure behind each conversation. I
              work across the stack because a failure on a call rarely stays
              neatly inside one component.
            </p>
            <p>
              I have been building software since 2016. Before Goodcall, I
              worked on chatbots, full-stack products, and a software company I
              co-founded in Cairo.
            </p>
            <Link className="text-link" to="/me/">
              Read my background <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure className="voice-work-timeline">
            <ol>
              <li>
                <time dateTime="2021-03">2021</time>
                <h3>Dialogflow → hybrid agents</h3>
                <p>
                  Full Stack Engineer, Goodcall. Worked across Gen 2 and Gen 3
                  as the agent evolved from NLU toward LLMs.
                </p>
              </li>
              <li>
                <time dateTime="2024-09">2024</time>
                <h3>The fourth generation</h3>
                <p>
                  Senior Software Engineer, Goodcall. LiveKit, WebRTC, speech
                  pipelines, and LLM orchestration.
                </p>
              </li>
              <li>
                <span className="timeline-now">Now</span>
                <h3>Working across the call</h3>
                <p>
                  Conversation behavior, model routing, fallback, and production
                  systems.
                </p>
              </li>
            </ol>
            <figcaption>
              My voice AI work at Goodcall. Dates and roles are also on my About
              page.
            </figcaption>
          </figure>
        </section>

        <aside className="voice-field-note" aria-labelledby="field-note-title">
          <div>
            <p className="small-note">From my engineering notes</p>
            <h2 id="field-note-title">Who picked up the phone?</h2>
            <p>
              A person, a voicemail greeting, and an IVR menu need different
              behavior. I wrote about the state machine around answering machine
              detection, including what to do when the result is uncertain.
            </p>
            <Link className="text-link" to="/livekit-amd-state-machine/">
              Read the LiveKit article <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure>
            <StaticImage
              src="../../content/images/posts/amd-hero-desk-phone.jpg"
              alt="A desk phone, from the article on answering machine detection"
              width={560}
              aspectRatio={1.5}
              placeholder="blurred"
            />
            <figcaption>
              Answering machine detection and outbound call behavior.
            </figcaption>
          </figure>
        </aside>

        <section
          className="voice-working"
          id="working-together"
          aria-labelledby="working-title"
        >
          <div className="voice-section-intro">
            <h2 id="working-title">Work with the person writing the code.</h2>
            <p>
              You can bring me in for a focused consultation or discuss hands-on
              implementation with your team. We agree on a useful piece of work
              and how to judge whether it is done.
            </p>
          </div>
          <ol className="voice-process">
            <li>
              <h3>Start with the call</h3>
              <p>
                Describe who calls, what they need, and what a successful
                outcome looks like. If you already have an agent, show me where
                it gets stuck.
              </p>
            </li>
            <li>
              <h3>Agree on the work</h3>
              <p>
                We identify the constraints and choose a scope: a technical
                review, a working call flow, an integration, or a fix to an
                existing system.
              </p>
            </li>
            <li>
              <h3>Build, listen, adjust</h3>
              <p>
                Check the behavior against representative calls. Review failures
                and tradeoffs with your team as the implementation takes shape.
              </p>
            </li>
            <li>
              <h3>Leave a clear handoff</h3>
              <p>
                The code and decisions should make sense to the team maintaining
                them. Agree on the documentation, deployment, and follow-up the
                project needs.
              </p>
            </li>
          </ol>
          <div className="voice-demo-note">
            <PixelPose pose="waving" />
            <p>
              Want to hear a voice agent before we talk?{" "}
              <Link to="/">Try the assistant on my homepage</Link>. It responds
              to questions about my work. Your project may need a different
              architecture and a different voice.
            </p>
          </div>
        </section>

        <section
          className="voice-questions"
          id="questions"
          aria-labelledby="questions-title"
        >
          <h2 id="questions-title">Before you get in touch</h2>
          <div>
            {questions.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="voice-contact"
          id="project-inquiry"
          tabIndex="-1"
          aria-labelledby="contact-title"
        >
          <PixelPose pose="contact" />
          <div>
            <h2 id="contact-title">Tell me what you want the agent to do.</h2>
            <p>
              A short email is enough to start. Include the use case, what you
              have built so far, and when you need help. Share redacted examples
              if they make the problem easier to explain.
            </p>
            <div className="voice-actions">
              <a className="voice-cta" href={inquiry}>
                Email project brief <span aria-hidden="true">↗</span>
              </a>
              <a
                className="quiet-link"
                href={gmailInquiry}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Gmail
              </a>
            </div>
            <p className="voice-contact-hint">
              Choose your email app or Gmail. Both open a draft with a few
              project questions for you to fill in before sending.
            </p>
            <a className="voice-email" href={`mailto:${config.userEmail}`}>
              {config.userEmail}
            </a>
          </div>
        </section>
      </article>
    </Layout>
  );
}

export function Head() {
  return (
    <SEO
      title="Voice AI Engineer & Consultant | Ahmed Ibrahim"
      description={description}
      postPath="/voice-ai-engineer/"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${config.siteUrl}/voice-ai-engineer#service`,
          name: "Voice AI engineering and consulting",
          serviceType: "Voice agent development and technical consulting",
          description,
          url: `${config.siteUrl}/voice-ai-engineer`,
          provider: { "@id": `${config.siteUrl}/#person` }
        }
      ]}
    />
  );
}
