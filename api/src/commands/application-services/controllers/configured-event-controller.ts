import { Express, Request, Response, NextFunction } from "express";
import { ConfiguredEventModifiedEvent } from "../../domain/events/configured-event-modified-event";
import { ConfiguredEvent } from "../../domain/aggregates/configured-event";
import { DomainEventFilter } from "../../domain/services/domain-event-filter";
import { ConfiguredEventRepository } from "../../infrastructure/mongodb/repositories/configured-event-repository";

// TODO: unit test
export class ConfiguredEventController {
  constructor(
    private app: Express,
    private domainEventFilter: DomainEventFilter,
    private configuredEventRepository: ConfiguredEventRepository
  ) {}

  public register() {
    // TODO: consider separating post and put to increase the granularity of logs
    this.app.post(
      "/api/commands/configured-events",
      async (request: Request, response: Response, next: NextFunction) => {
        let configuredEvent;
        try {
          configuredEvent = new ConfiguredEvent(request.body);
        } catch (error) {
          console.error(error);
          response.status(400).end();
          return;
        }
        try {
          const existingEvent = await this.configuredEventRepository.getByName(
            configuredEvent.name
          );
          // TODO: check etag
          await this.configuredEventRepository.createOrUpdate(configuredEvent);
          this.domainEventFilter.raise(
            new ConfiguredEventModifiedEvent(configuredEvent)
          );
          if (existingEvent) {
            response.status(200).end();
            return;
          }
          response.status(201).send({ name: configuredEvent.name });
        } catch (error) {
          next(error);
        }
      }
    );

    this.app.get(
      "/api/commands/configured-events",
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const events = await this.configuredEventRepository.getAll();
          response.status(200).send(events);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
