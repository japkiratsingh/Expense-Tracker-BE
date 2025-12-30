const path = require('path');
const BaseRepository = require('./BaseRepository');

class TagRepository extends BaseRepository {
  constructor() {
    super(path.join(__dirname, '../../data/tags.json'));
  }

  async findByUserId(userId) {
    return this.find({ userId });
  }

  async findByUserIdAndName(userId, name) {
    return this.findOne({
      userId,
      name: name.trim()
    });
  }

  async findByUserIdAndId(userId, tagId) {
    const tag = await this.findById(tagId);
    if (!tag || tag.userId !== userId) {
      return null;
    }
    return tag;
  }

  async countByUserId(userId) {
    return this.count({ userId });
  }

  async deleteByUserIdAndId(userId, tagId) {
    const tag = await this.findByUserIdAndId(userId, tagId);
    if (!tag) {
      return null;
    }
    return this.deleteById(tagId);
  }

  async updateByUserIdAndId(userId, tagId, updates) {
    const tag = await this.findByUserIdAndId(userId, tagId);
    if (!tag) {
      return null;
    }
    return this.updateById(tagId, updates);
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
    return this.deleteById(sourceTagId);
  }
}

module.exports = new TagRepository();
