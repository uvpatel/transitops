import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "INVITED"
]);

export const roleCodeEnum = pgEnum("role_code", [
  "ADMIN",
  "FLEET_MANAGER",
  "DISPATCHER",
  "DRIVER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
  "MECHANIC"
]);

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  address: text("address"),
  timezone: varchar("timezone", { length: 50 }).default("UTC").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  passwordHash: text("password_hash"),
  status: userStatusEnum("status").default("ACTIVE").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("idx_users_org_id").on(table.organizationId),
  index("idx_users_email").on(table.email),
]);

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  description: text("description"),
  isSystemRole: boolean("is_system_role").default(false).notNull(),
}, (table) => [
  index("idx_roles_org_id").on(table.organizationId),
]);

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
  assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
}, (table) => [
  uniqueIndex("user_roles_user_id_role_id_unique").on(table.userId, table.roleId),
  index("idx_user_roles_user_id").on(table.userId),
  index("idx_user_roles_role_id").on(table.roleId),
]);
