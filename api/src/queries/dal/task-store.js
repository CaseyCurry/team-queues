const TaskStore = (MongoClient, dbLocation, dbName) => {
  return {
    getCollection: async () => {
      // TODO: should the client be reused for multiple requests?
      const client = await MongoClient.connect(
        dbLocation,
        { useNewUrlParser: true }
      );
      const collection = client.db(dbName).collection("tasks");
      collection.close = () => {
        client.close();
      };
      return collection;
    }
  };
};

export { TaskStore };
