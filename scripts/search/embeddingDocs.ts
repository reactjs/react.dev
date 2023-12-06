

import { SupabaseClient, createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import { getEncoding, encodingForModel, Tiktoken } from "js-tiktoken";
import { Page, PageSource, Section, fetchSources } from './markdownLoader';



dotenv.config({ path: '.env.supabase' })
dotenv.config({ path: '.env.openai' })

async function embeddingDocs() {

    const {supabaseClient, openAIClient, tokenEncoder} = init();

    const pageSources = await fetchSources()

    for (const pageSource of pageSources) {
        const {source, path, load } = pageSource
        // console.log(`this ${path} source`);
        const { checksum, sections } = await load();
        console.log(`this ${path} source has ${sections.length} sections`);
        const newSections = handleSections(sections, tokenEncoder);

        const {id} = await upsertPage(supabaseClient, {checksum, sections}, pageSource);

        console.log("id is:", id);
        for (const section of newSections) {
            await upsertSection(supabaseClient, openAIClient, section, id);
        }
    }
}


async function upsertPage(supabaseClient: SupabaseClient, page: Page, pageSource: PageSource) {
    const { error: fetchPageError, data: existingPage } = await supabaseClient
    .from('page')
    .select('id, path')
    .filter('path', 'eq', pageSource.path)
    .limit(1)
    .maybeSingle()

    let pageData;

    if(existingPage) {
      pageData = existingPage;
      console.log("this page existingPage ");
    } else {
      const { error: upsertPageError, data: res } = await supabaseClient
      .from('page')
      .upsert(
        {
          checksum: page.checksum,
          path: pageSource.path,
          source: pageSource.source,
        }
      ).select()
      .limit(1)
      .single()
      pageData = res;
      if(upsertPageError) {
        console.log("this upsertPageError error is: ", upsertPageError)
      }
    }

    return pageData;
}


async function upsertSection(supabaseClient: SupabaseClient, openAIClient: OpenAI,  section: Section, pageId: any) {
    const { error: fetchPageSelectError, data: existingPagSelect } = await supabaseClient
      .from('page_section')
      .select('id, page_id, heading, content')
      .filter('content', 'eq', section.content)
      .limit(1)
      .maybeSingle()

      if(existingPagSelect) {
        return;
      }

      const input = section.content.replace(/\n/g, ' ')
      const embeddingResponse = await openAIClient.embeddings.create({
        model: 'text-embedding-ada-002',
        input,
      })

      const [responseData] = embeddingResponse.data;

      const { error: insertPageSectionError, data: pageSection } = await supabaseClient
      .from('page_section')
      .insert({
        page_id: pageId,
        heading: section.heading,
        content: section.content,
        token_count: embeddingResponse.usage.total_tokens,
        embedding: responseData.embedding,
      });
      if(insertPageSectionError) {
        console.log("this insertPageSectionError error is: ", insertPageSectionError)
      }
}

function handleSections(sections: Section[], tokenEncoder: Tiktoken) : Section[] {
    const handleSections : Section[] = [];
    for (const section of sections) {
        const {heading, content} = section;
        const sectionToken = tokenEncoder.encode(content);
        const sectionTokenCount = sectionToken.length;
        if(sectionTokenCount > 1500) {
          console.log("this heading over size, heading", heading, "sectionSize is:", sectionTokenCount);
          
          let splitCount = 2;
          while(Math.floor(sectionTokenCount / splitCount) > 1200) {
             splitCount ++;
          }
          const overlap = 200;
          const chunkSize = Math.floor(sectionTokenCount / splitCount);

          for(let i = 0; i < splitCount ; i++) {
            console.log("this start is:", Math.max(i * chunkSize - overlap, 0), "this end is:", (i + 1) * chunkSize);

             const chunk = tokenEncoder.decode(sectionToken.slice( Math.max(i * chunkSize - overlap, 0), (i + 1) * chunkSize));
             handleSections.push({heading: heading, content: chunk});
          }
        } else {
          handleSections.push(section);
        }
    }
    return handleSections;
}


function init() {
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    
    const openAIClient = new OpenAI({apiKey: process.env.OPENAI_KEY});
    const enc = encodingForModel("text-embedding-ada-002");

    return {supabaseClient, openAIClient, tokenEncoder: enc};
}


embeddingDocs().catch((e: Error) => {
    console.error(e);
})