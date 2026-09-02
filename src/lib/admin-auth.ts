import { createServerFn } from "@tanstack/react-start";

type LoginInput = {
  username: string;
  password: string;
};

async function sessionManager() {
  const { useSession, getRequestProtocol } = await import("@tanstack/react-start/server");
  const { createHash } = await import("node:crypto");

  const username = process.env["ADMIN_USERNAME"] ?? "";
  const password = process.env["ADMIN_PASSWORD"] ?? "";
  const secret =
    process.env["ADMIN_SESSION_SECRET"] ??
    createHash("sha256").update(`alsaqiya-admin:${username}:${password}`).digest("hex");

  if (secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }

  return useSession<{ user?: string }>({
    name: "alsaqiya-admin",
    password: secret,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: getRequestProtocol() === "https",
      path: "/",
    },
  });
}

function configured() {
  return Boolean(process.env["ADMIN_USERNAME"] && process.env["ADMIN_PASSWORD"]);
}

async function sameSecret(left: string, right: string) {
  const { createHash, timingSafeEqual } = await import("node:crypto");
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export const getAdminUser = createServerFn({ method: "GET" }).handler(async () => {
  if (!configured()) return null;
  const session = await sessionManager();
  return session.data.user ?? null;
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((input: LoginInput) => ({
    username: String(input.username ?? "").trim(),
    password: String(input.password ?? ""),
  }))
  .handler(async ({ data }) => {
    if (!configured()) {
      return {
        ok: false as const,
        error: "Admin login is not configured on the server yet.",
      };
    }

    const expectedUser = process.env["ADMIN_USERNAME"] ?? "";
    const expectedPass = process.env["ADMIN_PASSWORD"] ?? "";
    const userOk = await sameSecret(data.username.toLowerCase(), expectedUser.toLowerCase());
    const passOk = await sameSecret(data.password, expectedPass);

    if (!userOk || !passOk) {
      return { ok: false as const, error: "Invalid email or password." };
    }

    const session = await sessionManager();
    await session.update({ user: expectedUser });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await sessionManager();
  await session.clear();
  return { ok: true as const };
});
