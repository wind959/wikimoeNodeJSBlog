const albumsModel = require('../models/albums');

exports.save = async function (parmas) {
  // document作成
  const albums = new albumsModel(parmas);
  // document保存
  return await albums.save()
}


exports.findOne = async function (parmas) {
  // document查询
  return await albumsModel.findOne(parmas);
}

// 查找所有
exports.find = async function (parmas, sort) {
  // document查询
  return await albumsModel.find(parmas).sort(sort);
}

// 分页查询
exports.findPage = async function (parmas, sort, page, limit) {
  // document查询
  const list = await albumsModel.find(parmas).sort(sort).skip((page - 1) * limit).limit(limit);
  const total = await albumsModel.countDocuments(parmas);
  // 查询失败
  if (!list || total === undefined) {
    throw new Error('查询失败')
  }
  return {
    list,
    total
  }
}

exports.updateOne = async function (filters, parmas) {
  // document查询
  parmas.$inc = { __v: 1 }
  parmas.updateDate = new Date()
  return await albumsModel.updateOne(filters, parmas);
}
// 删除
exports.deleteOne = async function (filters) {
  // document查询
  return await albumsModel.deleteOne(filters);
}