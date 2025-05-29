import animate, {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {lerp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import StateMachine from "SpectaclesInteractionKit.lspkg/Utils/StateMachine"
import {SessionController} from "../../../../Core/SessionController"
import {MAPPING_DONE_CUSTOM_LANDMARK, MAPPING_DONE_P1, MAPPING_DONE_P2} from "../../Texts/TextValues"
import {ProjectContainer} from "../../Utils/ProjectContainer"
import {setAlpha} from "../../Utils/SharedFunctions"
import {BufferState} from "../BufferState/BufferState"
import {MappingSuccessfulStateInput} from "./MappingSuccessfulStateInput"

const TICK_ANIMATION_NAME = "Tick"

export class MappingSuccessfulState {
  private readonly fadeInTextDuration: number = 0.3

  private readonly fadeOutTextDuration: number = 1

  private readonly showingObjectDuration: number = 3

  private readonly audioComponent: AudioComponent

  private readonly tickPass: Pass

  private alphaTweenCancelFunction: CancelFunction

  private delayEvent: DelayedCallbackEvent

  private tickAnimation: AnimationPlayer

  constructor(
    private readonly input: MappingSuccessfulStateInput,
    private readonly stateMachine: StateMachine,
    private readonly projectContainer: ProjectContainer
  ) {
    input.mappingSuccessfullyDoneText.text = MAPPING_DONE_P1
    this.audioComponent = input.script.getSceneObject().createComponent("Component.AudioComponent") as AudioComponent
    this.tickPass = this.input.tickMeshVisual.mainMaterial.mainPass
    this.setAlpha(0)
    this.input.root.enabled = false
    this.tickAnimation = this.input.tickAnimation
  }

  getMappingSuccessfulText(): string {
    if (SessionController.getInstance().getCustomLandmark() !== null) {
      return MAPPING_DONE_CUSTOM_LANDMARK
    } else if (SessionController.getInstance().getIsUserMapper()) {
      return MAPPING_DONE_P1
    } else {
      return MAPPING_DONE_P2
    }
  }

  enter(): void {
    this.input.root.enabled = true
    this.tickAnimation.enabled = false
    this.input.mappingSuccessfullyDoneText.text = this.getMappingSuccessfulText()
    this.setAlpha(0)
    this.alphaTweenCancelFunction = this.animateToAlpha(0, 1, this.fadeInTextDuration, () => {
      this.delayEvent = this.input.script.createEvent("DelayedCallbackEvent")
      this.delayEvent.bind(() => {
        this.alphaTweenCancelFunction = this.animateToAlpha(1, 0, this.fadeOutTextDuration, () =>
          this.stateMachine.enterState(BufferState.name)
        )
      })
      this.delayEvent.reset(this.showingObjectDuration)
    })
    this.tickAnimation.enabled = true
    this.tickAnimation.playClip(TICK_ANIMATION_NAME)
    this.audioComponent.audioTrack = this.input.successAudioTrack
    this.audioComponent.play(1)

    this.projectContainer.mappingDone()
  }

  exit(): void {
    this.alphaTweenCancelFunction?.()
    this.delayEvent?.cancel()
    this.setAlpha(0)
    this.input.root.enabled = false
  }

  private animateToAlpha(
    from: number,
    to: number,
    duration: number,
    onComplete: () => void = () => {}
  ): CancelFunction {
    return animate({
      update: (t: number) => {
        const currentAlpha = lerp(from, to, t)
        this.setAlpha(currentAlpha)
      },
      start: 0,
      end: 1,
      duration: duration,
      ended: onComplete
    })
  }

  private setAlpha(value: number) {
    setAlpha(this.input.root, value)
    this.tickPass.alpha = value
  }
}
