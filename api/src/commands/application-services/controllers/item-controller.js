const ItemController = (app, itemRepository) => {
  return {
    register: () => {
      app.get("/api/commands/items", async (request, response) => {
        try {
          const items = await itemRepository.getAll();
          response.status(200)
            .send(items);
        } catch (error) {
          console.error(error);
          response.status(500)
            .send(process.env.DEV ? error : "An error occurred");
        }
      });
    }
  };
};

export { ItemController };