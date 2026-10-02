import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layout";
import SEO from "../components/SEO";
import PostListing from "../components/PostListing";
import {
  Avatar,
  PixelPose,
  VoicePipeline
} from "../components/Voice";
import AgentSlot from "../components/AgentDock/AgentSlot";
import config from "../../data/SiteConfig";
import projects from "../../data/projects";
import github from "../../data/github.json";

// GitHub stars, shown from 5 up. data/github.json is refreshed before every build. The bar is on a
// log scale against the most-starred project, so a 5-star repo still shows next to a 6,000-star one.
const MAX_STARS = Math.max(
  ...projects.map(p => (p.repo && github[p.repo] ? github[p.repo].stars : 0))
);
const rating = project => {
  const repo = project.repo && github[project.repo];
  if (!repo || repo.stars < 5) return null;
  const pct = Math.round(
    (100 * Math.log10(repo.stars + 1)) / Math.log10(MAX_STARS + 1)
  );
  return { label: repo.stars.toLocaleString("en-US"), pct: Math.max(8, pct) };
};

export default function IndexPage({ data }) {
  const [featured, ...rest] = data.latest.edges;
  return (
    <Layout>
      <header className="hero">
        <span className="eyebrow hero-eyebrow">
          Software engineer · Voice AI
        </span>
        <h1 aria-label="Hi, I’m Ahmed. I build voice AI.">
          Hi, I’m{" "}
          <Link
            className="hello-avatar"
            to="/me/"
            aria-label="A little about Ahmed"
          >
            <Avatar bubble />
          </Link>{" "}
          Ahmed.
          <br />I build{" "}
          <span className="voice-word">
            voice AI
            <svg
              viewBox="0 0 400 16"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M2 11 Q190 -2 398 9" />
            </svg>
          </span>
          .
        </h1>
        <AgentSlot />
        <p className="hero-description">
          Real-time conversations. Thoughtful engineering.
          <br className="desktop-break" /> The systems that make it all feel
          human.
        </p>
        <div className="hero-links">
          <a className="text-link" href="#work">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
          <Link className="quiet-link" to="/blog/">
            Read my writing
          </Link>
        </div>
        <dl className="experience-strip">
          <div>
            <dt>Software since 2016</dt>
            <dd>From chatbots to full-stack products.</dd>
          </div>
          <div>
            <dt>Voice AI since 2021</dt>
            <dd>Three generations of agents at Goodcall.</dd>
          </div>
          <div>
            <dt>From audio to answer</dt>
            <dd>Speech, models, and production systems.</dd>
          </div>
        </dl>
      </header>
      <section
        className="home-section current-work"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="section-heading with-pixel">
          <div className="section-identity">
            <PixelPose pose="listening" />
            <span className="eyebrow">01 / Currently building</span>
          </div>
          <span className="small-note">With the team at Goodcall</span>
        </div>
        <div className="work-feature">
          <div>
            <h2 id="work-title">
              Voice agents.
              <br />
              Out in the real world.
            </h2>
            <p>
              I work on Goodcall’s fourth-generation voice agent: real-time
              speech pipelines, model orchestration, and the infrastructure
              behind every conversation.
            </p>
            <p className="stack-note">
              LiveKit / WebRTC / TypeScript / Python / GCP
            </p>
            <Link className="text-link" to="/me/">
              The story so far <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <VoicePipeline />
        </div>
        <div className="work-depth">
          <div>
            <span className="mono">01 / THE CONVERSATION</span>
            <h3>Knowing when to listen.</h3>
            <p>
              Turn-taking, interruptions, and real-time audio. The small timing
              decisions that make a phone conversation feel natural.
            </p>
          </div>
          <div>
            <span className="mono">02 / THE INTELLIGENCE</span>
            <h3>The right next step.</h3>
            <p>
              Context, tool calls, model routing, and fallback. Connecting what
              someone says to something the agent can actually do.
            </p>
          </div>
          <div>
            <span className="mono">03 / THE SYSTEM</span>
            <h3>Built for real calls.</h3>
            <p>
              The infrastructure around the agent: services, data, and
              deployment. Keeping the whole conversation working beyond the
              demo.
            </p>
          </div>
        </div>
      </section>
      <section className="home-section" aria-labelledby="projects-title">
        <div className="section-heading with-pixel">
          <div className="section-identity">
            <PixelPose pose="building" />
            <h2 className="eyebrow" id="projects-title">
              02 / Other things I’ve built
            </h2>
          </div>
          <a className="quiet-link" href="https://github.com/AhmadIbrahiim">
            More on GitHub ↗
          </a>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <a className="project-row" key={project.title} href={project.path}>
              <span className="project-number mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="project-title">
                <h3>{project.title.replace(".com", "")}</h3>
                <span className="project-kind mono">{project.kind}</span>
                {rating(project) && (
                  <span
                    className="project-rating"
                    title={`${rating(project).label} stars on GitHub`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.6 1.4-7.1-5.3-5 7.2-.9z" />
                    </svg>
                    <b>{rating(project).label}</b>
                    <span className="project-rating__bar" aria-hidden="true">
                      <i style={{ width: `${rating(project).pct}%` }} />
                    </span>
                  </span>
                )}
              </div>
              <p>{project.description}</p>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>
      <section
        className="home-section"
        id="writing"
        aria-labelledby="writing-title"
      >
        <div className="section-heading with-pixel">
          <div className="section-identity">
            <PixelPose pose="writing" />
            <h2 className="eyebrow" id="writing-title">
              03 / Notes from the work
            </h2>
          </div>
          <Link className="quiet-link" to="/blog/">
            All writing ↗
          </Link>
        </div>
        {featured && (
          <Link className="featured-essay" to={featured.node.fields.slug}>
            <span className="eyebrow">Latest essay</span>
            <h3>
              {featured.node.frontmatter.title}
              <span className="row-arrow" aria-hidden="true">
                {" "}
                ↗
              </span>
            </h3>
            <p>{featured.node.excerpt}</p>
            <span className="small-note">
              {featured.node.timeToRead} min read ·{" "}
              {featured.node.frontmatter.categories?.[0]}
            </span>
          </Link>
        )}
        <PostListing postEdges={rest.slice(0, 3)} />
      </section>
      <section
        className="home-section home-about"
        aria-labelledby="about-title"
      >
        <div>
          <div className="section-identity">
            <PixelPose pose="waving" />
            <span className="eyebrow">04 / The person behind the pixels</span>
          </div>
          <h2 id="about-title">
            A little
            <br /> about me.
          </h2>
          <Link className="quiet-link" to="/me/">
            Meet Ahmed ↗
          </Link>
        </div>
        <div>
          <p>
            I’m a software engineer who likes making complex systems useful. My
            work spans voice AI, real-time media, and production infrastructure.
          </p>
          <p>
            I’ve built things that help people find their way around Cairo,
            connect with blood donors, and have better conversations with
            software.
          </p>
          <p className="small-note">
            I started with chatbots, co-founded a software company in Cairo, and
            moved into voice AI. I still like working across the whole
            product—from the first interaction to the systems behind it.
          </p>
        </div>
      </section>
    </Layout>
  );
}

export function Head() {
  return <SEO title={`${config.siteTitle} – Voice AI & real-time systems`} />;
}

export const pageQuery = graphql`
  query IndexQuery {
    latest: allMarkdownRemark(
      limit: 4
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 200)
          timeToRead
          frontmatter {
            title
            categories
            date
          }
        }
      }
    }
  }
`;
