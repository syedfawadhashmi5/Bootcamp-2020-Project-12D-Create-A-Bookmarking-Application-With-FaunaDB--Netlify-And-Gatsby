const { ApolloServer, gql } = require("apollo-server-lambda");

const dotenv = require("dotenv")
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}
dotenv.config()

var faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!, url: String!): Bookmark
  }
`;

const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({
          secret: process.env.BOOKMARK_DATABASE_ID,
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        return result.data.map((d) => {
          return {
            id: d.ts,
            title: d.data.title,
            url: d.data.url,
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { title, url }) => {
      console.log(title, url);
      try {
        var adminClient = new faunadb.Client({
          secret: process.env.BOOKMARK_DATABASE_ID,
        });

        const result = await adminClient.query(
          q.Create(q.Collection("Bookmarks"), {
            data: {
              title,
              url,
            },
          })
        );
        return result.data.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = { handler };
