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
    return ctx.model.Comment.create(data);

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
   * @param {int} pageSize 数据显示大小
   * @param {int} pageNum  当前页数
   * @param {String} search 搜索关键字
   * @return {Promise<{count: DocumentQuery<any[], any, {}>, list: DocumentQuery<any[], any, {}>}>}
   */
  async listComments(data) {
    const { pageSize, pageNum, search } = data;
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
    const [ list, count ] = await Promise.all([
      // 查找结果及其总数据量
      ctx.model.Comment.find(where).limit(pageSize).skip(skip),
      ctx.model.Comment.count(where),
    ]);
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
    const { ctx } = this;
    ctx.model.Comment.findOneAndUpdate({ id: commentId }, { $set: { isDel: true } }).exec();
  }

  /**
   * 创建留言的二级回复
   * @param {object} data
   * @param {string} data.commentId 留言内容
   * @param {string} data.context 回复内容
   * @param {string} data.receiveId 接收用户的id
   * @return {Promise<void>}
   */
  async replyComment(data) {
    const { ctx } = this;
    // 构造回复对象
    const reply = {
      createUser: ctx.session.userInfo._id,
      toUser: data.receiveId,
      context: data.context,
    };
    // 插入留言回复中
    ctx.model.Comment.update(
      {
        idDel: false,
        _id: data.commentId,
      },
      {
        $push: { replies: reply },
      }
    ).exec();
  }


}

module.exports = CommentService;
