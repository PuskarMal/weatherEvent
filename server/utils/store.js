import { readFile, writeFile } from "fs/promises";
import { dirname, join }       from "path";
import { fileURLToPath }       from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE      = join(__dirname, "..", "comments.json");

export async function readData() {
  try {
    const raw = await readFile(FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    // file missing or empty
    return [];
  }
}

export async function writeData(data) {
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}
