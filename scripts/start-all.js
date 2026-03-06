const { spawn, spawnSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");

const pythonCandidates = [
  process.env.PYTHON_CMD,
  process.env.PYTHON,
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps", "python3.11.exe")
    : null,
  "python",
  "python3",
  "py -3.11",
].filter(Boolean);

function commandExists(command) {
  const result = spawnSync(command, ["--version"], {
    shell: true,
    stdio: "ignore",
  });
  return result.status === 0;
}

function pickPythonCommand() {
  for (const candidate of pythonCandidates) {
    if (commandExists(candidate)) {
      return candidate;
    }
  }
  throw new Error("No Python command found. Set PYTHON_CMD env var to your python executable.");
}

const pythonCommand = pickPythonCommand();
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

console.log(`Using Python command: ${pythonCommand}`);
console.log("Starting backend and frontend...");

const backend = spawn(pythonCommand, ["server.py"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true,
});

const frontend = spawn(npmCommand, ["run", "start"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

function shutdown(code = 0) {
  if (!backend.killed) backend.kill("SIGINT");
  if (!frontend.killed) frontend.kill("SIGINT");
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

backend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`Backend exited with code ${code}`);
    shutdown(code);
  }
});

frontend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`Frontend exited with code ${code}`);
    shutdown(code);
  }
});
