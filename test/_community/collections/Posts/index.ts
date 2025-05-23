import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            inlineBlocks: [
              {
                slug: 'inline-media',
                fields: [
                  {
                    name: 'media',
                    type: 'relationship',
                    relationTo: ['media'],
                    admin: {
                      appearance: 'drawer',
                    },
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: ['media'],
      admin: {
        appearance: 'drawer',
      },
    },
  ],
}
