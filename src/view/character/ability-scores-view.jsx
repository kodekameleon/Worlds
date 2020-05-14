import {Abilities} from "../../model";
import {FeatureIds} from "../../constants";
import {messages} from "./messages";
import {Select} from "../../widgets";
import {Utils} from "../../utils";
import {Col, DragDropSite, DragHandle, DragImage, DragSource, DropTarget, Icon, PopupTip, Row} from "../../widgets";
import "./ability-scores-view.css";

export function AbilityScoresView(baseProps) {
  const editing = baseProps.viewState.editing;
  const char = baseProps.character;
  const abilitiesVariant = char.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES);
  const abilitiesVariantId = abilitiesVariant?.uniqueId;
  const pointsAvailable = abilitiesVariantId === FeatureIds.POINTS_BUY ? abilitiesVariant.getPointsRemaining() : 0;

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
        <Col class={["ability-score boxed", abilityInfo.available && abilitiesVariant && "attention"]} center>
          <DragSource canDrag={canDrag} onDragStart={onDragStart} createDragImage={createDragImage} onDragEnd={onDragEnd} draggable={editing}>
            {editing && abilitiesVariant && <DragHandle/>}
            {editing &&
              <div class={["value", abilitiesVariantId === FeatureIds.MANUAL && "editable"]}
                   on:mousedown={onMouseDownValue}
                   on:focusout={onBlurValue}
                   on:keydown={onKeyDownValue}>
                {abilitiesVariant &&
                  <>
                    <span class="ability-score-base">{abilityInfo.base}</span>
                    <span>+</span>
                    <span class="ability-score-mods">{abilityInfo.value - abilityInfo.base}</span>
                    {abilitiesVariantId === FeatureIds.MANUAL &&
                      <input type="number" min="1" max="30" maxlength="2" value={`${abilityInfo.base}`}
                      on:keydown={onKeyDownValueInput}/>
                    }
                  </>
                }
              </div>
            }
            {editing ||
              <div class="value">
                <div>{abilitiesVariant && abilityInfo.value}</div>
              </div>
            }
          </DragSource>
          {(editing || abilityInfo.available > 0 || pointsAvailable > 0) && abilitiesVariant &&
            <Col class="spinner">
              <Icon glyph="&#xe006;"
                    enabled={isStatIncreaseAvailable()}
                    on:click={() => onStatChange(+1)}/>
              <Icon glyph="&#xe005;"
                    enabled={isStateDecreaseAvailable()}
                    on:click={() => onStatChange(-1)}/>
            </Col>
          }
          <div class="hiviz ability-score-bonus">{abilitiesVariant && Utils.signed(char.bonus[props.ability])}</div>
          <label>{messages[props.ability]}</label>
          <AbilityScoreInfoPopup/>
        </Col>
      </DropTarget>
    );
    return statEl;

    function canDrag() {
      return editing;
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

    function isStatIncreaseAvailable() {
      return abilitiesVariantId === FeatureIds.POINTS_BUY && pointsAvailable > 0
        ? pointsAvailable && pointsAvailable >= abilitiesVariant.getPointBuyCost(props.ability)
        : abilityInfo.available > 0;
    }

    function isStateDecreaseAvailable() {
      return abilitiesVariantId === FeatureIds.POINTS_BUY && pointsAvailable > 0
        ? pointsAvailable && abilityInfo.base > 8
        : abilityInfo.modifiers.some(v => v.min < v.value && (editing || v.available > 0));
    }

    function onStatChange(sign) {
      if (abilitiesVariantId === FeatureIds.POINTS_BUY && pointsAvailable > 0) {
        baseProps.onBuyPoint(FeatureIds.POINTS_BUY, props.ability, sign);
      } else {
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

    function onKeyDownValueInput(ev) {
      if ((ev.target.value.length >= 2 && ev.key.length > 0 && ev.key.charCodeAt(0) >= 48 && ev.key.charCodeAt(0) <= 57)
        || ev.key === "." || ev.key === "-") {
        ev.preventDefault();
      }
    }

    function onMouseDownValue(ev) {
      if (abilitiesVariantId === FeatureIds.MANUAL) {
        statEl.querySelector("input")?.focus();
        ev.preventDefault();
      }
    }

    function onBlurValue(ev) {
      baseProps.onChangeAbilityScores(FeatureIds.MANUAL, {[props.ability]: Number.parseInt(ev.target.value)});
    }

    function onKeyDownValue(ev) {
      switch (ev.code) {
        case "Enter":
          console.log(`enter=${ev.target.value}`);
          baseProps.onChangeAbilityScores(FeatureIds.MANUAL, {[props.ability]: Number.parseInt(ev.target.value)});
          break;

        case "Escape":
          ev.target.value = char[props.ability];
          break;
      }
    }

    function AbilityScoreInfoPopup() {
      let rows;
      if (abilitiesVariantId === FeatureIds.POINTS_BUY && pointsAvailable > 0) {
        rows = [
          <div>{`${abilitiesVariant.name}: ${abilityInfo.base}`}</div>,
          <div>{`${messages["points available"]}: ${pointsAvailable}`}</div>,
          <div>{`${messages["point buy cost"]}: ${abilitiesVariant.getPointBuyCost(props.ability)}`}</div>,
          <div>{`${messages["point sell value"]}: ${abilitiesVariant.getPointSellValue(props.ability)}`}</div>
        ];
      } else {
        rows = char.features[props.ability].modifiers.reduce((res, modifier) => {
          if (modifier.min !== modifier.max) {
            res.push(<div>{`${modifier.source.name}: ${modifier.value}/${modifier.max}`}</div>);
          } else if (modifier.value !== 0) {
            res.push(<div>{`${modifier.source.name}: ${modifier.value}`}</div>);
          }
          return res;
        }, []);
      }

      return (
        <PopupTip class="ability-score-info-popup" right>
          {rows}
        </PopupTip>
      );
    }
  }

  function AbilityScoreMethodSelector() {
    const choices = char.features.getFeature(FeatureIds.BASE_ABILITY_SCORES_CHOICES).featureChoices;
    const active = char.features.getActiveFeatureChoice(FeatureIds.BASE_ABILITY_SCORES_CHOICES);
    return (
      <div class="ability-score-method-selector">
        <Row>
          <Col class={["spaced boxed", abilitiesVariant || "attention"]}>
            <Select placeholder={messages.abilityScoreMethod.placeholder}
                    selected={active?.uniqueId}
                    onChange={onChange}>
              {choices.map(v => ({id: v.uniqueId, label: v.name, tip: messages.tips.select[v.uniqueId]}))}
            </Select>
            <label>Abilities Variant</label>
          </Col>
          {abilitiesVariantId === FeatureIds.RANDOM && <div class="dice" on:click={onRoll}/>}
        </Row>
      </div>
    );

    function onChange(index, id) {
      baseProps.onActivateAbilitiesVariant(id);
    }

    function onRoll() {
      baseProps.onChangeAbilityScores(FeatureIds.RANDOM, {
        [Abilities.STRENGTH]: Utils.rollDice("3/4d6").total,
        [Abilities.DEXTERITY]: Utils.rollDice("3/4d6").total,
        [Abilities.CONSTITUTION]: Utils.rollDice("3/4d6").total,
        [Abilities.INTELLIGENCE]: Utils.rollDice("3/4d6").total,
        [Abilities.WISDOM]: Utils.rollDice("3/4d6").total,
        [Abilities.CHARISMA]: Utils.rollDice("3/4d6").total
      });
    }
  }
}

