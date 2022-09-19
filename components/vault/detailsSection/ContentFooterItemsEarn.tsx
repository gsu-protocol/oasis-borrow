import BigNumber from 'bignumber.js'
import { ChangeVariantType } from 'components/DetailsSectionContentCard'
import { DetailsSectionFooterItem } from 'components/DetailsSectionFooterItem'
import { formatAmount, formatCryptoBalance, formatPercent } from 'helpers/formatters/format'
import { useTranslation } from 'next-i18next'
import React from 'react'

interface ContentFooterItemsMultiplyProps {
  token: string
  debt: BigNumber
  lockedCollateral: BigNumber
  multiply: BigNumber
  afterDebt: BigNumber
  afterLockedCollateral: BigNumber
  afterMultiply: BigNumber
  changeVariant?: ChangeVariantType
  stabilityFee: BigNumber
}

export function ContentFooterItemsEarn({
  token,
  debt,
  lockedCollateral,
  multiply,
  afterDebt,
  afterLockedCollateral,
  afterMultiply,
  changeVariant,
  stabilityFee,
}: ContentFooterItemsMultiplyProps) {
  const { t } = useTranslation()
  //@GSUpro update phrase DAI to GSUC
  const formatted = {
    debt: `${formatAmount(debt, 'DAI')} GSUC`,
    lockedCollateral: `${formatCryptoBalance(lockedCollateral)} ${token}`,
    multiply: multiply?.toFixed(2),
    afterDebt: `${formatAmount(afterDebt, 'DAI')} GSUC`,
    afterLockedCollateral: `${formatCryptoBalance(afterLockedCollateral)} ${token}`,
    afterMultiply: afterMultiply?.toFixed(2),
    stabilityFee: `${formatPercent(stabilityFee.times(100), { precision: 2 })}`,
  }
  //@GSUpro update phrase DAI to GSUC end
  return (
    <>
      <DetailsSectionFooterItem
        title={t('system.total-collateral')}
        value={formatted.lockedCollateral}
        {...(changeVariant && {
          change: {
            value: `${formatted.afterLockedCollateral} ${t('system.cards.common.after')}`,
            variant: changeVariant,
          },
        })}
      />
      <DetailsSectionFooterItem
        title={t('system.vault-dai-debt')}
        value={formatted.debt}
        {...(changeVariant && {
          change: {
            value: `${formatted.afterDebt} ${t('system.cards.common.after')}`,
            variant: changeVariant,
          },
        })}
      />
      <DetailsSectionFooterItem
        title={t('system.variable-annual-fee')}
        value={formatted.stabilityFee}
      />
    </>
  )
}
