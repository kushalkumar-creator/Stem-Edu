require('dotenv').config();
const { supabaseAdmin } = require('../../utils/supabaseAdmin');
const { virtualTopicsData } = require('../../data/virtualTopicsData');

async function seedAllVirtualTopics() {
  console.log(`Starting sync of ${virtualTopicsData.length} virtual learning topics into Supabase...`);

  for (const topic of virtualTopicsData) {
    const payload = {
      slug: topic.slug,
      subject: topic.subject,
      class_level: topic.class_level,
      board: topic.board,
      title: topic.title,
      title_hindi: topic.title_hindi || null,
      description: topic.description,
      description_hindi: topic.description_hindi || null,
      type: topic.type,
      thumbnail: topic.thumbnail,
      status: 'published',
      config: {
        ...(topic.config || {}),
        notes: topic.notes || '',
        quiz: topic.quiz || []
      }
    };

    const { data, error } = await supabaseAdmin
      .from('virtual_topics')
      .upsert(payload, { onConflict: 'slug' })
      .select('id, slug, title')
      .single();

    if (error) {
      console.warn(`Error upserting ${topic.slug}:`, error.message);
    } else {
      console.log(`✓ Upserted topic [${topic.subject}]: ${data.slug} (${data.title})`);
    }
  }

  const { count } = await supabaseAdmin
    .from('virtual_topics')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎉 Total published Virtual Learning topics in Supabase: ${count}`);
}

seedAllVirtualTopics()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
