import { RingBuffer } from "../src";

describe("Create a buffer", () => {
  it("has the size of 10", () => {
    const buffer = RingBuffer.create<number>(10);
    expect(buffer.size()).toEqual(10);
  });
  it("fails when size set to 0", () => {
    expect(() => RingBuffer.create(0)).toThrowError("Minimum size is 2!");
  });
});

describe("Grow a buffer", () => {
  const buffer = RingBuffer.create<number>(10);
  it("grows to size 20", () => {
    buffer.grow(10);
    expect(buffer.size()).toEqual(20);
  });
  it("throws error on 0 or less", () => {
    expect(() => buffer.grow(-10)).toThrowError("Invalid value!")
  });
});

describe("Shrink a buffer", () => {
  it("shrinks to size 5", () => {
    const buffer = RingBuffer.create<number>(10);
    buffer.shrink(5);
    expect(buffer.size()).toEqual(5);
  });
  it("can't shrink to size smaller than 2", () => {
    const buffer = RingBuffer.create<number>(10);
    expect(() => buffer.shrink(9)).toThrowError("Can't shrink to less than 2!");
  });
});

describe("Write to buffer", () => {
  it("writes 3 numbers and the write index is 2", () => {
    const buffer = RingBuffer.create<number>(5);
    while(buffer.writeIndex() < 2) {
      buffer.write(buffer.writeIndex());
    }
    expect(buffer.writeIndex()).toEqual(2);
  });
  it("throws error when buffer is full", () => {
    const buffer = RingBuffer.create<number>(5);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    expect(() => buffer.write(6)).toThrowError("Buffer is full!");
  });
});

describe("Read from buffer", () => {
  it("writes 5 numbers and reads out 3", () => {
    const buffer = RingBuffer.create<number>(5);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    expect(buffer.read()).toEqual(1);
    expect(buffer.read()).toEqual(2);
    expect(buffer.read()).toEqual(3);
  });
  it("writes 3 numbers and fails when reading 4", () => {
    const buffer = RingBuffer.create<number>(5);
    for(let i = 1; i <=3; i++)
      buffer.write(i);
    expect(buffer.read()).toEqual(1);
    expect(buffer.read()).toEqual(2);
    expect(buffer.read()).toEqual(3);
    expect(() => buffer.read()).toThrowError("Buffer is empty!");
  });
});

describe("Get the free space left in a buffer", () => {
  it("empty buffer with the size of 10", () => {
    const buffer = RingBuffer.create<number>(10);
    expect(buffer.free()).toEqual(10);
  });
  it("half empty buffer with the size of 10", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    expect(buffer.free()).toEqual(5);
  });
  it("half empty buffer after reading twice with the size of 10", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    buffer.read();
    buffer.read();
    expect(buffer.free()).toEqual(7);
  });
  it("half empty buffer with the size of 10 shrank to 7", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    buffer.shrink(3);
    expect(buffer.free()).toEqual(2);
  });
  it("half empty buffer with the size of 10 shrank to 4", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    buffer.shrink(6);
    expect(buffer.free()).toEqual(0);
  });
});

describe("Flushing the buffer", () => {
  it("a half full buffer", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    expect(buffer.free()).toEqual(5);
    buffer.flush();
    expect(buffer.free()).toEqual(10);
    expect(() => buffer.read()).toThrowError("Buffer is empty!");
  });
  it("a half full buffer and grown by 2", () => {
    const buffer = RingBuffer.create<number>(10);
    for(let i = 1; i <=5; i++)
      buffer.write(i);
    expect(buffer.free()).toEqual(5);
    buffer.grow(2);
    expect(buffer.free()).toEqual(7);
    buffer.flush();
    expect(buffer.free()).toEqual(12);
  })
});
