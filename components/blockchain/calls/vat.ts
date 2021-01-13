import BigNumber from 'bignumber.js'
import { Vat } from 'types/web3-v1-contracts/vat'
import Web3 from 'web3'

import { CallDef } from './callsHelpers'

interface VatUrnsArgs {
  ilk: string
  urnAddress: string
}

export interface Urn {
  collateral: BigNumber
  normalizedDebt: BigNumber
}

export const vatUrns: CallDef<VatUrnsArgs, Urn> = {
  call: (_, { contract, vat }) => {
    return contract<Vat>(vat).methods.urns
  },
  prepareArgs: ({ ilk, urnAddress }) => [Web3.utils.utf8ToHex(ilk), urnAddress],
  postprocess: (urn: any) => ({
    collateral: new BigNumber(urn.ink),
    normalizedDebt: new BigNumber(urn.art),
  })
}

export interface Ilk {
  globalDebt: BigNumber               // Art [wad]
  debtScalingFactor: BigNumber        // rate [ray]
  maxDebtPerUnitCollateral: BigNumber // spot [ray]
  debtCeiling: BigNumber              // line [rad]
  debtFloor: BigNumber                // debtFloor [rad]
}

export const vatIlks: CallDef<string, Ilk> = {
  call: (_, { contract, vat }) => {
    return contract<Vat>(vat).methods.ilks
  },
  prepareArgs: (ilk) => [Web3.utils.utf8ToHex(ilk)],
  postprocess: (ilk: any) => ({
    globalDebt: new BigNumber(ilk.Art),
    debtScalingFactor: new BigNumber(ilk.rate),
    maxDebtPerUnitCollateral: new BigNumber(ilk.spot),
    debtCeiling: new BigNumber(ilk.line),
    debtFloor: new BigNumber(ilk.dust),
  })
}

interface VatGemArgs {
  ilk: string
  urnAddress: string
}

export const vatGem: CallDef<VatGemArgs, BigNumber> = {
  call: (_, { contract, vat }) => {
    return contract<Vat>(vat).methods.gem
  },
  prepareArgs: ({ ilk, urnAddress }) => [Web3.utils.utf8ToHex(ilk), urnAddress],
  postprocess: (gem) => new BigNumber(gem),
}

export const vatLine: CallDef<{}, BigNumber> = {
  call: (_, { contract, vat }) => {
    return contract<Vat>(vat).methods.Line
  },
  prepareArgs: () => [],
}
