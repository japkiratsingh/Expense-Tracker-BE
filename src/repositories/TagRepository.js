const Tag = require('../models/Tag');

class TagRepository {
  async findById(id) {
    return await Tag.findById(id).lean();
  }

  async find(query = {}) {
    return await Tag.find(query).lean();
  }

  async findOne(query) {
    return await Tag.findOne(query).lean();
  }

  async create(data) {
    const tag = new Tag(data);
    await tag.save();
    return tag.toJSON();
  }

  async updateById(id, updates) {
    const tag = await Tag.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return tag;
  }

  async deleteById(id) {
    const result = await Tag.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await Tag.countDocuments(query);
  }

  async findByUserId(userId) {
    return await this.find({ userId });
  }

  async findByUserIdAndName(userId, name) {
    return await this.findOne({
      userId,
      name: name.trim()
    });
  }

  async findByUserIdAndId(userId, tagId) {
    return await Tag.findOne({ _id: tagId, userId }).lean();
  }

  async countByUserId(userId) {
    return await this.count({ userId });
  }

  async deleteByUserIdAndId(userId, tagId) {
    const result = await Tag.findOneAndDelete({ _id: tagId, userId });
    return !!result;
  }

  async updateByUserIdAndId(userId, tagId, updates) {
    return await Tag.findOneAndUpdate(
      { _id: tagId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Merge sourceTagId into targetTagId for a user
   * This will update all expenses using sourceTag to use targetTag
   * and then delete the sourceTag
   */
  async mergeTag(userId, sourceTagId, targetTagId) {
    const sourceTag = await this.findByUserIdAndId(userId, sourceTagId);
    const targetTag = await this.findByUserIdAndId(userId, targetTagId);

    if (!sourceTag || !targetTag) {
      return null;
    }

    // Note: The actual expense update will be handled by the service layer
    // This method just deletes the source tag after merge
    return await this.deleteById(sourceTagId);
  }
}

module.exports = new TagRepository();
