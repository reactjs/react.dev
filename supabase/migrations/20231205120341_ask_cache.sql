create extension if not exists vector with schema public;

create table "public"."ask_cache" (
  id bigserial primary key,
  ask_embedding vector(1536),
  ask_anwser jsonb
);