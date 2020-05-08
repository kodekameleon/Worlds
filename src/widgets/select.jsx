import {PopupTip} from "./popup-tip";
import "./select.css";

export function Select(props, children) {
  /*
        {(props.selected || props.selected === 0) && (props.selections[props.selected] || props.selections.find(v => v.id === props.selected))}
  */

  let selected;
  let current = -1;

  const listEls = children.map((v, i) => (
    <li on:mousedown={() => select(i)}
        on:mouseenter={() => setCurrent(i)}
        on:mouseleave={() => onMouseLeave(i)}>
      {typeof v === "string" ? <>{v}</> : <>{v.label}{v.tip && <PopupTip right>{v.tip}</PopupTip>}</>}
    </li>
  ));

  const buttonEl = <button placeholder={props.placeholder} on:focus={open} on:blur={close} on:keydown={onKeyDown}/>;

  const selectEl = (
    <div class="select" on:mousedown={toggleOpen}>
      {buttonEl}
      <ul>{listEls}</ul>
    </div>
  );

  return selectEl;

  function onMouseLeave(i) {
    listEls[i].classList.remove("current");
  }

  function onKeyDown(ev) {
    switch(ev.code) {
      case "ArrowDown":
        open();
        setCurrent(current + 1);
        ev.preventDefault();
        break;

      case "ArrowUp":
        open();
        setCurrent(current - 1);
        ev.preventDefault();
        break;

      case "Enter":
      case "Space":
        if (isOpen()) {
          select(current);
        }
        toggleOpen();
        ev.preventDefault();
        break;

      case "Escape":
        close();
        current = -1;
        ev.preventDefault();
        break;
    }
  }

  function select(i) {
    if (i >= 0 && i < children.length) {
      selected = i;
      setButtonText();
      if (props.onChange && i >= 0) {
        props.onChange(i, getChildId(i));
      }
    }
  }

  function isOpen() {
    return selectEl.classList.contains("open");
  }

  function toggleOpen() {
    isOpen() ? close() : open();
  }

  function open() {
    if (!isOpen()) {
      if (selected >= 0) {
        listEls[selected].classList.add("current");
      }
      selectEl.classList.add("open");
    }
  }

  function close() {
    selectEl.classList.remove("open");
  }

  function setCurrent(i) {
    unhighlightAll();
    current = i;
    if (current < 0) {
      current = children.length - 1;
    } else if (current >= children.length) {
      current = 0;
    }
    listEls[current].classList.add("current");
  }

  function unhighlightAll() {
    listEls.forEach(el => el.classList.remove("current"));
    current = undefined;
  }

  function setButtonText() {
    buttonEl.innerText = selected >= 0 ? getChildText(selected) : "";
  }

  function getChildText(i) {
    if (i >= 0 && i < children.length) {
      return typeof children[i] === "string" ? children[i] : children[i].label;
    }
  }

  function getChildId(i) {
    if (i >= 0 && i < children.length) {
      return typeof children[i] === "string" ? children[i] : children[i].id;
    }
  }
}
