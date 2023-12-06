create or replace function match_chat_thread(thread_id text)
returns setof chat_thread
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select *
  from chat_thread

  where chat_thread.thread_id = thread_id
  order by chat_thread.message_time asc;
end;
$$;