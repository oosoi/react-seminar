import {useState, useEffect} from "react";
import{v4 as uuidv4} from "uuid";
import "../styles/todostyle.css";

export const Todo = () => {

  const [list, setList] =useState([]);//todo 목록
  const[input, setInput]=useState("");//입력값
  const [selectedId, setSelectedId ]=useState("");//수정할거 선택
  const [editingText, setEditingText]=useState("");//수정 중
  



  useEffect(() => {
    const storedList = localStorage.getItem("todo");
    if (storedList) {
      setList(JSON.parse(storedList));
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) localStorage.setItem("todo", JSON.stringify(list));
  }, [list]);



  const addTodo =(todo) => {
    if(todo.length>0){
      const newTodo ={
        id:uuidv4(),
        todo:todo
      };
  
      setList([...list, newTodo]); //리스트에 새로운 거 추가 (... 은 모든 속성 가져오는거)
      setInput("");// 추가하면 택스트 창 비우기 
    }

  }

  const delTodo =(id)=> {
    const newList = list.filter((todo)=> todo.id !==id)
    //내가 완료한 id 아닌걸로만 filter 하기 

    setList(newList);//삭제한거 제외한 newList로 업데이트
  }

  const selTodo = (id) => {
    setSelectedId(id);//수정할거 id 설정
    const selectedTodo = list.find((todo)=> todo.id ===id)
    setEditingText(selectedTodo.todo);
  }

  const changeTodo =()=> {
    const newList =list.map((todo)=> 
      todo.id === selectedId ? {...todo, todo: editingText}: todo
    );
    //id가 선택되면 업데이트, 아니면 그대로 유지
    setList(newList);//리스트 업데이트
    setSelectedId("")//선택된거 초기화
    setEditingText("")//수정중인거 초기화
  };

  const clearTodos = () => {
    setList([]); // 빈 배열로 리스트 초기화
    localStorage.removeItem("todo"); // 로컬 스토리지에서도 삭제
  };


  return (
    <>
      <h1 className="todo-list-header">Todo List oosoi</h1>
  
      <input 
        type="text"
        className="todo-input"
        value={input} 
        onChange={(e)=> setInput(e.target.value)}
        placeholder="오늘 할 일은 무엇인가요 ?"/>
  
      <button className="add-button" onClick={()=> addTodo(input)}>추가하기</button>
      <button className="clear-button" onClick={()=> clearTodos()}>초기화하기</button>
      
      <ul className="todo-list">
        {list.map((todo) => (
          <li key={todo.id} className="todo-item">
            {todo.id === selectedId ? (
              <>
                <input
                  type="text"
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  placeholder="수정하세요"
                />
                <button className="save-button" onClick={() => changeTodo()}>저장</button>
              </>
            ) : (
              <>
                {todo.todo}
                <button className="edit-button" onClick ={()=> selTodo(todo.id)}>수정</button>
                <button className="complete-button" onClick={()=>delTodo(todo.id)}>완료!</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
  
};