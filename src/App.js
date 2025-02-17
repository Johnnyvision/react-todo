import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./lexmeet.png";

function App() {
  if (localStorage.getItem("count") == null) {
    localStorage.setItem("count", 0);
  }

  let [count, setCount] = useState(JSON.parse(localStorage.getItem("count")));
  let [lists, setLists] = useState([]);

  useEffect(() => {
    let storedLists = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let keyValue = localStorage.getItem(localStorage.key(i))
      if (key !== "count" && keyValue !== "true" && keyValue !== "false") {
        storedLists.push({
          id: key,
          name: localStorage.getItem(key),
          completed: localStorage.getItem(`done_${key}`) === "true",
        });
      }
    }
    setLists(storedLists);
  }, []);

  function submitPlan(event) {
    event.preventDefault();
    const query = event.target.searchValue.value;

    if (query.toLowerCase() === "true" || query.toLowerCase() === "false") {
      alert("That word is not allowed.");
      return;
    }

    let newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("count", newCount);
    localStorage.setItem(newCount, query);

    setLists([...lists, { id: newCount, name: query, completed: false }]);
  }

  function deleteFunction(id) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      localStorage.removeItem(id);
      localStorage.removeItem(`done_${id}`);
      setLists(lists.filter((list) => list.id !== id));
    }
  }

  function toggleDone(id) {
    let updatedLists = lists.map((list) =>
      list.id === id ? { ...list, completed: !list.completed } : list
    );
    setLists(updatedLists);
    localStorage.setItem(`done_${id}`, !lists.find((list) => list.id === id).completed);
  }

  function deleteAll() {
    if (window.confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) {
      localStorage.clear();
      setLists([]);
      setCount(0);
      localStorage.setItem("count", 0);
      window.location.reload();
    }
  }

  function markAllDone() {
    let updatedLists = lists.map((list) => {
      localStorage.setItem(`done_${list.id}`, "true"); // Store completion status in localStorage
      return { ...list, completed: true };
    });
  
    setLists(updatedLists);
  }

  return (
    <div className="gradient">
      <div className="pic">
        <img className="logo" src={logo} alt="Logo" />
        <div className="container">
          <div className="title">
            <h2>To-Do List</h2>
          </div>
          <div className="search">
            <form onSubmit={submitPlan}>
              <input name="searchValue" placeholder="Enter a task..." required />
              <button type="submit">Create</button>
            </form>
          </div>
          <div className="list-container">
            {lists.map((list) => (
              <div key={list.id} className="list-panel">
                <p className={list.completed ? "completed" : ""}>{list.name}</p>
                <button onClick={() => toggleDone(list.id)}>
                  {list.completed ? "Undo" : "Mark as Done"}
                </button>
                <button onClick={() => deleteFunction(list.id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="deleteAll">
            <button onClick={() => deleteAll()}>Delete All</button>
            <button className="done-all-btn" onClick={markAllDone}>Done All</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
