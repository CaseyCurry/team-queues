const event = {
  name: 'coffee-ordered',
  version: 1,
  coffee: {
    type: 'cappuccino',
    size: 'large',
    price: '3.95',
    temperature: 'hot'
  }
};

const configuredEvent = {
  name: 'coffee-ordered',
  versions: [{
    number: 1,
    adapter: 'return { type: event.coffee.type };'
  }]
};

const adapt = () => {
  const adapter = new Function('event', configuredEvent.versions[0].adapter);
  const context = adapter(event);
  console.log(context);
};

module.exports = adapt();