import {CharacterStatProp} from "../../model/character/stats";
import {messages} from "./messages";
import {Utils} from "../../utils";
import {Col, PopupTip, Row} from "../../widgets";
import {DragHandle, DropTarget} from "../../widgets";
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
          <div class="draggable" draggable={true} on:dragstart={onDragStart} on:dragend={onDragEnd}>
            <Row class="value-container" center>
              <DragHandle/>
              <div class="value">
                <div class="value-in-motion">
                  {char[props.stat]}
                </div>
              </div>
            </Row>
          </div>
          <div class="hiviz">{Utils.signed(char.bonus[props.stat])}</div>
          <label>{messages[props.stat]}</label>

          <StatInfo stat={props.stat}/>
        </Col>
      </DropTarget>
    );
    return statEl;

    function onDragStart(ev) {
      console.log("onDragStart");

      // Cancel the drag if we are not in editing mode.
      if (!baseProps.viewState.editing) {
        ev.preventDefault();
        return false;
      }

      // Set what is being dragged
      ev.dataTransfer.setData("drag/CharacterStat", props.stat);

      // Create an image to drag
      const valueElement = statEl.querySelector(".value-container");
      const vebr = valueElement.getBoundingClientRect();
      const img = (
        <div class="drag-drop-container" style={`width: ${vebr.width}px`}>
          <div class="value-container">{char[props.stat]}</div>
        </div>
      );
      valueElement.parentElement.insertBefore(img, valueElement.nextSibling);
      const iebr = img.getBoundingClientRect();
      ev.dataTransfer.setDragImage(img,
        ev.clientX - valueElement.getBoundingClientRect().left + (iebr.width - vebr.width) / 2,
        ev.clientY - valueElement.getBoundingClientRect().top + (iebr.height - vebr.height) / 2);
      setTimeout(() => img.remove());

      // Update styles to indicate a drag is in progress, and which is the source
      statsEl.classList.add("dragging");
      statEl.classList.add("drag-source");

      // Remember the element that is the origin
      dragOriginEl = statEl;
      dragOriginStat = props.stat;
    }

    function onDragEnd() {
      statsEl.classList.remove("dragging");
      statEl.classList.remove("drag-source");
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

