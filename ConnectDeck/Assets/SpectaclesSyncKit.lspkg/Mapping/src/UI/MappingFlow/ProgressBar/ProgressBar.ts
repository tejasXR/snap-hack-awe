import animate, {CancelFunction} from "SpectaclesInteractionKit.lspkg/Utils/animate"
import {lerp} from "SpectaclesInteractionKit.lspkg/Utils/mathUtils"
import {SessionController} from "../../../../../Core/SessionController"
import {setAlpha} from "../../../Utils/SharedFunctions"
import {ProgressBarInput} from "./ProgressBarInput"
import {ProgressBarParametersInput} from "./ProgressBarParametersInput"

export class ProgressBar {
  private readonly rootTransform: Transform

  private readonly initialScale: vec3

  private readonly progressBarPass: Pass

  private readonly updateEvent: SceneEvent

  private scaleAnimation: CancelFunction

  private isFirstTimeMapping = true

  private delayEvent: DelayedCallbackEvent

  private mappingSession: MappingSession

  private progressAppearanceCancelFunction: CancelFunction

  private currentProgress = 0

  constructor(
    private readonly input: ProgressBarInput,
    private readonly animationParameters: ProgressBarParametersInput
  ) {
    this.rootTransform = input.root.getTransform()
    this.initialScale = this.rootTransform.getLocalScale()
    this.progressBarPass = input.progressBar.mainMaterial.mainPass
    this.setProgressBarAlpha(0)
    this.updateEvent = input.script.createEvent("UpdateEvent")
    this.updateEvent.bind(this.onUpdate)
    this.updateEvent.enabled = false
    this.input.root.enabled = false
  }

  start(): void {
    this.mappingSession = SessionController.getInstance().getMappingSession()
    this.showProgressBarInitAnimation()
    this.updateEvent.enabled = true
    this.isFirstTimeMapping = false
  }

  stop(): void {
    this.updateEvent.enabled = false
    this.delayEvent?.cancel()
    this.progressAppearanceCancelFunction?.()
    this.progressAppearanceCancelFunction = this.animateProgressToAlpha(
      1,
      0,
      this.animationParameters.fadeOutTime,
      () => (this.input.root.enabled = false)
    )
    SessionController.getInstance().getLandmarksVisual3d().enabled = false
  }

  private showProgressBarInitAnimation() {
    this.delayEvent = this.input.script.createEvent("DelayedCallbackEvent")
    this.delayEvent.bind(() => {
      this.input.root.enabled = true
      this.showProgressBarScaleAnimation()
      this.showProgressBarAlphaAnimation()
      SessionController.getInstance().getLandmarksVisual3d().enabled = true
    })
    this.delayEvent.reset(this.isFirstTimeMapping ? this.animationParameters.delayBeforeShowing : 1)
  }

  private showProgressBarAlphaAnimation() {
    this.progressAppearanceCancelFunction = this.animateProgressToAlpha(0, 1, this.animationParameters.fadeInTime)
  }

  private showProgressBarScaleAnimation() {
    this.rootTransform.setLocalScale(this.initialScale.uniformScale(this.animationParameters.minScaleCoefficient))
    let currentScale = this.rootTransform.getLocalScale()
    let targetScale = this.initialScale.uniformScale(this.animationParameters.maxScaleCoefficient)
    this.scaleAnimation = animate({
      update: (t: number) => {
        const scale = vec3.lerp(currentScale, targetScale, t)
        this.rootTransform.setLocalScale(scale)
      },
      start: 0,
      end: 1,
      duration: this.animationParameters.scalingInTime,
      ended: () => {
        currentScale = this.rootTransform.getLocalScale()
        targetScale = this.initialScale
        this.scaleAnimation = animate({
          update: (t: number) => {
            const scale = vec3.lerp(currentScale, targetScale, t)
            this.rootTransform.setLocalScale(scale)
          },
          start: 0,
          end: 1,
          duration: this.animationParameters.scalingInTime,
          easing: "ease-out-back"
        })
      }
    })
  }

  private onUpdate = () => {
    this.currentProgress = lerp(this.currentProgress, this.mappingSession.quality, 10 * getDeltaTime())
    this.input.progressBar.setBlendShapeWeight("YellowBar.001", this.currentProgress)
  }

  private animateProgressToAlpha(
    from: number,
    to: number,
    duration: number,
    onComplete: () => void = () => {}
  ): CancelFunction {
    return animate({
      update: (t: number) => {
        const currentAlpha = lerp(from, to, t)
        this.setProgressBarAlpha(currentAlpha)
      },
      start: 0,
      end: 1,
      duration: duration,
      ended: onComplete
    })
  }

  private setProgressBarAlpha(value: number) {
    setAlpha(this.input.root, value)
    this.progressBarPass.alpha = value
  }
}
