import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { setMapRef, useRefLazy } from "../../../Utils/LazyRef";
import { Rect, getDivRect } from "../../../Utils/Rect";
import CardSlot, { CARD_SLOT_ID } from "./CardSlot";
import CardView, { CardRef } from "../CardView";
import { GameTableContext } from "../GameScene";
import { PocketType } from "../Model/CardEnums";
import { Card, getCard } from "../Model/GameTable";
import { CardId } from "../Model/GameUpdate";
import "./Style/PocketView.css";

export interface PocketProps {
    cards: CardId[];
    onClickCard?: (card: Card) => void;
}

export interface PocketPosition {
    getPocketRect: () => Rect | undefined;
    getCardRect: (card: CardId) => Rect | undefined;
    scrollToEnd: () => void;
}

export type PocketPositionMap = Map<PocketType, PocketPosition>;

const PocketView = forwardRef<PocketPosition, PocketProps>(({ cards, onClickCard }, ref) => {
    const table = useContext(GameTableContext);
    const pocketRef = useRef<HTMLDivElement>(null);
    const cardsEnd = useRef<HTMLDivElement>(null);
    const cardRefs = useRefLazy(() => new Map<CardId, CardRef>());

    useImperativeHandle(ref, () => ({
        getPocketRect: () => pocketRef.current ? getDivRect(pocketRef.current) : undefined,
        getCardRect: (card: CardId) => cardRefs.current.get(card)?.getRect(),
        scrollToEnd: () => cardsEnd.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    }));

    return <div ref={pocketRef} className='pocket-view'>
        { cards.map(id => {
            if (id == CARD_SLOT_ID) {
                if (table.animation && 'move_card' in table.animation) {
                    return <CardSlot ref={setMapRef(cardRefs, id)} key={id} stretch='in' duration={table.animation.move_card.duration} />
                } else {
                    return null;
                }
            } else {
                const card = getCard(table, id);
                if (card.animation && 'move_card' in card.animation) {
                    return <CardSlot ref={setMapRef(cardRefs, id)} key={id} stretch='out' duration={card.animation.move_card.duration} />
                } else {
                    return <CardView ref={setMapRef(cardRefs, id)} key={id} card={card} onClickCard={onClickCard ? () => onClickCard(card) : undefined} />
                }
            }
        }) }
        <div className="inline invisible" ref={cardsEnd} />
    </div>;
});

export default PocketView;