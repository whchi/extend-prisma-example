import Query from './Query';
import Mutation from './Mutation';

export default {
  Query,
  Mutation,
  Member: {
    address: (parent, args, { prisma }) => {
      return prisma.member({ id: parent.id }).address();
    },
  },
  Address: {
    member: (parent, args, { prisma }) => {
      return prisma.address({ id: parent.id }).member();
    },
  },
};
