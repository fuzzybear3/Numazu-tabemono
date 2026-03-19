-- visits: add user_id
alter table visits add column user_id uuid references auth.users(id);

-- rankings: drop global-unique constraints, add user_id
alter table rankings drop constraint rankings_restaurant_id_key;
alter table rankings drop constraint rankings_rank_position_unique;
alter table rankings add column user_id uuid references auth.users(id);
delete from rankings where user_id is null;  -- clear orphaned rows
alter table rankings alter column user_id set not null;
alter table rankings add constraint rankings_user_restaurant_unique
  unique (user_id, restaurant_id);
alter table rankings add constraint rankings_user_position_unique
  unique (user_id, rank_position) deferrable initially deferred;

-- Global leaderboard view (avg position across all users)
create view global_rankings as
  select restaurant_id,
         round(avg(rank_position), 2) as avg_position,
         count(*) as voter_count
  from rankings
  group by restaurant_id
  order by avg_position asc;

-- RLS: rankings — users manage only their own rows
drop policy "Admins can insert rankings" on rankings;
drop policy "Admins can update rankings" on rankings;
drop policy "Admins can delete rankings" on rankings;
create policy "Users manage own rankings" on rankings for insert  with check (auth.uid() = user_id);
create policy "Users update own rankings" on rankings for update  using  (auth.uid() = user_id);
create policy "Users delete own rankings" on rankings for delete  using  (auth.uid() = user_id);

-- RLS: visits — users manage only their own rows
drop policy "Admins can insert visits" on visits;
drop policy "Admins can update visits" on visits;
drop policy "Admins can delete visits" on visits;
create policy "Users manage own visits" on visits for insert  with check (auth.uid() = user_id);
create policy "Users update own visits" on visits for update  using  (auth.uid() = user_id);
create policy "Users delete own visits" on visits for delete  using  (auth.uid() = user_id);
