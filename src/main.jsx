import * as Start from "./handler.js";

// eslint-disable-next-line
import {X} from "./x-ui";

// eslint-disable-next-line
import {minjsx} from "./minjsx/minjsx";

window.addEventListener("load", Start.start);

window.addEventListener("load", () => {
  console.log("starting");

  const logo = (
    <div class="logo">
      <div class="logo-triangle"></div>
      <div>
        <div class="logo-image">
          <div></div>
        </div>
        <X class="logo-text">
          <div>WORLĐS</div>
          <div>BY KOĐEKAMELEON</div>
        </X>
      </div>
    </div>
  );

  document.body.appendChild(logo);
});

// var o = <X class="cssclass" a1={"a1"} a2={"a2"}><Y><Q>s</Q></Y><Z></Z></X>;
// var p = <div></div>;
