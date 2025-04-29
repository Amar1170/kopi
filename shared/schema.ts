import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image_url: text("image_url"),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  image_url: text("image_url"),
  category_id: integer("category_id").notNull(),
  featured: boolean("featured").default(false),
  available: boolean("available").default(true),
});

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  phone: text("phone"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  hours: text("hours"),
  image_url: text("image_url"),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customer_name: text("customer_name").notNull(),
  customer_email: text("customer_email"),
  customer_phone: text("customer_phone"),
  total: doublePrecision("total").notNull(),
  status: text("status").notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  pickup_location_id: integer("pickup_location_id"),
  pickup_time: timestamp("pickup_time"),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").notNull(),
  product_id: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories);
export const insertProductSchema = createInsertSchema(products);
export const insertLocationSchema = createInsertSchema(locations);
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, created_at: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Cart item schema (not stored in database)
export const cartItemSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
  product: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    image_url: z.string().optional(),
  }),
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;
