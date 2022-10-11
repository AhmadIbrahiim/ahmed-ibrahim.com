---
date: 2022-10-11
title: 'Database index. What do you need to know?'
template: post
thumbnail: '../thumbnails/db.png'
slug: database-index-what-you-need-to-know
seoImage: '../thumbnails/index-seo.png'

categories:
  - Database
tags:
  - database
---

## What Is Database index 💾
Indexing makes columns faster to query by creating pointers to where data is stored within a database. Similar to bookmarks, That can make it easy to go to a certain position in the book without going through each page!

# ![image-center](https://media2.giphy.com/media/Oo1MAs4PmdkJO/giphy.gif?cid=5a38a5a2hfibpu7qeb4pugf35v8cklk2tcikrao2tnmdf4si&rid=giphy.gif&ct=g)
## Benefits of index
Faster lookup for results. Instead of scanning the entire table for the results, Use index structures such as B-Trees or Hash Indexes to get to your data faster. This is all about reducing the # of Disk IOs.
# ![image-center](https://c.tenor.com/KQ_L3hq_K0gAAAAd/no-indexes-wall.gif)
```
Indexes are good at speeding up the time it takes to search and find data in SELECT queries, but they can slow down queries to UPDATE, INSERT, or DELETE. If you have tables that you modify more often than you read the data, you may not want to use indexes for quicker searching.
```

## How indexes works
Let’s start with this example, assuming we have a table of Friends. We won’t dive into the exact query that creates that table, as It differs based on the DBMS that you are using.
| ID | Name | City |
| --- | --- | --- |
| 1 | Alex | NY |
| 2 | Sara | LA |
| 3 | Zack | VR |
| 4 | Dave | CT |

**By default** primary key, Which in this case (ID) is auto-indexed, meaning that the DBMS(Database Management System) will create it automatically upon creating the table.

Building on that, We can try two simple (lookup) queries that demonstrate how the index would affect query time.

```sql
-- Lookup query with Name (Non-index)
SELECT * from Friends where Name = 'Zack'
```

In the above example, We’re trying to lookup for the non-index column, Which will scan every single row of the table, Till it finds all rows with `Name='Zack'`
> [Full table scan](https://en.wikipedia.org/wiki/Full_table_scan) usually the slowest method of scanning a table due to the heavy amount of I/O reads
>

# ![image-center ](https://dataschool.com/assets/images/sql-optimization/how_to_index/BasicSearchGif.gif)
Source: ****[Indexing](https://dataschool.com/sql-optimization/how-indexing-works/)****

**Let’s add an index and try again:**

Now, we’re going to add an index to column (Name) and see how the query will be different than before.

```sql
CREATE INDEX friends_name ON Friends(Name);
```

Once index creation is finished, We can do the same query again, but now, we should notice a significant change in # of rows that we scan.


---

We could skip looking for the data in certain rows. If we wanted to search for "Zack" and we know the data is in alphabetical order we could jump down to halfway through the data to see if Zack comes before or after that row. We could then half the remaining rows and make the same comparison.

# ![image-center ](https://dataschool.com/assets/images/sql-optimization/how_to_index/BinarySearchGif.gif)

Source: ****[Indexing](https://dataschool.com/sql-optimization/how-indexing-works/)****

Indexes allow us to create sorted lists without having to create all new sorted tables, which would take up a lot of storage space. This took 3 comparisons to find the right answer instead of 9 in the unindexed data.

# What is happening Under the hood?

The index will also pointers that simply reference information for the location of the additional information in memory.

With that index, the query can search for only the rows in the `Name` column that have `Zack` and then using the pointer can go into the table to find the specific row where that pointer lives.

# ![image-center](https://chartio.com/assets/65a00c/tutorials/database-indexing/569d22eeb4dbb4255daba9994ea4664251640a59cc99ade7cdb1c37691d6c99c/indexed-table.png)
Source: ****[How Does Indexing Work](https://chartio.com/learn/databases/how-does-indexing-work/)****

# ****Types of Indexing****

1. Clustered index
2. Non-clustered index

```
Both clustered and non-clustered indexes are stored and searched as B-trees, a data structure similar to a binary tree.
```

# ![image-center](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c4914cc1-0b63-48fd-a195-ace65d6dbbad/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221011T191602Z&X-Amz-Expires=86400&X-Amz-Signature=48ba3eb1d3234c1d73cd86fbc682d5fdfc9e76e4259b4c5a04f2b7dfd2608ad8&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

## ****Clustered Indexes****

A Clustered index is the type of indexing that establishes a physical sorting order of rows. Suppose you have a table **Friends Table** which contains `ID` as a primary key, then Clustered index which is self-created on that primary key will sort the  **Friends Table**  table as per `ID`.

- Clustered indexes do not have to be explicitly declared.
- Created when the table is created.
- Use the primary key sorted in ascending order.

## Non-clustered indexes

Index is an index structure separate from the data stored in a table that reorders one or more selected columns. The non-clustered index is created to improve the performance of frequently used queries not covered by a clustered index. It’s like a textbook; the index page is created separately at the beginning of that book

# ![image-center](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bedc3a7b-2bdb-41cf-879b-ac87bdd6d78f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221011T191447Z&X-Amz-Expires=86400&X-Amz-Signature=8c1652bfeac1443dced120a0fc692dd772cd2e1f133be8dfa83771693592507d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

And, They are used to increase the speed of queries on the table by creating columns that are more easily searchable. Non-clustered indexes can be created by data analysts/ developers after a table has been created and filled.

## When Should Indexes Be Avoided?
- Small Table, It’s not effective to have indexes on a small table ([Why](https://www.sqlservercentral.com/forums/topic/indexing-small-tables-what-is-small-enough-to-avoid-indexes-altogether#:~:text=Indexing%20small%20tables%20may%20not,data%20in%20the%20table%20changes.))
- Tables that have frequent, large batch update jobs run can be indexed. However, the batch job's performance is slowed considerably by the index. The conflict of having an index on a table that is frequently loaded or manipulated by a large batch process
- Indexes should not be used on columns that contain a high number of NULL values.
- Columns that are frequently manipulated should not be indexed.

Thank you!

# ![image-center](https://media2.giphy.com/media/bAplZhiLAsNnG/giphy.gif?cid=5a38a5a2ihzyzsvg35xopj7proxa8qdulm2ibdmajiniqzqm&rid=giphy.gif&ct=g)
