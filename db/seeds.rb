# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

course = Course.create(name: 'Tecnologia em Sistemas de Computação')

disciplines = [
  {
    name: 'Projeto de Desenvolvimento de Algoritmos',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium voluptates consequatur, consequuntur laboriosam fugit sunt cupiditate, optio quas incidunt similique, eius vel accusantium nam. Ipsam rerum enim adipisci deleniti non!'
  },
  {
    name: 'Construção de Páginas Web',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni ad fugiat quisquam qui cumque. Vel, iusto, voluptates. Sint possimus saepe, sit recusandae officia sed aut et quis nisi deleniti omnis?'
  },
  {
    name: 'Estrutura de Dados',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi asperiores dolor consequatur corporis quod esse id saepe laborum sit nemo repellat, inventore, voluptatibus maiores reiciendis beatae itaque totam quidem, rerum.'
  }
]

disciplines.each do |discipline|
  Discipline.create(name: discipline[:name], description: discipline[:description])
end

disciplines = Discipline.all

disciplines.each do |discipline|
  course.disciplines << discipline
end
