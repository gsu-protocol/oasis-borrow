import { amountFromWei } from '@oasisdex/utils'
import BigNumber from 'bignumber.js'
import { IBlocks } from 'interfaces/blockchain/IBlocks'
import { IContext } from 'interfaces/blockchain/IContext'
import { IOracle } from 'interfaces/protocols/IOracle'
import { bindNodeCallback, combineLatest, Observable, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'

import { maxUint256, tokenAllowance, tokenBalance } from './calls/erc20'
import { CallObservable } from './calls/observe'

export function createBalance$(
  blocks$: IBlocks,
  context: IContext,
  tokenBalance$: CallObservable<typeof tokenBalance>,
  token: string,
  address: string,
) {
  return context.context$.pipe(
    switchMap(({ web3 }) => {
      if (token === 'ETH') {
        return blocks$().pipe(
          switchMap(() => bindNodeCallback(web3.eth.getBalance)(address)),
          map((ethBalance: string) => amountFromWei(new BigNumber(ethBalance))),
          distinctUntilChanged((x: BigNumber, y: BigNumber) => x.eq(y)),
          shareReplay(1),
        )
      }
      return tokenBalance$({ token, account: address })
    }),
  )
}

export function createCollateralTokens$(
  ilks$: Observable<string[]>,
  ilkToToken$: (ilk: string) => Observable<string>,
): Observable<string[]> {
  return ilks$.pipe(
    switchMap((ilks) => combineLatest(ilks.map((ilk) => ilkToToken$(ilk)))),
    switchMap((tokens) => of([...new Set(tokens)])),
  )
}

export type TokenBalances = Record<string, { balance: BigNumber; price: BigNumber }>

export function createAccountBalance$(
  tokenBalance$: (token: string, address: string) => Observable<BigNumber>,
  collateralTokens$: Observable<string[]>,
  oracle: IOracle,
  address: string,
): Observable<TokenBalances> {
  return collateralTokens$.pipe(
    switchMap((collateralTokens) =>
      combineLatest(
        collateralTokens.map((collateralToken) =>
          combineLatest(
            of(collateralToken),
            tokenBalance$(collateralToken, address),
            oracle.getTokenPriceData$(collateralToken),
          ),
        ),
      ),
    ),
    map((data) =>
      data.reduce(
        (acc, [collateralToken, balance, { currentPrice: price }]) => ({
          ...acc,
          [collateralToken]: { balance, price },
        }),
        {},
      ),
    ),
  )
}

export function createAllowance$(
  context: IContext,
  tokenAllowance$: CallObservable<typeof tokenAllowance>,
  token: string,
  owner: string,
  spender: string,
) {
  return context.context$.pipe(
    switchMap(() => {
      if (token === 'ETH') return of(maxUint256)
      return tokenAllowance$({ token, owner, spender })
    }),
  )
}
