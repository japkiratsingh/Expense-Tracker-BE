const User = require('../models/User');

class UserRepository {
  async findById(id) {
    return await User.findById(id).lean();
  }

  async find(query = {}) {
    return await User.find(query).lean();
  }

  async findOne(query) {
    return await User.findOne(query).lean();
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async create(data) {
    const user = new User(data);
    await user.save();
    return user.toJSON();
  }

  async updateById(id, updates) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return user;
  }

  async deleteById(id) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  async count(query = {}) {
    return await User.countDocuments(query);
  }
}

module.exports = new UserRepository();
