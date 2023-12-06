create or replace function match_question(embedding vector(1536), match_threshold float)
returns setof ask_cache
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select *
  from ask_cache

  where (ask_cache.ask_embedding <#> embedding) * -1 > match_threshold
  
  order by ask_cache.ask_embedding <#> embedding;
end;
$$;
