import { TrezorException } from '@injectivelabs/exceptions'
import sigUtil from '@metamask/eth-sig-util'

// Sanitization is used for T1 as eth-sig-util does not support BigInt
// @ts-ignore
function sanitizeData(data) {
  switch (Object.prototype.toString.call(data)) {
    case '[object Object]': {
      // @ts-ignore
      const entries = Object.keys(data).map((k) => [k, sanitizeData(data[k])])
      return Object.fromEntries(entries)
    }

    case '[object Array]':
      return data.map((v: any) => sanitizeData(v))

    case '[object BigInt]':
      return data.toString()

    default:
      return data
  }
}

/**
 * Calculates the domain_separator_hash and message_hash from an EIP-712 Typed Data object.
 *
 * The Trezor Model 1 does not currently support constructing the hash on the device,
 * so this function pre-computes them.
 *
 * @template {sigUtil.TypedMessage} T
 * @param {T} data - The EIP-712 Typed Data object.
 * @param {boolean} metamask_v4_compat - Set to `true` for compatibility with Metamask's signTypedData_v4 function.
 * @returns {{domain_separator_hash: string, message_hash?: string} & T} The hashes.
 */
export const transformTypedData = <
  T extends sigUtil.TypedMessage<sigUtil.MessageTypes>,
>(
  data: T,
  metamask_v4_compat: boolean = true,
): { domain_separator_hash: string; message_hash?: string } & T => {
  if (!metamask_v4_compat) {
    throw new TrezorException(
      new Error('Trezor: Only version 4 of typed data signing is supported'),
    )
  }

  const version = sigUtil.SignTypedDataVersion.V4

  const { types, primaryType, domain, message } =
    sigUtil.TypedDataUtils.sanitizeData(data)

  const domainSeparatorHash = sigUtil.TypedDataUtils.hashStruct(
    'EIP712Domain',
    sanitizeData(domain),
    types,
    version,
  ).toString('hex')

  let messageHash = null

  if (primaryType !== 'EIP712Domain') {
    messageHash = sigUtil.TypedDataUtils.hashStruct(
      primaryType as string,
      sanitizeData(message),
      types,
      version,
    ).toString('hex')
  }

  return {
    domain_separator_hash: domainSeparatorHash,
    message_hash: messageHash as string,
    ...data,
  }
}
