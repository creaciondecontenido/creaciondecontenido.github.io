const net = require("net");
const { spawn } = require("child_process");

const FALLBACK_PORTS = [3001, 4000, 8080, 0];

function parsePort(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    return null;
  }
  return parsed;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.unref();

    server.on("error", () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

async function findFreePort() {
  const requestedPort = parsePort(process.env.PORT);
  const candidates = [];

  if (requestedPort !== null) {
    candidates.push(requestedPort);
  }

  for (const port of FALLBACK_PORTS) {
    if (!candidates.includes(port)) {
      candidates.push(port);
    }
  }

  for (const port of candidates) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  return 0;
}

async function run() {
  const port = await findFreePort();
  process.env.PORT = String(port);
  if (port === 0) {
    console.log("Starting dev server on a random available port...");
  } else {
    console.log(`Starting dev server on port ${port}...`);
  }

  const child = spawn("npm run start:craco", {
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

run().catch((error) => {
  console.error("Failed to start dev server:", error);
  process.exit(1);
});
