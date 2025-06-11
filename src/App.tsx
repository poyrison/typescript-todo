import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  // useState,
} from "react";
import "./App.css";
import Editor from "./component/Editor";
import Todo from "./types";
// import TodoItem from "./component/TodoItem";
import Header from "./component/Header";
import Footer from "./component/Footer";

type Action =
  | {
      type: "CREATE";
      data: {
        id: number;
        content: string;
      };
    }
  | { type: "DELETE"; id: number };
const reducer = (state: Todo[], action: Action) => {
  switch (action.type) {
    case "CREATE": {
      return [...state, action.data];
    }
    case "DELETE": {
      return state.filter((it) => it.id !== action.id);
    }
  }
};

export const TodoStateContext = React.createContext<Todo[] | null>(null);
export const TodoDispatchContext = React.createContext<{
  onClickAdd: (text: string) => void;
  onClickDelete: (id: number) => void;
} | null>(null);

export const useTodoDispatch = () => {
  const dispatch = useContext(TodoDispatchContext);
  if (!dispatch) throw new Error("TodoDispatchContext에 문제가 있다.");
  return dispatch;
};
function App() {
  const [todos, dispatch] = useReducer(reducer, []);

  const idRef = useRef(1);

  const onClickAdd = (text: string) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        content: text,
      },
    });
  };

  const onClickDelete = (id: number) => {
    dispatch({
      type: "DELETE",
      id: id,
    });
  };

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div className="App flex">
      <Header />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider value={{ onClickAdd, onClickDelete }}>
          <Editor />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
      <Footer />
    </div>
  );
}

export default App;
