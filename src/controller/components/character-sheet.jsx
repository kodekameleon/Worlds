import {Col, Row, Table} from "../../widgets/layout";
import {CharacterStatName, CharacterStatShort, CurrencyUnit, DamageType, SkillName} from "../../constants";
import {Utils} from "../../utils";

function doChangeStats(character, stats) {
  console.log(stats);
  for (const stat in stats) {
    console.log(stat);
  }
}

export function CharacterSheet(props) {
  const char = props.character;
  const viewState = {
    editing: false
  };
  const rootElement = {};

  return (
    <div ref={rootElement} class="character-sheet viewmode">
      <Row class="row1" center>
        <div class="icon crescent-moon edit-button" on:click={onLockClick}/>
        <CharacterInfoBlock character={char} viewState={viewState}/>
      </Row>
      <div class="row2">
        <Col>
          <CharacterStatBlock character={char} viewState={viewState} onChangeStats={doChangeStats}/>
        </Col>
        <Col>
          <SavingThrowBlock character={char} viewState={viewState}/>
          <SkillBlock character={char} viewState={viewState}/>
        </Col>
        <Col>
          <Row>
            <CombatBlock character={char} viewState={viewState}/>
            <MeleeBlock character={char} viewState={viewState}/>
            <ProficiencyBlock character={char} viewState={viewState}/>
            <PossessionsBlock character={char} viewState={viewState}/>
          </Row>
        </Col>
      </div>
    </div>
  );

  function onLockClick() {
    viewState.editing = !viewState.editing;
    if (viewState.editing) {
      rootElement.element.classList.add("editmode");
      rootElement.element.classList.remove("viewmode");
    } else {
      rootElement.element.classList.add("viewmode");
      rootElement.element.classList.remove("editmode");
    }
  }
}

function CharacterInfoBlock(props) {
  const char = props.character;

  return (
    <Row class="character-info-block" center>
      <div class="hiviz">{char.name}</div>
      <div class="details">
        <Row even>
          <Col class="character-detail">
            <Row>
              <div>{char.class}</div>&nbsp;<div>{char.level}</div>
            </Row>
            <label>Class and Level</label>
          </Col>
          <Col class="character-detail">
            <div>{char.background}</div>
            <label>Background</label>
          </Col>
          <Col class="character-detail">
            <div>{char.player}</div>
            <label>Player Name</label>
          </Col>
        </Row>
        <Row even>
          <Col class="character-detail">
            <div>{char.race}</div>
            <label>Race</label>
          </Col>
          <Col class="character-detail">
            <div>{char.alignment}</div>
            <label>Alignment</label>
          </Col>
          <Col class="character-detail">
            <div>{char.xp}</div>
            <label>Experience Points</label>
          </Col>
        </Row>
      </div>
    </Row>
  );
}

