import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: () => true,
  },
  hooks: {
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation === 'update' && req.context?.skipCloudStorage) {
          throw new Error('User afterChange hook throws error')
        }
        return doc
      },
    ],
  },
  fields: [],
  upload: true,
}
