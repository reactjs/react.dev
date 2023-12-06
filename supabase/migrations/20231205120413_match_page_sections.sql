create or replace function match_page_sections(embedding vector(1536), match_threshold float, min_content_length int)
returns setof page_section
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select *
  from page_section

  where length(page_section.content) >= min_content_length

  and (page_section.embedding <#> embedding) * -1 > match_threshold

  order by page_section.embedding <#> embedding;
end;
$$;
