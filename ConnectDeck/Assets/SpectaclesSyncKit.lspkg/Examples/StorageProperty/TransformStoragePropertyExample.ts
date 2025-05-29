import {PropertyType} from "../../Core/PropertyType"
import {StorageProperty} from "../../Core/StorageProperty"
import {StoragePropertySet} from "../../Core/StoragePropertySet"
import {SyncEntity} from "../../Core/SyncEntity"
import {SyncKitLogger} from "../../Utils/SyncKitLogger"

// The rotation speed of the circle to move the object in
const CIRCLE_ROTATION_SPEED = 1

// The radius of the circle to move the object in
const CIRCLE_RADIUS_CM = 50

// Maximum size of the object
const MAX_SIZE = 5

@component
export class TransformStoragePropertyExample extends BaseScriptComponent {
  private readonly log: SyncKitLogger = new SyncKitLogger(
    TransformStoragePropertyExample.name
  )

  private myPropTransform = StorageProperty.forTransform(
    this,
    PropertyType.Location,
    PropertyType.Location,
    PropertyType.Location,
    // Demonstrate how to apply smoothing
    {
      interpolationTarget: -0.25,
    }
  )

  private myStoragePropertySet = new StoragePropertySet([this.myPropTransform])

  private syncEntity: SyncEntity = new SyncEntity(
    this,
    this.myStoragePropertySet,
    true
  )

  onAwake(): void {
    // Demonstrate the effect of limiting the number of sends per second
    this.myPropTransform.sendsPerSecondLimit = 3

    this.createEvent("UpdateEvent").bind(() => this.updateTransform())
  }

  private updateTransform(): void {
    if (!this.syncEntity.doIOwnStore()) {
      this.log.i("Not the syncEntity owner, not changing anything.")
      return
    }

    const angle = getTime() * CIRCLE_ROTATION_SPEED
    const x = CIRCLE_RADIUS_CM * Math.cos(angle)
    const y = CIRCLE_RADIUS_CM * Math.sin(angle)

    this.sceneObject.getTransform().setLocalPosition(new vec3(x, y, 0))

    const rotation = quat.fromEulerVec(new vec3(0, 0, angle))
    this.sceneObject.getTransform().setLocalRotation(rotation)

    const size = vec3.one().uniformScale(getTime() % MAX_SIZE)
    this.sceneObject.getTransform().setLocalScale(size)
  }
}
