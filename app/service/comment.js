'use strict';

const Service = require('egg').Service;

class CommentService extends Service {

  /**
   *
   * @param {object}data
   * @param {string}data.context 留言内容
   * @return {Promise<void>}
   */
  async createComment(data) {
    const { ctx } = this;
    return await ctx.model.Comment.create(data);

  }

  /**
   * 根据id获取留言
   * @param {string} commentId 评论id
   * @return {Promise<void>}
   */
  async getComment(commentId) {
    const { ctx } = this;
    // todo 添加未删除筛选
    return ctx.model.Comment.findById(commentId);
  }

  /**
   * 列出留言，支持搜索和分页
   * @param {object}data
   * @param {int} data.pageSize 数据显示大小
   * @param {int} data.pageNum  当前页数
   * @param {String} data.search 搜索关键字
   * @param {String} data.account 用户账号，用于对留言的筛选
   * @return {Promise<{count: DocumentQuery<any[], any, {}>, list: DocumentQuery<any[], any, {}>}>}
   */
  async listComments(data) {
    const { pageSize, pageNum, search, account } = data;
    const { ctx } = this;
    const skip = (pageNum - 1) * pageSize;
    const where = {
      isDel: false,
    };
    // 如果search不为空，则拼接条件。
    if (search) {
      where.context = {
        $regex: new RegExp(search, 'i'),
      };
    }
    if (account) {
      // 根据账号查找用户信息
      const user = await ctx.model.User.findOne({ account }, '_id');
      where.creator = user._id;
    }
    const currLoginAct = ctx.session.user.account;

    const [ list, count ] = await Promise.all([
      // 查找结果及其总数据量
      ctx.model.Comment.find(where).populate(
        { path: 'creator', select: 'name avatar account' }
      ).populate({ path: 'replies.toUser', select: 'name account' })
        .populate({ path: 'replies.createUser', select: 'name account' })
        .limit(pageSize)
        .skip(skip)
        .sort({ createTime: -1 }),
      ctx.model.Comment.count(where).lean(),
    ]);
    list.forEach(item => {
      item.creator.editAuth = currLoginAct === item.creator.account;
    });
    return { count, list };
  }

  /**
   *
   * @param {object} data
   * @param {objectId} data.id
   * @param {string} data.context
   * @return {Promise<void>}
   */
  async updateComment(data) {
    const { ctx, app } = this;
    return ctx.model.Comment.findOneAndUpdate({ _id: app.mongoose.Types.ObjectId(data.id), isDel: false }, { $set: { context: data.context } });
  }


  /**
   * 根据id删除留言
   * @param {string} commentId
   * @return {Promise<string>}
   */
  async deleteComment(commentId) {
    const { ctx, app } = this;
    await ctx.model.Comment.findOneAndUpdate({ _id: app.mongoose.Types.ObjectId(commentId) },
      { $set: { isDel: true },
      });
  }

  /**
   * 创建留言的二级回复
   * @param {object} data
   * @param {string} data.commentId 留言内容id
   * @param {string} data.context 回复内容
   * @param {string} data.toUser 接收用户的id
   * @return {Promise<void>}
   */
  async createReply(data) {
    const { ctx, app } = this;
    // 构造回复对象
    const reply = {
      createUser: ctx.session.user._id,
      toUser: app.mongoose.Types.ObjectId(data.toUser),
      context: data.context,
    };
    const where = {
      isDel: false,
      _id: data.commentId,
    };

    // 插入留言回复中
    const result = await ctx.model.Comment.findOneAndUpdate(where,
      {
        $push: { replies: reply },
      },
      { new: true }
    );
    return result;
  }

  /**
   * 删除留言中的评论
   * @param {object} data
   * @param {objectId} data.commentId 留言板id
   * @param {objectId} data.replyId 留言回复id
   * @return {Promise<void>}
   */
  async deleteReply(data) {
    const { ctx, app } = this;
    await ctx.model.Comment.findOneAndUpdate(
      {
        _id: app.mongoose.Types.ObjectId(data.commentId),
       // replies: { $elemMatch: { _id: app.mongoose.Types.ObjectId(data.replyId) } },
      },
      { $pull: { replies: { _id: app.mongoose.Types.ObjectId(data.replyId) } } }
    );
  }


}

module.exports = CommentService;
