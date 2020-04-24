import {ActionHandler} from "../../actions/action-handler";
import {doChangeStats} from "../../actions/character-actions";
import {Icon} from "../../widgets";
import {messages} from "../messages";
import {UndoStack} from "../../actions/undo-stack";
import {
  CharacterInfoBlock,
  CharacterStatsView,
  CombatBlock,
  MeleeBlock,
  PossessionsBlock,
  ProficiencyBlock,
  SavingThrowBlock,
  SkillBlock
} from "../../view/character";
import {Col, Row} from "../../widgets/layout";
import "./character-sheet.css";

export function CharacterSheet(props) {
  const character = props.character;
  const viewState = {
    editing: false
  };
  const undoStack = new UndoStack();
  const actionHandler = new ActionHandler(character, undoStack, render);
  let rootEl;

  return render();

  function render() {
    const el = (
      <div class={["character-sheet", viewState.editing ? "editmode" : "viewmode"]}>
        <Row class="row1" center>
          <Row class="tools">
            <Icon glyph="&#xe003;" hoverEffect="crescent-moon" on:click={actionHandler.undo()} enabled={undoStack.canUndo} tip={messages.tips.undo}/>
            <Icon glyph="&#xe004;" hoverEffect="crescent-moon" on:click={actionHandler.redo()} enabled={undoStack.canRedo} tip={messages.tips.redo}/>
            <Icon class="edit-button" hoverEffect="crescent-moon" on:click={onLockClick} tip={messages.tips.lockCharacter}/>
          </Row>
          <CharacterInfoBlock character={character} viewState={viewState}/>
        </Row>
        <div class="row2">
          <Col>
            <CharacterStatsView character={character} viewState={viewState} onChangeStats={actionHandler.do(doChangeStats)}/>
          </Col>
          <Col>
            <SavingThrowBlock character={character} viewState={viewState}/>
            <SkillBlock character={character} viewState={viewState}/>
          </Col>
          <Col>
            <Row>
              <CombatBlock character={character} viewState={viewState}/>
              <MeleeBlock character={character} viewState={viewState}/>
              <ProficiencyBlock character={character} viewState={viewState}/>
              <PossessionsBlock character={character} viewState={viewState}/>
            </Row>
          </Col>
        </div>
      </div>
    );

    if (rootEl) {
      rootEl.replaceWith(el);
    }
    rootEl = el;
    return el;
  }

  function onLockClick() {
    viewState.editing = !viewState.editing;
    if (viewState.editing) {
      rootEl.classList.add("editmode");
      rootEl.classList.remove("viewmode");
    } else {
      rootEl.classList.add("viewmode");
      rootEl.classList.remove("editmode");
    }
  }
}
