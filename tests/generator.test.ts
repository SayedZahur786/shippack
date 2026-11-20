import test from "node:test";
import assert from "node:assert/strict";
import { generate } from "../lib/generate";
import { sample, samplePack } from "../lib/analyze";
test("model adapter validates all four artifacts and supplies grounded instructions", async () => {
  const oldFetch = globalThis.fetch,
    oldKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "unit-test-only";
  globalThis.fetch = async (_url, init) => {
    const input = JSON.parse(String(init?.body));
    assert.match(input.messages[0].content, /Never invent/);
    assert.match(input.messages[1].content, /app\/api\/food/);
    return Response.json({
      choices: [{ message: { content: JSON.stringify({...samplePack, "../../unexpected": "Discard this extra field"}) } }],
    });
  };
  try {
    assert.deepEqual(await generate(sample), samplePack);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey) process.env.OPENAI_API_KEY = oldKey;
    else delete process.env.OPENAI_API_KEY;
  }
});
test("incomplete model response cannot be delivered", async () => {
  const oldFetch = globalThis.fetch,
    oldKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "unit-test-only";
  globalThis.fetch = async () =>
    Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({ readme: "Missing other documents" }),
          },
        },
      ],
    });
  try {
    await assert.rejects(generate(sample), /incomplete/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey) process.env.OPENAI_API_KEY = oldKey;
    else delete process.env.OPENAI_API_KEY;
  }
});
