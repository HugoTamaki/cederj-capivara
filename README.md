
# Cederj Capivara

Website / API for students of CEDERJ

## To run at development environment

Create a database.yml file at `config/` based on database.yml.example

This application uses postgres, you must have it installed.

Also you must have node.js installed too. Recommended version - 4.2.1

run:

```
bundle install
```

After instalation of dependencies, run this to add angular dependencies

```
bower install
```

To create the database, run:

```
rake db:create
```

To run the migrations:

```
rake db:migrate
```

Run `rails s` and be happy :)

This project uses rspec for specs. To run tests, run the command:

```
rspec spec
```