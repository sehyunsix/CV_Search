class RecruitInfoRepository {
  async findByUrl(url) {
    throw new Error('Method not implemented');
  }

  async findAll(options = {}) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async create(recruitInfoModel) {
    throw new Error('Method not implemented');
  }

  async update(id, recruitInfoModel) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async searchByKeywords(keywords, options = {}) {
    throw new Error('Method not implemented');
  }

  async findExpired(options = {}) {
    throw new Error('Method not implemented');
  }

  async findExpiringIn(days, options = {}) {
    throw new Error('Method not implemented');
  }
}

module.exports = RecruitInfoRepository;