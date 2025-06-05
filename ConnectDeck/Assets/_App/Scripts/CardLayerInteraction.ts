import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractableManipulation, TransformEventArg } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation";

@component
export class CardLayerInteraction extends BaseScriptComponent {

    @input interaction: InteractableManipulation;
    @input descriptionContainer: SceneObject;

    constructor()
    {
        super();
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart()
        });
    }

    onStart() 
    {
        let dragStart = (state : TransformEventArg) => { this.onInteractableManipulateStart(); }
        let dragEnd = (state : TransformEventArg) => { this.onInteractableManipulateEnd(); }

        // this.setDescriptionContainerScale();
        this.descriptionContainer.enabled = false;
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
        print("Dragging");
        // this.setDescriptionContainerScale();
        this.descriptionContainer.enabled = true;
    }

    private onInteractableManipulateEnd()
    {
        // this.setDescriptionContainerScale();

        this.descriptionContainer.enabled = false;
    }

    
}