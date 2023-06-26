import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

interface ISubjectKey {
  vcKey: string
  did: string
  renderKey: (hash: string | null, vcKey: any | null) => any
}

const SubjectKey: React.FC<ISubjectKey> = ({ vcKey, did, renderKey }) => {
  const { agent } = useVeramo()
  const { data } = useQuery(
    ['credentials', vcKey, did],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsByClaims({
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
        where: [
          { column: 'type', value: [vcKey] },
          { column: 'subject', value: [did] },
        ],
      }),
    {
      enabled: !!vcKey,
    },
  )

  return (
    <>
      {renderKey(
        (data && data[0] && data[0].hash) || null,
        (data &&
          data[0] &&
          data[0].verifiableCredential.credentialSubject[vcKey]) ||
          null,
      )}
    </>
  )
}

export default SubjectKey
