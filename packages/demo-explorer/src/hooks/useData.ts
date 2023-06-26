import React from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

const useVeramoQuery = async (
  queryKey: string,
  method: any,
  queryArgs?: any,
) => {
  const { agent } = useVeramo()
  const response = useQuery([queryKey], () => method({ ...queryArgs }))
  console.log(response)
  return response
}

export default useVeramoQuery
