import sharp from "sharp";
import { readFileSync } from "node:fs";
const segments = readFileSync("docs/captions.srt", "utf8").trim().split("\n\n");
for (const [i, segment] of segments.entries()) {
  const lines = segment.split("\n").slice(2);
  const text = lines
    .map(
      (line, j) =>
        `<text x="720" y="${901 + j * 41}" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="34">${line.replaceAll("&", "&amp;")}</text>`,
    )
    .join("");
  await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1000"><rect x="120" y="858" width="1200" height="116" rx="12" fill="#18271e"/>${text}</svg>`,
    ),
  )
    .png()
    .toFile(`docs/recording/caption-${i}.png`);
}
