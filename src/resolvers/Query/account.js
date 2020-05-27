function formatDateTime(dateStr) {
  if (!dateStr) {
    return new Date().toISOString();
  }
  return new Date(dateStr).toISOString();
}

export default {
  // 分頁
  // skip: 5, // 跳過幾筆資料再查詢
  // after: "ID", // 從哪個column之後查詢
  // before: "ID", // 從哪個column之前查詢
  // first: first // 前幾筆資料
  // last: 1, // 最後幾筆資料

  member: async (root, args, { prisma }) => {
    let params = {
      first: 100,
      where: {},
    };
    let where = {};

    const dateTimeFileds = ['updatedAt_gte'];

    for (let [key, value] of Object.entries(dateTimeFileds)) {
      if (args[value]) {
        args[value] = formatDateTime(args[value]);
      }
    }

    if (args.id) {
      params.where['id'] = args.id;
      delete args.id;
    }

    if (args.account) {
      params.where['account'] = args.account;
      delete args.account;
    }
    if (args.account_contains) {
      params.where['account_contains'] = args.account_contains;
      delete args.account_contains;
    }
    if (args.name_contains) {
      params.where['name_contains'] = args.name_contains;
      delete args.name_contains;
    }

    for (let key in args) {
      if (args[key]) {
        params[key] = args[key];
      }
    }
    return prisma.members(params);
  },

  address: (root, args, { prisma }) => {
    let params = {
      first: 100,
    };
    if (args.id) {
      params.where = {
        id: args.id,
      };
      delete args.id;
    }
    for (let key in args) {
      if (args[key]) {
        params[key] = args[key];
      }
    }
    console.log(params);
    return prisma.addresses(params);
  },
};
