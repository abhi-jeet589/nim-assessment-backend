const Order = require("../db/models/orders.js");

const getAll = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOne = async (req, res) => {
  try {
    const order = await Order.getOne(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const create = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  try {
    const order = await Order.update(req.params.id, req.body);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const remove = async (req, res) => {
  try {
    const order = await Order.remove(req.params.id);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getByCustomer = async (req, res) => {
  try {
    const orders = await Order.getByCustomer(req.params.id);
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getByStatus = async (req, res) => {
  try {
    const orders = await Order.getByStatus(req.query.s);
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const agg = [
  {
    $unwind: {
      path: "$items",
      includeArrayIndex: "string",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "menuitems",
      localField: "items.item",
      foreignField: "_id",
      as: "item"
    }
  },
  {
    $unwind: {
      path: "$item",
      includeArrayIndex: "string",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      itemQuantity: "$items.quantity",
      itemPrice: "$item.price"
    }
  },
  {
    $group: {
      _id: null,
      totalSales: {
        $sum: {
          $multiply: ["$itemPrice", "$itemQuantity"]
        }
      }
    }
  }
];

const getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.Order.aggregate(agg);
    res.send({ total: totalSales[0].totalSales });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getByCustomer,
  getByStatus,
  getTotalSales
};
