create table "public"."page" (
  id bigserial primary key,
  path text not null unique,
  checksum text,
  source text
);