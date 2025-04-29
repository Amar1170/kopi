import {
  Category,
  InsertCategory,
  Product,
  InsertProduct,
  Location,
  InsertLocation,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
} from "@shared/schema";

// Storage interface with all the CRUD methods we need
export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private locations: Map<number, Location>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  
  private categoryId: number;
  private productId: number;
  private locationId: number;
  private orderId: number;
  private orderItemId: number;
  
  constructor() {
    // Initialize maps
    this.categories = new Map();
    this.products = new Map();
    this.locations = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    // Initialize IDs
    this.categoryId = 1;
    this.productId = 1;
    this.locationId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Add default categories
    const coffeeCategory = this.createCategory({
      name: "Coffee",
      description: "Our selection of freshly brewed coffee",
      image_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const pastryCategory = this.createCategory({
      name: "Pastries",
      description: "Freshly baked pastries and desserts",
      image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    const teaCategory = this.createCategory({
      name: "Tea",
      description: "Our finest selection of teas",
      image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    // Add products
    this.createProduct({
      name: "Espresso",
      description: "A concentrated shot of coffee with a rich flavor.",
      price: 2.99,
      image_url: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: coffeeCategory.id,
      featured: true,
      available: true,
    });
    
    this.createProduct({
      name: "Cappuccino",
      description: "Espresso with steamed milk and a dense layer of milk foam.",
      price: 4.50,
      image_url: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: coffeeCategory.id,
      featured: true,
      available: true,
    });
    
    this.createProduct({
      name: "Latte",
      description: "Espresso with a lot of steamed milk and a light layer of foam.",
      price: 4.25,
      image_url: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: coffeeCategory.id,
      featured: false,
      available: true,
    });
    
    this.createProduct({
      name: "Croissant",
      description: "Flaky, buttery pastry.",
      price: 3.50,
      image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: pastryCategory.id,
      featured: true,
      available: true,
    });
    
    this.createProduct({
      name: "Blueberry Muffin",
      description: "Moist, cake-like muffin packed with blueberries.",
      price: 3.25,
      image_url: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: pastryCategory.id,
      featured: false,
      available: true,
    });
    
    this.createProduct({
      name: "Chocolate Chip Cookie",
      description: "Classic cookie with chunks of chocolate.",
      price: 2.75,
      image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: pastryCategory.id,
      featured: false,
      available: true,
    });
    
    this.createProduct({
      name: "Green Tea",
      description: "Light and refreshing green tea.",
      price: 3.50,
      image_url: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category_id: teaCategory.id,
      featured: false,
      available: true,
    });
    
    // Add locations
    this.createLocation({
      name: "Downtown",
      address: "123 Main St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      phone: "206-555-1234",
      latitude: 47.6062,
      longitude: -122.3321,
      hours: "Mon-Fri: 6am-8pm, Sat-Sun: 7am-7pm",
      image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createLocation({
      name: "Uptown",
      address: "456 Park Ave",
      city: "Seattle",
      state: "WA",
      zip: "98109",
      phone: "206-555-5678",
      latitude: 47.6205,
      longitude: -122.3493,
      hours: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-6pm",
      image_url: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createLocation({
      name: "Eastside",
      address: "789 Broadway",
      city: "Bellevue",
      state: "WA",
      zip: "98004",
      phone: "425-555-9012",
      latitude: 47.6101,
      longitude: -122.2015,
      hours: "Mon-Sun: 6:30am-8pm",
      image_url: "https://images.unsplash.com/photo-1559305616-3f99cd43e353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category_id === categoryId
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Location methods
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }
  
  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.locationId++;
    const newLocation: Location = { ...location, id };
    this.locations.set(id, newLocation);
    return newLocation;
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const created_at = new Date();
    const newOrder: Order = { ...order, id, created_at };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }
  
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newItem: OrderItem = { ...item, id };
    
    const items = this.orderItems.get(item.order_id) || [];
    items.push(newItem);
    this.orderItems.set(item.order_id, items);
    
    return newItem;
  }
}

// Export a single instance of the storage
export const storage = new MemStorage();
