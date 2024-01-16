# NextJS vs Express



### Why NextJS instead of Express for the backend part of AREA ?

| NextJS                                                | Express                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Fullstack Framework based on React                    | Backend framework that enables building APIs and server-side applications. |
| Supports CSR                                          | No built-in rendering system. Need to implement own optimizations. |
| Built on React. Supports many modern web technologies | Compatible with various template engines. Can integrate with React or other front-end libraries |





# React vs VueJs

https://vuestorefront.io/blog/vue-vs-react

### Why React instead of VueJS for the frontend part of AREA ?

| React                                                   | VueJS                                                |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Mobile application development is easier (React Native) | More difficult but has some solutions (NativeScript) |
| Many add-ons                                            | Lighter                                              |
| Bigger community                                        |                                                      |

![Vue vs React: What Is the Best Choice for 2021? – MindK Blog](https://www.mindk.com/wp-content/uploads/2018/12/Copy-of-When-everything-seems-to-be-going-against-you-remember-that-the-airplane-takes-off-against-the-wind-not-with-it.-min.png)



# Which DBMS ?



For the project, we are going to use two DBMS: 

- a **relational** database to store client credentials (identifiants, passwords)
- a **no-relational** database to store client services (cookies, OAuth2), and if we want to add more services, we can just add some columns to the no-relational database



### Relational Model: MySQL vs PostgreSQL

https://aws.amazon.com/compare/the-difference-between-mysql-vs-postgresql/#:~:text=MySQL%20has%20limited%20support%20of,stored%20procedures%20in%20multiple%20languages.&text=MySQL%20supports%20numeric%2C%20character%2C%20date,spatial%2C%20and%20JSON%20data%20types.

| MySQL                                                        | PostgreSQL                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Only relational database                                     | Object-relational database                                   |
| MySQL supports numeric, character, date and time, spatial, and JSON data types. | PostgreSQL supports all MySQL data types along with geometric, enumerated, network address, arrays, ranges, XML.. |
|                                                              |                                                              |



### No-Relational Model: MongoDB vs Redis

https://www.mongodb.com/compare/mongodb-vs-redis

| MongoDB                                                      | Redis                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| BSON Model (Binary JSON): More efficient for storing data or transmitting over a network | Key value store (key=value), so globally strings             |
| Query documents by single or multiple keys, ranges, or text search | Limited query functionality. By design-only primary key access |
| On-disk storage by default                                   | In-memory storage with on-disk persistence                   |

