create type cuisine_category as enum ('ramen', 'tonkatsu', 'other');
alter table restaurants
  add column cuisine_category cuisine_category not null default 'other';
