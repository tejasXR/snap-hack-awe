import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

@component
export class ObjectForwardPositioner extends BaseScriptComponent {
    
    @input("float", "150.0")  private readonly startDistanceFromUser: number
    
    private worldCamera: WorldCameraFinderProvider

    constructor()
    {
        super();
        this.worldCamera = WorldCameraFinderProvider.getInstance();
        this.createEvent("OnStartEvent").bind(() => this.onStart());
    }

    onStart() 
    {
        this.positionInFrontOfUser();
    }

    private positionInFrontOfUser() 
    {
        const head = this.worldCamera.getTransform().getWorldPosition();
        const forward = this.worldCamera.getTransform().forward;
        const pos = forward.normalize().uniformScale(-this.startDistanceFromUser);
        
        forward.y = 0
        
        this.getTransform().setWorldPosition(head.add(pos))
        this.getTransform().setWorldRotation(quat.lookAt(pos.uniformScale(-1), vec3.up()))
    }
}
