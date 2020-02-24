import {Col, Row} from "../../widgets/layout";
import {AttributeName, AttributeShort, SkillName} from "../../constants";
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
            <AttacksBlock character={char}/>
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
          <Col>
            <Row>
              <div>{char.class}</div>
              <div>{char.level}</div>
            </Row>
            <label>Class and Level</label>
          </Col>
          <Col>
            <div>{char.background}</div>
            <label>Background</label>
          </Col>
          <Col>
            <div>{char.player}</div>
            <label>Player Name</label>
          </Col>
        </Row>
        <Row even>
          <Col>
            <div>{char.race}</div>
            <label>Race</label>
          </Col>
          <Col>
            <div>{char.alignment}</div>
            <label>Alignment</label>
          </Col>
          <Col>
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
    <div className="character-stat-block">
      <CharacterStat name={AttributeName.STRENGTH} value={char.strength}/>
      <CharacterStat name={AttributeName.DEXTERITY} value={char.dexterity}/>
      <CharacterStat name={AttributeName.CONSTITUTION} value={char.constitution}/>
      <CharacterStat name={AttributeName.INTELLIGENCE} value={char.intelligence}/>
      <CharacterStat name={AttributeName.WISDOM} value={char.wisdom}/>
      <CharacterStat name={AttributeName.CHARISMA} value={char.charisma}/>
    </div>
  );
}
function CharacterStat(props) {
  return (
    <Col class="character-stat" center>
      <div class="value">{props.value}</div>
      <div class="hiviz">{Utils.prefixSign(Utils.calcStatBonus(props.value))}</div>
      <label>{props.name}</label>
    </Col>
  );
}


function SavingThrowBlock() {
  return (
    <div className={"saving-throw-block"}>
      <SavingThrowStat name={AttributeName.STRENGTH} value={2} proficient={false}/>
      <SavingThrowStat name={AttributeName.DEXTERITY} value={2} proficient={false}/>
      <SavingThrowStat name={AttributeName.CONSTITUTION} value={1} proficient={false}/>
      <SavingThrowStat name={AttributeName.INTELLIGENCE} value={2} proficient/>
      <SavingThrowStat name={AttributeName.WISDOM} value={2} proficient/>
      <SavingThrowStat name={AttributeName.CHARISMA} value={-1} proficient={false}/>
      <label className="center">Saving Throws</label>
    </div>
  );
}

function SkillBlock() {
  return (
    <div className={"saving-throw-block"}>
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
      <SavingThrowStat name={SkillName.RELIGION} value={3} proficient={false} attribute={AttributeShort.INTELLIGENCE}/>
      <SavingThrowStat name={SkillName.SLEIGHT_OF_HAND} value={2} proficient={false}
                       attribute={AttributeShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.STEALTH} value={2} proficient={false} attribute={AttributeShort.DEXTERITY}/>
      <SavingThrowStat name={SkillName.SURVIVAL} value={0} proficient={false} attribute={AttributeShort.WISDOM}/>
      <label className="center">Skill</label>
    </div>
  );
}

function SavingThrowStat(props) {
  return (
    <div class="saving-throw-stat">
      <div class="value" addClass={props.proficient && "proficient"}>{Utils.prefixSign(props.value)}</div>
      <div class="name">{props.name}</div>
      {props.attribute && <div class="attr">{`(${props.attribute})`}</div>}
    </div>
  );
}

function CombatBlock() {
  return (
    <Col class="combat-block">
      <Row even>
        <Col center>
          <div class="hiviz">12</div>
          <label>Armor Class</label>
        </Col>
        <Col center>
          <div className="hiviz">+2</div>
          <label>Initiative</label>
        </Col>
        <Col center>
          <div className="hiviz">25</div>
          <label>Speed</label>
        </Col>
      </Row>
      <div>
        <div>17 <span class="loviz">(MAX)</span></div>
        <label>Current Hit Points</label>
      </div>
      <div>
        <label>Temporary Hit Points</label>
      </div>
      <Row even>
        <div>
          <div>3 <span class="loviz">(TOTAL)</span></div>
          <label>Hit Dice</label>
        </div>
        <Col class={"death-saves"}>
          <div><span class={"label"}>SUCCESSES</span><span class={"boxes"}> &#9744;&#9744;&#9744;</span></div>
          <div><span class={"label"}>FAILURES</span><span class={"boxes"}> &#9744;&#9744;&#9744;</span></div>
          <label>Death Saves</label>
        </Col>
      </Row>
    </Col>
  );
}

function AttacksBlock() {
  return (
    <Col>
      <label>Attacks & Spellcasting</label>
    </Col>
  );
}
