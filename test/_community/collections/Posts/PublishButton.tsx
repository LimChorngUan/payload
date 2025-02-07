'use client'

import { Button, useDocumentInfo, useForm } from '@payloadcms/ui'

export const PublishButton = () => {
  const { unpublishedVersionCount, versionCount } = useDocumentInfo()
  const { submit } = useForm()

  console.log('!! unpublishedVersionCount', unpublishedVersionCount)
  console.log('!! versionCount', versionCount)

  return <Button onClick={submit}>Publish</Button>
}
