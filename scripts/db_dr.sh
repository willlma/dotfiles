curl -o ../dumps/master-latest.dump `heroku pg:backups public-url --app full-harvest`
pg_restore --verbose --clean --no-acl --no-owner -h localhost -p 5432 -d full_harvest_test ../dumps/master-latest.dump