function CharacterStatBlock(baseProps) {
  const char = baseProps.character;
  const statBlockElement = {};
  let dragOriginElement;

  return (
    <Col className="character-stat-block" ref={statBlockElement}>
      <CharacterStat name={CharacterStatName.STRENGTH} value={char.strength} bonus={char.bonus.strength}/>
      <CharacterStat name={CharacterStatName.DEXTERITY} value={char.dexterity} bonus={char.bonus.dexterity}/>
      <CharacterStat name={CharacterStatName.CONSTITUTION} value={char.constitution} bonus={char.bonus.constitution}/>
      <CharacterStat name={CharacterStatName.INTELLIGENCE} value={char.intelligence} bonus={char.bonus.intelligence}/>
      <CharacterStat name={CharacterStatName.WISDOM} value={char.wisdom} bonus={char.bonus.wisdom}/>
      <CharacterStat name={CharacterStatName.CHARISMA} value={char.charisma} bonus={char.bonus.charisma}/>
    </Col>
  );

  function CharacterStat(props) {
    const statElement = {};

    return (
      <Col class="character-stat boxed padded spaced" center ref={statElement}
           on:dragover={onDragOver} on:drop={onDrop} on:dragenter={onDragEnter} on:dragleave={onDragLeave}>
        <Row class="value-container" center draggable={true} on:dragstart={onDragStart} on:dragend={onDragEnd}>
          <div class="grab-handle"/>
          <div class="value">{props.value}</div>
        </Row>
        <div class="hiviz">{Utils.signed(props.bonus)}</div>
        <label>{props.name}</label>
      </Col>
    );

    function onDragStart(ev) {
      // Cancel the drag if we are not in editing mode.
      if (!baseProps.viewState.editing) {
        ev.preventDefault();
        return false;
      }

      // Set what is being dragged
      ev.dataTransfer.setData("drag/CharacterStat", props.name);

      // Create an image to drag
      const valueElement = statElement.element.querySelector(".value-container");
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
      statBlockElement.element.classList.add("dragging");
      statElement.element.classList.add("drag-source");

      // Remember the element that is the origin
      dragOriginElement = statElement;
    }

    function onDragEnd() {
      statBlockElement.element.classList.remove("dragging");
      statElement.element.classList.remove("drag-source");
      dragOriginElement = undefined;
    }

    function onDragOver(ev) {
      if (dragOriginElement !== statElement) {
        ev.preventDefault();
      }
    }

    function onDrop(ev) {
      statElement.element.classList.remove("drag-hover");
      if (dragOriginElement !== statElement) {
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
      statElement.element.classList.add("drag-hover");
    }

    function onDragLeave() {
      statElement.element.classList.remove("drag-hover");
    }
  }
}

function SavingThrowBlock() {
  return (
    <Col className={"saving-throw-block boxed padded spaced"}>
      <SavingThrowStat name={CharacterStatName.STRENGTH} value={2} proficient={false}/>
      <SavingThrowStat name={CharacterStatName.DEXTERITY} value={2} proficient={false}/>
      <SavingThrowStat name={CharacterStatName.CONSTITUTION} value={1} proficient={false}/>
      <SavingThrowStat name={CharacterStatName.INTELLIGENCE} value={2} proficient/>
      <SavingThrowStat name={CharacterStatName.WISDOM} value={2} proficient/>
      <SavingThrowStat name={CharacterStatName.CHARISMA} value={-1} proficient={false}/>
      <label>Saving Throws</label>
    </Col>
  );
}

function SkillBlock() {
  return (
    <Col className={"saving-throw-block boxed padded spaced"}>
      <SavingThrowStat name={SkillName.ACROBATICS} value={2} proficient={false} attribute={CharacterStatShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.ANIMAL_HANDLING} value={0} proficient={false} attribute={CharacterStatShort.WISDOM}/>
      <SavingThrowStat name={SkillName.ARCANA} value={3} proficient={false} attribute={CharacterStatShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.ATHLETICS} value={2} proficient={false} attribute={CharacterStatShort.STRENGTH}/>
      <SavingThrowStat name={SkillName.DECEPTION} value={-1} proficient={false} attribute={CharacterStatShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.HISTORY} value={3} proficient={false} attribute={CharacterStatShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.INSIGHT} value={0} proficient={false} attribute={CharacterStatShort.WISDOM}/>
      <SavingThrowStat name={SkillName.INTIMIDATION} value={1} proficient={false} attribute={CharacterStatShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.INVESTIGATION} value={3} proficient={false}
                       attribute={CharacterStatShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.MEDICINE} value={0} proficient={false} attribute={CharacterStatShort.WISDOM}/>
      <SavingThrowStat name={SkillName.NATURE} value={3} proficient={false} attribute={CharacterStatShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.PERCEPTION} value={0} proficient={false} attribute={CharacterStatShort.WISDOM}/>
      <SavingThrowStat name={SkillName.PERFORMANCE} value={-1} proficient={false} attribute={CharacterStatShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.PERSUASION} value={-1} proficient={false} attribute={CharacterStatShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.RELIGION} value={18} proficient={false} attribute={CharacterStatShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.SLEIGHT_OF_HAND} value={2} proficient={false}
                       attribute={CharacterStatShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.STEALTH} value={2} proficient={false} attribute={CharacterStatShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.SURVIVAL} value={0} proficient={false} attribute={CharacterStatShort.WISDOM}/>
      <label>Skill</label>
    </Col>
  );
}

function SavingThrowStat(props) {
  return (
    <Row class="saving-throw-stat" baseline>
      <div class={["check", props.proficient && "checked"]}/>
      <div class="value">{Utils.signed(props.value)}</div>
      <div class="name">{props.name}</div>
      {props.attribute && <div class="attr">{`(${props.attribute})`}</div>}
    </Row>
  );
}

function CombatBlock() {
  return (
    <Col class="combat-block">
      <Row even>
        <Col class="boxed spaced" center>
          <div class="value hiviz">12</div>
          <label>Armor Class</label>
        </Col>
        <Col class="boxed spaced" center>
          <div className="value hiviz">+2</div>
          <label>Initiative</label>
        </Col>
        <Col class="boxed spaced" center>
          <div className="value hiviz">25</div>
          <label>Speed</label>
        </Col>
      </Row>
      <Col class="current-hit-points boxed spaced" center>
        <div class="value">
          <Row className="max-value" center><div>17</div><span className="loviz"> (MAX)</span></Row>
          <div class="hiviz"/>
        </div>
        <label>Current Hit Points</label>
      </Col>
      <Col class="temporary-hit-points boxed spaced" center>
        <div class="value hiviz"/>
        <label>Temporary Hit Points</label>
      </Col>
      <Row even>
        <Col class="current-hit-dice boxed spaced" center>
          <div className="value">
            <Row className="max-value" center><div>3</div><span className="loviz"> (TOTAL)</span></Row>
            <div className="hiviz"/>
          </div>
          <label>Hit Dice</label>
        </Col>
        <Col class="death-saves boxed spaced" right>
          <Row center><span class={"label"}>SUCCESSES&nbsp;</span><span class={"boxes"}>&#9744;&#9744;&#9744;</span></Row>
          <Row center><span class={"label"}>FAILURES&nbsp;</span><span class={"boxes"}>&#9744;&#9744;&#9744;</span></Row>
          <label>Death Saves</label>
        </Col>
      </Row>
    </Col>
  );
}

function MeleeBlock() {
  return (
    <Col class="attacks-block boxed spaced">
      <Table>
        <MeleeAttack name={"Shortsword"} attackBonus={5} damage={"1d6+2"} damageType={DamageType.PIERCING}/>
        <MeleeAttack name={"Shortsword (offhand)"} attackBonus={5} damage={"1d6"} damageType={DamageType.PIERCING}/>
        <MeleeAttack name={"Firebolt"} attackBonus={5} damage={"1d10"} damageType={DamageType.FIRE}/>
      </Table>
      <label>Attacks & Spellcasting</label>
    </Col>
  );
}

function MeleeAttack(props) {
  return (
    <Row>
      <div class="name">{props.name}</div>
      <div class="bonus">{Utils.signed(props.attackBonus)}</div>
      <div class="damage-dice">{props.damage}</div>
      <div class="damage-type">{props.damageType}</div>
    </Row>
  );
}

function ProficiencyBlock() {
  return (
    <Col class="attacks-block boxed spaced">
      <div/>
      <label>Other Proficiencies & Languages</label>
    </Col>
  );
}

function PossessionsBlock() {
  return (
    <Col class="attacks-block boxed spaced">
      <div>
        <Row even>
          <MoneyBlock coin={CurrencyUnit.PP} amount={1028}/>
          <MoneyBlock coin={CurrencyUnit.GP} amount={57}/>
          <MoneyBlock coin={CurrencyUnit.SP} amount={42}/>
          <MoneyBlock coin={CurrencyUnit.CP} amount={53}/>
        </Row>
      </div>
      <label>Possessions</label>
    </Col>
  );
}

function MoneyBlock(props) {
  return (
    <Col class="money-block boxed spaced">
      <div className="value">{props.amount}</div>
      <label>{props.coin}</label>
    </Col>
  );
}
