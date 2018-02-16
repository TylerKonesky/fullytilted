Insert into league_users ( auth_id )
values ( $1 )
RETURNING *;