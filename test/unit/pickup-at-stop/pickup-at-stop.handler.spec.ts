import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentCompleted } from 'src/domain/shipment/events/shipment-completed';
import { ShipmentPickedUpFromStop } from 'src/domain/shipment/events/shipment-picked-up-from-stop';
import {
  ShipmentNotFound,
  StopAlreadyDepartedConflict,
  StopAlreadyInTransitConflict,
  StopNotFound,
  StopTypePickupConflict,
} from 'src/domain/shipment/exceptions/exceptions';
import { PickupAtStopCommand } from 'src/feature/pickup-at-stop/pickup-at-stop.command';
import { PickupAtStopHandler } from 'src/feature/pickup-at-stop/pickup-at-stop.handler';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { ShipmentObjectMother } from '../shipment.mother';
import { StopObjectMother } from '../stop.mother';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  initializeTransactionalContext: jest.fn(),
}));

describe('PickupAtStopHandler', () => {
  let service: PickupAtStopHandler;
  let shipmentRepository: jest.Mocked<ShipmentRepository>;
  let outboxMessageRepository: jest.Mocked<OutboxMessageRepository>;

  const stopObjectMother = new StopObjectMother();
  const shipmentObjectMother = new ShipmentObjectMother().withStops([
    stopObjectMother,
  ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PickupAtStopHandler,
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

    service = module.get(PickupAtStopHandler);
    shipmentRepository = module.get(ShipmentRepository);
    outboxMessageRepository = module.get(OutboxMessageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pickup the shipment from stop successfully ', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);
    shipment.pickup = jest.fn();

    await service.execute(new PickupAtStopCommand(stop_id, shipment_id));

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).toHaveBeenCalledWith(shipment);
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentPickedUpFromStop),
    );
  });

  it('should throw ShipmentNotFound if shipment does not exist', async () => {
    const shipment = shipmentObjectMother.get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(null);

    await expect(
      service.execute(new PickupAtStopCommand(stop_id, shipment_id)),
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

    jest.spyOn(shipment, 'pickup');

    await expect(
      service.execute(new PickupAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopNotFound);

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopTypePickupConflict if stop is not a delivery type', async () => {
    const stopMotherWithArrivedStatus =
      new StopObjectMother().withTypeDelivery();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'pickup');

    await expect(
      service.execute(new PickupAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopTypePickupConflict);

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopAlreadyDepartedConflict if stop has already departed', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother()
      .withDepartStatus()
      .withTypePickUp();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'pickup');

    await expect(
      service.execute(new PickupAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopAlreadyDepartedConflict);

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should throw StopAlreadyInTransitConflict if stop has in transit status', async () => {
    const stopMotherWithArrivedStatus = new StopObjectMother()
      .withInTransitStatus()
      .withTypePickUp();

    const shipment = new ShipmentObjectMother()
      .withStops([stopMotherWithArrivedStatus])
      .get();

    const shipment_id = shipment.uuid;

    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'pickup');

    await expect(
      service.execute(new PickupAtStopCommand(stop_id, shipment_id)),
    ).rejects.toThrow(StopAlreadyInTransitConflict);

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipmentRepository.save).not.toHaveBeenCalled();
    expect(outboxMessageRepository.storeOutboxMessage).not.toHaveBeenCalled();
  });

  it('should mark shipment as complete if all stops are delivered', async () => {
    const stopMother = new StopObjectMother()
      .withTypePickUp()
      .withArriveStatus();

    const shipment = new ShipmentObjectMother().withStops([stopMother]).get();
    const shipment_id = shipment.uuid;
    const stop_id = shipment.stops[0].uuid;

    shipmentRepository.getShipment.mockResolvedValue(shipment);

    jest.spyOn(shipment, 'isComplete').mockReturnValue(true);
    jest.spyOn(shipment, 'pickup');
    jest.spyOn(shipment, 'markAsComplete');

    await service.execute(new PickupAtStopCommand(stop_id, shipment_id));

    expect(shipment.pickup).toHaveBeenCalledWith(stop_id);
    expect(shipment.isComplete).toHaveBeenCalled();
    expect(shipment.markAsComplete).toHaveBeenCalled();
    expect(shipmentRepository.save).toHaveBeenCalledTimes(2);
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentPickedUpFromStop),
    );
    expect(outboxMessageRepository.storeOutboxMessage).toHaveBeenCalledWith(
      expect.any(ShipmentCompleted),
    );
  });
});
