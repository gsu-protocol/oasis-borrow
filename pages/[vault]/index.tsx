import BigNumber from 'bignumber.js'
import { WithConnection } from 'components/connectWallet/ConnectWallet'
import { AppLayout } from 'components/Layouts'
import { ManageVaultView } from 'features/manageVault/ManageVaultView'
import { VaultHistoryView } from 'features/vaultHistory/VaultHistoryView'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import { Grid } from 'theme-ui'

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['common'])),
      id: ctx.query.vault || null,
    },
  }
}

export default function Vault({ id }: { id: string }) {
  return (
    <WithConnection>
      <Grid>
        <ManageVaultView id={new BigNumber(id)} />
        <VaultHistoryView id={new BigNumber(id)} />
      </Grid>
    </WithConnection>
  )
}

Vault.layout = AppLayout
