USE test_db;

INSERT INTO countries (name) VALUES ('Sri Lanka'), ('India'), ('USA');

INSERT INTO cities (name, country_id) VALUES 
('Colombo', 1),
('Kandy', 1),
('Mumbai', 2),
('New York', 3);

INSERT INTO customers (name, dob, nic) VALUES 
('Alice Perera', '1990-01-15', '901234567V'),
('Bob Silva', '1985-07-20', '850987654V'),
('Charlie Fernando', '1995-05-05', '951112223V');

-- Mobile numbers
INSERT INTO mobile_numbers (customer_id, number) VALUES
(1, '0771234567'),
(1, '0712345678'),
(2, '0759876543');

-- Addresses
INSERT INTO addresses (customer_id, address_line1, address_line2, city , country) VALUES
(1, '123 Main St', 'Apt 4', "Colombo", "Sri Lanka"),
(2, '456 Lake Rd', NULL, "Kandy", "Sri Lanka"),
(3, '789 Hill View', 'Suite 10', "Mumbai", "India");

-- Family relationships
INSERT INTO customer_family (customer_id, family_member_id) VALUES
(1, 2), -- Alice → Bob
(2, 1), -- Bob → Alice
(2, 3); -- Bob → Charlie