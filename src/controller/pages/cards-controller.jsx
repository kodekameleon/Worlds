import {RoughPaper} from "../../view/rough-paper";

export function CardsController() {
  return (
    <div id="cards-controller">
      <RoughPaper class="window-backgound"/>

      <div className="card">
        <div className="card-title">Arcane Lock</div>
        <div className="card-subtitle">2nd-level abjuration</div>
        <div className="card-field"><label>Casting time</label>1 action</div>
        <div className="card-field"><label>Range</label>Self</div>
        <div className="card-field"><label>Components</label>V, S</div>
        <div className="card-field"><label>Duration</label>Until dispelled</div>
        <div className="card-field"><label>Classes</label>Wizard</div>
        <div className="text">
          <p>You touch a closed door, window, gate, chest, or other
            entryway, and it becomes locked for the duration. You
            and the creatures you designate when you cast this
            spell can open the object normally. You can also set a
            password that, when spoken within 5 feet of the object,
            suppresses this spell for 1 minute. Otherwise, it is
            impassable until it is broken or the spell is dispelled or
            suppressed. Casting knock on the object suppresses
            arcane lock for 10 minutes.</p>
          <p>While affected by this spell, the object is more difficult
            to break or force open; the DC to break it or pick any
            locks on it increases by 10.</p>
        </div>
      </div>
    </div>);
}
