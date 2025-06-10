import { useTodoDispatch } from "../App";
import Todo from "../types";

interface Props extends Todo {}

const TodoItem = (props: Props) => {
  const dispatch = useTodoDispatch();
  const onClickButton = () => {
    dispatch.onClickDelete(props.id);
  };
  return (
    <div className="todoList-box">
      <h4>{props.id}.</h4>
      <p>{props.content}</p>
      <span className="todoList-boxDelButton" onClick={onClickButton}>
        ❌
      </span>
    </div>
  );
};

export default TodoItem;
