import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Product", "Features", "Pricing", "Docs"];

const FEATURES = [
  {
    icon: "⌗",
    title: "Channels",
    desc: "Organize conversations by topic. Every message persists — nothing disappears after logout.",
  },
  {
    icon: "◈",
    title: "Kanban Tasks",
    desc: "Drag tasks across To Do, In Progress, and Done. Assign, prioritize, and ship faster.",
  },
  {
    icon: "◉",
    title: "Live Presence",
    desc: "See who's online in real time. Typing indicators so you always know when someone's responding.",
  },
  {
    icon: "⬡",
    title: "Workspaces",
    desc: "Create a team workspace and invite members with a single shareable link.",
  },
  {
    icon: "◫",
    title: "Auth & Security",
    desc: "JWT-based sessions, bcrypt hashed passwords. Your data is yours.",
  },
  {
    icon: "◌",
    title: "Persistent History",
    desc: "Messages stored in MongoDB. Scroll back to any conversation, any time.",
  },
];

const STATS = [
  { value: "< 50ms", label: "Message latency" },
  { value: "99.9%", label: "Uptime target" },
  { value: "WebSocket", label: "Real-time protocol" },
  { value: "MIT", label: "Open license" },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally a team tool that doesn't make you feel like you're inside a marketing brochure.",
    name: "Arjun M.",
    role: "Founding Engineer",
  },
  {
    quote:
      "Channels + tasks in one place. We stopped context-switching between Slack and Trello.",
    name: "Priya S.",
    role: "Product Lead",
  },
  {
    quote: "Deployed in 15 minutes. Clean API, clean UI, nothing to unlearn.",
    name: "Kabir D.",
    role: "DevOps",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* ── NAV ── */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <span style={styles.logo}>
            <span style={styles.logoDot} />
            NexFlow
          </span>
          <div style={styles.navLinks}>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" style={styles.navLink}>
                {l}
              </a>
            ))}
          </div>
          <div style={styles.navActions}>
            <button style={styles.btnGhost} onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button style={styles.btnDark} onClick={() => navigate("/register")}>
              Get started
            </button>
          </div>
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span style={styles.bar} />
            <span style={styles.bar} />
          </button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" style={styles.mobileLink}>
                {l}
              </a>
            ))}
            <button style={styles.btnDarkFull} onClick={() => navigate("/register")}>
              Get started
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            Now with persistent message history
          </div>

          <h1 style={styles.heroHeading}>
            Where your team
            <br />
            <em style={styles.heroEm}>actually works.</em>
          </h1>

          <p style={styles.heroSub}>
            Channels, real-time messaging, and a Kanban board — in one minimal workspace.
            No bloat. No confusing settings. Just your team, focused.
          </p>

          <div style={styles.heroCta}>
            <button style={styles.btnHero} onClick={() => navigate("/register")}>
              Create your workspace
            </button>
            <button style={styles.btnHeroOutline} onClick={() => navigate("/login")}>
              Sign in →
            </button>
          </div>

          <p style={styles.heroNote}>Free to use · No credit card required</p>
        </div>

        {/* App preview mockup */}
        <div style={styles.mockupWrap}>
          <div style={styles.mockup}>
            {/* Sidebar */}
            <div style={styles.mockSidebar}>
              <div style={styles.mockWsName}>⬡ Acme Team</div>
              <div style={styles.mockSection}>CHANNELS</div>
              {["# general", "# design", "# engineering"].map((c, i) => (
                <div key={c} style={{ ...styles.mockChannel, ...(i === 0 ? styles.mockChannelActive : {}) }}>
                  {c}
                </div>
              ))}
              <div style={{ marginTop: 16, ...styles.mockSection }}>MEMBERS</div>
              {[
                { name: "Arjun", active: true },
                { name: "Priya", active: true },
                { name: "Kabir", active: false },
              ].map(({ name, active }) => (
                <div key={name} style={styles.mockMember}>
                  <span style={{ ...styles.mockDot, background: active ? "#22c55e" : "#d1d5db" }} />
                  {name}
                </div>
              ))}
            </div>
            {/* Chat pane */}
            <div style={styles.mockChat}>
              <div style={styles.mockChatHeader}># general</div>
              <div style={styles.mockMessages}>
                {[
                  { who: "Arjun", msg: "Pushed the new auth flow — can you review?", time: "10:41" },
                  { who: "Priya", msg: "On it! Moving the task to In Progress 🚀", time: "10:42" },
                  { who: "Kabir", msg: "Deployment pipeline is green ✓", time: "10:44" },
                ].map(({ who, msg, time }) => (
                  <div key={who + time} style={styles.mockMsg}>
                    <div style={styles.mockAvatar}>{who[0]}</div>
                    <div>
                      <div style={styles.mockMsgMeta}>
                        <span style={styles.mockMsgWho}>{who}</span>
                        <span style={styles.mockMsgTime}>{time}</span>
                      </div>
                      <div style={styles.mockMsgText}>{msg}</div>
                    </div>
                  </div>
                ))}
                <div style={styles.mockTyping}>Priya is typing…</div>
              </div>
              <div style={styles.mockInput}>
                <span style={styles.mockInputText}>Message #general</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={styles.statsStrip}>
        {STATS.map(({ value, label }, i) => (
          <div key={label} style={{ ...styles.stat, ...(i < STATS.length - 1 ? styles.statBorder : {}) }}>
            <div style={styles.statValue}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section style={styles.section} id="features">
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>What's inside</p>
          <h2 style={styles.sectionHeading}>
            Everything a focused team needs.
            <br />
            Nothing it doesn't.
          </h2>
          <div style={styles.featureGrid}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={styles.featureCard}>
                <div style={styles.featureIcon}>{icon}</div>
                <div style={styles.featureTitle}>{title}</div>
                <div style={styles.featureDesc}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={styles.sectionAlt}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>How it works</p>
          <h2 style={styles.sectionHeading}>Up and running in minutes.</h2>
          <div style={styles.steps}>
            {[
              { num: "01", title: "Create a workspace", desc: "Sign up and name your team. You'll get a unique invite link automatically." },
              { num: "02", title: "Invite your team", desc: "Share the link. Members join instantly — no approval flows, no waiting." },
              { num: "03", title: "Open a channel", desc: "Create channels for topics, projects, or squads. Messages persist forever." },
              { num: "04", title: "Ship with tasks", desc: "Create tasks in any channel. Move them through the Kanban board as you progress." },
            ].map(({ num, title, desc }, i) => (
              <div key={num} style={styles.step}>
                <div style={styles.stepNum}>{num}</div>
                <div style={styles.stepContent}>
                  <div style={styles.stepTitle}>{title}</div>
                  <div style={styles.stepDesc}>{desc}</div>
                </div>
                {i < 3 && <div style={styles.stepLine} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>From early users</p>
          <h2 style={styles.sectionHeading}>Real feedback.</h2>
          <div style={styles.testimonialGrid}>
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <div key={name} style={styles.testimonialCard}>
                <p style={styles.testimonialQuote}>&ldquo;{quote}&rdquo;</p>
                <div style={styles.testimonialMeta}>
                  <div style={styles.testimonialAvatar}>{name[0]}</div>
                  <div>
                    <div style={styles.testimonialName}>{name}</div>
                    <div style={styles.testimonialRole}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={styles.ctaBand}>
        <div style={styles.ctaBandInner}>
          <h2 style={styles.ctaHeading}>Ready to build something?</h2>
          <p style={styles.ctaSub}>
            Create your free workspace in under a minute.
          </p>
          <button style={styles.btnHeroWhite} onClick={() => navigate("/register")}>
            Get started for free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.logo}>
            <span style={{ ...styles.logoDot, background: "#9ca3af" }} />
            NexFlow
          </span>
          <div style={styles.footerLinks}>
            {["Privacy", "Terms", "GitHub", "Docs"].map((l) => (
              <a key={l} href="#" style={styles.footerLink}>
                {l}
              </a>
            ))}
          </div>
          <div style={styles.footerCopy}>© 2025 NexFlow. MIT License.</div>
        </div>
      </footer>
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  root: {
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    color: "#111",
    background: "#fff",
    minHeight: "100vh",
    overflowX: "hidden",
  },

  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    transition: "border-bottom 0.2s",
  },
  navScrolled: {
    borderBottom: "1px solid #e5e7eb",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 60,
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: "-0.02em",
    color: "#111",
    textDecoration: "none",
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#111",
    flexShrink: 0,
  },
  navLinks: {
    display: "flex",
    gap: 24,
    flex: 1,
  },
  navLink: {
    fontSize: 14,
    color: "#555",
    textDecoration: "none",
    fontWeight: 400,
  },
  navActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  btnGhost: {
    background: "transparent",
    border: "none",
    fontSize: 14,
    color: "#555",
    cursor: "pointer",
    padding: "6px 14px",
    borderRadius: 6,
  },
  btnDark: {
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    padding: "7px 16px",
    cursor: "pointer",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: 5,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
  },
  bar: {
    display: "block",
    width: 22,
    height: 1.5,
    background: "#111",
    borderRadius: 2,
  },
  mobileMenu: {
    padding: "12px 24px 20px",
    borderTop: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  mobileLink: {
    fontSize: 15,
    color: "#333",
    textDecoration: "none",
  },
  btnDarkFull: {
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    padding: "10px 16px",
    cursor: "pointer",
    marginTop: 4,
  },

  // HERO
  hero: {
    paddingTop: 120,
    paddingBottom: 80,
    maxWidth: 1100,
    margin: "0 auto",
    padding: "120px 24px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 64,
    alignItems: "center",
  },
  heroInner: {},
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    color: "#555",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: "4px 12px",
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  },
  heroHeading: {
    fontSize: "clamp(38px, 5vw, 54px)",
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: "-0.03em",
    margin: "0 0 20px",
    color: "#0a0a0a",
  },
  heroEm: {
    fontStyle: "italic",
    fontWeight: 400,
    color: "#444",
  },
  heroSub: {
    fontSize: 17,
    color: "#555",
    lineHeight: 1.65,
    margin: "0 0 32px",
    maxWidth: 440,
  },
  heroCta: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  btnHero: {
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    padding: "12px 24px",
    cursor: "pointer",
  },
  btnHeroOutline: {
    background: "transparent",
    color: "#111",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    padding: "12px 24px",
    cursor: "pointer",
  },
  heroNote: {
    fontSize: 13,
    color: "#9ca3af",
    margin: 0,
  },

  // MOCKUP
  mockupWrap: {
    position: "relative",
  },
  mockup: {
    background: "#fff",
    border: "1.5px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    boxShadow: "0 4px 40px rgba(0,0,0,0.07)",
    height: 380,
  },
  mockSidebar: {
    width: 170,
    background: "#f9fafb",
    borderRight: "1px solid #e5e7eb",
    padding: "16px 12px",
    flexShrink: 0,
    fontSize: 13,
  },
  mockWsName: {
    fontWeight: 600,
    fontSize: 13,
    color: "#111",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #e5e7eb",
  },
  mockSection: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#9ca3af",
    marginBottom: 6,
  },
  mockChannel: {
    padding: "5px 8px",
    borderRadius: 5,
    color: "#555",
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 2,
  },
  mockChannelActive: {
    background: "#e5e7eb",
    color: "#111",
    fontWeight: 500,
  },
  mockMember: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 6px",
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  mockDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
  },
  mockChat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  mockChatHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    fontSize: 14,
    color: "#111",
  },
  mockMessages: {
    flex: 1,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "hidden",
  },
  mockMsg: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  mockAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    flexShrink: 0,
  },
  mockMsgMeta: {
    display: "flex",
    gap: 8,
    alignItems: "baseline",
    marginBottom: 2,
  },
  mockMsgWho: {
    fontSize: 12,
    fontWeight: 600,
    color: "#111",
  },
  mockMsgTime: {
    fontSize: 11,
    color: "#9ca3af",
  },
  mockMsgText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.4,
  },
  mockTyping: {
    fontSize: 12,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: "auto",
  },
  mockInput: {
    margin: "0 12px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 12px",
  },
  mockInputText: {
    fontSize: 13,
    color: "#d1d5db",
  },

  // STATS
  statsStrip: {
    borderTop: "1px solid #f3f4f6",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
  },
  stat: {
    flex: 1,
    padding: "28px 24px",
    textAlign: "center",
  },
  statBorder: {
    borderRight: "1px solid #f3f4f6",
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#9ca3af",
  },

  // SECTIONS
  section: {
    padding: "80px 24px",
  },
  sectionAlt: {
    padding: "80px 24px",
    background: "#f9fafb",
    borderTop: "1px solid #f3f4f6",
    borderBottom: "1px solid #f3f4f6",
  },
  sectionInner: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 12,
    margin: "0 0 12px",
  },
  sectionHeading: {
    fontSize: "clamp(28px, 3.5vw, 40px)",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
    color: "#0a0a0a",
    margin: "0 0 48px",
  },

  // FEATURES
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 0,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  featureCard: {
    padding: "28px 28px",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 12,
    color: "#555",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111",
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
  },

  // STEPS
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    maxWidth: 640,
    position: "relative",
  },
  step: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    position: "relative",
    paddingBottom: 36,
  },
  stepNum: {
    fontSize: 13,
    fontWeight: 700,
    color: "#9ca3af",
    minWidth: 30,
    paddingTop: 2,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.04em",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.65,
  },
  stepLine: {
    position: "absolute",
    left: 14,
    top: 24,
    bottom: 0,
    width: 1,
    background: "#e5e7eb",
  },

  // TESTIMONIALS
  testimonialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
  },
  testimonialCard: {
    padding: "24px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
  },
  testimonialQuote: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.7,
    margin: "0 0 20px",
    fontStyle: "italic",
  },
  testimonialMeta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  testimonialAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  testimonialName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111",
  },
  testimonialRole: {
    fontSize: 12,
    color: "#9ca3af",
  },

  // CTA BAND
  ctaBand: {
    background: "#0a0a0a",
    padding: "80px 24px",
    textAlign: "center",
  },
  ctaBandInner: {
    maxWidth: 560,
    margin: "0 auto",
  },
  ctaHeading: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.025em",
    margin: "0 0 14px",
  },
  ctaSub: {
    fontSize: 16,
    color: "#9ca3af",
    margin: "0 0 32px",
  },
  btnHeroWhite: {
    background: "#fff",
    color: "#111",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    padding: "13px 28px",
    cursor: "pointer",
  },

  // FOOTER
  footer: {
    borderTop: "1px solid #f3f4f6",
    padding: "28px 24px",
  },
  footerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  footerLinks: {
    display: "flex",
    gap: 20,
    flex: 1,
  },
  footerLink: {
    fontSize: 13,
    color: "#9ca3af",
    textDecoration: "none",
  },
  footerCopy: {
    fontSize: 12,
    color: "#d1d5db",
  },
};
