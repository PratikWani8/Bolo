// In-memory fallback repository when MongoDB daemon is not running
const memoryStore = {
  users: [],
  schemes: [],
  conversations: [],
  knowledgeDocuments: [],
  faqs: [],
  helplines: [],
  assistedQueries: [],
};

module.exports = memoryStore;
