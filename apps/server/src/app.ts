import { config } from "./config";

const server = Bun.serve({
  hostname: config.server.hostname,
  port: config.server.port,

  development: {
    hmr: true,
    console: true,
    chromeDevToolsAutomaticWorkspaceFolders: false, // Change if the server returns HTML
  },

  routes: {
    "/api/health": {
      GET: () => {
        return Response.json({
          status: "ok",
          timestamp: new Date().toISOString(),
        });
      },
    },

    "/api/sign": {
      POST: (req) => {
        const authorization = req.headers.get("Authorization");
        if (!authorization) {
          return new Response("unauthorized", { status: 401 });
        }

        const parts = authorization.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
          return new Response("unauthorized", { status: 401 });
        }

        const token = parts[1];
        if (!token) {
          return new Response("unauthorized", { status: 401 });
        }

        return Response.json({ message: "ok", token });
      },
    },
  },

  fetch: (_req) => {
    return new Response("not found", { status: 404 });
  },

  error: (error) => {
    console.error("Server error:", error);
    if (process.env.NODE_ENV === "production") {
      return Response.json(
        {
          error: "internal server error",
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        error: error.message,
        stack: error.stack,
      },
      {
        status: 500,
      },
    );
  },
});

console.log(`Server running at ${server.url}`);
