var util = require('util');

export default {
  upsertAddress: async (parent, args, { prisma }) => {
    let data = Object.assign({}, args);
    let cond = { id: args.id || 1 };
    delete data.id;

    if (args.account) {
      const member = await prisma
        .member({
          account: args.account,
        })
        .$fragment(`{ id address {id} }`);
      console.log(member);
      if (!member) {
        throw new Error(util.format('Account "%s" not exists ', args.account));
      }
      if (member.address) {
        cond = { id: member.address.id };
      }
      data.member = { connect: { id: member.id } };
      delete data.account;
    }
    // AddressUpdateInput 裡面不能有 member.connect，所以要刪除他
    let createData = Object.assign({}, data);
    delete data.member;

    return prisma.upsertAddress({
      where: cond,
      update: data,
      create: createData,
    });
  },
  createMember: async (parent, args, { prisma }) => {
    // console.log(args);
    let data = args;
    let member;
    let notNullFields = ['account', 'email'];

    // 未知的uuid 要從member-api查詢

    const exist = await prisma.$exists.member({
      account: args.account,
    });
    if (exist) {
      throw new Error(
        util.format('account "%s" exists, ignore this request ', args.account)
      );
    }

    // 將驗證移入
    for (let [key, value] of Object.entries(notNullFields)) {
      if (!args[value]) {
        throw new Error(
          util.format(
            'Field "%s" is required, but it was not provided. ',
            value
          )
        );
      }
    }

    // 巢狀 mutation 範例
    if (args.address) {
      let address = {
        // create 建立新的 address
        create: args.address,
        // connect 連結到既有的 address，用ID反查
      };
      data.address = address;
    }

    // console.log(data);
    try {
      const result = prisma.createMember(data);
      return result;
    } catch (error) {
      console.log(error);
      console.log(data);
    }
    // console.log(result);
  },
  updateMember: async (parent, args, { prisma }) => {
    console.log(args);
    // Runtime issue
    let data = args;

    // remove pk after assigned to cond
    let cond = { id: args.id || 1 };

    if (args.account) {
      cond = { account: args.account };
    }
    // const connectFields = ['address']
    // 1對1關係
    if (args.address) {
      let address = {
        upsert: {
          update: args.address,
          create: args.address,
        },
      };
      data.address = address;
    }
    return prisma.updateMember({
      where: cond,
      data,
    });
  },
};
