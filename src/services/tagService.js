const tagRepository = require('../repositories/TagRepository');
const Tag = require('../models/Tag');
const AppError = require('../utils/AppError');
const {
  ERROR_MESSAGES,
  HTTP_STATUS,
  TAG_CONSTANTS
} = require('../constants');

class TagService {
  async createTag(userId, tagData) {
    const { name, color } = tagData;

    // Check tag limit
    const tagCount = await tagRepository.countByUserId(userId);
    if (tagCount >= TAG_CONSTANTS.LIMITS.MAX_TAGS_PER_USER) {
      throw new AppError(
        ERROR_MESSAGES.TAG.MAX_TAGS_REACHED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check for duplicate tag name
    const existingTag = await tagRepository.findByUserIdAndName(userId, name);
    if (existingTag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NAME_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Create tag
    const tag = new Tag({
      userId,
      name: name.trim(),
      color: color || TAG_CONSTANTS.DEFAULTS.COLOR
    });

    // Validate tag
    const validation = tag.validate();
    if (!validation.isValid) {
      throw new AppError(
        validation.errors.join(', '),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const createdTag = await tagRepository.create(tag);
    return new Tag(createdTag).toJSON();
  }

  async getAllTags(userId) {
    const tags = await tagRepository.findByUserId(userId);
    return tags.map(tag => new Tag(tag).toJSON());
  }

  async getTagById(userId, tagId) {
    const tag = await tagRepository.findByUserIdAndId(userId, tagId);
    if (!tag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return new Tag(tag).toJSON();
  }

  async updateTag(userId, tagId, updates) {
    const tag = await tagRepository.findByUserIdAndId(userId, tagId);
    if (!tag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // If updating name, check for duplicates
    if (updates.name && updates.name.trim() !== tag.name) {
      const existingTag = await tagRepository.findByUserIdAndName(
        userId,
        updates.name
      );
      if (existingTag && existingTag._id !== tagId) {
        throw new AppError(
          ERROR_MESSAGES.TAG.NAME_ALREADY_EXISTS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Prepare updates
    const updateData = {};
    if (updates.name) {
      updateData.name = updates.name.trim();
    }
    if (updates.color) {
      updateData.color = updates.color;
    }

    // Validate updates
    const updatedTag = new Tag({ ...tag, ...updateData });
    const validation = updatedTag.validate();
    if (!validation.isValid) {
      throw new AppError(
        validation.errors.join(', '),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await tagRepository.updateByUserIdAndId(
      userId,
      tagId,
      updateData
    );
    return new Tag(result).toJSON();
  }

  async deleteTag(userId, tagId) {
    const tag = await tagRepository.findByUserIdAndId(userId, tagId);
    if (!tag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // TODO: Check if tag is used in any expenses
    // For now, we'll allow deletion
    // In the future, you can either prevent deletion or remove tag from expenses

    const deleted = await tagRepository.deleteByUserIdAndId(userId, tagId);
    return new Tag(deleted).toJSON();
  }

  async getExpensesByTag(userId, tagId) {
    const tag = await tagRepository.findByUserIdAndId(userId, tagId);
    if (!tag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // TODO: Implement expense fetching by tag
    // This will be implemented when the Expense feature is added
    return [];
  }

  async mergeTags(userId, sourceTagId, targetTagId) {
    // Validate that both tags exist and belong to the user
    const sourceTag = await tagRepository.findByUserIdAndId(userId, sourceTagId);
    const targetTag = await tagRepository.findByUserIdAndId(userId, targetTagId);

    if (!sourceTag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!targetTag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.MERGE_TARGET_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (sourceTagId === targetTagId) {
      throw new AppError(
        ERROR_MESSAGES.TAG.CANNOT_MERGE_SAME_TAG,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // TODO: Update all expenses using sourceTag to use targetTag instead
    // This will be implemented when the Expense feature is added

    // Delete the source tag
    await tagRepository.deleteById(sourceTagId);

    return {
      mergedFrom: new Tag(sourceTag).toJSON(),
      mergedInto: new Tag(targetTag).toJSON()
    };
  }

  async getTagStatistics(userId, tagId) {
    const tag = await tagRepository.findByUserIdAndId(userId, tagId);
    if (!tag) {
      throw new AppError(
        ERROR_MESSAGES.TAG.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // TODO: Implement tag statistics
    // This will include:
    // - Total expenses with this tag
    // - Total amount spent
    // - Date range
    // - etc.
    return {
      tag: new Tag(tag).toJSON(),
      totalExpenses: 0,
      totalAmount: 0,
      firstExpenseDate: null,
      lastExpenseDate: null
    };
  }
}

module.exports = new TagService();
