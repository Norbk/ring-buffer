
class RingBufferError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "RingBufferError"
  }  
};

class RingBufferReadError extends RingBufferError {
  
  public index: number;

  constructor(index: number) {
    super("Buffer is empty!");
    this.name = "RingBufferReadError";
    this.index = index;
  }
}

class RingBufferWriteError extends RingBufferError {

  public index: number;

  constructor(index: number) {
    super("Buffer is full!");
    this.name = "RingBufferWriteError";
    this.index = index;
  }
}

export class RingBuffer {

  static create<T>(size: number = 2) {
    if(size < 2)
      throw new RingBufferError("Minimum size is 2!");
    let buffer: Array<{written: boolean, data: T | undefined}> = new Array(size);
    let readIndex = 0;
    let writeIndex = 0;
    let free = size;

    return {
      read: (): T | undefined => {
        if(!buffer[readIndex])
          throw new RingBufferReadError(readIndex);
        const { written, data } = buffer[readIndex];
        if(!written)
          throw new RingBufferReadError(readIndex);
        buffer[readIndex] = { written: false, data: undefined };
        readIndex++;
        if(readIndex > buffer.length)
          readIndex = 0;
        free++;
        return data;
      },
      write: (data: T | undefined) => {
        if(writeIndex == readIndex && buffer[writeIndex] && buffer[writeIndex]?.written)
          throw new RingBufferWriteError(writeIndex);
        buffer[writeIndex] = {written: true, data};
        writeIndex++;
        if(writeIndex >= buffer.length)
          writeIndex = 0;
        free--;
      },
      readIndex: (): number => {
        return readIndex;
      },
      writeIndex: (): number => {
        return writeIndex;
      },
      grow: (size: number) => {
        if(size < 1)
          throw new RingBufferError("Invalid value!");
        for(let i = 1; i <= size; i++) {
          buffer.splice(readIndex, 0, {written: false, data: undefined});
          readIndex++;
          writeIndex++;
        }
        free += size;
      },
      shrink: (size: number) => {
        if(size > buffer.length - 2)
          throw new RingBufferError("Can't shrink to less than 2!");
        const newSize = buffer.length - size;
        while(buffer.length > newSize) {
          let del = writeIndex + 1;
          if(del === buffer.length - 1)
            del = 0;
          if(readIndex === del)
            readIndex++;
          buffer.splice(del, 1);
          readIndex--;
          writeIndex--;
        }
        free = free - size < 0 ? 0 : free - size;
      },
      size: (): number => {
        return buffer.length;
      },
      free: (): number => {
        return free;
      },
      flush: () => {
        buffer = new Array<{written: boolean, data: T | undefined}>(buffer.length);
        readIndex = 0;
        writeIndex = 0;
        free = buffer.length;
      },
      reset: () => {
        buffer = new Array<{written: boolean, data: T | undefined}>(size);
        readIndex = 0;
        writeIndex = 0;
        free = size;
      }
    };
  };
}