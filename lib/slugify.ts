import slugify from 'slugify';

export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export async function createUniqueSlug(text: string, checkExists: (slug: string) => Promise<boolean>): Promise<string> {
  let slug = createSlug(text);
  
  // Check if slug exists
  const exists = await checkExists(slug);
  
  // If slug exists, append a unique string
  if (exists) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }
  
  return slug;
}