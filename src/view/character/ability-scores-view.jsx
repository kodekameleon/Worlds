import {Abilities} from "../../model";
import {FeatureIds} from "../../constants";
import {messages} from "./messages";
import {Select} from "../../widgets";
import {Utils} from "../../utils";
import {Col, DragDropSite, DragHandle, DragImage, DragSource, DropTarget, Icon, PopupTip} from "../../widgets";
import "./ability-scores-view.css";

export function AbilityScoresView(baseProps) {
  const editing = baseProps.viewState.editing;
  const char = baseProps.character;
  const abilitiesVariant = char.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES);
  const usingStandardArray = !!char.getFeature(FeatureIds.STANDARD_ARRAY);

  let dragOriginEl, dragOriginAbility, dragOriginAbilityScore;

  const strEl = <CharacterAbilityScore ability={Abilities.STRENGTH}/>;
  const dexEl = <CharacterAbilityScore ability={Abilities.DEXTERITY}/>;
  const conEl = <CharacterAbilityScore ability={Abilities.CONSTITUTION}/>;
  const intEl = <CharacterAbilityScore ability={Abilities.INTELLIGENCE}/>;
  const wisEl = <CharacterAbilityScore ability={Abilities.WISDOM}/>;
  const chaEl = <CharacterAbilityScore ability={Abilities.CHARISMA}/>;

  const selector = (editing || !abilitiesVariant) && AbilityScoreMethodSelector();

  const blockEl = (
    <DragDropSite class="ability-score-block">
      <Col>
        {[selector, strEl, dexEl, conEl, intEl, wisEl, chaEl]}
      </Col>
    </DragDropSite>
  );
  return blockEl;

  function CharacterAbilityScore(props) {
    const abilityInfo = char.features[props.ability];
    const statEl = (
      <DropTarget class="spaced"
        canDrop={canDrop} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <Col class={["ability-score boxed", abilityInfo.available && "attention"]} center>
          <DragSource canDrag={canDrag} onDragStart={onDragStart} createDragImage={createDragImage} onDragEnd={onDragEnd}>
            {editing && <DragHandle/>}
            {(editing && usingStandardArray) &&
              <div class="value">
                <span class="ability-score-base">{abilityInfo.base}</span>+
                <span class="ability-score-mods">{abilityInfo.value - abilityInfo.base}</span>
              </div>
            }
            {(editing && usingStandardArray) ||
              <div class="value">
                <span>{abilityInfo.value}</span>
              </div>
            }
          </DragSource>
          {(editing || abilityInfo.available > 0) &&
            <Col class="spinner">
              <Icon glyph="&#xe006;"
                    enabled={abilityInfo.available > 0}
                    on:click={() => onApplyMod(+1)}/>
              <Icon glyph="&#xe005;"
                    enabled={abilityInfo.modifiers.some(v => v.min < v.value && (editing || v.available > 0))}
                    on:click={() => onApplyMod(-1)}/>
            </Col>
          }
          <div class="hiviz ability-score-bonus">{Utils.signed(char.bonus[props.ability])}</div>
          <label>{messages[props.ability]}</label>
          <AbilityScoreInfoPopup ability={props.ability}/>
        </Col>
      </DropTarget>
    );
    return statEl;

    function canDrag() {
      return editing && usingStandardArray;
    }

    function onDragStart() {
      // Remember the element that is the origin
      dragOriginEl = statEl;
      dragOriginAbility = props.ability;
      dragOriginAbilityScore = abilityInfo.base;
    }

    function createDragImage() {
      return (
        <DragImage>
          <div class="value-container">{abilityInfo.base}</div>
        </DragImage>
      );
    }

    function onDragEnd() {
      dragOriginEl = undefined;
      dragOriginAbility = undefined;
      dragOriginAbilityScore = undefined;
    }

    function canDrop() {
      return dragOriginEl !== statEl;
    }

    function onDrop() {
      baseProps.onChangeAbilityScores(FeatureIds.STANDARD_ARRAY, {
        [props.ability]: dragOriginAbilityScore,
        [dragOriginAbility]: abilityInfo.base
      });
    }

    function onDragEnter() {
      // Get the positions of the two abilityScores being swapped, and then swap them
      const valElTop = statEl.getBoundingClientRect().top;
      const origElTop = dragOriginEl.getBoundingClientRect().top;
      statEl.querySelector(".ability-score-base").style.top = `${origElTop - valElTop}px`;
      dragOriginEl.querySelector(".ability-score-base").style.top = `${valElTop - origElTop}px`;
    }

    function onDragLeave() {
      // Reset the positions of the values
      statEl.querySelector(".ability-score-base").style.top = null;
      dragOriginEl.querySelector(".ability-score-base").style.top = null;
    }

    function onApplyMod(sign) {
      // Find the feature to apply the change to
      let mod;
      if (sign >= 0) {
        mod = abilityInfo.modifiers.find(mod => mod.available > 0);
      } else {
        mod = abilityInfo.modifiers.find(mod => (editing || mod.available > 0) && mod.min < mod.value);
      }

      // If we found a feature, apply the change
      if (mod) {
        baseProps.onApplyMod(mod.source.uniqueId, props.ability, sign);
      }
    }
  }

  function AbilityScoreInfoPopup(props) {
    const rows = char.features[props.ability].modifiers.reduce((res, modifier) => {
      if (modifier.min !== modifier.max) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}/${modifier.max}`}</div>);
      } else if (modifier.value !== 0) {
        res.push(<div>{`${modifier.source.name}: ${modifier.value}`}</div>);
      }
      return res;
    }, []);

    return (
      <PopupTip class="ability-score-info-popup" right>
        {rows}
      </PopupTip>
    );
  }

  function AbilityScoreMethodSelector() {
    const choices = char.features.getFeature(FeatureIds.BASE_ABILITY_SCORES_CHOICES).featureChoices;
    return (
      <div class="ability-score-method-selector">
        <Col class={["spaced boxed", abilitiesVariant || "attention"]}>
          <Select placeholder={messages.abilityScoreMethod.placeholder}
                  selected={null}
                  onChange={onChange}>
            {choices.map(v => ({id: v.uniqueId, label: v.name, tip: messages.tips.select[v.uniqueId]}))}
          </Select>
          <label>Abilities Variant</label>
        </Col>
      </div>
    );

    function onChange(index, id) {
      baseProps.onActivateAbilitiesVariant(id);
    }
  }
}

