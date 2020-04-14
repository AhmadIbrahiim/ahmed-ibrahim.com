---
date: 2019-09-24
title: 'Dynamic Open Graph Image API 👻'
template: post
thumbnail: '../thumbnails/node.png'
slug: dynamic-graph-images-api
categories:
  - Tools
  - New
tags:
  - graph-api
  - og images
---
# [Imageiry.com 😺 ](https://www.imageiry.com/)
 

## Overview

**Imageiry** Create a dynamic image representing your content for sharable content. To make it look stunning    👈.

See the images in real facebook post : 

![image](https://i.ibb.co/kcNvYPQ/image.png)

![image](https://i.ibb.co/MSfCPjV/image.png)


*Also,You can use imageiry to : *

 - Turn your HTML Design into image.
 - When you use Open Graph tags to attach rich photos, you need an image, and ideally, an image based on your content
 - Enahnce the outfit for sharble content ( *With createing unquie meta image for each artical or blog* )


## What is an Open Graph Image?

Have you ever posted a hyperlink to Twitter, Facebook, or Slack and seen an image popup?
How did your social network know how to "unfurl" the URL and get an image?
The answer is in your `<head>`.

The [Open Graph protocol](http://ogp.me) says you can put a `<meta>` tag in the `<head>` of a webpage to define this image.

It looks like the following:

```html
<head>
  <title>Title</title>
  <meta property="og:image" content="http://example.com/logo.jpg" />
</head>
```


## Why use this service?

Read the [blog post](https://www.imageiry.com/blog/why-to-use-imageiry) for more info on the "Why" part.

The short answer is that it would take a long time to painstakingly design an image for every single blog post. And we don't want the exact same image for every blog post because that wouldn't make the article stand out when it was shared to Twitter. 

That's where `imageiry.com` comes in. We can simply pass the title of our blog post to our generator service and it will generate the image for us on the fly!

It looks like the following:

```html
<head>
  <title>Hello World</title>
  <meta property="og:image" content="https://www.imageiry.com/api/default?title=Write%20your%20text&url=www.Imageiry.com" />
</head>
```

Now try changing the title text `Write%20your%20text` to the title of your choosing and watch the magic happen ✨



## Usage

Imageiry has an direct api to convert any HTML based design into image 

`http://www.imageiry.com/convert`  [**POST]** ⚡

Field | Description
------|------------
html | _Any html content_
_Note_: Imageiry will convert the _body_ of the page only.

![image](https://i.ibb.co/RDV768h/image.png)


## Ready made templates.

**Default Template**

Using dynamic images for your content enrich your website and ideally enhance your user experience especially for sharable content.

`http://www.imageiry.com/api/default`  [**GET]** ⚡

Paramter | Description
------|------------
title | _required
url | _required_
color | _optional_

**_Response_**
![image](https://www.imageiry.com/api/default?title=Hi!Github&url=www.Imageiry.com)


**Movies**

Using dynamic images for your content enrich your website and ideally enhance your user experience especially for sharable content.

*Example  *:

![image](https://i.ibb.co/kcNvYPQ/image.png)



_API_ `http://www.imageiry.com/api/movie` **[GET]** ⚡

Paramter | state 
------|------------
title | _required_
description | _required_
moreInfo | _required_
rate | _required_
tag | _required_
likes | _optional_
backgroundImage | _optional_
posterImage| _optional_

 

**Sample**: 

    http://www.imageiry.com/api/movie?title=How%20to%20be%20awesome&description=be%20like%20man&moreInfo=This%20is%20more%20info%20about%20the%20link&rate=3&tag=PG-13 🚦


## Article

>  Generate imge for each artical you write. Fully customized `title,author,color,image`

 - How it looks like on social media.

>![article-1](https://i.ibb.co/tmvqLGv/article-1.jpg)
![image](https://i.ibb.co/MSfCPjV/image.png)

**Usage**

_API_ `http://www.imageiry.com/api/article` **[GET]** ⚡

Paramter | state 
------|------------
title | _required_
author | _required_
image | _optional_

**Sample**

http://www.imageiry.com/api/article?title=Build%20software%20better,%20together.&author=Ahmed%20Ibrahim 🚦

## To Create you own (FREE) template please feel free to contact us : help@Imageiry.com
>
## To be continued.💫
Please share your thoughts if there is anything is missing.
 
