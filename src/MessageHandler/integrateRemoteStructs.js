import { getStruct } from '../Util/structReferences.js'
import BinaryDecoder from '../Binary/Decoder.js'
import Delete from '../Struct/Delete.js'

class MissingEntry {
  constructor (decoder, missing, struct) {
    this.decoder = decoder
    this.missing = missing.length
    this.struct = struct
  }
}

/**
 * Integrate remote struct
 * When a remote struct is integrated, other structs might be ready to ready to
 * integrate.
 */
function _integrateRemoteStructHelper (y, struct) {
  struct._integrate(y)
  if (!(struct instanceof Delete)) {
    let msu = y._missingStructs.get(struct._id.user)
    if (msu != null) {
      let len = struct._length
      for (let i = 0; i < len; i++) {
        if (msu.has(struct._id.clock + i)) {
          let msuc = msu.get(struct._id.clock + i)
          msuc.forEach(missingDef => {
            missingDef.missing--
            if (missingDef.missing === 0) {
              let missing = missingDef.struct._fromBinary(y, missingDef.decoder)
              if (missing.length === 0) {
                y._readyToIntegrate.push(missingDef.struct)
              }
            }
          })
          msu.delete(struct._id.clock)
        }
      }
    }
  }
}

export function stringifyStructs (y, decoder, strBuilder) {
  while (decoder.length !== decoder.pos) {
    let reference = decoder.readVarUint()
    let Constr = getStruct(reference)
    let struct = new Constr()
    let missing = struct._fromBinary(y, decoder)
    let logMessage = struct._logString()
    if (missing.length > 0) {
      logMessage += missing.map(id => `ID (user: ${id.user}, clock: ${id.clock})`).join(', ')
    }
    logMessage += '\n'
    strBuilder.push(logMessage)
  }
}

export function integrateRemoteStructs (decoder, encoder, y) {
  while (decoder.length !== decoder.pos) {
    let decoderPos = decoder.pos
    let reference = decoder.readVarUint()
    let Constr = getStruct(reference)
    let struct = new Constr()
    let missing = struct._fromBinary(y, decoder)
    if (missing.length === 0) {
      while (struct != null) {
        _integrateRemoteStructHelper(y, struct)
        struct = y._readyToIntegrate.shift()
      }
    } else {
      let _decoder = new BinaryDecoder(decoder.uint8arr)
      _decoder.pos = decoderPos
      let missingEntry = new MissingEntry(_decoder, missing, struct)
      let missingStructs = y._missingStructs
      for (let i = missing.length - 1; i >= 0; i--) {
        let m = missing[i]
        if (!missingStructs.has(m.user)) {
          missingStructs.set(m.user, new Map())
        }
        let msu = missingStructs.get(m.user)
        if (!msu.has(m.clock)) {
          msu.set(m.clock, [])
        }
        let mArray = msu = msu.get(m.clock)
        mArray.push(missingEntry)
      }
    }
  }
}
