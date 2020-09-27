---
date: 2020-04-25
title: 'The power of Node.js streams.'
template: post
thumbnail: '../thumbnails/node.png'
slug: the-power-of-nodejs-streams
categories:
  - Javascript
tags:
  - Node.js
  - Streams
---
## The power of Node.js streams.
> Streams are one of the most powerful features of Node.js

**What are Node.js streams?**

Streams are collections of data (Sequence of data) just like arrays or strings. The difference is that streams might not be available all at once, and they don’t have to fit in memory. This makes streams really powerful when working with large amounts of data, or data that’s coming from an external source one  _chunk_  at a time. The opposite of streams is buffering which means to receive the data and send It once a time.

Very Common example of streams and buffers:

— Watching Live Video ( Stream )

— Download a Video ( Buffer )

**Buffering versus streaming**

If we write a simple program that takes a simple input from the user i.e ( Hello Node.js ) and sends it a certain consumer for the buffer modal It will wait to receive _all the inputs_  from the user then send the complete buffer to the consumer

The following diagram shows a visual example of this paradigm:


![](https://miro.medium.com/max/865/1*On0DNxruUhPcpcwYJvtDOQ.png)

We can notice that, at the time t1, some data is received from the  
resource and saved into the buffer. At the time t2, another data chunk is received. The final one that completes the read operation and causes the entire buffer to be sent to the consumer.

On the other side, streams allow you to process the data as soon as it arrives from the resource. This is shown in the following diagram:



![](https://miro.medium.com/max/866/1*Hysp3M6dBKezQXZzjmhbUQ.png)

The diagram shows you how each new chunk of data is received from the  
resource and is immediately provided to the consumer, who now has the chance to process it straight away without waiting for all the data to be collected in the buffer.

But what are the differences between the two approaches? We can summarize them into two major categories:

-   Spatial efficiency
-   Time efficiency

# Spatial efficiency

streams allow us to do things that would not be possible, by buffering data and processing it all at once. Imagine reading a few of these big files concurrently; our application will easily run out of memory. Besides that, buffers in V8 cannot be bigger than 0x3FFFFFFF bytes (a little bit less than 1GB).

# Time efficiency

Let’s now consider an application that compresses a file and uploads it to a remote HTTP server, which in turn decompresses it and saves it on the filesystem. If our client was implemented using a buffered API, the upload would start only when the entire file has been read and compressed. On the other hand, the decompression will start on the server only when all the data has been received. A better solution to achieve the same result  
involves the use of streams. On the client machine, streams allow you to compress and send the data chunks as soon as they are read from the filesystem, whereas on the server, it allows you to decompress every chunk as soon as it is received from the remote peer. The following diagram should give us a hint


![](https://miro.medium.com/max/851/1*vzjCmd2LtM6XNPDMtzkEMg.png)

I hope this gives you a quick intro about Streams / Buffer with node.js

— Note: Some parts quoted from Node.js-Design-Patterns-2nd-Edition-by-Mario-Casciaro-Luciano-Mammino

Thank you,,