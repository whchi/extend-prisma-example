import { GraphQLServer } from 'graphql-yoga';
import { prisma } from './generated/prisma-client';
import resolvers from './resolvers';
import cors from 'cors';

const server = new GraphQLServer({
  typeDefs: './src/typeDefs/schema.graphql',
  resolvers,
  tracing: true,
  context: {
    prisma,
  },
});

const opts = {
  port: 4000,
  cors: {
    credentials: false,
    origin: ['http://localhost:8000'], // your frontend url.
  },
};
server.start(opts, () => {
  console.log(`伺服器已啟動，請訪問：http://localhost:${opts.port}`);
});
