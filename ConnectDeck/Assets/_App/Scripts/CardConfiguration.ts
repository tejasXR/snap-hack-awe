import { BoxController } from "_App/Scripts/BoxController";
import { CardController } from "./CardController";
import { CardData } from "./CardData";

@component
export class CardConfiguration extends BaseScriptComponent {

    @input boxController: BoxController;
    @input cardDatas: CardData[];
    @input cardToConfigure: CardController;

      constructor()
    {
        super();
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });
    }

    private onStart() 
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
    }
}