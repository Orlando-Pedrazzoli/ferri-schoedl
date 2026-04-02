import { getPageContent } from '@/lib/content-helpers';
import { aboutData, siteConfig, timeline } from '@/lib/data';
import { SobreClient } from './SobreClient';

export default async function SobrePage() {
  // Fetch editable content from MongoDB (admin panel)
  const content = await getPageContent('sobre');

  // Merge MongoDB values with data.ts fallbacks
  const bio = content['sobre.bio.text'] || aboutData.bio;
  const shortBio = content['sobre.bio.shortBio'] || aboutData.shortBio;
  const title = content['sobre.bio.title'] || aboutData.title;
  const coaching = content['sobre.coaching.text'] || aboutData.coaching;

  return (
    <SobreClient
      bio={bio}
      shortBio={shortBio}
      title={title}
      coaching={coaching}
      differentials={aboutData.differentials}
      timeline={timeline}
      siteConfig={siteConfig}
    />
  );
}
