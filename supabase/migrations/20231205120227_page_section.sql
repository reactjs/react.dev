create extension if not exists vector with schema public;

create table "public"."page_section" (
  id bigserial primary key,
  page_id bigint not null references public.page on delete cascade,
  content text,
  token_count int,
  heading text,
  embedding vector(1536)
);