import "./NewJudge.css";
import Button from "../../../../../../shared/components/Button2/Button";
import Input from "../../../../../../shared/components/FormElements/aydi/Input";
import Overlay from "../../../../../../shared/components/aydi/overlay/Overlay";
const NewJudge = ({ closeOverlayHandler, inputHandler, addJudgeHandler }) => {
  return (
    <Overlay
      closeOverlayHandler={closeOverlayHandler}
      id="adminJudgeslistOverlay"
    >
      <div className="admin-judgeslist-form">
        <h2>Add Judge</h2>
        <Input
          label="Judge id"
          id="judgeId"
          name="judgeId"
          onInput={inputHandler}
          type="number"
          placeholder="Judge id"
        />
        <Button size="2" color="black" type="button" onClick={addJudgeHandler}>
          submit
        </Button>
      </div>
    </Overlay>
  );
};

export default NewJudge;
