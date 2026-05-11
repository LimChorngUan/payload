import { s3Storage } from '@payloadcms/storage-s3'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { createTestBucket } from '../plugin-cloud-storage/utils.js'
import { MediaCollection, mediaSlug } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Reuse the same emulated S3 (localstack) credentials as the plugin-cloud-storage
// integration suite so the repro runs against `pnpm docker:start storage`.
dotenv.config({
  path: path.resolve(dirname, '../plugin-cloud-storage/.env.emulated'),
})

export default buildConfigWithDefaults({
  collections: [PostsCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [MenuGlobal],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })

    await createTestBucket()
  },
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET ?? '',
      collections: {
        [mediaSlug]: true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        region: process.env.S3_REGION,
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    useTempFiles: true,
  },
})
