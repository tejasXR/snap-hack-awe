import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"

@component
export class ObjectForwardPositioner extends BaseScriptComponent {
    
    @input private readonly additiveVectorPosition: vec3;
    
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
        const right = this.worldCamera.getTransform().right;
        const up = this.worldCamera.getTransform().up;


        const normalizedX = right.normalize().uniformScale(-this.additiveVectorPosition.x).x;
        const normalizedY = up.normalize().uniformScale(this.additiveVectorPosition.y).y;
        const normalizedZ = forward.normalize().uniformScale(-this.additiveVectorPosition.z).z;

        var position = new vec3(normalizedX, normalizedY, normalizedZ);
        
        forward.y = 0
        
        this.getTransform().setWorldPosition(head.add(position))
        // this.getTransform().setWorldRotation(quat.lookAt(position.uniformScale(-1), vec3.up()))
    }
}
