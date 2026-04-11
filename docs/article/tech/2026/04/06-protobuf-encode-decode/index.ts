export function toHex(bytes: number[] | number): string[] |string {
    function toHexString(bytes: number): string {
        return bytes.toString(16).padStart(2, '0')
    }
    if (Array.isArray(bytes)) {
        return bytes.map(b => toHexString(b))
    } else {
        return toHexString(bytes)
    }
  }

// #region encodeVarint
export function encodeVarint(num: number): number[] {
    const bytes: number[] = []
    // 循环处理，直到 num < 0x80
    while (num >= 0x80) {
        // & 0x7f 取低7位
        // | 0x80 设置最高位为1
      bytes.push((num & 0x7f) | 0x80) 
      // 右移7位，处理下一个7位
      num >>= 7
    }
    // 最后一组，不加最高位为1
    bytes.push(num) 
    return bytes
  }
  
// #endregion encodeVarint

// #region decodeVarint 
export function decodeVarint(bytes: number[]): number | null {
    let result = 0
    // 循环处理，直到 bytes.length === 0
    for (let i = bytes.length-1; i >= 0; i--) {
      // & 0x7f 取低7位
      // << 7 左移7位
      // (result << 7) | (bytes[i] & 0x7f) 将低7位拼接到结果中
      result = (result << 7) | (bytes[i] & 0x7f)
    }
    return result
  }
  
// #endregion decodeVarint

// #region encodeTag
export function encodeTag(fieldNumber: number, wireType: number): number {
    return (fieldNumber << 3) | wireType
}
// #endregion encodeTag

// #region decodeTag
export function decodeTag(tag: number): { fieldNumber: number; wireType: number } {
    return {
      fieldNumber: tag >> 3,
      wireType: tag & 0x07
    }
}
// #endregion decodeTag