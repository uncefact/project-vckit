import { W3CVerifiableCredential } from '@veramo/core'
import { ICredentialsForSdr } from '@veramo/selective-disclosure'
import { useState, useEffect, useCallback } from 'react'

interface UniqueVerifiableCredential {
  hash: string,
  verifiableCredential: W3CVerifiableCredential
}


interface ValidationState {
  [index: string]: {
    required: boolean
    vc: UniqueVerifiableCredential | null
  }
}

const useSelectedCredentials = (sdr?: ICredentialsForSdr[]) => {
  const [selected, setSelected] = useState<ValidationState>({})
  const [valid, setValid] = useState<boolean>(true)

  const onSelect = (vc: UniqueVerifiableCredential | null, claimType: string) => {
    const newState = {
      ...selected,
      [claimType]: { ...selected[claimType], vc },
    }

    setSelected(newState)
  }

  const checkValidity = useCallback(() => {
    let valid = true
    Object.keys(selected).map((key) => {
      if (selected[key].required && !selected[key].vc) {
        valid = false
      }
      return key
    })
    setValid(valid)
  }, [selected])

  useEffect(() => {
    checkValidity()
  }, [selected, checkValidity])

  useEffect(() => {
    if (sdr) {
      let defaultSelected: ValidationState = {}
      sdr.map((sdr) => {
        if (sdr && sdr.essential) {
          if (sdr.credentials.length) {
            defaultSelected[sdr.claimType] = {
              required: true,
              vc: sdr.credentials[0],
            }
          } else {
            defaultSelected[sdr.claimType] = {
              required: true,
              vc: null,
            }
            setValid(false)
          }
        }
        return sdr
      })
      setSelected(defaultSelected)
    }
  }, [sdr])

  return { selected, valid, onSelect }
}

export default useSelectedCredentials
