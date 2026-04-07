import { callMethodsSequentiallyGeneratorYieldRecursive } from './index'

describe('callMethodsSequentiallyGen1erator', () => {
  it('should to be true', async () => {
    const result = await callMethodsSequentiallyGeneratorYieldRecursive([() => true, () => true, () => true])
    expect(result).toBe(true)
  })
  it('should to be false', async () => {
    const result = await callMethodsSequentiallyGeneratorYieldRecursive([() => true, () => false, () => true])
    expect(result).toBe(false)
  })
  it('should to be false with async', async () => {
    const result = await callMethodsSequentiallyGeneratorYieldRecursive([
      () => true,
      () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(false)
          }, 1000)
        })
      },
      () => true,
    ])
    expect(result).toBe(false)
  })
})
