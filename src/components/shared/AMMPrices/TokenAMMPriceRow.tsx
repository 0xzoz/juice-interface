import { LoadingOutlined, LinkOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'
import { formattedNum } from 'utils/formatNumber'
import UniswapLogo from 'components/icons/Uniswap'
import { t, Trans } from '@lingui/macro'
import { Price, Token } from '@uniswap/sdk-core'
import SushiswapLogo from 'components/icons/Sushiswap'

type ExchangeName = 'Uniswap' | 'Sushiswap'

const LOGOS = {
  Uniswap: UniswapLogo,
  Sushiswap: SushiswapLogo,
}

type Props = {
  exchangeName: ExchangeName
  tokenSymbol: string
  exchangeLink?: string
  WETHPrice?: Price<Token, Token>
  loading?: boolean
  available?: boolean
  style?: CSSProperties
}

export default function TokenAMMPriceRow({
  exchangeName,
  tokenSymbol,
  exchangeLink,
  WETHPrice,
  loading,
  available = true,
  style,
}: Props) {
  const LogoComponent = LOGOS[exchangeName]

  const hasAMMPrice = Boolean(WETHPrice)

  const linkTooltip = loading
    ? t`Loading ${exchangeName} price for ${tokenSymbol}...`
    : !available
    ? t`${exchangeName} is not available on Juicebox.`
    : hasAMMPrice
    ? t`${tokenSymbol}/ETH exchange rate on ${exchangeName}.`
    : t`${exchangeName} has no liquidity pool for ${tokenSymbol}.`

  return (
    <div
      style={{
        fontSize: '0.7rem',
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: available ? '100%' : '60%',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.5rem', width: '1rem' }}>
          <LogoComponent size={15} />
        </span>
        {exchangeName}
      </div>

      {loading && <LoadingOutlined />}

      {!loading &&
        (available ? (
          WETHPrice && (
            <a
              href={exchangeLink}
              rel="noopener noreferrer"
              target="_blank"
              style={{ fontWeight: 400 }}
              title={linkTooltip}
            >
              {`${formattedNum(WETHPrice.toFixed(0))} ${tokenSymbol}/ETH`}
              <LinkOutlined style={{ marginLeft: '0.2rem' }} />
            </a>
          )
        ) : (
          <span title={linkTooltip}>
            <Trans>Not available.</Trans>
          </span>
        ))}
    </div>
  )
}
