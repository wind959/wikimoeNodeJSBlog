const utils = require('../../../utils/utils')
const log4js = require('log4js')
const adminApiLog = log4js.getLogger('adminApi')
const moment = require('moment-timezone');
const readerlogUtils = require('../../../mongodb/utils/readerlogs')


module.exports = async function (req, res, next) {
  const timeRangeType = req.query.timeRangeType
  const timeRangeTypeList = ['today', 'yesterday', 'week', 'month', 'year']
  // 判断timeRangeType是否符合格式
  if (!timeRangeTypeList.includes(timeRangeType)) {
    // 报错
    res.status(400).json({
      errors: [{
        message: '参数错误'
      }]
    })
    return
  }
  const siteTimeZone = global.$globalConfig.siteSettings.siteTimeZone || 'Asia/Shanghai'
  // 根据 timeRangeType 计算开始日期和结束日期
  let startDate, endDate;
  switch (timeRangeType) {
    case 'today':
      startDate = moment().tz(siteTimeZone).startOf('day');
      endDate = moment().tz(siteTimeZone).endOf('day');
      break;
    case 'yesterday':
      startDate = moment().tz(siteTimeZone).subtract(1, 'days').startOf('day');
      endDate = moment().tz(siteTimeZone).subtract(1, 'days').endOf('day');
      break;
    case 'week':
      startDate = moment().tz(siteTimeZone).startOf('week');
      endDate = moment().tz(siteTimeZone).endOf('week');
      break;
    case 'month':
      startDate = moment().tz(siteTimeZone).startOf('month');
      endDate = moment().tz(siteTimeZone).endOf('month');
      break;
    case 'year':
      startDate = moment().tz(siteTimeZone).subtract(1, 'years');
      endDate = moment().tz(siteTimeZone);
      break;
    default:
      break;
  }

  // 打印开始日期和结束日期
  // console.log(startDate.toDate(), endDate.toDate())
  const offset = moment.tz(siteTimeZone).format('Z')
  let $addFields = {
    "formatDate": {
      $dateToString: {
        format: `%Y-%m-%dT%H:00:00.000${offset}`,
        date: "$createdAt",
        timezone: siteTimeZone
      }
    }
  }
  // 如果是年或者月，就按照天分组
  if (timeRangeType === 'year' || timeRangeType === 'month') {
    $addFields = {
      "formatDate": {
        $dateToString: {
          format: `%Y-%m-%dT00:00:00.000${offset}`,
          date: "$createdAt",
          timezone: siteTimeZone
        }
      }
    }
  }

  // 来源站统计
  const readReferrerpipeline = [
    {
      $match: {
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        action: { $in: ['open'] },
        referrer: { $ne: null },
        isBot: false
      }
    },
    // 统计每个referrer出现的次数
    {
      $group: {
        _id: "$referrer",
        count: { $sum: 1 }
      }
    },
    // 按照次数排序
    {
      $sort: {
        count: -1
      }
    },
    // 只取前10
    {
      $limit: 10
    }
  ]
  const readReferrerData = await readerlogUtils.aggregate(readReferrerpipeline).catch(err => {
    adminApiLog.error(err)
    return false
  })
  if (!readReferrerData) {
    res.status(500).json({
      errors: [{
        message: '数据库查询错误'
      }]
    })
    return
  }
  // 单位时间内最受欢迎的文章
  const readPostViewPipeline = [
    {
      $match: {
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        action: { $in: ['postView'] },
        isBot: false
      }
    },
    // 根据{data.targetId} 分组
    {
      $group: {
        _id: "$data.targetId",
        count: { $sum: 1 }
      }
    },
    // 按照次数排序
    {
      $sort: {
        count: -1
      }
    },
    // 只取前10
    {
      $limit: 10
    },
    // 根据id查询posts,只要返回id,title,excerpt,type
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post"
      }
    },
    {
      $unwind: "$post"
    },
    {
      $project: {
        _id: 1,
        count: 1,
        title: "$post.title",
        excerpt: "$post.excerpt",
        type: "$post.type"
      }
    }
  ]
  const readPostViewData = await readerlogUtils.aggregate(readPostViewPipeline).catch(err => {
    adminApiLog.error(err)
    return false
  })

  if (!readPostViewData) {
    res.status(500).json({
      errors: [{
        message: '数据库查询错误'
      }]
    })
    return
  }

  // 单位时间 postLike 
  const readPostLikePipeline = [
    {
      $match: {
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        action: { $in: ['postLike'] },
        isBot: false
      }
    },
    // 根据{data.targetId} 分组
    {
      $group: {
        _id: "$data.targetId",
        count: { $sum: 1 }
      }
    },
    // 按照次数排序
    {
      $sort: {
        count: -1
      }
    },
    // 只取前10
    {
      $limit: 10
    },
    // 根据id查询posts,只要返回id,title,excerpt,type
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post"
      }
    },
    {
      $unwind: "$post"
    },
    {
      $project: {
        _id: 1,
        count: 1,
        title: "$post.title",
        excerpt: "$post.excerpt",
        type: "$post.type"
      }
    }
  ]
  const readPostLikeData = await readerlogUtils.aggregate(readPostLikePipeline).catch(err => {
    adminApiLog.error(err)
    return false
  })

  if (!readPostLikeData) {
    res.status(500).json({
      errors: [{
        message: '数据库查询错误'
      }]
    })
    return
  }


  let sendData = {
    readReferrerData: readReferrerData,
    readPostViewData: readPostViewData,
    readPostLikeData: readPostLikeData
  }

  // 发送响应
  res.send(sendData);
}
