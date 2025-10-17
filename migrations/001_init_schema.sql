-- Policies table
CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  policy_number TEXT NOT NULL UNIQUE,
  policy_holder_name TEXT NOT NULL,
  deductible REAL NOT NULL DEFAULT 0,
  
  -- Coverage limits
  dwelling REAL NOT NULL DEFAULT 0,
  dwelling_debris REAL NOT NULL DEFAULT 0,
  other_structures REAL NOT NULL DEFAULT 0,
  other_structures_debris REAL NOT NULL DEFAULT 0,
  personal_property REAL NOT NULL DEFAULT 0,
  personal_property_debris REAL NOT NULL DEFAULT 0,
  ale REAL NOT NULL DEFAULT 0,
  trees_shrubs_landscaping REAL NOT NULL DEFAULT 0,
  extended_dwelling REAL NOT NULL DEFAULT 0,
  extended_dwelling_debris REAL NOT NULL DEFAULT 0,
  extended_other_structures REAL NOT NULL DEFAULT 0,
  extended_other_structures_debris REAL NOT NULL DEFAULT 0,
  personal_property_options REAL NOT NULL DEFAULT 0,
  building_code REAL NOT NULL DEFAULT 0
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL,
  checkpoint_date TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  amount REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL,
  payment_id TEXT,
  file_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_policy_id ON payments(policy_id);
CREATE INDEX IF NOT EXISTS idx_payments_checkpoint_date ON payments(checkpoint_date);
CREATE INDEX IF NOT EXISTS idx_documents_policy_id ON documents(policy_id);
CREATE INDEX IF NOT EXISTS idx_documents_payment_id ON documents(payment_id);

