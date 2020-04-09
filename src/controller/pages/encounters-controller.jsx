
import "./encounters-controller.css";

const MONSTER_NAME="Apprentice Wizard";
const MONSTER_TYPE="Medium humanoid (any race), any alignment";
const MONSTER_AC="10";
const MONSTER_HP=["9", "(2d8)"];
const MONSTER_SPEED="30 ft.";
const MONSTER_STATS=[
  ["STR", "10", "(+0)"],
  ["DEX", "10", "(+0)"],
  ["CON", "10", "(+0)"],
  ["INT", "14", "(+2)"],
  ["WIS", "10", "(+0)"],
  ["CHA", "11", "(+0)"]];
const MONSTER_TIDBITS=[
  ["Skills", ["Arcana +4", "History +4"]],
  ["Languages", ["any one language (usually Common)"]],
  ["Challenge", ["1/4 (50 XP)"]]
];
const MONSTER_DESCRIPTIONS=[
  {
    text: [
      <p><em><strong>Spellcasting.</strong></em> The apprentice is a 1st-level spellcaster.
      Its spellcasting ability is Intelligence (spell save DC 12, +4 to hit with spell attacks).
      It has the following wizard spells prepared:</p>,
      <p>Cantrips (at will): fire bolt, mending, prestidigitation</p>,
      <p>1st level (2 slots): burning hands, disguise self, shield</p>
    ]
  },
  {
    heading: "Actions",
    text: <p><em><strong>Club.</strong></em> <em> Melee Weapon Attack:</em> +2 to hit, reach 5 ft., one target.
      <em> Hit:</em> 2 (1d4) bludgeoning damage.</p>
  }
];

export function EncountersController() {
  return (
    <div class="encounters-controller">
      <div class="mon-stat-block">
        <div class="mon-stat-block__header">
          <div class="mon-stat-block__name">
            {MONSTER_NAME}
          </div>
          <div class="mon-stat-block__meta">{MONSTER_TYPE}</div>
        </div>
        <div class="mon-stat-block__separator">
          <img class="mon-stat-block__separator-img" alt=""
               src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"/>
        </div>
        <div class="mon-stat-block__attributes">
          <div class="mon-stat-block__attribute">
            <span class="mon-stat-block__attribute-label">Armor Class</span>
            <span class="mon-stat-block__attribute-value">
              <span class="mon-stat-block__attribute-data-value">{MONSTER_AC}</span>
            </span>
          </div>
          <div class="mon-stat-block__attribute">
            <span class="mon-stat-block__attribute-label">Hit Points</span>
            <span class="mon-stat-block__attribute-data">
              <span class="mon-stat-block__attribute-data-value">{MONSTER_HP[0]}</span>&nbsp;
              <span class="mon-stat-block__attribute-data-extra">{MONSTER_HP[1]}</span>
            </span>
          </div>
          <div class="mon-stat-block__attribute">
            <span class="mon-stat-block__attribute-label">Speed</span>
            <span class="mon-stat-block__attribute-data">
              <span class="mon-stat-block__attribute-data-value">{MONSTER_SPEED}</span>
            </span>
          </div>
        </div>
        <div class="mon-stat-block__stat-block">
          <div class="mon-stat-block__separator">
            <img class="mon-stat-block__separator-img" alt=""
                 src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"/>
          </div>
          <div class="ability-block">
            {MONSTER_STATS.map((stat) =>
              <div class="ability-block__stat">
                <div class="ability-block__heading">{stat[0]}</div>
                <div class="ability-block__data">
                  <span class="ability-block__score">{stat[1]}</span>&nbsp;
                  <span class="ability-block__modifier">{stat[2]}</span>
                </div>
              </div>
            )}
          </div>
          <div class="mon-stat-block__separator">
            <img class="mon-stat-block__separator-img" alt=""
                 src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"/>
          </div>
        </div>
        <div class="mon-stat-block__tidbits">
          {MONSTER_TIDBITS.map((tidbit) =>
            <div class="mon-stat-block__tidbit">
              <span class="mon-stat-block__tidbit-label">{tidbit[0]}</span>
              <span class="mon-stat-block__tidbit-data">
                {tidbit[1].map((tidbitItem, index, arr) =>
                  <span class="mon-stat-block__tidbit-data">
                    {`${tidbitItem}${index + 1 < arr.length ? ", " : ""}`}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        <div class="mon-stat-block__separator">
          <img class="mon-stat-block__separator-img" alt=""
               src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"/>
        </div>
        <div class="mon-stat-block__description-blocks">
          {MONSTER_DESCRIPTIONS.map((descr) =>
            <div class="mon-stat-block__description-block">
              {descr.heading && <div class="mon-stat-block__description-block-heading">{descr.heading}</div>}
              <div class="mon-stat-block__description-block-content">
                {descr.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);
}
