select league_friends.summoner_name as LeagueFriends from league_users
join league_friends on league_friends.user_id = league_users.id
where league_users.id = $1