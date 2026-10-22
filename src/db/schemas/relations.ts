import { defineRelations } from "drizzle-orm";
import * as schema from "../index.schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    session: r.many.session(),
    accounts: r.many.account(),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
}));
