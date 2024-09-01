# Clear existing data (optional)
User.destroy_all

# Create a list of sample users
users = [
  { email: 'alice@example.com', password: 'password123' },
  { email: 'bob@example.com', password: 'password123' },
  { email: 'charlie@example.com', password: 'password123' },
  { email: 'diana@example.com', password: 'password123' },
  { email: 'eve@example.com', password: 'password123' }
]

# Seed the users into the database
users.each do |user_data|
  User.create!(user_data)
end

puts "Seeded #{User.count} users."
