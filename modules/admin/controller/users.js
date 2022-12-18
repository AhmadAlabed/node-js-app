const productModel = require("../../../DB/models/Product");
const userModel = require("../../../DB/models/User");
const { paginate } = require("../../../services/paginate");

/////////////////////////---userList---///////////////////////////
const userList = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginate(page, size);
    const cursor = userModel
      .find({})
      .limit(limit)
      .skip(skip)
      .populate([
        {
          path: "wishList",
          select: "title description price",
        },
      ])
      .cursor();
    const users = [];
    for (
      let user = await cursor.next();
      user != null;
      user = await cursor.next()
    ) {
      const products = await productModel
        .find({ createdBy: user._id })
        .populate([
          {
            path: "likes",
            select: "userName email",
          },
          {
            path: "comments",
            select: "body",
            populate: [
              {
                path: "commentBy",
                select: "userName email",
              },
              {
                path: "likes",
                select: "userName email",
              },
              {
                path: "replies",
                select: "body",
                populate: [
                  {
                    path: "commentBy",
                    select: "userName email",
                  },
                  {
                    path: "likes",
                    select: "userName email",
                  },
                  {
                    path: "replies",
                    select: "body",
                    populate: [
                      {
                        path: "commentBy",
                        select: "userName email",
                      },
                      {
                        path: "likes",
                        select: "userName email",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]);
      users.push({ user, products });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = userList;
