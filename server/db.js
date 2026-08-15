import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'chronova_db.json');

// Initialize database file structure
const defaultSchema = {
  users: [
    {
      id: "usr_1",
      name: "Lord Alexander Wright",
      email: "alexander@chronova.ch",
      passwordHash: "$2a$10$7v5J4q5H/G2c9t6f8g7h6eY7v8w9x0y1z2a3b4c5d6e7f8g9h0",
      memberId: "#CN-7792-CH",
      tier: "PATRON TIER",
      vaultItems: [
        {
          id: "gt01-084",
          name: "Chronova Apex GT-01",
          serialNumber: "CN-8800-084 / 500",
          warrantyExpiry: "October 2031",
          certifiedChronometer: true,
          acquiredAt: "2026-08-10"
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  orders: [],
  subscribers: [],
  conciergeMessages: [
    {
      id: "msg_init",
      userId: "usr_1",
      sender: "concierge",
      text: "Good evening Lord Alexander. Your Chronova Apex GT-01 allocation is secured with 5-year warranty active. How may the Geneva salon assist you today?",
      time: "18:24"
    }
  ]
};

// Thread-safe read/write helpers
export function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSchema, null, 2), 'utf-8');
      return defaultSchema;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return defaultSchema;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// User Operations
export const userDB = {
  getAll: () => {
    const db = readDB();
    return db.users;
  },
  findByEmail: (email) => {
    const db = readDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  },
  findById: (id) => {
    const db = readDB();
    return db.users.find(u => u.id === id);
  },
  create: (userData) => {
    const db = readDB();
    db.users.push(userData);
    writeDB(db);
    return userData;
  },
  addWatchToVault: (userId, watchItem) => {
    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      if (!user.vaultItems) user.vaultItems = [];
      user.vaultItems.unshift(watchItem);
      writeDB(db);
    }
    return user;
  }
};

// Order Operations
export const orderDB = {
  getAll: () => {
    const db = readDB();
    return db.orders;
  },
  create: (orderData) => {
    const db = readDB();
    db.orders.unshift(orderData);
    writeDB(db);
    return orderData;
  },
  findByUser: (userId) => {
    const db = readDB();
    return db.orders.filter(o => o.userId === userId);
  }
};

// Subscriber Operations
export const subscriberDB = {
  getAll: () => {
    const db = readDB();
    return db.subscribers;
  },
  add: (email) => {
    const db = readDB();
    const existing = db.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase().trim());
    if (!existing) {
      const entry = { id: `sub_${Date.now()}`, email, subscribedAt: new Date().toISOString() };
      db.subscribers.push(entry);
      writeDB(db);
      return entry;
    }
    return existing;
  }
};

// Concierge Operations
export const conciergeDB = {
  getAll: () => {
    const db = readDB();
    return db.conciergeMessages;
  },
  getByUser: (userId) => {
    const db = readDB();
    return db.conciergeMessages.filter(m => m.userId === userId);
  },
  addMessage: (message) => {
    const db = readDB();
    db.conciergeMessages.push(message);
    writeDB(db);
    return message;
  }
};
