insert into league_friends ( summoner_name, account_id, user_id)
values ($1, $2, $3)
returning *;