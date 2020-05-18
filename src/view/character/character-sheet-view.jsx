import {Abilities} from "../../model/character/ability-scores";
import {messages} from "./messages";
import {Utils} from "../../utils";
import {Col, Row, Table} from "../../widgets/layout";
import {CurrencyUnit, DamageProp, SkillProp} from "../../constants";
import "./character-sheet-view.css";

//TODO: BREAK THIS DOWN INTO MANAGEABLE CHUNKS

export function CharacterInfoBlock(props) {
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

export function SavingThrowBlock() {
  return (
    <Col class={"saving-throw-block boxed spaced"}>
      <SavingThrowModifier ability={Abilities.STRENGTH} value={2} proficient={false}/>
      <SavingThrowModifier ability={Abilities.DEXTERITY} value={2} proficient={false}/>
      <SavingThrowModifier ability={Abilities.CONSTITUTION} value={1} proficient={false}/>
      <SavingThrowModifier ability={Abilities.INTELLIGENCE} value={2} proficient/>
      <SavingThrowModifier ability={Abilities.WISDOM} value={2} proficient/>
      <SavingThrowModifier ability={Abilities.CHARISMA} value={-1} proficient={false}/>
      <label>Saving Throws</label>
    </Col>
  );
}

export function SkillBlock() {
  return (
    <Col class={"saving-throw-block boxed spaced"}>
      <SavingThrowModifier save={SkillProp.ACROBATICS} value={2} proficient={false} ability={Abilities.DEXTERITY}/>
      <SavingThrowModifier save={SkillProp.ANIMAL_HANDLING} value={0} proficient={false} ability={Abilities.WISDOM}/>
      <SavingThrowModifier save={SkillProp.ARCANA} value={3} proficient={true} ability={Abilities.INTELLIGENCE}/>
      <SavingThrowModifier save={SkillProp.ATHLETICS} value={2} proficient={false} ability={Abilities.STRENGTH}/>
      <SavingThrowModifier save={SkillProp.DECEPTION} value={-1} proficient={false} ability={Abilities.CHARISMA}/>
      <SavingThrowModifier save={SkillProp.HISTORY} value={3} proficient={true} ability={Abilities.INTELLIGENCE}/>
      <SavingThrowModifier save={SkillProp.INSIGHT} value={0} proficient={false} ability={Abilities.WISDOM}/>
      <SavingThrowModifier save={SkillProp.INTIMIDATION} value={1} proficient={false} ability={Abilities.CHARISMA}/>
      <SavingThrowModifier save={SkillProp.INVESTIGATION} value={3} proficient={true} ability={Abilities.INTELLIGENCE}/>
      <SavingThrowModifier save={SkillProp.MEDICINE} value={0} proficient={false} ability={Abilities.WISDOM}/>
      <SavingThrowModifier save={SkillProp.NATURE} value={3} proficient={true} ability={Abilities.INTELLIGENCE}/>
      <SavingThrowModifier save={SkillProp.PERCEPTION} value={0} proficient={false} ability={Abilities.WISDOM}/>
      <SavingThrowModifier save={SkillProp.PERFORMANCE} value={-1} proficient={false} ability={Abilities.CHARISMA}/>
      <SavingThrowModifier save={SkillProp.PERSUASION} value={-1} proficient={false} ability={Abilities.CHARISMA}/>
      <SavingThrowModifier save={SkillProp.RELIGION} value={18} proficient={true} ability={Abilities.INTELLIGENCE}/>
      <SavingThrowModifier save={SkillProp.SLEIGHT_OF_HAND} value={2} proficient={false} ability={Abilities.DEXTERITY}/>
      <SavingThrowModifier save={SkillProp.STEALTH} value={2} proficient={false} ability={Abilities.DEXTERITY}/>
      <SavingThrowModifier save={SkillProp.SURVIVAL} value={0} proficient={false} ability={Abilities.WISDOM}/>
      <label>Skill</label>
    </Col>
  );
}

export function SavingThrowModifier(props) {
  return (
    <Row class="saving-throw" baseline>
      <div class={["check", props.proficient && "checked"]}/>
      <div class="value">{Utils.signed(props.value)}</div>
      <div class="name">{messages[props.save || props.ability]}</div>
      {props.save && <div class="attr">{`(${messages.short[props.ability]})`}</div>}
    </Row>
  );
}

export function CombatBlock() {
  return (
    <Col class="combat-block">
      <Row even>
        <Col class="boxed spaced" center>
          <div class="value hiviz">12</div>
          <label>Armor Class</label>
        </Col>
        <Col class="boxed spaced" center>
          <div class="value hiviz">+2</div>
          <label>Initiative</label>
        </Col>
        <Col class="boxed spaced" center>
          <div class="value hiviz">25</div>
          <label>Speed</label>
        </Col>
      </Row>
      <Col class="current-hit-points boxed spaced" center>
        <div class="value">
          <Row class="max-value" center><div>17</div><span class="loviz"> (MAX)</span></Row>
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
          <div class="value">
            <Row class="max-value" center><div>3</div><span class="loviz"> (TOTAL)</span></Row>
            <div class="hiviz"/>
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

export function MeleeBlock() {
  return (
    <Col class="attacks-block boxed spaced">
      <Table>
        <MeleeAttack name={"Shortsword"} attackBonus={5} damage={"1d6+2"} damageType={DamageProp.PIERCING}/>
        <MeleeAttack name={"Shortsword (offhand)"} attackBonus={5} damage={"1d6"} damageType={DamageProp.PIERCING}/>
        <MeleeAttack name={"Firebolt"} attackBonus={5} damage={"1d10"} damageType={DamageProp.FIRE}/>
      </Table>
      <label>Attacks & Spellcasting</label>
    </Col>
  );
}

export function MeleeAttack(props) {
  return (
    <Row>
      <div class="name">{props.name}</div>
      <div class="bonus">{Utils.signed(props.attackBonus)}</div>
      <div class="damage-dice">{props.damage}</div>
      <div class="damage-type">{props.damageType}</div>
    </Row>
  );
}

export function ProficiencyBlock() {
  return (
    <Col class="attacks-block boxed spaced">
      <div/>
      <label>Other Proficiencies & Languages</label>
    </Col>
  );
}

export function PossessionsBlock() {
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

export function MoneyBlock(props) {
  return (
    <Col class="money-block boxed spaced">
      <div class="value">{props.amount}</div>
      <label>{props.coin}</label>
    </Col>
  );
}
