import {Col, Row, Table} from "../../widgets/layout";
import {AttributeName, AttributeShort, CurrencyUnit, DamageType, SkillName} from "../../constants";
import {Utils} from "../../utils";

export function CharacterSheet(props) {
  const char = props.character;

  return (
    <div class="character-sheet">
      <div class="row1">
        <CharacterInfoBlock character={char}/>
      </div>
      <div class="row2">
        <Col>
          <CharacterStatBlock character={char}/>
        </Col>
        <Col>
          <SavingThrowBlock character={char}/>
          <SkillBlock character={char}/>
        </Col>
        <Col>
          <Row>
            <CombatBlock character={char}/>
            <MeleeBlock character={char}/>
            <ProficiencyBlock character={char}/>
            <PossessionsBlock character={char}/>
          </Row>
        </Col>
      </div>
    </div>
  );
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

function CharacterStatBlock(props) {
  const char = props.character;

  return (
    <Col className="character-stat-block">
      <CharacterStat name={AttributeName.STRENGTH} value={char.strength}/>
      <CharacterStat name={AttributeName.DEXTERITY} value={char.dexterity}/>
      <CharacterStat name={AttributeName.CONSTITUTION} value={char.constitution}/>
      <CharacterStat name={AttributeName.INTELLIGENCE} value={char.intelligence}/>
      <CharacterStat name={AttributeName.WISDOM} value={char.wisdom}/>
      <CharacterStat name={AttributeName.CHARISMA} value={char.charisma}/>
    </Col>
  );
}

function CharacterStat(props) {
  return (
    <Col class="character-stat boxed padded spaced" center>
      <div class="value">{props.value}</div>
      <div class="hiviz">{Utils.signed(Utils.calcStatBonus(props.value))}</div>
      <label>{props.name}</label>
    </Col>
  );
}

function SavingThrowBlock() {
  return (
    <Col className={"saving-throw-block boxed padded spaced"}>
      <SavingThrowStat name={AttributeName.STRENGTH} value={2} proficient={false}/>
      <SavingThrowStat name={AttributeName.DEXTERITY} value={2} proficient={false}/>
      <SavingThrowStat name={AttributeName.CONSTITUTION} value={1} proficient={false}/>
      <SavingThrowStat name={AttributeName.INTELLIGENCE} value={2} proficient/>
      <SavingThrowStat name={AttributeName.WISDOM} value={2} proficient/>
      <SavingThrowStat name={AttributeName.CHARISMA} value={-1} proficient={false}/>
      <label>Saving Throws</label>
    </Col>
  );
}

function SkillBlock() {
  return (
    <Col className={"saving-throw-block boxed padded spaced"}>
      <SavingThrowStat name={SkillName.ACROBATICS} value={2} proficient={false} attribute={AttributeShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.ANIMAL_HANDLING} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
      <SavingThrowStat name={SkillName.ARCANA} value={3} proficient={false} attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.ATHLETICS} value={2} proficient={false} attribute={AttributeShort.STRENGTH}/>
      <SavingThrowStat name={SkillName.DECEPTION} value={-1} proficient={false} attribute={AttributeShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.HISTORY} value={3} proficient={false} attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.INSIGHT} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
      <SavingThrowStat name={SkillName.INTIMIDATION} value={1} proficient={false} attribute={AttributeShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.INVESTIGATION} value={3} proficient={false}
                       attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.MEDICINE} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
      <SavingThrowStat name={SkillName.NATURE} value={3} proficient={false} attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.PERCEPTION} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
      <SavingThrowStat name={SkillName.PERFORMANCE} value={-1} proficient={false} attribute={AttributeShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.PERSUASION} value={-1} proficient={false} attribute={AttributeShort.CHARISMA}/>
      <SavingThrowStat name={SkillName.RELIGION} value={18} proficient={false} attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.SLEIGHT_OF_HAND} value={2} proficient={false}
                       attribute={AttributeShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.STEALTH} value={2} proficient={false} attribute={AttributeShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.SURVIVAL} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
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
