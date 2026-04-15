const installExamples = [
  "npx prompt-foundry list all",
  "npx prompt-foundry install skill repo-audit",
  "npx prompt-foundry install prompt feature-spec --dir .prompt-foundry",
  "npx prompt-foundry install agent pr-review"
];

const contentTypes = [
  {
    title: "Prompts",
    text: "Single-purpose markdown building blocks you can drop into a workflow immediately."
  },
  {
    title: "Skills",
    text: "Structured systems with repeatable steps for common project tasks and reviews."
  },
  {
    title: "Agents",
    text: "Role-based multi-step instructions for larger flows like review, planning, or execution."
  }
];

const steps = [
  "Publish the root package to npm under `prompt-foundry`.",
  "Enable GitHub Pages for this repository.",
  "Run `npm install --prefix website` and `npm run build --prefix website`.",
  "Let the included GitHub Actions workflow deploy the `website/` build for free."
];

export default function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Open source prompt tooling</p>
        <h1>Install prompts, skills, and agents with one `npx` command.</h1>
        <p className="lede">
          Prompt Foundry packages plain markdown assets behind a tiny CLI so people can pull the
          exact building block they need without paying for hosting, APIs, or a SaaS layer.
        </p>

        <div className="terminal">
          {installExamples.map((line) => (
            <code key={line}>{line}</code>
          ))}
        </div>
      </section>

      <section className="grid three-up">
        {contentTypes.map((item) => (
          <article className="card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid two-up">
        <article className="card">
          <h2>How installs work</h2>
          <p>
            The CLI copies packaged markdown files into a local `.prompt-foundry/` folder in the
            caller&apos;s project. It avoids remote services entirely.
          </p>
          <p>
            Example output paths: `.prompt-foundry/prompts/`, `.prompt-foundry/skills/`, and
            `.prompt-foundry/agents/`.
          </p>
        </article>

        <article className="card accent">
          <h2>Deploy free on GitHub Pages</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="footer-note">
        <p>
          Everything here stays simple: one npm package, one static React site, one GitHub Pages
          deployment path.
        </p>
      </section>
    </main>
  );
}
