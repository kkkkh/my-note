import { encodeVarint, decodeVarint, encodeTag, decodeTag, toHex } from './index'
import { describe, it ,expect} from 'vitest'
describe('protobuf varint 编解码', () => {
    it('encodeVarint', () => {
        expect(toHex(encodeVarint(150))).toEqual(['96', '01'])
    })
    it('decodeVarint', () => {
        expect(decodeVarint([0x96, 0x01])).toEqual(150)
    })
    it('encodeTag', () => {
        expect(encodeTag(1, 0)).toEqual(0x08)
    })
    it('decodeTag', () => {
        expect(decodeTag(0x08)).toEqual({ fieldNumber: 1, wireType: 0 })
    })
})
