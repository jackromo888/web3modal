import { proxy, subscribe as valtioSub } from 'valtio/vanilla'
import type { ConfigCtrlState } from '../types/controllerTypes'
import { ClientCtrl } from './ClientCtrl'
import { OptionsCtrl } from './OptionsCtrl'

const state = proxy<ConfigCtrlState>({
  projectId: '',
  mobileWallets: undefined,
  desktopWallets: undefined,
  walletImages: undefined,
  chainImages: undefined,
  tokenImages: undefined,
  standaloneChains: undefined,
  enableStandaloneMode: false,
  enableNetworkView: false,
  enableAccountView: true,
  defaultChain: undefined,
  explorerAllowList: undefined,
  explorerDenyList: undefined,
  termsOfServiceUrl: undefined,
  privacyPolicyUrl: undefined
})

// -- controller --------------------------------------------------- //
export const ConfigCtrl = {
  state,

  subscribe(callback: (newState: ConfigCtrlState) => void) {
    return valtioSub(state, () => callback(state))
  },

  setConfig(config: ConfigCtrlState) {
    OptionsCtrl.setStandaloneChains(config.standaloneChains)
    OptionsCtrl.setIsStandalone(
      Boolean(config.standaloneChains?.length) || Boolean(config.enableStandaloneMode)
    )
    OptionsCtrl.setIsCustomMobile(Boolean(config.mobileWallets?.length))
    OptionsCtrl.setIsCustomDesktop(Boolean(config.desktopWallets?.length))
    OptionsCtrl.setWalletConnectVersion(config.walletConnectVersion ?? 1)

    if (config.defaultChain) {
      OptionsCtrl.setSelectedChain(config.defaultChain)
    } else if (!OptionsCtrl.state.isStandalone) {
      const chain = ClientCtrl.client().getDefaultChain()
      OptionsCtrl.setSelectedChain(chain)
    }

    Object.assign(state, config)
  }
}