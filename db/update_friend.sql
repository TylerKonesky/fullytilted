update league_friends
set kills = $2, assists = $3, deaths = $4
where account_id = $1;