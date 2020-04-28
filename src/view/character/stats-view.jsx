import {CharacterStatProp} from "../../model/character/stats";
import {messages} from "./messages";
import {Utils} from "../../utils";
import {Col, DragImage, PopupTip, Row} from "../../widgets";
import {DragHandle, DragSource, DropTarget} from "../../widgets";
import "./stats-view.css";

export function CharacterStatsView(baseProps) {
  const char = baseProps.character;
  let dragOriginEl, dragOriginStat;

  const strEl = <CharacterStat stat={CharacterStatProp.STRENGTH}/>;
  const dexEl = <CharacterStat stat={CharacterStatProp.DEXTERITY}/>;
  const conEl = <CharacterStat stat={CharacterStatProp.CONSTITUTION}/>;
  const intEl = <CharacterStat stat={CharacterStatProp.INTELLIGENCE}/>;
  const wisEl = <CharacterStat stat={CharacterStatProp.WISDOM}/>;
  const chaEl = <CharacterStat stat={CharacterStatProp.CHARISMA}/>;

  const statsEl = (
    <Col className="character-stat-block">
      {[strEl, dexEl, conEl, intEl, wisEl, chaEl]}
    </Col>
  );
  return statsEl;

  function CharacterStat(props) {
    const statInfo = char.features[props.stat];
    const statEl = (
      <DropTarget class="spaced"
        canDrop={canDrop} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <Col class={["character-stat boxed padded", statInfo.available && "attention"]} center>
          <DragSource canDrag={canDrag} onDragStart={onDragStart} createDragImage={createDragImage} onDragEnd={onDragEnd}>
            <Row class="value-container" center>
              <DragHandle/>
              <div class="value">
                <div class="value-in-motion">
                  {char[props.stat]}
                </div>
              </div>
            </Row>
          </DragSource>
          <div class="hiviz">{Utils.signed(char.bonus[props.stat])}</div>
          <label>{messages[props.stat]}</label>

          <StatInfo stat={props.stat}/>
        </Col>
      </DropTarget>
    );
    return statEl;

    function canDrag() {
      return baseProps.viewState.editing;
    }

    function onDragStart(ev) {
      // Set what is being dragged
      ev.dataTransfer.setData("drag/CharacterStat", props.stat);

      // Remember the element that is the origin
      dragOriginEl = statEl;
      dragOriginStat = props.stat;
    }

    function createDragImage() {
      return (
        <DragImage>
          <div class="value-container">{char[props.stat]}</div>
        </DragImage>
      );
    }

    function onDragEnd() {
      dragOriginEl = undefined;
    }

    function canDrop() {
      return dragOriginEl !== statEl;
    }

    function onDrop() {
      baseProps.onChangeStats({
        [props.stat]: char[dragOriginStat],
        [dragOriginStat]: char[props.stat]
      });
    }

    function onDragEnter() {
      // Get the positions of the two stats being swapped, and then swap them
      const valElTop = statEl.getBoundingClientRect().top;
      const origElTop = dragOriginEl.getBoundingClientRect().top;
      statEl.querySelector(".value-in-motion").style.top = `${origElTop - valElTop}px`;
      dragOriginEl.querySelector(".value-in-motion").style.top = `${valElTop - origElTop}px`;
    }

    function onDragLeave() {
      // Reset the positions of the values
      statEl.querySelector(".value-in-motion").style.top = null;
      dragOriginEl.querySelector(".value-in-motion").style.top = null;
    }
  }

  function StatInfo(props) {
    const rows = char.features[props.stat].modifiers.reduce((res, modifier) => {
      if (modifier.min !== modifier.max) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}/${modifier.max}`}</div>);
      } else if (modifier.value !== 0) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}`}</div>);
      }
      return res;
    }, []);

    return (
      <PopupTip class="stat-info" right>
        {rows}
      </PopupTip>
    );
  }
}

