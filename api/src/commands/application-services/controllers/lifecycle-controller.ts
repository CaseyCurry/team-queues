import validate from "uuid-validate";
import { Express, Request, Response, NextFunction } from "express";
import { Lifecycle } from "../../domain/aggregates/lifecycle";
import { LifecycleRepository } from "../../infrastructure/mongodb/repositories/lifecycle-repository";
import { DomainEventFilter } from "../../domain/services/domain-event-filter";

// TODO: unit test
export class LifecycleController {
  constructor(
    private app: Express,
    private domainEventFilter: DomainEventFilter,
    private lifecycleRepository: LifecycleRepository
  ) {}

  public register() {
    // TODO: look at Bunyan's integration with restify
    this.app.post(
      "/api/commands/lifecycles/:id/versions/next",
      async (request: Request, response: Response, next: NextFunction) => {
        if (!validate(request.params.id)) {
          throw new Error("The id must have a value and must be a v4 uuid");
        }
        let lifecycle;
        try {
          lifecycle = await this.lifecycleRepository.getById(request.params.id);
        } catch (error) {
          next(error);
        }
        if (!lifecycle) {
          try {
            lifecycle = new Lifecycle({
              id: request.params.id,
              lifecycleOf: request.body.lifecycleOf
            });
          } catch (error) {
            console.warn(error);
            response.status(400).end();
            return;
          }
        }
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: use 412 for concurrency issues
          // TODO: confirm all events have been configured
          lifecycle.updateNextVersion(request.body.nextVersion);
          await this.lifecycleRepository.createOrUpdate(lifecycle);
          response.status(201).send(lifecycle.nextVersion!.number.toString());
        } catch (error) {
          next(error);
        }
      }
    );

    this.app.get(
      "/api/commands/lifecycles",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const events = await this.lifecycleRepository.getAll();
          response.status(200).send(events);
        } catch (error) {
          next(error);
        }
      }
    );

    this.app.post(
      "/api/commands/lifecycles/:id/versions/active",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          // TODO: What needs to be checked to handle versioning and concurrency?
          // TODO: re-version potentially orphaned items
          const lifecycle = await this.lifecycleRepository.getById(
            request.params.id
          );
          if (!lifecycle) {
            response.status(404).end();
            return;
          }
          lifecycle.activateNextVersion();
          await this.lifecycleRepository.createOrUpdate(lifecycle);
          this.domainEventFilter.raise(lifecycle.domainEvents.raisedEvents);
          response.status(201).send(lifecycle.activeVersion!.number.toString());
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
