import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const USDC = new Token(ChainId.MAINNET, '0xea32a96608495e54156ae48931a7c20f0dcc1a21', 18, 'USDC', 'USD Coin')
  const USDT = new Token(ChainId.MAINNET, '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc', 18, 'USDT', 'USDT Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(USDC, '100'), new TokenAmount(WETH[ChainId.TESTNET], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(USDC, USDT)).toEqual('0x6c4768d4b3acd4a3ff01f179faffdaebe084d12d')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).token0).toEqual(USDT)
      expect(new Pair(new TokenAmount(USDT, '100'), new TokenAmount(USDC, '100')).token0).toEqual(USDT)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).token1).toEqual(USDC)
      expect(new Pair(new TokenAmount(USDT, '100'), new TokenAmount(USDC, '100')).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '101')).reserve0).toEqual(
        new TokenAmount(USDT, '101')
      )
      expect(new Pair(new TokenAmount(USDT, '101'), new TokenAmount(USDC, '100')).reserve0).toEqual(
        new TokenAmount(USDT, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '101')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(USDT, '101'), new TokenAmount(USDC, '100')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(USDT, '100')).token0Price).toEqual(
        new Price(USDT, USDC, '100', '101')
      )
      expect(new Pair(new TokenAmount(USDT, '100'), new TokenAmount(USDC, '101')).token0Price).toEqual(
        new Price(USDT, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(USDT, '100')).token1Price).toEqual(
        new Price(USDC, USDT, '101', '100')
      )
      expect(new Pair(new TokenAmount(USDT, '100'), new TokenAmount(USDC, '101')).token1Price).toEqual(
        new Price(USDC, USDT, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USDC, '101'), new TokenAmount(USDT, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(USDT)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '101')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(USDT, '101'), new TokenAmount(USDC, '100')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(USDT, '101'), new TokenAmount(USDC, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(USDT, '100'), new TokenAmount(USDC, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).involvesToken(USDC)).toEqual(true)
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).involvesToken(USDT)).toEqual(true)
    expect(
      new Pair(new TokenAmount(USDC, '100'), new TokenAmount(USDT, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
