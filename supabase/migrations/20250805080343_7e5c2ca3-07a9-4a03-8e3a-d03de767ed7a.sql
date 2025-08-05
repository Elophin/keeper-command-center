-- Clean up old demo users with @demo.com emails
DELETE FROM profiles WHERE email LIKE '%@demo.com';