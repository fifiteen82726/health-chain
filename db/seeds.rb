# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Ac.destroy_all


user = User.create(email: 'user1@gmail.com', password: '123123123')
ac1 = Ac.create(name: 'Airline_A', email: 'airlinea@gmail.com', password: '123123123')
ac2 = Ac.create(name: 'Airline_B', email: 'airlineb@gmail.com', password: '123123123')

Order.create(user: user, ac: ac1, seat: '38A', date: DateTime.new(2020,1,1), arrival: 'Toronto', departure: 'Buffalo')
Order.create(user: user, ac: ac1, seat: '30B', date: DateTime.new(2020,2,1), arrival: 'Chicago', departure: 'Buffalo')
Order.create(user: user, ac: ac1, seat: '10C', date: DateTime.new(2020,3,1), arrival: 'Boston', departure: 'Buffalo')
