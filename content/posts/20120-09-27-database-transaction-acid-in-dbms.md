---
date: 2020-09-27
title: 'Relation Database transactions (ACID)'
template: post
thumbnail: '../thumbnails/sql.png'
slug: database-transaction-acid-in-dbms
categories:
  - Database
tags:
  - RDBMS
  - ACID
  - MySQL
  - SQL
  - postgreSQL
---
## What is Database transaction?
 A _transaction_ is a single logical unit of work which accesses and possibly modifies the contents of a database. Transactions access data using read and write operations.

 All types of database access operation which are held between the beginning and end transaction statements are considered as a single logical transaction. During the transaction the database is inconsistent. Only once the database is committed the state is changed from one consistent state to another.

![Database Transaction ](https://www.guru99.com/images/1/100518_0500_DBMSTransac1.png)

**Example of simple transaction:**
```sql
START TRANSACTION;
INSERT INTO Users (ID, user_name, email) VALUES
('asdf','bbb','bbb@gmail.com');
INSERT INTO Address (street_address, city, zip_code,permanent, user_id) VALUES
('98  Old Chapel Road','GARWAY','HR2 7XH',1,1),
COMMIT
```
> If any part of the above code fails for any reason, unknown column, missing validation value or something. No other query will be performed, transaction ensures that there is no partial completion being recorded in the database.

**ACID PROPERTIES** are used for maintaining the integrity of database during transaction processing. ACID stands for Atomicity, Consistency, Isolation, and Durability.
![ACID Properties](https://user-images.githubusercontent.com/17949497/94364437-779aeb00-00c9-11eb-9743-fe0a769150a6.png)

#Atomicity
It means that either the entire transaction logic got executed successfully at once or does not happen at all. Transactions do not occur partially. Each transaction runs as one unite. Either to complete the full logic, or nothing executed. It involves the following operations:
 - **Abort**: The changes made to database are not visible 
 - **Commit**: The changes made to database are visible.
> Atomicity is also known as the ‘All or nothing rule’.

#Consistency 
Ensures that you guarantee that all data will be consistent. All data will be valid according to all defined rules, including any constraints, cascades, and triggers that have been applied on the database.

```example
Consider the following transaction T consisting of T1 and T2: Transfer of 100 from account X to account Y.

If the transaction fails after completion of T1 but before completion of T2.( say, after write(X) but before write(Y)), 

then amount has been deducted from X but not added to Y.

This results in an inconsistent database state. Therefore, the transaction must be executed in entirety in order to ensure correctness of database state.
 ```

#Isolation
Guarantees that multiple transactions can be executed concurrently without causing inconsistency of database state. Transactions occurs independently without interference. The changes occurring with any transaction will not be visible to any any other transaction until it has been committed (Saved).
> This property ensures that the execution of transactions concurrently will result in a state that is equivalent to a state achieved these were executed serially in some order.

#Durability
Durability means that, once a transaction is committed, it will remain in the system – even if there’s a system crash immediately following the transaction. Any changes from the transaction must be stored permanently. If the system tells the user that the transaction has succeeded, the transaction must have, in fact, succeeded.

--

The **ACID** properties, in totality, provide a mechanism to ensure correctness and consistency of a database in a way such that each transaction is a group of operations that acts a single unit, produces consistent results, acts in isolation from other operations and updates that it makes are durably stored.