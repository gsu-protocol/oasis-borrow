import { BigNumber } from 'bignumber.js'
import { Context } from 'blockchain/network'
import { Vault } from 'blockchain/vaults'
import { UserTokenInfo } from 'features/shared/userTokenInfo'
import { VaultHistoryEvent } from 'features/vaultHistory/vaultHistory'
import moment from 'moment'
import { combineLatest, Observable, of } from 'rxjs'
import { map, switchMap, tap } from 'rxjs/operators'

interface VaultBannersState {
  controller: string
  account?: string
  token: string
  id: BigNumber
  hasBeenLiquidated: boolean
  liquidationPrice: BigNumber
  nextCollateralPrice?: BigNumber
  unlockedCollateral: BigNumber
  dateNextCollateralPrice?: Date | undefined
}

export function createVaultsBanners$(
  context$: Observable<Context>,
  userTokenInfo$: (token: string, account: string) => Observable<UserTokenInfo>,
  vault$: (id: BigNumber) => Observable<Vault>,
  vaultHistory$: (id: BigNumber) => Observable<VaultHistoryEvent[]>,
  id: BigNumber,
): Observable<VaultBannersState> {
  return context$.pipe(
    switchMap((context) => {
      return combineLatest(vault$(id), vaultHistory$(id)).pipe(
        switchMap(([{ token, liquidationPrice, controller, unlockedCollateral }, events]) => {
          // All started auctions in the past week orders in a desc order by timestamp ( recent ones first )
          const auctionsStarted = events
            .filter((event) => event.kind === 'AUCTION_STARTED')
            .map((event) => parseInt(event.timestamp) >= moment().subtract(3, 'weeks').unix())
            .sort((prev, next) => {
              if (prev > next) return -1
              if (prev < next) return 1
              return 0
            })

          const state = {
            token,
            id,
            liquidationPrice,
            controller,
            unlockedCollateral,
            hasBeenLiquidated: auctionsStarted.length > 1,
          }

          if (context.status !== 'connected') {
            return of(state)
          }

          return userTokenInfo$(token, context.account).pipe(
            map(({ nextCollateralPrice, dateNextCollateralPrice }) => {
              return {
                ...state,
                account: context.account,
                nextCollateralPrice,
                dateNextCollateralPrice,
              }
            }),
          )
        }),
      )
    }),
  )
}
