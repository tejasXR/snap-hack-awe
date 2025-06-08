import { BoxController } from "./BoxController";
import { CardController } from "./CardController";
import { CardData } from "./CardData";
import { MinimizedCardController } from "_App/Scripts/MinimizedCardController";
import { HeaderIceBreaker } from "./HeaderIceBreaker";
import { SyncedInstantiator } from "./SyncedInstantiator";
import { WayfinderController } from "./WayfinderController";

@component
export class CardConfiguration extends BaseScriptComponent {

    @input boxController: BoxController;
    @input cardDatas: CardData[];
    @input cardToConfigure: CardController;
    @input minmizedCardToConfigure: MinimizedCardController;
    @input wayfinderController: WayfinderController;
    @input syncedInstantiator: SyncedInstantiator;

    constructor()
    {
        super();
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    onStart() 
    {
        this.boxController.onBoxOpenedCallback = () => {
            this.onBoxOpened();
        };
    }

    private onBoxOpened()
    {
        this.configureCard();
    }

    public configureCard()
    {
        let randomNumber = Math.random() * this.cardDatas.length;
        var randomIndex = Math.floor(randomNumber);
        var randomCardData = this.cardDatas[randomIndex];

        this.cardToConfigure.setup(randomCardData);
        this.minmizedCardToConfigure.setup(randomCardData.cardName, randomCardData.cardMinimized);
        this.syncedInstantiator.setup(randomCardData.headerIceBreaker);
        this.wayfinderController.setup(randomCardData.cardName);
    }
}