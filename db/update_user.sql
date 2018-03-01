update league_users 
set first_name = $1, last_name = $2, user_summoner_name = $3, email = $4, preferred_role = $5, user_summoner_id = $6, user_account_id = $7
where auth_id = $8