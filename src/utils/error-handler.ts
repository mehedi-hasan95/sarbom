import { DrizzleQueryError } from "drizzle-orm/errors";

type PgError = Error & {
  code: string;
  constraint?: string;
  detail?: string;
};

const isPgError = (e: unknown): e is PgError =>
  e instanceof Error && "code" in e && typeof e.code === "string";

export const getPgError = (error: unknown): PgError | null => {
  const source = error instanceof DrizzleQueryError ? error.cause : error;
  return isPgError(source) ? source : null;
};
