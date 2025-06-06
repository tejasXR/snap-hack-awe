import { InteractableManipulation, TransformEventArg } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";
import { LSTween } from "LSTween.lspkg/LSTween";
import { Easing } from "LSTween.lspkg/TweenJS/Easing";

@component
export class CardLayerInteraction extends BaseScriptComponent {

    @input interaction: InteractableManipulation;
    @input descriptionContainer: SceneObject;
    @input("float", "400") descriptionTweenTime: number;
    @input("float", "1500") originalStateTweenTime: number;

    private originalPosition: vec3;
    private originalRotation :quat;

    constructor()
    {
        super();
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart()
        });
    }

    onStart() 
    {

        this.originalPosition = this.getTransform().getLocalPosition();
        this.originalRotation = this.getTransform().getLocalRotation();

        let dragStart = (state : TransformEventArg) => { this.onInteractableManipulateStart(); }
        let dragEnd = (state : TransformEventArg) => { this.onInteractableManipulateEnd(); }

        // this.setDescriptionContainerScale();
        // this.descriptionContainer.enabled = false;

        this.descriptionContainer.getTransform().setLocalScale(vec3.zero());

        this.interaction.onManipulationStart.add(dragStart)
        this.interaction.onManipulationEnd.add(dragEnd)
    }

    private setDescriptionContainerScale()
    {
        var newScale = new vec3(1, 1, 1);
        this.descriptionContainer.getTransform().setLocalScale(newScale);
    }

    private onInteractableManipulateStart()
    {
        // print("Dragging");
        // this.descriptionContainer.enabled = true;
        this.onAnimateDescription(true);        
    }

    private onInteractableManipulateEnd()
    {
        // this.descriptionContainer.enabled = false;
        this.onAnimateDescription(false);        
        this.onMoveBackToOriginalState();
    }

    private onAnimateDescription(animateIn:boolean)
    {
        var currentScale = this.descriptionContainer.getTransform().getLocalScale();
        
        var newScale = animateIn ? vec3.one() : vec3.zero();
        var easing = animateIn ? Easing.Back.Out : Easing.Back.In;

        LSTween.scaleToLocal
        (
            this.descriptionContainer.getTransform(),
            newScale,
            this.descriptionTweenTime
        )
        .easing(easing)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.descriptionContainer.getTransform().setLocalScale(newScale);
        });
    }

    private onMoveBackToOriginalState()
    {
        var easing = Easing.Quartic.InOut;

        LSTween.moveToLocal
        (
            this.getTransform(),
            this.originalPosition,
            this.originalStateTweenTime
        )
        .easing(easing)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.getTransform().setLocalPosition(this.originalPosition);
        });

        LSTween.rotateToLocal
        (
            this.getTransform(),
            this.originalRotation,
            this.originalStateTweenTime
        )
        .easing(easing)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.getTransform().setLocalRotation(this.originalRotation);
        });
    }
}