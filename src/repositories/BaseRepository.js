const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class BaseRepository {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = [];
    this.loaded = false;
  }

  async load() {
    try {
      const fileData = await fs.readFile(this.filePath, 'utf8');
      this.data = JSON.parse(fileData);
      this.loaded = true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it
        this.data = [];
        await this.save();
        this.loaded = true;
      } else {
        throw error;
      }
    }
  }

  async save() {
    const dir = path.dirname(this.filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(
      this.filePath,
      JSON.stringify(this.data, null, 2),
      'utf8'
    );
  }

  async ensureLoaded() {
    if (!this.loaded) {
      await this.load();
    }
  }

  // MongoDB-like methods
  async findById(id) {
    await this.ensureLoaded();
    return this.data.find(item => item._id === id) || null;
  }

  async find(query = {}) {
    await this.ensureLoaded();
    if (Object.keys(query).length === 0) {
      return [...this.data];
    }

    return this.data.filter(item => {
      return Object.keys(query).every(key => {
        if (typeof query[key] === 'object' && query[key] !== null && !Array.isArray(query[key])) {
          // Support for operators like $in, $gte, etc.
          return this.matchOperators(item[key], query[key]);
        }
        return item[key] === query[key];
      });
    });
  }

  async findOne(query) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async create(data) {
    await this.ensureLoaded();
    const newItem = {
      ...data,
      _id: data._id || uuidv4(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newItem);
    await this.save();
    return newItem;
  }

  async updateById(id, updates) {
    await this.ensureLoaded();
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;

    this.data[index] = {
      ...this.data[index],
      ...updates,
      _id: id, // Prevent ID modification
      createdAt: this.data[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    await this.save();
    return this.data[index];
  }

  async deleteById(id) {
    await this.ensureLoaded();
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;

    const deleted = this.data.splice(index, 1)[0];
    await this.save();
    return deleted;
  }

  async count(query = {}) {
    const results = await this.find(query);
    return results.length;
  }

  // Helper for query operators
  matchOperators(value, operators) {
    if (operators.$in) {
      return operators.$in.includes(value);
    }
    if (operators.$gte !== undefined && operators.$lte !== undefined) {
      return value >= operators.$gte && value <= operators.$lte;
    }
    if (operators.$gte !== undefined) {
      return value >= operators.$gte;
    }
    if (operators.$lte !== undefined) {
      return value <= operators.$lte;
    }
    if (operators.$ne !== undefined) {
      return value !== operators.$ne;
    }
    if (operators.$gt !== undefined) {
      return value > operators.$gt;
    }
    if (operators.$lt !== undefined) {
      return value < operators.$lt;
    }
    return true;
  }
}

module.exports = BaseRepository;
