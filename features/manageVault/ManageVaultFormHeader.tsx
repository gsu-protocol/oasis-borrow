import { trackingEvents } from 'analytics/analytics'
import { WithVaultFormStepIndicator } from 'components/vault/VaultForm'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Button, Flex, Grid, Text } from 'theme-ui'

import { ManageVaultEditingStage, ManageVaultState } from './manageVault'

function ManageVaultEditingController({
  stage,
  toggle,
  accountIsController,
  isEditingStage,
  isMultiplyTransitionStage,
  totalSteps,
  currentStep,
  vault: { token },
  setMainAction,
  mainAction,
}: ManageVaultState) {
  const { t } = useTranslation()
  const isDaiEditing = stage === 'daiEditing'
  const isCollateralEditing = stage === 'collateralEditing'

  const collateralVariant = isCollateralEditing
    ? 'vaultEditingController'
    : 'vaultEditingControllerInactive'

  const daiVariant = isDaiEditing ? 'vaultEditingController' : 'vaultEditingControllerInactive'

  const multiplyVariant = isMultiplyTransitionStage
    ? 'vaultEditingController'
    : 'vaultEditingControllerInactive'

  const beanTokenName = isDaiEditing ? 'DAI' : token

  function handleToggle(stage: ManageVaultEditingStage) {
    toggle!(stage)

    if (stage === 'collateralEditing') {
      trackingEvents.switchToDai(accountIsController)
    } else if (stage === 'daiEditing') {
      trackingEvents.switchToCollateral(accountIsController)
    }
  }

  return (
    <Grid gap={4}>
      <Grid columns={3} variant="vaultEditingControllerContainer">
        <Button onClick={() => handleToggle('collateralEditing')} variant={collateralVariant}>
          {t('system.collateral')}
        </Button>
        <Button onClick={() => handleToggle('daiEditing')} variant={daiVariant}>
          {t('system.dai')}
        </Button>
        <Button onClick={() => handleToggle('multiplyTransitionEditing')} variant={multiplyVariant}>
          Multiply
        </Button>
      </Grid>
      {isEditingStage && (
        <WithVaultFormStepIndicator {...{ totalSteps, currentStep }}>
          <Flex>
            <Button
              onClick={() => setMainAction!('depositGenerate')}
              variant={mainAction === 'depositGenerate' ? 'beanActive' : 'bean'}
            >
              {t(isDaiEditing ? 'vault-actions.generate' : 'vault-actions.deposit')} {beanTokenName}
            </Button>
            <Button
              onClick={() => setMainAction!('withdrawPayback')}
              variant={mainAction === 'withdrawPayback' ? 'beanActive' : 'bean'}
              sx={{ ml: 3 }}
            >
              {t(isDaiEditing ? 'vault-actions.payback' : 'vault-actions.withdraw')} {beanTokenName}
            </Button>
          </Flex>
        </WithVaultFormStepIndicator>
      )}
    </Grid>
  )
}

export function ManageVaultFormHeader(props: ManageVaultState) {
  const { t } = useTranslation()
  const {
    isMultiplyTransitionStage,
    isEditingStage,
    isProxyStage,
    isCollateralAllowanceStage,
    isDaiAllowanceStage,
    isManageStage,
    stage,
    currentStep,
    totalSteps,
  } = props

  return (
    <Box>
      {(isEditingStage || isMultiplyTransitionStage) && <ManageVaultEditingController {...props} />}
      {!isEditingStage && (
        <Box mt={isMultiplyTransitionStage ? 4 : 0}>
          <WithVaultFormStepIndicator {...{ totalSteps, currentStep }}>
            <Text variant="paragraph2" sx={{ fontWeight: 'semiBold', mb: 1 }}>
              {isProxyStage
                ? t('vault-form.header.proxy')
                : isCollateralAllowanceStage
                ? t('vault-form.header.allowance', { token: props.vault.token.toUpperCase() })
                : isDaiAllowanceStage
                ? t('vault-form.header.daiAllowance')
                : isManageStage
                ? stage === 'manageInProgress'
                  ? t('vault-form.header.confirm-in-progress')
                  : t('vault-form.header.confirm-manage')
                : stage === 'multiplyTransitionEditing'
                ? 'Get up to [x] ETH exposure from your Vault'
                : 'Great, now you will go the new Mutiply interface'}
            </Text>
          </WithVaultFormStepIndicator>
          <Text variant="paragraph3" sx={{ color: 'text.subtitle', lineHeight: '22px' }}>
            {isProxyStage
              ? t('vault-form.subtext.proxy')
              : isCollateralAllowanceStage
              ? t('vault-form.subtext.allowance', { token: props.vault.token.toUpperCase() })
              : isDaiAllowanceStage
              ? t('vault-form.subtext.daiAllowance')
              : stage === 'manageInProgress'
              ? t('vault-form.subtext.confirm-in-progress')
              : t('vault-form.subtext.confirm')}
          </Text>
        </Box>
      )}
    </Box>
  )
}
