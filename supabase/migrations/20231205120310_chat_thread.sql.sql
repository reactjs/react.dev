create table "public"."chat_thread" (
  id bigserial primary key,
  thread_id text not null,
  message jsonb,
  message_time int8
);