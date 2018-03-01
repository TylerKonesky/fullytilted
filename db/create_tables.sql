create table league_users (
id serial primary key, 
first_name varchar(20), 
last_name varchar(40), 
summoner_name text, 
email text, 
preferred_role text, 
user_summoner_id integer, 
user_account_id integer, 
auth_id text
)

create table league_friends (
id serial primary key,
user_id int,
summoner_name Text,
account_id int
)

