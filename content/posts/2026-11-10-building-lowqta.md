---
date: 2026-11-10
title: "Building Lowqta: when a discount needs evidence"
template: post
slug: building-lowqta
categories: [Engineering]
tags: [lowqta, "price tracking", postgres]
---

[Lowqta](https://www.lowqta.com/en) is my Egyptian shopping project. It brings products from different stores into one place, in Arabic and English, with recorded prices and links to the retailers.

The part that needs care is the discount. A store can put a large number above a smaller one and call the difference a saving. That tells us what the store is advertising. It doesn't tell us whether we have ever seen the product sell at that higher price.

## Keep the claim and the observation separate

Lowqta stores the retailer's comparison price separately from its own observations. The public page identifies which comparison it uses. An advertised previous price is useful evidence, but it isn't a price Lowqta necessarily recorded.

One example in the [guide to checking discounts](https://www.lowqta.com/en/guides/real-discounts) makes the distinction clear. On 2 November 2026, Raya item 277773 was recorded at 303 EGP with an advertised comparison of 14,999 EGP. Lowqta had recorded 289 EGP on nine earlier dates, from 19 October to 1 November.

The advertised reduction was 98%. Against those earlier observations, the new price was about 4.8% higher. Choosing the crossed-out number would have produced a very different answer.

That example describes one item on those dates. It says nothing about Raya's intentions or all its other prices.

## A price history has gaps

The website and the poller share Postgres. The poller collects product information; the website reads the accepted prices and their observation times. A failed or partial crawl stays incomplete. It mustn't become evidence that a product disappeared.

Repeated checks at the same price aren't price changes. A product's first appearance in Lowqta also isn't its launch date or the start of a sale. Those distinctions affect the labels people see, even when the current price hasn't changed.

For recorded comparisons, Lowqta uses the lower median of accepted prices from at least three distinct prior dates in a 30-day window, excluding today. With observations of 800, 900, 1,000 and 1,100 EGP, that reference is 900 EGP. With an even number of observations, it uses the smaller of the middle two prices.

It is still a sample. Lowqta doesn't know every price between its checks, so the page shouldn't imply continuous tracking.

## Product metadata is part of the comparison

Price collection is only useful if the product is identified correctly. A sofa cover and a complete sofa can sit in the same retailer category. Different capacities or pack sizes can share most of a title.

The adapters preserve the source category evidence before the shared rules map it into public categories. Audience, product family and the navigation path are separate fields. A promotional collection shouldn't turn into a product type.

Arabic and English names come from explicit retailer data where available. When a translated title is missing, the original title remains the fallback. Guessing a cleaner name would make the listing look better while making it less reliable.

## Make the limits visible

Lowqta isn't a retailer. The seller controls stock, delivery, warranty and the price at checkout. The site shows when it last accepted a price, and a rejected discount claim doesn't remove an otherwise valid current price from search.

Some purchase links earn an affiliate commission. The price checks use the same evidence rules regardless. The [methodology and affiliate explanation](https://www.lowqta.com/en/about) describe what the site can establish and where the reader still needs to check the retailer.

The aim is to give someone enough information to examine an offer before buying it. Sometimes the useful result is simply that the discount needs a closer look.
