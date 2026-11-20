export type Evidence = { label: string; path: string };
export type Analysis = {
  name: string;
  stack: string[];
  features: Evidence[];
  checklist: { title: string; detail: string }[];
  files: number;
};
export type Source = { path: string; content: string };
export function analyze(files: Source[], name: string): Analysis {
  const stack = new Set<string>();
  const features: Evidence[] = [];
  for (const f of files) {
    if (/package\.json$/.test(f.path)) {
      try {
        const p = JSON.parse(f.content);
        for (const [dep, label] of Object.entries({
          next: "Next.js",
          react: "React",
          typescript: "TypeScript",
          express: "Express",
          stripe: "Stripe",
          "@neondatabase/serverless": "Neon",
        }))
          if (p.dependencies?.[dep] || p.devDependencies?.[dep])
            stack.add(label);
      } catch {}
    }
    if (/\.py$/.test(f.path)) stack.add("Python");
    if (/\.sol$/.test(f.path)) stack.add("Solidity");
    if (/route\.[jt]s$|api\//.test(f.path))
      features.push({ label: "Server endpoint", path: f.path });
    if (/auth|login/i.test(f.path))
      features.push({ label: "Authentication-related code", path: f.path });
    if (/map|location/i.test(f.path))
      features.push({ label: "Location-related interface", path: f.path });
    if (/test|spec/.test(f.path))
      features.push({
        label: "Test coverage present; execution unverified",
        path: f.path,
      });
  }
  const selected = features.slice(0, 12);
  return {
    name:
      name.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 70) || "Untitled project",
    stack: [...stack],
    features: selected,
    files: files.length,
    checklist: [
      {
        title: "Problem",
        detail: `Explain who ${name.slice(0, 70)} serves and the specific pain. User demand cannot be verified from source code; add your team's evidence.`,
      },
      {
        title: "Solution",
        detail: selected.length
          ? `Show the implemented flow suggested by ${selected[0].path}. Verify it works in the running demo.`
          : "Walk through one working user flow. No feature-specific code was detected in the sampled files.",
      },
      {
        title: "Demo",
        detail:
          "Record a two-minute walkthrough: 20 seconds of context, 70 seconds of the working flow, 20 seconds of implementation, 10 seconds of limitations. Check the event’s exact video rules.",
      },
      {
        title: "Tech",
        detail: `Detected: ${[...stack].join(", ") || "no recognized stack in sampled files"}. Cite source evidence, distinguish built work from dependencies, and verify the repository is accessible to judges.`,
      },
    ],
  };
}
export const sampleFiles: Source[] = [
  {
    path: "package.json",
    content: JSON.stringify({
      dependencies: {
        next: "16",
        react: "19",
        "@neondatabase/serverless": "1",
      },
      devDependencies: { typescript: "5" },
    }),
  },
  {
    path: "app/api/food/route.ts",
    content:
      "export async function GET() { return Response.json({listings: []}) }",
  },
  {
    path: "app/map/page.tsx",
    content:
      "export default function Map(){ return <h1>Find surplus food near campus</h1> }",
  },
  { path: "tests/listings.test.ts", content: "Listing validation test suite" },
  {
    path: "README.md",
    content:
      "CampusPlate connects campus kitchens with students looking for surplus meals. Prototype; no impact claims have been measured.",
  },
];
export const sample = analyze(sampleFiles, "CampusPlate");
export type Pack = {
  readme: string;
  devpost: string;
  script: string;
  checklist: string;
};
export function draft(a: Analysis): Pack {
  const evidence = a.features.map((f) => `- ${f.label}: ${f.path}`).join("\n");
  return {
    readme: `# ${a.name}\n\n## Overview\nRepository-based draft for team review.\n\n## Stack\n${a.stack.join(", ")}\n\n## Source evidence\n${evidence}\n\n## Verification\nRun the project using its documented setup. Confirm each flow before submitting. Repository inspection does not prove runtime behavior.`,
    devpost: `## Inspiration\n${a.checklist[0].detail}\n\n## What it does\nThe repository contains the following implementation evidence:\n${evidence}\n\n## How we built it\nDetected technologies: ${a.stack.join(", ")}.\n\n## Challenges\nDescribe an actual development challenge and how the team addressed it.\n\n## Accomplishments\nPresent the working flow; avoid unmeasured impact claims.\n\n## What we learned\nAdd the team's own learning, which source code cannot establish.\n\n## What's next\nConfirm the prototype's limitations and prioritize the next improvement.`,
    script: `# Two-minute demo: ${a.name}\n\n0:00–0:20 — Introduce the user and problem in one sentence.\n0:20–0:50 — Open the app and demonstrate the primary input.\n0:50–1:30 — Show the result and explain source-backed capabilities: ${a.features.map((x) => x.label).join(", ")}.\n1:30–1:50 — Explain the architecture using ${a.stack.join(", ")}.\n1:50–2:00 — State one known limitation and close.\n\nRehearse against a timer. This is a storyboard, not proof of a working demo.`,
    checklist: a.checklist
      .map((c) => `- [ ] **${c.title}**: ${c.detail}`)
      .join("\n"),
  };
}
export const samplePack: Pack = {
  ...draft(sample),
  devpost:
    "## Inspiration\nCampus kitchens can have surplus meals while students look for affordable food. CampusPlate explores a simpler way to make those meals visible.\n\n## What it does\nThe sample repository includes a food-listing endpoint and a location interface. These are prototype capabilities, not verified production outcomes.\n\n## How we built it\nNext.js and React power the interface, with Neon declared as the database dependency. TypeScript is used for development.\n\n## Challenges and learning\nThe sample does not establish the team’s development history. Add your own account before submission.\n\n## What’s next\nValidate the workflow with campus kitchens and test listing freshness. No adoption or food-waste reduction has been measured.",
};
