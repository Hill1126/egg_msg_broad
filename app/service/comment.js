'use strict';

const Service = require('egg').Service;

class CommentService extends Service {

  /**
   *
   * @param {object}data
   * @param {string}data.context 留言内容
   * @param {objectId} data.creator 留言者id
   * @return {Promise<void>}
   */
  async createComment(data) {
    const { ctx } = this;
    data.creator = ctx.session.user._id;
    return await ctx.model.Comment.create(data);

  }

  /**
   * 根据id获取留言
   * @param {string} commentId 评论id
   * @return {Promise<void>}
   */
  async getComment(commentId) {
    const { ctx, app } = this;
    const comment = await ctx.model.Comment.findOne({
      _id: this.app.mongoose.Types.ObjectId(commentId),
      isDel: false,
    }).populate({ path: 'replies.toUser', select: 'name account avatar' })
      .populate({ path: 'replies.createUser', select: 'name account avatar' })
      .lean();
    // 过滤已删除comment
    const currLoginAct = ctx.session.user.account;
    app._.remove(comment.replies, reply => reply.isDel !== false);
    comment.creator.editAuth = currLoginAct === comment.creator.account;
    if (comment.creator.account === currLoginAct) {
      // 自己创建的留言
      comment.replies.forEach(reply => {
        reply.editAuth = true;
      });
    } else {
      // 留言不是自己创建
      comment.replies.forEach(reply => {
        reply.editAuth = currLoginAct === reply.createUser.account;
      });
    }
    return comment;
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
    const { ctx, app } = this;
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
    const currLoginAct = ctx.session.user ? ctx.session.user.account : 'none';

    const [ list, count ] = await Promise.all([
      ctx.model.Comment.find(where).populate(
        { path: 'creator', select: 'name avatar account' }
      ).populate({ path: 'replies.toUser', select: 'name account avatar' })
        .populate({ path: 'replies.createUser', select: 'name account avatar' })
        .limit(pageSize)
        .skip(skip)
        .sort({ createTime: -1 })
        .lean(),
      ctx.model.Comment.countDocuments(where),
    ]);
    if (currLoginAct !== 'none') {
      list.forEach(item => {
        app._.remove(item.replies, reply => reply.isDel !== false);
        if (item.creator.account === currLoginAct) {
          // 自己创建的留言
          item.creator.editAuth = true;
          item.replies.forEach(reply => {
            reply.editAuth = true;
          });
        } else {
          // 留言不是自己创建
          item.replies.forEach(reply => {
            reply.editAuth = currLoginAct === reply.createUser.account;
          });
        }
      });
    }


    return { count, list };
  }

  /**
   *
   * @param {object} data
   * @param {objectId} data.id 留言的id
   * @param {string} data.context 修改的内容
   * @return {Promise<void>}
   */
  async updateComment(data) {
    const { ctx, app } = this;
    const user = ctx.session.user;
    const comment = await ctx.model.Comment.findOne({ _id: app.mongoose.Types.ObjectId(data.id), isDel: false });
    if (!comment) ctx.throw(400, '评论不存在');
    if (String(comment.creator) !== String(user._id)) {
      ctx.throw(400, '无权限操作');
    }
    const query = { _id: comment._id };
    return ctx.model.Comment.update(query, { context: data.context });
  }


  /**
   * 根据id删除留言
   * @param {string} commentId
   * @return {Promise<string>}
   */
  async deleteComment(commentId) {
    const { ctx, app } = this;
    const comment = await ctx.model.Comment.findOne({ _id: app.mongoose.Types.ObjectId(commentId), isDel: false });
    if (String(comment.creator) !== String(ctx.session.user._id)) {
      ctx.throw(400, '无权限操作');
    }
    comment.isDel = true;
    await comment.save();
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
      _id: app.mongoose.Types.ObjectId(data.commentId),
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
   * @param {string} data.commentId 留言板id
   * @param {string} data.replyId 留言回复id
   * @return {Promise<void>}
   */
  async deleteReply(data) {
    const { ctx, app } = this;
    const user = ctx.session.user;
    const comment = await ctx.model.Comment.findOne({ _id: app.mongoose.Types.ObjectId(data.commentId) });

    const reply = comment.replies.find(item => String(item.createUser) === String(user._id));
    // 权限校验
    if ((String(user._id) !== String(comment.creator))
      && String(reply._id) !== String(data.replyId)) {
      ctx.throw(400, '无权限操作');
    }
    // 删除回复
    comment.replies.forEach(item => {
      if (String(item._id) === String(data.replyId)) {
        item.isDel = true;
      }
    });
    await comment.save();
  }

  /**
   * 更新留言中的评论
   * @param {object} data
   * @param {objectId} data.commentId 留言板id
   * @param {objectId} data.replyId 留言回复id
   * @param {string} data.context 要更新的回复内容
   * @return {Promise<void>}
   */
  async updateReply(data) {
    const { ctx, app } = this;
    const user = ctx.session.user;
    const comment = await ctx.model.Comment.findOne({ _id: app.mongoose.Types.ObjectId(data.commentId) });

    // 删除回复
    comment.replies.forEach(item => {
      if (String(item._id) === String(data.replyId)) {
        if (String(comment.creator) === String(user._id) || String(item.createUser) === String(user._id)) {
          item.context = data.context;
        } else {
          ctx.throw(400, '无权操作');
        }
      }
    });
    await comment.save();
  }


}

module.exports = CommentService;
