import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentArrivedAtStop } from 'src/domain/shipment/events/shipment-arrived-at-stop';
import {
  ShipmentNotFound,
  StopAlreadyArrivedConflict,
  StopNotFound,
  StopSequenceConflict,
} from 'src/domain/shipment/exceptions/exceptions';
import { ArriveAtStopCommand } from 'src/feature/arrive-at-stop/arrive-at-stop.command';
import { ArriveAtStopHandler } from 'src/feature/arrive-at-stop/arrive-at-stop.handler';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { ShipmentObjectMother } from '../shipment.mother';
import { StopObjectMother } from '../stop.mother';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: jest.fn(),
}));

describe('ArriveShipmentHandler', () => {
  let service: ArriveAtStopHandler;
  let shipmentRepository: jest.Mocked<ShipmentRepository>;
  let outboxMessageRepository: jest.Mocked<OutboxMessageRepository>;

  const stopObjectMother = new StopObjectMother();
  const shipmentObjectMother = new ShipmentObjectMother().withStops([
    stopObjectMother,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArriveAtStopHandler,
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

    service = module.get(ArriveAtStopHandler);
    shipmentRepository = module.get(ShipmentRepository);
    outboxMessageRepository = module.get(OutboxMessageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should arrive at the stop successfully', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);
    shipment.arrive = jest.fn();

    await service.execute(new ArriveAtStopCommand(stop_id, shipment_id));

    expect(shipment.arrive).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).toHaveBeenCalledWith(shipment);
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentArrivedAtStop),
    );
  });

  it('should throw ShipmentNotFound if shipment does not exist', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(null);

    await expect(
      service.execute(new ArriveAtStopCommand(stop_id, shipment_id)),
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

    jest.spyOn(shipment, 'arrive');

    await expect(
      service.execute(new ArriveAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopNotFound);

    expect(shipment.arrive).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopAlreadyArrivedConflict if stop has already arrived', async () => {
    const stopMotherWithArrivedStatus =
      new StopObjectMother().withArriveStatus();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'arrive');

    await expect(
      service.execute(new ArriveAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopAlreadyArrivedConflict);

    expect(shipment.arrive).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopSequenceConflict if previous stops are not departed', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother()
      .withArriveStatus()
      .withSequenceNumber(1);

    const stopMotherWithInTransitStatus = new StopObjectMother()
      .withInTransitStatus()
      .withSequenceNumber(2);

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus, stopMotherWithInTransitStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[1].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'arrive');

    await expect(
      service.execute(new ArriveAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopSequenceConflict);

    expect(shipment.arrive).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });
});
