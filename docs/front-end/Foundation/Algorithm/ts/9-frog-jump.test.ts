import { frogJump1, frogJump2 } from './9-frog-jump'

describe('frogJump', () => {
    it('frogJump1', () => {
        expect(frogJump1(1)).toBe(1)
        expect(frogJump1(2)).toBe(2)
        expect(frogJump1(3)).toBe(3)
        expect(frogJump1(4)).toBe(5)
        expect(frogJump1(5)).toBe(8)
    })
})
