import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentCompleted } from 'src/domain/shipment/events/shipment-completed';
import { ShipmentDeliveredAtStop } from 'src/domain/shipment/events/shipment-delivered-at-stop';
import {
  ShipmentNotFound,
  StopAlreadyDepartedConflict,
  StopAlreadyInTransitConflict,
  StopNotFound,
  StopTypeDeliveryConflict,
} from 'src/domain/shipment/exceptions/exceptions';
import { DeliverAtStopCommand } from 'src/feature/deliver-at-stop/deliver-at-stop.command';
import { DeliverAtStopHandler } from 'src/feature/deliver-at-stop/deliver-at-stop.handler';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { ShipmentObjectMother } from '../shipment.mother';
import { StopObjectMother } from '../stop.mother';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: jest.fn(),
}));

describe('DeliverAtStopHandler', () => {
  let service: DeliverAtStopHandler;
  let shipmentRepository: jest.Mocked<ShipmentRepository>;
  let outboxMessageRepository: jest.Mocked<OutboxMessageRepository>;

  const stopObjectMother = new StopObjectMother();
  const shipmentObjectMother = new ShipmentObjectMother().withStops([
    stopObjectMother,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverAtStopHandler,
        {
          provide: ShipmentRepository,
          useValue: {
            getShipment: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: OutboxMessageRepository,
          useValue: {
            storeOutboxMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(DeliverAtStopHandler);
    shipmentRepository = module.get(ShipmentRepository);
    outboxMessageRepository = module.get(OutboxMessageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should deliver the shipment to stop successfully ', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);
    shipment.deliver = jest.fn();

    await service.execute(new DeliverAtStopCommand(stop_id, shipment_id));

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).toHaveBeenCalledWith(shipment);
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentDeliveredAtStop),
    );
  });

  it('should throw ShipmentNotFound if shipment does not exist', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(null);

    await expect(
      service.execute(new DeliverAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(ShipmentNotFound);

    expect(shipmentRepository.getShipment).toHaveBeenCalledWith(shipment_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopNotFound if stop does not exist in shipment', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;

    const stop_id = stopObjectMother.get().uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'deliver');

    await expect(
      service.execute(new DeliverAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopNotFound);

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopTypeDeliveryConflict if stop is not a delivery type', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother().withTypePickUp();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'deliver');

    await expect(
      service.execute(new DeliverAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopTypeDeliveryConflict);

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopAlreadyDepartedConflict if stop has already departed', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother()
      .withDepartStatus()
      .withTypeDelivery();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'deliver');

    await expect(
      service.execute(new DeliverAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopAlreadyDepartedConflict);

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopAlreadyInTransitConflict if stop has in transit status', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother()
      .withInTransitStatus()
      .withTypeDelivery();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'deliver');

    await expect(
      service.execute(new DeliverAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopAlreadyInTransitConflict);

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should mark shipment as complete if all stops are delivered', async () => {
    const stopMother = new StopObjectMother()
      .withTypeDelivery()
      .withArriveStatus();

    const shipment = new ShipmentObjectMother().withStops([stopMother]).get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'isComplete').mockReturnValue(true);
    jest.spyOn(shipment, 'deliver');
    jest.spyOn(shipment, 'markAsComplete');

    await service.execute(new DeliverAtStopCommand(stop_id, shipment_id));

    expect(shipment.deliver).toHaveBeenCalledWith(stop_id);
    expect(shipment.isComplete).toHaveBeenCalled();
    expect(shipment.markAsComplete).toHaveBeenCalled();
    expect(shipmentRepository.save).toHaveBeenCalledTimes(2);
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentDeliveredAtStop),
    );
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentCompleted),
    );
  });
});
