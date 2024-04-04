var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Schema
var books = new Schema({
  booktype: { type: Schema.Types.ObjectId, ref: 'booktypes' },
  // 标题
  title: {
    type: String,
    required: true
  },
  // 封面
  cover: {
    type: String,
  },
  coverFolder: {
    type: String,
    default: null
  },
  coverFileName: {
    type: String,
    default: null
  },
  // 简评
  summary: {
    type: String,
  },
  // 评分，神作，佳作，良作，劣作，烂作，迷
  rating: {
    type: Number,
  },
  // label 字符串数组
  label: {
    type: [String],
    default: []
  },
  urlList: {
    type: [
      {
        text: String,
        url: String
      }
    ],
    default: []
  },
  // 开始阅读时间
  startTime: {
    type: Date,
  },
  // 结束阅读时间
  endTime: {
    type: Date,
  },
  // 状态 0: 不显示 1: 显示
  status: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('books', books);