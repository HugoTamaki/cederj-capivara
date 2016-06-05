# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

computacao = Course.create(name: 'Tecnologia em Sistemas de Computação')

disciplines_computacao = [
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

turismo = Course.create(name: 'Gestão em Turismo')

disciplines_turismo = [
  {
    name: 'Fundamentos do Turismo',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos dolores, ipsum nam aliquam deserunt cumque, eius labore dolore voluptatum accusamus, molestias amet corporis quam sunt, quidem itaque ea sint minus.'
  },
  {
    name: 'Turismo e Sociedade',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, possimus fugiat commodi incidunt cupiditate aliquam? Aut, est ex, harum quaerat explicabo voluptas. Delectus et, quidem. Libero nesciunt dignissimos fugiat dolores.'
  },
  {
    name: 'Relações Interpessoais',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere unde possimus veritatis tempora, reiciendis eveniet ab ullam accusantium vitae, repellat cum alias, officia optio veniam, error quia. Aperiam optio, enim?'
  }
]

disciplines_computacao.each do |discipline|
  Discipline.create(name: discipline[:name], description: discipline[:description], course: computacao)
end

disciplines_turismo.each do |discipline|
  Discipline.create(name: discipline[:name], description: discipline[:description], course: turismo)
end

