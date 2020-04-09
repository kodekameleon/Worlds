import {Col, Row} from "../../widgets/layout";
import {CharacterStatName} from "../../constants";
import {Utils} from "../../utils";

import "./character-sheet.css";

export function CharacterStatsView(baseProps) {
  const char = baseProps.character;
  let dragOriginEl;

  const strEl = <CharacterStat name={CharacterStatName.STRENGTH} value={char.strength} bonus={char.bonus.strength}/>;
  const dexEl = <CharacterStat name={CharacterStatName.DEXTERITY} value={char.dexterity} bonus={char.bonus.dexterity}/>;
  const conEl = <CharacterStat name={CharacterStatName.CONSTITUTION} value={char.constitution} bonus={char.bonus.constitution}/>;
  const intEl = <CharacterStat name={CharacterStatName.INTELLIGENCE} value={char.intelligence} bonus={char.bonus.intelligence}/>;
  const wisEl = <CharacterStat name={CharacterStatName.WISDOM} value={char.wisdom} bonus={char.bonus.wisdom}/>;
  const chaEl = <CharacterStat name={CharacterStatName.CHARISMA} value={char.charisma} bonus={char.bonus.charisma}/>;

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
          <div class="grab-handle"/>
          <div class="value">
            <div class="value-in-motion">
              {props.value}
            </div>
          </div>
        </Row>
        <div class="hiviz">{Utils.signed(props.bonus)}</div>
        <label>{props.name}</label>
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
      ev.dataTransfer.setData("drag/CharacterStat", props.name);

      // Create an image to drag
      const valueElement = statEl.querySelector(".value-container");
      const vebr = valueElement.getBoundingClientRect();
      const img = (
        <div class="drag-drop-container" style={`width: ${vebr.width}px`}>
          <div class="value-container">{props.value}</div>
        </div>
      );
      valueElement.parentElement.insertBefore(img, valueElement.nextSibling);
      const iebr = img.getBoundingClientRect();
      console.log(iebr);
      console.log((vebr.width - iebr.width) / 2);
      console.log((vebr.height - iebr.height) / 2);
      ev.dataTransfer.setDragImage(img,
        ev.clientX - valueElement.getBoundingClientRect().left + (iebr.width - vebr.width) / 2,
        ev.clientY - valueElement.getBoundingClientRect().top + (iebr.height - vebr.height) / 2);
      setTimeout(() => img.remove());

      // Update styles to indicate a drag is in progress, and which is the source
      statsEl.classList.add("dragging");
      statEl.classList.add("drag-source");

      // Remember the element that is the origin
      dragOriginEl = statEl;
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
        const origin = ev.dataTransfer.getData("drag/CharacterStat");
        console.log(`Set stats: target: ${props.name} ${props.value}`);
        console.log(`Set stats: origin: ${origin}`);
        baseProps.onChangeStats(char, {
          [props.name.toLowerCase()]: char[origin.toLowerCase()],
          [origin.toLowerCase()]: props.value
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

