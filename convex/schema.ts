import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    files: defineTable({
        name: v.string(),
        orgId: v.optional(v.string()),
    }).index("by_orgId", ["orgId"]),

    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string()),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
})