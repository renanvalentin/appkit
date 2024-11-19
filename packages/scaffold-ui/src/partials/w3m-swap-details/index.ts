import { html, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import styles from './styles.js'
import { UiHelperUtil, customElement } from '@reown/appkit-ui'
import { ChainController, SwapController } from '@reown/appkit-core'

@customElement('w3m-swap-details')
export class WuiSwapDetails extends LitElement {
  public static override styles = [styles]

  private unsubscribe: ((() => void) | undefined)[] = []

  // -- State & Properties -------------------------------- //
  @state() public networkName = ChainController.state.activeCaipNetwork?.name

  @property() public detailsOpen = false

  @state() public sourceToken = SwapController.state.sourceToken

  @state() public toToken = SwapController.state.toToken

  @state() public toTokenAmount = SwapController.state.toTokenAmount

  @state() public sourceTokenPriceInUSD = SwapController.state.sourceTokenPriceInUSD

  @state() public toTokenPriceInUSD = SwapController.state.toTokenPriceInUSD

  @state() public gasPriceInUSD = SwapController.state.gasPriceInUSD

  @state() public priceImpact = SwapController.state.priceImpact

  @state() public maxSlippage = SwapController.state.maxSlippage

  @state() public networkTokenSymbol = SwapController.state.networkTokenSymbol

  @state() public inputError = SwapController.state.inputError

  // -- Lifecycle ----------------------------------------- //
  public constructor() {
    super()

    this.unsubscribe.push(
      ...[
        SwapController.subscribe(newState => {
          this.sourceToken = newState.sourceToken
          this.toToken = newState.toToken
          this.toTokenAmount = newState.toTokenAmount
          this.gasPriceInUSD = newState.gasPriceInUSD
          this.priceImpact = newState.priceImpact
          this.maxSlippage = newState.maxSlippage
          this.sourceTokenPriceInUSD = newState.sourceTokenPriceInUSD
          this.toTokenPriceInUSD = newState.toTokenPriceInUSD
          this.inputError = newState.inputError
        })
      ]
    )
  }

  // -- Render -------------------------------------------- //
  public override render() {
    if (!this.sourceToken || !this.toToken || this.inputError) {
      return null
    }

    const toTokenSwappedAmount =
      this.sourceTokenPriceInUSD && this.toTokenPriceInUSD
        ? (1 / this.toTokenPriceInUSD) * this.sourceTokenPriceInUSD
        : 0

    return html`
      <wui-flex flexDirection="column" alignItems="center" gap="1xs" class="details-container">
        <wui-flex flexDirection="column">
          <button @click=${this.toggleDetails.bind(this)}>
            <wui-flex justifyContent="space-between" .padding=${['0', 'xs', '0', 'xs']}>
              <wui-flex justifyContent="flex-start" flexGrow="1" gap="xs">
                <wui-text variant="small-400" color="fg-100">
                  1 ${this.sourceToken.symbol} =
                  ${UiHelperUtil.formatNumberToLocalString(toTokenSwappedAmount, 3)}
                  ${this.toToken.symbol}
                </wui-text>
                <wui-text variant="small-400" color="fg-200">
                  $${UiHelperUtil.formatNumberToLocalString(this.sourceTokenPriceInUSD)}
                </wui-text>
              </wui-flex>
              <wui-icon name="chevronBottom"></wui-icon>
            </wui-flex>
          </button>
        </wui-flex>
      </wui-flex>
    `
  }

  // -- Private ------------------------------------------- //
  private toggleDetails() {
    this.detailsOpen = !this.detailsOpen
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wui-w3m-details': WuiSwapDetails
  }
}
