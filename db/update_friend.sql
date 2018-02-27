update league_friends
set kills = $2, assists = $3, deaths = $4
where account_id = $1;

select * from league_friends
where user_id = $5;