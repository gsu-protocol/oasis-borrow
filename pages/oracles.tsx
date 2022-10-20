import { WithConnection } from 'components/connectWallet/ConnectWallet'
import { LandingPageLayout } from 'components/Layouts'
import { CollateralPricesView } from 'features/collateralPrices/CollateralPricesView'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

function OraclesPage() {
  return (
    <WithConnection>
      <CollateralPricesView />
    </WithConnection>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
//@GSUpro updates layout
OraclesPage.layout = LandingPageLayout
OraclesPage.theme = 'Landing'
//@GSUpro updates layout end
export default OraclesPage
