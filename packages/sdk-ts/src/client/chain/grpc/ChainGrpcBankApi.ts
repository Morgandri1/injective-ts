import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../BaseGrpcConsumer'
import { ChainModule } from '../types'
import { ChainGrpcBankTransformer } from '../transformers'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Bank

  protected client: CosmosBankV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosBankV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosBankV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request),
        )

      return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
        contextModule: this.module,
      })
    }
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: string
    denom: string
  }) {
    const request = CosmosBankV1Beta1Query.QueryBalanceRequest.create()

    request.address = accountAddress
    request.denom = denom

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryBalanceResponse>(() =>
          this.client.Balance(request),
        )

      return ChainGrpcBankTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Balance',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Balance',
        contextModule: this.module,
      })
    }
  }

  async fetchBalances(address: string) {
    const request = CosmosBankV1Beta1Query.QueryAllBalancesRequest.create()

    request.address = address

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryAllBalancesResponse>(() =>
          this.client.AllBalances(request),
        )

      return ChainGrpcBankTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AllBalances',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AllBalances',
        contextModule: this.module,
      })
    }
  }

  async fetchTotalSupply(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryTotalSupplyRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryTotalSupplyResponse>(() =>
          this.client.TotalSupply(request),
        )

      return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TotalSupply',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TotalSupply',
        contextModule: this.module,
      })
    }
  }

  async fetchSupplyOf(denom: string) {
    const request = CosmosBankV1Beta1Query.QuerySupplyOfRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QuerySupplyOfResponse>(() =>
          this.client.SupplyOf(request),
        )

      return ChainGrpcBankTransformer.grpcCoinToCoin(response.amount!)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'fetchSupplyOf',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchSupplyOf',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomsMetadata(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryDenomsMetadataRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryDenomsMetadataResponse>(
          () => this.client.DenomsMetadata(request),
        )

      return ChainGrpcBankTransformer.denomsMetadataResponseToDenomsMetadata(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DenomsMetadata',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomsMetadata',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomMetadata(denom: string) {
    const request = CosmosBankV1Beta1Query.QueryDenomMetadataRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryDenomMetadataResponse>(
          () => this.client.DenomMetadata(request),
        )

      return ChainGrpcBankTransformer.metadataToMetadata(response.metadata!)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DenomMetadata',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomMetadata',
        contextModule: this.module,
      })
    }
  }
}
