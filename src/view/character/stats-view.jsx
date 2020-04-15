import {CharacterStatProp} from "../../constants";
import {DragHandle} from "../../widgets";
import {messages} from "./messages";
import {Utils} from "../../utils";
import {Col, Row} from "../../widgets/layout";

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
    const statEl = (
      <Col class="character-stat boxed padded spaced" center
           on:dragover={onDragOver} on:drop={onDrop} on:dragenter={onDragEnter} on:dragleave={onDragLeave}>
        <Row class="value-container" center draggable={true} on:dragstart={onDragStart} on:dragend={onDragEnd}>
          <DragHandle/>
          <div class="value">
            <div class="value-in-motion">
              {char[props.stat]}
            </div>
          </div>
        </Row>
        <div class="hiviz">{Utils.signed(char.bonus[props.stat])}</div>
        <label>{messages[props.stat]}</label>
      </Col>
    );
    return statEl;

    function onDragStart(ev) {
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

    function onDragOver(ev) {
      if (dragOriginEl !== statEl) {
        ev.preventDefault();
      }
    }

    function onDrop(ev) {
      statEl.classList.remove("drag-hover");
      if (dragOriginEl !== statEl) {
        ev.preventDefault();
        baseProps.onChangeStats({
          [props.stat]: char[dragOriginStat],
          [dragOriginStat]: char[props.stat]
        });
      }
    }

    function onDragEnter() {
      if (dragOriginEl !== statEl) {
        statEl.classList.add("drag-hover");

        // Get the positions of the two stats being swapped, and then swap them
        const valElTop = statEl.getBoundingClientRect().top;
        const origElTop = dragOriginEl.getBoundingClientRect().top;
        statEl.querySelector(".value-in-motion").style.top = `${origElTop - valElTop}px`;
        dragOriginEl.querySelector(".value-in-motion").style.top = `${valElTop - origElTop}px`;
      }
    }

    function onDragLeave() {
      statEl.classList.remove("drag-hover");

      // Reset the positions of the values
      statEl.querySelector(".value-in-motion").style.top = null;
      dragOriginEl.querySelector(".value-in-motion").style.top = null;
    }
  }
}

