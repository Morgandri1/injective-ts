import { ContractStateWithPagination } from '@injectivelabs/sdk-ts'
import {
  TokenType,
  TokenVerification,
  type Token,
} from '@injectivelabs/token-metadata'

export const getTokenFromContractStateResponse = (
  denom: string,
  response: ContractStateWithPagination,
): Token => {
  const { tokenInfo, contractInfo } = response
  const contractAddress = denom.startsWith('factory')
    ? denom.split('/')[2]
    : denom

  return {
    denom,
    name: tokenInfo.name || contractInfo.label || 'Unknown',
    symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
    decimals: tokenInfo.decimals || 18,
    logo: 'unknown.svg',
    coinGeckoId: '',
    tokenType: TokenType.Cw20,
    tokenVerification: TokenVerification.Internal,

    cw20: {
      decimals: tokenInfo.decimals || 18,
      address: contractAddress,
      symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
      tokenType: TokenType.Cw20,
    },
  } as Token
}
