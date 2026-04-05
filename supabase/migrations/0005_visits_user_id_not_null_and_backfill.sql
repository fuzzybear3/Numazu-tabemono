-- Drop any visits without a user_id (orphaned pre-auth rows)
delete from visits where user_id is null;

-- Make user_id required
alter table visits alter column user_id set not null;

-- Backfill rankings for visits that never got a ranking row.
-- Assigns new positions after each user's current max, ordered by first visit date.
with missing as (
  select
    v.restaurant_id,
    v.user_id,
    min(v.visited_at) as first_visited
  from visits v
  where not exists (
    select 1 from rankings r
    where r.user_id = v.user_id
      and r.restaurant_id = v.restaurant_id
  )
  group by v.restaurant_id, v.user_id
),
max_positions as (
  select user_id, coalesce(max(rank_position), 0) as max_pos
  from rankings
  group by user_id
),
numbered as (
  select
    m.restaurant_id,
    m.user_id,
    coalesce(mp.max_pos, 0) + row_number() over (partition by m.user_id order by m.first_visited) as rank_position
  from missing m
  left join max_positions mp on mp.user_id = m.user_id
)
insert into rankings (restaurant_id, user_id, rank_position, updated_at)
select restaurant_id, user_id, rank_position, now()
from numbered;
