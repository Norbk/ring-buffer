<h1 align="center">
<img width="200" src="media/logo.svg" alt="Ring Buffer">
</br>
Dynamic Ring Buffer
</h1>

A TyepScript/Javascript Dynamic Ring (Circular) Buffer.

## Install
```
npm install dyn-ring-buffer
```
## Usage
### Create a new buffer
```js
import { RingBuffer } from 'dyn-ring-buffer';

// a buffer with the size of 10
const buffer = RingBuffer.create<String>(10);
```
### Write and Read
```js
// write two items into the buffer
buffer.write('Hello');
buffer.write('World');

// read from the buffer
buffer.read(); // Hello
```
### Shrink and Grow
```js
const buffer = RingBuffer.create(10);

// grow the buffer with 2
buffer.grow(2);

buffer.size(); // 12

// shrink the buffer by 5
buffer.shrink(5);

buffer.size(); // 7
```

# API
## RingBuffer.create()
Create a buffer with the given size. Minimum size is 2, throws error otherwise.
```js
// JS
const buffer = RingBuffer.create(10);
// TS with generics
const buffer RingBuffer.create<string>(10);
```
## buffer.read()
Reads the next available item in the buffer. Throws error if buffer is empty.
```js
buffer.read();
```
## buffer.write()
Write data to the buffer. In typescript use the specified type durring creation. Throws error if buffer is full.
```js
buffer.write('Hello World');
```
## buffer.grow()
Grows the buffer with a given amount. Throws error when trying to grow the buffer with less than 1.
```js
buffer.grow(2); // buffer size + 2
```
## buffer.shrink()
Shrinks the buffer down with the given amount. Throws error when trying to shrink the buffer to less than 2.
```js
buffer.shrink(2) // buffer size - 2
```
## buffer.size()
Returns the size of the buffer.
```js
buffer.size();
```
## buffer.free()
Returns the amount of free space in the buffer.
```js
buffer.free();
```
## buffer.readIndex()
The position of the read token. Starting index is 0.
```js
buffer.readIndex()
```
## buffer.writeIndex()
The position of the write token.Starting index is 0.
```js
buffer.writeIndex()
```
## buffer.flush()
Flushes all the data (resets read and write token) from the buffer. Retains the size if that was changed.
```js
buffer.flush();
```
## buffer.reset()
Resets the buffer to its original size and the read write tokens.
```js
buffer.reset();
```