import type { FileData, PayloadRequest, TypeWithID } from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'

import './index.scss'

import { formatAdminURL } from 'payload/shared'

import type { HTMLConvertersAsync } from '../../../../features/converters/lexicalToHtml/async/types.js'
import type { SerializedRelationshipNode } from '../../../../nodeTypes.js'

const baseClass = 'lexical-relationship-diff'

export const RelationshipDiffHTMLConverterAsync: (args: {
  i18n: I18nClient
  req: PayloadRequest
}) => HTMLConvertersAsync<SerializedRelationshipNode> = ({ i18n, req }) => {
  return {
    relationship: async ({ node, populate, providedCSSString }) => {
      let data: (Record<string, any> & TypeWithID) | undefined = undefined

      const id = typeof node.value === 'object' ? node.value.id : node.value

      // If there's no valid upload data, populate return an empty string
      if (typeof node.value !== 'object') {
        if (!populate) {
          return ''
        }
        data = await populate<FileData & TypeWithID>({
          id,
          collectionSlug: node.relationTo,
        })
      } else {
        data = node.value as unknown as FileData & TypeWithID
      }

      const relatedCollection = req.payload.collections[node.relationTo]?.config

      const ReactDOMServer = (await import('react-dom/server')).default

      const JSX = (
        <div
          className={`${baseClass}${providedCSSString}`}
          data-enable-match="true"
          data-id={id}
          data-slug={node.relationTo}
        >
          <div className={`${baseClass}__card`}>
            <div className={`${baseClass}__collectionLabel`}>
              {i18n.t('fields:labelRelationship', {
                label: relatedCollection?.labels?.singular
                  ? getTranslation(relatedCollection?.labels?.singular, i18n)
                  : relatedCollection?.slug,
              })}
            </div>
            {data &&
            relatedCollection?.admin?.useAsTitle &&
            data[relatedCollection.admin.useAsTitle] ? (
              <strong className={`${baseClass}__title`} data-enable-match="false">
                <a
                  className={`${baseClass}__link`}
                  data-enable-match="false"
                  href={formatAdminURL({
                    adminRoute: req.payload.config.routes.admin,
                    path: `/collections/${relatedCollection?.slug}/${data.id}`,
                    serverURL: req.payload.config.serverURL,
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {data[relatedCollection.admin.useAsTitle]}
                </a>
              </strong>
            ) : (
              <strong>{id as string}</strong>
            )}
          </div>
        </div>
      )

      // Render to HTML
      const html = ReactDOMServer.renderToStaticMarkup(JSX)

      return html
    },
  }
}
