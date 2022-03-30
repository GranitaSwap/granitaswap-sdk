import { ChainId, WETH, Token, Fetcher } from '../src'

// TODO: replace the provider in these tests
describe.skip('data', () => {
  it('Token', async () => {
    const token = await Fetcher.fetchTokenData(ChainId.MAINNET, '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21') // m.USDC
    expect(token.decimals).toEqual(6)
  })

  it('Token:CACHE', async () => {
    const token = await Fetcher.fetchTokenData(ChainId.MAINNET, '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC') // m.USDT
    expect(token.decimals).toEqual(6)
  })

  it('Pair', async () => {
    const token = new Token(ChainId.TESTNET, '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000', 18) // DAI
    const pair = await Fetcher.fetchPairData(WETH[ChainId.TESTNET], token)
    expect(pair.liquidityToken.address).toEqual('0x8B22F85d0c844Cf793690F6D9DFE9F11Ddb35449')
  })
})
