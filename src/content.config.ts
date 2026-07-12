import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('M Hassan Shakeel'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    readTime: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
