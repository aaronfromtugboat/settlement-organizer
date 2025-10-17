-- Sample Policy Data (matching the example from the CSV)
INSERT INTO policies (
  id, policy_number, policy_holder_name, deductible,
  dwelling, dwelling_debris, other_structures, other_structures_debris,
  personal_property, personal_property_debris, ale, trees_shrubs_landscaping,
  extended_dwelling, extended_dwelling_debris, extended_other_structures,
  extended_other_structures_debris, personal_property_options, building_code
) VALUES (
  'sample-policy-001',
  'POL-2025-12345',
  'Sample Policyholder',
  4828.00,
  1009157.00, 50457.85, 100916.00, 5045.80,
  756867.00, 37843.35, 302747.00, 50457.85,
  504578.50, 25228.93, 50457.85, 2522.89,
  2500.00, 100916.00
);

-- Sample Payments from 3/10/2025
INSERT INTO payments (id, policy_id, checkpoint_date, coverage_type, amount, notes) VALUES
  ('payment-001', 'sample-policy-001', '2025-03-10', 'dwelling', 944513.72, NULL),
  ('payment-002', 'sample-policy-001', '2025-03-10', 'other_structures', 100916.00, NULL),
  ('payment-003', 'sample-policy-001', '2025-03-10', 'other_structures_debris', 6252.73, NULL),
  ('payment-004', 'sample-policy-001', '2025-03-10', 'personal_property', 378433.50, NULL),
  ('payment-005', 'sample-policy-001', '2025-03-10', 'trees_shrubs_landscaping', 44964.21, NULL),
  ('payment-006', 'sample-policy-001', '2025-03-10', 'extended_other_structures', 114.52, NULL),
  ('payment-007', 'sample-policy-001', '2025-03-10', 'extended_other_structures_debris', 5.72, NULL),
  ('payment-008', 'sample-policy-001', '2025-03-10', 'building_code', 79734.83, NULL);

-- Sample Payments from 5/9/2025
INSERT INTO payments (id, policy_id, checkpoint_date, coverage_type, amount, notes) VALUES
  ('payment-009', 'sample-policy-001', '2025-05-09', 'dwelling', 37135.69, NULL),
  ('payment-010', 'sample-policy-001', '2025-05-09', 'personal_property', 113530.05, NULL),
  ('payment-011', 'sample-policy-001', '2025-05-09', 'ale', 57012.47, NULL),
  ('payment-012', 'sample-policy-001', '2025-05-09', 'trees_shrubs_landscaping', 5493.64, NULL),
  ('payment-013', 'sample-policy-001', '2025-05-09', 'extended_other_structures', 2346.89, NULL),
  ('payment-014', 'sample-policy-001', '2025-05-09', 'extended_other_structures_debris', -5.72, 'Adjustment'),
  ('payment-015', 'sample-policy-001', '2025-05-09', 'building_code', 2503.88, NULL),
  ('payment-016', 'sample-policy-001', '2025-05-09', 'other_structures_debris', -1206.93, 'Reconciliation');

