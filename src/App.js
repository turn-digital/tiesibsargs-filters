import { useEffect, useState } from "react";
import Card from "./components/card/Card";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [filteredData, setFilteredData] = useState();
  const [checkboxTags, setCheckboxTags] = useState([]);

  useEffect(() => {
    axios("https://tiesibsargs.turn.lv/wp-json/ties-api/v1/resources").then(
      (res) => {
        setData(res.data);
        setFilteredData(res.data);
      }
    );
    axios(
      "https://tiesibsargs.turn.lv/wp-json/ties-api/v1/resources/filters"
    ).then((res) => {
      setFilters(res.data);
    });
  }, []);

  const filterBySearch = (event) => {
    const query = event.target.value;
    let updatedList = [...data];
    updatedList = updatedList.filter((item) => {
      return item.title.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredData(updatedList);
  };

  const checkboxHandler = (event) => {
    if (event.target.checked) {
      setCheckboxTags([...checkboxTags, parseInt(event.target.value)]);
      let checkboxes = [...checkboxTags, parseInt(event.target.value)];
      const updatedList = data.filter((item) => {
        return checkboxes.includes(item.categoryID);
      });
      setFilteredData(updatedList);
    } else {
      setCheckboxTags(
        checkboxTags.filter(
          (filterTag) => filterTag !== parseInt(event.target.value)
        )
      );

      let checkboxes = checkboxTags.filter(
        (filterTag) => filterTag !== parseInt(event.target.value)
      );
      if (checkboxes.length > 0) {
        const updatedList = data.filter((item) => {
          return checkboxes.includes(item.categoryID);
        });
        setFilteredData(updatedList);
      } else {
        setFilteredData(data);
      }
    }
  };

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <div style={{ width: " 50vw", height: " 100vh" }}>
          <input placeholder="Search here" onChange={filterBySearch}></input>
          {filters?.categories.map((category) => {
            return (
              <label htmlFor={category.id} key={category.id}>
                <input
                  type="checkbox"
                  onChange={checkboxHandler}
                  value={category.id}
                  id={category.id}
                  key={category.id}
                />
                <span>{category.category_name}</span>
              </label>
            );
          })}
        </div>
        <div style={{ marginLeft: "50%" }}>
          <Card data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default App;
