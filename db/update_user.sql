update league_users 
set first_name = $1, last_name = $2, summoner_name = $3, email = $4, preferred_role = $5, summoner_id = $6, account_id = $7
where auth_id = $8