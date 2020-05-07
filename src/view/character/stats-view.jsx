import {CharacterStatProp} from "../../model/character/stats";
import {FeatureIds} from "../../constants";
import {messages} from "./messages";
import {Utils} from "../../utils";
import {Col, DragDropSite, DragHandle, DragImage, DragSource, DropTarget, Icon, PopupTip} from "../../widgets";
import "./stats-view.css";

export function CharacterStatsView(baseProps) {
  const isEditing = baseProps.viewState.editing;
  const char = baseProps.character;
  const usingStandardArray = !!char.getFeature(FeatureIds.STANDARD_ARRAY);
  let dragOriginEl, dragOriginStat, dragOriginStatValue;

  const strEl = <CharacterStat stat={CharacterStatProp.STRENGTH}/>;
  const dexEl = <CharacterStat stat={CharacterStatProp.DEXTERITY}/>;
  const conEl = <CharacterStat stat={CharacterStatProp.CONSTITUTION}/>;
  const intEl = <CharacterStat stat={CharacterStatProp.INTELLIGENCE}/>;
  const wisEl = <CharacterStat stat={CharacterStatProp.WISDOM}/>;
  const chaEl = <CharacterStat stat={CharacterStatProp.CHARISMA}/>;

  const selector = isEditing && BaseStatTypeSelector();

  const statsEl = (
    <DragDropSite class="character-stat-block">
      <Col>
        {[selector, strEl, dexEl, conEl, intEl, wisEl, chaEl]}
      </Col>
    </DragDropSite>
  );
  return statsEl;

  function CharacterStat(props) {
    const statInfo = char.features[props.stat];
    const statEl = (
      <DropTarget class="spaced"
        canDrop={canDrop} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <Col class={["character-stat boxed", statInfo.available && "attention"]} center>
          <DragSource canDrag={canDrag} onDragStart={onDragStart} createDragImage={createDragImage} onDragEnd={onDragEnd}>
            {isEditing && <DragHandle/>}
            {(isEditing && usingStandardArray) &&
              <div class="value">
                <span class="stat-base">{statInfo.base}</span>+
                <span class="stat-mods">{statInfo.value - statInfo.base}</span>
              </div>
            }
            {(isEditing && usingStandardArray) ||
              <div class="value">
                <span>{statInfo.value}</span>
              </div>
            }
          </DragSource>
          {(isEditing || statInfo.available > 0) &&
            <Col class="stat-spinner">
              <Icon glyph="&#xe006;"
                    enabled={statInfo.available > 0}
                    on:click={() => onApplyMod(+1)}/>
              <Icon glyph="&#xe005;"
                    enabled={statInfo.modifiers.some(v => v.min < v.value && (isEditing || v.available > 0))}
                    on:click={() => onApplyMod(-1)}/>
            </Col>
          }
          <div class="hiviz stat-bonus">{Utils.signed(char.bonus[props.stat])}</div>
          <label>{messages[props.stat]}</label>
          <StatInfoPopup stat={props.stat}/>
        </Col>
      </DropTarget>
    );
    return statEl;

    function canDrag() {
      return isEditing && usingStandardArray;
    }

    function onDragStart() {
      // Remember the element that is the origin
      dragOriginEl = statEl;
      dragOriginStat = props.stat;
      dragOriginStatValue = statInfo.base;
    }

    function createDragImage() {
      return (
        <DragImage>
          <div class="value-container">{statInfo.base}</div>
        </DragImage>
      );
    }

    function onDragEnd() {
      dragOriginEl = undefined;
      dragOriginStat = undefined;
      dragOriginStatValue = undefined;
    }

    function canDrop() {
      return dragOriginEl !== statEl;
    }

    function onDrop() {
      baseProps.onChangeStats(FeatureIds.STANDARD_ARRAY, {
        [props.stat]: dragOriginStatValue,
        [dragOriginStat]: statInfo.base
      });
    }

    function onDragEnter() {
      // Get the positions of the two stats being swapped, and then swap them
      const valElTop = statEl.getBoundingClientRect().top;
      const origElTop = dragOriginEl.getBoundingClientRect().top;
      statEl.querySelector(".stat-base").style.top = `${origElTop - valElTop}px`;
      dragOriginEl.querySelector(".stat-base").style.top = `${valElTop - origElTop}px`;
    }

    function onDragLeave() {
      // Reset the positions of the values
      statEl.querySelector(".stat-base").style.top = null;
      dragOriginEl.querySelector(".stat-base").style.top = null;
    }

    function onApplyMod(sign) {
      // Find the feature to apply the change to
      let mod;
      if (sign >= 0) {
        mod = statInfo.modifiers.find(mod => mod.available > 0);
      } else {
        mod = statInfo.modifiers.find(mod => (isEditing || mod.available > 0) && mod.min < mod.value);
      }

      // If we found a feature, apply the change
      if (mod) {
        baseProps.onApplyMod(mod.source.uniqueId, props.stat, sign);
      }
    }
  }

  function StatInfoPopup(props) {
    const rows = char.features[props.stat].modifiers.reduce((res, modifier) => {
      if (modifier.min !== modifier.max) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}/${modifier.max}`}</div>);
      } else if (modifier.value !== 0) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}`}</div>);
      }
      return res;
    }, []);

    return (
      <PopupTip class="stat-info-popup" right>
        {rows}
      </PopupTip>
    );
  }

  function BaseStatTypeSelector() {
    return (
      <div class="stat-type-selector">
        <Col class="spaced boxed">
          <div class="drop-list">
            <button>
              Standard Scores
            </button>
            <ul>
              <li>Standard Scores</li>
              <li>Points Buy</li>
              <li>Roll</li>
              <li>Manual Entry</li>
            </ul>
          </div>
          <label>Abilities Variant</label>
        </Col>
      </div>
    );
  }
}

