import dbConnect from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

/**
 * Fetch site content from MongoDB for a given page.
 * Returns a key-value map of content.
 * Used by Server Components to read admin-editable content.
 */
export async function getPageContent(
  page: string,
): Promise<Record<string, string>> {
  try {
    await dbConnect();
    const contents = await SiteContent.find({ page }).lean();
    const contentMap: Record<string, string> = {};
    for (const item of contents) {
      contentMap[item.key] = item.value;
    }
    return contentMap;
  } catch (error) {
    console.error(`Error fetching content for page "${page}":`, error);
    return {};
  }
}

/**
 * Fetch a single content value by key from MongoDB.
 * Returns the value string, or the fallback if not found.
 */
export async function getContentValue(
  key: string,
  fallback: string = '',
): Promise<string> {
  try {
    await dbConnect();
    const content = await SiteContent.findOne({ key }).lean();
    return content ? content.value : fallback;
  } catch (error) {
    console.error(`Error fetching content key "${key}":`, error);
    return fallback;
  }
}

/**
 * Fetch multiple content values by keys.
 * Returns a map of key -> value, using fallbacks for missing keys.
 */
export async function getContentValues(
  keys: string[],
  fallbacks: Record<string, string> = {},
): Promise<Record<string, string>> {
  try {
    await dbConnect();
    const contents = await SiteContent.find({ key: { $in: keys } }).lean();
    const result: Record<string, string> = { ...fallbacks };
    for (const item of contents) {
      result[item.key] = item.value;
    }
    return result;
  } catch (error) {
    console.error('Error fetching content values:', error);
    return fallbacks;
  }
}
