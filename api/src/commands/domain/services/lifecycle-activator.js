const LifecycleActivator = class {
  constructor(lifecycleRepository, domainEvents) {
    this.lifecycleRepository = lifecycleRepository;
    this.domainEvents = domainEvents;
  }

  async activate(lifecycle) {
    // TODO: multi-phase commit
    lifecycle.activate();
    const currentlyActiveLifecycle = await this.lifecycleRepository
      .getActive(lifecycle.lifecycleOf);
    if (currentlyActiveLifecycle) {
      currentlyActiveLifecycle.deactivate();
      await this.lifecycleRepository.update(currentlyActiveLifecycle);
      this.domainEvents.raise(currentlyActiveLifecycle.domainEvents.raisedEvents);
    }
    await this.lifecycleRepository.update(lifecycle);
    this.domainEvents.raise(lifecycle.domainEvents.raisedEvents);
  }
};

export { LifecycleActivator };
