import { ManageVaultChange, ManageVaultState } from './manageVault'
import { allowanceDefaults } from './manageVaultAllowances'
import { depositAndGenerateDefaults, paybackAndWithdrawDefaults } from './manageVaultInput'

export const manageVaultFormDefaults: Partial<ManageVaultState> = {
  ...allowanceDefaults,
  ...depositAndGenerateDefaults,
  ...paybackAndWithdrawDefaults,
  showDepositAndGenerateOption: false,
  showPaybackAndWithdrawOption: false,
}

export type ManageVaultFormChange =
  | {
      kind: 'toggleDepositAndGenerateOption'
    }
  | {
      kind: 'togglePaybackAndWithdrawOption'
    }
  | {
      kind: 'toggleIlkDetails'
    }
  | {
      kind: 'resetDefaults'
    }

export function applyManageVaultForm(
  { kind }: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (kind === 'toggleDepositAndGenerateOption') {
    return {
      ...state,
      showDepositAndGenerateOption: !state.showDepositAndGenerateOption,
    }
  }

  if (kind === 'togglePaybackAndWithdrawOption') {
    return {
      ...state,
      showPaybackAndWithdrawOption: !state.showPaybackAndWithdrawOption,
    }
  }

  if (kind === 'toggleIlkDetails') {
    return {
      ...state,
      showIlkDetails: !state.showIlkDetails,
    }
  }

  return state
}
