const BaseRepository = require('./BaseRepository');
const path = require('path');

class UserRepository extends BaseRepository {
  constructor() {
    super(path.join(__dirname, '../../data/users.json'));
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }
}

module.exports = new UserRepository();
