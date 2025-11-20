import { config } from "../config.js";

export function withAuth(
  handler: (req: Request, token: string) => Response | Promise<Response>,
) {
  return (req: Request) => {
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

    // Verify token against configured valid tokens
    if (!config.server.apiTokens.includes(token)) {
      return new Response("unauthorized", { status: 401 });
    }

    return handler(req, token);
  };
}
