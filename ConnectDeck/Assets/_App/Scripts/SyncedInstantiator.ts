import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import { SyncKitLogger } from "SpectaclesSyncKit.lspkg/Utils/SyncKitLogger"

@component
export class SyncedInstantiator extends BaseScriptComponent {
    
    private readonly log: SyncKitLogger = new SyncKitLogger
    (
        SyncedInstantiator.name
    );

    @input() instantiator: Instantiator
    @input() iceBreakerPrefab: ObjectPrefab
    
    constructor()
    {
        super();
        this.enabled = false;
    }

    public instantiateSyncedObject()
    {
        this.enabled = true;
    }

    onAwake() 
    {
        this.instantiator.notifyOnReady(() => {
            this.onInstantiatorReady();
        });
    }

    private onInstantiatorReady() : void
    {
        this.instantiator.instantiate(this.iceBreakerPrefab);
    }

    private onIceBreakerInstantiated(){
        
    }
}